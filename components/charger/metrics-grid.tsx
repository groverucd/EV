"use client";

import type { ChargerMetrics } from "@/lib/types";
import {
  Thermometer,
  Zap,
  Clock,
  AlertTriangle,
  Flame,
  TrendingDown,
  BarChart2,
  Gauge,
} from "lucide-react";

interface MetricsGridProps {
  metrics: ChargerMetrics;
}

const METRIC_CONFIG = [
  {
    key: "temperature" as const,
    label: "Temperature",
    unit: "°C",
    icon: Thermometer,
  },
  { key: "voltage" as const, label: "Voltage", unit: "V", icon: Zap },
  {
    key: "usage_hours" as const,
    label: "Usage Hours",
    unit: "hrs",
    icon: Clock,
  },
  {
    key: "error_count" as const,
    label: "Error Count",
    unit: "",
    icon: AlertTriangle,
  },
  {
    key: "thermal_stress" as const,
    label: "Thermal Stress",
    unit: "",
    icon: Flame,
  },
  {
    key: "voltage_deviation" as const,
    label: "Voltage Deviation",
    unit: "V",
    icon: TrendingDown,
  },
  {
    key: "error_density" as const,
    label: "Error Density",
    unit: "",
    icon: BarChart2,
  },
  {
    key: "risk_pressure" as const,
    label: "Risk Pressure",
    unit: "",
    icon: Gauge,
  },
];

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-5">
        Charger Metrics
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {METRIC_CONFIG.map((m) => (
          <div
            key={m.key}
            className="flex flex-col gap-1.5 p-3 rounded-lg bg-secondary/50"
          >
            <div className="flex items-center gap-1.5">
              <m.icon className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                {m.label}
              </span>
            </div>
            <span className="text-lg font-bold font-mono text-foreground">
              {metrics[m.key]}
              {m.unit && (
                <span className="text-xs font-normal text-muted-foreground ml-0.5">
                  {m.unit}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
