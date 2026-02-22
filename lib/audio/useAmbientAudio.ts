"use client"

import { useRef, useState, useCallback, useEffect } from "react"

export function useAmbientAudio() {
  const ctxRef = useRef<AudioContext | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const nodesRef = useRef<OscillatorNode[]>([])
  const [isMuted, setIsMuted] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  const init = useCallback(() => {
    if (isInitialized) return
    try {
      const ctx = new AudioContext()
      const masterGain = ctx.createGain()
      masterGain.gain.value = 0
      masterGain.connect(ctx.destination)

      // Deep ambient drone (ocean/wind hum)
      const osc1 = ctx.createOscillator()
      osc1.type = "sine"
      osc1.frequency.value = 60
      const g1 = ctx.createGain()
      g1.gain.value = 0.15
      osc1.connect(g1)
      g1.connect(masterGain)
      osc1.start()

      // Higher harmonic shimmer
      const osc2 = ctx.createOscillator()
      osc2.type = "sine"
      osc2.frequency.value = 180
      const g2 = ctx.createGain()
      g2.gain.value = 0.04
      osc2.connect(g2)
      g2.connect(masterGain)
      osc2.start()

      // Subtle data hum
      const osc3 = ctx.createOscillator()
      osc3.type = "triangle"
      osc3.frequency.value = 440
      const g3 = ctx.createGain()
      g3.gain.value = 0.01
      osc3.connect(g3)
      g3.connect(masterGain)
      osc3.start()

      // LFO for gentle volume pulsing
      const lfo = ctx.createOscillator()
      lfo.type = "sine"
      lfo.frequency.value = 0.1
      const lfoGain = ctx.createGain()
      lfoGain.gain.value = 0.02
      lfo.connect(lfoGain)
      lfoGain.connect(g1.gain)
      lfo.start()

      ctxRef.current = ctx
      gainRef.current = masterGain
      nodesRef.current = [osc1, osc2, osc3, lfo]
      setIsInitialized(true)
    } catch {
      // Web Audio not supported
    }
  }, [isInitialized])

  const toggle = useCallback(() => {
    if (!isInitialized) {
      init()
      setIsMuted(false)
      setTimeout(() => {
        if (gainRef.current) {
          gainRef.current.gain.linearRampToValueAtTime(
            0.6,
            (ctxRef.current?.currentTime ?? 0) + 1
          )
        }
      }, 100)
      return
    }
    if (gainRef.current && ctxRef.current) {
      const now = ctxRef.current.currentTime
      if (isMuted) {
        gainRef.current.gain.linearRampToValueAtTime(0.6, now + 0.5)
      } else {
        gainRef.current.gain.linearRampToValueAtTime(0, now + 0.5)
      }
    }
    setIsMuted((m) => !m)
  }, [isMuted, isInitialized, init])

  useEffect(() => {
    return () => {
      nodesRef.current.forEach((n) => {
        try {
          n.stop()
        } catch {
          /* already stopped */
        }
      })
      ctxRef.current?.close()
    }
  }, [])

  return { isMuted, toggle }
}
