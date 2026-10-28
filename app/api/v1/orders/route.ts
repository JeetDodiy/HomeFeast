import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const cookId = searchParams.get("cookId");
  const cookEmail = searchParams.get("email");
  const kitchen = searchParams.get("kitchen");
  const userId = searchParams.get("userId");

  try {
    const where: any = {};
    if (status) where.status = status.toUpperCase();

    // If cookId, email, or kitchen is specified
    if (cookId || cookEmail || kitchen) {
      const orConditions: any[] = [];
      if (cookId) {
        orConditions.push({ id: cookId });
        orConditions.push({ userId: cookId });
        if (cookId.includes("@")) {
          orConditions.push({ user: { email: { equals: cookId, mode: "insensitive" } } });
        }
      }
      if (cookEmail) {
        orConditions.push({ user: { email: { equals: cookEmail, mode: "insensitive" } } });
      }
      if (kitchen) {
        const cleanK = kitchen.replace(/['’]s\s*Kitchen/i, "").trim();
        orConditions.push({ kitchenName: { equals: kitchen, mode: "insensitive" } });
        if (cleanK) {
          orConditions.push({ kitchenName: { contains: cleanK, mode: "insensitive" } });
        }
      }

      const matchedCook = await prisma.cook.findFirst({
        where: { OR: orConditions },
        include: { user: true },
      });
      if (matchedCook) {
        where.cookId = matchedCook.id;
      } else {
        // Return 0 orders if cook specified does not exist
        where.cookId = "NO_MATCHING_COOK";
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

    const orders = await prisma.order.findMany({
      where,
      include: {
        cook: true,
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = orders.map((o) => ({
      id: o.id,
      userId: o.userId,
      cookId: o.cookId,
      cookName: o.cook?.kitchenName || "HomeFeast Kitchen",
      customerName: o.user?.name || "Customer",
      customer: o.user?.name || "Customer",
      phone: o.user?.phone || "+91 98251 00000",
      planName: "Weekly Saver Plan",
      plan: "Weekly Saver Plan",
      status: o.status,
      deliveryDate: o.deliveryDate.toISOString().split("T")[0],
      date: o.deliveryDate.toISOString().split("T")[0],
      slot: o.slot,
      totalAmount: o.totalAmount,
      amount: o.totalAmount,
      items: o.items.length > 0 ? o.items : ["Daily Home Thali", "Phulka Roti", "Dal/Kadhi", "Sabzi", "Rice"],
      deliveryAddress: o.deliveryAddress,
      address: o.deliveryAddress,
      packedItems: { sabzi: false, rotis: false, dal: false, rice: false },
    }));

    // Deduplicate orders by ID or customer+slot+date
    const seenOrderIds = new Set<string>();
    const seenCustomerSlots = new Set<string>();
    const deduplicatedOrders: typeof formatted = [];

    for (const o of formatted) {
      const slotKey = `${(o.customer || o.customerName || "").toLowerCase().trim()}_${(o.slot || "").toLowerCase().trim()}_${o.date || o.deliveryDate || ""}`;
      if (seenOrderIds.has(o.id) || seenCustomerSlots.has(slotKey)) {
        continue;
      }
      seenOrderIds.add(o.id);
      seenCustomerSlots.add(slotKey);
      deduplicatedOrders.push(o);
    }

    return NextResponse.json({
      version: "v1",
      success: true,
      count: deduplicatedOrders.length,
      data: deduplicatedOrders,
    });
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json({ version: "v1", success: false, error: "Database service error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Resolve Cook in PostgreSQL
    const orCookConditions: any[] = [];
    if (body.cookId) orCookConditions.push({ id: body.cookId }, { userId: body.cookId });
    if (body.cookName) {
      orCookConditions.push(
        { kitchenName: { equals: body.cookName, mode: "insensitive" } },
        { kitchenName: { contains: body.cookName, mode: "insensitive" } }
      );
    }

    let targetCook = orCookConditions.length > 0
      ? await prisma.cook.findFirst({
          where: { OR: orCookConditions },
          include: { plans: true },
        })
      : null;

    if (!targetCook) {
      targetCook = (await prisma.cook.findFirst({ include: { plans: true } }))!;
    }

    // 2. Resolve User in PostgreSQL
    let targetUser = await prisma.user.findFirst({
      where: {
        OR: [
          { id: body.userId },
          { email: body.email || "demo@customer.com" },
        ],
      },
    });
    if (!targetUser) {
      targetUser = (await prisma.user.findFirst({ where: { role: "CUSTOMER" } }))!;
    }

    // 3. Resolve Plan in PostgreSQL
    let targetPlan = targetCook.plans.find((p) => p.id === body.planId);
    if (!targetPlan && body.planId) {
      targetPlan = (await prisma.plan.findUnique({ where: { id: body.planId } })) || undefined;
    }
    if (!targetPlan) {
      targetPlan = targetCook.plans[0] || (await prisma.plan.findFirst())!;
    }

    // 4. Create Order in PostgreSQL
    const deliveryDate = body.startDate ? new Date(body.startDate) : new Date();
    const newOrder = await prisma.order.create({
      data: {
        userId: targetUser.id,
        cookId: targetCook.id,
        totalAmount: Number(body.totalAmount) || 749,
        deliveryDate: isNaN(deliveryDate.getTime()) ? new Date() : deliveryDate,
        slot: body.mealSlot || body.slot || "Lunch (12–1:30 PM)",
        status: "CONFIRMED",
        deliveryAddress: body.deliveryAddress || "Home delivery, Rajkot",
        items: body.items || ["Daily Kathiyawadi Thali", "Phulka Roti (4 pcs)", "Dal", "Sabzi", "Rice"],
      },
      include: {
        cook: true,
        user: true,
      },
    });

    // 5. Create Subscription in PostgreSQL if requested
    if (body.createSubscription || body.durationDays) {
      const duration = Number(body.durationDays) || 7;
      const startDate = deliveryDate;
      const endDate = new Date(startDate.getTime() + duration * 86400000);

      await prisma.subscription.create({
        data: {
          userId: targetUser.id,
          cookId: targetCook.id,
          planId: targetPlan.id,
          startDate,
          endDate,
          deliverySlot: newOrder.slot,
          deliveryAddress: newOrder.deliveryAddress,
          status: "ACTIVE",
        },
      });
    }

    return NextResponse.json(
      {
        version: "v1",
        success: true,
        message: "Order placed successfully in PostgreSQL",
        data: {
          id: newOrder.id,
          orderId: newOrder.id,
          cookId: newOrder.cookId,
          cookName: newOrder.cook?.kitchenName,
          status: newOrder.status,
          totalAmount: newOrder.totalAmount,
          customerName: newOrder.user?.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ version: "v1", success: false, error: "Failed to place order in database" }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;
    if (!id) {
      return NextResponse.json({ version: "v1", success: false, error: "Order ID required" }, { status: 400 });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        ...(status ? { status: status.toUpperCase() } : {}),
      },
    });

    return NextResponse.json({ version: "v1", success: true, data: updated });
  } catch (error) {
    console.error("Order PATCH error:", error);
    return NextResponse.json({ version: "v1", success: false, error: "Failed to update order" }, { status: 400 });
  }
}
