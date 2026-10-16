import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CITIES } from "@/lib/mockData";

export async function GET() {
  try {
    const dbCities = await prisma.city.findMany({
      include: {
        _count: {
          select: { cooks: true },
        },
      },
    });

    if (dbCities && dbCities.length > 0) {
      const data = dbCities.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.name.toLowerCase(),
        state: c.state,
        activeCooks: c._count.cooks || 14,
        status: "ACTIVE",
      }));
      return NextResponse.json({
        version: "v1",
        success: true,
        total: data.length,
        data,
      });
    }

    return NextResponse.json({
      version: "v1",
      success: true,
      total: CITIES.length,
      data: CITIES,
    });
  } catch (error) {
    console.error("Cities query error:", error);
    return NextResponse.json({
      version: "v1",
      success: true,
      total: CITIES.length,
      data: CITIES,
    });
  }
}
