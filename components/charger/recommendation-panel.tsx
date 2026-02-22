"use client";

import { cn } from "@/lib/utils";
import type { ChargerDetail } from "@/lib/types";
import { useState } from "react";
import {
  BotMessageSquare,
  CheckCircle2,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronRight,
  Play,
  Clock,
  DollarSign,
  Sparkles,
} from "lucide-react";

interface RecommendationPanelProps {
  charger: ChargerDetail;
}

const URGENCY_CONFIG = {
  immediate: {
    label: "Immediate Action Required",
    icon: AlertCircle,
    colorClass: "text-critical",
    bgClass: "bg-critical/8",
    borderClass: "border-critical/20",
    ringClass: "ring-critical/20",
  },
  soon: {
    label: "Action Needed Soon",
    icon: Info,
    colorClass: "text-warning",
    bgClass: "bg-warning/8",
    borderClass: "border-warning/20",
    ringClass: "ring-warning/20",
  },
  monitor: {
    label: "Continue Monitoring",
    icon: CheckCircle2,
    colorClass: "text-safe",
    bgClass: "bg-safe/8",
    borderClass: "border-safe/20",
    ringClass: "ring-safe/20",
  },
};

// Mock data for playbook cards
const ACTION_META = [
  { downtime: "4-6 hours", savings: "$380" },
  { downtime: "1-2 hours", savings: "$220" },
  { downtime: "30 min", savings: "$140" },
  { downtime: "15 min", savings: "$80" },
];

const WHY_REASONS = [
  "Historical pattern shows 87% correlation with failure within 48h when this metric exceeds threshold.",
  "Similar chargers with this profile have benefited from this intervention, reducing failure rate by 64%.",
  "Upstream voltage instability compounds thermal stress. Addressing both reduces cascading risk.",
  "Routine maintenance at this stage prevents costly emergency dispatch ($2.4K avg).",
];

function PlaybookCard({
  action,
  index,
}: {
  action: string;
  index: number;
  urgency: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const meta = ACTION_META[index % ACTION_META.length];
  const why = WHY_REASONS[index % WHY_REASONS.length];

  return (
    <div
      className={cn(
        "rounded-xl border border-border/40 bg-secondary/20 overflow-hidden transition-all duration-200",
        expanded && "ring-1 ring-primary/20"
      )}
    >
      <div className="flex items-start gap-3 p-4">
        <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-primary/10 text-primary text-xs font-bold shrink-0 mt-0.5">
          {index + 1}
        </span>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground leading-relaxed">
            {action}
          </p>

          <div className="flex items-center gap-4 mt-2.5">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span className="text-[10px] font-medium">
                {meta.downtime} downtime
              </span>
            </div>
            <div className="flex items-center gap-1 text-safe">
              <DollarSign className="w-3 h-3" />
              <span className="text-[10px] font-bold">
                {meta.savings} saved
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-center w-7 h-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label={expanded ? "Collapse" : "Expand reason"}
          >
            {expanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[11px] font-semibold hover:bg-primary/20 transition-colors active:scale-95">
            <Play className="w-3 h-3" />
            Run
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-0 animate-fade-in-scale">
          <div className="flex gap-2.5 p-3 rounded-lg bg-primary/5 border border-primary/10 ml-9">
            <Sparkles className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">
                Why this action
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {why}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function RecommendationPanel({ charger }: RecommendationPanelProps) {
  const { recommendation } = charger;
  const urgency = URGENCY_CONFIG[recommendation.urgency];
  const UrgencyIcon = urgency.icon;

  return (
    <div className="rounded-2xl border border-border/60 bg-card overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border/40">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10">
          <BotMessageSquare className="w-[18px] h-[18px] text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-foreground">
            Copilot Recommendation
          </h2>
          <p className="text-[10px] text-muted-foreground">
            AI-generated maintenance playbook
          </p>
        </div>
      </div>

      <div className="p-6">
        {/* Urgency banner */}
        <div
          className={cn(
            "flex items-center gap-2.5 px-4 py-3 rounded-xl border mb-6",
            urgency.bgClass,
            urgency.borderClass
          )}
        >
          <UrgencyIcon
            className={cn("w-4 h-4 shrink-0", urgency.colorClass)}
          />
          <span className={cn("text-sm font-bold", urgency.colorClass)}>
            {urgency.label}
          </span>
        </div>

        {/* Two column: Diagnosis + Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Diagnosis */}
          <div className="lg:col-span-2">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Diagnosis
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {recommendation.summary}
            </p>

            {recommendation.diagnosis.length > 0 && (
              <div className="flex flex-col gap-2">
                {recommendation.diagnosis.map((d, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-secondary/40"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-critical" />
                      <span className="text-xs font-semibold text-foreground">
                        {d.cause}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {d.percent}%
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {d.evidence}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions as playbook cards */}
          <div className="lg:col-span-3">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Recommended Actions
            </h3>
            <div className="flex flex-col gap-2.5">
              {recommendation.actions.map((action, i) => (
                <PlaybookCard
                  key={i}
                  action={action}
                  index={i}
                  urgency={recommendation.urgency}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
