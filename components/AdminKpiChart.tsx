"use client";
import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

const KPI_GROWTH = [
  { city: "Rajkot", activeSubs: 1750, cooks: 185 },
  { city: "Ahmedabad", activeSubs: 1037, cooks: 112 },
  { city: "Surat", activeSubs: 454, cooks: 53 },
  { city: "Vadodara", activeSubs: 290, cooks: 32 },
];

export default function AdminKpiChart() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div style={{ height: 260, background: "var(--surface-alt)", borderRadius: "var(--radius-sm)" }} />;
  }

  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={KPI_GROWTH} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
          <XAxis dataKey="city" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
          <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: "var(--surface)",
              borderColor: "var(--border)",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              fontSize: "12px",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
          <Bar dataKey="activeSubs" name="Active Subscribers" fill="var(--secondary)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="cooks" name="Verified Cooks" fill="var(--primary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
