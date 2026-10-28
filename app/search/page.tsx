"use client";
import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Filter,
  MapPin,
  Star,
  Clock,
  SlidersHorizontal,
  ChevronDown,
  X,
  Map,
  LayoutGrid,
} from "lucide-react";
import { CUISINES, CITIES } from "@/lib/mockData";

const CookMap = dynamic(() => import("@/components/CookMap"), {
  ssr: false,
  loading: () => (
    <div style={{ height: 520, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface-alt)", borderRadius: "var(--radius)" }}>
      <div style={{ textAlign: "center" }}>
        <div className="spinner" style={{ margin: "0 auto 0.75rem" }} />
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Loading interactive cook map...</p>
      </div>
    </div>
  ),
});

function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={13} fill={n <= Math.round(rating) ? "var(--accent)" : "none"} style={{ color: n <= Math.round(rating) ? "var(--accent)" : "var(--border)" }} />
      ))}
    </div>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || "");
  const [mealType, setMealType] = useState(searchParams.get("type") || "all");
  const [selectedCuisine, setSelectedCuisine] = useState(searchParams.get("cuisine") || "");
  const [planType, setPlanType] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [allCooks, setAllCooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load real registered cooks from PostgreSQL API & local user-created profile
  useEffect(() => {
    if (typeof window !== "undefined") {
      let localCooks: any[] = [];

      // 1. From hf_registered_cooks (local registrations)
      try {
        const stored = localStorage.getItem("hf_registered_cooks");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) localCooks.push(...parsed);
        }
      } catch {}

      // 2. From hf_cook_profile (if user registered their kitchen)
      try {
        const activeProfile = localStorage.getItem("hf_cook_profile");
        if (activeProfile) {
          const p = JSON.parse(activeProfile);
          if (p.shopName && !localCooks.some((c) => c.kitchenName?.toLowerCase() === p.shopName.toLowerCase())) {
            const cookId = `c_${(p.headCook || "cook").toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
            localCooks.push({
              id: cookId,
              kitchenName: p.shopName,
              name: p.headCook || "Home Cook",
              bio: p.bio || `Fresh homemade meals cooked with hygiene by Chef ${p.headCook || "Cook"}.`,
              coverImage: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80",
              avatar: "https://randomuser.me/api/portraits/men/33.jpg",
              fssaiNo: p.fssaiNumber || "10020042007891",
              cuisines: p.pureVeg ? ["gujarati", "kathiyawadi", "jain"] : ["gujarati", "punjabi"],
              city: p.city || "Rajkot",
              area: p.address || `${p.city || "Rajkot"}`,
              pincode: "360005",
              rating: 4.9,
              totalReviews: 12,
              deliverySlots: [p.lunchSlot || "Lunch (12–1:30 PM)", p.dinnerSlot || "Dinner (7:30–9 PM)"],
              serviceAreas: p.serviceAreas || ["Kalavad Road", "University Road", "150 Feet Ring Road"],
              status: "approved",
              isVeg: p.pureVeg !== undefined ? p.pureVeg : true,
              totalOrders: 65,
              responseTime: "Under 25 min",
              memberSince: "2024",
              plans: [
                { id: `p_${cookId}_daily`, type: "daily", label: "Daily Kathiyawadi Plan", price: 120, perMeal: 120, description: "Daily fresh homemade tiffin.", includes: ["1 Sabzi", "Dal/Kadhi", "4 Phulkas", "Rice"] },
                { id: `p_${cookId}_weekly`, type: "weekly", label: "Weekly Saver Plan", price: 749, perMeal: 107, description: "7-day variety plan with Sunday sweet special.", includes: ["Sabzi", "Dal/Kadhi", "Rotis", "Rice", "Sweet"], popular: true },
                { id: `p_${cookId}_monthly`, type: "monthly", label: "Monthly Royal Plan", price: 2799, perMeal: 93, description: "30-day meal plan. Pause anytime.", includes: ["Full Thali", "Special Sundays", "5 Skips"] },
              ],
            });
          }
        }
      } catch {}

      // 3. Fetch from /api/v1/cooks (PostgreSQL database - real data)
      fetch("/api/v1/cooks")
        .then((res) => res.json())
        .then((data) => {
          const serverCooks = data.success && Array.isArray(data.data) ? data.data : [];
          // Prioritize PostgreSQL database cooks, then unique local records
          const combined = [...serverCooks, ...localCooks];
          const seenNames = new Set<string>();
          const seenIds = new Set<string>();
          const uniqueList: any[] = [];
          for (const c of combined) {
            const normName = (c.kitchenName || c.name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
            const normId = (c.id || "").toLowerCase();
            if ((normName && seenNames.has(normName)) || (normId && seenIds.has(normId))) {
              continue;
            }
            if (normName) seenNames.add(normName);
            if (normId) seenIds.add(normId);
            uniqueList.push(c);
          }
          setAllCooks(uniqueList);
        })
        .catch(() => {
          setAllCooks(localCooks);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  // Filter cooks based on user criteria
  const filtered = allCooks.filter((c) => {
    if (selectedCity) {
      const qCity = selectedCity.trim().toLowerCase();
      const matchedCity = CITIES.find((x) => x.id.toLowerCase() === qCity || x.name.toLowerCase() === qCity);
      const targetCityName = matchedCity ? matchedCity.name.toLowerCase() : qCity;
      if (c.city?.toLowerCase() !== targetCityName) return false;
    }

    const cCuisines: string[] = Array.isArray(c.cuisines)
      ? c.cuisines.map((x: any) => (typeof x === "string" ? x.toLowerCase() : x?.name?.toLowerCase() || ""))
      : [];

    if (mealType === "veg" && !c.isVeg) return false;
    if (mealType === "nonveg" && c.isVeg) return false;
    if (mealType === "jain" && !cCuisines.some((cui) => cui.includes("jain"))) return false;
    if (selectedCuisine && !cCuisines.some((cui) => cui.includes(selectedCuisine.toLowerCase()))) return false;

    if (planType && planType !== "all") {
      const hasPlan = c.plans?.some((p: any) => p.type?.toLowerCase() === planType.toLowerCase());
      if (!hasPlan) return false;
    }
    if (maxPrice && maxPrice < 5000) {
      const minPlanPrice = c.plans && c.plans.length > 0 ? Math.min(...c.plans.map((p: any) => p.price)) : 120;
      if (minPlanPrice > maxPrice) return false;
    }
    if (query) {
      const q = query.trim().toLowerCase();
      const matchesKitchen = c.kitchenName?.toLowerCase().includes(q);
      const matchesCook = c.name?.toLowerCase().includes(q);
      const matchesArea = c.area?.toLowerCase().includes(q);
      const matchesCity = c.city?.toLowerCase().includes(q);
      const matchesCuisine = cCuisines.some((cui: string) => cui.includes(q));
      if (!matchesKitchen && !matchesCook && !matchesArea && !matchesCity && !matchesCuisine) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    if (sortBy === "price") {
      const minA = a.plans && a.plans.length > 0 ? Math.min(...a.plans.map((p: any) => p.price)) : 120;
      const minB = b.plans && b.plans.length > 0 ? Math.min(...b.plans.map((p: any) => p.price)) : 120;
      return minA - minB;
    }
    if (sortBy === "reviews") return (b.totalReviews || 0) - (a.totalReviews || 0);
    return 0;
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Search Header */}
      <div
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
          padding: "1rem 0",
          position: "sticky",
          top: 72,
          zIndex: 900,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="container-custom">
          {/* Top Controls Row */}
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center", marginBottom: "0.75rem" }}>
            {/* Search Input */}
            <div
              style={{
                flex: "1 1 280px",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "var(--surface-alt)",
                border: "1.5px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                padding: "0.5rem 1rem",
              }}
            >
              <Search size={18} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
              <input
                id="cook-search-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search cooks, kitchen names..."
                className="input-base"
                style={{ border: "none", background: "transparent", padding: 0, minHeight: "auto", width: "100%" }}
                aria-label="Search cooks"
              />
            </div>

            {/* City Filter */}
            <div style={{ position: "relative", minWidth: 160 }}>
              <MapPin size={16} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--primary)", pointerEvents: "none" }} />
              <select
                id="city-filter"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="input-base"
                style={{ paddingLeft: "2rem", paddingRight: "2rem", width: "100%", cursor: "pointer" }}
                aria-label="Filter by city"
              >
                <option value="">All Cities</option>
                {CITIES.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
              </select>
            </div>

            {/* Meal Type */}
            <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
              {[["all", "All"], ["veg", "🟢 Veg"], ["nonveg", "🔴 Non-Veg"], ["jain", "🌿 Jain"]].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setMealType(val)}
                  className={`filter-chip${mealType === val ? " active" : ""}`}
                  id={`mealtype-${val}-chip`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Sub Row: Sort, View Switcher & Expand Filters */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            {/* Sort */}
            <div style={{ minWidth: 170 }}>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-base"
                style={{ width: "auto", minWidth: 170, cursor: "pointer" }}
                aria-label="Sort by"
              >
                <option value="rating">Sort: Best Rated</option>
                <option value="price">Sort: Price Low–High</option>
                <option value="reviews">Sort: Most Reviews</option>
              </select>
            </div>

            {/* Right: View Toggle + More Filters */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {/* View Mode Toggle: List vs Map */}
              <div style={{ display: "flex", border: "1.5px solid var(--border)", borderRadius: "var(--radius-sm)", overflow: "hidden", background: "var(--surface-alt)" }}>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  id="view-list-btn"
                  style={{
                    padding: "0.5rem 0.875rem",
                    background: viewMode === "list" ? "var(--primary)" : "transparent",
                    color: viewMode === "list" ? "white" : "var(--text-muted)",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    transition: "all 0.15s ease",
                  }}
                >
                  <LayoutGrid size={15} /> List
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("map")}
                  id="view-map-btn"
                  style={{
                    padding: "0.5rem 0.875rem",
                    background: viewMode === "map" ? "var(--primary)" : "transparent",
                    color: viewMode === "map" ? "white" : "var(--text-muted)",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    transition: "all 0.15s ease",
                  }}
                >
                  <Map size={15} /> Map View
                </button>
              </div>

              {/* More Filters Toggle */}
              <button
                id="toggle-filters-btn"
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-ghost"
                style={{ gap: "0.375rem" }}
                aria-expanded={showFilters}
              >
                <SlidersHorizontal size={16} />
                Filters
                <ChevronDown size={14} style={{ transform: showFilters ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border)", display: "flex", gap: "1.5rem", flexWrap: "wrap", animation: "fadeInUp 0.2s ease" }}>
              {/* Cuisine Filter */}
              <div>
                <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text)", marginBottom: "0.5rem" }}>Cuisine</p>
                <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
                  <button onClick={() => setSelectedCuisine("")} className={`filter-chip${!selectedCuisine ? " active" : ""}`}>All</button>
                  {CUISINES.map((c) => (
                    <button key={c.id} onClick={() => setSelectedCuisine(c.id)} className={`filter-chip${selectedCuisine === c.id ? " active" : ""}`} id={`cuisine-${c.id}-chip`}>
                      {c.emoji} {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Plan Type */}
              <div>
                <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text)", marginBottom: "0.5rem" }}>Plan Type</p>
                <div style={{ display: "flex", gap: "0.375rem" }}>
                  {[["all", "All Plans"], ["daily", "Daily"], ["weekly", "Weekly"], ["monthly", "Monthly"]].map(([val, label]) => (
                    <button key={val} onClick={() => setPlanType(val)} className={`filter-chip${planType === val ? " active" : ""}`}>{label}</button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text)", marginBottom: "0.5rem" }}>
                  Max Price: {maxPrice >= 5000 ? "Any Budget" : `₹${maxPrice}`}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <input
                    type="range"
                    min="100"
                    max="5000"
                    step="50"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    style={{ width: "140px", accentColor: "var(--primary)" }}
                    aria-label="Filter by maximum price"
                  />
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>₹{maxPrice >= 5000 ? "5000+" : maxPrice}</span>
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => { setQuery(""); setSelectedCity(""); setMealType("all"); setSelectedCuisine(""); setPlanType("all"); setMaxPrice(5000); }}
                className="btn btn-ghost"
                style={{ alignSelf: "flex-end", color: "var(--danger)" }}
                id="clear-filters-btn"
              >
                <X size={14} /> Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="container-custom" style={{ padding: "2rem 1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h1 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.375rem", color: "var(--text)" }}>
            {filtered.length} Home Cook{filtered.length !== 1 ? "s" : ""} Found
            {selectedCity && ` in ${CITIES.find((c) => c.id.toLowerCase() === selectedCity.toLowerCase() || c.name.toLowerCase() === selectedCity.toLowerCase())?.name || selectedCity}`}
          </h1>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "5rem 0" }}>
            <div className="spinner" style={{ margin: "0 auto 1rem" }} />
            <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem" }}>Loading verified kitchens from database...</p>
          </div>
        ) : viewMode === "map" ? (
          <CookMap cooks={filtered} selectedCity={selectedCity} />
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔍</div>
            <h2 style={{ fontFamily: "Poppins", fontWeight: 700, color: "var(--text)", marginBottom: "0.75rem" }}>No cooks found</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>Try different filters or a different city.</p>
            <button onClick={() => { setQuery(""); setSelectedCity(""); setMealType("all"); setSelectedCuisine(""); setPlanType("all"); setMaxPrice(5000); }} className="btn btn-primary">
              Clear Filters
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {filtered.map((cook) => (
              <Link key={cook.id} href={`/cooks/${cook.id}`} style={{ textDecoration: "none" }}>
                <div className="cook-card">
                  <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
                    <img src={cook.coverImage} alt={cook.kitchenName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", top: 12, left: 12 }}>
                      <span className={`badge ${cook.isVeg ? "badge-veg" : "badge-nonveg"}`}>
                        <span className={cook.isVeg ? "veg-dot" : "nonveg-dot"} />
                        {cook.isVeg ? "Pure Veg" : "Non-Veg"}
                      </span>
                    </div>
                    <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.75)", color: "white", borderRadius: "8px", padding: "0.25rem 0.5rem", fontSize: "0.8125rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 3 }}>
                      <Star size={12} fill="var(--accent)" style={{ color: "var(--accent)" }} />
                      {cook.rating} ({cook.totalReviews})
                    </div>
                  </div>
                  <div style={{ padding: "1.25rem" }}>
                    <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.0625rem", color: "var(--text)", marginBottom: "0.25rem" }}>{cook.kitchenName}</h3>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>{cook.name}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.75rem" }}>
                      <MapPin size={13} style={{ color: "var(--primary)" }} />
                      <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{cook.area}</span>
                    </div>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "1rem", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {cook.bio}
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <span style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.125rem", color: "var(--primary)" }}>
                          ₹{cook.plans && cook.plans.length > 0 ? Math.min(...cook.plans.map((p: any) => p.price)) : 120}
                        </span>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}> onwards/plan</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Clock size={13} style={{ color: "var(--secondary)" }} />
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{cook.responseTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
          <div style={{ textAlign: "center" }}>
            <div className="spinner" style={{ margin: "0 auto 1rem" }} />
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>Loading home cooks...</p>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
