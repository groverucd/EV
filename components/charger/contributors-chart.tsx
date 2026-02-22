"use client";

import { cn } from "@/lib/utils";
import type { Contributor } from "@/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface ContributorsChartProps {
  contributors: Contributor[];
}

const FEATURE_LABELS: Record<string, string> = {
  thermal_stress: "Thermal Stress",
  risk_pressure: "Risk Pressure",
  temperature: "Temperature",
  voltage_deviation: "Voltage Dev.",
  error_density: "Error Density",
  usage_hours: "Usage Hours",
  error_count: "Error Count",
};

const BAR_COLORS = [
  "var(--critical)",
  "var(--warning)",
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
];

export function ContributorsChart({ contributors }: ContributorsChartProps) {
  const data = contributors.map((c) => ({
    name: FEATURE_LABELS[c.name] || c.name,
    percent: c.percent,
    value: c.value,
  }));

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-5">
        Why Flagged — Top Contributors
      </h2>

      {/* Chart */}
      <div className="h-56 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 0, right: 16, top: 0, bottom: 0 }}
          >
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickFormatter={(v) => `${v}%`}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              width={100}
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
              formatter={(value: number) => [`${value}%`, "Contribution"]}
            />
            <Bar dataKey="percent" radius={[0, 4, 4, 0]} barSize={20}>
              {data.map((_, idx) => (
                <Cell key={idx} fill={BAR_COLORS[idx % BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Feature values list */}
      <div className="flex flex-col gap-2">
        {contributors.map((c, i) => (
          <div key={c.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: BAR_COLORS[i % BAR_COLORS.length] }}
              />
              <span className="text-xs text-muted-foreground">
                {FEATURE_LABELS[c.name] || c.name}
              </span>
            </div>
            <span className="text-xs font-mono text-foreground">
              {c.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
