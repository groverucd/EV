import type {
  FleetSummary,
  ChargerListItem,
  ChargerDetail,
  InsightsData,
} from "./types";

const CAUSES = [
  "Thermal Stress Index",
  "Voltage Deviation",
  "Error Density Spike",
  "Risk Pressure Buildup",
  "Usage Overload",
  "Power Cycling Fatigue",
  "Connector Degradation",
  "Grid Voltage Instability",
];

const ACTIONS: Record<string, string> = {
  critical:
    "URGENT: reduce load; inspect cooling; consider taking offline",
  warning:
    "Schedule inspection; monitor temperature; review usage patterns",
  safe: "Continue monitoring; no action required at this time",
};

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function generateCharger(
  index: number
): ChargerListItem & { _seed: number } {
  const rand = seededRandom(index * 7919 + 31);
  const r1 = rand();
  const r2 = rand();
  const r3 = rand();
  const r4 = rand();

  let riskProb: number;
  let riskLevel: "critical" | "warning" | "safe";

  if (r1 < 0.014) {
    riskProb = 0.75 + r2 * 0.25;
    riskLevel = "critical";
  } else if (r1 < 0.036) {
    riskProb = 0.45 + r2 * 0.3;
    riskLevel = "warning";
  } else {
    riskProb = r2 * 0.44;
    riskLevel = "safe";
  }

  const riskPercent = Math.round(riskProb * 1000) / 10;
  const flagged = riskLevel === "critical" || riskLevel === "warning";
  const causeIdx = Math.floor(r3 * CAUSES.length);
  const savings =
    riskLevel === "critical"
      ? Math.round(500 + r4 * 1500)
      : riskLevel === "warning"
        ? Math.round(100 + r4 * 500)
        : 0;

  return {
    charger_id: `CHG-${String(index).padStart(6, "0")}`,
    risk_probability: riskProb,
    risk_percent: riskPercent,
    risk_level: riskLevel,
    flagged,
    top_cause: CAUSES[causeIdx],
    action_summary: ACTIONS[riskLevel],
    estimated_savings_usd: savings,
    _seed: index,
  };
}

const ALL_CHARGERS_CACHE: Map<
  number,
  ChargerListItem & { _seed: number }
> = new Map();

function getCharger(index: number) {
  if (!ALL_CHARGERS_CACHE.has(index)) {
    ALL_CHARGERS_CACHE.set(index, generateCharger(index));
  }
  return ALL_CHARGERS_CACHE.get(index)!;
}

const TOTAL = 50000;

export function getMockSummary(): FleetSummary {
  return {
    total_chargers: TOTAL,
    flagged_count: 1800,
    critical_count: 700,
    warning_count: 1100,
    safe_count: 48200,
    total_potential_savings_usd: 1250000,
    model_threshold: 0.45,
    model_version: "v4",
    primary_metric: { failure_recall: 0.98 },
  };
}

export function getMockRecommendations(params: {
  page: number;
  limit: number;
  risk?: string;
  sort?: string;
  query?: string;
}) {
  let indices: number[] = [];

  if (params.query) {
    const q = params.query.toUpperCase();
    for (let i = 0; i < TOTAL; i++) {
      const c = getCharger(i);
      if (c.charger_id.toUpperCase().includes(q)) {
        indices.push(i);
      }
      if (indices.length > 500) break;
    }
  } else {
    for (let i = 0; i < TOTAL; i++) {
      indices.push(i);
    }
  }

  if (params.risk && params.risk !== "all") {
    indices = indices.filter(
      (i) => getCharger(i).risk_level === params.risk
    );
  }

  const chargers = indices.map((i) => getCharger(i));

  if (params.sort === "risk_desc") {
    chargers.sort((a, b) => b.risk_probability - a.risk_probability);
  } else if (params.sort === "savings_desc") {
    chargers.sort(
      (a, b) => b.estimated_savings_usd - a.estimated_savings_usd
    );
  }

  const total = chargers.length;
  const page = params.page || 1;
  const limit = params.limit || 50;
  const start = (page - 1) * limit;
  const items = chargers.slice(start, start + limit).map((c) => {
    const { _seed, ...rest } = c;
    return rest;
  });

  return { page, limit, total, items };
}

export function getMockChargerDetail(chargerId: string): ChargerDetail | null {
  const match = chargerId.match(/CHG-(\d+)/);
  if (!match) return null;

  const index = parseInt(match[1], 10);
  if (index < 0 || index >= TOTAL) return null;

  const c = getCharger(index);
  const rand = seededRandom(index * 1237 + 77);

  const temp = 40 + rand() * 55;
  const voltage = 200 + rand() * 50;
  const usageHours = Math.round(100 + rand() * 900);
  const errorCount = Math.round(rand() * 10);
  const thermalStress = 20 + rand() * 70;
  const voltageDev = rand() * 20;
  const errorDensity = rand() * 0.03;
  const riskPressure = rand() * 0.9;

  const contributors = [
    {
      name: "thermal_stress",
      percent: Math.round(150 + rand() * 250) / 10,
      value: Math.round(thermalStress * 10) / 10,
    },
    {
      name: "risk_pressure",
      percent: Math.round(100 + rand() * 200) / 10,
      value: Math.round(riskPressure * 100) / 100,
    },
    {
      name: "temperature",
      percent: Math.round(80 + rand() * 150) / 10,
      value: Math.round(temp * 10) / 10,
    },
    {
      name: "voltage_deviation",
      percent: Math.round(50 + rand() * 120) / 10,
      value: Math.round(voltageDev * 10) / 10,
    },
    {
      name: "error_density",
      percent: Math.round(30 + rand() * 80) / 10,
      value: Math.round(errorDensity * 1000) / 1000,
    },
  ];

  const totalPct = contributors.reduce((s, c) => s + c.percent, 0);
  contributors.forEach((c) => {
    c.percent = Math.round((c.percent / totalPct) * 1000) / 10;
  });

  const ttf: "within_24h" | "within_1_week" | "none" =
    c.risk_level === "critical"
      ? "within_24h"
      : c.risk_level === "warning"
        ? "within_1_week"
        : "none";

  const conf: "high" | "medium" | "low" =
    c.risk_probability > 0.7
      ? "high"
      : c.risk_probability > 0.4
        ? "medium"
        : "low";

  const diagnosisItems =
    c.risk_level === "critical"
      ? [
          {
            cause: "Overheating",
            percent: Math.round(temp > 80 ? 35 : 16),
            evidence: `${Math.round(temp)}°C`,
          },
          {
            cause: "Voltage Irregularity",
            percent: Math.round(voltageDev > 10 ? 28 : 12),
            evidence: `${Math.round(voltageDev * 10) / 10}V deviation`,
          },
        ]
      : c.risk_level === "warning"
        ? [
            {
              cause: "Elevated Temperature",
              percent: 22,
              evidence: `${Math.round(temp)}°C`,
            },
          ]
        : [];

  const actions =
    c.risk_level === "critical"
      ? [
          "Reduce charger load immediately",
          "Inspect cooling fans and ventilation",
          "Check blocked airflow; clean filters",
          "If temperature remains high, take offline",
        ]
      : c.risk_level === "warning"
        ? [
            "Schedule maintenance inspection within 1 week",
            "Monitor temperature and voltage readings",
            "Review usage patterns for optimization",
          ]
        : ["Continue routine monitoring", "No immediate action required"];

  return {
    charger_id: c.charger_id,
    risk_probability: c.risk_probability,
    risk_level: c.risk_level,
    flagged: c.flagged,
    time_to_failure: ttf,
    confidence: conf,
    estimated_savings_usd: c.estimated_savings_usd,
    metrics: {
      temperature: Math.round(temp * 10) / 10,
      voltage: Math.round(voltage * 10) / 10,
      usage_hours: usageHours,
      error_count: errorCount,
      thermal_stress: Math.round(thermalStress * 10) / 10,
      voltage_deviation: Math.round(voltageDev * 10) / 10,
      error_density: Math.round(errorDensity * 1000) / 1000,
      risk_pressure: Math.round(riskPressure * 100) / 100,
    },
    contributors,
    recommendation: {
      summary:
        c.risk_level === "critical"
          ? `Charger ${c.charger_id} is at critical risk (${c.risk_percent}%). Immediate action required to prevent failure within 24 hours. Primary concern: ${c.top_cause}.`
          : c.risk_level === "warning"
            ? `Charger ${c.charger_id} shows elevated risk (${c.risk_percent}%). Schedule inspection within 1 week. Monitor ${c.top_cause} closely.`
            : `Charger ${c.charger_id} is operating within normal parameters. Risk level is low at ${c.risk_percent}%. Continue routine monitoring.`,
      diagnosis: diagnosisItems,
      actions,
      urgency:
        c.risk_level === "critical"
          ? "immediate"
          : c.risk_level === "warning"
            ? "soon"
            : "monitor",
    },
  };
}

export function getMockInsights(): InsightsData {
  const causeCounts: Record<string, number> = {};
  const riskCounts: Record<string, number> = { critical: 0, warning: 0, safe: 0 };
  const savingsByRisk: Record<string, number> = { critical: 0, warning: 0, safe: 0 };

  for (let i = 0; i < TOTAL; i++) {
    const c = getCharger(i);
    causeCounts[c.top_cause] = (causeCounts[c.top_cause] || 0) + 1;
    riskCounts[c.risk_level]++;
    savingsByRisk[c.risk_level] += c.estimated_savings_usd;
  }

  return {
    top_causes: Object.entries(causeCounts)
      .map(([cause, count]) => ({ cause, count }))
      .sort((a, b) => b.count - a.count),
    savings_by_risk: Object.entries(savingsByRisk).map(([level, savings]) => ({
      level: level.charAt(0).toUpperCase() + level.slice(1),
      savings,
    })),
    risk_distribution: Object.entries(riskCounts).map(([level, count]) => ({
      level: level.charAt(0).toUpperCase() + level.slice(1),
      count,
    })),
  };
}
