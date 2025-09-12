import React from "react";

const Particles = ({ animationStage }) => {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    delay: i * 200,
    x: Math.random() * 100,
    y: Math.random() * 100,
    scale: Math.random() * 0.5 + 0.5,
  }));

  if (animationStage < 4) return null;

  return (
    <>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 bg-blue-400 rounded-full animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            transform: `scale(${particle.scale})`,
            animationDelay: `${particle.delay}ms`,
            animationDuration: `${2000 + Math.random() * 1000}ms`,
          }}
        />
      ))}
    </>
  );
};

export default Particles;
