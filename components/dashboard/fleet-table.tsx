"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ChargerListItem } from "@/lib/types";
import {
  ArrowRight,
  AlertCircle,
  Flame,
  Zap,
  TrendingDown,
  Activity,
  AlertTriangle,
  BarChart2,
  Gauge,
  Clock,
  Pin,
  Ticket,
  Eye,
} from "lucide-react";

interface FleetTableProps {
  items: ChargerListItem[];
  isLoading: boolean;
}

const CAUSE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "Thermal Stress Index": Flame,
  "Voltage Deviation": TrendingDown,
  "Error Density Spike": BarChart2,
  "Risk Pressure Buildup": Gauge,
  "Usage Overload": Clock,
  "Power Cycling Fatigue": Zap,
  "Connector Degradation": Activity,
  "Grid Voltage Instability": AlertTriangle,
};

function RiskBar({ percent, level }: { percent: number; level: string }) {
  return (
    <div className="flex items-center gap-2.5 min-w-[120px]">
      <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            level === "critical"
              ? "bg-critical"
              : level === "warning"
                ? "bg-warning"
                : "bg-safe"
          )}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
      <span
        className={cn(
          "text-xs font-bold font-mono tabular-nums w-12 text-right",
          level === "critical"
            ? "text-critical"
            : level === "warning"
              ? "text-warning"
              : "text-safe"
        )}
      >
        {percent.toFixed(1)}%
      </span>
    </div>
  );
}

function SeverityPill({ level }: { level: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider",
        level === "critical"
          ? "bg-critical/12 text-critical ring-1 ring-critical/20"
          : level === "warning"
            ? "bg-warning/12 text-warning ring-1 ring-warning/20"
            : "bg-safe/12 text-safe ring-1 ring-safe/20"
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          level === "critical"
            ? "bg-critical"
            : level === "warning"
              ? "bg-warning"
              : "bg-safe"
        )}
      />
      {level}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-4 rounded-lg skeleton-shimmer max-w-[100px]" />
        </td>
      ))}
    </tr>
  );
}

export function FleetTable({ items, isLoading }: FleetTableProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-secondary/30">
              <th className="sticky top-0 text-left px-4 py-3 font-semibold text-muted-foreground text-[10px] uppercase tracking-[0.15em] bg-secondary/30 backdrop-blur-sm z-10">
                Charger ID
              </th>
              <th className="sticky top-0 text-left px-4 py-3 font-semibold text-muted-foreground text-[10px] uppercase tracking-[0.15em] bg-secondary/30 backdrop-blur-sm z-10">
                Risk
              </th>
              <th className="sticky top-0 text-left px-4 py-3 font-semibold text-muted-foreground text-[10px] uppercase tracking-[0.15em] bg-secondary/30 backdrop-blur-sm z-10">
                Level
              </th>
              <th className="sticky top-0 text-center px-4 py-3 font-semibold text-muted-foreground text-[10px] uppercase tracking-[0.15em] bg-secondary/30 backdrop-blur-sm z-10">
                Flagged
              </th>
              <th className="sticky top-0 text-left px-4 py-3 font-semibold text-muted-foreground text-[10px] uppercase tracking-[0.15em] bg-secondary/30 backdrop-blur-sm z-10">
                Top Cause
              </th>
              <th className="sticky top-0 text-right px-4 py-3 font-semibold text-muted-foreground text-[10px] uppercase tracking-[0.15em] bg-secondary/30 backdrop-blur-sm z-10">
                Est. Savings
              </th>
              <th className="sticky top-0 text-right px-4 py-3 font-semibold text-muted-foreground text-[10px] uppercase tracking-[0.15em] bg-secondary/30 backdrop-blur-sm z-10">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {isLoading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))
              : items.map((item) => {
                  const CauseIcon = CAUSE_ICONS[item.top_cause] || Activity;
                  return (
                    <tr
                      key={item.charger_id}
                      className="group hover:bg-primary/[0.03] transition-colors duration-150"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/charger/${item.charger_id}`}
                          className="font-mono text-xs font-bold text-foreground hover:text-primary transition-colors"
                        >
                          {item.charger_id}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <RiskBar
                          percent={item.risk_percent}
                          level={item.risk_level}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <SeverityPill level={item.risk_level} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        {item.flagged ? (
                          <AlertCircle className="w-4 h-4 text-critical mx-auto" />
                        ) : (
                          <span className="text-muted-foreground/30 text-xs">
                            --
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center w-5 h-5 rounded bg-secondary">
                            <CauseIcon className="w-3 h-3 text-muted-foreground" />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {item.top_cause}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {item.estimated_savings_usd > 0 ? (
                          <div className="flex flex-col items-end">
                            <span className="font-mono text-xs font-bold text-foreground tabular-nums">
                              ${item.estimated_savings_usd.toLocaleString()}
                            </span>
                            <span className="text-[9px] text-muted-foreground/60 uppercase tracking-wider">
                              potential
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground/30 text-xs">
                            --
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Link
                            href={`/charger/${item.charger_id}`}
                            className="flex items-center justify-center w-7 h-7 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                            title="View details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            className="flex items-center justify-center w-7 h-7 rounded-lg text-muted-foreground hover:text-warning hover:bg-warning/10 transition-colors"
                            title="Pin charger"
                          >
                            <Pin className="w-3.5 h-3.5" />
                          </button>
                          <button
                            className="flex items-center justify-center w-7 h-7 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                            title="Create ticket"
                          >
                            <Ticket className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
