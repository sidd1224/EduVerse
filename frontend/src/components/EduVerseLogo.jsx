import React from "react";
import { useNavigate } from "react-router-dom";

const EduVerseLogo = ({ animationStage }) => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-center overflow-hidden">
      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-purple-500 opacity-40"></div>
      <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-purple-500 opacity-40"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-purple-500 opacity-40"></div>
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-purple-500 opacity-40"></div>

      <div className="relative z-10">
        {/* Glow background */}
        <div
          className={`absolute inset-0 blur-3xl transition-all duration-2000 ${
            animationStage >= 3
              ? "bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-30"
              : "opacity-0"
          }`}
          style={{ transform: "scale(1.5)" }}
        />

        {/* Title */}
        <h1 className="relative">
          {["E", "d", "u", "V", "e", "r", "s", "e"].map((letter, index) => (
            <span
              key={index}
              className={`inline-block text-8xl md:text-9xl font-bold transition-all duration-1000 ease-out ${
                animationStage >= 2
                  ? "transform translate-y-0 opacity-100 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                  : "transform translate-y-20 opacity-0 text-white"
              }`}
              style={{
                transitionDelay: `${index * 100}ms`,
                textShadow:
                  animationStage >= 3
                    ? "0 0 30px rgba(147, 51, 234, 0.5)"
                    : "none",
              }}
            >
              {letter}
            </span>
          ))}
        </h1>

        {/* Underline */}
        <div className="flex justify-center mt-6">
          <svg width="400" height="20" viewBox="0 0 400 20">
            <defs>
              <linearGradient
                id="underlineGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
            <path
              d="M10 10 Q200 5 390 10"
              fill="none"
              stroke="url(#underlineGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="400"
              strokeDashoffset={animationStage >= 3 ? 0 : 400}
              style={{
                transition: "stroke-dashoffset 1.5s ease-out",
                transitionDelay: "1.2s",
                filter:
                  animationStage >= 3
                    ? "drop-shadow(0 0 10px rgba(139, 92, 246, 0.5))"
                    : "none",
              }}
            />
            {animationStage >= 3 && (
              <circle
                r="3"
                fill="#8b5cf6"
                opacity="0.8"
                className="animate-pulse"
              >
                <animateMotion
                  dur="1.5s"
                  begin="1.2s"
                  repeatCount="1"
                  path="M10 10 Q200 5 390 10"
                />
              </circle>
            )}
          </svg>
        </div>

        {/* Subtitle */}
        <p
          className={`mt-8 text-xl md:text-2xl text-gray-300 transition-all duration-1000 ${
            animationStage >= 3
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "1000ms" }}
        >
          A Digital Gateway to Infinite Learning
        </p>

        {/* Animated dots */}
        <div
          className={`flex justify-center space-x-2 mt-6 transition-all duration-1000 ${
            animationStage >= 4 ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "1500ms" }}
        >
          {[0, 1, 2].map((dot) => (
            <div
              key={dot}
              className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce"
              style={{
                animationDelay: `${dot * 200}ms`,
                animationDuration: "1.5s",
              }}
            />
          ))}
        </div>

        {/* Enter button */}
        <div
          className={`mt-8 transition-all duration-1000 ${
            animationStage >= 4
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "2500ms" }}
        >
          <button
            onClick={() => navigate("/login")}
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-semibold text-white shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 hover:from-blue-500 hover:to-purple-500"
          >
            <span className="relative z-10">Enter EduVerse</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EduVerseLogo;
