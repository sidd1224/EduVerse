// src/components/PhysicsLab.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const PhysicsLab = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-blue-100 relative flex flex-col items-center justify-center">
      {/* 🔹 Back button (top-left corner, small transparent box) */}
      <button
        onClick={() => navigate("/VirtualLab")}
        className="absolute top-4 right-4 bg-white/40 backdrop-blur-sm px-3 py-1 rounded-lg shadow text-sm font-medium text-blue-700 hover:bg-white/70 transition flex items-center space-x-1"
      >
        <span>⬅️</span>
        <span>Back</span>
      </button>

      {/* Main Physics Lab Content */}
      <h1 className="text-3xl font-bold text-blue-700 mb-4">⚛️ Physics Lab</h1>
      <p className="text-gray-600 mb-6">
        Here you can explore experiments in <b>Mechanics and Motion</b>!
      </p>
    </div>
  );
};

export default PhysicsLab;
