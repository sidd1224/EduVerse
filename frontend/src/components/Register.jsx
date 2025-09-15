import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);

    const name = e.target[0].value;
    const email = e.target[1].value;
    const studentClass = e.target[2].value;
    const password = e.target[3].value;
    const confirmPassword = e.target[4].value;

    if (password !== confirmPassword) {
      alert("❌ Passwords do not match!");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      setLoading(false);

      let students = JSON.parse(localStorage.getItem("students")) || [];

      // check duplicate email
      if (students.find((s) => s.email === email)) {
        alert("⚠️ Email already exists! Please log in.");
        return;
      }

      const newStudent = { name, email, password, class: studentClass };
      students.push(newStudent);

      localStorage.setItem("students", JSON.stringify(students));

      alert("🎉 Account Created!");
      navigate("/login");
    }, 1500);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* PURPLE BACKGROUND WITH WAVES */}
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
        {/* LEFT IMAGE SECTION */}
        <div
          className="hidden md:flex md:w-1/2 bg-cover bg-center relative"
          style={{
            backgroundImage:
              "url('https://previews.123rf.com/images/m_woodhouse/m_woodhouse1908/m_woodhouse190800119/129345233-electronic-online-library-poster-with-computer-and-books-people-character-reading-or-student.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-purple-900/70" />
          <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white text-center">
            <h1 className="text-4xl font-bold mb-4">Join Us Today!</h1>
            <p className="text-lg max-w-sm">
              Create your account and start your journey with our community.
            </p>
          </div>
        </div>

        {/* RIGHT REGISTER FORM */}
        <motion.div
          initial={{ x: 500, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 60, damping: 20 }}
          className="flex w-full md:w-1/2 justify-center items-center bg-white"
        >
          <div className="w-full max-w-md p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Create Account
            </h2>
            <form onSubmit={handleRegister} className="space-y-4">
              <input
                type="text"
                placeholder="Full name"
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="email"
                placeholder="Email address"
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                placeholder="Enter your class"
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="password"
                placeholder="Confirm password"
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white py-3 rounded-lg hover:opacity-90 transition"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>
            </form>

            <p className="text-sm mt-6 text-center text-gray-600">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-purple-600 hover:underline cursor-pointer"
              >
                Sign In
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
