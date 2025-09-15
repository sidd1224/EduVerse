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




// =================================================================
// VIRTUAL LAB EXPRESS SERVER
// =================================================================

const app = express();
app.use(cors({ origin: true }));

// ✅ Route to fetch all experiments
app.get("/api/experiments", async (req, res) => {
  try {
    const snapshot = await db.collection("experiments").get();
    const experiments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(experiments);
  } catch (error) {
    console.error("Error fetching experiments:", error);
    res.status(500).json({ error: "Failed to fetch experiments." });
  }
});

// ✅ Route to fetch experiments by subject
app.get("/api/experiments/:subject", async (req, res) => {
  try {
    const subject = req.params.subject;
    const snapshot = await db.collection("experiments").where("subject", "==", subject).get();

    if (snapshot.empty) {
      return res.status(404).json({ error:" No experiments found for subject: ${subject} "});
    }

    const experiments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(experiments);
  } catch (error) {
    console.error("Error fetching experiments for subject ${req.params.subject}:", error);
    res.status(500).json({ error: "Failed to fetch experiments." });
  }
});

// ✅ Route to fetch a specific experiment by ID
app.get("/api/experiment/:id", async (req, res) => {
  try {
    const experimentId = req.params.id;
    const snapshot = await db.collection("experiments").doc(experimentId).get();

    if (!snapshot.exists) {
      return res.status(404).json({ error: "Experiment not found" });
    }

    const experiment = snapshot.data();
    res.json({ id: snapshot.id, ...experiment });
  } catch (error) {
    console.error("Error fetching experiment with ID ${req.params.id}:", error);
    res.status(500).json({ error: "Failed to fetch experiment." });
  }
});

// ✅ Export the Express app as a Cloud Function
exports.vlab = functions.https.onRequest(app);