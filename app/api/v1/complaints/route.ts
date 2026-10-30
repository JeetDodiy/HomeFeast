import { NextResponse } from "next/server";

const COMPLAINTS = [
  {
    id: "comp-1",
    orderId: "HF-ORD-8821",
    customerName: "Rohan Mehta",
    cookName: "Meera's Kitchen",
    subject: "Delivery Delayed by 45 Minutes",
    details: "Lunch tiffin reached at 1:45 PM instead of the 12:30 PM slot. Food was cold.",
    status: "in-review",
    createdAt: "2024-10-14",
    adminNote: "Contacted delivery partner. Apology credit of ₹50 issued.",
  },
  {
    id: "comp-2",
    orderId: "HF-ORD-7419",
    customerName: "Anjali Dave",
    cookName: "Priya's Home Kitchen",
    subject: "Missing Sambar in South Indian Tiffin",
    details: "The tiffin contained idlis and chutney, but the sambar container was omitted.",
    status: "resolved",
    createdAt: "2024-10-12",
    adminNote: "Cook confirmed mistake. 1-meal free replacement provided.",
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const filtered = status ? COMPLAINTS.filter((c) => c.status === status) : COMPLAINTS;
  return NextResponse.json({ success: true, count: filtered.length, data: filtered });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newComplaint = {
      id: `comp-${Date.now()}`,
      status: "open",
      createdAt: new Date().toISOString().split("T")[0],
      adminNote: "",
      ...body,
    };
    return NextResponse.json(
      { success: true, message: "Complaint raised successfully. Admin will review within 24 hours.", data: newComplaint },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request payload" }, { status: 400 });
  }
}
