"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { LoadingScreen } from "./LoadingScreen"
import { OverlayHUD } from "./OverlayHUD"
import { ScrollChapters } from "./ScrollChapters"
import { useReducedMotion } from "@/lib/motion/useReducedMotion"
import { useAmbientAudio } from "@/lib/audio/useAmbientAudio"
import "@/styles/experience.css"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// Dynamic import for 3D scene to avoid SSR issues
const ExperienceScene = dynamic(
  () =>
    import("./ExperienceScene").then((mod) => ({
      default: mod.ExperienceScene,
    })),
  { ssr: false }
)

type Phase = "loading" | "intro" | "scroll" | "transition"

export function ExperienceOrchestrator() {
  const router = useRouter()
  const reducedMotion = useReducedMotion()
  const { isMuted, toggle: toggleMute } = useAmbientAudio()

  const [phase, setPhase] = useState<Phase>("loading")
  const [scrollProgress, setScrollProgress] = useState(0)
  const [sceneReady, setSceneReady] = useState(false)

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  // Handle loading complete
  const handleLoadingComplete = useCallback(() => {
    setSceneReady(true)
    setPhase("intro")
  }, [])

  // Skip intro -> go straight to dashboard
  const handleSkip = useCallback(() => {
    router.push("/dashboard")
  }, [router])

  // Enter dashboard
  const handleEnterDashboard = useCallback(() => {
    setPhase("transition")
    setTimeout(() => {
      router.push("/dashboard")
    }, 1200)
  }, [router])

  // GSAP ScrollTrigger setup
  useEffect(() => {
    if (phase !== "intro" || reducedMotion || !triggerRef.current) return

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const trigger = ScrollTrigger.create({
        trigger: triggerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
        onUpdate: (self) => {
          const p = self.progress
          setScrollProgress(p)

          if (p > 0.01 && phase === "intro") {
            setPhase("scroll")
          }

          if (p >= 0.95) {
            setPhase("transition")
          }
        },
      })

      return () => {
        trigger.kill()
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [phase, reducedMotion])

  // Reduced motion: skip to intro with direct dashboard access
  if (reducedMotion && phase === "loading") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="noise-overlay" />
        <div className="flex flex-col items-center gap-6 px-6 text-center">
          <h1 className="text-5xl font-sans font-bold text-foreground text-balance">
            InfraCopilot AI
          </h1>
          <p className="text-lg font-mono text-primary tracking-widest uppercase">
            Predict. Explain. Act.
          </p>
          <p className="text-base text-muted-foreground">
            Prevent downtime before it happens.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 px-8 py-3 rounded-full bg-primary text-primary-foreground font-sans font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            Enter Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Loading Screen */}
      {phase === "loading" && (
        <LoadingScreen onComplete={handleLoadingComplete} />
      )}

      {/* 3D Scene (persistent behind everything) */}
      {sceneReady && (
        <ExperienceScene scrollProgress={scrollProgress} />
      )}

      {/* Overlay HUD */}
      {sceneReady && (
        <OverlayHUD
          phase={phase === "loading" ? "intro" : phase}
          scrollProgress={scrollProgress}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          onSkip={handleSkip}
          onEnterDashboard={handleEnterDashboard}
          reducedMotion={reducedMotion}
        />
      )}

      {/* Scroll Chapters (content cards on left side) */}
      {sceneReady && (phase === "scroll" || phase === "transition") && (
        <ScrollChapters scrollProgress={scrollProgress} />
      )}

      {/* Scroll container - this creates the scrollable height for GSAP */}
      {sceneReady && !reducedMotion && (
        <div
          ref={triggerRef}
          className="experience-scroll-container"
          style={{ height: "600vh" }}
        >
          <div ref={scrollContainerRef} />
        </div>
      )}

      {/* Transition overlay */}
      {phase === "transition" && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-opacity duration-1000 animate-fade-in" />
      )}
    </div>
  )
}
