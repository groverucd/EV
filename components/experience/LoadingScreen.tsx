"use client";

import { useEffect, useState, useCallback } from "react";
import { Zap } from "lucide-react";

const LOADING_STAGES = [
  "Loading assets",
  "Calibrating fleet",
  "Connecting to chargers",
  "Initializing AI models",
];

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [complete, setComplete] = useState(false);
  const [hidden, setHidden] = useState(false);

  const advanceProgress = useCallback(() => {
    setProgress((p) => {
      const next = Math.min(p + Math.random() * 8 + 2, 100);
      const stageTarget = Math.floor((next / 100) * LOADING_STAGES.length);
      setStageIndex(Math.min(stageTarget, LOADING_STAGES.length - 1));
      if (next >= 100) {
        setComplete(true);
        setTimeout(() => {
          setHidden(true);
          setTimeout(onComplete, 500);
        }, 800);
      }
      return next;
    });
  }, [onComplete]);

  useEffect(() => {
    const interval = setInterval(advanceProgress, 180);
    return () => clearInterval(interval);
  }, [advanceProgress]);

  if (hidden) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#06080f] transition-opacity duration-500 ${
        complete ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Noise */}
      <div className="noise-overlay" />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_oklch(0.2_0.08_250_/_0.3)_0%,_transparent_70%)]" />

      {/* Logo */}
      <div className="relative flex flex-col items-center gap-8">
        <div className="relative flex items-center justify-center w-16 h-16">
          {/* Glow ring */}
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: `conic-gradient(from ${progress * 3.6}deg, oklch(0.6 0.2 250 / 0.4), oklch(0.55 0.18 155 / 0.3), oklch(0.6 0.2 250 / 0.1), transparent)`,
              filter: "blur(8px)",
            }}
          />
          <div className="relative flex items-center justify-center w-14 h-14 rounded-xl bg-[#0a0d18] border border-[oklch(1_0_0_/_0.06)]">
            <Zap className="w-6 h-6 text-[oklch(0.65_0.2_250)]" />
          </div>
        </div>

        {/* Brand name */}
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-xl font-bold tracking-tight text-[oklch(0.93_0.008_250)]">
            InfraCopilot
          </h1>
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[oklch(0.6_0.2_250)]">
            AI
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-64 flex flex-col gap-3">
          <div className="loading-bar-track h-[3px] bg-[oklch(1_0_0_/_0.06)] rounded-full">
            <div
              className="loading-bar-fill h-full rounded-full bg-[oklch(0.6_0.2_250)]"
              style={{ width: `${progress}%` }}
            />
            <div className="loading-bar-shimmer" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {!complete && (
                <div className="w-1 h-1 rounded-full bg-[oklch(0.6_0.2_250)]" style={{ animation: "loading-pulse 1s ease-in-out infinite" }} />
              )}
              <span className="text-xs text-[oklch(1_0_0_/_0.4)] font-mono">
                {complete
                  ? "Systems Ready"
                  : `${LOADING_STAGES[stageIndex]}...`}
              </span>
            </div>
            <span className="text-xs font-mono text-[oklch(1_0_0_/_0.3)]">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
