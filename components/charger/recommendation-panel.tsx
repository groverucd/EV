"use client";

import { cn } from "@/lib/utils";
import type { ChargerDetail } from "@/lib/types";
import {
  BotMessageSquare,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";

interface RecommendationPanelProps {
  charger: ChargerDetail;
}

const URGENCY_CONFIG = {
  immediate: {
    label: "Immediate Action Required",
    icon: AlertCircle,
    colorClass: "text-critical",
    bgClass: "bg-critical/10",
    borderClass: "border-critical/30",
  },
  soon: {
    label: "Action Needed Soon",
    icon: Info,
    colorClass: "text-warning",
    bgClass: "bg-warning/10",
    borderClass: "border-warning/30",
  },
  monitor: {
    label: "Continue Monitoring",
    icon: CheckCircle2,
    colorClass: "text-safe",
    bgClass: "bg-safe/10",
    borderClass: "border-safe/30",
  },
};

export function RecommendationPanel({ charger }: RecommendationPanelProps) {
  const { recommendation } = charger;
  const urgency = URGENCY_CONFIG[recommendation.urgency];
  const UrgencyIcon = urgency.icon;

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
          <BotMessageSquare className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Copilot Recommendation
        </h2>
      </div>

      {/* Urgency banner */}
      <div
        className={cn(
          "flex items-center gap-2 px-4 py-3 rounded-lg border mb-5",
          urgency.bgClass,
          urgency.borderClass
        )}
      >
        <UrgencyIcon className={cn("w-4 h-4 shrink-0", urgency.colorClass)} />
        <span className={cn("text-sm font-semibold", urgency.colorClass)}>
          {urgency.label}
        </span>
      </div>

      {/* Summary */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-6">
        {recommendation.summary}
      </p>

      {/* Diagnosis */}
      {recommendation.diagnosis.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Diagnosis
          </h3>
          <div className="flex flex-col gap-2">
            {recommendation.diagnosis.map((d, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-secondary/50"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {d.cause}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({d.percent}%)
                  </span>
                </div>
                <span className="text-xs font-mono text-muted-foreground">
                  {d.evidence}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Recommended Actions
        </h3>
        <ol className="flex flex-col gap-2">
          {recommendation.actions.map((action, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-semibold shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-sm text-foreground leading-relaxed">
                {action}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
