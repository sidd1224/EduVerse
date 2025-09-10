// Import the Firebase Admin SDK to interact with Firebase services
const admin = require("firebase-admin");
const { FieldValue } = require("firebase-admin/firestore");

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
