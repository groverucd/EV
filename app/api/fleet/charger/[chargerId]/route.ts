import { NextResponse } from "next/server";
import { getMockChargerDetail } from "@/lib/mock-data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ chargerId: string }> }
) {
  const { chargerId } = await params;
  const detail = getMockChargerDetail(chargerId);
  if (!detail) {
    return NextResponse.json(
      { error: "Charger not found" },
      { status: 404 }
    );
  }
  return NextResponse.json(detail);
}
