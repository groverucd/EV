"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ChargerListItem } from "@/lib/types";
import { ArrowRight, AlertCircle } from "lucide-react";

interface FleetTableProps {
  items: ChargerListItem[];
  isLoading: boolean;
}

function RiskBadge({ level }: { level: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize",
        level === "critical"
          ? "bg-critical/15 text-critical"
          : level === "warning"
            ? "bg-warning/15 text-warning"
            : "bg-safe/15 text-safe"
      )}
    >
      {level}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-4 rounded bg-muted w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}

export function FleetTable({ items, isLoading }: FleetTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                Charger ID
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                Risk %
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                Level
              </th>
              <th className="text-center px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                Flagged
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                Top Cause
              </th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                Est. Savings
              </th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading
              ? Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} />)
              : items.map((item) => (
                  <tr
                    key={item.charger_id}
                    className="hover:bg-secondary/30 transition-colors group"
                  >
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs font-semibold text-foreground">
                        {item.charger_id}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          "font-mono text-sm font-semibold",
                          item.risk_level === "critical"
                            ? "text-critical"
                            : item.risk_level === "warning"
                              ? "text-warning"
                              : "text-safe"
                        )}
                      >
                        {item.risk_percent.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <RiskBadge level={item.risk_level} />
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {item.flagged ? (
                        <AlertCircle className="w-4 h-4 text-critical mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">--</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-muted-foreground text-xs">
                        {item.top_cause}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="font-mono text-xs text-foreground">
                        {item.estimated_savings_usd > 0
                          ? `$${item.estimated_savings_usd.toLocaleString()}`
                          : "--"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Link
                        href={`/charger/${item.charger_id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-primary hover:bg-primary/10 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        Details
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
