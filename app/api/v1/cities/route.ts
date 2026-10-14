import { NextResponse } from "next/server";
import { CITIES } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json({
    version: "v1",
    success: true,
    total: CITIES.length,
    data: CITIES,
  });
}
