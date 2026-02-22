"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Lenis from "lenis";
import { LoadingScreen } from "@/components/experience/LoadingScreen";
import { OverlayHUD } from "@/components/experience/OverlayHUD";
import { useAmbientAudio } from "@/lib/audio/useAmbientAudio";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "@/styles/experience.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Dynamically import the heavy 3D scene (no SSR)
const ExperienceScene = dynamic(
  () =>
    import("@/components/experience/ExperienceScene").then(
      (mod) => mod.ExperienceScene
    ),
  { ssr: false }
);

export default function ExperiencePage() {
  const router = useRouter();
  const prefersReduced = useReducedMotion();
  const { muted, toggle: toggleMute } = useAmbientAudio();

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  const autoTransitioned = useRef(false);

  const handleLoadingComplete = useCallback(() => {
    setLoading(false);
  }, []);

  const handleSkip = useCallback(() => {
    const el = containerRef.current;
    if (el) {
      el.style.transition = "opacity 0.6s ease-out";
      el.style.opacity = "0";
    }
    setTimeout(() => {
      router.push("/");
    }, 600);
  }, [router]);

  // Redirect immediately if reduced motion
  useEffect(() => {
    if (prefersReduced) {
      router.replace("/");
    }
  }, [prefersReduced, router]);

  // Lenis smooth scrolling
  useEffect(() => {
    if (loading || prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
    });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, [loading, prefersReduced]);

  // Setup GSAP ScrollTrigger for camera scrub
  useEffect(() => {
    if (loading || prefersReduced) return;

    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          setProgress(self.progress);
          if (self.progress > 0.05) {
            setShowIntro(false);
          }
          // Auto-transition at 98%
          if (self.progress > 0.98 && !autoTransitioned.current) {
            autoTransitioned.current = true;
            setTimeout(() => {
              handleSkip();
            }, 2000);
          }
        },
      });
      triggerRef.current = trigger;
    });

    return () => {
      ctx.revert();
    };
  }, [loading, prefersReduced, handleSkip]);

  // If reduced motion, show nothing (redirect will fire)
  if (prefersReduced) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#06080f]">
        <p className="text-sm text-[oklch(1_0_0_/_0.4)]">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <>
      {loading && <LoadingScreen onComplete={handleLoadingComplete} />}

      <div
        ref={containerRef}
        className="relative bg-[#06080f]"
        style={{ height: "600vh" }}
      >
        {/* 3D Canvas (fixed behind everything) */}
        {!loading && <ExperienceScene progress={progress} />}

        {/* HUD Overlay */}
        {!loading && (
          <OverlayHUD
            progress={progress}
            muted={muted}
            onToggleMute={toggleMute}
            onSkip={handleSkip}
            showIntro={showIntro}
          />
        )}
      </div>
    </>
  );
}
