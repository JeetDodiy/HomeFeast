import { NextResponse } from "next/server";

export async function GET() {
  const sampleOrders = [
    {
      id: "HF-ORD-8821",
      cookId: "c1",
      cookName: "Meera's Kitchen",
      planName: "Weekly Plan – Gujarati Thali",
      status: "active",
      startDate: "2024-10-10",
      endDate: "2024-10-17",
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
      startDate: "2024-09-20",
      endDate: "2024-09-21",
      slot: "Breakfast (7–8 AM)",
      totalAmount: 130,
      deliveredCount: 1,
      totalCount: 1,
    },
  ];

  return NextResponse.json({
    success: true,
    data: sampleOrders,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderId = `HF-ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = {
      id: orderId,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      ...body,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully",
        data: newOrder,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 400 });
  }
}
