"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MapPin, Star, ExternalLink } from "lucide-react";

interface CookMapProps {
  cooks: any[];
  selectedCity?: string;
}

// Deterministic coordinates for Gujarat cities & neighborhoods
const AREA_COORDINATES: Record<string, { lat: number; lng: number }> = {
  // Rajkot
  "kalavad road": { lat: 22.2885, lng: 70.7788 },
  "150 feet ring road": { lat: 22.2930, lng: 70.7680 },
  "university road": { lat: 22.3010, lng: 70.7710 },
  "race course": { lat: 22.3039, lng: 70.8022 },
  "mavdi": { lat: 22.2720, lng: 70.7850 },
  "bhaktinagar": { lat: 22.2800, lng: 70.8100 },
  "kothariya": { lat: 22.2580, lng: 70.8150 },
  "nana mava": { lat: 22.2810, lng: 70.7720 },
  "gondal road": { lat: 22.2750, lng: 70.8010 },

  // Ahmedabad
  "prahlad nagar": { lat: 23.0125, lng: 72.5050 },
  "satellite": { lat: 23.0300, lng: 72.5180 },
  "bodakdev": { lat: 23.0380, lng: 72.5120 },
  "navrangpura": { lat: 23.0350, lng: 72.5550 },
  "vastrapur": { lat: 23.0350, lng: 72.5280 },
  "maninagar": { lat: 22.9970, lng: 72.6020 },
  "bopal": { lat: 23.0330, lng: 72.4670 },
  "gota": { lat: 23.1020, lng: 72.5350 },
  "thaltej": { lat: 23.0530, lng: 72.5100 },
  "paldi": { lat: 23.0120, lng: 72.5620 },
};

function getCookCoordinates(cook: any): { lat: number; lng: number } {
  const areaKey = (cook.area || "").toLowerCase();
  for (const [key, coords] of Object.entries(AREA_COORDINATES)) {
    if (areaKey.includes(key)) {
      const idNum = (cook.id || cook.kitchenName || "").split("").reduce((acc: number, ch: string) => acc + ch.charCodeAt(0), 0);
      const latOffset = ((idNum % 17) - 8) * 0.0022;
      const lngOffset = (((idNum * 3) % 17) - 8) * 0.0022;
      return { lat: coords.lat + latOffset, lng: coords.lng + lngOffset };
    }
  }

  // City center default with deterministic micro-offset
  const isAhmedabad = (cook.city || "").toLowerCase().includes("ahmedabad");
  const baseLat = isAhmedabad ? 23.0225 : 22.3039;
  const baseLng = isAhmedabad ? 72.5714 : 70.8022;
  const idNum = (cook.id || cook.kitchenName || "").split("").reduce((acc: number, ch: string) => acc + ch.charCodeAt(0), 0);
  const latOffset = ((idNum % 25) - 12) * 0.003;
  const lngOffset = (((idNum * 7) % 25) - 12) * 0.003;
  return { lat: baseLat + latOffset, lng: baseLng + lngOffset };
}

export default function CookMap({ cooks = [], selectedCity }: CookMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);

  const [selectedCook, setSelectedCook] = useState<any>(cooks[0] || null);
  const [mapReady, setMapReady] = useState(false);

  // Sync selected cook whenever filtered cooks list changes
  useEffect(() => {
    if (!cooks || cooks.length === 0) {
      setSelectedCook(null);
    } else if (!selectedCook || !cooks.some((c) => (c.id && c.id === selectedCook.id) || (c.kitchenName && c.kitchenName === selectedCook.kitchenName))) {
      setSelectedCook(cooks[0]);
    }
  }, [cooks, selectedCook]);

  // 1. Initialize Map ONCE
  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;
    let isMounted = true;

    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;
      leafletRef.current = L;

      // Ensure Leaflet CSS
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      if (!mapInstanceRef.current && !(mapContainerRef.current as any)._leaflet_id) {
        const center: [number, number] = selectedCity?.toLowerCase().includes("ahmedabad")
          ? [23.0225, 72.5714]
          : [22.3039, 70.8022];

        const map = L.map(mapContainerRef.current, {
          scrollWheelZoom: false,
        }).setView(center, 12);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        const markersLayer = L.layerGroup().addTo(map);
        markersLayerRef.current = markersLayer;
        mapInstanceRef.current = map;
        setMapReady(true);
      }
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
      }
    };
  }, []);

  // 2. Dynamically re-render markers whenever cooks or selectedCity changes
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!L || !map || !layer || !mapReady) return;

    // Clear previous markers so filter is 100% reactive
    layer.clearLayers();

    if (!cooks || cooks.length === 0) {
      const center: [number, number] = selectedCity?.toLowerCase().includes("ahmedabad")
        ? [23.0225, 72.5714]
        : [22.3039, 70.8022];
      map.setView(center, 12);
      return;
    }

    const markers: any[] = [];

    cooks.forEach((cook) => {
      const coords = getCookCoordinates(cook);
      const isSelected = selectedCook && (selectedCook.id === cook.id || selectedCook.kitchenName === cook.kitchenName);

      const isJain = Array.isArray(cook.cuisines) && cook.cuisines.some((c: string) => c.toLowerCase().includes("jain"));
      const iconEmoji = isJain ? "🌿" : cook.isVeg ? "🟢" : "🔴";
      const iconBg = isJain ? "#15803d" : cook.isVeg ? "#2F7D4F" : "#DC2626";
      const borderStyle = isSelected ? "3px solid #E8650A" : "2px solid white";
      const scaleStyle = isSelected ? "transform: scale(1.15);" : "";

      const cookIcon = L.divIcon({
        className: "custom-cook-marker",
        html: `<div style="background:${iconBg};color:white;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 12px rgba(0,0,0,0.35);font-size:16px;${borderStyle};${scaleStyle}transition:transform 0.2s;cursor:pointer;">${iconEmoji}</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
      });

      const marker = L.marker([coords.lat, coords.lng], { icon: cookIcon }).addTo(layer);

      marker.on("click", () => {
        setSelectedCook(cook);
      });

      const minPrice = cook.plans && cook.plans.length > 0
        ? Math.min(...cook.plans.map((p: any) => p.price))
        : 120;

      marker.bindPopup(`
        <div style="font-family:sans-serif;padding:6px;min-width:160px;">
          <strong style="color:#2B2118;font-size:14px;display:block;margin-bottom:2px;">${cook.kitchenName}</strong>
          <p style="margin:2px 0;font-size:12px;color:#6B5C4D;">${cook.area || cook.city}</p>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;">
            <span style="font-size:11px;font-weight:700;color:${cook.isVeg ? '#2F7D4F' : '#DC2626'};background:rgba(0,0,0,0.06);padding:2px 6px;border-radius:999px;">
              ${isJain ? '🌿 Jain' : cook.isVeg ? '🟢 Pure Veg' : '🔴 Non-Veg'}
            </span>
            <span style="font-size:12px;font-weight:bold;color:#E8650A;">₹${minPrice}</span>
          </div>
        </div>
      `);

      markers.push(marker);
    });

    // Auto fit bounds to displayed markers
    if (markers.length > 0) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.18), { maxZoom: 14 });
    }
  }, [cooks, selectedCity, mapReady, selectedCook]);

  const minStartingPrice = selectedCook?.plans && selectedCook.plans.length > 0
    ? Math.min(...selectedCook.plans.map((p: any) => p.price))
    : 120;

  return (
    <div
      className="cook-map-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 340px",
        gap: "1.5rem",
        height: "560px",
        position: "relative",
        zIndex: 1,
        isolation: "isolate",
      }}
    >
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
          position: "relative",
          zIndex: 1,
          isolation: "isolate",
        }}
      />

      {/* Selected Cook Preview Card */}
      <div>
        {selectedCook ? (
          <div className="card" style={{ padding: "1.5rem", height: "100%", display: "flex", flexDirection: "column" }}>
            <div style={{ position: "relative", height: 160, borderRadius: "8px", overflow: "hidden", marginBottom: "1rem" }}>
              <img
                src={selectedCook.coverImage || "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80"}
                alt={selectedCook.kitchenName}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <span
                className={`badge ${selectedCook.isVeg ? "badge-veg" : "badge-nonveg"}`}
                style={{ position: "absolute", top: 10, left: 10 }}
              >
                <span className={selectedCook.isVeg ? "veg-dot" : "nonveg-dot"} />
                {Array.isArray(selectedCook.cuisines) && selectedCook.cuisines.some((c: string) => c.toLowerCase().includes("jain"))
                  ? "Jain Available"
                  : selectedCook.isVeg
                  ? "Pure Veg"
                  : "Non-Veg"}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
              <div>
                <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.125rem", color: "var(--text)", margin: 0 }}>
                  {selectedCook.kitchenName}
                </h3>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: "0.2rem 0" }}>by {selectedCook.name}</p>
              </div>
              <span className="badge badge-secondary" style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Star size={12} fill="currentColor" /> {selectedCook.rating || 4.8}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
              <MapPin size={14} style={{ color: "var(--primary)" }} />
              {selectedCook.area || selectedCook.city}
            </div>

            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5, marginBottom: "1rem", flex: 1, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {selectedCook.bio}
            </p>

            <div style={{ background: "var(--surface-alt)", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Plans starting at</span>
              <p style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.25rem", color: "var(--primary)", margin: 0 }}>
                ₹{minStartingPrice}
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
          <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", textAlign: "center", padding: "2rem" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🍳</div>
            <p style={{ fontWeight: 600, color: "var(--text)", marginBottom: "0.25rem" }}>No kitchens found</p>
            <p style={{ fontSize: "0.8125rem" }}>No kitchens match this filter. Try selecting "All" or a different city.</p>
          </div>
        )}
      </div>
    </div>
  );
}
