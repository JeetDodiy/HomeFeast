import { NextResponse } from "next/server";
import { COOKS } from "@/lib/mockData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city")?.toLowerCase();
  const mealType = searchParams.get("type"); // veg / nonveg
  const cuisine = searchParams.get("cuisine");
  const query = searchParams.get("q")?.toLowerCase();

  let filtered = [...COOKS];

  if (city) {
    filtered = filtered.filter((c) => c.city.toLowerCase() === city);
  }
  if (mealType === "veg") {
    filtered = filtered.filter((c) => c.isVeg);
  } else if (mealType === "nonveg") {
    filtered = filtered.filter((c) => !c.isVeg);
  }
  if (cuisine) {
    filtered = filtered.filter((c) => c.cuisines.includes(cuisine));
  }
  if (query) {
    filtered = filtered.filter(
      (c) =>
        c.kitchenName.toLowerCase().includes(query) ||
        c.name.toLowerCase().includes(query) ||
        c.area.toLowerCase().includes(query)
    );
  }

  return NextResponse.json({
    success: true,
    total: filtered.length,
    data: filtered,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newCook = {
      id: `c${Date.now()}`,
      status: "pending_approval",
      ...body,
      createdAt: new Date().toISOString(),
    };
    return NextResponse.json({ success: true, message: "Cook application submitted", data: newCook }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request payload" }, { status: 400 });
  }
}
