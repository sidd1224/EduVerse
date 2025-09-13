import React from "react";

const Rings = ({ animationStage }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className={`absolute top-1/2 left-1/2 w-96 h-96 border border-blue-500/20 rounded-full transition-all duration-3000 ${
          animationStage >= 3 ? "opacity-100 animate-spin" : "opacity-0"
        }`}
        style={{
          transform: "translate(-50%, -50%)",
          animationDuration: "20s",
          animationDirection: "normal",
        }}
      />
      <div
        className={`absolute top-1/2 left-1/2 w-80 h-80 border border-purple-500/20 rounded-full transition-all duration-3000 ${
          animationStage >= 3 ? "opacity-100 animate-spin" : "opacity-0"
        }`}
        style={{
          transform: "translate(-50%, -50%)",
          animationDuration: "15s",
          animationDirection: "reverse",
        }}
      />
      <div
        className={`absolute top-1/2 left-1/2 w-64 h-64 border border-pink-500/20 rounded-full transition-all duration-3000 ${
          animationStage >= 3 ? "opacity-100 animate-spin" : "opacity-0"
        }`}
        style={{
          transform: "translate(-50%, -50%)",
          animationDuration: "25s",
          animationDirection: "normal",
        }}
      />
    </div>
  );
};

export default Rings;
