import useSWR from "swr";
import type {
  FleetSummary,
  FleetRecommendationsResponse,
  ChargerDetail,
  InsightsData,
  FleetQueryParams,
} from "./types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useFleetSummary() {
  return useSWR<FleetSummary>("/api/fleet/summary", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 30000,
  });
}

export function useFleetRecommendations(params: FleetQueryParams) {
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
  const key = `/api/fleet/recommendations?${searchParams.toString()}`;

  return useSWR<FleetRecommendationsResponse>(key, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });
}

export function useChargerDetail(chargerId: string | null) {
  return useSWR<ChargerDetail>(
    chargerId ? `/api/fleet/charger/${chargerId}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );
}

export function useInsights() {
  return useSWR<InsightsData>("/api/fleet/insights", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });
}
