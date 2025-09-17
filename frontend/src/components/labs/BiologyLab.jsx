// src/components/labs/BiologyLab.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE } from "../../api";
import ExperimentRunner from "../ExperimentRunner";

const BiologyLab = () => {
  const navigate = useNavigate();
  const { classId } = useParams();
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSketch, setCurrentSketch] = useState(null);

  // Fetch experiments from backend
  useEffect(() => {
    if (!classId) return;

    fetch(`${API_BASE}/api/experiments/Biology/${classId}`)
      .then((res) => {
        if (!res.ok) return res.text().then((text) => { throw new Error(text); });
        return res.json();
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
const handleRun = (exp) => {
  const sketchPath =
    `/labs/experiments/class_${exp.class}/biology/${exp.sketch_name}.js`;

  navigate("/experiment", { state: { sketchPath } });
};



  const handleTheory = (id) => {
    fetch(`${API_BASE}/api/theory/${id}`)
      .then((res) => res.json())
      .then((data) => {
        alert(`🧪 ${data.experiment.title}\n\n📖 Theory:\n${data.experiment.theory}`);
      })
      .catch((err) => {
        console.error("Theory fetch failed:", err);
        alert("Failed to fetch theory.");
      });
  };

  return (
    <div className="min-h-screen bg-blue-100 relative flex flex-col items-center justify-center px-4 py-10">
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

      {!loading && !error && experiments.length === 0 && (
        <div className="text-gray-500">No experiments found for this class.</div>
      )}

      {!loading && !error && experiments.length > 0 && (
        <ul className="mt-4 space-y-4 w-full max-w-lg">
          {experiments.map((exp) => (
            <li
              key={exp.id}
              className="bg-white p-4 rounded shadow flex flex-col items-center space-y-2"
            >
              <span className="font-semibold text-lg">{exp.title}</span>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleRun(exp)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  ▶ Run
                </button>
                <button
                  onClick={() => handleTheory(exp.id)}
                  className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                >
                  📖 Theory
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Render experiment in-page */}
      {currentSketch && (
        <div className="mt-8 w-full max-w-4xl h-[500px] border border-gray-300 rounded shadow">
          <ExperimentRunner sketchPath={currentSketch} />
        </div>
      )}
    </div>
  );
};

export default BiologyLab;
