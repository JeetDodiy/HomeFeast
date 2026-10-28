"use client";
import { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import {
  Star,
  MapPin,
  Clock,
  Shield,
  Phone,
  CheckCircle,
  ChevronLeft,
  Heart,
  Share2,
  UtensilsCrossed,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { COOKS, REVIEWS, CUISINES, DEFAULT_WEEKLY_MENU } from "@/lib/mockData";

function enrichCookProfile(raw: any) {
  if (!raw) return null;
  const match = COOKS.find(
    (c) => c.id === raw.id || c.kitchenName?.toLowerCase() === raw.kitchenName?.toLowerCase()
  );
  return {
    ...raw,
    name: raw.name || match?.name || raw.kitchenName || "Home Cook",
    avatar: raw.avatar || match?.avatar || raw.coverImage || "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=80",
    coverImage: raw.coverImage || match?.coverImage || "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80",
    memberSince: raw.memberSince || match?.memberSince || "2024",
    totalOrders: raw.totalOrders ?? match?.totalOrders ?? 100,
    rating: raw.rating ?? match?.rating ?? 4.8,
    totalReviews: raw.totalReviews ?? match?.totalReviews ?? 12,
    weeklyMenu: raw.weeklyMenu || match?.weeklyMenu || DEFAULT_WEEKLY_MENU,
  };
}

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={size} fill={n <= Math.round(rating) ? "var(--accent)" : "none"} style={{ color: n <= Math.round(rating) ? "var(--accent)" : "var(--border)" }} />
      ))}
    </div>
  );
}

export default function CookProfilePage() {
  const params = useParams();
  const id = (params?.id as string) || "c1";

  const [cook, setCook] = useState<any>(() => enrichCookProfile(COOKS.find((c) => c.id === id) || null));
  const [loading, setLoading] = useState(!cook);

  useEffect(() => {
    if (cook) return;
    if (typeof window !== "undefined") {
      // 1. Check hf_registered_cooks
      try {
        const stored = localStorage.getItem("hf_registered_cooks");
        if (stored) {
          const parsed = JSON.parse(stored);
          const found = parsed.find((c: any) => c.id === id || c.kitchenName?.toLowerCase() === id.toLowerCase());
          if (found) {
            setCook(enrichCookProfile(found));
            setLoading(false);
            return;
          }
        }
      } catch {}

      // 2. Check active hf_cook_profile
      try {
        const activeProfile = localStorage.getItem("hf_cook_profile");
        if (activeProfile) {
          const p = JSON.parse(activeProfile);
          const cookId = `c_${(p.headCook || "cook").toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
          if (cookId === id || p.shopName?.toLowerCase() === id.toLowerCase()) {
            const synthesized = {
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
              weeklyMenu: DEFAULT_WEEKLY_MENU,
            };
            setCook(enrichCookProfile(synthesized));
            setLoading(false);
            return;
          }
        }
      } catch {}

      // 3. Check /api/v1/cooks
      fetch("/api/v1/cooks")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.data)) {
            const found = data.data.find((c: any) => c.id === id || c.kitchenName?.toLowerCase() === id.toLowerCase());
            if (found) {
              setCook(enrichCookProfile(found));
            }
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id, cook]);

  const activeWeeklyMenu: Record<string, string[]> = cook?.weeklyMenu || DEFAULT_WEEKLY_MENU;
  const days = Object.keys(activeWeeklyMenu).length > 0 ? Object.keys(activeWeeklyMenu) : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const cookReviews = cook ? REVIEWS.filter((r) => r.cookId === cook.id) : [];
  const [activeTab, setActiveTab] = useState<"menu" | "plans" | "reviews">("menu");
  const [selectedDay, setSelectedDay] = useState<string>("Monday");
  const [selectedPlan, setSelectedPlan] = useState<string>(cook?.plans?.find((p: any) => p.popular)?.id || cook?.plans?.[0]?.id || "p1");

  useEffect(() => {
    if (cook && (!selectedPlan || selectedPlan === "p1")) {
      const bestPlan = cook.plans?.find((p: any) => p.popular)?.id || cook.plans?.[0]?.id;
      if (bestPlan) setSelectedPlan(bestPlan);
    }
  }, [cook, selectedPlan]);

  const [isSaved, setIsSaved] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  useEffect(() => {
    if (cook && typeof window !== "undefined") {
      try {
        const saved = JSON.parse(localStorage.getItem("hf_saved_cooks") || "[]");
        setIsSaved(saved.includes(cook.id));
      } catch {}
    }
  }, [cook]);

  if (loading) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <div style={{ textAlign: "center" }}>
          <div className="spinner" style={{ margin: "0 auto 1rem" }} />
          <p style={{ color: "var(--text-muted)" }}>Loading kitchen profile...</p>
        </div>
      </div>
    );
  }

  if (!cook) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", padding: "2rem" }}>
        <div className="card" style={{ maxWidth: 480, textAlign: "center", padding: "3rem 2rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🍳</div>
          <h2 style={{ fontFamily: "Poppins", fontWeight: 700, color: "var(--text)", marginBottom: "0.5rem" }}>Kitchen Not Found</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
            The home kitchen you are looking for may have been updated or moved. Browse all certified kitchens in your area.
          </p>
          <Link href="/search" className="btn btn-primary" style={{ display: "inline-flex" }}>
            Explore Local Cooks
          </Link>
        </div>
      </div>
    );
  }

  const handleToggleSave = () => {
    if (typeof window !== "undefined") {
      try {
        const saved = JSON.parse(localStorage.getItem("hf_saved_cooks") || "[]");
        let updated: string[];
        if (saved.includes(cook.id)) {
          updated = saved.filter((i: string) => i !== cook.id);
          setIsSaved(false);
          showToast(`Removed ${cook.kitchenName} from your saved cooks.`);
        } else {
          updated = [...saved, cook.id];
          setIsSaved(true);
          showToast(`Saved ${cook.kitchenName} to your favourites!`);
        }
        localStorage.setItem("hf_saved_cooks", JSON.stringify(updated));
      } catch {}
    }
  };

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(window.location.href);
          showToast("Cook profile link copied to clipboard!");
        } else {
          showToast("Profile link: " + window.location.href);
        }
      } catch {
        showToast("Profile link copied!");
      }
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Back */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "0.75rem 0" }}>
        <div className="container-custom">
          <Link href="/search" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", color: "var(--text-muted)", fontSize: "0.9rem", textDecoration: "none" }}>
            <ChevronLeft size={16} /> Back to Search
          </Link>
        </div>
      </div>

      {/* Cover Image */}
      <div style={{ height: 320, overflow: "hidden", position: "relative" }}>
        <img src={cook.coverImage || "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80"} alt={cook.kitchenName || "Kitchen"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7))" }} />
        <div style={{ position: "absolute", top: 16, right: 16, display: "flex", gap: "0.5rem" }}>
          <button
            id="save-cook-btn"
            onClick={handleToggleSave}
            className="btn btn-ghost"
            style={{
              background: isSaved ? "var(--primary)" : "rgba(255,255,255,0.9)",
              color: isSaved ? "#fff" : "var(--text)",
              border: "none",
              borderRadius: "10px",
              padding: "0.5rem",
              width: 40,
              height: 40,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
            aria-label={isSaved ? "Saved to favourites" : "Save cook to favourites"}
            title={isSaved ? "Saved to favourites" : "Save to favourites"}
          >
            <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
          </button>
          <button
            id="share-cook-btn"
            onClick={handleShare}
            className="btn btn-ghost"
            style={{
              background: "rgba(255,255,255,0.9)",
              color: "var(--text)",
              border: "none",
              borderRadius: "10px",
              padding: "0.5rem",
              width: 40,
              height: 40,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Share cook profile"
            title="Share cook profile"
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>

      <div className="container-custom" style={{ marginTop: "-4rem", position: "relative", paddingBottom: "4rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "2rem", alignItems: "start" }}>
          {/* Main Content */}
          <div>
            {/* Profile Header Card */}
            <div className="card" style={{ padding: "1.75rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", flexWrap: "wrap" }}>
                <img
                  src={cook.avatar || cook.coverImage || "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=80"}
                  alt={cook.name || cook.kitchenName || "Home Cook"}
                  style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "4px solid var(--surface)" }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.375rem" }}>
                    <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.625rem", color: "var(--text)" }}>
                      {cook.kitchenName}
                    </h1>
                    <span className={`badge ${cook.isVeg ? "badge-veg" : "badge-nonveg"}`}>
                      <span className={cook.isVeg ? "veg-dot" : "nonveg-dot"} />
                      {cook.isVeg ? "Pure Veg" : "Non-Veg"}
                    </span>
                  </div>
                  <p style={{ color: "var(--text-muted)", marginBottom: "0.75rem" }}>by {cook.name || "Home Cook"} · Member since {cook.memberSince || "2024"}</p>
                  <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                      <Stars rating={cook.rating || 4.8} size={16} />
                      <span style={{ fontWeight: 700, color: "var(--text)" }}>{cook.rating || 4.8}</span>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>({cook.totalReviews || 12} reviews)</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                      <MapPin size={14} style={{ color: "var(--primary)" }} />
                      {cook.area}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                      <UtensilsCrossed size={14} style={{ color: "var(--secondary)" }} />
                      {(cook.totalOrders || 100).toLocaleString()} orders served
                    </div>
                  </div>
                </div>
              </div>

              <p style={{ marginTop: "1rem", color: "var(--text-muted)", lineHeight: 1.75 }}>{cook.bio}</p>

              {/* Tags */}
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "1rem" }}>
                {cook.cuisines?.map((c: string) => {
                  const cuisine = CUISINES.find((x) => x.id === c);
                  return cuisine ? (
                    <span key={c} className="badge" style={{ background: "var(--surface-alt)", color: "var(--text-muted)" }}>
                      {cuisine.emoji} {cuisine.name}
                    </span>
                  ) : null;
                })}
                <span className="badge" style={{ background: "rgba(47,125,79,0.1)", color: "var(--secondary)" }}>
                  <Shield size={11} /> FSSAI #{cook.fssaiNo || "10020042007891"}
                </span>
              </div>
            </div>

            {/* Info Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
              {[
                { icon: Clock, label: "Response Time", value: cook.responseTime || "Under 30 min", color: "var(--info)" },
                { icon: Calendar, label: "Delivery Slots", value: Array.isArray(cook.deliverySlots) ? cook.deliverySlots.join(", ") : "Lunch & Dinner", color: "var(--secondary)" },
                { icon: MapPin, label: "Service Areas", value: Array.isArray(cook.serviceAreas) ? cook.serviceAreas.slice(0, 2).join(", ") + (cook.serviceAreas.length > 2 ? ` +${cook.serviceAreas.length - 2} more` : "") : (cook.area || "City Wide"), color: "var(--primary)" },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="card" style={{ padding: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <Icon size={16} style={{ color }} />
                    <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)", fontWeight: 500 }}>{label}</span>
                  </div>
                  <p style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--text)" }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="card" style={{ overflow: "hidden" }}>
              <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
                {(["menu", "plans", "reviews"] as const).map((tab) => (
                  <button
                    key={tab}
                    id={`tab-${tab}`}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      flex: 1,
                      padding: "1rem",
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      fontFamily: "Poppins",
                      fontWeight: 600,
                      fontSize: "0.9375rem",
                      color: activeTab === tab ? "var(--primary)" : "var(--text-muted)",
                      borderBottom: activeTab === tab ? "2px solid var(--primary)" : "2px solid transparent",
                      transition: "all 0.2s ease",
                      textTransform: "capitalize",
                    }}
                    aria-selected={activeTab === tab}
                    role="tab"
                  >
                    {tab === "menu" && "🍽️ "}{tab === "plans" && "📋 "}{tab === "reviews" && "⭐ "}
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {tab === "reviews" && ` (${cookReviews.length})`}
                  </button>
                ))}
              </div>

              <div style={{ padding: "1.5rem" }}>
                {/* Menu Tab */}
                {activeTab === "menu" && (
                  <div>
                    <p style={{ color: "var(--text-muted)", marginBottom: "1rem", fontSize: "0.9rem" }}>
                      Weekly rotating menu. Fresh ingredients daily.
                    </p>
                    {/* Day Selector */}
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                      {days.map((day) => (
                        <button
                          key={day}
                          onClick={() => setSelectedDay(day)}
                          className={`filter-chip${selectedDay === day ? " active" : ""}`}
                          id={`day-${day}-btn`}
                        >
                          {day.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                    {/* Menu Items */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                      {(activeWeeklyMenu[selectedDay] || activeWeeklyMenu["Monday"] || []).length > 0 ? (
                        (activeWeeklyMenu[selectedDay] || activeWeeklyMenu["Monday"] || []).map((item: string, i: number) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.75rem",
                              padding: "0.875rem 1rem",
                              background: "var(--surface-alt)",
                              borderRadius: "var(--radius-sm)",
                            }}
                          >
                            <span className={cook?.isVeg ? "veg-dot" : "nonveg-dot"} />
                            <span style={{ fontSize: "0.9375rem", color: "var(--text)", fontWeight: 500 }}>{item}</span>
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: "1.5rem", textAlign: "center", color: "var(--text-muted)", background: "var(--surface-alt)", borderRadius: "var(--radius-sm)" }}>
                          Fresh homestyle specials cooked daily with handpicked seasonal ingredients.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Plans Tab */}
                {activeTab === "plans" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {cook.plans?.map((plan: any) => (
                      <div
                        key={plan.id}
                        className={`plan-card${plan.popular ? " popular" : ""}${selectedPlan === plan.id ? " selected" : ""}`}
                        onClick={() => setSelectedPlan(plan.id)}
                        id={`plan-card-${plan.id}`}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div>
                            <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.0625rem", color: "var(--text)" }}>{plan.label}</h3>
                            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{plan.description}</p>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.5rem", color: "var(--primary)" }}>₹{plan.price}</div>
                            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>₹{plan.perMeal}/meal</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.875rem" }}>
                          {(plan.includes || []).map((item: string) => (
                            <span key={item} style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                              <CheckCircle size={12} style={{ color: "var(--secondary)" }} /> {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === "reviews" && (
                  <div>
                    {cookReviews.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                        <MessageSquare size={40} style={{ opacity: 0.4, marginBottom: "1rem" }} />
                        <p>No reviews yet. Be the first!</p>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {cookReviews.map((r) => (
                          <div key={r.id} style={{ padding: "1.25rem", background: "var(--surface-alt)", borderRadius: "var(--radius-sm)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                              <img src={r.avatar} alt={r.userName} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }} />
                              <div>
                                <p style={{ fontWeight: 600, color: "var(--text)", margin: 0, display: "flex", alignItems: "center", gap: "0.375rem" }}>
                                  {r.userName}
                                  <span style={{ fontSize: "0.6875rem", color: "var(--secondary)", background: "rgba(47,125,79,0.12)", padding: "1px 6px", borderRadius: "999px", fontWeight: 700 }}>
                                    ✓ Verified Subscriber
                                  </span>
                                </p>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                  <Stars rating={r.rating} />
                                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{r.date}</span>
                                </div>
                              </div>
                              <span className="badge" style={{ marginLeft: "auto", background: "var(--surface)", color: "var(--text-muted)", fontSize: "0.7rem" }}>{r.mealType}</span>
                            </div>
                            <p style={{ fontSize: "0.9375rem", color: "var(--text-muted)", lineHeight: 1.7 }}>{r.comment}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar – Subscription Card */}
          <div style={{ position: "sticky", top: "160px" }}>
            <div className="card" style={{ padding: "1.75rem" }}>
              <h2 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.25rem", color: "var(--text)", marginBottom: "1.25rem" }}>
                Subscribe to {cook.kitchenName}
              </h2>

              {/* Selected Plan Info */}
              {(() => {
                const plan = cook.plans?.find((p: any) => p.id === selectedPlan) || cook.plans?.[0] || { label: "Daily Plan", price: 120, perMeal: 120 };
                const firstSlot = Array.isArray(cook.deliverySlots) && cook.deliverySlots.length > 0 ? cook.deliverySlots[0] : "Lunch (12–1:30 PM)";
                const firstArea = Array.isArray(cook.serviceAreas) && cook.serviceAreas.length > 0 ? `${cook.serviceAreas[0]} & nearby` : (cook.area || "Neighborhood Delivery");
                return (
                  <>
                    <div style={{ background: "var(--surface-alt)", borderRadius: "var(--radius-sm)", padding: "1rem", marginBottom: "1.25rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Selected Plan</span>
                        <span style={{ fontFamily: "Poppins", fontWeight: 700, color: "var(--primary)", fontSize: "1.25rem" }}>₹{plan.price}</span>
                      </div>
                      <p style={{ fontWeight: 600, color: "var(--text)", marginTop: "0.25rem" }}>{plan.label}</p>
                      <p style={{ fontSize: "0.8rem", color: "var(--secondary)", marginTop: "0.25rem" }}>₹{plan.perMeal}/meal</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.25rem" }}>
                      {[
                        { label: "Delivery Slots", value: firstSlot },
                        { label: "Service Area", value: firstArea },
                        { label: "Response Time", value: cook.responseTime || "Under 30 min" },
                      ].map(({ label, value }) => (
                        <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                          <span style={{ color: "var(--text-muted)" }}>{label}</span>
                          <span style={{ fontWeight: 500, color: "var(--text)" }}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}

              <Link
                href={`/checkout?cook=${cook.id}&plan=${selectedPlan}`}
                id="subscribe-now-btn"
                className="btn btn-primary"
                style={{ width: "100%", justifyContent: "center", marginBottom: "0.75rem" }}
              >
                Subscribe Now
              </Link>
              <a
                id="contact-cook-btn"
                href={`https://wa.me/919876543210?text=${encodeURIComponent(
                  `Hello ${cook.kitchenName}, I found your tiffin service on HomeFeast and would like to ask a few questions before ordering.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
                style={{ width: "100%", justifyContent: "center", textDecoration: "none" }}
              >
                <Phone size={16} /> Contact Cook via WhatsApp
              </a>

              <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "1rem" }}>
                🔒 Secure · No hidden charges · Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Toast */}
      {toastMsg && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: "var(--surface)",
            color: "var(--text)",
            border: "1.5px solid var(--border)",
            padding: "0.75rem 1.25rem",
            borderRadius: "10px",
            fontSize: "0.875rem",
            fontWeight: 600,
            zIndex: 9999,
            boxShadow: "var(--shadow-lg)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <CheckCircle size={16} color="var(--secondary)" />
          {toastMsg}
        </div>
      )}
    </div>
  );
}
