// src/components/BiologyLab.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API_BASE from "../../api";

const BiologyLab = () => {
  const navigate = useNavigate();
  const { classId } = useParams(); // dynamic class from route param
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!classId) return;

    fetch(`${API_BASE}/api/experiments/Biology/${classId}`)
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
        return response.json();
      })
      .then((data) => {
        setExperiments(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [classId]);

  return (
    <div className="min-h-screen bg-blue-100 relative flex flex-col items-center justify-center">
      <button
        onClick={() => navigate("/dashboard/virtuallab")}
        className="absolute top-4 right-4 bg-white/40 backdrop-blur-sm px-3 py-1 rounded-lg shadow text-sm font-medium text-blue-700 hover:bg-white/70 transition flex items-center space-x-1"
      >
        <span>⬅️</span>
        <span>Back</span>
      </button>

      <h1 className="text-3xl font-bold text-blue-700 mb-4">🧬 Biology Lab</h1>
      <p className="text-gray-600 mb-6">
        Showing experiments for <b>Biology, Class {classId}</b>
      </p>

      {loading && <div>Loading experiments...</div>}
      {error && <div className="text-red-500">Error: {error}</div>}
      {!loading && !error && (
        <ul className="mt-4 space-y-2">
          {experiments.map((exp) => (
            <li key={exp.id} className="bg-white p-3 rounded shadow">
              <span className="font-semibold">{exp.title}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BiologyLab;
