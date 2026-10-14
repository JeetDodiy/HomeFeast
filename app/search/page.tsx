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
import { COOKS, CUISINES, CITIES } from "@/lib/mockData";

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

  // Filter cooks
  const filtered = COOKS.filter((c) => {
    if (selectedCity && c.city.toLowerCase() !== CITIES.find((x) => x.id === selectedCity)?.name.toLowerCase()) return false;
    if (mealType === "veg" && !c.isVeg) return false;
    if (mealType === "nonveg" && c.isVeg) return false;
    if (selectedCuisine && !c.cuisines.includes(selectedCuisine)) return false;
    if (query && !c.kitchenName.toLowerCase().includes(query.toLowerCase()) && !c.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "price") return a.plans[0].price - b.plans[0].price;
    if (sortBy === "reviews") return b.totalReviews - a.totalReviews;
    return 0;
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Search Header */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "1.5rem 0", position: "sticky", top: 72, zIndex: 100 }}>
        <div className="container-custom">
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
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
              <Search size={18} style={{ color: "var(--text-muted)" }} />
              <input
                id="cook-search-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search cooks, kitchen names..."
                className="input-base"
                style={{ border: "none", background: "transparent", padding: 0, minHeight: "auto" }}
                aria-label="Search cooks"
              />
            </div>

            {/* City Filter */}
            <div style={{ position: "relative" }}>
              <MapPin size={16} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--primary)", pointerEvents: "none" }} />
              <select
                id="city-filter"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="input-base"
                style={{ paddingLeft: "2rem", paddingRight: "2rem", minWidth: 150, cursor: "pointer" }}
                aria-label="Filter by city"
              >
                <option value="">All Cities</option>
                {CITIES.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
              </select>
            </div>

            {/* Meal Type */}
            <div style={{ display: "flex", gap: "0.375rem" }}>
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

            {/* Sort */}
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-base"
              style={{ minWidth: 150, cursor: "pointer" }}
              aria-label="Sort by"
            >
              <option value="rating">Sort: Best Rated</option>
              <option value="price">Sort: Price Low–High</option>
              <option value="reviews">Sort: Most Reviews</option>
            </select>

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

              {/* Clear Filters */}
              <button
                onClick={() => { setQuery(""); setSelectedCity(""); setMealType("all"); setSelectedCuisine(""); setPlanType("all"); }}
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
            {selectedCity && ` in ${CITIES.find((c) => c.id === selectedCity)?.name}`}
          </h1>
        </div>

        {viewMode === "map" ? (
          <CookMap cooks={filtered} selectedCity={selectedCity} />
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔍</div>
            <h2 style={{ fontFamily: "Poppins", fontWeight: 700, color: "var(--text)", marginBottom: "0.75rem" }}>No cooks found</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>Try different filters or a different city.</p>
            <button onClick={() => { setQuery(""); setSelectedCity(""); setMealType("all"); setSelectedCuisine(""); }} className="btn btn-primary">
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
                        <span style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.125rem", color: "var(--primary)" }}>₹{Math.min(...cook.plans.map((p) => p.price))}</span>
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
