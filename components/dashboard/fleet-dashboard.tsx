"use client";

import { useState, useCallback } from "react";
import { useFleetSummary, useFleetRecommendations } from "@/lib/hooks";
import { KpiCards } from "./kpi-cards";
import { FleetFilters } from "./fleet-filters";
import { FleetTable } from "./fleet-table";
import { Pagination } from "./pagination";
import { LiveIncidents } from "./live-incidents";
import type { RiskFilter, SortOption } from "@/lib/types";
import { RefreshCw, Shield } from "lucide-react";

const PAGE_LIMIT = 50;

export function FleetDashboard() {
  const [page, setPage] = useState(1);
  const [risk, setRisk] = useState<RiskFilter>("all");
  const [sort, setSort] = useState<SortOption>("risk_desc");
  const [query, setQuery] = useState("");

  const { data: summary, isLoading: summaryLoading } = useFleetSummary();
  const {
    data: recommendations,
    isLoading: recsLoading,
    isValidating,
  } = useFleetRecommendations({ page, limit: PAGE_LIMIT, risk, sort, query });

  const handleRiskChange = useCallback((newRisk: RiskFilter) => {
    setRisk(newRisk);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((newSort: SortOption) => {
    setSort(newSort);
    setPage(1);
  }, []);

  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  }, []);

  const totalPages = recommendations
    ? Math.ceil(recommendations.total / PAGE_LIMIT)
    : 0;

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
            Fleet Overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time predictive maintenance for{" "}
            <span className="font-mono font-semibold text-foreground">50,000</span> chargers
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isValidating && (
            <RefreshCw className="w-4 h-4 text-muted-foreground animate-spin" />
          )}
          {summary && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border/40">
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-medium text-muted-foreground">
                Model {summary.model_version} |{" "}
                <span className="text-safe font-semibold">
                  {(summary.primary_metric.failure_recall * 100).toFixed(0)}% Recall
                </span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mb-8 reveal-section" style={{ animationDelay: "100ms" }}>
        <KpiCards data={summary} isLoading={summaryLoading} />
      </div>

      {/* Filters */}
      <div className="mb-6 reveal-section" style={{ animationDelay: "200ms" }}>
        <FleetFilters
          risk={risk}
          sort={sort}
          query={query}
          onRiskChange={handleRiskChange}
          onSortChange={handleSortChange}
          onQueryChange={handleQueryChange}
        />
      </div>

      {/* Content: Table + Live Incidents */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 reveal-section" style={{ animationDelay: "300ms" }}>
        {/* Table */}
        <div className="xl:col-span-3">
          <FleetTable
            items={recommendations?.items || []}
            isLoading={recsLoading}
          />

          {/* Pagination */}
          {recommendations && recommendations.total > 0 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              total={recommendations.total}
              limit={PAGE_LIMIT}
              onPageChange={setPage}
            />
          )}

          {/* Empty state */}
          {recommendations && recommendations.total === 0 && !recsLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                <RefreshCw className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-semibold text-foreground mb-1">
                No chargers found
              </p>
              <p className="text-xs text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>

        {/* Live Incidents Panel */}
        <div className="xl:col-span-1">
          <LiveIncidents />
        </div>
      </div>
    </div>
  );
}
