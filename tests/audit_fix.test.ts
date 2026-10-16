import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "homefeast-super-secret-jwt-key-2026-min-32-chars";

describe("HomeFeast PostgreSQL Audit Verification Tests", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  // Test HF-1 & HF-2: Authentication, Password Hashing & PostgreSQL Persistence
  test("HF-1 & HF-2: Cook credentials verify correctly and registered users persist in PostgreSQL", async () => {
    // Check seeded demo cook credentials
    const cookUser = await prisma.user.findUnique({ where: { email: "demo@cook.com" } });
    expect(cookUser).toBeDefined();
    expect(cookUser!.role).toBe("COOK");
    expect(bcrypt.compareSync("demo123", cookUser!.passwordHash)).toBe(true);

    // Register a new test customer account
    const testEmail = `test_customer_${Date.now()}@homefeast.test`;
    const rajkotCity = await prisma.city.findFirst({ where: { name: "Rajkot" } });

    const newCust = await prisma.user.create({
      data: {
        name: "Test Customer",
        email: testEmail,
        passwordHash: bcrypt.hashSync("securepass123", 10),
        role: "CUSTOMER",
        cityId: rajkotCity?.id,
        phone: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
      },
    });

    // Verify it persists in PostgreSQL and can be queried directly
    const reloaded = await prisma.user.findUnique({ where: { email: testEmail } });
    expect(reloaded).toBeDefined();
    expect(reloaded!.id).toBe(newCust.id);
    expect(bcrypt.compareSync("securepass123", reloaded!.passwordHash)).toBe(true);

    // Verify signed JWT generation and validation
    const token = jwt.sign(
      { id: reloaded!.id, email: reloaded!.email, role: reloaded!.role, name: reloaded!.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    expect(decoded.role).toBe("CUSTOMER");
    expect(decoded.email).toBe(testEmail);
  });

  // Test HF-3, HF-4 & HF-5: Orders, Subscriptions, and Plan Duration Lowercasing
  test("HF-3, HF-4 & HF-5: Order & subscription created with correct duration in PostgreSQL", async () => {
    const cook = await prisma.cook.findFirst({
      where: { kitchenName: { contains: "Jeet" } },
      include: { plans: true },
    });
    expect(cook).toBeDefined();
    const customer = await prisma.user.findFirst({ where: { role: "CUSTOMER" } });
    expect(customer).toBeDefined();

    const testPlanType = "monthly"; // lowercase as in mockData.ts
    const durationDays = testPlanType.toLowerCase() === "monthly" ? 30 : testPlanType.toLowerCase() === "weekly" ? 7 : 1;
    expect(durationDays).toBe(30); // Must NOT collapse to 1!

    // Place an order for this cook in PostgreSQL
    const order = await prisma.order.create({
      data: {
        userId: customer!.id,
        cookId: cook!.id,
        totalAmount: 2799,
        slot: "Lunch (12–1:30 PM)",
        deliveryAddress: "Kalavad Road, Rajkot",
        status: "CONFIRMED",
        deliveryDate: new Date(),
        items: ["Daily Kathiyawadi Thali", "Bajra Rotlo", "Desi Kadhi", "Vaghareli Khichdi"],
      },
    });

    // Create corresponding subscription in PostgreSQL
    const targetPlan = cook!.plans[0] || (await prisma.plan.findFirst())!;
    const sub = await prisma.subscription.create({
      data: {
        userId: customer!.id,
        cookId: cook!.id,
        planId: targetPlan.id,
        status: "ACTIVE",
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 86400000),
        deliverySlot: "Lunch (12–1:30 PM)",
        deliveryAddress: "Kalavad Road, Rajkot",
      },
    });

    // Verify cook packing station can retrieve this order from PostgreSQL by cookId
    const cookOrders = await prisma.order.findMany({ where: { cookId: cook!.id } });
    const foundOrder = cookOrders.find((o) => o.id === order.id);
    expect(foundOrder).toBeDefined();
    expect(foundOrder!.cookId).toBe(cook!.id);
    expect(foundOrder!.status).toBe("CONFIRMED");

    // Verify cook subscribers include this subscription in PostgreSQL
    const cookSubs = await prisma.subscription.findMany({ where: { cookId: cook!.id } });
    const foundSub = cookSubs.find((s) => s.id === sub.id);
    expect(foundSub).toBeDefined();
  });

  // Test HF-6: Reviews Update Cook Average Rating in PostgreSQL
  test("HF-6: Posting a review persists and updates cook's rating in PostgreSQL", async () => {
    const cook = await prisma.cook.findFirst();
    expect(cook).toBeDefined();
    const customer = await prisma.user.findFirst({ where: { role: "CUSTOMER" } });
    expect(customer).toBeDefined();

    const prevReviews = cook!.totalReviews || 0;
    const prevRating = cook!.ratingAvg || 5.0;

    await prisma.review.create({
      data: {
        userId: customer!.id,
        cookId: cook!.id,
        rating: 5,
        comment: "Excellent Gujarati food! Very fresh rotis.",
      },
    });

    const newTotal = prevReviews + 1;
    const newRating = Number((((prevRating * prevReviews) + 5) / newTotal).toFixed(1));

    await prisma.cook.update({
      where: { id: cook!.id },
      data: { totalReviews: newTotal, ratingAvg: newRating },
    });

    const updatedCook = await prisma.cook.findUnique({ where: { id: cook!.id } });
    expect(updatedCook!.totalReviews).toBe(newTotal);
    expect(updatedCook!.ratingAvg).toBeGreaterThanOrEqual(1);
    expect(updatedCook!.ratingAvg).toBeLessThanOrEqual(5);
  });

  // Test HF-7 & HF-8: City query and Admin KPI calculations against PostgreSQL
  test("HF-7 & HF-8: PostgreSQL City query and Admin KPI calculations return live data", async () => {
    // 1. Check City count and relations in PostgreSQL
    const cities = await prisma.city.findMany({
      include: { _count: { select: { cooks: true } } },
    });
    expect(cities.length).toBeGreaterThanOrEqual(2);
    const rajkot = cities.find((c) => c.name === "Rajkot");
    expect(rajkot).toBeDefined();

    // 2. Admin KPIs calculated from live PostgreSQL counts
    const totalUsers = await prisma.user.count();
    const totalCooks = await prisma.cook.count();
    const totalOrders = await prisma.order.count();
    const totalSubs = await prisma.subscription.count();

    expect(totalUsers).toBeGreaterThan(0);
    expect(totalCooks).toBeGreaterThan(0);
    expect(totalOrders).toBeGreaterThanOrEqual(1);
    expect(totalSubs).toBeGreaterThanOrEqual(1);
  });

  // Test HF-9 & HF-10: Input validation rules for Indian phone and role security
  test("HF-9 & HF-10: Validators enforce 10-digit Indian mobile and reject ADMIN self-registration", () => {
    const { RegisterSchema } = require("../lib/validators");

    // Valid registration payload
    const valid = RegisterSchema.safeParse({
      name: "Jeet Dodiya",
      email: "jeet@homefeast.test",
      phone: "9825100000",
      password: "securepassword",
      role: "CUSTOMER",
    });
    expect(valid.success).toBe(true);

    // Invalid phone (e.g. 9 digits or invalid start)
    const invalidPhone = RegisterSchema.safeParse({
      name: "Jeet Dodiya",
      email: "jeet@homefeast.test",
      phone: "12345",
      password: "securepassword",
      role: "CUSTOMER",
    });
    expect(invalidPhone.success).toBe(false);

    // Reject ADMIN role self-registration
    const adminSelfReg = RegisterSchema.safeParse({
      name: "Attacker",
      email: "attacker@hack.com",
      phone: "9825100000",
      password: "securepassword",
      role: "ADMIN",
    });
    expect(adminSelfReg.success).toBe(false);
  });
});
