"use client";

import { useMemo } from "react";
import {
  Volume2,
  VolumeX,
  ChevronDown,
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Zap,
  Activity,
} from "lucide-react";

interface Chapter {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  triggerStart: number;
  triggerEnd: number;
}

interface OverlayHUDProps {
  progress: number;
  muted: boolean;
  onToggleMute: () => void;
  onSkip: () => void;
  showIntro: boolean;
}

export function OverlayHUD({
  progress,
  muted,
  onToggleMute,
  onSkip,
  showIntro,
}: OverlayHUDProps) {
  const chapters: Chapter[] = useMemo(
    () => [
      {
        id: 1,
        title: "Predict Failures",
        description:
          "ML models detect anomalies 72 hours before critical failure.",
        icon: <BarChart3 className="w-5 h-5" />,
        triggerStart: 0.2,
        triggerEnd: 0.38,
      },
      {
        id: 2,
        title: "Explain Causes",
        description:
          "Feature attribution reveals the top drivers behind each risk score.",
        icon: <BrainCircuit className="w-5 h-5" />,
        triggerStart: 0.42,
        triggerEnd: 0.58,
      },
      {
        id: 3,
        title: "Act with Copilot",
        description:
          "Automated playbooks dispatch teams and preempt downtime.",
        icon: <Zap className="w-5 h-5" />,
        triggerStart: 0.62,
        triggerEnd: 0.78,
      },
    ],
    []
  );

  const activeChapter = chapters.find(
    (c) => progress >= c.triggerStart && progress <= c.triggerEnd
  );

  const showDashboardCTA = progress > 0.85;
  const introVisible = showIntro && progress < 0.05;

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 10 }}>
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Top bar: streaming indicator + risk pulse */}
      <div className="absolute top-6 left-6 flex items-center gap-3 pointer-events-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[oklch(1_0_0_/_0.08)] bg-[oklch(0.06_0.015_255_/_0.7)] backdrop-blur-md">
          <div className="relative w-2 h-2">
            <span className="absolute inset-0 rounded-full bg-[oklch(0.65_0.18_155)]" />
            <span className="absolute inset-[-3px] rounded-full bg-[oklch(0.65_0.18_155)] risk-pulse-ring" />
          </div>
          <span className="text-[11px] font-medium text-[oklch(0.65_0.18_155)]">
            Live
          </span>
        </div>
        {progress > 0.01 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[oklch(1_0_0_/_0.06)] bg-[oklch(0.06_0.015_255_/_0.6)] backdrop-blur-md">
            <Activity className="w-3 h-3 text-[oklch(0.6_0.2_250)]" />
            <span className="text-[10px] font-mono text-[oklch(1_0_0_/_0.4)]">
              {Math.round(progress * 100)}%
            </span>
          </div>
        )}
      </div>

      {/* Top right controls */}
      <div className="absolute top-6 right-6 flex items-center gap-2 pointer-events-auto">
        <button
          onClick={onToggleMute}
          className="mute-btn flex items-center justify-center w-9 h-9 rounded-xl border border-[oklch(1_0_0_/_0.08)] bg-[oklch(0.06_0.015_255_/_0.6)] text-[oklch(1_0_0_/_0.5)] hover:text-[oklch(1_0_0_/_0.8)]"
          aria-label={muted ? "Unmute audio" : "Mute audio"}
        >
          {muted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>
        <button
          onClick={onSkip}
          className="experience-btn flex items-center gap-2 px-4 py-2 rounded-xl border border-[oklch(1_0_0_/_0.1)] bg-[oklch(0.06_0.015_255_/_0.6)] text-[oklch(1_0_0_/_0.6)] text-xs font-medium"
          aria-label="Skip intro"
        >
          Skip Intro
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Hero intro content */}
      {introVisible && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <h1 className="hero-text-reveal text-5xl sm:text-7xl font-bold tracking-tight text-[oklch(0.95_0.005_250)]">
            InfraCopilot AI
          </h1>
          <p className="hero-text-reveal-delay-1 mt-4 text-lg sm:text-xl font-medium tracking-wide text-[oklch(0.6_0.2_250)]">
            Predict. Explain. Act.
          </p>
          <p className="hero-text-reveal-delay-2 mt-3 text-sm text-[oklch(1_0_0_/_0.4)] max-w-md">
            Prevent downtime before it happens.
          </p>

          {/* Scroll indicator */}
          <div className="scroll-indicator absolute bottom-16 flex flex-col items-center gap-2">
            <span className="text-[11px] font-medium text-[oklch(1_0_0_/_0.35)] uppercase tracking-widest">
              Scroll to begin
            </span>
            <ChevronDown className="w-5 h-5 text-[oklch(1_0_0_/_0.3)]" />
          </div>
        </div>
      )}

      {/* Chapter cards */}
      {activeChapter && (
        <div className="absolute left-8 bottom-32 sm:bottom-24 max-w-sm pointer-events-auto">
          <div className="chapter-card chapter-card-visible rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[oklch(0.6_0.2_250_/_0.15)] text-[oklch(0.6_0.2_250)]">
                {activeChapter.icon}
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[oklch(0.6_0.2_250)]">
                  Chapter {activeChapter.id}
                </span>
                <h3 className="text-base font-bold text-[oklch(0.93_0.008_250)]">
                  {activeChapter.title}
                </h3>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-[oklch(1_0_0_/_0.5)]">
              {activeChapter.description}
            </p>

            {/* Animated accent bar */}
            <div className="mt-4 h-[2px] rounded-full bg-[oklch(1_0_0_/_0.06)] overflow-hidden">
              <div
                className="h-full rounded-full bg-[oklch(0.6_0.2_250)] transition-all duration-700"
                style={{
                  width: `${
                    ((progress - activeChapter.triggerStart) /
                      (activeChapter.triggerEnd - activeChapter.triggerStart)) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Dashboard CTA */}
      {showDashboardCTA && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto">
          <div
            className="dashboard-reveal flex flex-col items-center gap-6 text-center"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-[oklch(0.65_0.18_155_/_0.3)] bg-[oklch(0.65_0.18_155_/_0.08)]">
              <div className="w-1.5 h-1.5 rounded-full bg-[oklch(0.65_0.18_155)]" />
              <span className="text-[11px] font-medium text-[oklch(0.65_0.18_155)]">
                Arrived in Davis
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[oklch(0.95_0.005_250)]">
              Your Fleet Awaits
            </h2>
            <p className="text-sm text-[oklch(1_0_0_/_0.4)] max-w-xs">
              50,000 chargers monitored in real-time with AI-powered predictions.
            </p>
            <button
              onClick={onSkip}
              className="experience-btn flex items-center gap-3 px-8 py-3.5 rounded-2xl border border-[oklch(0.6_0.2_250_/_0.3)] bg-[oklch(0.6_0.2_250_/_0.12)] text-[oklch(0.6_0.2_250)] font-semibold text-sm hover:bg-[oklch(0.6_0.2_250_/_0.2)]"
            >
              Enter Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom progress bar */}
      {progress > 0.01 && progress < 0.85 && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[oklch(1_0_0_/_0.04)]">
          <div
            className="h-full bg-[oklch(0.6_0.2_250_/_0.5)] transition-all duration-200"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}
