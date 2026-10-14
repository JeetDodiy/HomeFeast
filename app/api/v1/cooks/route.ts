import { NextResponse } from "next/server";
import { COOKS } from "@/lib/mockData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city")?.toLowerCase();
  const mealType = searchParams.get("mealType") || searchParams.get("type");
  const cuisine = searchParams.get("cuisine");
  const query = searchParams.get("q")?.toLowerCase();
  const sort = searchParams.get("sort");

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

  if (sort === "price") {
    filtered.sort((a, b) => a.plans[0].price - b.plans[0].price);
  } else if (sort === "reviews") {
    filtered.sort((a, b) => b.totalReviews - a.totalReviews);
  } else {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  return NextResponse.json({
    version: "v1",
    success: true,
    total: filtered.length,
    data: filtered,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newCook = {
      id: `c_${Date.now()}`,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      ...body,
    };
    return NextResponse.json(
      { version: "v1", success: true, message: "Cook application submitted for verification", data: newCook },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ version: "v1", success: false, error: "Invalid cook payload" }, { status: 400 });
  }
}
