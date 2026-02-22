"use client"

import { useEffect, useRef, useCallback } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface ScrollTimelineOptions {
  triggerRef: React.RefObject<HTMLElement | null>
  onProgress?: (progress: number) => void
  scrub?: number | boolean
  pin?: boolean
  start?: string
  end?: string
}

export function useScrollTimeline({
  triggerRef,
  onProgress,
  scrub = 1,
  pin = true,
  start = "top top",
  end = "bottom bottom",
}: ScrollTimelineOptions) {
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  const getTimeline = useCallback(() => tlRef.current, [])

  useEffect(() => {
    if (!triggerRef.current) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerRef.current,
        start,
        end,
        scrub,
        pin,
        onUpdate: (self) => {
          onProgress?.(self.progress)
        },
      },
    })

    tlRef.current = tl

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [triggerRef, onProgress, scrub, pin, start, end])

  return { getTimeline }
}

export { ScrollTrigger }
