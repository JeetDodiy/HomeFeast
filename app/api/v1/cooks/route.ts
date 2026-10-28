import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { COOKS, DEFAULT_WEEKLY_MENU } from "@/lib/mockData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city")?.toLowerCase();
  const mealType = searchParams.get("mealType") || searchParams.get("type");
  const cuisine = searchParams.get("cuisine");
  const query = searchParams.get("q")?.toLowerCase();
  const sort = searchParams.get("sort");

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
        status: c.status.toLowerCase(),
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
    console.error("Cooks API error:", error);
    return NextResponse.json({ version: "v1", success: false, error: "Database service error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cookName = (body.name || body.kitchenName || "New Kitchen").trim();
    const cookId = body.id || `c_${Date.now()}`;

    // 1. Ensure user exists in PostgreSQL
    let userId = body.userId;
    if (!userId) {
      const email = body.email || `cook_${Date.now()}@homefeast.cook`;
      const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          name: cookName,
          email,
          phone: body.phone || `98${Math.floor(10000000 + Math.random() * 90000000)}`,
          passwordHash: "$2b$10$XbxYIRf/hOrULM9QPwEge.nsKPSZPLCFzYys5BWwVVzCOyDYj3KB.", // demo123
          role: "COOK",
          isVerified: true,
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
    const newCook = await prisma.cook.upsert({
      where: { userId },
      update: {
        kitchenName: body.kitchenName || cookName,
        bio: body.bio || "Fresh homemade cooking",
        fssaiNo: body.fssaiNo,
        area: body.area || "City Center",
        pincode: body.pincode || "360001",
        serviceAreas: body.serviceAreas || ["City Center"],
        deliverySlots: body.deliverySlots || ["Lunch (12–1:30 PM)"],
        isVeg: body.isVeg !== undefined ? body.isVeg : true,
      },
      create: {
        userId,
        kitchenName: body.kitchenName || cookName,
        bio: body.bio || "Fresh homemade cooking",
        fssaiNo: body.fssaiNo,
        cityId: cityRecord!.id,
        area: body.area || "City Center",
        pincode: body.pincode || "360001",
        serviceAreas: body.serviceAreas || ["City Center"],
        deliverySlots: body.deliverySlots || ["Lunch (12–1:30 PM)"],
        isVeg: body.isVeg !== undefined ? body.isVeg : true,
        status: "APPROVED",
        ratingAvg: 5.0,
        totalReviews: 0,
        totalOrders: 0,
      },
    });

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

    for (const p of plansToSave) {
      const planType = (p.type || "DAILY").toUpperCase();
      const validPlanType = ["DAILY", "WEEKLY", "MONTHLY", "TRIAL"].includes(planType) ? planType : "DAILY";
      const planId = p.id || `p_${newCook.id}_${planType.toLowerCase()}`;
      await prisma.plan.upsert({
        where: { id: planId },
        update: {
          name: p.label || p.name || `${planType} Plan`,
          price: Number(p.price) || 120,
          perMeal: Number(p.perMeal) || Number(p.price) || 120,
          description: p.description || "",
          includes: Array.isArray(p.includes) ? p.includes : [],
          popular: Boolean(p.popular),
        },
        create: {
          id: planId,
          cookId: newCook.id,
          name: p.label || p.name || `${planType} Plan`,
          type: validPlanType as any,
          price: Number(p.price) || 120,
          perMeal: Number(p.perMeal) || Number(p.price) || 120,
          description: p.description || "",
          includes: Array.isArray(p.includes) ? p.includes : [],
          popular: Boolean(p.popular),
        },
      });
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
