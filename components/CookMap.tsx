"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MapPin, Star, ExternalLink } from "lucide-react";
import type { COOKS } from "@/lib/mockData";

interface CookMapProps {
  cooks: typeof COOKS;
  selectedCity?: string;
}

// Approximate Coordinates for Home Cooks in Gujarat
const COOK_COORDINATES: Record<string, { lat: number; lng: number }> = {
  c1: { lat: 22.3039, lng: 70.8022 }, // Race Course, Rajkot
  c2: { lat: 22.2885, lng: 70.7788 }, // Kalavad Road, Rajkot
  c3: { lat: 23.0225, lng: 72.5714 }, // Navrangpura, Ahmedabad
  c4: { lat: 22.2982, lng: 70.7955 }, // Mavdi, Rajkot
};

export default function CookMap({ cooks, selectedCity }: CookMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [selectedCook, setSelectedCook] = useState<typeof COOKS[0] | null>(cooks[0] || null);
  const [mapInitialized, setMapInitialized] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let mapInstance: any = null;

    // Dynamically load Leaflet on client side
    import("leaflet").then((L) => {
      // Import Leaflet CSS if not already injected
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      if (mapContainerRef.current && !(mapContainerRef.current as any)._leaflet_id) {
        const center = selectedCity?.toLowerCase().includes("ahmedabad")
          ? [23.0225, 72.5714]
          : [22.3039, 70.8022];

        mapInstance = L.map(mapContainerRef.current).setView(center as [number, number], 13);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(mapInstance);

        // Custom icon
        const cookIcon = L.divIcon({
          className: "custom-cook-marker",
          html: `<div style="background:var(--primary);color:white;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(0,0,0,0.3);font-size:16px;border:2px solid white;">🍳</div>`,
          iconSize: [34, 34],
          iconAnchor: [17, 34],
        });

        // Add markers for all visible cooks
        cooks.forEach((cook) => {
          const coords = COOK_COORDINATES[cook.id] || {
            lat: 22.3039 + (Math.random() - 0.5) * 0.04,
            lng: 70.8022 + (Math.random() - 0.5) * 0.04,
          };

          const marker = L.marker([coords.lat, coords.lng], { icon: cookIcon }).addTo(mapInstance);

          marker.on("click", () => {
            setSelectedCook(cook);
          });

          marker.bindPopup(`
            <div style="font-family:sans-serif;padding:4px;">
              <strong style="color:#2B2118;font-size:14px;">${cook.kitchenName}</strong>
              <p style="margin:2px 0;font-size:12px;color:#6B5C4D;">${cook.area}</p>
              <p style="margin:2px 0;font-size:12px;font-weight:bold;color:#E8650A;">₹${Math.min(...cook.plans.map((p) => p.price))} onwards</p>
            </div>
          `);
        });

        setMapInitialized(true);
      }
    });

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [cooks, selectedCity]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.5rem", height: "560px" }}>
      {/* Map Container */}
      <div
        ref={mapContainerRef}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "var(--radius)",
          overflow: "hidden",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow)",
        }}
      />

      {/* Selected Cook Preview Card */}
      <div>
        {selectedCook ? (
          <div className="card" style={{ padding: "1.5rem", height: "100%", display: "flex", flexDirection: "column" }}>
            <img
              src={selectedCook.coverImage}
              alt={selectedCook.kitchenName}
              style={{ width: "100%", height: 160, borderRadius: "8px", objectFit: "cover", marginBottom: "1rem" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
              <div>
                <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.125rem", color: "var(--text)", margin: 0 }}>
                  {selectedCook.kitchenName}
                </h3>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: "0.2rem 0" }}>by {selectedCook.name}</p>
              </div>
              <span className="badge badge-secondary" style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Star size={12} fill="currentColor" /> {selectedCook.rating}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
              <MapPin size={14} style={{ color: "var(--primary)" }} />
              {selectedCook.area}
            </div>

            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5, marginBottom: "1rem", flex: 1 }}>
              {selectedCook.bio}
            </p>

            <div style={{ background: "var(--surface-alt)", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Plans starting at</span>
              <p style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.25rem", color: "var(--primary)", margin: 0 }}>
                ₹{Math.min(...selectedCook.plans.map((p) => p.price))}
              </p>
            </div>

            <Link
              href={`/cooks/${selectedCook.id}`}
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
            >
              View Full Menu & Subscribe <ExternalLink size={16} />
            </Link>
          </div>
        ) : (
          <div className="card" style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", textAlign: "center", padding: "1.5rem" }}>
            Click on any kitchen pin on the map to view menu and subscribe.
          </div>
        )}
      </div>
    </div>
  );
}
