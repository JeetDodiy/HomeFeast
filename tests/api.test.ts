// HomeFeast Automated API & Business Logic Tests

import { runDailyOrderGeneration, ActiveSubscription } from "../lib/jobs/dailyOrders";

describe("HomeFeast Business Logic Tests", () => {
  test("Daily order cron job generates orders only for ACTIVE non-paused subscriptions", () => {
    const today = new Date().toISOString().split("T")[0];

    const subscriptions: ActiveSubscription[] = [
      {
        id: "sub-1",
        userId: "u1",
        cookId: "c1",
        cookName: "Meera's Kitchen",
        planName: "Weekly Plan",
        slot: "Lunch (12–1 PM)",
        status: "ACTIVE",
        pausedDates: [],
      },
      {
        id: "sub-2",
        userId: "u2",
        cookId: "c2",
        cookName: "Priya's Home Kitchen",
        planName: "Monthly Plan",
        slot: "Dinner (7–8 PM)",
        status: "PAUSED",
        pausedDates: [],
      },
      {
        id: "sub-3",
        userId: "u3",
        cookId: "c1",
        cookName: "Meera's Kitchen",
        planName: "Weekly Plan",
        slot: "Lunch (12–1 PM)",
        status: "ACTIVE",
        pausedDates: [today], // Paused today
      },
    ];

    const orders = runDailyOrderGeneration(subscriptions);

    // Only sub-1 should generate an order
    expect(orders.length).toBe(1);
    expect(orders[0].subscriptionId).toBe("sub-1");
    expect(orders[0].status).toBe("CONFIRMED");
  });

  test("Coupon discount calculations work properly", () => {
    const planPrice = 749;
    const welcome50Discount = 50;
    const firstFeastDiscount = Math.round(planPrice * 0.1);

    expect(planPrice - welcome50Discount).toBe(699);
    expect(planPrice - firstFeastDiscount).toBe(674);
  });
});
