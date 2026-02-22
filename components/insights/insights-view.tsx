"use client";

import { useInsights, useFleetSummary } from "@/lib/hooks";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Loader2, TrendingUp, PieChartIcon, DollarSign } from "lucide-react";

const RISK_COLORS: Record<string, string> = {
  Critical: "var(--critical)",
  Warning: "var(--warning)",
  Safe: "var(--safe)",
};

function formatUsd(value: number) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

export function InsightsView() {
  const { data: insights, isLoading: insightsLoading } = useInsights();
  const { data: summary, isLoading: summaryLoading } = useFleetSummary();

  const isLoading = insightsLoading || summaryLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <span className="text-sm text-muted-foreground">
            Loading insights...
          </span>
        </div>
      </div>
    );
  }

  if (!insights || !summary) return null;

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
          Fleet Insights
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Analytics and trends across your entire EV charger fleet
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-critical/10">
            <TrendingUp className="w-5 h-5 text-critical" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Fleet Risk Rate
            </p>
            <p className="text-xl font-bold text-foreground">
              {((summary.flagged_count / summary.total_chargers) * 100).toFixed(
                1
              )}
              %
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-safe/10">
            <DollarSign className="w-5 h-5 text-safe" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Total Potential Savings
            </p>
            <p className="text-xl font-bold text-foreground">
              {formatUsd(summary.total_potential_savings_usd)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
            <PieChartIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Unique Failure Causes
            </p>
            <p className="text-xl font-bold text-foreground">
              {insights.top_causes.length}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Causes Chart */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-5">
            Top Causes Across Fleet
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={insights.top_causes}
                layout="vertical"
                margin={{ left: 0, right: 16, top: 0, bottom: 0 }}
              >
                <XAxis
                  type="number"
                  tick={{
                    fontSize: 11,
                    fill: "var(--muted-foreground)",
                  }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => v.toLocaleString()}
                />
                <YAxis
                  dataKey="cause"
                  type="category"
                  tick={{
                    fontSize: 11,
                    fill: "var(--muted-foreground)",
                  }}
                  width={140}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "var(--foreground)",
                  }}
                  formatter={(value: number) => [
                    value.toLocaleString(),
                    "Occurrences",
                  ]}
                />
                <Bar
                  dataKey="count"
                  fill="var(--chart-1)"
                  radius={[0, 4, 4, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Pie */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-5">
            Risk Distribution
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={insights.risk_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="level"
                >
                  {insights.risk_distribution.map((entry) => (
                    <Cell
                      key={entry.level}
                      fill={RISK_COLORS[entry.level] || "var(--chart-1)"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "var(--foreground)",
                  }}
                  formatter={(value: number) => [
                    value.toLocaleString(),
                    "Chargers",
                  ]}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span style={{ color: "var(--muted-foreground)", fontSize: "12px" }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Savings by Risk Level */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-5">
          Potential Savings by Risk Level
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={insights.savings_by_risk}
              margin={{ left: 16, right: 16, top: 8, bottom: 0 }}
            >
              <XAxis
                dataKey="level"
                tick={{
                  fontSize: 12,
                  fill: "var(--muted-foreground)",
                }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{
                  fontSize: 11,
                  fill: "var(--muted-foreground)",
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => formatUsd(v)}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "var(--foreground)",
                }}
                formatter={(value: number) => [formatUsd(value), "Savings"]}
              />
              <Bar dataKey="savings" radius={[4, 4, 0, 0]} barSize={64}>
                {insights.savings_by_risk.map((entry) => (
                  <Cell
                    key={entry.level}
                    fill={RISK_COLORS[entry.level] || "var(--chart-1)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
