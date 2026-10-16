import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, error: "A valid email address is required" },
        { status: 400 }
      );
    }

    if (!message || message.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: "Message must be at least 10 characters long" },
        { status: 400 }
      );
    }

    const ticketId = `HF-TKT-${Math.floor(10000 + Math.random() * 90000)}`;

    return NextResponse.json(
      {
        success: true,
        message: "Support ticket generated successfully. We will reply within 24 hours.",
        ticketId,
        data: {
          ticketId,
          name,
          email,
          subject: subject || "General Inquiry",
          createdAt: new Date().toISOString(),
          status: "OPEN",
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to process contact inquiry" },
      { status: 500 }
    );
  }
}
