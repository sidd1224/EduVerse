// SOLUTION 1: Updated ExperimentPage.jsx - Remove everything when no experiment
// This hides the entire page when no experiment is selected

import React from "react";
import { useLocation } from "react-router-dom";
import ExperimentRunner from "./ExperimentRunner";

const ExperimentPage = () => {
  const location = useLocation();
  const sketchPath = location.state?.sketchPath;

  // Don't render anything if no experiment is selected
  if (!sketchPath) {
    return null; // This completely hides the component
  }

  return (
    <div className="w-full h-full">
      {/* Remove the title and just show the experiment */}
      <ExperimentRunner sketchPath={sketchPath} />
    </div>
  );
};

export default ExperimentPage;