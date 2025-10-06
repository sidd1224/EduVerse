// src/firebaseConfig.js - FINAL VERSION WITH PROGRESS FUNCTIONS

import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";

// Your project's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSy...", // Keep your actual API key
  authDomain: "eduverse-c818a.firebaseapp.com",
  projectId: "eduverse-c818a",
  storageBucket: "eduverse-c818a.appspot.com",
  messagingSenderId: "...", // Keep your actual sender ID
  appId: "1:...", // Keep your actual app ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get references to the services
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

// ✅ Connect emulators in development
if (window.location.hostname === "localhost") {
  console.log("🔥 Development mode: Connecting to Firebase emulators...");
  try {
    connectAuthEmulator(auth, "http://127.0.0.1:9091");
    connectFirestoreEmulator(db, "127.0.0.1", 8065);
    connectFunctionsEmulator(functions, "127.0.0.1", 5008);
    console.log("✅ Connected to all emulators");
  } catch (err) {
    console.log("⚠️ Emulator connection warning:", err.message);
  }
}

// ------------------------
// Callable functions
// ------------------------

// Fetch logged-in student data
export const fetchStudent = async () => {
  const getStudent = httpsCallable(functions, "getStudent");
  const result = await getStudent();
  return result.data;
};

// Fetch student progress (lessons + quizzes + vlabs)
export const fetchProgress = async () => {
  const getProgress = httpsCallable(functions, "getProgress");
  const result = await getProgress();
  return result.data;
};

// Mark a lesson as complete
// Mark a lesson as complete
export const completeLesson = async ({ lessonId, title, subject, classId, chapter }) => {
  try {
    const markLesson = httpsCallable(functions, "markLessonComplete");
    const result = await markLesson({ lessonId, title, subject, classId, chapter });
    return result.data; // include for confirmation if needed
  } catch (err) {
    console.error("Error marking lesson complete:", err);
    throw err;
  }
};




// Mark a quiz as complete
export const completeQuiz = async (quizId) => {
  const markQuiz = httpsCallable(functions, "markQuizComplete");
  await markQuiz({ quizId });
};

// Mark a virtual lab as complete
export const completeVlab = async (vlabId) => {
  const markVlab = httpsCallable(functions, "markVlabComplete");
  await markVlab({ vlabId });
};

// Optional: Reset all lessons/quizzes for testing
export const resetProgress = async (lessons, quizzes) => {
  const reset = httpsCallable(functions, "resetProgress");
  await reset({ lessons, quizzes });
};

// Export Firebase services
export { auth, db, functions };
