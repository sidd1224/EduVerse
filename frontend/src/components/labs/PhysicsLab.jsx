// src/components/PhysicsLab.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PhysicsLab = () => {
  const navigate = useNavigate();
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch experiments for Physics, class 8 (change as needed)
    fetch("/api/experiments?class=8")
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text); });
        }
        return response.json();
      })
      .then(data => {
        // Filter for Physics experiments if needed
        const physicsExperiments = data.experimentsBySubject?.Physics || [];
        setExperiments(physicsExperiments);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

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

      {loading && <div>Loading experiments...</div>}
      {error && <div className="text-red-500">Error: {error}</div>}
      {!loading && !error && (
        <ul className="mt-4 space-y-2">
          {experiments.map(exp => (
            <li key={exp.id} className="bg-white p-3 rounded shadow">
              <span className="font-semibold">{exp.title}</span>
              {/* Add more experiment details as needed */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PhysicsLab;
