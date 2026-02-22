"use client"

import { useState, useEffect, useCallback } from "react"

interface LoadingScreenProps {
  onComplete: () => void
}

const LOADING_STEPS = [
  "Loading assets",
  "Calibrating fleet",
  "Connecting to chargers",
  "Loading complete",
]

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const finishLoading = useCallback(() => {
    setIsComplete(true)
    setTimeout(onComplete, 800)
  }, [onComplete])

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 3 + 1
        if (next >= 100) {
          clearInterval(interval)
          setStepIndex(3)
          setTimeout(finishLoading, 600)
          return 100
        }
        if (next > 66) setStepIndex(2)
        else if (next > 33) setStepIndex(1)
        return next
      })
    }, 60)

    return () => clearInterval(interval)
  }, [finishLoading])

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-700 ${
        isComplete ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="noise-overlay" />

      <div className="flex flex-col items-center gap-8 px-6">
        {/* Logo mark */}
        <div className="relative flex items-center justify-center">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              className="text-primary"
            >
              <path
                d="M16 2L4 8v16l12 6 12-6V8L16 2z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M16 10l-6 3v6l6 3 6-3v-6l-6-3z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="currentColor"
                fillOpacity="0.2"
              />
              <circle cx="16" cy="16" r="2" fill="currentColor" />
            </svg>
          </div>
          {/* Pulse rings */}
          <div className="absolute inset-0 rounded-2xl border border-primary/20 animate-pulse-ring" />
        </div>

        {/* Step text */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm font-mono text-muted-foreground tracking-wider uppercase">
            {LOADING_STEPS[stepIndex]}
            {stepIndex < 3 && (
              <span className="inline-flex gap-1 ml-1">
                <span className="streaming-dot" />
                <span className="streaming-dot" />
                <span className="streaming-dot" />
              </span>
            )}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-64 flex flex-col gap-2">
          <div className="loading-bar w-full bg-muted rounded-full">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs font-mono text-muted-foreground text-center tabular-nums">
            {Math.round(progress)}%
          </p>
        </div>
      </div>
    </div>
  )
}
