// src/components/VirtualLab.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const VirtualLab = () => {
  const navigate = useNavigate();

  const handleReturn = () => {
    navigate("/Dashboard"); // back to dashboard
  };

  return (
    <div className="min-h-screen bg-purple-100 py-10">
      {/* 🔹 Welcome Section */}
      <div className="bg-white p-8 shadow-lg text-center mb-8 w-full rounded-none relative">
        <button
          onClick={handleReturn}
          className="absolute top-4 right-4 bg-white/40 backdrop-blur-sm px-3 py-1 rounded-lg shadow text-sm font-medium text-purple-700 hover:bg-white/70 transition flex items-center space-x-1"
        >
          <span>🏠</span>
          <span>Back</span>
        </button>

        <h1 className="text-3xl font-bold text-purple-700 mb-4">🔬 Virtual Lab</h1>
        <p className="text-gray-600">
          Welcome to the Virtual Lab! Here you can perform interactive science experiments.
        </p>
      </div>

      {/* 🔹 Lessons Section */}
      <div className="bg-white p-8 shadow-lg w-full rounded-none">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Biology */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300">
            <img
              src="https://b3801007.smushcdn.com/3801007/wp-content/uploads/2022/05/DNA-structure-2048x1152.jpg?lossy=2&strip=1&webp=1"
              alt="Biology"
              className="w-32 h-32 object-cover rounded-xl mb-4"
            />
            <p className="font-bold text-purple-700 text-lg mb-2">Biology</p>
            <p className="text-gray-500 text-sm text-center mb-3">
              DNA structure and functions
            </p>
            <button
              onClick={() => navigate("/VirtualLab/Biology")}
              className="bg-purple-600 text-white px-4 py-2 rounded"
            >
              View
            </button>
          </div>

          {/* Chemistry */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300">
            <img
              src="https://wallpapers.com/images/high/chemistry-pictures-4qvzw3gjed2dk7me.webp"
              alt="Chemistry"
              className="w-32 h-32 object-cover rounded-xl mb-4"
            />
            <p className="font-bold text-purple-700 text-lg mb-2">Chemistry</p>
            <p className="text-gray-500 text-sm text-center mb-3">
              Introduction to Molecular Chemistry
            </p>
            <button
              onClick={() => navigate("/VirtualLab/Chemistry")}
              className="bg-purple-600 text-white px-4 py-2 rounded"
            >
              View
            </button>
          </div>

          {/* Physics */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300">
            <img
              src="https://universidadeuropea.com/resources/media/images/ramas-fisica-800x450.width-1200.format-webp.webp"
              alt="Physics"
              className="w-32 h-32 object-cover rounded-xl mb-4"
            />
            <p className="font-bold text-purple-700 text-lg mb-2">Physics</p>
            <p className="text-gray-500 text-sm text-center mb-3">
              Fundamentals of Mechanics and Motion
            </p>
            <button
              onClick={() => navigate("/VirtualLab/Physics")}
              className="bg-purple-600 text-white px-4 py-2 rounded"
            >
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualLab;
