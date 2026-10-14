import { NextResponse } from "next/server";

const REVIEWS = [
  {
    id: "rev-1",
    cookId: "c1",
    customerName: "Rohan Mehta",
    rating: 5,
    date: "2024-10-10",
    comment: "Truly tastes like ghar ka khana! Phulkas are super soft and sabzi has minimal oil.",
  },
  {
    id: "rev-2",
    cookId: "c1",
    customerName: "Anjali Gupta",
    rating: 5,
    date: "2024-10-08",
    comment: "The Dal Baati Churma on Sunday was mind-blowing. Consistent quality every single day.",
  },
  {
    id: "rev-3",
    cookId: "c2",
    customerName: "Vikram Shah",
    rating: 4,
    date: "2024-10-11",
    comment: "Very authentic Kathiyawadi flavors! Ringna no Olo is fantastic.",
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cookId = searchParams.get("cookId");
  const filtered = cookId ? REVIEWS.filter((r) => r.cookId === cookId) : REVIEWS;
  return NextResponse.json({ success: true, count: filtered.length, data: filtered });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newReview = {
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      ...body,
    };
    return NextResponse.json(
      { success: true, message: "Review posted successfully. Thank you for your feedback!", data: newReview },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ success: false, error: "Invalid review submission" }, { status: 400 });
  }
}
