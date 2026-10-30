import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { COOKS, DEFAULT_WEEKLY_MENU } from "@/lib/mockData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city")?.toLowerCase();
  const mealType = searchParams.get("mealType") || searchParams.get("type");
  const cuisine = searchParams.get("cuisine");
  const query = searchParams.get("q")?.toLowerCase();
  const sort = searchParams.get("sort");
  const statusParam = searchParams.get("status")?.toLowerCase();

  try {
    const cooks = await prisma.cook.findMany({
      include: {
        city: true,
        plans: true,
        user: true,
        cuisines: { include: { cuisine: true } },
      },
    });

    let formatted = cooks.map((c: any) => {
      const match = COOKS.find(
        (m) => m.id === c.id || m.kitchenName?.toLowerCase() === c.kitchenName?.toLowerCase()
      );
      return {
        id: c.id,
        userId: c.userId,
        kitchenName: c.kitchenName,
        name: c.user?.name || match?.name || c.kitchenName,
        bio: c.bio,
        photos: c.photos && c.photos.length > 0 ? c.photos : [c.coverImage],
        coverImage: c.coverImage,
        avatar: match?.avatar || c.coverImage || "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200&q=80",
        memberSince: match?.memberSince || "2024",
        fssaiNo: c.fssaiNo,
        city: c.city?.name || "Rajkot",
        area: c.area,
        pincode: c.pincode,
        serviceAreas: c.serviceAreas,
        deliverySlots: c.deliverySlots,
        isVeg: c.isVeg,
        status: (c.status || "PENDING").toLowerCase(),
        rating: c.ratingAvg,
        totalReviews: c.totalReviews,
        totalOrders: c.totalOrders,
        responseTime: c.responseTime,
        cuisines: c.cuisines?.map((cc: any) => cc.cuisine?.name?.toLowerCase()) || [],
        weeklyMenu: match?.weeklyMenu || DEFAULT_WEEKLY_MENU,
        plans: c.plans.map((p: any) => ({
          id: p.id,
          type: p.type.toLowerCase(),
          label: p.name,
          price: p.price,
          perMeal: p.perMeal,
          description: p.description,
          includes: p.includes,
          popular: p.popular,
        })),
      };
    });

    // Deduplicate kitchens so no kitchen is ever repeated
    const seenKitchenNames = new Set<string>();
    const seenCookIds = new Set<string>();
    const deduplicatedCooks: typeof formatted = [];

    for (const c of formatted) {
      const normName = (c.kitchenName || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      const normId = (c.id || "").toLowerCase();
      if ((normName && seenKitchenNames.has(normName)) || (normId && seenCookIds.has(normId))) {
        continue;
      }
      if (normName) seenKitchenNames.add(normName);
      if (normId) seenCookIds.add(normId);
      deduplicatedCooks.push(c);
    }
    formatted = deduplicatedCooks;

    // Filter by approval status
    if (statusParam && statusParam !== "all") {
      formatted = formatted.filter((c) => c.status === statusParam);
    } else if (!statusParam) {
      // Public default: only return approved cooks to customers
      formatted = formatted.filter((c) => c.status === "approved");
    }

    if (city) {
      formatted = formatted.filter((c) => c.city?.toLowerCase() === city);
    }
    if (mealType === "veg") {
      formatted = formatted.filter((c) => c.isVeg);
    } else if (mealType === "nonveg") {
      formatted = formatted.filter((c) => !c.isVeg);
    }
    if (cuisine) {
      formatted = formatted.filter((c) => c.cuisines?.includes(cuisine.toLowerCase()));
    }
    if (query) {
      formatted = formatted.filter(
        (c) =>
          c.kitchenName?.toLowerCase().includes(query) ||
          c.name?.toLowerCase().includes(query) ||
          c.area?.toLowerCase().includes(query) ||
          c.cuisines?.some((cui: string) => cui.includes(query))
      );
    }

    if (sort === "price") {
      formatted.sort((a, b) => (a.plans?.[0]?.price || 0) - (b.plans?.[0]?.price || 0));
    } else if (sort === "reviews") {
      formatted.sort((a, b) => (b.totalReviews || 0) - (a.totalReviews || 0));
    } else {
      formatted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return NextResponse.json({
      version: "v1",
      success: true,
      total: formatted.length,
      data: formatted,
    });
  } catch (error) {
    console.warn("Database connection issue, providing fallback cook catalog:", error);
    let fallbackCooks = COOKS;
    if (city) {
      fallbackCooks = fallbackCooks.filter((c) => c.city?.toLowerCase() === city);
    }
    if (mealType === "veg") {
      fallbackCooks = fallbackCooks.filter((c) => c.isVeg);
    } else if (mealType === "nonveg") {
      fallbackCooks = fallbackCooks.filter((c) => !c.isVeg);
    }
    return NextResponse.json({
      version: "v1",
      success: true,
      total: fallbackCooks.length,
      data: fallbackCooks,
      fallback: true,
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cookName = (body.name || body.kitchenName || "New Kitchen").trim();
    const cookId = body.id || `c_${Date.now()}`;
    const rawStatus = (body.status || "PENDING").toUpperCase();
    const initialStatus = ["PENDING", "APPROVED", "REJECTED"].includes(rawStatus) ? rawStatus : "PENDING";

    // 1. Ensure user exists in PostgreSQL
    let userId = body.userId;
    if (!userId) {
      const email = body.email || `cook_${Date.now()}@homefeast.cook`;
      const passwordHash = body.password
        ? bcrypt.hashSync(body.password, 10)
        : "$2b$10$XbxYIRf/hOrULM9QPwEge.nsKPSZPLCFzYys5BWwVVzCOyDYj3KB."; // demo123 fallback
      const user = await prisma.user.upsert({
        where: { email },
        update: body.password ? { passwordHash } : {},
        create: {
          name: cookName,
          email,
          phone: body.phone || `98${Math.floor(10000000 + Math.random() * 90000000)}`,
          passwordHash,
          role: "COOK",
          isVerified: initialStatus === "APPROVED",
        },
      });
      userId = user.id;
    }

    // 2. Ensure city exists
    let cityRecord = await prisma.city.findFirst({
      where: { name: { equals: body.city || "Rajkot", mode: "insensitive" } },
    });
    if (!cityRecord) {
      cityRecord = await prisma.city.findFirst({ where: { name: "Rajkot" } });
    }

    // 3. Create or update cook in PostgreSQL
    const cookCover = body.coverImage || body.avatar || "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80";
    const cookPhotos = Array.isArray(body.photos) && body.photos.length > 0 
      ? body.photos 
      : (body.avatar ? [body.avatar] : [cookCover]);

    const newCook = await prisma.cook.upsert({
      where: { userId },
      update: {
        kitchenName: body.kitchenName || cookName,
        bio: body.bio || "Fresh homemade cooking",
        fssaiNo: body.fssaiNo,
        coverImage: cookCover,
        photos: cookPhotos,
        area: body.area || "City Center",
        pincode: body.pincode || "360001",
        serviceAreas: body.serviceAreas || ["City Center"],
        deliverySlots: body.deliverySlots || ["Lunch (12–1:30 PM)"],
        isVeg: body.isVeg !== undefined ? body.isVeg : true,
        status: initialStatus as any,
      },
      create: {
        userId,
        kitchenName: body.kitchenName || cookName,
        bio: body.bio || "Fresh homemade cooking",
        fssaiNo: body.fssaiNo,
        cityId: cityRecord!.id,
        coverImage: cookCover,
        photos: cookPhotos,
        area: body.area || "City Center",
        pincode: body.pincode || "360001",
        serviceAreas: body.serviceAreas || ["City Center"],
        deliverySlots: body.deliverySlots || ["Lunch (12–1:30 PM)"],
        isVeg: body.isVeg !== undefined ? body.isVeg : true,
        status: initialStatus as any,
        ratingAvg: 5.0,
        totalReviews: 0,
        totalOrders: 0,
      },
    });

    if (body.avatar && userId) {
      await prisma.user.update({
        where: { id: userId },
        data: { avatar: body.avatar },
      }).catch(() => {});
    }

    // 4. Create or update plans in PostgreSQL
    const plansToSave = Array.isArray(body.plans) && body.plans.length > 0 ? body.plans : [
      {
        id: `p_${newCook.id}_daily`,
        name: "Daily Homestyle Plan",
        type: "DAILY",
        price: 120,
        perMeal: 120,
        description: "Fresh homemade tiffin every day with Sabzi, Dal, Roti & Rice.",
        includes: ["1 Fresh Sabzi", "Dal/Kadhi", "4 Phulkas", "Rice/Khichdi"],
        popular: false,
      },
      {
        id: `p_${newCook.id}_weekly`,
        name: "Weekly Saver Plan",
        type: "WEEKLY",
        price: 749,
        perMeal: 107,
        description: "7-day rotating wholesome plan with Sunday dessert special.",
        includes: ["Daily variety thali", "Dal/Kadhi", "Fresh Rotis", "Rice", "Sunday Dessert"],
        popular: true,
      },
      {
        id: `p_${newCook.id}_monthly`,
        name: "Monthly Royal Plan",
        type: "MONTHLY",
        price: 2799,
        perMeal: 93,
        description: "30-day complete meal plan with 5 flexible pause days.",
        includes: ["Full Royal Thali", "5 Flexible Pause Days", "Sunday Desserts"],
        popular: false,
      },
    ];

    const savedPlanIds: string[] = [];

    for (const p of plansToSave) {
      const rawType = (p.type || "DAILY").toUpperCase();
      const validPlanType = ["DAILY", "WEEKLY", "MONTHLY"].includes(rawType) ? rawType : "DAILY";
      const planId = p.id || `p_${newCook.id}_${validPlanType.toLowerCase()}_${Date.now()}`;
      savedPlanIds.push(planId);

      const planName = p.label || p.name || `${validPlanType} Plan`;
      const planPrice = Number(p.price) || 120;
      const mealsCount = Number(p.mealsIncluded) || (validPlanType === "MONTHLY" ? 30 : validPlanType === "WEEKLY" ? 7 : 1);
      const perMeal = Number(p.perMeal) || Math.round(planPrice / Math.max(1, mealsCount));
      const includesList = Array.isArray(p.includes) && p.includes.length > 0
        ? p.includes
        : typeof p.includesText === "string" && p.includesText.trim()
        ? p.includesText.split(",").map((s: string) => s.trim()).filter(Boolean)
        : ["1 Fresh Sabzi", "Dal/Kadhi", "4 Phulkas", "Rice/Khichdi"];

      await prisma.plan.upsert({
        where: { id: planId },
        update: {
          name: planName,
          type: validPlanType as any,
          price: planPrice,
          perMeal,
          description: p.description || `${planName} homestyle meal subscription.`,
          includes: includesList,
          popular: Boolean(p.popular || (p.badge && p.badge.toLowerCase().includes("popular"))),
        },
        create: {
          id: planId,
          cookId: newCook.id,
          name: planName,
          type: validPlanType as any,
          price: planPrice,
          perMeal,
          description: p.description || `${planName} homestyle meal subscription.`,
          includes: includesList,
          popular: Boolean(p.popular || (p.badge && p.badge.toLowerCase().includes("popular"))),
        },
      });
    }

    // Delete plans for this cook that are no longer in the updated plans list
    if (savedPlanIds.length > 0) {
      await prisma.plan.deleteMany({
        where: {
          cookId: newCook.id,
          id: { notIn: savedPlanIds },
        },
      }).catch(() => {});
    }

    return NextResponse.json(
      { version: "v1", success: true, message: "Cook and plans registered in PostgreSQL", data: newCook },
      { status: 201 }
    );
  } catch (error) {
    console.error("Cook registration error:", error);
    return NextResponse.json({ version: "v1", success: false, error: "Failed to register cook in database" }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, isVerified } = body;
    if (!id) {
      return NextResponse.json({ version: "v1", success: false, error: "Cook ID is required" }, { status: 400 });
    }

    const newStatus = (status || "").toUpperCase();
    const validStatus = ["PENDING", "APPROVED", "REJECTED"].includes(newStatus) ? newStatus : undefined;

    // Find cook by ID or userId
    const cook = await prisma.cook.findFirst({
      where: {
        OR: [{ id }, { userId: id }],
      },
      include: { user: true },
    });

    if (!cook) {
      return NextResponse.json({ version: "v1", success: false, error: "Cook not found" }, { status: 404 });
    }

    const updated = await prisma.cook.update({
      where: { id: cook.id },
      data: {
        ...(validStatus ? { status: validStatus as any } : {}),
      },
    });

    if (cook.userId && (validStatus === "APPROVED" || isVerified !== undefined)) {
      await prisma.user.update({
        where: { id: cook.userId },
        data: {
          isVerified: validStatus === "APPROVED" ? true : isVerified !== undefined ? Boolean(isVerified) : undefined,
        },
      });
    }

    return NextResponse.json({
      version: "v1",
      success: true,
      message: `Cook ${cook.kitchenName} status updated to ${updated.status}`,
      data: updated,
    });
  } catch (error) {
    console.error("Cook PATCH error:", error);
    return NextResponse.json({ version: "v1", success: false, error: "Failed to update cook status" }, { status: 500 });
  }
}

