import React, { useEffect, useState } from "react";
import EduVerseLogo from "./EduVerseLogo";

export default function Landing() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Animate through stages automatically
    const timers = [
      setTimeout(() => setStage(1), 300),
      setTimeout(() => setStage(2), 1000),
      setTimeout(() => setStage(3), 2000),
      setTimeout(() => setStage(4), 3500),
    ];

    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  return <EduVerseLogo animationStage={stage} />;
}
