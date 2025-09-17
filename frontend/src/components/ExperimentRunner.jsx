// SOLUTION 2: Completely minimal ExperimentRunner.jsx
// Only shows content when experiment successfully loads

import React, { useEffect, useRef, useState } from "react";

const ExperimentRunner = ({ sketchPath }) => {
  const containerRef = useRef();
  const [hasExperiment, setHasExperiment] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    
    if (!sketchPath) {
      setHasExperiment(false);
      return;
    }

    const loadAndRunExperiment = async () => {
      try {
        // Clear container
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }

        // Clean up previous P5 instances
        if (window.__p5instances && window.__p5instances.length > 0) {
          window.__p5instances.forEach((inst) => {
            if (inst && typeof inst.remove === 'function') {
              try {
                inst.remove();
              } catch (e) {
                console.warn('Error removing P5 instance:', e);
              }
            }
          });
          window.__p5instances = [];
        }

        if (!mountedRef.current) return;

        // Load P5.js
        if (!window.p5) {
          await loadScript("https://cdn.jsdelivr.net/npm/p5@1.6.0/lib/p5.min.js");
        }

        // Load experiment
        if (mountedRef.current) {
          await loadScript(sketchPath);
          if (mountedRef.current) {
            setHasExperiment(true);
          }
        }

      } catch (error) {
        console.error("Error loading experiment:", error);
        setHasExperiment(false);
      }
    };

    loadAndRunExperiment();

    return () => {
      mountedRef.current = false;
      
      if (window.__p5instances && window.__p5instances.length > 0) {
        window.__p5instances.forEach((inst) => {
          if (inst && typeof inst.remove === 'function') {
            try {
              inst.remove();
            } catch (e) {
              console.warn('Error in cleanup:', e);
            }
          }
        });
        window.__p5instances = [];
      }

      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      
      setHasExperiment(false);
    };
  }, [sketchPath]);

  const loadScript = (src) =>
    new Promise((resolve, reject) => {
      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        if (mountedRef.current) {
          resolve();
        }
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });

  // Don't render anything until experiment is loaded
  if (!hasExperiment) {
    return null;
  }

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%',
        height: '100%',
        margin: 0,
        padding: 0,
        background: 'transparent',
        border: 'none'
      }}
    />
  );
};

export default ExperimentRunner;