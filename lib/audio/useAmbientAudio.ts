"use client";

import { useRef, useState, useCallback, useEffect } from "react";

/**
 * Creates a procedural ambient audio hum using the Web Audio API.
 * No external audio files needed -- generates a low, airy tone with
 * filtered noise that sounds like a distant data-center / wind mix.
 */
export function useAmbientAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const [muted, setMuted] = useState(true);
  const startedRef = useRef(false);

  const init = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const ctx = new AudioContext();
    ctxRef.current = ctx;

    const gain = ctx.createGain();
    gain.gain.value = 0;
    gainRef.current = gain;

    // Low oscillator -- warm hum
    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.value = 80;
    const osc1Gain = ctx.createGain();
    osc1Gain.gain.value = 0.06;
    osc1.connect(osc1Gain).connect(gain);
    osc1.start();

    // Sub bass
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = 40;
    const osc2Gain = ctx.createGain();
    osc2Gain.gain.value = 0.04;
    osc2.connect(osc2Gain).connect(gain);
    osc2.start();

    // Filtered noise -- "wind"
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 400;
    filter.Q.value = 1;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.03;
    noise.connect(filter).connect(noiseGain).connect(gain);
    noise.start();

    gain.connect(ctx.destination);
  }, []);

  const toggle = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      if (!startedRef.current) init();
      const gain = gainRef.current;
      const ctx = ctxRef.current;
      if (gain && ctx) {
        if (ctx.state === "suspended") ctx.resume();
        gain.gain.cancelScheduledValues(ctx.currentTime);
        gain.gain.setTargetAtTime(
          next ? 0 : 1,
          ctx.currentTime,
          0.3
        );
      }
      return next;
    });
  }, [init]);

  useEffect(() => {
    return () => {
      ctxRef.current?.close();
    };
  }, []);

  return { muted, toggle };
}
