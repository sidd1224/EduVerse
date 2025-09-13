const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

admin.initializeApp();
const db = admin.firestore();

// =================================================================
// YOUR ORIGINAL EDUVERSE CLOUD FUNCTIONS (UNCHANGED)
// =================================================================

exports.makeAdmin = functions.https.onCall(async (data, context) => {
  if (context.auth.token.admin !== true) {
    return { error: "Only admins can make other admins, sucker!" };
  }
  const user = await admin.auth().getUserByEmail(data.email);
  await admin.auth().setCustomUserClaims(user.uid, { admin: true });
  return { message: `Success! ${data.email} has been made an admin.` };
});

exports.generateToken = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called while authenticated.",
    );
  }
  const uid = context.auth.uid;
  const customToken = await admin.auth().createCustomToken(uid);
  return { token: customToken };
});

exports.createUser = functions.https.onCall(async (data, context) => {
  const { email, password, name, student_class } = data;
  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: name,
    });

    await db.collection("students").doc(userRecord.uid).set({
      name: name,
      email: email,
      student_class: student_class,
    });

    return { uid: userRecord.uid };
  } catch (error) {
    throw new functions.https.HttpsError("internal", error.message);
  }
});

exports.getStudent = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called while authenticated.",
    );
  }

  try {
    const studentDoc = await db.collection("students").doc(context.auth.uid).get();
    if (!studentDoc.exists) {
      throw new functions.https.HttpsError("not-found", "Student not found.");
    }
    return studentDoc.data();
  } catch (error) {
    throw new functions.https.HttpsError("internal", error.message);
  }
});


// =================================================================
// NEW VIRTUAL LAB EXPRESS SERVER
// =================================================================

const vlabApp = express();

// Use CORS to allow the frontend to call this API
vlabApp.use(cors({ origin: true }));

// Set EJS as the view engine
vlabApp.set("view engine", "ejs");
vlabApp.set("views", path.join(__dirname, "views"));

// --- API Endpoint to get experiment data ---
vlabApp.get("/api/experiments", (req, res) => {
  try {
    const selectedClass = req.query.class || "8";
    
    // Read the db.json file
    const dbPath = path.join(__dirname, "db.json");
    const experimentsData = JSON.parse(fs.readFileSync(dbPath, "utf8"));
    
    // Filter experiments for the selected class
    const experimentsBySubject = {
      Physics: experimentsData.filter((exp) => exp.subject === "Physics" && exp.experiment_class.toString() === selectedClass),
      Chemistry: experimentsData.filter((exp) => exp.subject === "Chemistry" && exp.experiment_class.toString() === selectedClass),
      Biology: experimentsData.filter((exp) => exp.subject === "Biology" && exp.experiment_class.toString() === selectedClass),
    };
    
    // Get all unique available classes
    const availableClasses = [...new Set(experimentsData.map((exp) => exp.experiment_class.toString()))].sort();
    
    // Always send a JSON response
    res.json({
      experimentsBySubject,
      currentClass: selectedClass,
      availableClasses,
    });

  } catch (error) {
    console.error("Error fetching experiments:", error);
    // CRITICAL FIX: Always send a JSON error, not an HTML page
    res.status(500).json({ error: "Failed to load experiment data.", details: error.message });
  }
});


// --- Server-side route to run an experiment ---
vlabApp.get("/run/:id", (req, res) => {
  try {
    const experimentId = req.params.id;
    const dbPath = path.join(__dirname, "db.json");
    const experimentsData = JSON.parse(fs.readFileSync(dbPath, "utf8"));
    const experiment = experimentsData.find((exp) => exp.id.toString() === experimentId);

    if (!experiment) {
      return res.status(404).send("Experiment not found");
    }

    // Construct the correct public path to the p5.js sketch file
    // Firebase Hosting serves the 'public' folder at the root.
    const sketchPath = `/vlab/laptop/labs/experiments/class_${experiment.experiment_class}/${experiment.subject.toLowerCase()}/${experiment.file_name}.js`;
    
    res.render("experiment", { sketchPath: sketchPath });
  
  } catch (error) {
      console.error("Error running experiment:", error);
      res.status(500).send("Error loading experiment.");
  }
});

// --- Server-side route to view an experiment's theory ---
vlabApp.get("/theory/:id", (req, res) => {
    try {
        const experimentId = req.params.id;
        const dbPath = path.join(__dirname, "db.json");
        const experimentsData = JSON.parse(fs.readFileSync(dbPath, "utf8"));
        const experiment = experimentsData.find((exp) => exp.id.toString() === experimentId);

        if (!experiment) {
            return res.status(404).send("Experiment not found");
        }
        
        res.render("theory", { experiment: experiment });

    } catch (error) {
        console.error("Error fetching theory:", error);
        res.status(500).send("Error loading theory page.");
    }
});


// Export the vlab Express app as a Cloud Function
exports.vlab = functions.https.onRequest(vlabApp);

