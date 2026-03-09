import { NextResponse, type NextRequest } from "next/server";
import { getMockRecommendations } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "50", 10);
  const risk = searchParams.get("risk") || undefined;
  const sort = searchParams.get("sort") || undefined;
  const query = searchParams.get("query") || undefined;

  const data = getMockRecommendations({ page, limit, risk, sort, query });
  return NextResponse.json(data);
}
