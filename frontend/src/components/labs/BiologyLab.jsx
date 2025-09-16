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

    const fetchExperiments = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/experiments/Biology/${classId}`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to fetch experiments");
        }
        const data = await res.json();
        setExperiments(data);
      } catch (err) {
        console.error("Error fetching experiments:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiments();
  }, [classId]);

  // Run experiment in a new window
  const handleRun = async (id) => {
    const newWindow = window.open("", "_blank");
    newWindow.document.write("<p style='text-align:center;margin-top:50px;'>Loading experiment...</p>");
    newWindow.document.body.style.margin = "0";
    newWindow.document.body.style.overflow = "hidden";

    try {
      const res = await fetch(`${API_BASE}/api/run/${id}`);
      const data = await res.json();

      if (!data.success) {
        newWindow.close();
        alert("Failed to load experiment.");
        return;
      }

      // Load p5.js dynamically
      const p5Script = newWindow.document.createElement("script");
      p5Script.src = "https://cdn.jsdelivr.net/npm/p5@1.6.0/lib/p5.min.js";
      p5Script.onload = () => {
        const sketchScript = newWindow.document.createElement("script");
        sketchScript.type = "module";
        sketchScript.src = `${API_BASE}${data.sketchPath}`;
        sketchScript.onerror = () => {
          console.error("Failed to load experiment sketch:", data.sketchPath);
          alert("Failed to load experiment sketch.");
          newWindow.close();
        };
        newWindow.document.body.appendChild(sketchScript);
      };
      p5Script.onerror = () => {
        console.error("Failed to load p5.js library");
        alert("Failed to load p5.js library.");
        newWindow.close();
      };
      newWindow.document.head.appendChild(p5Script);
    } catch (err) {
      console.error("Run failed:", err);
      alert("Failed to run experiment.");
      newWindow.close();
    }
  };

  // Fetch theory and display in modal or alert
  const handleTheory = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/theory/${id}`);
      const data = await res.json();

      if (!data.success) {
        alert("Failed to load theory.");
        return;
      }

      const exp = data.experiment;
      alert(
        `🧪 ${exp.title}\n\n📋 Materials Required:\n${exp.materials_required}\n\n📝 Procedure:\n${exp.procedure}\n\n📖 Theory:\n${exp.theory}`
      );
    } catch (err) {
      console.error("Theory fetch failed:", err);
      alert("Failed to fetch theory.");
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 relative flex flex-col items-center justify-center px-4 py-10">
      {/* Back button */}
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
