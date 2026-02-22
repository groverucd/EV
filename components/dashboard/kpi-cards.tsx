"use client";

import { cn } from "@/lib/utils";
import type { FleetSummary } from "@/lib/types";
import {
  Zap,
  AlertTriangle,
  AlertOctagon,
  DollarSign,
  Shield,
} from "lucide-react";

interface KpiCardsProps {
  data: FleetSummary | undefined;
  isLoading: boolean;
}

function formatUsd(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount.toFixed(0)}`;
}

function formatNumber(num: number): string {
  return num.toLocaleString();
}

const KPIS = [
  {
    key: "total_chargers" as const,
    label: "Total Chargers",
    icon: Zap,
    format: formatNumber,
    colorClass: "text-primary",
    bgClass: "bg-primary/10",
  },
  {
    key: "flagged_count" as const,
    label: "Flagged for Action",
    icon: AlertTriangle,
    format: formatNumber,
    colorClass: "text-warning",
    bgClass: "bg-warning/10",
  },
  {
    key: "critical_count" as const,
    label: "Critical",
    icon: AlertOctagon,
    format: formatNumber,
    colorClass: "text-critical",
    bgClass: "bg-critical/10",
  },
  {
    key: "total_potential_savings_usd" as const,
    label: "Potential Savings",
    icon: DollarSign,
    format: formatUsd,
    colorClass: "text-safe",
    bgClass: "bg-safe/10",
  },
];

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3 p-5 rounded-xl border border-border bg-card animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-3 w-24 rounded bg-muted" />
        <div className="w-9 h-9 rounded-lg bg-muted" />
      </div>
      <div className="h-8 w-20 rounded bg-muted" />
    </div>
  );
}

export function KpiCards({ data, isLoading }: KpiCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {KPIS.map((kpi) => {
        const value = data ? data[kpi.key] : 0;
        return (
          <div
            key={kpi.key}
            className="flex flex-col gap-3 p-5 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {kpi.label}
              </span>
              <div
                className={cn(
                  "flex items-center justify-center w-9 h-9 rounded-lg transition-colors",
                  kpi.bgClass,
                  "group-hover:scale-105"
                )}
              >
                <kpi.icon className={cn("w-4 h-4", kpi.colorClass)} />
              </div>
            </div>
            <span className="text-2xl font-bold tracking-tight text-card-foreground">
              {kpi.format(value)}
            </span>
          </div>
        );
      })}
      {/* Model badge card */}
      {data && (
        <div className="sm:col-span-2 lg:col-span-4 flex items-center gap-3 px-5 py-3 rounded-xl border border-border bg-card">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-xs text-muted-foreground">
            Model {data.model_version} | Threshold: {data.model_threshold} |
            Failure Recall:{" "}
            <span className="text-safe font-semibold">
              {(data.primary_metric.failure_recall * 100).toFixed(0)}%
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
