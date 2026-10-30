"use client";
import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface EarningsChartProps {
  orders?: any[];
  isDemo?: boolean;
}

const DEMO_DATA = [
  { day: "Mon", revenue: 2400, tiffins: 22 },
  { day: "Tue", revenue: 2850, tiffins: 26 },
  { day: "Wed", revenue: 3100, tiffins: 28 },
  { day: "Thu", revenue: 2950, tiffins: 26 },
  { day: "Fri", revenue: 3600, tiffins: 32 },
  { day: "Sat", revenue: 4200, tiffins: 38 },
  { day: "Sun", revenue: 4700, tiffins: 42 },
];

const ZERO_DATA = [
  { day: "Mon", revenue: 0, tiffins: 0 },
  { day: "Tue", revenue: 0, tiffins: 0 },
  { day: "Wed", revenue: 0, tiffins: 0 },
  { day: "Thu", revenue: 0, tiffins: 0 },
  { day: "Fri", revenue: 0, tiffins: 0 },
  { day: "Sat", revenue: 0, tiffins: 0 },
  { day: "Sun", revenue: 0, tiffins: 0 },
];

export default function EarningsChart({ orders = [], isDemo = false }: EarningsChartProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div style={{ height: 260, background: "var(--surface-alt)", borderRadius: "var(--radius-sm)" }} />;
  }

  // Calculate actual revenue from orders if available
  let chartData = ZERO_DATA;

  if (isDemo && orders.length === 0) {
    chartData = DEMO_DATA;
  } else if (orders.length > 0) {
    // Group orders by weekday
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayMap: Record<string, { revenue: number; tiffins: number }> = {
      Mon: { revenue: 0, tiffins: 0 },
      Tue: { revenue: 0, tiffins: 0 },
      Wed: { revenue: 0, tiffins: 0 },
      Thu: { revenue: 0, tiffins: 0 },
      Fri: { revenue: 0, tiffins: 0 },
      Sat: { revenue: 0, tiffins: 0 },
      Sun: { revenue: 0, tiffins: 0 },
    };

    orders.forEach((o) => {
      const dateStr = o.date || o.deliveryDate || o.createdAt;
      if (dateStr) {
        try {
          const d = new Date(dateStr);
          const dayName = days[d.getDay()];
          if (dayMap[dayName]) {
            dayMap[dayName].revenue += Number(o.amount || o.totalAmount || 0);
            dayMap[dayName].tiffins += 1;
          }
        } catch {}
      }
    });

    chartData = [
      { day: "Mon", ...dayMap.Mon },
      { day: "Tue", ...dayMap.Tue },
      { day: "Wed", ...dayMap.Wed },
      { day: "Thu", ...dayMap.Thu },
      { day: "Fri", ...dayMap.Fri },
      { day: "Sat", ...dayMap.Sat },
      { day: "Sun", ...dayMap.Sun },
    ];
  }

  const totalRevenue = chartData.reduce((acc, curr) => acc + curr.revenue, 0);

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
            <YAxis
              stroke="var(--text-muted)"
              fontSize={12}
              tickLine={false}
              domain={[0, totalRevenue > 0 ? "auto" : 1000]}
              tickFormatter={(v) => `₹${v}`}
            />
            <Tooltip
              contentStyle={{
                background: "var(--surface)",
                borderColor: "var(--border)",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                fontSize: "12px",
              }}
              formatter={(value: any) => [`₹${value}`, "Revenue"]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--primary)"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#earningsGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {totalRevenue === 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0, 0, 0, 0.2)",
            backdropFilter: "blur(2px)",
            borderRadius: "var(--radius-sm)",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              padding: "0.6rem 1.25rem",
              borderRadius: "9999px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              fontSize: "0.825rem",
              fontWeight: 600,
              color: "var(--text-muted)",
              textAlign: "center",
            }}
          >
            📊 No revenue data recorded yet. Dispatched tiffin orders will appear here automatically.
          </div>
        </div>
      )}
    </div>
  );
}
