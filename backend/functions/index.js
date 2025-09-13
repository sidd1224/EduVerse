// Import the Firebase Admin SDK to interact with Firebase services
const admin = require("firebase-admin");
const { FieldValue } = require("firebase-admin/firestore");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const path = require("path");
const ejs = require("ejs");
const experimentsData = require("./db.json");

// Import v2 HTTPS utilities
const { onCall, HttpsError } = require("firebase-functions/v2/https");

// Import v1 Auth trigger (since v2/identity not available in 6.4.0)
const { user } = require("firebase-functions/v1/auth");

// Initialize the Admin SDK. This must be done once.
admin.initializeApp();

/**
 * A trigger function that runs whenever a new user is created in Firebase Auth.
 * (Using v1 Auth trigger for compatibility)
 */
exports.createUserProfile = user().onCreate(async (userRecord) => {
  console.log(`Creating profile for new user: ${userRecord.uid}`);

  return admin.firestore().collection("users").doc(userRecord.uid).set({
    email: userRecord.email,
    name: userRecord.displayName || "New User",
    role: "student",
    createdAt: FieldValue.serverTimestamp(),
  });
});

/**
 * A callable function that allows an authenticated user to fetch a list of all courses.
 */
exports.getCourses = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "You must be logged in.");
  }

  const coursesSnapshot = await admin.firestore().collection("courses").get();

  const courses = [];
  coursesSnapshot.forEach((doc) => {
    courses.push({
      id: doc.id,
      ...doc.data(),
    });
  });

  return { courses };
});

/**
 * A callable function that fetches all lessons for a specific course ID.
 */
exports.getLessonsForCourse = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "You must be logged in.");
  }

  const courseId = request.data.courseId;
  if (!courseId) {
    throw new HttpsError("invalid-argument", "You must provide a courseId.");
  }

  const lessonsSnapshot = await admin
    .firestore()
    .collection("lessons")
    .where("courseId", "==", courseId)
    .orderBy("order")
    .get();

  const lessons = [];
  lessonsSnapshot.forEach((doc) => {
    lessons.push({
      id: doc.id,
      ...doc.data(),
    });
  });

  return { lessons };
});

/**
 * A callable function that receives an array of offline actions and commits them
 * to the database in a single, safe transaction.
 */
exports.syncOfflineData = onCall(async (request) => {
  // 1. Check for authentication
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "You must be logged in.");
  }

  // 2. Get the array of actions from the client
  const actions = request.data.actions;
  if (!Array.isArray(actions) || actions.length === 0) {
    throw new HttpsError(
      "invalid-argument",
      "You must provide a valid array of actions."
    );
  }

  const userId = request.auth.uid;
  const db = admin.firestore();

  // 3. Use a Batched Write to ensure all operations succeed or none do.
  const batch = db.batch();

  console.log(`Starting sync for user ${userId} with ${actions.length} actions.`);

  // 4. Loop through each action from the client
  actions.forEach((action) => {
    if (action.type === "QUIZ_SUBMIT") {
      const newSubmissionRef = db.collection("quizSubmissions").doc();
      batch.set(newSubmissionRef, {
        ...action.payload,
        userId: userId,
        submittedAt:FieldValue.serverTimestamp(),
      });
    } else if (action.type === "LAB_PROGRESS") {
      const newLabProgressRef = db.collection("virtualLabProgress").doc();
      batch.set(newLabProgressRef, {
        ...action.payload,
        userId: userId,
        completedAt: FieldValue.serverTimestamp(),
      });
    }
  });

  // 5. Commit all the operations in the batch to the database
  await batch.commit();

  console.log(`Successfully synced ${actions.length} actions for user ${userId}.`);

  // 6. Return a success message
  return { success: true, message: "Data synced successfully!" };
});

// --- NEW VIRTUAL LAB SERVER ---
const vlabApp = express();

// Set EJS as the view engine
vlabApp.set("view engine", "ejs");
vlabApp.set("views", path.join(__dirname, "views"));

// --- API Route ---
// This provides the data for the React dashboard component.
vlabApp.get("/api/experiments", (req, res) => {
    const selectedClass = req.query.class || "8";
    const experimentsBySubject = {
        "Physics": experimentsData.filter(e => e.subject === "Physics" && e.experiment_class === selectedClass),
        "Chemistry": experimentsData.filter(e => e.subject === "Chemistry" && e.experiment_class === selectedClass),
        "Biology": experimentsData.filter(e => e.subject === "Biology" && e.experiment_class === selectedClass),
    };
    const classes = [...new Set(experimentsData.map(e => e.experiment_class))].sort();

    res.json({
        experimentsBySubject: experimentsBySubject,
        currentClass: selectedClass,
        availableClasses: classes,
    });
});

// --- Page Rendering Routes ---

// Route to run the p5.js experiment
vlabApp.get("/run/:id", (req, res) => {
    const experiment = experimentsData.find(e => e.id === parseInt(req.params.id));
    if (!experiment) {
        return res.status(404).send("Experiment not found");
    }
    // CORRECTED PATH: This path is now relative to the public root, which Firebase Hosting understands.
    const sketchPath = `/vlab/laptop/labs/experiments/class_${experiment.experiment_class}/${experiment.subject.toLowerCase()}/${experiment.sketch_name}.js`;
    res.render("experiment", { sketchPath: sketchPath });
});

// Route to show the theory page
vlabApp.get("/theory/:id", (req, res) => {
    const experiment = experimentsData.find(e => e.id === parseInt(req.params.id));
    if (!experiment) {
        return res.status(404).send("Experiment not found");
    }
    res.render("theory", { experiment: experiment });
});

// Export the vlab express app as a Cloud Function
exports.vlab = functions.https.onRequest(vlabApp);

