"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Star,
  ChevronRight,
  CheckCircle,
  Smartphone,
  ShieldCheck,
  Clock,
  ChefHat,
  Leaf,
  TrendingUp,
  ArrowRight,
  Play,
  Quote,
  Plus,
  Minus,
} from "lucide-react";
import { COOKS, TESTIMONIALS, STATS, FAQS, CUISINES, CITIES } from "@/lib/mockData";

// ── How It Works Steps ───────────────────────────────────────
const HOW_IT_WORKS = [
  {
    step: "01",
    icon: Search,
    title: "Find Your Cook",
    desc: "Browse verified home cooks near you. Filter by cuisine, diet, price, and meal plan.",
    color: "var(--primary)",
  },
  {
    step: "02",
    icon: ChefHat,
    title: "Choose a Plan",
    desc: "Pick daily, weekly, or monthly tiffin plan that fits your schedule and budget.",
    color: "var(--secondary)",
  },
  {
    step: "03",
    icon: Clock,
    title: "Fresh Delivery",
    desc: "Your cook prepares fresh food and delivers at your chosen time slot, every day.",
    color: "var(--accent)",
  },
];

// ── Plans Section Data ────────────────────────────────────────
const PLAN_FEATURES = [
  { feature: "Daily fresh meals", daily: true, weekly: true, monthly: true },
  { feature: "Home delivery", daily: true, weekly: true, monthly: true },
  { feature: "Veg / Non-veg choice", daily: true, weekly: true, monthly: true },
  { feature: "Skip meals", daily: false, weekly: true, monthly: true },
  { feature: "Pause subscription", daily: false, weekly: false, monthly: true },
  { feature: "Weekend specials", daily: false, weekly: true, monthly: true },
  { feature: "Priority support", daily: false, weekly: false, monthly: true },
];

// ── Star Rating Component ─────────────────────────────────────
function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={14}
          fill={n <= Math.round(rating) ? "var(--accent)" : "none"}
          style={{ color: n <= Math.round(rating) ? "var(--accent)" : "var(--border)" }}
        />
      ))}
    </div>
  );
}

// ── Cook Card ─────────────────────────────────────────────────
function CookCard({ cook }: { cook: (typeof COOKS)[0] }) {
  return (
    <Link href={`/cooks/${cook.id}`} style={{ textDecoration: "none" }}>
      <div className="cook-card">
        {/* Cover Image */}
        <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
          <img
            src={cook.coverImage}
            alt={cook.kitchenName}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              display: "flex",
              gap: "0.375rem",
            }}
          >
            <span className={`badge ${cook.isVeg ? "badge-veg" : "badge-nonveg"}`}>
              <span className={cook.isVeg ? "veg-dot" : "nonveg-dot"} />
              {cook.isVeg ? "Pure Veg" : "Non-Veg"}
            </span>
          </div>
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              background: "rgba(0,0,0,0.7)",
              color: "white",
              borderRadius: "8px",
              padding: "0.25rem 0.5rem",
              fontSize: "0.8125rem",
              fontWeight: 700,
              fontFamily: "Poppins",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Star size={12} fill="var(--accent)" style={{ color: "var(--accent)" }} />
            {cook.rating}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.5rem" }}>
            <img
              src={cook.avatar}
              alt={cook.name}
              style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--border)" }}
            />
            <div>
              <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1rem", color: "var(--text)", margin: 0 }}>
                {cook.kitchenName}
              </h3>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: 0 }}>{cook.name}</p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.75rem" }}>
            <MapPin size={13} style={{ color: "var(--primary)", flexShrink: 0 }} />
            <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{cook.area}</span>
          </div>

          <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap", marginBottom: "0.875rem" }}>
            {cook.cuisines.map((c) => {
              const cuisine = CUISINES.find((x) => x.id === c);
              return cuisine ? (
                <span key={c} className="badge" style={{ background: "var(--surface-alt)", color: "var(--text-muted)", fontSize: "0.7375rem" }}>
                  {cuisine.emoji} {cuisine.name}
                </span>
              ) : null;
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.125rem", color: "var(--primary)" }}>
                ₹{Math.min(...cook.plans.map((p) => p.price))}
              </span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>/day onwards</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Stars rating={cook.rating} />
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>({cook.totalReviews})</span>
            </div>
          </div>

          <div
            style={{
              marginTop: "0.875rem",
              padding: "0.625rem",
              background: "var(--surface-alt)",
              borderRadius: "8px",
              fontSize: "0.8125rem",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Clock size={13} style={{ color: "var(--secondary)" }} />
            {cook.deliverySlots[0]}
            {cook.deliverySlots[1] && ` · ${cook.deliverySlots[1]}`}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── FAQ Item ──────────────────────────────────────────────────
function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        border: "1.5px solid var(--border)",
        borderRadius: "var(--radius)",
        overflow: "hidden",
        transition: "border-color 0.2s ease",
        borderColor: open ? "var(--primary)" : "var(--border)",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        id={`faq-${index}`}
        aria-expanded={open}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.25rem",
          background: open ? "var(--surface-alt)" : "var(--surface)",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          gap: "1rem",
        }}
      >
        <span style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: "1rem", color: "var(--text)" }}>{q}</span>
        {open ? (
          <Minus size={18} style={{ color: "var(--primary)", flexShrink: 0 }} />
        ) : (
          <Plus size={18} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
        )}
      </button>
      {open && (
        <div
          style={{
            padding: "0 1.25rem 1.25rem",
            background: "var(--surface-alt)",
            color: "var(--text-muted)",
            fontSize: "0.9375rem",
            lineHeight: 1.7,
            animation: "fadeInUp 0.2s ease",
          }}
        >
          {a}
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function HomePage() {
  const [searchCity, setSearchCity] = useState("");
  const [searchMealType, setSearchMealType] = useState("all");

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section
        className="hero-gradient"
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "5rem 0 6rem",
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Decorative blobs */}
        <div
          className="hero-blob"
          style={{ width: 500, height: 500, background: "var(--primary)", top: -100, right: -100 }}
        />
        <div
          className="hero-blob"
          style={{ width: 300, height: 300, background: "var(--secondary)", bottom: -50, left: -50, animationDelay: "3s" }}
        />

        <div className="container-custom" style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "3rem",
              alignItems: "center",
            }}
          >
            {/* Left Content */}
            <div>
              <div className="section-tag animate-fadeInUp">
                🍱 India's Trusted Homemade Food Platform
              </div>

              <h1
                className="animate-fadeInUp delay-100"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
                  fontWeight: 800,
                  color: "var(--text)",
                  marginBottom: "1.25rem",
                  lineHeight: 1.15,
                }}
              >
                Fresh{" "}
                <span style={{ color: "var(--primary)", position: "relative" }}>
                  Homemade
                  <svg style={{ position: "absolute", bottom: -6, left: 0, width: "100%" }} viewBox="0 0 200 12" fill="none">
                    <path d="M2 8 C50 2, 150 2, 198 8" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
                  </svg>
                </span>{" "}
                Meals,{" "}
                <span style={{ color: "var(--secondary)" }}>Delivered Daily</span>
              </h1>

              <p
                className="animate-fadeInUp delay-200"
                style={{
                  fontSize: "1.125rem",
                  color: "var(--text-muted)",
                  marginBottom: "2rem",
                  lineHeight: 1.8,
                  maxWidth: 480,
                }}
              >
                Connect with verified home cooks near you offering hygienic, affordable,
                and nutritious tiffin subscriptions — for students, professionals, and elderly alike.
              </p>

              {/* Trust Badges */}
              <div
                className="animate-fadeInUp delay-300"
                style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "2rem" }}
              >
                {[
                  { icon: ShieldCheck, text: "FSSAI Verified Cooks" },
                  { icon: Clock, text: "On-Time Delivery" },
                  { icon: Leaf, text: "Healthy & Hygienic" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Icon size={16} style={{ color: "var(--secondary)" }} />
                    <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-muted)" }}>{text}</span>
                  </div>
                ))}
              </div>

              {/* Search Bar */}
              <div className="animate-fadeInUp delay-400">
                <div
                  style={{
                    background: "var(--surface)",
                    border: "2px solid var(--border)",
                    borderRadius: "var(--radius)",
                    padding: "0.5rem",
                    display: "flex",
                    gap: "0.5rem",
                    boxShadow: "var(--shadow-lg)",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1, padding: "0 0.5rem" }}>
                    <MapPin size={18} style={{ color: "var(--primary)" }} />
                    <select
                      id="hero-city-select"
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                      style={{
                        flex: 1,
                        border: "none",
                        background: "transparent",
                        color: "var(--text)",
                        fontSize: "1rem",
                        outline: "none",
                        cursor: "pointer",
                        fontFamily: "Inter, sans-serif",
                      }}
                      aria-label="Select city"
                    >
                      <option value="">All Cities</option>
                      {CITIES.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ width: "1px", background: "var(--border)", alignSelf: "stretch" }} />
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1, padding: "0 0.5rem" }}>
                    <ChefHat size={18} style={{ color: "var(--primary)" }} />
                    <select
                      id="hero-mealtype-select"
                      value={searchMealType}
                      onChange={(e) => setSearchMealType(e.target.value)}
                      style={{
                        flex: 1,
                        border: "none",
                        background: "transparent",
                        color: "var(--text)",
                        fontSize: "1rem",
                        outline: "none",
                        cursor: "pointer",
                        fontFamily: "Inter, sans-serif",
                      }}
                      aria-label="Select meal type"
                    >
                      <option value="all">All Meals</option>
                      <option value="veg">Veg Only</option>
                      <option value="nonveg">Non-Veg</option>
                      <option value="jain">Jain</option>
                    </select>
                  </div>
                  <Link
                    href={`/search?city=${searchCity}&type=${searchMealType}`}
                    id="hero-search-btn"
                    className="btn btn-primary"
                    style={{ borderRadius: "10px", padding: "0.75rem 1.5rem", flexShrink: 0 }}
                  >
                    <Search size={18} />
                    Search Cooks
                  </Link>
                </div>

                {/* Quick Links */}
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.875rem", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>Popular:</span>
                  {CITIES.slice(0, 2).map((c) => (
                    <Link
                      key={c.id}
                      href={`/search?city=${c.id}`}
                      style={{
                        fontSize: "0.8125rem",
                        color: "var(--primary)",
                        fontWeight: 500,
                        borderBottom: "1px dashed var(--primary)",
                      }}
                    >
                      {c.name}
                    </Link>
                  ))}
                  {CUISINES.slice(0, 3).map((c) => (
                    <Link
                      key={c.id}
                      href={`/search?cuisine=${c.id}`}
                      style={{
                        fontSize: "0.8125rem",
                        color: "var(--primary)",
                        fontWeight: 500,
                        borderBottom: "1px dashed var(--primary)",
                      }}
                    >
                      {c.emoji} {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right – Hero Image Stack */}
            <div
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
              }}
              className="hide-mobile"
            >
              {/* Main food image */}
              <div
                style={{
                  width: 420,
                  height: 420,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "6px solid var(--surface)",
                  boxShadow: "var(--shadow-lg)",
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&q=80"
                  alt="Fresh homemade tiffin meals"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              {/* Floating cards */}
              <div
                style={{
                  position: "absolute",
                  top: 30,
                  left: -20,
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  padding: "0.875rem 1rem",
                  boxShadow: "var(--shadow-lg)",
                  animation: "fadeInUp 1s ease 0.5s both",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--secondary)", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                    <CheckCircle size={18} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text)", margin: 0 }}>FSSAI Verified</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>350+ Trusted Cooks</p>
                  </div>
                </div>
              </div>

              <div
                style={{
                  position: "absolute",
                  bottom: 30,
                  right: -10,
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  padding: "0.875rem 1rem",
                  boxShadow: "var(--shadow-lg)",
                  animation: "fadeInUp 1s ease 0.8s both",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                  <div style={{ fontSize: "1.5rem" }}>⭐</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text)", margin: 0 }}>4.8 / 5.0</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>12,000+ Reviews</p>
                  </div>
                </div>
              </div>

              <div
                style={{
                  position: "absolute",
                  bottom: 120,
                  left: -30,
                  background: "var(--primary)",
                  color: "white",
                  borderRadius: "12px",
                  padding: "0.875rem 1rem",
                  boxShadow: "var(--shadow-lg)",
                  animation: "fadeInUp 1s ease 1.1s both",
                }}
              >
                <p style={{ fontWeight: 700, fontSize: "0.875rem", margin: 0 }}>₹100/meal</p>
                <p style={{ fontSize: "0.75rem", opacity: 0.85, margin: 0 }}>Starting Price</p>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @media (max-width: 768px) {
            .hide-mobile { display: none; }
          }
        `}</style>
      </section>

      {/* ===== STATS BAR ===== */}
      <section style={{ background: "var(--primary)", padding: "2rem 0" }}>
        <div className="container-custom">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", textAlign: "center" }}>
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>{stat.icon}</div>
                <div style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.75rem", color: "white" }}>{stat.value}</div>
                <div style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        <style jsx>{`
          @media (max-width: 640px) {
            div { grid-template-columns: repeat(2, 1fr) !important; }
          }
        `}</style>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="section" style={{ background: "var(--bg)" }}>
        <div className="container-custom">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="section-tag" style={{ display: "inline-flex" }}>✨ Simple & Easy</div>
            <h2 style={{ fontFamily: "Poppins", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 800, color: "var(--text)", marginBottom: "1rem" }}>
              How HomeFeast Works
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "1.0625rem", maxWidth: 560, margin: "0 auto" }}>
              Three simple steps to get fresh, homemade food at your doorstep.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem", position: "relative" }}>
            {/* Connecting line */}
            <div
              style={{
                position: "absolute",
                top: 60,
                left: "16.67%",
                right: "16.67%",
                height: 2,
                background: "linear-gradient(to right, var(--primary), var(--secondary))",
                opacity: 0.2,
                zIndex: 0,
              }}
              aria-hidden="true"
            />

            {HOW_IT_WORKS.map((step, i) => (
              <div
                key={step.step}
                style={{
                  textAlign: "center",
                  padding: "2rem 1.5rem",
                  background: "var(--surface)",
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--border)",
                  position: "relative",
                  zIndex: 1,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: `${step.color}18`,
                    border: `2px solid ${step.color}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem",
                  }}
                >
                  <step.icon size={30} style={{ color: step.color }} />
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: -16,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: step.color,
                    color: "white",
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "Poppins",
                    fontWeight: 800,
                    fontSize: "0.875rem",
                    boxShadow: `0 4px 12px ${step.color}40`,
                  }}
                >
                  {i + 1}
                </div>
                <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.125rem", color: "var(--text)", marginBottom: "0.75rem" }}>
                  {step.title}
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem", lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <style jsx>{`
          @media (max-width: 768px) {
            div[style*="grid-template-columns: repeat(3"] { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* ===== FEATURED COOKS ===== */}
      <section className="section" style={{ background: "var(--surface-alt)" }}>
        <div className="container-custom">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div className="section-tag">👨‍🍳 Top Rated</div>
              <h2 style={{ fontFamily: "Poppins", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, color: "var(--text)" }}>
                Featured Home Cooks
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "1rem", marginTop: "0.5rem" }}>
                Verified, FSSAI-certified cooks delivering meals with love.
              </p>
            </div>
            <Link href="/search" className="btn btn-outline" id="view-all-cooks-btn">
              View All Cooks <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {COOKS.map((cook) => (
              <CookCard key={cook.id} cook={cook} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== PLANS SECTION ===== */}
      <section id="plans" className="section" style={{ background: "var(--bg)" }}>
        <div className="container-custom">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="section-tag" style={{ display: "inline-flex" }}>💰 Affordable Plans</div>
            <h2 style={{ fontFamily: "Poppins", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 800, color: "var(--text)", marginBottom: "1rem" }}>
              Choose Your Meal Plan
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "1.0625rem", maxWidth: 560, margin: "0 auto" }}>
              Flexible plans to match your lifestyle. Starting from just ₹83/meal.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", maxWidth: 900, margin: "0 auto" }}>
            {[
              { type: "Daily", price: "₹100–150", perMeal: "₹100–150", period: "/day", savings: null, popular: false },
              { type: "Weekly", price: "₹649–949", perMeal: "₹93–136", period: "/week", savings: "Save up to 11%", popular: true },
              { type: "Monthly", price: "₹2,499–3,599", perMeal: "₹83–120", period: "/month", savings: "Save up to 17%", popular: false },
            ].map((plan) => (
              <div
                key={plan.type}
                className={`plan-card${plan.popular ? " popular" : ""}`}
                style={{ textAlign: "center" }}
              >
                <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.25rem", color: "var(--text)", marginBottom: "0.5rem" }}>
                  {plan.type}
                </h3>
                <div style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.75rem", color: "var(--primary)", marginBottom: "0.25rem" }}>
                  {plan.price}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>{plan.period}</div>
                <div style={{ fontSize: "0.875rem", color: "var(--secondary)", fontWeight: 600, marginBottom: "1.5rem", minHeight: 20 }}>
                  {plan.savings || " "}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "1.5rem", textAlign: "left" }}>
                  {PLAN_FEATURES.map((f) => {
                    const enabled =
                      plan.type === "Monthly" ? f.monthly : plan.type === "Weekly" ? f.weekly : f.daily;
                    return (
                      <div key={f.feature} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <CheckCircle
                          size={16}
                          style={{ color: enabled ? "var(--secondary)" : "var(--border)", flexShrink: 0 }}
                          fill={enabled ? "var(--secondary)" : "none"}
                        />
                        <span style={{ fontSize: "0.875rem", color: enabled ? "var(--text)" : "var(--text-muted)", opacity: enabled ? 1 : 0.6 }}>
                          {f.feature}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <Link
                  href="/search"
                  className={`btn ${plan.popular ? "btn-primary" : "btn-outline"}`}
                  style={{ width: "100%", justifyContent: "center" }}
                  id={`plan-${plan.type.toLowerCase()}-cta`}
                >
                  Get {plan.type} Plan
                </Link>
              </div>
            ))}
          </div>
        </div>
        <style jsx>{`
          @media (max-width: 768px) {
            div[style*="repeat(3, 1fr)"] { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section" style={{ background: "var(--surface-alt)" }}>
        <div className="container-custom">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="section-tag" style={{ display: "inline-flex" }}>❤️ Happy Customers</div>
            <h2 style={{ fontFamily: "Poppins", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 800, color: "var(--text)" }}>
              What Our Community Says
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="card"
                style={{ padding: "1.75rem" }}
              >
                <Quote size={28} style={{ color: "var(--primary)", opacity: 0.3, marginBottom: "1rem" }} />
                <p style={{ fontSize: "0.9375rem", color: "var(--text-muted)", lineHeight: 1.75, marginBottom: "1.25rem", fontStyle: "italic" }}>
                  "{t.quote}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <img
                    src={t.avatar}
                    alt={t.name}
                    style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--border)" }}
                  />
                  <div>
                    <p style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "0.9375rem", color: "var(--text)", margin: 0 }}>{t.name}</p>
                    <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: 0 }}>{t.role} · {t.city}</p>
                  </div>
                  <div style={{ marginLeft: "auto" }}>
                    <Stars rating={t.rating} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BECOME A COOK CTA ===== */}
      <section
        className="section"
        style={{
          background: "linear-gradient(135deg, var(--primary) 0%, #FF6B00 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle at 70% 50%, rgba(255,255,255,0.1) 0%, transparent 60%)",
          }}
          aria-hidden="true"
        />
        <div className="container-custom" style={{ position: "relative", textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(255,255,255,0.2)",
              color: "white",
              padding: "0.375rem 1rem",
              borderRadius: "var(--radius-pill)",
              fontSize: "0.8125rem",
              fontWeight: 600,
              marginBottom: "1.25rem",
            }}
          >
            <TrendingUp size={14} /> Cook Partner Program
          </div>
          <h2
            style={{
              fontFamily: "Poppins",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 800,
              color: "white",
              marginBottom: "1rem",
            }}
          >
            Love to Cook? Earn from Home!
          </h2>
          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.125rem", maxWidth: 560, margin: "0 auto 2rem" }}>
            Join 350+ home cooks earning ₹15,000–₹35,000/month. Register, get verified,
            and start accepting subscriptions from your city.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <Link
              href="/cook/register"
              id="become-cook-cta"
              style={{
                background: "white",
                color: "var(--primary)",
                fontFamily: "Poppins",
                fontWeight: 700,
                padding: "0.875rem 2rem",
                borderRadius: "var(--radius-pill)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <ChefHat size={18} /> Start Cooking for HomeFeast
            </Link>
            <Link
              href="/about"
              style={{
                border: "2px solid rgba(255,255,255,0.5)",
                color: "white",
                fontFamily: "Poppins",
                fontWeight: 600,
                padding: "0.875rem 2rem",
                borderRadius: "var(--radius-pill)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <Play size={16} /> Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="section" style={{ background: "var(--bg)" }}>
        <div className="container-custom" style={{ maxWidth: 760 }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="section-tag" style={{ display: "inline-flex" }}>🙋 Common Questions</div>
            <h2 style={{ fontFamily: "Poppins", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, color: "var(--text)" }}>
              Frequently Asked Questions
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {FAQS.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>Still have questions?</p>
            <Link href="/contact" className="btn btn-outline" id="contact-us-btn">
              Contact Us <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== MOBILE BOTTOM NAV ===== */}
      <nav className="mobile-nav" aria-label="Mobile navigation">
        <Link href="/" className="mobile-nav-item active">
          <ChefHat size={20} /> <span>Home</span>
        </Link>
        <Link href="/search" className="mobile-nav-item">
          <Search size={20} /> <span>Search</span>
        </Link>
        <Link href="/auth/login" className="mobile-nav-item">
          <Smartphone size={20} /> <span>Orders</span>
        </Link>
        <Link href="/auth/login" className="mobile-nav-item">
          <Star size={20} /> <span>Profile</span>
        </Link>
      </nav>
    </>
  );
}
