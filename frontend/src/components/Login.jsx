import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    const students = JSON.parse(localStorage.getItem("students")) || [];
    const student = students.find(
      (s) => s.email === email && s.password === password
    );

    if (student) {
      localStorage.setItem("student", JSON.stringify(student));
      alert("✅ Login successful!");
      navigate("/dashboard");
    } else {
      alert("❌ User not found! Please register first.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* BACKGROUND */}
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

      {/* MAIN CARD */}
      <div className="relative z-10 flex w-full max-w-6xl min-h-screen md:min-h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* LEFT IMAGE */}
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
            <p className="text-lg max-w-sm">
              You can sign in to access your existing account.
            </p>
          </div>
        </div>

        {/* RIGHT LOGIN FORM WITH SLIDE ANIMATION */}
        <motion.div
          initial={{ x: 500, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 60, damping: 20 }}
          className="flex w-full md:w-1/2 justify-center items-center bg-white"
        >
          <div className="w-full max-w-md p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Sign In</h2>
            <form className="space-y-4" onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Username or email"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="password"
                placeholder="Password"
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
                className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white py-3 rounded-lg hover:opacity-90 transition"
              >
                Sign In
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
