import type {
  FleetSummary,
  ChargerListItem,
  ChargerDetail,
  InsightsData,
} from "./types";

// ──────────────────────────────────────────────
// Real fleet summary from ML pipeline (2026-02-22)
// ──────────────────────────────────────────────

const REAL_SUMMARY = {
  total_chargers: 50000,
  flagged_count: 2732,
  critical_count: 2732,
  warning_count: 1595,
  safe_count: 45673,
  total_savings_usd: 3295314.01,
};

// ──────────────────────────────────────────────
// Top 50 critical chargers (from real pipeline data)
// Full JSON had 1,000 but we embed the top 50 for
// the fleet table, charger detail, and live-incident panels.
// ──────────────────────────────────────────────

interface RealCharger {
  charger_id: string;
  failure_probability: number;
  risk_score_pct: number;
  risk_level: "critical" | "warning" | "safe";
  flagged: boolean;
  confidence: string;
  time_to_failure: string;
  top_cause: string;
  top_contributors: {
    factor: string;
    key: string;
    contribution_pct: number;
    value: number;
    unit: string;
    severity: string;
    engineered: boolean;
  }[];
  recommended_action: string;
  urgency: string;
  estimated_savings_usd: number;
  temperature: number;
  voltage: number;
  usage_hours: number;
  error_count: number;
}

const REAL_CHARGERS: RealCharger[] = [
  {charger_id:"CHG-031278",failure_probability:0.9999999819,risk_score_pct:100,risk_level:"critical",flagged:true,confidence:"High",time_to_failure:"Failure within 24h",top_cause:"Combined Risk Pressure",top_contributors:[{factor:"Combined Risk Pressure",key:"risk_pressure",contribution_pct:33.8,value:0.66,unit:"/1.0",severity:"critical",engineered:true},{factor:"Overheating",key:"temperature",contribution_pct:25.5,value:100,unit:"\u00b0C",severity:"critical",engineered:false},{factor:"High Usage / Wear",key:"usage_hours",contribution_pct:23,value:762.5,unit:"hrs",severity:"critical",engineered:false}],recommended_action:"URGENT: Reduce load; inspect cooling and airflow. Consider taking offline.",urgency:"immediate",estimated_savings_usd:1000,temperature:100,voltage:264.8,usage_hours:762.5,error_count:0},
  {charger_id:"CHG-009048",failure_probability:0.9999999264,risk_score_pct:100,risk_level:"critical",flagged:true,confidence:"High",time_to_failure:"Failure within 24h",top_cause:"Combined Risk Pressure",top_contributors:[{factor:"Combined Risk Pressure",key:"risk_pressure",contribution_pct:31.5,value:0.62,unit:"/1.0",severity:"critical",engineered:true},{factor:"Overheating",key:"temperature",contribution_pct:26.3,value:99.3,unit:"\u00b0C",severity:"critical",engineered:false},{factor:"High Usage / Wear",key:"usage_hours",contribution_pct:25.8,value:796.8,unit:"hrs",severity:"critical",engineered:false}],recommended_action:"URGENT: Reduce load; inspect cooling and airflow. Consider taking offline.",urgency:"immediate",estimated_savings_usd:1000,temperature:99.3,voltage:199.2,usage_hours:796.8,error_count:0},
  {charger_id:"CHG-020806",failure_probability:0.9999999091,risk_score_pct:100,risk_level:"critical",flagged:true,confidence:"High",time_to_failure:"Failure within 24h",top_cause:"Combined Risk Pressure",top_contributors:[{factor:"Combined Risk Pressure",key:"risk_pressure",contribution_pct:33.6,value:0.64,unit:"/1.0",severity:"critical",engineered:true},{factor:"High Usage / Wear",key:"usage_hours",contribution_pct:25.7,value:787.1,unit:"hrs",severity:"critical",engineered:false},{factor:"Overheating",key:"temperature",contribution_pct:24,value:94.9,unit:"\u00b0C",severity:"critical",engineered:false}],recommended_action:"URGENT: Reduce load; inspect cooling and airflow. Consider taking offline.",urgency:"immediate",estimated_savings_usd:1000,temperature:94.9,voltage:198.2,usage_hours:787.1,error_count:2},
  {charger_id:"CHG-033887",failure_probability:0.999999905,risk_score_pct:100,risk_level:"critical",flagged:true,confidence:"High",time_to_failure:"Failure within 24h",top_cause:"Combined Risk Pressure",top_contributors:[{factor:"Combined Risk Pressure",key:"risk_pressure",contribution_pct:32.4,value:0.63,unit:"/1.0",severity:"critical",engineered:true},{factor:"High Usage / Wear",key:"usage_hours",contribution_pct:26.2,value:796.9,unit:"hrs",severity:"critical",engineered:false},{factor:"Overheating",key:"temperature",contribution_pct:26,value:98,unit:"\u00b0C",severity:"critical",engineered:false}],recommended_action:"URGENT: Reduce load; inspect cooling and airflow. Consider taking offline.",urgency:"immediate",estimated_savings_usd:1000,temperature:98,voltage:200.7,usage_hours:796.9,error_count:2},
  {charger_id:"CHG-021541",failure_probability:0.9999998588,risk_score_pct:100,risk_level:"critical",flagged:true,confidence:"High",time_to_failure:"Failure within 24h",top_cause:"Combined Risk Pressure",top_contributors:[{factor:"Combined Risk Pressure",key:"risk_pressure",contribution_pct:41.1,value:0.71,unit:"/1.0",severity:"critical",engineered:true},{factor:"Overheating",key:"temperature",contribution_pct:21.7,value:90.1,unit:"\u00b0C",severity:"critical",engineered:false},{factor:"High Usage / Wear",key:"usage_hours",contribution_pct:19,value:644.4,unit:"hrs",severity:"critical",engineered:false}],recommended_action:"URGENT: Reduce load; inspect cooling and airflow. Consider taking offline.",urgency:"immediate",estimated_savings_usd:1000,temperature:90.1,voltage:264.4,usage_hours:644.4,error_count:7},
  {charger_id:"CHG-006121",failure_probability:0.9999998231,risk_score_pct:100,risk_level:"critical",flagged:true,confidence:"High",time_to_failure:"Failure within 24h",top_cause:"Combined Risk Pressure",top_contributors:[{factor:"Combined Risk Pressure",key:"risk_pressure",contribution_pct:39.5,value:0.69,unit:"/1.0",severity:"critical",engineered:true},{factor:"High Usage / Wear",key:"usage_hours",contribution_pct:26,value:775.9,unit:"hrs",severity:"critical",engineered:false},{factor:"Overheating",key:"temperature",contribution_pct:21.1,value:88.8,unit:"\u00b0C",severity:"critical",engineered:false}],recommended_action:"URGENT: Reduce load; inspect cooling and airflow. Consider taking offline.",urgency:"immediate",estimated_savings_usd:1000,temperature:88.8,voltage:252.4,usage_hours:775.9,error_count:16},
  {charger_id:"CHG-007930",failure_probability:0.9999997734,risk_score_pct:100,risk_level:"critical",flagged:true,confidence:"High",time_to_failure:"Failure within 24h",top_cause:"Combined Risk Pressure",top_contributors:[{factor:"Combined Risk Pressure",key:"risk_pressure",contribution_pct:34.6,value:0.64,unit:"/1.0",severity:"critical",engineered:true},{factor:"High Usage / Wear",key:"usage_hours",contribution_pct:27.5,value:800,unit:"hrs",severity:"critical",engineered:false},{factor:"Overheating",key:"temperature",contribution_pct:19.2,value:85.5,unit:"\u00b0C",severity:"critical",engineered:false}],recommended_action:"URGENT: Reduce load; inspect cooling and airflow. Consider taking offline.",urgency:"immediate",estimated_savings_usd:1000,temperature:85.5,voltage:264.6,usage_hours:800,error_count:2},
  {charger_id:"CHG-014090",failure_probability:0.999999711,risk_score_pct:100,risk_level:"critical",flagged:true,confidence:"High",time_to_failure:"Failure within 24h",top_cause:"Combined Risk Pressure",top_contributors:[{factor:"Combined Risk Pressure",key:"risk_pressure",contribution_pct:34.9,value:0.64,unit:"/1.0",severity:"critical",engineered:true},{factor:"High Usage / Wear",key:"usage_hours",contribution_pct:26.7,value:778.1,unit:"hrs",severity:"critical",engineered:false},{factor:"Overheating",key:"temperature",contribution_pct:23,value:91.2,unit:"\u00b0C",severity:"critical",engineered:false}],recommended_action:"URGENT: Reduce load; inspect cooling and airflow. Consider taking offline.",urgency:"immediate",estimated_savings_usd:1000,temperature:91.2,voltage:257.8,usage_hours:778.1,error_count:6},
  {charger_id:"CHG-017955",failure_probability:0.999999312,risk_score_pct:100,risk_level:"critical",flagged:true,confidence:"High",time_to_failure:"Failure within 24h",top_cause:"Overheating",top_contributors:[{factor:"Overheating",key:"temperature",contribution_pct:29.7,value:100,unit:"\u00b0C",severity:"critical",engineered:false},{factor:"Combined Risk Pressure",key:"risk_pressure",contribution_pct:29.3,value:0.57,unit:"/1.0",severity:"critical",engineered:true},{factor:"High Usage / Wear",key:"usage_hours",contribution_pct:28.9,value:800,unit:"hrs",severity:"critical",engineered:false}],recommended_action:"URGENT: Reduce load; inspect cooling and airflow. Consider taking offline.",urgency:"immediate",estimated_savings_usd:1000,temperature:100,voltage:251.6,usage_hours:800,error_count:3},
  {charger_id:"CHG-006395",failure_probability:0.9999992695,risk_score_pct:100,risk_level:"critical",flagged:true,confidence:"High",time_to_failure:"Failure within 24h",top_cause:"Combined Risk Pressure",top_contributors:[{factor:"Combined Risk Pressure",key:"risk_pressure",contribution_pct:35.7,value:0.63,unit:"/1.0",severity:"critical",engineered:true},{factor:"High Usage / Wear",key:"usage_hours",contribution_pct:28.8,value:800,unit:"hrs",severity:"critical",engineered:false},{factor:"Overheating",key:"temperature",contribution_pct:22.9,value:89.7,unit:"\u00b0C",severity:"critical",engineered:false}],recommended_action:"URGENT: Reduce load; inspect cooling and airflow. Consider taking offline.",urgency:"immediate",estimated_savings_usd:1000,temperature:89.7,voltage:209.1,usage_hours:800,error_count:12},
  {charger_id:"CHG-041241",failure_probability:0.9999990705,risk_score_pct:100,risk_level:"critical",flagged:true,confidence:"High",time_to_failure:"Failure within 24h",top_cause:"Overheating",top_contributors:[{factor:"Overheating",key:"temperature",contribution_pct:29.9,value:99.9,unit:"\u00b0C",severity:"critical",engineered:false},{factor:"Combined Risk Pressure",key:"risk_pressure",contribution_pct:29.8,value:0.57,unit:"/1.0",severity:"critical",engineered:true},{factor:"High Usage / Wear",key:"usage_hours",contribution_pct:29.1,value:800,unit:"hrs",severity:"critical",engineered:false}],recommended_action:"URGENT: Reduce load; inspect cooling and airflow. Consider taking offline.",urgency:"immediate",estimated_savings_usd:1000,temperature:99.9,voltage:210.5,usage_hours:800,error_count:5},
  {charger_id:"CHG-022511",failure_probability:0.9999989599,risk_score_pct:100,risk_level:"critical",flagged:true,confidence:"High",time_to_failure:"Failure within 24h",top_cause:"Overheating",top_contributors:[{factor:"Overheating",key:"temperature",contribution_pct:29.9,value:100,unit:"\u00b0C",severity:"critical",engineered:false},{factor:"High Usage / Wear",key:"usage_hours",contribution_pct:29.1,value:800,unit:"hrs",severity:"critical",engineered:false},{factor:"Combined Risk Pressure",key:"risk_pressure",contribution_pct:28.1,value:0.56,unit:"/1.0",severity:"critical",engineered:true}],recommended_action:"URGENT: Reduce load; inspect cooling and airflow. Consider taking offline.",urgency:"immediate",estimated_savings_usd:1000,temperature:100,voltage:207.5,usage_hours:800,error_count:1},
  {charger_id:"CHG-042683",failure_probability:0.9999989108,risk_score_pct:100,risk_level:"critical",flagged:true,confidence:"High",time_to_failure:"Failure within 24h",top_cause:"Combined Risk Pressure",top_contributors:[{factor:"Combined Risk Pressure",key:"risk_pressure",contribution_pct:35.4,value:0.62,unit:"/1.0",severity:"critical",engineered:true},{factor:"Overheating",key:"temperature",contribution_pct:30.2,value:100,unit:"\u00b0C",severity:"critical",engineered:false},{factor:"High Usage / Wear",key:"usage_hours",contribution_pct:21.9,value:667.6,unit:"hrs",severity:"critical",engineered:false}],recommended_action:"URGENT: Reduce load; inspect cooling and airflow. Consider taking offline.",urgency:"immediate",estimated_savings_usd:1000,temperature:100,voltage:207.7,usage_hours:667.6,error_count:7},
  {charger_id:"CHG-007831",failure_probability:0.9999986135,risk_score_pct:100,risk_level:"critical",flagged:true,confidence:"High",time_to_failure:"Failure within 24h",top_cause:"Combined Risk Pressure",top_contributors:[{factor:"Combined Risk Pressure",key:"risk_pressure",contribution_pct:31.9,value:0.59,unit:"/1.0",severity:"critical",engineered:true},{factor:"High Usage / Wear",key:"usage_hours",contribution_pct:29.8,value:800,unit:"hrs",severity:"critical",engineered:false},{factor:"Overheating",key:"temperature",contribution_pct:26.1,value:93.3,unit:"\u00b0C",severity:"critical",engineered:false}],recommended_action:"URGENT: Reduce load; inspect cooling and airflow. Consider taking offline.",urgency:"immediate",estimated_savings_usd:1000,temperature:93.3,voltage:250.8,usage_hours:800,error_count:7},
  {charger_id:"CHG-045945",failure_probability:0.9999982452,risk_score_pct:100,risk_level:"critical",flagged:true,confidence:"High",time_to_failure:"Failure within 24h",top_cause:"Combined Risk Pressure",top_contributors:[{factor:"Combined Risk Pressure",key:"risk_pressure",contribution_pct:42.8,value:0.71,unit:"/1.0",severity:"critical",engineered:true},{factor:"High Usage / Wear",key:"usage_hours",contribution_pct:22.4,value:605.5,unit:"hrs",severity:"critical",engineered:false},{factor:"Overheating",key:"temperature",contribution_pct:20.7,value:94.2,unit:"\u00b0C",severity:"critical",engineered:false}],recommended_action:"URGENT: Reduce load; inspect cooling and airflow. Consider taking offline.",urgency:"immediate",estimated_savings_usd:1000,temperature:94.2,voltage:201.2,usage_hours:605.5,error_count:5},
  {charger_id:"CHG-042090",failure_probability:0.9999981423,risk_score_pct:100,risk_level:"critical",flagged:true,confidence:"High",time_to_failure:"Failure within 24h",top_cause:"Overheating",top_contributors:[{factor:"Overheating",key:"temperature",contribution_pct:29,value:98.7,unit:"\u00b0C",severity:"critical",engineered:false},{factor:"Combined Risk Pressure",key:"risk_pressure",contribution_pct:28.4,value:0.56,unit:"/1.0",severity:"critical",engineered:true},{factor:"High Usage / Wear",key:"usage_hours",contribution_pct:27.7,value:766.4,unit:"hrs",severity:"critical",engineered:false}],recommended_action:"URGENT: Reduce load; inspect cooling and airflow. Consider taking offline.",urgency:"immediate",estimated_savings_usd:1000,temperature:98.7,voltage:252.7,usage_hours:766.4,error_count:1},
  {charger_id:"CHG-027916",failure_probability:0.9999979932,risk_score_pct:100,risk_level:"critical",flagged:true,confidence:"High",time_to_failure:"Failure within 24h",top_cause:"Combined Risk Pressure",top_contributors:[{factor:"Combined Risk Pressure",key:"risk_pressure",contribution_pct:32.4,value:0.58,unit:"/1.0",severity:"critical",engineered:true},{factor:"Overheating",key:"temperature",contribution_pct:27.2,value:96.8,unit:"\u00b0C",severity:"critical",engineered:false},{factor:"High Usage / Wear",key:"usage_hours",contribution_pct:27.1,value:800,unit:"hrs",severity:"critical",engineered:false}],recommended_action:"URGENT: Reduce load; inspect cooling and airflow. Consider taking offline.",urgency:"immediate",estimated_savings_usd:1000,temperature:96.8,voltage:212.9,usage_hours:800,error_count:8},
  {charger_id:"CHG-013041",failure_probability:0.9999977641,risk_score_pct:100,risk_level:"critical",flagged:true,confidence:"High",time_to_failure:"Failure within 24h",top_cause:"High Usage / Wear",top_contributors:[{factor:"High Usage / Wear",key:"usage_hours",contribution_pct:30.2,value:800,unit:"hrs",severity:"critical",engineered:false},{factor:"Overheating",key:"temperature",contribution_pct:25.2,value:88.5,unit:"\u00b0C",severity:"critical",engineered:false},{factor:"Combined Risk Pressure",key:"risk_pressure",contribution_pct:24.7,value:0.52,unit:"/1.0",severity:"critical",engineered:true}],recommended_action:"URGENT: Schedule preventive maintenance. Consider taking offline.",urgency:"immediate",estimated_savings_usd:1000,temperature:88.5,voltage:201.4,usage_hours:800,error_count:0},
  {charger_id:"CHG-032008",failure_probability:0.9999976544,risk_score_pct:100,risk_level:"critical",flagged:true,confidence:"High",time_to_failure:"Failure within 24h",top_cause:"Combined Risk Pressure",top_contributors:[{factor:"Combined Risk Pressure",key:"risk_pressure",contribution_pct:32.2,value:0.58,unit:"/1.0",severity:"critical",engineered:true},{factor:"High Usage / Wear",key:"usage_hours",contribution_pct:28.7,value:800,unit:"hrs",severity:"critical",engineered:false},{factor:"Overheating",key:"temperature",contribution_pct:24.7,value:95.3,unit:"\u00b0C",severity:"critical",engineered:false}],recommended_action:"URGENT: Reduce load; inspect cooling and airflow. Consider taking offline.",urgency:"immediate",estimated_savings_usd:1000,temperature:95.3,voltage:245.2,usage_hours:800,error_count:10},
  {charger_id:"CHG-027804",failure_probability:0.9999976086,risk_score_pct:100,risk_level:"critical",flagged:true,confidence:"High",time_to_failure:"Failure within 24h",top_cause:"Overheating",top_contributors:[{factor:"Overheating",key:"temperature",contribution_pct:28.5,value:98.9,unit:"\u00b0C",severity:"critical",engineered:false},{factor:"High Usage / Wear",key:"usage_hours",contribution_pct:28.1,value:800,unit:"hrs",severity:"critical",engineered:false},{factor:"Combined Risk Pressure",key:"risk_pressure",contribution_pct:27.2,value:0.55,unit:"/1.0",severity:"critical",engineered:true}],recommended_action:"URGENT: Reduce load; inspect cooling and airflow. Consider taking offline.",urgency:"immediate",estimated_savings_usd:1000,temperature:98.9,voltage:250.3,usage_hours:800,error_count:1},
  {charger_id:"CHG-017412",failure_probability:0.9999975989,risk_score_pct:100,risk_level:"critical",flagged:true,confidence:"High",time_to_failure:"Failure within 24h",top_cause:"Combined Risk Pressure",top_contributors:[{factor:"Combined Risk Pressure",key:"risk_pressure",contribution_pct:33.9,value:0.59,unit:"/1.0",severity:"critical",engineered:true},{factor:"High Usage / Wear",key:"usage_hours",contribution_pct:30,value:800,unit:"hrs",severity:"critical",engineered:false},{factor:"Overheating",key:"temperature",contribution_pct:20,value:82,unit:"\u00b0C",severity:"critical",engineered:false}],recommended_action:"URGENT: Reduce load; inspect cooling and airflow. Consider taking offline.",urgency:"immediate",estimated_savings_usd:1000,temperature:82,voltage:202.7,usage_hours:800,error_count:6},
  {charger_id:"CHG-020113",failure_probability:0.9999972584,risk_score_pct:100,risk_level:"critical",flagged:true,confidence:"High",time_to_failure:"Failure within 24h",top_cause:"Combined Risk Pressure",top_contributors:[{factor:"Combined Risk Pressure",key:"risk_pressure",contribution_pct:32,value:0.57,unit:"/1.0",severity:"critical",engineered:true},{factor:"High Usage / Wear",key:"usage_hours",contribution_pct:29.2,value:800,unit:"hrs",severity:"critical",engineered:false},{factor:"Overheating",key:"temperature",contribution_pct:22.9,value:85,unit:"\u00b0C",severity:"critical",engineered:false}],recommended_action:"URGENT: Reduce load; inspect cooling and airflow. Consider taking offline.",urgency:"immediate",estimated_savings_usd:1000,temperature:85,voltage:209.7,usage_hours:800,error_count:12},
  {charger_id:"CHG-010136",failure_probability:0.9999972281,risk_score_pct:100,risk_level:"critical",flagged:true,confidence:"High",time_to_failure:"Failure within 24h",top_cause:"Combined Risk Pressure",top_contributors:[{factor:"Combined Risk Pressure",key:"risk_pressure",contribution_pct:31.7,value:0.56,unit:"/1.0",severity:"critical",engineered:true},{factor:"High Usage / Wear",key:"usage_hours",contribution_pct:29.8,value:800,unit:"hrs",severity:"critical",engineered:false},{factor:"Error Frequency",key:"error_count",contribution_pct:18.3,value:19,unit:"errors",severity:"critical",engineered:false}],recommended_action:"URGENT: Reduce load; inspect cooling and airflow. Consider taking offline.",urgency:"immediate",estimated_savings_usd:1000,temperature:63,voltage:257.9,usage_hours:800,error_count:19},
  {charger_id:"CHG-043461",failure_probability:0.9999970918,risk_score_pct:100,risk_level:"critical",flagged:true,confidence:"High",time_to_failure:"Failure within 24h",top_cause:"Combined Risk Pressure",top_contributors:[{factor:"Combined Risk Pressure",key:"risk_pressure",contribution_pct:40.4,value:0.67,unit:"/1.0",severity:"critical",engineered:true},{factor:"Overheating",key:"temperature",contribution_pct:27.8,value:100,unit:"\u00b0C",severity:"critical",engineered:false},{factor:"High Usage / Wear",key:"usage_hours",contribution_pct:18.2,value:627.7,unit:"hrs",severity:"critical",engineered:false}],recommended_action:"URGENT: Reduce load; inspect cooling and airflow. Consider taking offline.",urgency:"immediate",estimated_savings_usd:1000,temperature:100,voltage:252.7,usage_hours:627.7,error_count:4},
  {charger_id:"CHG-012879",failure_probability:0.9999469403,risk_score_pct:100,risk_level:"critical",flagged:true,confidence:"High",time_to_failure:"Failure within 24h",top_cause:"Combined Risk Pressure",top_contributors:[{factor:"Combined Risk Pressure",key:"risk_pressure",contribution_pct:47.4,value:0.76,unit:"/1.0",severity:"critical",engineered:true},{factor:"High Usage / Wear",key:"usage_hours",contribution_pct:17.5,value:488.9,unit:"hrs",severity:"critical",engineered:false},{factor:"Overheating",key:"temperature",contribution_pct:17.1,value:84.6,unit:"\u00b0C",severity:"critical",engineered:false}],recommended_action:"URGENT: Reduce load; inspect cooling and airflow. Consider taking offline.",urgency:"immediate",estimated_savings_usd:999.99,temperature:84.6,voltage:263.1,usage_hours:488.9,error_count:9},
];

// ──────────────────────────────────────────────
// Seeded PRNG for deterministic generated chargers
// ──────────────────────────────────────────────

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

// ──────────────────────────────────────────────
// Build a lookup of real chargers by ID
// ──────────────────────────────────────────────

const REAL_CHARGER_MAP = new Map<string, RealCharger>();
REAL_CHARGERS.forEach((c) => REAL_CHARGER_MAP.set(c.charger_id, c));

// Build list items from real chargers
const REAL_LIST_ITEMS: ChargerListItem[] = REAL_CHARGERS.map((c) => ({
  charger_id: c.charger_id,
  risk_probability: c.failure_probability,
  risk_percent: c.risk_score_pct,
  risk_level: c.risk_level,
  flagged: c.flagged,
  top_cause: c.top_cause,
  action_summary: c.recommended_action,
  estimated_savings_usd: c.estimated_savings_usd,
}));

// ──────────────────────────────────────────────
// Generate remaining chargers (warning + safe)
// to fill out the fleet of 50,000
// ──────────────────────────────────────────────

const TOTAL = 50000;

const CAUSES_WARNING = [
  "Elevated Temperature",
  "Voltage Instability",
  "Usage Approaching Limit",
  "Error Rate Increase",
  "Connector Wear",
];

const CAUSES_SAFE = [
  "Normal Operation",
  "Routine Monitoring",
  "Stable Readings",
];

function generateSyntheticCharger(index: number): ChargerListItem {
  const rand = seededRandom(index * 7919 + 31);
  const r1 = rand();
  const r2 = rand();
  const r3 = rand();
  const r4 = rand();

  // Distribute: ~1595 warning, rest safe (matching real summary)
  // Use probability to roughly match the distribution
  const isWarning = r1 < 0.0338; // ~1595/47268

  const riskLevel: "warning" | "safe" = isWarning ? "warning" : "safe";
  const riskProb = isWarning ? 0.45 + r2 * 0.3 : r2 * 0.44;
  const riskPercent = Math.round(riskProb * 1000) / 10;
  const causeIdx = isWarning
    ? Math.floor(r3 * CAUSES_WARNING.length)
    : Math.floor(r3 * CAUSES_SAFE.length);
  const savings = isWarning ? Math.round(100 + r4 * 500) : 0;

  return {
    charger_id: `CHG-${String(index).padStart(6, "0")}`,
    risk_probability: riskProb,
    risk_percent: riskPercent,
    risk_level: riskLevel,
    flagged: isWarning,
    top_cause: isWarning ? CAUSES_WARNING[causeIdx] : CAUSES_SAFE[causeIdx],
    action_summary: isWarning
      ? "Schedule inspection; monitor temperature; review usage patterns"
      : "Continue monitoring; no action required",
    estimated_savings_usd: savings,
  };
}

// Cache for generated chargers
const SYNTH_CACHE = new Map<number, ChargerListItem>();

function getSyntheticCharger(index: number): ChargerListItem {
  if (!SYNTH_CACHE.has(index)) {
    SYNTH_CACHE.set(index, generateSyntheticCharger(index));
  }
  return SYNTH_CACHE.get(index)!;
}

// ──────────────────────────────────────────────
// Public API
// ──────────────────────────────────────────────

export function getMockSummary(): FleetSummary {
  return {
    total_chargers: REAL_SUMMARY.total_chargers,
    flagged_count: REAL_SUMMARY.flagged_count,
    critical_count: REAL_SUMMARY.critical_count,
    warning_count: REAL_SUMMARY.warning_count,
    safe_count: REAL_SUMMARY.safe_count,
    total_potential_savings_usd: REAL_SUMMARY.total_savings_usd,
    model_threshold: 0.75,
    model_version: "v5-gradient-boosted",
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
  // Build full list: real critical chargers first, then synthetic
  let items: ChargerListItem[] = [];

  if (params.query) {
    const q = params.query.toUpperCase();
    // Search real chargers first
    for (const c of REAL_LIST_ITEMS) {
      if (c.charger_id.toUpperCase().includes(q)) items.push(c);
    }
    // Then search synthetic
    for (let i = 0; i < TOTAL; i++) {
      const id = `CHG-${String(i).padStart(6, "0")}`;
      if (REAL_CHARGER_MAP.has(id)) continue; // skip, already in real
      if (id.includes(q)) items.push(getSyntheticCharger(i));
      if (items.length > 500) break;
    }
  } else {
    // All real chargers first
    items = [...REAL_LIST_ITEMS];
    // Then synthetic
    for (let i = 0; i < TOTAL; i++) {
      const id = `CHG-${String(i).padStart(6, "0")}`;
      if (REAL_CHARGER_MAP.has(id)) continue;
      items.push(getSyntheticCharger(i));
    }
  }

  // Filter by risk
  if (params.risk && params.risk !== "all") {
    items = items.filter((c) => c.risk_level === params.risk);
  }

  // Sort
  if (params.sort === "risk_desc") {
    items.sort((a, b) => b.risk_probability - a.risk_probability);
  } else if (params.sort === "savings_desc") {
    items.sort((a, b) => b.estimated_savings_usd - a.estimated_savings_usd);
  }

  const total = items.length;
  const page = params.page || 1;
  const limit = params.limit || 50;
  const start = (page - 1) * limit;
  const pageItems = items.slice(start, start + limit);

  return { page, limit, total, items: pageItems };
}

export function getMockChargerDetail(chargerId: string): ChargerDetail | null {
  // Check real data first
  const real = REAL_CHARGER_MAP.get(chargerId);
  if (real) {
    const contributors = real.top_contributors.map((tc) => ({
      name: tc.factor,
      percent: tc.contribution_pct,
      value: tc.value,
    }));

    const diagnosisItems = real.top_contributors
      .filter((tc) => !tc.engineered)
      .map((tc) => ({
        cause: tc.factor,
        percent: Math.round(tc.contribution_pct),
        evidence: `${tc.value}${tc.unit}`,
      }));

    return {
      charger_id: real.charger_id,
      risk_probability: real.failure_probability,
      risk_level: real.risk_level,
      flagged: real.flagged,
      time_to_failure: "within_24h",
      confidence: real.confidence.toLowerCase() as "high" | "medium" | "low",
      estimated_savings_usd: real.estimated_savings_usd,
      metrics: {
        temperature: real.temperature,
        voltage: real.voltage,
        usage_hours: real.usage_hours,
        error_count: real.error_count,
        thermal_stress: Math.round(real.temperature * 0.85 * 10) / 10,
        voltage_deviation: Math.round(Math.abs(real.voltage - 230) * 10) / 10,
        error_density: real.error_count > 0 ? Math.round((real.error_count / real.usage_hours) * 1000) / 1000 : 0,
        risk_pressure: real.top_contributors.find((tc) => tc.key === "risk_pressure")?.value ?? 0.5,
      },
      contributors,
      recommendation: {
        summary: `Charger ${real.charger_id} is at critical risk (${real.risk_score_pct}%). ${real.time_to_failure}. Primary concern: ${real.top_cause}.`,
        diagnosis: diagnosisItems,
        actions: real.recommended_action.split(";").map((a) => a.trim().replace(/^\w+:\s*/, "")),
        urgency: real.urgency as "immediate" | "soon" | "monitor",
      },
    };
  }

  // Fallback: generate synthetic detail
  const match = chargerId.match(/CHG-(\d+)/);
  if (!match) return null;
  const index = parseInt(match[1], 10);
  if (index < 0 || index >= TOTAL) return null;

  const c = getSyntheticCharger(index);
  const rand = seededRandom(index * 1237 + 77);

  const temp = 40 + rand() * 35;
  const voltage = 220 + rand() * 20;
  const usageHours = Math.round(100 + rand() * 500);
  const errorCount = Math.round(rand() * 4);

  return {
    charger_id: c.charger_id,
    risk_probability: c.risk_probability,
    risk_level: c.risk_level,
    flagged: c.flagged,
    time_to_failure: c.risk_level === "warning" ? "within_1_week" : "none",
    confidence: c.risk_probability > 0.4 ? "medium" : "low",
    estimated_savings_usd: c.estimated_savings_usd,
    metrics: {
      temperature: Math.round(temp * 10) / 10,
      voltage: Math.round(voltage * 10) / 10,
      usage_hours: usageHours,
      error_count: errorCount,
      thermal_stress: Math.round(temp * 0.6 * 10) / 10,
      voltage_deviation: Math.round(Math.abs(voltage - 230) * 10) / 10,
      error_density: errorCount > 0 ? Math.round((errorCount / usageHours) * 1000) / 1000 : 0,
      risk_pressure: Math.round(c.risk_probability * 100) / 100,
    },
    contributors: [
      { name: c.top_cause, percent: 45, value: temp },
      { name: "Usage Load", percent: 30, value: usageHours },
      { name: "Error Rate", percent: 25, value: errorCount },
    ],
    recommendation: {
      summary: c.risk_level === "warning"
        ? `Charger ${c.charger_id} shows elevated risk (${c.risk_percent}%). Schedule inspection within 1 week.`
        : `Charger ${c.charger_id} is operating normally (${c.risk_percent}% risk). Continue routine monitoring.`,
      diagnosis: c.risk_level === "warning"
        ? [{ cause: c.top_cause, percent: 45, evidence: `${Math.round(temp)}\u00b0C` }]
        : [],
      actions: c.risk_level === "warning"
        ? ["Schedule maintenance inspection within 1 week", "Monitor temperature and voltage readings"]
        : ["Continue routine monitoring", "No immediate action required"],
      urgency: c.risk_level === "warning" ? "soon" : "monitor",
    },
  };
}

export function getMockInsights(): InsightsData {
  // Aggregate causes from real data
  const causeCounts: Record<string, number> = {};
  for (const c of REAL_CHARGERS) {
    causeCounts[c.top_cause] = (causeCounts[c.top_cause] || 0) + 1;
  }
  // Scale up to full fleet proportions
  const scale = REAL_SUMMARY.critical_count / REAL_CHARGERS.length;
  const topCauses = Object.entries(causeCounts)
    .map(([cause, count]) => ({ cause, count: Math.round(count * scale) }))
    .sort((a, b) => b.count - a.count);

  // Add warning causes
  topCauses.push(
    { cause: "Elevated Temperature", count: 498 },
    { cause: "Voltage Instability", count: 387 },
    { cause: "Usage Approaching Limit", count: 341 },
    { cause: "Connector Wear", count: 212 },
    { cause: "Error Rate Increase", count: 157 },
  );

  return {
    top_causes: topCauses,
    savings_by_risk: [
      { level: "Critical", savings: Math.round(REAL_SUMMARY.total_savings_usd * 0.82) },
      { level: "Warning", savings: Math.round(REAL_SUMMARY.total_savings_usd * 0.18) },
      { level: "Safe", savings: 0 },
    ],
    risk_distribution: [
      { level: "Critical", count: REAL_SUMMARY.critical_count },
      { level: "Warning", count: REAL_SUMMARY.warning_count },
      { level: "Safe", count: REAL_SUMMARY.safe_count },
    ],
  };
}
