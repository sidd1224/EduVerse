import React, { useEffect, useRef } from "react";

const ExperimentRunner = ({ sketchPath }) => {
  const containerRef = useRef();

  useEffect(() => {
    // Clear any previous sketch
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.type = "module"; // important for ES modules
    script.src = sketchPath; // e.g. "/labs/experiments/class_10/biology/Photosynthesis.js"
    containerRef.current.appendChild(script);

    return () => {
      // optional cleanup
      containerRef.current.innerHTML = "";
    };
  }, [sketchPath]);

  return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
};

export default ExperimentRunner;
