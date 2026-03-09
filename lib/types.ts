export interface FleetSummary {
  total_chargers: number;
  flagged_count: number;
  critical_count: number;
  warning_count: number;
  safe_count: number;
  total_potential_savings_usd: number;
  model_threshold: number;
  model_version: string;
  primary_metric: {
    failure_recall: number;
  };
}

export interface ChargerListItem {
  charger_id: string;
  risk_probability: number;
  risk_percent: number;
  risk_level: "critical" | "warning" | "safe";
  flagged: boolean;
  top_cause: string;
  action_summary: string;
  estimated_savings_usd: number;
}

export interface FleetRecommendationsResponse {
  page: number;
  limit: number;
  total: number;
  items: ChargerListItem[];
}

export interface ChargerMetrics {
  temperature: number;
  voltage: number;
  usage_hours: number;
  error_count: number;
  thermal_stress: number;
  voltage_deviation: number;
  error_density: number;
  risk_pressure: number;
}

export interface Contributor {
  name: string;
  percent: number;
  value: number;
}

export interface Diagnosis {
  cause: string;
  percent: number;
  evidence: string;
}

export interface Recommendation {
  summary: string;
  diagnosis: Diagnosis[];
  actions: string[];
  urgency: "immediate" | "soon" | "monitor";
}

export interface ChargerDetail {
  charger_id: string;
  risk_probability: number;
  risk_level: "critical" | "warning" | "safe";
  flagged: boolean;
  time_to_failure: "within_24h" | "within_1_week" | "none";
  confidence: "high" | "medium" | "low";
  estimated_savings_usd: number;
  metrics: ChargerMetrics;
  contributors: Contributor[];
  recommendation: Recommendation;
}

export type RiskFilter = "all" | "critical" | "warning" | "safe";
export type SortOption = "risk_desc" | "savings_desc" | "charger_id";

export interface FleetQueryParams {
  page: number;
  limit: number;
  risk?: RiskFilter;
  sort?: SortOption;
  query?: string;
}

export interface InsightsData {
  top_causes: { cause: string; count: number }[];
  savings_by_risk: { level: string; savings: number }[];
  risk_distribution: { level: string; count: number }[];
}
