import React from "react";

const Corners = ({ animationStage }) => {
  return (
    <>
      <div
        className={`absolute top-10 left-10 w-20 h-20 border-l-2 border-t-2 border-blue-400/30 transition-all duration-1500 ${
          animationStage >= 4 ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`}
        style={{ transitionDelay: "2200ms" }}
      />
      <div
        className={`absolute top-10 right-10 w-20 h-20 border-r-2 border-t-2 border-purple-400/30 transition-all duration-1500 ${
          animationStage >= 4 ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`}
        style={{ transitionDelay: "2400ms" }}
      />
      <div
        className={`absolute bottom-10 left-10 w-20 h-20 border-l-2 border-b-2 border-pink-400/30 transition-all duration-1500 ${
          animationStage >= 4 ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`}
        style={{ transitionDelay: "2600ms" }}
      />
      <div
        className={`absolute bottom-10 right-10 w-20 h-20 border-r-2 border-b-2 border-blue-400/30 transition-all duration-1500 ${
          animationStage >= 4 ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`}
        style={{ transitionDelay: "2800ms" }}
      />
    </>
  );
};

export default Corners;
