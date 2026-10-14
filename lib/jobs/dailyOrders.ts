// HomeFeast Daily Order Generation Cron Job
// Generates daily dispatch orders from active subscriptions each morning

export interface ActiveSubscription {
  id: string;
  userId: string;
  cookId: string;
  cookName: string;
  planName: string;
  slot: string;
  status: "ACTIVE" | "PAUSED" | "CANCELLED";
  pausedDates: string[];
}

export function runDailyOrderGeneration(subscriptions: ActiveSubscription[]) {
  const today = new Date().toISOString().split("T")[0];
  console.log(`[CRON 06:00 AM] Running daily order generation for date: ${today}`);

  const activeToday = subscriptions.filter((sub) => {
    if (sub.status !== "ACTIVE") return false;
    if (sub.pausedDates?.includes(today)) {
      console.log(`[CRON] Subscription ${sub.id} is paused for ${today}. Skipping.`);
      return false;
    }
    return true;
  });

  const generatedOrders = activeToday.map((sub) => {
    return {
      id: `HF-AUTO-${Math.floor(100000 + Math.random() * 900000)}`,
      subscriptionId: sub.id,
      userId: sub.userId,
      cookId: sub.cookId,
      cookName: sub.cookName,
      deliveryDate: today,
      slot: sub.slot,
      status: "CONFIRMED",
      generatedAt: new Date().toISOString(),
    };
  });

  console.log(`[CRON] Generated ${generatedOrders.length} daily orders for today.`);
  return generatedOrders;
}
