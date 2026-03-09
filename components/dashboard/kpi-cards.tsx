"use client";

import { cn } from "@/lib/utils";
import type { FleetSummary } from "@/lib/types";
import {
  Zap,
  AlertTriangle,
  AlertOctagon,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface KpiCardsProps {
  data: FleetSummary | undefined;
  isLoading: boolean;
}

function formatUsd(amount: number): string {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(2)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount.toFixed(0)}`;
}

function formatNumber(num: number): string {
  return num.toLocaleString();
}

// Generates a small static sparkline SVG from seeded values
function Sparkline({ seed, color }: { seed: number; color: string }) {
  const points: number[] = [];
  let s = seed;
  for (let i = 0; i < 12; i++) {
    s = (s * 16807 + 0) % 2147483647;
    points.push((s / 2147483647) * 20 + 5);
  }
  const maxY = 30;
  const w = 80;
  const step = w / (points.length - 1);
  const d = points
    .map((y, i) => `${i === 0 ? "M" : "L"}${i * step},${maxY - y}`)
    .join(" ");

  return (
    <svg
      width={w}
      height={maxY}
      viewBox={`0 0 ${w} ${maxY}`}
      className="opacity-40"
      aria-hidden
    >
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="sparkline-path"
      />
    </svg>
  );
}

const KPIS = [
  {
    key: "total_chargers" as const,
    label: "Total Chargers",
    icon: Zap,
    format: formatNumber,
    colorClass: "text-primary",
    bgClass: "bg-primary/10",
    sparkColor: "var(--primary)",
    delta: "+124",
    deltaUp: true,
    seed: 42,
  },
  {
    key: "flagged_count" as const,
    label: "Flagged",
    icon: AlertTriangle,
    format: formatNumber,
    colorClass: "text-warning",
    bgClass: "bg-warning/10",
    sparkColor: "var(--warning)",
    delta: "+18",
    deltaUp: true,
    seed: 77,
  },
  {
    key: "critical_count" as const,
    label: "Critical",
    icon: AlertOctagon,
    format: formatNumber,
    colorClass: "text-critical",
    bgClass: "bg-critical/10",
    sparkColor: "var(--critical)",
    delta: "-3",
    deltaUp: false,
    seed: 123,
  },
  {
    key: "total_potential_savings_usd" as const,
    label: "Potential Savings",
    icon: DollarSign,
    format: formatUsd,
    colorClass: "text-safe",
    bgClass: "bg-safe/10",
    sparkColor: "var(--safe)",
    delta: "+$42K",
    deltaUp: true,
    seed: 256,
  },
];

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between">
        <div className="h-3 w-20 rounded-full skeleton-shimmer" />
        <div className="w-9 h-9 rounded-xl skeleton-shimmer" />
      </div>
      <div className="h-8 w-24 rounded-lg skeleton-shimmer" />
      <div className="h-3 w-16 rounded-full skeleton-shimmer" />
    </div>
  );
}

export function KpiCards({ data, isLoading }: KpiCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
      {KPIS.map((kpi) => {
        const value = data ? data[kpi.key] : 0;
        return (
          <div
            key={kpi.key}
            className="group relative flex flex-col gap-1 p-5 rounded-2xl border border-border/60 bg-card hover:border-border hover:shadow-lg hover:shadow-background/20 transition-all duration-300 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {kpi.label}
              </span>
              <div
                className={cn(
                  "flex items-center justify-center w-9 h-9 rounded-xl transition-transform duration-300 group-hover:scale-110",
                  kpi.bgClass
                )}
              >
                <kpi.icon className={cn("w-4 h-4", kpi.colorClass)} />
              </div>
            </div>

            <span className="text-[28px] font-bold tracking-tight text-card-foreground font-mono leading-none">
              {kpi.format(value)}
            </span>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1.5">
                {kpi.deltaUp ? (
                  <TrendingUp className="w-3 h-3 text-safe" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-safe" />
                )}
                <span className="text-[11px] font-medium text-safe">
                  {kpi.delta}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  vs yesterday
                </span>
              </div>
            </div>

            {/* Sparkline positioned bottom-right */}
            <div className="absolute bottom-2 right-3 pointer-events-none">
              <Sparkline seed={kpi.seed} color={kpi.sparkColor} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
