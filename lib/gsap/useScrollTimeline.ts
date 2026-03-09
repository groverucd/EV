"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollTimelineOptions {
  /** The scrollable container selector or element */
  trigger: string | HTMLElement;
  /** Total scroll distance in vh or px, e.g. "400%" */
  end?: string;
  /** Pin the trigger element */
  pin?: boolean;
  /** Scrub smoothness (true = instant, number = seconds) */
  scrub?: boolean | number;
  /** Called on every scroll progress update with 0-1 value */
  onProgress?: (progress: number) => void;
}

export function useScrollTimeline(opts: ScrollTimelineOptions) {
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: typeof opts.trigger === "string" ? opts.trigger : opts.trigger,
        start: "top top",
        end: opts.end ?? "+=400%",
        pin: opts.pin ?? true,
        scrub: opts.scrub ?? 1,
        onUpdate: (self) => {
          opts.onProgress?.(self.progress);
        },
      },
    });

    tlRef.current = tl;

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return tlRef;
}
