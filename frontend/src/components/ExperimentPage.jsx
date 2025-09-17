// src/components/ExperimentPage.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import ExperimentRunner from "./ExperimentRunner";

const ExperimentPage = () => {
  const location = useLocation();
  const sketchPath = location.state?.sketchPath;

  if (!sketchPath) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600 font-semibold">
          ❌ No experiment selected
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">
        🧪 Experiment Runner
      </h1>
      <div className="w-full max-w-5xl h-[600px] border rounded shadow bg-white">
        <ExperimentRunner sketchPath={sketchPath} />
      </div>
    </div>
  );
};

export default ExperimentPage;
