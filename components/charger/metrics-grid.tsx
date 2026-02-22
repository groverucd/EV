"use client";

import { cn } from "@/lib/utils";
import type { ChargerMetrics } from "@/lib/types";
import {
  Thermometer,
  Zap,
  Clock,
  AlertTriangle,
  Flame,
  TrendingDown,
  BarChart2,
  Gauge,
} from "lucide-react";

interface MetricsGridProps {
  metrics: ChargerMetrics;
}

interface MetricDef {
  key: keyof ChargerMetrics;
  label: string;
  unit: string;
  icon: React.ElementType;
  min: number;
  max: number;
  threshold: number;
  seed: number;
}

const METRIC_CONFIG: MetricDef[] = [
  { key: "temperature", label: "Temperature", unit: "°C", icon: Thermometer, min: 20, max: 100, threshold: 80, seed: 11 },
  { key: "voltage", label: "Voltage", unit: "V", icon: Zap, min: 180, max: 260, threshold: 240, seed: 22 },
  { key: "usage_hours", label: "Usage Hours", unit: "hrs", icon: Clock, min: 0, max: 1000, threshold: 800, seed: 33 },
  { key: "error_count", label: "Error Count", unit: "", icon: AlertTriangle, min: 0, max: 15, threshold: 8, seed: 44 },
  { key: "thermal_stress", label: "Thermal Stress", unit: "", icon: Flame, min: 0, max: 100, threshold: 70, seed: 55 },
  { key: "voltage_deviation", label: "Voltage Dev.", unit: "V", icon: TrendingDown, min: 0, max: 25, threshold: 15, seed: 66 },
  { key: "error_density", label: "Error Density", unit: "", icon: BarChart2, min: 0, max: 0.05, threshold: 0.02, seed: 77 },
  { key: "risk_pressure", label: "Risk Pressure", unit: "", icon: Gauge, min: 0, max: 1, threshold: 0.6, seed: 88 },
];

function MiniSparkline({ seed }: { seed: number }) {
  const points: number[] = [];
  let s = seed;
  for (let i = 0; i < 8; i++) {
    s = (s * 16807 + 0) % 2147483647;
    points.push((s / 2147483647) * 16 + 4);
  }
  const maxY = 24;
  const w = 48;
  const step = w / (points.length - 1);
  const d = points
    .map((y, i) => `${i === 0 ? "M" : "L"}${i * step},${maxY - y}`)
    .join(" ");

  return (
    <svg width={w} height={maxY} viewBox={`0 0 ${w} ${maxY}`} className="opacity-30" aria-hidden>
      <path d={d} fill="none" stroke="var(--muted-foreground)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="sparkline-path" />
    </svg>
  );
}

function ThresholdBar({
  value,
  min,
  max,
  threshold,
}: {
  value: number;
  min: number;
  max: number;
  threshold: number;
}) {
  const range = max - min;
  const valuePct = Math.min(((value - min) / range) * 100, 100);
  const thresholdPct = ((threshold - min) / range) * 100;
  const isAbove = value >= threshold;

  return (
    <div className="relative h-1 rounded-full bg-secondary mt-2">
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500",
          isAbove ? "bg-critical/80" : "bg-safe/60"
        )}
        style={{ width: `${valuePct}%` }}
      />
      {/* Threshold marker */}
      <div
        className="absolute top-1/2 -translate-y-1/2 w-0.5 h-3 bg-muted-foreground/40 rounded-full"
        style={{ left: `${thresholdPct}%` }}
      />
    </div>
  );
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 animate-fade-in">
      <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-5">
        Charger Metrics
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 stagger-children">
        {METRIC_CONFIG.map((m) => {
          const value = metrics[m.key];
          const isAbove = value >= m.threshold;

          return (
            <div
              key={m.key}
              className={cn(
                "relative flex flex-col p-3.5 rounded-xl bg-secondary/30 border border-transparent overflow-hidden transition-colors",
                isAbove && "border-critical/20 bg-critical/[0.03]"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <m.icon className={cn("w-3 h-3", isAbove ? "text-critical" : "text-muted-foreground")} />
                  <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold">
                    {m.label}
                  </span>
                </div>
              </div>

              <div className="flex items-end justify-between">
                <span className={cn("text-xl font-black font-mono tabular-nums", isAbove ? "text-critical" : "text-foreground")}>
                  {typeof value === "number" && value % 1 !== 0
                    ? value.toFixed(value < 1 ? 3 : 1)
                    : value}
                  {m.unit && (
                    <span className="text-[10px] font-normal text-muted-foreground ml-0.5">
                      {m.unit}
                    </span>
                  )}
                </span>
                <MiniSparkline seed={m.seed} />
              </div>

              {/* Min/Max range */}
              <div className="flex items-center justify-between mt-1">
                <span className="text-[8px] font-mono text-muted-foreground/50">
                  {m.min}
                </span>
                <span className="text-[8px] font-mono text-muted-foreground/50">
                  {m.max}
                </span>
              </div>

              <ThresholdBar
                value={value}
                min={m.min}
                max={m.max}
                threshold={m.threshold}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
