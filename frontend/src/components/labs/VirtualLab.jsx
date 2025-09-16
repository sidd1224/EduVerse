// src/components/VirtualLab.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const VirtualLab = () => {
  const navigate = useNavigate();
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Direct call to Firebase Functions emulator
    fetch("http://127.0.0.1:5008/eduverse-c818a/us-central1/vlab/api/experiments")
      .then((response) => response.json())
      .then((data) => {
        setExperiments(data); // array of experiments
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch experiments data.");
        setLoading(false);
      });
  }, []);

  const handleReturn = () => {
    navigate("/Dashboard"); // back to dashboard
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // 🔹 Group experiments by subject
  const biologyExperiments = experiments.filter((exp) => exp.subject === "Biology");
  const chemistryExperiments = experiments.filter((exp) => exp.subject === "Chemistry");
  const physicsExperiments = experiments.filter((exp) => exp.subject === "Physics");

  // 🔹 Pick one biology classId dynamically (e.g., first available experiment)
  const biologyClassId = biologyExperiments.length > 0 ? biologyExperiments[0].classId : null;

  return (
    <div className="min-h-screen bg-purple-100 py-10">
      {/* Header */}
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

      {/* Subjects Grid */}
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
              {biologyExperiments.length} experiment(s) available
            </p>
            <button
              onClick={() =>
                biologyClassId
                  ? navigate(`/VirtualLab/Biology/${biologyClassId}`)
                  : alert("No Biology experiments found")
              }
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
              {chemistryExperiments.length} experiment(s) available
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
              {physicsExperiments.length} experiment(s) available
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
