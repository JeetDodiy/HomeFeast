import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required" },
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
