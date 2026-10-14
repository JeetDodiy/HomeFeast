"use client";
import { useState } from "react";
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
import { COOKS, REVIEWS, CUISINES } from "@/lib/mockData";

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
  const cook = COOKS.find((c) => c.id === id);
  if (!cook) notFound();

  const cookReviews = REVIEWS.filter((r) => r.cookId === cook.id);
  const [activeTab, setActiveTab] = useState<"menu" | "plans" | "reviews">("menu");
  const [selectedDay, setSelectedDay] = useState<string>(Object.keys(cook.weeklyMenu)[0]);
  const [selectedPlan, setSelectedPlan] = useState<string>(cook.plans.find((p) => p.popular)?.id || cook.plans[0].id);
  const days = Object.keys(cook.weeklyMenu);

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
        <img src={cook.coverImage} alt={cook.kitchenName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7))" }} />
        <div style={{ position: "absolute", top: 16, right: 16, display: "flex", gap: "0.5rem" }}>
          <button id="save-cook-btn" className="btn btn-ghost" style={{ background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "10px", padding: "0.5rem", width: 40, height: 40 }} aria-label="Save cook">
            <Heart size={18} />
          </button>
          <button className="btn btn-ghost" style={{ background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "10px", padding: "0.5rem", width: 40, height: 40 }} aria-label="Share">
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
                  src={cook.avatar}
                  alt={cook.name}
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
                  <p style={{ color: "var(--text-muted)", marginBottom: "0.75rem" }}>by {cook.name} · Member since {cook.memberSince}</p>
                  <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                      <Stars rating={cook.rating} size={16} />
                      <span style={{ fontWeight: 700, color: "var(--text)" }}>{cook.rating}</span>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>({cook.totalReviews} reviews)</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                      <MapPin size={14} style={{ color: "var(--primary)" }} />
                      {cook.area}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                      <UtensilsCrossed size={14} style={{ color: "var(--secondary)" }} />
                      {cook.totalOrders.toLocaleString()} orders served
                    </div>
                  </div>
                </div>
              </div>

              <p style={{ marginTop: "1rem", color: "var(--text-muted)", lineHeight: 1.75 }}>{cook.bio}</p>

              {/* Tags */}
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "1rem" }}>
                {cook.cuisines.map((c) => {
                  const cuisine = CUISINES.find((x) => x.id === c);
                  return cuisine ? (
                    <span key={c} className="badge" style={{ background: "var(--surface-alt)", color: "var(--text-muted)" }}>
                      {cuisine.emoji} {cuisine.name}
                    </span>
                  ) : null;
                })}
                <span className="badge" style={{ background: "rgba(47,125,79,0.1)", color: "var(--secondary)" }}>
                  <Shield size={11} /> FSSAI #{cook.fssaiNo}
                </span>
              </div>
            </div>

            {/* Info Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
              {[
                { icon: Clock, label: "Response Time", value: cook.responseTime, color: "var(--info)" },
                { icon: Calendar, label: "Delivery Slots", value: cook.deliverySlots.join(", "), color: "var(--secondary)" },
                { icon: MapPin, label: "Service Areas", value: cook.serviceAreas.slice(0, 2).join(", ") + (cook.serviceAreas.length > 2 ? ` +${cook.serviceAreas.length - 2} more` : ""), color: "var(--primary)" },
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
                      {(cook.weeklyMenu as Record<string, string[]>)[selectedDay]?.map((item: string, i: number) => (
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
                          <span className={cook.isVeg ? "veg-dot" : "nonveg-dot"} />
                          <span style={{ fontSize: "0.9375rem", color: "var(--text)", fontWeight: 500 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Plans Tab */}
                {activeTab === "plans" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {cook.plans.map((plan) => (
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
                          {plan.includes.map((item: string) => (
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
                                <p style={{ fontWeight: 600, color: "var(--text)", margin: 0 }}>{r.userName}</p>
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
                const plan = cook.plans.find((p) => p.id === selectedPlan) || cook.plans[0];
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
                        { label: "Delivery Slots", value: cook.deliverySlots[0] },
                        { label: "Service Area", value: `${cook.serviceAreas[0]} & nearby` },
                        { label: "Response Time", value: cook.responseTime },
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
              <button
                id="contact-cook-btn"
                className="btn btn-ghost"
                style={{ width: "100%", justifyContent: "center" }}
              >
                <Phone size={16} /> Contact Cook
              </button>

              <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "1rem" }}>
                🔒 Secure · No hidden charges · Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
