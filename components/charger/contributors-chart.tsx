"use client";

import { cn } from "@/lib/utils";
import type { Contributor } from "@/lib/types";
import {
  Flame,
  Gauge,
  Thermometer,
  TrendingDown,
  BarChart2,
  Info,
} from "lucide-react";
import { useState } from "react";

interface ContributorsChartProps {
  contributors: Contributor[];
}

const FEATURE_META: Record<
  string,
  { label: string; icon: React.ElementType; description: string }
> = {
  thermal_stress: {
    label: "Thermal Stress",
    icon: Flame,
    description: "Cumulative thermal load from sustained high temperatures",
  },
  risk_pressure: {
    label: "Risk Pressure",
    icon: Gauge,
    description: "Composite risk signal from multiple degradation vectors",
  },
  temperature: {
    label: "Temperature",
    icon: Thermometer,
    description: "Current operating temperature reading",
  },
  voltage_deviation: {
    label: "Voltage Dev.",
    icon: TrendingDown,
    description: "Standard deviation from nominal voltage",
  },
  error_density: {
    label: "Error Density",
    icon: BarChart2,
    description: "Frequency of error events per operating hour",
  },
};

const BAR_COLORS = [
  "bg-critical",
  "bg-warning",
  "bg-primary",
  "bg-chart-2",
  "bg-chart-3",
];

const BAR_BG_COLORS = [
  "bg-critical/15",
  "bg-warning/15",
  "bg-primary/15",
  "bg-chart-2/15",
  "bg-chart-3/15",
];

export function ContributorsChart({ contributors }: ContributorsChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Generate a plain-English explanation
  const topTwo = contributors.slice(0, 2);
  const explanation = `Risk is primarily driven by ${topTwo
    .map(
      (c) =>
        `${(FEATURE_META[c.name]?.label || c.name).toLowerCase()} (${c.percent}%)`
    )
    .join(" and ")}. ${
    topTwo[0]?.percent > 25
      ? "This indicates sustained degradation that may accelerate failure."
      : "Multiple factors are contributing to elevated risk."
  }`;

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 animate-fade-in">
      <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">
        Why Flagged -- Top Contributors
      </h2>

      {/* Horizontal bars */}
      <div className="flex flex-col gap-3 mb-6">
        {contributors.map((c, i) => {
          const meta = FEATURE_META[c.name] || {
            label: c.name,
            icon: BarChart2,
            description: "",
          };
          const Icon = meta.icon;
          const isHovered = hoveredIdx === i;

          return (
            <div
              key={c.name}
              className="group"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex items-center justify-center w-6 h-6 rounded-lg transition-colors",
                      BAR_BG_COLORS[i % BAR_BG_COLORS.length]
                    )}
                  >
                    <Icon className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <span className="text-xs font-medium text-foreground">
                    {meta.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {c.value}
                  </span>
                  <span className="text-xs font-bold font-mono text-foreground tabular-nums w-12 text-right">
                    {c.percent}%
                  </span>
                </div>
              </div>
              {/* Bar */}
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-700 ease-out",
                    BAR_COLORS[i % BAR_COLORS.length],
                    isHovered && "opacity-80"
                  )}
                  style={{
                    width: `${Math.min(c.percent, 100)}%`,
                  }}
                />
              </div>
              {/* Tooltip on hover */}
              {isHovered && meta.description && (
                <div className="mt-1.5 px-3 py-2 rounded-lg bg-secondary/60 animate-fade-in-scale">
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {meta.description}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Plain-English explanation */}
      <div className="flex gap-3 p-3.5 rounded-xl bg-primary/5 border border-primary/10">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          {explanation}
        </p>
      </div>
    </div>
  );
}
