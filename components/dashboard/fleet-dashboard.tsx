"use client";

import { useState, useCallback } from "react";
import { useFleetSummary, useFleetRecommendations } from "@/lib/hooks";
import { KpiCards } from "./kpi-cards";
import { FleetFilters } from "./fleet-filters";
import { FleetTable } from "./fleet-table";
import { Pagination } from "./pagination";
import type { RiskFilter, SortOption } from "@/lib/types";
import { RefreshCw } from "lucide-react";

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
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
            Fleet Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time predictive maintenance overview for your EV charger fleet
          </p>
        </div>
        {isValidating && (
          <RefreshCw className="w-4 h-4 text-muted-foreground animate-spin" />
        )}
      </div>

      {/* KPI Cards */}
      <div className="mb-8">
        <KpiCards data={summary} isLoading={summaryLoading} />
      </div>

      {/* Filters */}
      <div className="mb-6">
        <FleetFilters
          risk={risk}
          sort={sort}
          query={query}
          onRiskChange={handleRiskChange}
          onSortChange={handleSortChange}
          onQueryChange={handleQueryChange}
        />
      </div>

      {/* Table */}
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
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <RefreshCw className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">
            No chargers found
          </p>
          <p className="text-xs text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
