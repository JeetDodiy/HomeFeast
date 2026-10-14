import { NextResponse } from "next/server";
import { CITIES } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: CITIES,
  });
}
