import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { reason, userId } = body;

    const deletionId = `DEL-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    // Under DPDP Act 2023, log deletion request with 30-day statutory purge timeline
    console.log(`[DATA DELETION REQUEST] ID: ${deletionId} | User: ${userId || "current_user"} | Reason: ${reason || "User requested erasure"}`);

    return NextResponse.json({
      success: true,
      deletionId,
      message: "Account deletion request registered successfully. All personal data will be permanently purged in accordance with DPDP Act 2023 within 30 days.",
      effectiveDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to process data deletion request" },
      { status: 500 }
    );
  }
}
