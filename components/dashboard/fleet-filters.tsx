"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Search, SlidersHorizontal } from "lucide-react";
import type { RiskFilter, SortOption } from "@/lib/types";

interface FleetFiltersProps {
  risk: RiskFilter;
  sort: SortOption;
  query: string;
  onRiskChange: (risk: RiskFilter) => void;
  onSortChange: (sort: SortOption) => void;
  onQueryChange: (query: string) => void;
}

const RISK_OPTIONS: { value: RiskFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "critical", label: "Critical" },
  { value: "warning", label: "Warning" },
  { value: "safe", label: "Safe" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "risk_desc", label: "Risk (High to Low)" },
  { value: "savings_desc", label: "Savings (High to Low)" },
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
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Search by Charger ID..."
          value={searchValue}
          onChange={handleSearchChange}
          className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 transition-shadow"
        />
      </form>

      <div className="flex items-center gap-3 flex-wrap">
        {/* Risk filter pills */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-secondary">
          {RISK_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onRiskChange(opt.value)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                risk === opt.value
                  ? opt.value === "critical"
                    ? "bg-critical text-critical-foreground shadow-sm"
                    : opt.value === "warning"
                      ? "bg-warning text-warning-foreground shadow-sm"
                      : opt.value === "safe"
                        ? "bg-safe text-safe-foreground shadow-sm"
                        : "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="h-9 px-3 rounded-lg border border-input bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 cursor-pointer"
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
