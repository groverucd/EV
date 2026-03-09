"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Search, SlidersHorizontal, AlertOctagon, AlertTriangle, Shield } from "lucide-react";
import type { RiskFilter, SortOption } from "@/lib/types";

interface FleetFiltersProps {
  risk: RiskFilter;
  sort: SortOption;
  query: string;
  onRiskChange: (risk: RiskFilter) => void;
  onSortChange: (sort: SortOption) => void;
  onQueryChange: (query: string) => void;
}

const RISK_OPTIONS: { value: RiskFilter; label: string; icon?: React.ComponentType<{ className?: string }>; count?: string }[] = [
  { value: "all", label: "All" },
  { value: "critical", label: "Critical", icon: AlertOctagon, count: "700" },
  { value: "warning", label: "Warning", icon: AlertTriangle, count: "1.1K" },
  { value: "safe", label: "Safe", icon: Shield, count: "48.2K" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "risk_desc", label: "Risk: High to Low" },
  { value: "savings_desc", label: "Savings: High to Low" },
  { value: "charger_id", label: "Charger ID" },
];

export function FleetFilters({
  risk,
  sort,
  query,
  onRiskChange,
  onSortChange,
  onQueryChange,
}: FleetFiltersProps) {
  const [searchValue, setSearchValue] = useState(query);

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onQueryChange(searchValue);
    },
    [searchValue, onQueryChange]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
      if (e.target.value === "") {
        onQueryChange("");
      }
    },
    [onQueryChange]
  );

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Search by Charger ID..."
          value={searchValue}
          onChange={handleSearchChange}
          className="w-full h-10 pl-10 pr-4 rounded-xl border border-border/60 bg-secondary/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary/40 transition-all"
        />
      </form>

      <div className="flex items-center gap-3 flex-wrap">
        {/* Segmented risk filter */}
        <div className="flex items-center p-1 rounded-xl bg-secondary/80 border border-border/40">
          {RISK_OPTIONS.map((opt) => {
            const isActive = risk === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onRiskChange(opt.value)}
                className={cn(
                  "relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200",
                  isActive
                    ? opt.value === "critical"
                      ? "bg-critical/15 text-critical shadow-sm"
                      : opt.value === "warning"
                        ? "bg-warning/15 text-warning shadow-sm"
                        : opt.value === "safe"
                          ? "bg-safe/15 text-safe shadow-sm"
                          : "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {opt.icon && <opt.icon className="w-3 h-3" />}
                {opt.label}
                {opt.count && isActive && (
                  <span className="text-[10px] opacity-60 font-mono">{opt.count}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="h-9 px-3 rounded-xl border border-border/60 bg-secondary/50 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
