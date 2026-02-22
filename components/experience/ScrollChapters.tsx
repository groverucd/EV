"use client"

import { useRef, useEffect, useState } from "react"
import {
  Activity,
  BarChart3,
  Zap,
  TrendingUp,
  Shield,
  AlertTriangle,
} from "lucide-react"

interface ScrollChaptersProps {
  scrollProgress: number
}

/* ═══════════════════════════════════════════
   Micro-animations for each chapter
   ═══════════════════════════════════════════ */

function MiniChart() {
  const [bars, setBars] = useState([20, 45, 30, 60, 50, 80, 70])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setBars((prev) =>
        prev.map((b) => Math.max(15, Math.min(95, b + (Math.random() - 0.4) * 20)))
      )
    }, 800)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <div className="flex items-end gap-1 h-16 px-2">
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-2 rounded-t-sm transition-all duration-700 ease-out"
          style={{
            height: `${h}%`,
            backgroundColor:
              h > 65
                ? "hsl(199 89% 48%)"
                : h > 40
                  ? "hsl(199 89% 48% / 0.6)"
                  : "hsl(220 14% 30%)",
          }}
        />
      ))}
    </div>
  )
}

function FeatureBars() {
  const features = [
    { label: "Temperature", value: 85, color: "hsl(0 72% 51%)" },
    { label: "Throughput", value: 62, color: "hsl(36 95% 55%)" },
    { label: "Voltage", value: 91, color: "hsl(199 89% 48%)" },
    { label: "Age Factor", value: 45, color: "hsl(220 14% 40%)" },
  ]

  return (
    <div className="flex flex-col gap-2 w-full max-w-xs">
      {features.map((f) => (
        <div key={f.label} className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-muted-foreground">
              {f.label}
            </span>
            <span className="text-xs font-mono text-foreground">{f.value}%</span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${f.value}%`,
                backgroundColor: f.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function PlaybookCard() {
  return (
    <div className="glass-panel p-4 flex flex-col gap-3 max-w-xs">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Zap size={16} className="text-primary" />
        </div>
        <div>
          <p className="text-sm font-sans font-medium text-foreground">
            Auto-dispatch Crew
          </p>
          <p className="text-xs text-muted-foreground">Playbook #14</p>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        {["Isolate charger", "Notify operator", "Route technician"].map(
          (step, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-[10px] font-mono text-primary">
                  {i + 1}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">{step}</span>
            </div>
          )
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   Main chapters component
   ═══════════════════════════════════════════ */

const chapters = [
  {
    id: "predict",
    range: [0.15, 0.35] as [number, number],
    icon: Activity,
    accent: TrendingUp,
    title: "Predict Failures",
    description:
      "Machine learning models analyze telemetry from every charger, detecting anomalies 72 hours before failures occur.",
    stat: "72h",
    statLabel: "early warning",
    visual: "chart" as const,
  },
  {
    id: "explain",
    range: [0.4, 0.6] as [number, number],
    icon: BarChart3,
    accent: AlertTriangle,
    title: "Explain Causes",
    description:
      "SHAP-powered feature attribution reveals the root cause of every predicted failure with full transparency.",
    stat: "94%",
    statLabel: "accuracy",
    visual: "features" as const,
  },
  {
    id: "act",
    range: [0.65, 0.85] as [number, number],
    icon: Zap,
    accent: Shield,
    title: "Act with Copilot",
    description:
      "Intelligent playbooks automatically dispatch crews and isolate at-risk chargers before downtime impacts your fleet.",
    stat: "< 4min",
    statLabel: "response time",
    visual: "playbook" as const,
  },
]

export function ScrollChapters({ scrollProgress }: ScrollChaptersProps) {
  return (
    <div className="fixed inset-0 z-30 pointer-events-none flex items-center justify-start">
      {chapters.map((ch) => {
        const visible =
          scrollProgress >= ch.range[0] && scrollProgress <= ch.range[1]
        const internalProgress =
          (scrollProgress - ch.range[0]) / (ch.range[1] - ch.range[0])

        return (
          <div
            key={ch.id}
            className="absolute inset-0 flex items-center transition-all duration-500"
            style={{
              opacity: visible ? 1 : 0,
              pointerEvents: visible ? "auto" : "none",
            }}
          >
            <div
              className="ml-6 md:ml-16 max-w-sm flex flex-col gap-5"
              style={{
                transform: visible
                  ? "translateY(0)"
                  : "translateY(40px)",
                transition: "transform 0.6s ease-out",
              }}
            >
              {/* Icon row */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <ch.icon size={20} className="text-primary" />
                </div>
                <div className="h-px flex-1 bg-border/50" />
                <ch.accent size={14} className="text-muted-foreground" />
              </div>

              {/* Copy */}
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-sans font-bold text-foreground md:text-3xl text-balance">
                  {ch.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
                  {ch.description}
                </p>
              </div>

              {/* Stat */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-mono font-bold text-primary">
                  {ch.stat}
                </span>
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  {ch.statLabel}
                </span>
              </div>

              {/* Visual */}
              <div
                className="glass-panel p-3 overflow-hidden"
                style={{
                  opacity: internalProgress > 0.2 ? 1 : 0,
                  transform: `translateY(${internalProgress > 0.2 ? 0 : 20}px)`,
                  transition: "all 0.6s ease-out 0.2s",
                }}
              >
                {ch.visual === "chart" && <MiniChart />}
                {ch.visual === "features" && <FeatureBars />}
                {ch.visual === "playbook" && <PlaybookCard />}
              </div>

              {/* Progress indicator for this chapter */}
              <div className="h-0.5 w-full bg-muted/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary/60 rounded-full transition-all duration-100"
                  style={{
                    width: `${Math.max(0, Math.min(100, internalProgress * 100))}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
