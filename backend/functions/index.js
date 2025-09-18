const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const { onCall, HttpsError } = require("firebase-functions/v2/https");

admin.initializeApp();
const db = admin.firestore();

// =================================================================
// CALLABLE FUNCTIONS
// =================================================================
exports.makeAdmin = onCall(async (request) => {
    if (request.auth?.token.admin !== true) {
        throw new HttpsError("permission-denied", "Only admins can make other admins.");
    }
    const user = await admin.auth().getUserByEmail(request.data.email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    return { message: `Success! ${request.data.email} has been made an admin.` };
});

exports.generateToken = onCall(async (request) => {
    if (!request.auth) {
        throw new HttpsError("unauthenticated", "The function must be called while authenticated.");
    }
    const uid = request.auth.uid;
    const customToken = await admin.auth().createCustomToken(uid);
    return { token: customToken };
});

exports.createUser = onCall(async (request) => {
    const { email, password, name, student_class } = request.data;
    try {
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: name,
        });

        await db.collection("students").doc(userRecord.uid).set({
            name,
            email,
            student_class: parseInt(student_class), // store as number
        });

        return { uid: userRecord.uid };
    } catch (error) {
        throw new HttpsError("internal", error.message, error);
    }
});
exports.getStudent = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "The function must be called while authenticated.");
  }

  try {
    const studentDoc = await db.collection("students").doc(request.auth.uid).get();
    if (!studentDoc.exists) {
      throw new HttpsError("not-found", "Student not found.");
    }

    const data = studentDoc.data();

    // ✅ Safe parse
    let studentClass = parseInt(data.student_class);
    if (isNaN(studentClass)) {
      studentClass = null; // or 0 if you prefer default
    }

    return {
      uid: request.auth.uid,
      ...data,
      student_class: studentClass,
    };
  } catch (error) {
    console.error("❌ getStudent failed:", error);
    throw new HttpsError("internal", error.message || "Unknown error");
  }
});


// =================================================================
// EXPRESS SERVER (LESSONS + VLAB)
// =================================================================
const app = express();
app.use(cors({ origin: true }));
app.set("view engine", "ejs");

// ✅ Set the views directory
app.set("views", path.join(__dirname, "views"));

// Enable CORS if needed
app.use(cors({ origin: true }));



// Helper to authenticate and fetch student
const getUserStudentData = async (req) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) throw new Error("No authentication token provided");

    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    const studentDoc = await db.collection("students").doc(uid).get();
    if (!studentDoc.exists) throw new Error("Student profile not found");

    return {
        uid,
        ...studentDoc.data(),
        student_class: parseInt(studentDoc.data().student_class),
    };
};

const getAvailableClasses = () => [8, 9, 10, 11, 12];

// =================================================================
// LESSON ROUTES
// =================================================================
app.get("/lessons", async (req, res) => {
    try {
        let classes = [];

        try {
            const studentData = await getUserStudentData(req);
            const userClass = studentData.student_class;

            classes = [userClass];
            if (userClass > 8) classes.unshift(userClass - 1);
            if (userClass < 12) classes.push(userClass + 1);
        } catch {
            classes = getAvailableClasses(); // guest fallback
        }

        res.json({ classes });
    } catch (error) {
        console.error("Error fetching lessons:", error);
        res.status(500).json({ error: "Failed to fetch lessons" });
    }
});

app.get("/lessons/:class", async (req, res) => {
    try {
        const requestedClass = parseInt(req.params.class);
        let hasAccess = true;

        try {
            const studentData = await getUserStudentData(req);
            hasAccess = Math.abs(studentData.student_class - requestedClass) <= 1;
        } catch {
            hasAccess = true; // guest access
        }

        if (!hasAccess) {
            return res.status(403).json({
                error: "Access denied. You can only access your class and adjacent classes.",
            });
        }

        res.json({ class: requestedClass, subjects: ["Science", "SocialScience"] });
    } catch (error) {
        console.error("Error fetching class subjects:", error);
        res.status(500).json({ error: "Failed to fetch subjects" });
    }
});

app.get("/lessons/:class/:subject", async (req, res) => {
    const classId = parseInt(req.params.class);
    const subject = req.params.subject;
    const folderClass = `Class${classId}`;

    try {
        let hasAccess = true;
        try {
            const studentData = await getUserStudentData(req);
            hasAccess = Math.abs(studentData.student_class - classId) <= 1;
        } catch {
            hasAccess = true;
        }

        if (!hasAccess) return res.status(403).json({ error: "Access denied" });

        const resourcePath = path.join(__dirname, "resources", "resources", "uploads", folderClass, subject);

        const notesPath = path.join(resourcePath, "Notes");
        const chapters = fs.existsSync(notesPath)
            ? fs.readdirSync(notesPath).filter((item) =>
                  fs.statSync(path.join(notesPath, item)).isDirectory()
              )
            : [];

        const textbookPath = path.join(resourcePath, "Textbook");
        const textbooks = fs.existsSync(textbookPath)
            ? fs.readdirSync(textbookPath).filter((file) => file.toLowerCase().endsWith(".pdf"))
            : [];

        res.json({ class: classId, subject, chapters, textbooks });
    } catch (error) {
        console.error("Error reading lesson structure:", error);
        res.status(500).json({ error: "Failed to read lesson structure" });
    }
});

// ✅ UPDATED: Fetch experiments from Firestore instead of JSON
app.get("/api/experiments", async (req, res) => {
    try {
        const classId = req.query.class;
        
        console.log(`Fetching experiments for class: ${classId || 'all'}`);
        
        // Fetch experiments from Firestore
        let query = db.collection('experiments');
        
        // Filter by class if provided (handle both "8" and "Class8" formats)
        if (classId) {
            // Try both formats: "8" and "Class8"
            const classVariations = [
                classId,
                classId.startsWith('Class') ? classId.replace('Class', '') : `Class${classId}`,
                classId.startsWith('Class') ? classId.replace('Class', '') : classId
            ];
            
            query = query.where('class', 'in', classVariations)
                    .limit(50); // Add reasonable limit
        }
        
        const snapshot = await query.get();
        
        if (snapshot.empty) {
            console.log('No experiments found in Firestore');
            return res.json({
                currentClass: classId,
                availableClasses: [],
                experimentsBySubject: {}
            });
        }
        
        // Convert to array
        const experiments = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            experiments.push({
                id: doc.id,
                ...data,
                // Ensure consistent field names for compatibility
                experiment_class: data.class || data.experiment_class
            });
        });
        
        console.log(`Found ${experiments.length} experiments`);
        
        // Group by subject for frontend
        const experimentsBySubject = {};
        experiments.forEach(exp => {
            if (!experimentsBySubject[exp.subject]) {
                experimentsBySubject[exp.subject] = [];
            }
            experimentsBySubject[exp.subject].push(exp);
        });
        
        // Get available classes from all experiments
        const allExperimentsSnapshot = await db.collection('experiments').get();
        const availableClasses = [...new Set(
            allExperimentsSnapshot.docs.map(doc => {
                const data = doc.data();
                return data.class || data.experiment_class;
            }).filter(Boolean)
        )].sort();
        
        console.log('Available classes:', availableClasses);
        console.log('Experiments by subject:', Object.keys(experimentsBySubject));
        
        res.json({
            currentClass: classId,
            availableClasses,
            experimentsBySubject
        });
        
    } catch (error) {
        console.error("Error fetching experiments from Firestore:", error);
        res.status(500).json({ error: "Failed to fetch experiments from database." });
    }
});
// ✅ New route: fetch experiments by subject and class
app.get("/api/experiments/:subject/:classId", async (req, res) => {
  try {
    const { subject, classId } = req.params;
    console.log(`Fetching experiments for subject: ${subject}, class: ${classId}`);

    const snapshot = await db.collection("experiments")
      .where("subject", "==", subject)
      .where("class", "==", classId) // your Firestore field must be consistent ("class" or "experiment_class")
      .get();

    if (snapshot.empty) {
      console.log("No experiments found for this subject & class");
      return res.json([]);
    }

    const experiments = [];
    snapshot.forEach((doc) => {
      experiments.push({
        id: doc.id,
        ...doc.data(),
        experiment_class: doc.data().class || doc.data().experiment_class,
      });
    });

    res.json(experiments);
  } catch (error) {
    console.error("Error fetching subject experiments:", error);
    res.status(500).json({ error: "Failed to fetch experiments." });
  }
});// ✅ UPDATED: Run experiment route (returns Hosting-relative path)
app.get("/api/run/:id", async (req, res) => {
  try {
    const experimentId = req.params.id;

    console.log(`Loading experiment for run: ${experimentId}`);

    const doc = await db.collection("experiments").doc(experimentId).get();

    if (!doc.exists) {
      console.log(`Experiment not found: ${experimentId}`);
      return res.status(404).send("Experiment not found");
    }

    const experiment = doc.data();
    console.log(`Found experiment: ${experiment.title || experimentId}`);

    // ✅ Always return Hosting-relative path
    const experimentClass = experiment.class || experiment.experiment_class;
    const sketchPath = `/labs/experiments/class_${experimentClass}/${experiment.subject.toLowerCase()}/${experiment.sketch_name}.js`;

    // Force JSON (so frontend always works with fetch)
    res.json({
      success: true,
      experiment: experiment,
      sketchPath: sketchPath, // relative, frontend adds Hosting_BASE
      message: "Experiment loaded successfully",
    });
  } catch (error) {
    console.error("Error running experiment:", error);
    res.status(500).json({ success: false, message: "Error loading experiment." });
  }
});

// ✅ Always returns JSON
app.get("/api/theory/:id", async (req, res) => {
  try {
    const experimentId = req.params.id;
    console.log(`Loading theory for experiment: ${experimentId}`);

    const doc = await db.collection("experiments").doc(experimentId).get();

    if (!doc.exists) {
      console.log(`Experiment not found: ${experimentId}`);
      return res.status(404).json({
        success: false,
        message: "Experiment not found",
      });
    }

    const experiment = { id: doc.id, ...doc.data() };

    console.log(`Found experiment theory: ${experiment.title || experimentId}`);

    return res.json({
      success: true,
      experiment,
      theory: experiment.theory,
      materials_required: experiment.materials_required,
      procedure: experiment.procedure,
      title: experiment.title,
    });
  } catch (error) {
    console.error("Error fetching theory:", error);
    res.status(500).json({
      success: false,
      message: "Error loading theory page.",
      error: error.message,
    });
  }
});


// Helper to normalize subject names
const normalizeSubject = (subject) => {
  if (!subject) return subject;
  if (subject.toLowerCase() === "science") return "Science";
  if (subject.toLowerCase() === "socialscience") return "SocialScience";
  return subject; // fallback if new subject added later
};

// Get subject structure
app.get("/lessons/:class/:subject", async (req, res) => {
  const classId = parseInt(req.params.class);
  const subject = normalizeSubject(req.params.subject);
  const folderClass = `Class${classId}`;

  try {
    let hasAccess = true;
    try {
      const studentData = await getUserStudentData(req);
      hasAccess = Math.abs(studentData.student_class - classId) <= 1;
    } catch {
      hasAccess = true;
    }

    if (!hasAccess) return res.status(403).json({ error: "Access denied" });

    const resourcePath = path.join(
      __dirname,
      "resources",
      "resources",
      "uploads",
      folderClass,
      subject
    );

    const notesPath = path.join(resourcePath, "Notes");
    const chapters = fs.existsSync(notesPath)
      ? fs.readdirSync(notesPath).filter((item) =>
          fs.statSync(path.join(notesPath, item)).isDirectory()
        )
      : [];

    const textbookPath = path.join(resourcePath, "Textbook");
    const textbooks = fs.existsSync(textbookPath)
      ? fs.readdirSync(textbookPath).filter((file) =>
          file.toLowerCase().endsWith(".pdf")
        )
      : [];

    res.json({ class: classId, subject, chapters, textbooks });
  } catch (error) {
    console.error("Error reading lesson structure:", error);
    res.status(500).json({ error: "Failed to read lesson structure" });
  }
});

// Get all files in a chapter
app.get("/lessons/:class/:subject/chapter/:chapter", async (req, res) => {
  const classId = parseInt(req.params.class);
  const subject = normalizeSubject(req.params.subject);
  const chapter = req.params.chapter;
  const folderClass = `Class${classId}`;

  try {
    let hasAccess = true;
    try {
      const studentData = await getUserStudentData(req);
      hasAccess = Math.abs(studentData.student_class - classId) <= 1;
    } catch {
      hasAccess = true;
    }
    if (!hasAccess) return res.status(403).json({ error: "Access denied" });

    const chapterPath = path.join(
      __dirname,
      "resources",
      "resources",
      "uploads",
      folderClass,
      subject,
      "Notes",
      chapter
    );

    const files = fs.existsSync(chapterPath)
      ? fs.readdirSync(chapterPath).filter((file) =>
          file.toLowerCase().endsWith(".pdf")
        )
      : [];

    res.json({ class: classId, subject, chapter, files });
  } catch (error) {
    console.error("Error reading chapter files:", error);
    res.status(500).json({ error: "Failed to fetch chapter files" });
  }
});

// Serve a specific note file
app.get("/lessons/:class/:subject/notes/:chapter/:filename", async (req, res) => {
  const { class: classId, subject, chapter, filename } = req.params;
  const folderClass = `Class${classId}`;
  const normalizedSubject = normalizeSubject(subject);

  try {
    const filePath = path.join(
      __dirname,
      "resources",
      "resources",
      "uploads",
      folderClass,
      normalizedSubject,
      "Notes",
      chapter,
      filename
    );
    if (!fs.existsSync(filePath)) return res.status(404).send("File not found");
    res.sendFile(filePath);
  } catch (error) {
    console.error("Error serving note file:", error);
    res.status(500).send("Error serving note file");
  }
});

// Serve a specific textbook file
app.get("/lessons/:class/:subject/textbook/:filename", async (req, res) => {
  const { class: classId, subject, filename } = req.params;
  const folderClass = `Class${classId}`;
  const normalizedSubject = normalizeSubject(subject);

  try {
    const filePath = path.join(
      __dirname,
      "resources",
      "resources",
      "uploads",
      folderClass,
      normalizedSubject,
      "Textbook",
      filename
    );
    if (!fs.existsSync(filePath)) return res.status(404).send("File not found");
    res.sendFile(filePath);
  } catch (error) {
    console.error("Error serving textbook file:", error);
    res.status(500).send("Error serving textbook file");
  }
});

app.get("/api/test", (req, res) => {
  res.send("Test OK");
});

exports.vlab = functions.https.onRequest(app);