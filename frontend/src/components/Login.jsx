import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { signInWithEmailAndPassword } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { auth, functions } from "../firebaseConfig";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      console.log("Attempting login:", email);

      // ✅ Step 1: Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User signed in:", user.uid);

      // ✅ Step 2: Fetch student profile
      try {
        const getStudent = httpsCallable(functions, "getStudent");
        const studentResult = await getStudent({ uid: user.uid });
        const studentData = studentResult.data;

        // Save to localStorage
        localStorage.setItem(
          "student",
          JSON.stringify({
            uid: user.uid,
            name: studentData.name,
            email: studentData.email,
            student_class: studentData.student_class,
            ...studentData
          })
        );

        console.log("Student data loaded:", studentData);
        navigate("/dashboard");

      } catch (studentError) {
        console.error("Error fetching student data:", studentError);

        // Fallback: redirect to profile setup if no doc
        localStorage.setItem(
          "student",
          JSON.stringify({
            uid: user.uid,
            name: user.displayName || "Student",
            email: user.email,
            student_class: null
          })
        );

        // 👇 Instead of dashboard, send to setup
        navigate("/dashboard/lessons");
      }

    } catch (error) {
      console.error("Login error:", error);

      let errorMessage = "❌ Login failed. Please try again.";
      if (error.code === "auth/user-not-found") {
        errorMessage = "❌ User not found! Please register first.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "❌ Incorrect password!";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "❌ Invalid email!";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "❌ Too many failed attempts. Try later.";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-purple-400 overflow-hidden">
        <svg
          className="absolute top-20 left-0 w-full opacity-30 animate-[moveWave_12s_linear_infinite]"
          viewBox="0 0 1440 320"
        >
          <path
            fill="white"
            d="M0,96L60,128C120,160,240,224,360,218.7C480,213,600,139,720,112C840,85,960,107,1080,133.3C1200,160,1320,192,1380,208L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
          />
        </svg>
      </div>

      {/* Card */}
      <div className="relative z-10 flex w-full max-w-6xl min-h-screen md:min-h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left image */}
        <div
          className="hidden md:flex md:w-1/2 bg-cover bg-center relative"
          style={{
            backgroundImage:
              "url('https://media.istockphoto.com/id/1164543414/vector/man-with-laptop-studying-or-working-concept-table-with-books-lamp-coffee-cup-vector.jpg?s=1024x1024&w=is&k=20&c=fQzSJ7Ii52NEZ81M6F5aQBFqcCoqZW8KWaYnR5ei3RM=')",
          }}
        >
          <div className="absolute inset-0 bg-purple-900/70" />
          <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome back!</h1>
            <p className="text-lg max-w-sm">Sign in to access your account.</p>
          </div>
        </div>

        {/* Right login form */}
        <motion.div
          initial={{ x: 500, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 60, damping: 20 }}
          className="flex w-full md:w-1/2 justify-center items-center bg-white"
        >
          <div className="w-full max-w-md p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Sign In</h2>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            <form className="space-y-4" onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email address"
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="form-checkbox text-purple-600" />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-purple-600 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg transition-all duration-200 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-500 to-purple-700 hover:opacity-90"
                } text-white`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <p className="text-sm mt-6 text-center text-gray-600">
              New here?{" "}
              <Link to="/register" className="text-purple-600 hover:underline">
                Create an Account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
