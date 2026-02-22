"use client";

import { cn } from "@/lib/utils";
import type { ChargerDetail } from "@/lib/types";
import { AlertTriangle, Clock, DollarSign, Shield, MapPin } from "lucide-react";

interface RiskSummaryProps {
  charger: ChargerDetail;
}

const TTF_LABELS: Record<string, string> = {
  within_24h: "Within 24 hours",
  within_1_week: "Within 1 week",
  none: "No imminent risk",
};

const CONFIDENCE_LABELS: Record<string, string> = {
  high: "High Confidence",
  medium: "Medium Confidence",
  low: "Low Confidence",
};

// Mock locations for added realism
const MOCK_LOCATIONS: Record<string, string> = {
  "CHG-000001": "San Francisco, CA",
  "CHG-000042": "Los Angeles, CA",
  "CHG-000137": "Portland, OR",
  "CHG-000003": "Seattle, WA",
};

function AnimatedGauge({
  percent,
  level,
}: {
  percent: number;
  level: string;
}) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokePercent = Math.min(percent, 100) / 100;
  const offset = circumference * (1 - strokePercent);

  const colorClass =
    level === "critical"
      ? "stroke-critical"
      : level === "warning"
        ? "stroke-warning"
        : "stroke-safe";

  const glowColor =
    level === "critical"
      ? "var(--critical)"
      : level === "warning"
        ? "var(--warning)"
        : "var(--safe)";

  return (
    <div className="relative flex items-center justify-center w-36 h-36">
      <svg
        width="144"
        height="144"
        viewBox="0 0 144 144"
        className="-rotate-90"
      >
        <defs>
          <filter id="gauge-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Background track */}
        <circle
          cx="72"
          cy="72"
          r={radius}
          fill="none"
          stroke="var(--secondary)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Animated progress arc */}
        <circle
          cx="72"
          cy="72"
          r={radius}
          fill="none"
          className={cn(colorClass, "gauge-animated")}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          filter="url(#gauge-glow)"
          style={
            {
              "--gauge-circumference": circumference,
              "--gauge-offset": offset,
            } as React.CSSProperties
          }
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn(
            "text-3xl font-black font-mono tracking-tighter",
            level === "critical"
              ? "text-critical"
              : level === "warning"
                ? "text-warning"
                : "text-safe"
          )}
        >
          {percent.toFixed(1)}
        </span>
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest -mt-0.5">
          risk %
        </span>
      </div>
    </div>
  );
}

function ConfidenceBand({ confidence }: { confidence: string }) {
  const levels = ["low", "medium", "high"];
  const idx = levels.indexOf(confidence);

  return (
    <div className="flex items-center gap-1.5">
      {levels.map((l, i) => (
        <div
          key={l}
          className={cn(
            "h-1.5 flex-1 rounded-full transition-colors",
            i <= idx ? "bg-primary" : "bg-secondary"
          )}
        />
      ))}
    </div>
  );
}

export function RiskSummary({ charger }: RiskSummaryProps) {
  const riskPercent = charger.risk_probability * 100;
  const location = MOCK_LOCATIONS[charger.charger_id] || "Austin, TX";

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 animate-fade-in">
      <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">
        Risk Assessment
      </h2>

      {/* Gauge */}
      <div className="flex justify-center mb-6">
        <AnimatedGauge percent={riskPercent} level={charger.risk_level} />
      </div>

      {/* Location mock */}
      <div className="flex items-center gap-2 mb-6 px-1">
        <MapPin className="w-3.5 h-3.5 text-muted-foreground/60" />
        <span className="text-xs text-muted-foreground">{location}</span>
        <span className="text-[9px] text-muted-foreground/40 ml-auto">
          Updated 4s ago
        </span>
      </div>

      {/* Info rows */}
      <div className="flex flex-col gap-3.5">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-background/50">
            <Clock className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/70 font-semibold">
              Time to Failure
            </p>
            <p
              className={cn(
                "text-sm font-bold",
                charger.time_to_failure === "within_24h"
                  ? "text-critical"
                  : charger.time_to_failure === "within_1_week"
                    ? "text-warning"
                    : "text-foreground"
              )}
            >
              {TTF_LABELS[charger.time_to_failure]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-background/50">
            <Shield className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/70 font-semibold">
              Confidence
            </p>
            <p className="text-sm font-bold text-foreground capitalize mb-1">
              {CONFIDENCE_LABELS[charger.confidence]}
            </p>
            <ConfidenceBand confidence={charger.confidence} />
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-background/50">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/70 font-semibold">
              Estimated Savings
            </p>
            <p className="text-sm font-black text-safe font-mono">
              ${charger.estimated_savings_usd.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-background/50">
            <AlertTriangle className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/70 font-semibold">
              Flagged Status
            </p>
            <p className="text-sm font-bold text-foreground">
              {charger.flagged ? "Flagged for action" : "Not flagged"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
