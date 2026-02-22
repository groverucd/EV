"use client";

import { useState, useMemo } from "react";
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
import {
  TrendingUp,
  DollarSign,
  BarChart3,
  Download,
  Share2,
  Sliders,
} from "lucide-react";
import { cn } from "@/lib/utils";

const RISK_COLORS: Record<string, string> = {
  Critical: "var(--critical)",
  Warning: "var(--warning)",
  Safe: "var(--safe)",
};

function formatUsd(value: number) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

function StatCard({
  icon: Icon,
  label,
  value,
  iconBg,
  iconColor,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  iconBg: string;
  iconColor: string;
  delay: number;
}) {
  return (
    <div
      className="flex items-center gap-4 p-5 rounded-2xl border border-border/60 bg-card hover:border-border hover:shadow-lg hover:shadow-background/20 transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className={cn(
          "flex items-center justify-center w-11 h-11 rounded-xl",
          iconBg
        )}
      >
        <Icon className={cn("w-5 h-5", iconColor)} />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </p>
        <p className="text-xl font-black text-foreground font-mono tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
}

function ChartCard({
  title,
  children,
  className,
  actions,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-card p-6 animate-slide-up",
        className
      )}
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          {title}
        </h2>
        {actions}
      </div>
      {children}
    </div>
  );
}

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "12px",
  fontSize: "11px",
  color: "var(--foreground)",
  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
};

function LoadingSkeleton() {
  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto animate-fade-in">
      <div className="h-7 w-40 rounded-lg skeleton-shimmer mb-2" />
      <div className="h-4 w-64 rounded-lg skeleton-shimmer mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 rounded-2xl skeleton-shimmer" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="h-80 rounded-2xl skeleton-shimmer" />
        <div className="h-80 rounded-2xl skeleton-shimmer" />
      </div>
      <div className="h-64 rounded-2xl skeleton-shimmer" />
    </div>
  );
}

export function InsightsView() {
  const { data: insights, isLoading: insightsLoading } = useInsights();
  const { data: summary, isLoading: summaryLoading } = useFleetSummary();
  const [costPerHour, setCostPerHour] = useState(150);

  const isLoading = insightsLoading || summaryLoading;

  // What-if computation
  const whatIfSavings = useMemo(() => {
    if (!insights) return [];
    return insights.savings_by_risk.map((item) => ({
      ...item,
      adjusted: Math.round(item.savings * (costPerHour / 150)),
    }));
  }, [insights, costPerHour]);

  const totalAdjustedSavings = useMemo(
    () => whatIfSavings.reduce((sum, item) => sum + item.adjusted, 0),
    [whatIfSavings]
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!insights || !summary) return null;

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
            Fleet Insights
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Executive analytics across{" "}
            <span className="font-mono font-semibold text-foreground">
              {summary.total_chargers.toLocaleString()}
            </span>{" "}
            chargers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border/60 bg-secondary/50 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-border transition-all active:scale-95">
            <Download className="w-3.5 h-3.5" />
            Export PDF
          </button>
          <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border/60 bg-secondary/50 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-border transition-all active:scale-95">
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 stagger-children">
        <StatCard
          icon={TrendingUp}
          label="Fleet Risk Rate"
          value={`${((summary.flagged_count / summary.total_chargers) * 100).toFixed(1)}%`}
          iconBg="bg-critical/10"
          iconColor="text-critical"
          delay={0}
        />
        <StatCard
          icon={DollarSign}
          label="Total Potential Savings"
          value={formatUsd(summary.total_potential_savings_usd)}
          iconBg="bg-safe/10"
          iconColor="text-safe"
          delay={60}
        />
        <StatCard
          icon={BarChart3}
          label="Unique Failure Causes"
          value={String(insights.top_causes.length)}
          iconBg="bg-primary/10"
          iconColor="text-primary"
          delay={120}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Causes Chart */}
        <ChartCard title="Top Causes Across Fleet">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={insights.top_causes}
                layout="vertical"
                margin={{ left: 0, right: 16, top: 0, bottom: 0 }}
              >
                <XAxis
                  type="number"
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => v.toLocaleString()}
                />
                <YAxis
                  dataKey="cause"
                  type="category"
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  width={130}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value: number) => [
                    value.toLocaleString(),
                    "Occurrences",
                  ]}
                  cursor={{ fill: "var(--primary)", opacity: 0.05 }}
                />
                <Bar
                  dataKey="count"
                  fill="var(--chart-1)"
                  radius={[0, 6, 6, 0]}
                  barSize={20}
                  animationDuration={800}
                  animationEasing="ease-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Risk Distribution Donut */}
        <ChartCard title="Risk Distribution">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={insights.risk_distribution}
                  cx="50%"
                  cy="45%"
                  innerRadius={65}
                  outerRadius={105}
                  paddingAngle={4}
                  dataKey="count"
                  nameKey="level"
                  strokeWidth={0}
                  animationDuration={800}
                  animationEasing="ease-out"
                >
                  {insights.risk_distribution.map((entry) => (
                    <Cell
                      key={entry.level}
                      fill={RISK_COLORS[entry.level] || "var(--chart-1)"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
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
                    <span
                      style={{
                        color: "var(--muted-foreground)",
                        fontSize: "11px",
                        fontWeight: 500,
                      }}
                    >
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Savings by Risk Level */}
      <ChartCard title="Potential Savings by Risk Level" className="mb-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={insights.savings_by_risk}
              margin={{ left: 16, right: 16, top: 8, bottom: 0 }}
            >
              <XAxis
                dataKey="level"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)", fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => formatUsd(v)}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value: number) => [formatUsd(value), "Savings"]}
                cursor={{ fill: "var(--primary)", opacity: 0.05 }}
              />
              <Bar
                dataKey="savings"
                radius={[8, 8, 0, 0]}
                barSize={56}
                animationDuration={800}
                animationEasing="ease-out"
              >
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
      </ChartCard>

      {/* What-if Widget */}
      <div className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-6 animate-slide-up">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10">
            <Sliders className="w-[18px] h-[18px] text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">
              What-If Scenario
            </h2>
            <p className="text-[10px] text-muted-foreground">
              Adjust downtime cost per hour to see impact on potential savings
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Slider */}
          <div className="lg:col-span-1">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2 block">
              Downtime Cost / Hour
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={50}
                max={500}
                step={10}
                value={costPerHour}
                onChange={(e) => setCostPerHour(Number(e.target.value))}
                className="flex-1 h-1.5 rounded-full bg-secondary appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
              />
              <span className="font-mono text-lg font-black text-primary tabular-nums min-w-[72px] text-right">
                ${costPerHour}
              </span>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-3 gap-3">
              {whatIfSavings.map((item) => (
                <div
                  key={item.level}
                  className="flex flex-col items-center p-4 rounded-xl bg-card border border-border/40"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    {item.level}
                  </span>
                  <span
                    className="text-lg font-black font-mono tabular-nums"
                    style={{
                      color:
                        RISK_COLORS[item.level] || "var(--foreground)",
                    }}
                  >
                    {formatUsd(item.adjusted)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-2 mt-4 p-3 rounded-xl bg-safe/8 border border-safe/20">
              <DollarSign className="w-4 h-4 text-safe" />
              <span className="text-sm font-bold text-safe">
                Total Projected Savings:{" "}
                <span className="font-mono tabular-nums">
                  {formatUsd(totalAdjustedSavings)}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
