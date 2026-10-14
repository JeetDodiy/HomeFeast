import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const sampleOrders = [
    {
      id: "HF-ORD-8821",
      cookId: "c1",
      cookName: "Meera's Kitchen",
      planName: "Weekly Plan – Gujarati Thali",
      status: "active",
      deliveryDate: "2024-10-14",
      slot: "Lunch (12–1 PM)",
      totalAmount: 749,
      deliveredCount: 4,
      totalCount: 7,
    },
    {
      id: "HF-ORD-7419",
      cookId: "c2",
      cookName: "Priya's Home Kitchen",
      planName: "Daily Plan – South Indian Breakfast",
      status: "completed",
      deliveryDate: "2024-09-20",
      slot: "Breakfast (7–8 AM)",
      totalAmount: 130,
      deliveredCount: 1,
      totalCount: 1,
    },
  ];

  const results = status ? sampleOrders.filter((o) => o.status === status) : sampleOrders;
  return NextResponse.json({ version: "v1", success: true, count: results.length, data: results });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderId = `HF-ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = {
      id: orderId,
      status: "PLACED",
      createdAt: new Date().toISOString(),
      ...body,
    };

    return NextResponse.json(
      { version: "v1", success: true, message: "Order placed successfully", data: newOrder },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ version: "v1", success: false, error: "Failed to place order" }, { status: 400 });
  }
}
