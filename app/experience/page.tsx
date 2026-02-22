"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
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

// Dynamic import for the heavy 3D scene -- keeps initial bundle small
const ExperienceScene = dynamic(
  () =>
    import("@/components/experience/ExperienceScene").then(
      (mod) => mod.ExperienceScene
    ),
  { ssr: false }
);

export default function ExperiencePage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const triggerRef = useRef<any>(null);
  const autoTransitioned = useRef(false);

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showIntro, setShowIntro] = useState(true);

  const { muted, toggle: toggleMute } = useAmbientAudio();
  const prefersReduced = useReducedMotion();

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
          // Auto-transition at end
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

  return (
    <div ref={containerRef} className="relative" style={{ height: "600vh" }}>
      {/* Loading */}
      {loading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {/* 3D Canvas -- always mounted so assets stay warm */}
      {!loading && <ExperienceScene progress={progress} />}

      {/* Overlay HUD */}
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
  );
}
