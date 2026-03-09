import type {
  FleetSummary,
  FleetRecommendationsResponse,
  ChargerDetail,
  InsightsData,
  FleetQueryParams,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

async function fetchApi<T>(path: string): Promise<T> {
  const url = API_BASE ? `${API_BASE}${path}` : `/api${path}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function getFleetSummary(): Promise<FleetSummary> {
  return fetchApi<FleetSummary>("/fleet/summary");
}

export async function getFleetRecommendations(
  params: FleetQueryParams
): Promise<FleetRecommendationsResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(params.page));
  searchParams.set("limit", String(params.limit));
  if (params.risk && params.risk !== "all") {
    searchParams.set("risk", params.risk);
  }
  if (params.sort) {
    searchParams.set("sort", params.sort);
  }
  if (params.query) {
    searchParams.set("query", params.query);
  }
  return fetchApi<FleetRecommendationsResponse>(
    `/fleet/recommendations?${searchParams.toString()}`
  );
}

export async function getChargerDetail(
  chargerId: string
): Promise<ChargerDetail> {
  return fetchApi<ChargerDetail>(`/fleet/charger/${chargerId}`);
}

export async function getInsights(): Promise<InsightsData> {
  return fetchApi<InsightsData>("/fleet/insights");
}
