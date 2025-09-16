// src/components/BiologyLab.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API_BASE from "../../api";

const BiologyLab = () => {
  const navigate = useNavigate();
  const { classId } = useParams();
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch experiments for Biology class
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

  // Run experiment in a new window using dynamic scripts
  const handleRun = (id) => {
    fetch(`${API_BASE}/api/run/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          alert("Failed to load experiment.");
          return;
        }

        const newWindow = window.open("", "_blank");

        // Load p5.js dynamically
        const p5Script = newWindow.document.createElement("script");
        p5Script.src = "https://cdn.jsdelivr.net/npm/p5@1.6.0/lib/p5.min.js";
        p5Script.onload = () => {
          // Load user's sketch as module
          const sketchScript = newWindow.document.createElement("script");
          sketchScript.type = "module";
          sketchScript.src = data.sketchPath;
          newWindow.document.body.appendChild(sketchScript);
        };

        newWindow.document.head.appendChild(p5Script);
        newWindow.document.body.style.margin = "0";
        newWindow.document.body.style.overflow = "hidden";
      })
      .catch((err) => {
        console.error("Run failed:", err);
        alert("Failed to run experiment.");
      });
  };

  // Fetch theory and display in alert (can upgrade to modal later)
  const handleTheory = (id) => {
    fetch(`${API_BASE}/api/theory/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          alert("Failed to load theory.");
          return;
        }

        const exp = data.experiment;
        alert(
          `🧪 ${exp.title}\n\n📋 Materials Required:\n${exp.materials_required}\n\n📝 Procedure:\n${exp.procedure}\n\n📖 Theory:\n${exp.theory}`
        );
      })
      .catch((err) => {
        console.error("Theory fetch failed:", err);
        alert("Failed to fetch theory.");
      });
  };

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
        <ul className="mt-4 space-y-4 w-full max-w-lg">
          {experiments.map((exp) => (
            <li
              key={exp.id}
              className="bg-white p-4 rounded shadow flex flex-col items-center space-y-2"
            >
              <span className="font-semibold text-lg">{exp.title}</span>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleRun(exp.id)}
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
    </div>
  );
};

export default BiologyLab;
