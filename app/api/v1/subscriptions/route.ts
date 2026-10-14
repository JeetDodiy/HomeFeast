import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  const subscriptions = [
    {
      id: "s1",
      userId: userId || "u1",
      cookId: "c1",
      cookName: "Meera's Kitchen",
      planName: "Weekly Plan – Gujarati Thali",
      status: "ACTIVE",
      startDate: "2024-10-07",
      endDate: "2024-10-14",
      slot: "Lunch (12–1 PM)",
      price: 749,
      remainingMeals: 4,
    },
    {
      id: "s2",
      userId: userId || "u1",
      cookId: "c3",
      cookName: "Jain Bhavan Tiffin",
      planName: "Monthly Plan – Pure Jain Thali",
      status: "PAUSED",
      startDate: "2024-09-15",
      endDate: "2024-10-15",
      slot: "Lunch (11:30 AM–1 PM)",
      price: 3599,
      remainingMeals: 14,
    },
  ];

  return NextResponse.json({ success: true, count: subscriptions.length, data: subscriptions });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newSubscription = {
      id: `s_${Date.now()}`,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      ...body,
    };
    return NextResponse.json({ success: true, message: "Subscription created", data: newSubscription }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
  }
}
