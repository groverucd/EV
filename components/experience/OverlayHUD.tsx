"use client"

import { useState, useEffect } from "react"
import { Volume2, VolumeX, ChevronDown } from "lucide-react"

interface OverlayHUDProps {
  phase: "intro" | "scroll" | "transition"
  scrollProgress: number
  isMuted: boolean
  onToggleMute: () => void
  onSkip: () => void
  onEnterDashboard: () => void
  reducedMotion: boolean
}

export function OverlayHUD({
  phase,
  scrollProgress,
  isMuted,
  onToggleMute,
  onSkip,
  onEnterDashboard,
  reducedMotion,
}: OverlayHUDProps) {
  const [introVisible, setIntroVisible] = useState(false)

  useEffect(() => {
    if (phase === "intro") {
      const timer = setTimeout(() => setIntroVisible(true), 300)
      return () => clearTimeout(timer)
    }
  }, [phase])

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      <div className="noise-overlay" />

      {/* Top bar: streaming indicator + audio control */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 pointer-events-auto">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/60 backdrop-blur-md border border-border/50">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-muted-foreground">
              LIVE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMute}
            className="flex items-center justify-center h-9 w-9 rounded-full bg-card/60 backdrop-blur-md border border-border/50 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <button
            onClick={onSkip}
            className="px-4 py-1.5 rounded-full bg-card/60 backdrop-blur-md border border-border/50 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip Intro
          </button>
        </div>
      </div>

      {/* Intro hero overlay */}
      {phase === "intro" && (
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-1000 ${
            introVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex flex-col items-center gap-6 px-6">
            <div className="flex flex-col items-center gap-3">
              <h1 className="text-5xl font-sans font-bold tracking-tight text-foreground md:text-7xl text-balance">
                InfraCopilot AI
              </h1>
              <p className="text-lg font-mono text-primary tracking-widest uppercase md:text-xl">
                Predict. Explain. Act.
              </p>
            </div>
            <p className="text-base text-muted-foreground max-w-md text-pretty">
              Prevent downtime before it happens.
            </p>

            {reducedMotion && (
              <button
                onClick={onEnterDashboard}
                className="pointer-events-auto mt-4 px-8 py-3 rounded-full bg-primary text-primary-foreground font-sans font-medium text-sm hover:bg-primary/90 transition-colors"
              >
                Enter Dashboard
              </button>
            )}
          </div>

          {!reducedMotion && (
            <div className="absolute bottom-12 flex flex-col items-center gap-2 pointer-events-auto">
              <span className="text-xs font-mono text-muted-foreground tracking-wider uppercase">
                Scroll to begin
              </span>
              <ChevronDown
                size={20}
                className="text-muted-foreground animate-scroll-bounce"
              />
            </div>
          )}
        </div>
      )}

      {/* Scroll progress indicator */}
      {phase === "scroll" && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted/30">
          <div
            className="h-full bg-primary transition-all duration-100 ease-linear"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
      )}

      {/* Enter Dashboard CTA at end */}
      {phase === "transition" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
          <div className="flex flex-col items-center gap-6 animate-fade-in-up">
            <p className="text-sm font-mono text-muted-foreground tracking-wider uppercase">
              Welcome to Davis
            </p>
            <button
              onClick={onEnterDashboard}
              className="group relative px-10 py-4 rounded-2xl bg-primary text-primary-foreground font-sans font-semibold text-base hover:bg-primary/90 transition-all hover:scale-105"
            >
              Enter Dashboard
              <span className="absolute inset-0 rounded-2xl border border-primary/50 animate-pulse-ring" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom-right risk pulse + mini indicator (scroll phase) */}
      {phase === "scroll" && (
        <div className="absolute bottom-6 right-6 flex items-center gap-2 pointer-events-auto">
          <div className="risk-pulse h-3 w-3 rounded-full bg-accent" />
          <span className="text-xs font-mono text-muted-foreground">
            {Math.round(scrollProgress * 100)}% analyzed
          </span>
        </div>
      )}
    </div>
  )
}
