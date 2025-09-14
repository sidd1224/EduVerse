// src/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// Your project's web app's Firebase configuration
// Find this in your Firebase project settings
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "eduverse-c818a.firebaseapp.com",
  projectId: "eduverse-c818a",
  storageBucket: "eduverse-c818a.appspot.com",
  messagingSenderId: "...",
  appId: "1:...",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get references to the services
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

// This is the crucial part:
// If the app is running in a local development environment (e.g., Vite's dev server),
// connect to the local emulators.
if (window.location.hostname === "localhost") {
  console.log("Development mode: Connecting to local Firebase emulators.");

  // Point the SDK to the Auth Emulator
  connectAuthEmulator(auth, "http://127.0.0.1:9091");

  // Point the SDK to the Firestore Emulator
  connectFirestoreEmulator(db, "127.0.0.1", 8065);

  // Point the SDK to the Functions Emulator
  connectFunctionsEmulator(functions, "127.0.0.1", 5008);
}

// Export the services for use in other parts of the app
export { auth, db, functions };