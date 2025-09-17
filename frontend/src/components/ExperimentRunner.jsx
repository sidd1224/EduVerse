import React, { useEffect, useRef } from "react";

const ExperimentRunner = ({ sketchPath }) => {
  const containerRef = useRef();

  useEffect(() => {
    containerRef.current.innerHTML = "";

    if (window.__p5instances && window.__p5instances.length > 0) {
      window.__p5instances.forEach((inst) => inst.remove());
      window.__p5instances = [];
    }

    const loadScript = (src) =>
      new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });

    const runSketch = async () => {
      if (!window.p5) {
        await loadScript("https://cdn.jsdelivr.net/npm/p5@1.6.0/lib/p5.min.js");
      }
      await loadScript(sketchPath);
    };

    runSketch();

    return () => {
      if (window.__p5instances && window.__p5instances.length > 0) {
        window.__p5instances.forEach((inst) => inst.remove());
        window.__p5instances = [];
      }
      containerRef.current.innerHTML = "";
    };
  }, [sketchPath]);

  return (
    <div
      ref={containerRef}
      className="w-screen h-screen"
      style={{ margin: 0, padding: 0 }}
    />
  );
};

export default ExperimentRunner;
