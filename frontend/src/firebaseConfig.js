// src/firebaseConfig.js - UPDATED VERSION

import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// Your project's web app's Firebase configuration
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

// ✅ IMPROVED: Better emulator connection with error handling
if (window.location.hostname === "localhost") {
  console.log("🔥 Development mode: Connecting to Firebase emulators...");
  
  try {
    // Check if emulators are already connected to avoid re-connection errors
    if (!auth._delegate?._config?.emulator) {
      connectAuthEmulator(auth, "http://127.0.0.1:9091");
      console.log("✅ Connected to Auth Emulator on port 9091");
    }
    
    if (!db._delegate?._config?.settings?.host?.includes('127.0.0.1')) {
      connectFirestoreEmulator(db, "127.0.0.1", 8065);
      console.log("✅ Connected to Firestore Emulator on port 8065");
    }
    
    if (!functions._delegate?._config?.emulator) {
      connectFunctionsEmulator(functions, "127.0.0.1", 5008);
      console.log("✅ Connected to Functions Emulator on port 5008");
    }
    
  } catch (error) {
    console.log("⚠️ Emulator connection info:", error.message);
    // This is usually fine - it means emulators are already connected
  }
}

// Export the services for use in other parts of the app
export { auth, db, functions };