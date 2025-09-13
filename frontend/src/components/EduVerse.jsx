import React, { useState, useEffect } from "react";
import Particles from "./Particles";
import EduVerseLogo from "./EduVerseLogo";
import Rings from "./Rings";
import Corners from "./Corners";

const EduVerse = () => {
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    const stage1 = setTimeout(() => setAnimationStage(1), 300);
    const stage2 = setTimeout(() => setAnimationStage(2), 800);
    const stage3 = setTimeout(() => setAnimationStage(3), 1500);
    const stage4 = setTimeout(() => setAnimationStage(4), 2000);

    return () => {
      clearTimeout(stage1);
      clearTimeout(stage2);
      clearTimeout(stage3);
      clearTimeout(stage4);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center overflow-hidden relative">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Floating particles */}
      <Particles animationStage={animationStage} />

      {/* Main logo */}
      <EduVerseLogo animationStage={animationStage} />

      {/* Rotating rings */}
      <Rings animationStage={animationStage} />

      {/* Corner decorations */}
      <Corners animationStage={animationStage} />
    </div>
  );
};

export default EduVerse;
