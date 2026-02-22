"use client";

import { cn } from "@/lib/utils";
import type { ChargerDetail } from "@/lib/types";
import { AlertTriangle, Clock, DollarSign, Shield, Gauge } from "lucide-react";

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

export function RiskSummary({ charger }: RiskSummaryProps) {
  const riskPercent = (charger.risk_probability * 100).toFixed(1);

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-5">
        Risk Assessment
      </h2>

      {/* Risk gauge */}
      <div className="flex items-center gap-4 mb-6">
        <div
          className={cn(
            "relative flex items-center justify-center w-20 h-20 rounded-full border-4",
            charger.risk_level === "critical"
              ? "border-critical"
              : charger.risk_level === "warning"
                ? "border-warning"
                : "border-safe"
          )}
        >
          <span
            className={cn(
              "text-xl font-bold font-mono",
              charger.risk_level === "critical"
                ? "text-critical"
                : charger.risk_level === "warning"
                  ? "text-warning"
                  : "text-safe"
            )}
          >
            {riskPercent}
          </span>
          <span className="absolute -bottom-1 text-[10px] text-muted-foreground">
            %
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span
            className={cn(
              "text-sm font-semibold capitalize",
              charger.risk_level === "critical"
                ? "text-critical"
                : charger.risk_level === "warning"
                  ? "text-warning"
                  : "text-safe"
            )}
          >
            {charger.risk_level} Risk
          </span>
          <span className="text-xs text-muted-foreground">
            {CONFIDENCE_LABELS[charger.confidence]}
          </span>
        </div>
      </div>

      {/* Details grid */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary">
            <AlertTriangle className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Flagged Status</p>
            <p className="text-sm font-medium text-foreground">
              {charger.flagged ? "Flagged for action" : "Not flagged"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary">
            <Clock className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              Time to Failure
            </p>
            <p
              className={cn(
                "text-sm font-medium",
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

        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Estimated Savings</p>
            <p className="text-sm font-semibold text-safe">
              ${charger.estimated_savings_usd.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary">
            <Shield className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Confidence</p>
            <p className="text-sm font-medium text-foreground capitalize">
              {charger.confidence}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
