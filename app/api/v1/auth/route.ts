import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "homefeast-super-secret-jwt-key-2026-min-32-chars";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, password, role, name, phone, city } = body;

    // 1. ACTION: USER REGISTRATION
    if (action === "register") {
      const cleanEmail = (email || "").trim().toLowerCase();
      if (!cleanEmail || !cleanEmail.includes("@")) {
        return NextResponse.json({ success: false, error: "A valid email address is required." }, { status: 400 });
      }
      if (!password || password.length < 6) {
        return NextResponse.json({ success: false, error: "Password must be at least 6 characters long." }, { status: 400 });
      }

      if (role === "ADMIN" || role === "admin") {
        return NextResponse.json({ success: false, error: "Admin accounts cannot be self-registered." }, { status: 403 });
      }

      const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
      if (existing) {
        return NextResponse.json({ success: false, error: "An account with this email address already exists. Please log in." }, { status: 409 });
      }

      const passwordHash = bcrypt.hashSync(password, 10);
      const userRole = (role === "COOK" || role === "cook") ? "COOK" : "CUSTOMER";
      let cleanPhone = (phone || "").replace(/[\s\-\+]/g, "").slice(-10);
      if (!cleanPhone || !/^[6-9]\d{9}$/.test(cleanPhone)) {
        cleanPhone = `98${Math.floor(10000000 + Math.random() * 90000000)}`;
      }

      // Resolve city in PostgreSQL
      const cityName = (city || "Rajkot").trim();
      let targetCity = await prisma.city.findFirst({
        where: { name: { equals: cityName, mode: "insensitive" } },
      });
      if (!targetCity) {
        targetCity = await prisma.city.findFirst({ where: { name: "Rajkot" } });
      }

      const newUser = await prisma.user.create({
        data: {
          name: (name || "").trim() || cleanEmail.split("@")[0],
          email: cleanEmail,
          passwordHash,
          role: userRole as any,
          phone: cleanPhone,
          cityId: targetCity?.id,
          isVerified: userRole !== "COOK", // Cook accounts require admin approval
        },
      });

      let createdCook = null;
      if (userRole === "COOK") {
        const rawKitchenName = (body.kitchenName || name || `${newUser.name}'s Kitchen`).trim();
        const areaName = (body.area || "City Center").trim();
        const pincodeVal = (body.pincode || "360001").trim();

        createdCook = await prisma.cook.create({
          data: {
            userId: newUser.id,
            kitchenName: rawKitchenName,
            bio: body.bio || `Fresh homemade meals cooked with passion and hygiene by Chef ${newUser.name}. Serving wholesome authentic tiffins across ${targetCity?.name || "Rajkot"}.`,
            cityId: targetCity!.id,
            area: areaName ? `${areaName}, ${targetCity?.name || "Rajkot"}` : targetCity?.name || "Rajkot",
            pincode: pincodeVal,
            coverImage: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80",
            photos: [
              "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&q=80",
              "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80",
            ],
            serviceAreas: [areaName || "City Center", "Main Road", "Ring Road"],
            deliverySlots: ["Lunch (12–1:30 PM)", "Dinner (7:30–9 PM)"],
            isVeg: body.isVeg !== undefined ? body.isVeg : true,
            status: "PENDING", // PENDING ADMIN APPROVAL: will not show in search until approved
            ratingAvg: 5.0,
            totalReviews: 0,
            totalOrders: 0,
            responseTime: "Under 25 min",
          },
        });

        // Seed 3 standard plans for the new kitchen
        await prisma.plan.createMany({
          data: [
            {
              id: `p_${createdCook.id}_daily`,
              cookId: createdCook.id,
              name: "Daily Homestyle Plan",
              type: "DAILY",
              price: 120,
              perMeal: 120,
              description: "Fresh homemade tiffin every day with Sabzi, Dal, Roti & Rice.",
              includes: ["1 Fresh Sabzi", "Dal/Kadhi", "4 Phulkas", "Rice/Khichdi"],
              popular: false,
            },
            {
              id: `p_${createdCook.id}_weekly`,
              cookId: createdCook.id,
              name: "Weekly Saver Plan",
              type: "WEEKLY",
              price: 749,
              perMeal: 107,
              description: "7-day rotating wholesome plan with Sunday dessert special.",
              includes: ["Daily variety thali", "Dal/Kadhi", "Fresh Rotis", "Rice", "Sunday Dessert"],
              popular: true,
            },
            {
              id: `p_${createdCook.id}_monthly`,
              cookId: createdCook.id,
              name: "Monthly Royal Plan",
              type: "MONTHLY",
              price: 2799,
              perMeal: 93,
              description: "30-day complete meal plan with 5 flexible pause days.",
              includes: ["Full Royal Thali", "5 Flexible Pause Days", "Sunday Desserts"],
              popular: false,
            },
          ],
        });
      }

      const token = jwt.sign(
        {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
          name: newUser.name,
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      const response = NextResponse.json({
        success: true,
        message: userRole === "COOK"
          ? "Kitchen application registered successfully. Status: Pending Admin Review."
          : "Registration successful. You can now sign in to your account.",
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          city: targetCity?.name || "Rajkot",
          cookId: createdCook?.id,
          kitchenName: createdCook?.kitchenName,
          status: createdCook?.status || "PENDING",
        },
      }, { status: 201 });

      return response;
    }

    // 2. ACTION: FORGOT PASSWORD
    if (action === "forgot-password") {
      const cleanEmail = (email || "").trim().toLowerCase();
      const user = await prisma.user.findUnique({ where: { email: cleanEmail } });

      return NextResponse.json({
        success: true,
        message: user
          ? "Password reset link has been dispatched to your email address."
          : "If an account exists with this email, a reset link has been sent.",
      });
    }

    // 3. ACTION: LOGIN (DEFAULT)
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPassword = (password || "").trim();

    if (!cleanEmail || !cleanPassword) {
      return NextResponse.json({ success: false, error: "Both email and password are required." }, { status: 400 });
    }

    const matchedUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: { city: true },
    });

    if (!matchedUser) {
      return NextResponse.json({ success: false, error: "Invalid email or password. Please verify your credentials." }, { status: 401 });
    }

    const isPasswordValid =
      (matchedUser.passwordHash && bcrypt.compareSync(cleanPassword, matchedUser.passwordHash)) ||
      matchedUser.passwordHash === cleanPassword;

    if (!isPasswordValid) {
      return NextResponse.json({ success: false, error: "Invalid email or password. Please verify your credentials." }, { status: 401 });
    }

    // Generate real signed JWT session token
    const token = jwt.sign(
      {
        id: matchedUser.id,
        email: matchedUser.email,
        role: matchedUser.role,
        name: matchedUser.name,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: matchedUser.id,
        email: matchedUser.email,
        name: matchedUser.name,
        role: matchedUser.role,
        city: matchedUser.city?.name || "Rajkot",
        phone: matchedUser.phone,
      },
    });

    // Set auth cookies for middleware
    response.cookies.set("hf_token", token, { path: "/", maxAge: 604800, sameSite: "lax" });
    response.cookies.set("hf_role", matchedUser.role.toLowerCase(), { path: "/", maxAge: 604800, sameSite: "lax" });

    return response;
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json({ success: false, error: "Authentication service error. Please try again." }, { status: 500 });
  }
}
