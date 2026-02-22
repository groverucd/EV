"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

const STAGES = [
  "Loading assets...",
  "Calibrating systems...",
  "Connecting to infrastructure...",
  "Ready.",
];

export default function Loading() {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background loading-screen">
      {/* Noise overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none noise-overlay" />

      {/* Glow orb */}
      <div className="absolute w-[320px] h-[320px] rounded-full bg-primary/8 blur-[100px] pointer-events-none" />

      {/* Logo */}
      <div className="relative flex flex-col items-center gap-6">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 loading-logo-pulse">
          <Zap className="w-7 h-7 text-primary" />
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            InfraCopilot AI
          </h1>
          <p className="text-xs text-muted-foreground font-medium">
            Initializing systems...
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-48 h-1 rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full bg-primary loading-progress-bar" />
        </div>

        {/* Stage text */}
        <p
          key={stageIndex}
          className="text-[11px] text-muted-foreground/70 font-mono loading-stage-text"
        >
          {STAGES[stageIndex]}
        </p>
      </div>
    </div>
  );
}
