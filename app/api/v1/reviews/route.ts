import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cookId = searchParams.get("cookId");

  try {
    const where: any = {};
    if (cookId) {
      const targetCook = await prisma.cook.findFirst({
        where: {
          OR: [{ id: cookId }, { kitchenName: { contains: cookId.replace(/^c_/, ""), mode: "insensitive" } }],
        },
      });
      if (targetCook) where.cookId = targetCook.id;
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = reviews.map((r) => ({
      id: r.id,
      cookId: r.cookId,
      customerName: r.user?.name || "Customer",
      rating: r.rating,
      date: r.createdAt.toISOString().split("T")[0],
      comment: r.comment,
    }));

    return NextResponse.json({
      version: "v1",
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    console.error("Reviews GET error:", error);
    return NextResponse.json({ version: "v1", success: false, error: "Database service error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.comment || body.comment.trim().length < 5) {
      return NextResponse.json({ success: false, error: "Review comment must be at least 5 characters long." }, { status: 400 });
    }

    // 1. Resolve Cook in PostgreSQL
    let targetCook = await prisma.cook.findFirst({
      where: {
        OR: [
          { id: body.cookId },
          { kitchenName: { contains: body.cookName || "Jeet", mode: "insensitive" } },
        ],
      },
    });
    if (!targetCook) targetCook = (await prisma.cook.findFirst())!;

    // 2. Resolve User in PostgreSQL
    let targetUser = await prisma.user.findFirst({
      where: {
        OR: [
          { id: body.userId },
          { email: body.email || "demo@customer.com" },
        ],
      },
    });
    if (!targetUser) targetUser = (await prisma.user.findFirst({ where: { role: "CUSTOMER" } }))!;

    const ratingVal = Math.max(1, Math.min(5, Number(body.rating) || 5));

    // 3. Create review in PostgreSQL
    const newReview = await prisma.review.create({
      data: {
        userId: targetUser.id,
        cookId: targetCook.id,
        rating: ratingVal,
        comment: body.comment.trim(),
      },
      include: { user: true },
    });

    // 4. Update cook rating and total reviews in PostgreSQL
    const prevTotal = targetCook.totalReviews || 0;
    const prevRating = targetCook.ratingAvg || 5.0;
    const newTotal = prevTotal + 1;
    const newRating = Number((((prevRating * prevTotal) + ratingVal) / newTotal).toFixed(1));

    await prisma.cook.update({
      where: { id: targetCook.id },
      data: {
        totalReviews: newTotal,
        ratingAvg: newRating,
      },
    });

    return NextResponse.json(
      {
        version: "v1",
        success: true,
        message: "Review posted successfully in PostgreSQL. Cook rating updated!",
        data: {
          id: newReview.id,
          customerName: newReview.user?.name,
          rating: newReview.rating,
          comment: newReview.comment,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Review POST error:", err);
    return NextResponse.json({ version: "v1", success: false, error: err?.message || "Invalid review submission" }, { status: 400 });
  }
}
