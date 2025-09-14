const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { FieldValue } = require("firebase-admin/firestore");

admin.initializeApp();
const db = admin.firestore();

// =================================================================
// YOUR ORIGINAL CALLABLE FUNCTIONS (NOW UNIFIED WITH V2 SYNTAX)
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
        return studentDoc.data();
    } catch (error) {
        throw new HttpsError("internal", error.message, error);
    }
});

// =================================================================
// NEW UNIFIED VIRTUAL LAB EXPRESS SERVER
// =================================================================
// =================================================================
// VIRTUAL LAB EXPRESS SERVER (FIXED ROUTES)
// =================================================================

const vlabApp = express();
vlabApp.use(cors({ origin: true }));
vlabApp.set("view engine", "ejs");
vlabApp.set("views", path.join(__dirname, "views"));

// ✅ Explicit route for /api/experiments

// ✅ CHANGE THIS ROUTE DECLARATION
vlabApp.get("/experiments", (req, res) => {
  const classId = req.query.class;
  const dbPath = path.join(__dirname, "db.json");
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read experiments database." });
    let experiments = [];
    try {
      experiments = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).json({ error: "Invalid experiments database format." });
    }
    if (classId) {
      experiments = experiments.filter(exp => exp.experiment_class === classId);
    }
    // Group by subject for frontend
    const experimentsBySubject = {};
    experiments.forEach(exp => {
      if (!experimentsBySubject[exp.subject]) experimentsBySubject[exp.subject] = [];
      experimentsBySubject[exp.subject].push(exp);
    });
    // Get available classes
    const availableClasses = [...new Set(experiments.map(exp => exp.experiment_class))];
    res.json({
      currentClass: classId,
      availableClasses,
      experimentsBySubject
    });
  });
});

// ✅ Route for running an experiment
vlabApp.get("/run/:id", (req, res) => {
  try {
    const experimentId = req.params.id;
    const dbPath = path.join(__dirname, "db.json");
    const experimentsData = JSON.parse(fs.readFileSync(dbPath, "utf8"));
    const experiment = experimentsData.find(
      (exp) => exp.id.toString() === experimentId
    );

    if (!experiment) {
      return res.status(404).send("Experiment not found");
    }

    const sketchPath = `/vlab/laptop/labs/experiments/class_${experiment.experiment_class}/${experiment.subject.toLowerCase()}/${experiment.file_name}.js`;
    res.render("experiment", { sketchPath: sketchPath });
  } catch (error) {
    console.error("Error running experiment:", error);
    res.status(500).send("Error loading experiment.");
  }
});

// ✅ Route for theory page
vlabApp.get("/theory/:id", (req, res) => {
  try {
    const experimentId = req.params.id;
    const dbPath = path.join(__dirname, "db.json");
    const experimentsData = JSON.parse(fs.readFileSync(dbPath, "utf8"));
    const experiment = experimentsData.find(
      (exp) => exp.id.toString() === experimentId
    );

    if (!experiment) {
      return res.status(404).send("Experiment not found");
    }

    res.render("theory", { experiment: experiment });
  } catch (error) {
    console.error("Error fetching theory:", error);
    res.status(500).send("Error loading theory page.");
  }
});

// ✅ Export express app as cloud function
exports.vlab = functions.https.onRequest(vlabApp);
