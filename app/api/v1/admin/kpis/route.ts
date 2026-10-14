import { NextResponse } from "next/server";

export async function GET() {
  const kpiData = {
    registeredUsers: {
      total: 1248,
      customers: 1180,
      cooks: 64,
      admins: 4,
    },
    monthlyActiveUsers: 842,
    activeSubscriptions: 342,
    orderConversionRate: 18.4, // Orders ÷ cook profile views × 100
    cookOnboardingRate: 78.5,  // Approved cooks ÷ cook sign-ups × 100
    customerRetentionRate: 86.2, // Customers renewing in month 2 ÷ month 1 × 100
    totalRevenue: 284500,
    monthlyGrowth: 14.8,
    cityBreakdown: [
      { city: "Rajkot", activeSubscribers: 198, activeCooks: 38 },
      { city: "Ahmedabad", activeSubscribers: 144, activeCooks: 26 },
    ],
  };

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    data: kpiData,
  });
}
