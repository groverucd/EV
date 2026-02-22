"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useChargerDetail } from "@/lib/hooks";
import { RiskSummary } from "./risk-summary";
import { ContributorsChart } from "./contributors-chart";
import { RecommendationPanel } from "./recommendation-panel";
import { MetricsGrid } from "./metrics-grid";
import { ArrowLeft, MapPin } from "lucide-react";

interface ChargerDetailViewProps {
  chargerId: string;
}

const MOCK_LOCATIONS: Record<string, string> = {
  "CHG-000001": "San Francisco, CA",
  "CHG-000042": "Los Angeles, CA",
  "CHG-000137": "Portland, OR",
  "CHG-000003": "Seattle, WA",
};

function LoadingSkeleton() {
  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-9 h-9 rounded-xl skeleton-shimmer" />
        <div className="flex flex-col gap-2">
          <div className="h-7 w-40 rounded-lg skeleton-shimmer" />
          <div className="h-4 w-24 rounded-lg skeleton-shimmer" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-2 h-96 rounded-2xl skeleton-shimmer" />
        <div className="lg:col-span-3 h-96 rounded-2xl skeleton-shimmer" />
      </div>
      <div className="h-48 rounded-2xl skeleton-shimmer mb-6" />
      <div className="h-72 rounded-2xl skeleton-shimmer" />
    </div>
  );
}

export function ChargerDetailView({ chargerId }: ChargerDetailViewProps) {
  const { data: charger, isLoading, error } = useChargerDetail(chargerId);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !charger) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-4 animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-2">
          <span className="text-2xl text-muted-foreground">?</span>
        </div>
        <p className="text-sm font-semibold text-foreground">
          {error ? "Failed to load charger data" : "Charger not found"}
        </p>
        <p className="text-xs text-muted-foreground">
          The requested charger could not be found or an error occurred.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const location = MOCK_LOCATIONS[charger.charger_id] || "Austin, TX";

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/"
          className="flex items-center justify-center w-9 h-9 rounded-xl border border-border/60 hover:bg-secondary hover:border-border transition-all active:scale-95"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </Link>
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black tracking-tight text-foreground font-mono">
                {charger.charger_id}
              </h1>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                  charger.risk_level === "critical"
                    ? "bg-critical/12 text-critical ring-1 ring-critical/20"
                    : charger.risk_level === "warning"
                      ? "bg-warning/12 text-warning ring-1 ring-warning/20"
                      : "bg-safe/12 text-safe ring-1 ring-safe/20"
                )}
              >
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    charger.risk_level === "critical"
                      ? "bg-critical"
                      : charger.risk_level === "warning"
                        ? "bg-warning"
                        : "bg-safe"
                  )}
                />
                {charger.risk_level}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-3 h-3 text-muted-foreground/50" />
              <span className="text-xs text-muted-foreground">{location}</span>
              <span className="text-[9px] text-muted-foreground/40">
                -- last updated 4s ago
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Two column layout: Risk Summary + Contributors */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-2">
          <RiskSummary charger={charger} />
        </div>
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
