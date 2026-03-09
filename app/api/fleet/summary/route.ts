import { NextResponse } from "next/server";
import { getMockSummary } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json(getMockSummary());
}
