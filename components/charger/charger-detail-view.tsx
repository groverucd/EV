"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useChargerDetail } from "@/lib/hooks";
import { RiskSummary } from "./risk-summary";
import { ContributorsChart } from "./contributors-chart";
import { RecommendationPanel } from "./recommendation-panel";
import { MetricsGrid } from "./metrics-grid";
import { ArrowLeft, Loader2 } from "lucide-react";

interface ChargerDetailViewProps {
  chargerId: string;
}

export function ChargerDetailView({ chargerId }: ChargerDetailViewProps) {
  const { data: charger, isLoading, error } = useChargerDetail(chargerId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <span className="text-sm text-muted-foreground">
            Loading charger data...
          </span>
        </div>
      </div>
    );
  }

  if (error || !charger) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-4">
        <p className="text-sm text-muted-foreground">
          {error ? "Failed to load charger data" : "Charger not found"}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/"
          className="flex items-center justify-center w-9 h-9 rounded-lg border border-border hover:bg-secondary transition-colors"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-mono">
            {charger.charger_id}
          </h1>
          <span
            className={cn(
              "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize",
              charger.risk_level === "critical"
                ? "bg-critical/15 text-critical"
                : charger.risk_level === "warning"
                  ? "bg-warning/15 text-warning"
                  : "bg-safe/15 text-safe"
            )}
          >
            {charger.risk_level}
          </span>
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        {/* Left: Risk Summary */}
        <div className="lg:col-span-2">
          <RiskSummary charger={charger} />
        </div>

        {/* Right: Contributors */}
        <div className="lg:col-span-3">
          <ContributorsChart contributors={charger.contributors} />
        </div>
      </div>

      {/* Metrics */}
      <div className="mb-6">
        <MetricsGrid metrics={charger.metrics} />
      </div>

      {/* Copilot Recommendation */}
      <RecommendationPanel charger={charger} />
    </div>
  );
}
