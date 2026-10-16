import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const cookId = searchParams.get("cookId");
  const status = searchParams.get("status");

  try {
    const where: any = {};
    if (status) where.status = status.toUpperCase();

    if (cookId) {
      const matchedCook = await prisma.cook.findFirst({
        where: {
          OR: [
            { id: cookId },
            { userId: cookId },
            { kitchenName: { contains: cookId.replace(/^c_/, ""), mode: "insensitive" } },
          ],
        },
      });
      if (matchedCook) {
        where.cookId = matchedCook.id;
      }
    }

    if (userId) {
      const matchedUser = await prisma.user.findFirst({
        where: {
          OR: [{ id: userId }, { email: userId }],
        },
      });
      if (matchedUser) {
        where.userId = matchedUser.id;
      }
    }

    const subscriptions = await prisma.subscription.findMany({
      where,
      include: {
        cook: true,
        user: true,
        plan: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = subscriptions.map((s) => ({
      id: s.id,
      userId: s.userId,
      cookId: s.cookId,
      cookName: s.cook?.kitchenName || "HomeFeast Kitchen",
      name: s.user?.name || "Customer",
      customerName: s.user?.name || "Customer",
      phone: s.user?.phone || "+91 98251 00000",
      planName: s.plan?.name || "Weekly Saver Plan (7 Days)",
      plan: s.plan?.name || "Weekly Saver Plan (7 Days)",
      status: s.status,
      slot: s.deliverySlot,
      address: s.deliveryAddress,
      deliveryAddress: s.deliveryAddress,
      startDate: s.startDate.toISOString().split("T")[0],
      endDate: s.endDate.toISOString().split("T")[0],
      price: s.plan?.price || 749,
      remainingMeals: s.plan?.type === "MONTHLY" ? 30 : 7,
      totalMeals: s.plan?.type === "MONTHLY" ? 30 : 7,
      dietPreference: s.specialNotes || "Standard pure veg",
    }));

    return NextResponse.json({
      version: "v1",
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    console.error("Subscriptions GET error:", error);
    return NextResponse.json({ version: "v1", success: false, error: "Database service error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const targetCook =
      (await prisma.cook.findFirst({
        where: {
          OR: [{ id: body.cookId }, { kitchenName: { contains: body.cookName || "Jeet", mode: "insensitive" } }],
        },
        include: { plans: true },
      })) || (await prisma.cook.findFirst({ include: { plans: true } }))!;

    const targetUser =
      (await prisma.user.findFirst({
        where: {
          OR: [{ id: body.userId }, { email: body.email || "demo@customer.com" }],
        },
      })) || (await prisma.user.findFirst({ where: { role: "CUSTOMER" } }))!;

    const targetPlan = targetCook.plans[0] || (await prisma.plan.findFirst())!;

    const duration = Number(body.durationDays) || 7;
    const startDate = body.startDate ? new Date(body.startDate) : new Date();
    const endDate = new Date(startDate.getTime() + duration * 86400000);

    const newSubscription = await prisma.subscription.create({
      data: {
        userId: targetUser.id,
        cookId: targetCook.id,
        planId: targetPlan.id,
        startDate: isNaN(startDate.getTime()) ? new Date() : startDate,
        endDate: isNaN(endDate.getTime()) ? new Date(Date.now() + 7 * 86400000) : endDate,
        deliverySlot: body.slot || body.mealSlot || "Lunch (12–1:30 PM)",
        deliveryAddress: body.address || body.deliveryAddress || "Home delivery, Rajkot",
        status: "ACTIVE",
      },
    });

    return NextResponse.json(
      { version: "v1", success: true, message: "Subscription created in PostgreSQL", data: newSubscription },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Subscription create error:", err);
    return NextResponse.json(
      { version: "v1", success: false, error: err?.message || "Invalid payload" },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;
    if (!id) {
      return NextResponse.json({ version: "v1", success: false, error: "Subscription id required" }, { status: 400 });
    }

    const updated = await prisma.subscription.update({
      where: { id },
      data: {
        ...(status ? { status: status.toUpperCase() } : {}),
      },
    });

    return NextResponse.json({ version: "v1", success: true, data: updated });
  } catch (err: any) {
    console.error("Subscription PATCH error:", err);
    return NextResponse.json({ version: "v1", success: false, error: err?.message || "Failed to update" }, { status: 400 });
  }
}
