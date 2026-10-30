"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ChefHat,
  ShieldCheck,
  CheckCircle,
  Upload,
  ArrowRight,
  TrendingUp,
  Clock,
  Award,
  Users,
  Utensils,
  Sparkles,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import { CITIES, CUISINES } from "@/lib/mockData";

export default function CookRegisterPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    kitchenName: "",
    phone: "",
    email: "",
    city: "Rajkot",
    area: "",
    pincode: "",
    address: "",
    cuisines: [] as string[],
    isVegOnly: true,
    capacity: "20-50 meals/day",
    deliverySlots: ["Lunch (12–1 PM)"],
    experienceYears: "5",
    fssaiStatus: "have_fssai",
    fssaiNo: "",
    password: "",
    confirmPassword: "",
    hygieneDeclaration: false,
    termsAccepted: false,
  });

  const toggleCuisine = (cuisineId: string) => {
    setFormData((prev) => {
      const exists = prev.cuisines.includes(cuisineId);
      return {
        ...prev,
        cuisines: exists
          ? prev.cuisines.filter((c) => c !== cuisineId)
          : [...prev.cuisines, cuisineId],
      };
    });
  };

  const toggleSlot = (slot: string) => {
    setFormData((prev) => {
      const exists = prev.deliverySlots.includes(slot);
      return {
        ...prev,
        deliverySlots: exists
          ? prev.deliverySlots.filter((s) => s !== slot)
          : [...prev.deliverySlots, slot],
      };
    });
  };

  const [regError, setRegError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");

    if (!formData.fullName.trim() || !formData.kitchenName.trim() || !formData.phone.trim()) {
      setRegError("Please fill in your name, kitchen name, and phone number.");
      setStep(1);
      return;
    }

    const cleanPhone = formData.phone.replace(/[\s\-\+]/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setRegError("Please enter a valid 10-digit Indian phone number.");
      setStep(1);
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setRegError("Passwords do not match.");
      setStep(1);
      return;
    }
    if (formData.password && formData.password.length < 8) {
      setRegError("Password must be at least 8 characters.");
      setStep(1);
      return;
    }

    if (formData.fssaiStatus === "have_fssai" && formData.fssaiNo.trim()) {
      const cleanFssai = formData.fssaiNo.replace(/\D/g, "");
      if (cleanFssai.length !== 14) {
        setRegError("FSSAI license number must be exactly 14 numeric digits.");
        return;
      }
    }

    const cookShopName = formData.kitchenName.trim();
    const cookChefName = formData.fullName.trim();
    const cookEmail = formData.email.trim().toLowerCase() || `${cleanPhone}@homefeast.cook`;

    const publicCookId = `c_${cookChefName.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${Date.now().toString().slice(-4)}`;
    const publicCookRecord = {
      id: publicCookId,
      email: cookEmail,
      kitchenName: cookShopName,
      name: cookChefName,
      bio: `Fresh homemade meals cooked with passion and hygiene by Chef ${cookChefName}. Serving wholesome authentic tiffins across ${formData.city || "Rajkot"}.`,
      photos: [
        "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&q=80",
        "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80",
      ],
      coverImage: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&q=80",
      avatar: "https://randomuser.me/api/portraits/men/33.jpg",
      fssaiNo: formData.fssaiNo || `100200${Math.floor(10000000 + Math.random() * 90000000)}`,
      cuisines: formData.isVegOnly ? ["gujarati", "kathiyawadi", "jain"] : ["gujarati", "punjabi"],
      city: formData.city || "Rajkot",
      area: formData.area ? `${formData.area}, ${formData.city || "Rajkot"}` : `Main Road, ${formData.city || "Rajkot"}`,
      pincode: formData.pincode || "360005",
      rating: 5.0,
      totalReviews: 0,
      deliverySlots: formData.deliverySlots.length > 0 ? formData.deliverySlots : ["Lunch (12–1:30 PM)", "Dinner (7:30–9 PM)"],
      serviceAreas: [formData.area || "City Center", "University Road", "Kalavad Road", "150 Feet Ring Road"],
      status: "pending", // PENDING APPROVAL: hidden from customer search until approved
      isOpen: false,
      isVeg: formData.isVegOnly !== undefined ? formData.isVegOnly : true,
      totalOrders: 0,
      responseTime: "Under 25 min",
      memberSince: "2024",
      plans: [
        {
          id: `p_${publicCookId}_daily`,
          type: "daily",
          label: "Daily Kathiyawadi Plan",
          price: 120,
          perMeal: 120,
          description: "Fresh homemade tiffin every day. 1 Desi Sabzi, Kadhi, 4 Phulka Rotis / Rotlo, Rice & Salad.",
          includes: ["1 Desi Sabzi", "Dal/Kadhi", "4 Phulkas or 2 Rotla", "Rice/Khichdi", "Chutney & Buttermilk"],
        },
        {
          id: `p_${publicCookId}_weekly`,
          type: "weekly",
          label: "Weekly Saver Plan",
          price: 749,
          perMeal: 107,
          description: "7-day rotating homemade plan with Sunday special thali and sweet. Save 11%.",
          includes: ["Daily variety thali", "Dal/Kadhi", "Fresh Rotis/Rotlo", "Rice & Salad", "Weekend Dessert"],
          popular: true,
        },
        {
          id: `p_${publicCookId}_monthly`,
          type: "monthly",
          label: "Monthly Royal Plan",
          price: 2799,
          perMeal: 93,
          description: "30-day complete meal plan. Pause up to 5 days anytime with rollover.",
          includes: ["Full Royal Thali", "Special Sunday Desserts", "5 Flexible Pause Days", "Free Priority Delivery"],
        },
      ],
      weeklyMenu: {
        Monday: ["Sev Tameta Nu Shaak", "Bhindi Masala", "Phulka Rotis", "Gujarati Kadhi", "Jeera Rice"],
        Tuesday: ["Kathiyawadi Ringan No Olo", "Bajra No Rotlo with Makhan", "Desi Kadhi", "Vaghareli Khichdi"],
        Wednesday: ["Surti Undhiyu", "Puri / Phulkas", "Dal Fry", "Vegetable Pulao", "Jalebi (2 pcs)"],
        Thursday: ["Gatta Nu Shaak", "Aloo Gobi Matar", "Phulka Rotis", "Toor Dal Fry", "Steamed Rice"],
        Friday: ["Lasaniya Batata", "Gujarati Bhakri", "Desi Chhach", "Plain Khichdi", "Garlic Chutney"],
        Saturday: ["Chole Masala", "Bhature / Phulkas", "Dal Tadka", "Peas Pulao", "Sweet Lassi"],
        Sunday: ["Royal Kathiyawadi Thali", "Bajra Rotlo", "Special Dal", "Basundi with Dry Fruits"],
      },
    };

    // 1. Submit to /api/v1/cooks so PostgreSQL creates or links the cook record with status PENDING
    try {
      await fetch("/api/v1/cooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...publicCookRecord,
          password: formData.password || undefined,
        }),
      });
    } catch (err) {
      console.warn("Cook registration error:", err);
    }

    // 2. Persist in local storage without auto-logging in
    if (typeof window !== "undefined") {
      try {
        const cleanUserKey = cookEmail.replace(/[^a-z0-9]/g, "_");
        localStorage.setItem(`hf_cook_subscribers_${cleanUserKey}`, JSON.stringify([]));
        localStorage.setItem(`hf_cook_orders_${cleanUserKey}`, JSON.stringify([]));
        localStorage.setItem("hf_cook_subscribers", JSON.stringify([]));
        localStorage.setItem("hf_cook_orders", JSON.stringify([]));

        const existingRegistered = JSON.parse(localStorage.getItem("hf_registered_cooks") || "[]");
        const filteredRegistered = existingRegistered.filter((c: any) => c.kitchenName !== cookShopName);
        localStorage.setItem("hf_registered_cooks", JSON.stringify([publicCookRecord, ...filteredRegistered]));

        // Note: Do NOT auto-login here. Keep session unauthenticated until user logs in at /auth/login.
      } catch (e) {
        console.warn("Storage sync error:", e);
      }
    }

    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "85vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem", background: "var(--bg)" }}>
        <div className="card" style={{ maxWidth: 640, width: "100%", padding: "2.75rem", textAlign: "center" }}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: "50%",
              background: "rgba(232, 101, 10, 0.12)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
            }}
          >
            <Clock size={44} />
          </div>

          <span className="badge badge-pending" style={{ marginBottom: "0.875rem", display: "inline-block", fontSize: "0.85rem", padding: "0.4rem 0.85rem" }}>
            ⏳ Application Submitted — Pending Admin Review
          </span>

          <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.75rem", color: "var(--text)", marginBottom: "0.75rem" }}>
            Application Received, Chef {formData.fullName}!
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            Your kitchen <strong>{formData.kitchenName}</strong> in <strong>{formData.city}</strong> has been registered.
            To protect food quality and ensure trust, <strong>your kitchen will go LIVE after Admin Approval</strong>.
          </p>

          <div style={{ background: "var(--surface-alt)", borderRadius: "var(--radius)", padding: "1.25rem", textAlign: "left", marginBottom: "1.75rem", border: "1px solid var(--border)" }}>
            <h4 style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text)", marginBottom: "0.5rem" }}>
              What Happens Next:
            </h4>
            <ul style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.8, paddingLeft: "1.25rem", margin: 0 }}>
              <li><strong>Admin Review:</strong> Our compliance team verifies your FSSAI details & kitchen setup.</li>
              <li><strong>Pre-Configure Dashboard:</strong> You can already set up your dishes, prices, and weekly menu.</li>
              <li><strong>Live Activation:</strong> Once approved in the Admin Console, your kitchen status becomes <strong>Active & LIVE</strong> to all customers!</li>
              <li><strong>Login Credentials:</strong> You can sign in anytime using <strong>{formData.email || formData.phone}</strong> and your chosen password.</li>
            </ul>
          </div>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/auth/login" className="btn btn-primary" style={{ padding: "0.75rem 1.75rem" }}>
              Go to Login →
            </Link>
            <Link href="/" className="btn btn-ghost" style={{ padding: "0.75rem 1.75rem" }}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "2.5rem 0 5rem" }}>
      <div className="container-custom">
        {/* Header Hero */}
        <div style={{ textAlign: "center", maxWidth: 760, margin: "0 auto 3rem" }}>
          <div className="badge badge-primary" style={{ marginBottom: "1rem" }}>
            <Sparkles size={14} /> Partner With HomeFeast
          </div>
          <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 2.75rem)", color: "var(--text)", marginBottom: "1rem" }}>
            Turn Your Home Kitchen Into a Thriving Business
          </h1>
          <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
            Join 350+ verified home cooks earning ₹25,000 – ₹60,000 every month. We connect you with daily hungry subscribers while you cook what you love.
          </p>
        </div>

        {/* Benefits Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "3.5rem" }}>
          {[
            { icon: TrendingUp, title: "Guaranteed Monthly Income", desc: "Subscribers pay upfront weekly/monthly. No fluctuating daily order surprises." },
            { icon: Users, title: "Zero Marketing Headache", desc: "We bring students and professionals directly to your kitchen listing." },
            { icon: Clock, title: "Cook on Your Schedule", desc: "You decide your lunch & dinner delivery timings and daily tiffin capacities." },
            { icon: ShieldCheck, title: "100% Legal & FSSAI Support", desc: "Our team helps you obtain or renew your FSSAI registration easily." },
          ].map((item, idx) => (
            <div key={idx} className="card" style={{ padding: "1.5rem" }}>
              <div style={{ width: 44, height: 44, borderRadius: "10px", background: "rgba(232, 101, 10, 0.1)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                <item.icon size={22} />
              </div>
              <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.0625rem", color: "var(--text)", marginBottom: "0.5rem" }}>
                {item.title}
              </h3>
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Multi-Step Onboarding Form */}
        <div className="card" style={{ maxWidth: 840, margin: "0 auto", padding: "2.5rem" }}>
          {/* Step Indicator */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "1.5rem" }}>
            {[
              { num: 1, label: "Kitchen Info" },
              { num: 2, label: "Food & Cuisines" },
              { num: 3, label: "Verification" },
            ].map((s) => (
              <div key={s.num} style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: step === s.num ? "var(--primary)" : step > s.num ? "var(--secondary)" : "var(--surface-alt)",
                    color: step >= s.num ? "white" : "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                  }}
                >
                  {step > s.num ? "✓" : s.num}
                </div>
                <span style={{ fontWeight: step === s.num ? 700 : 500, fontSize: "0.9375rem", color: step === s.num ? "var(--text)" : "var(--text-muted)" }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); setStep(step + 1); }}>
            {regError && (
              <div
                style={{
                  padding: "0.875rem 1.25rem",
                  background: "rgba(198,47,47,0.1)",
                  border: "1.5px solid var(--danger)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--danger)",
                  fontSize: "0.9rem",
                  marginBottom: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.625rem",
                }}
                role="alert"
              >
                <AlertCircle size={20} style={{ flexShrink: 0 }} />
                <span>{regError}</span>
              </div>
            )}

            {/* Step 1: Kitchen & Personal Details */}
            {step === 1 && (
              <div>
                <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.25rem", color: "var(--text)", marginBottom: "1.25rem" }}>
                  Step 1: Your Kitchen & Contact Information
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <label className="label">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Meera Patel"
                      className="input"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">Kitchen / Brand Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Meera's Home Kitchen"
                      className="input"
                      value={formData.kitchenName}
                      onChange={(e) => setFormData({ ...formData, kitchenName: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <label className="label">Mobile Number (WhatsApp) *</label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      pattern="[6-9][0-9]{9}"
                      placeholder="10-digit mobile number"
                      className="input"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                    />
                  </div>
                  <div>
                    <label className="label">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="you@gmail.com"
                      className="input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <label className="label">City *</label>
                    <select
                      className="input"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    >
                      {CITIES.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name} ({c.state})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">Area / Locality *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kalavad Road"
                      className="input"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">Pincode *</label>
                    <input
                      type="text"
                      required
                      placeholder="360001"
                      className="input"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label className="label">Full Kitchen Address *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="House/Plot No, Street, Society, Landmark"
                    className="input"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                  <div>
                    <label className="label">Cook Account Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="Min 8 characters"
                      className="input"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      minLength={8}
                    />
                  </div>
                  <div>
                    <label className="label">Confirm Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="Repeat password"
                      className="input"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button type="submit" className="btn btn-primary" style={{ padding: "0.75rem 2rem" }}>
                    Continue to Food & Cuisines <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Cuisines & Operations */}
            {step === 2 && (
              <div>
                <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.25rem", color: "var(--text)", marginBottom: "1.25rem" }}>
                  Step 2: Food Style, Cuisines & Capacity
                </h3>

                {/* Veg / Non-Veg Toggle */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <label className="label">Food Type Prepared</label>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <label
                      style={{
                        flex: 1,
                        padding: "1rem",
                        borderRadius: "var(--radius-sm)",
                        border: `2px solid ${formData.isVegOnly ? "var(--secondary)" : "var(--border)"}`,
                        background: formData.isVegOnly ? "rgba(47, 125, 79, 0.06)" : "var(--surface)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                      }}
                    >
                      <input
                        type="radio"
                        name="foodType"
                        checked={formData.isVegOnly}
                        onChange={() => setFormData({ ...formData, isVegOnly: true })}
                      />
                      <div>
                        <strong style={{ color: "var(--secondary)" }}>100% Pure Veg Kitchen</strong>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>Exclusively vegetarian meals & jain options</p>
                      </div>
                    </label>

                    <label
                      style={{
                        flex: 1,
                        padding: "1rem",
                        borderRadius: "var(--radius-sm)",
                        border: `2px solid ${!formData.isVegOnly ? "var(--primary)" : "var(--border)"}`,
                        background: !formData.isVegOnly ? "rgba(232, 101, 10, 0.06)" : "var(--surface)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                      }}
                    >
                      <input
                        type="radio"
                        name="foodType"
                        checked={!formData.isVegOnly}
                        onChange={() => setFormData({ ...formData, isVegOnly: false })}
                      />
                      <div>
                        <strong style={{ color: "var(--text)" }}>Veg & Non-Veg Available</strong>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>Separate prep area for chicken / egg meals</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Cuisines Checkbox Pills */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <label className="label">Cuisine Specialties (Select all that apply) *</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {[
                      { id: "gujarati", label: "Gujarati Thali", emoji: "🥘" },
                      { id: "kathiyawadi", label: "Kathiyawadi", emoji: "🫓" },
                      { id: "punjabi", label: "North Indian / Punjabi", emoji: "🫕" },
                      { id: "south-indian", label: "South Indian", emoji: "🍛" },
                      { id: "jain", label: "Jain Friendly", emoji: "🥗" },
                      { id: "marwari", label: "Rajasthani / Marwari", emoji: "🍲" },
                      { id: "healthy", label: "Diet / Healthy Meals", emoji: "🥑" },
                    ].map((c) => {
                      const selected = formData.cuisines.includes(c.id);
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => toggleCuisine(c.id)}
                          style={{
                            padding: "0.5rem 1rem",
                            borderRadius: "var(--radius-pill)",
                            border: `1.5px solid ${selected ? "var(--primary)" : "var(--border)"}`,
                            background: selected ? "var(--primary)" : "var(--surface)",
                            color: selected ? "white" : "var(--text)",
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.375rem",
                            transition: "all 0.15s ease",
                          }}
                        >
                          <span>{c.emoji}</span>
                          <span>{c.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Capacity & Delivery Slots */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                  <div>
                    <label className="label">Daily Meal Capacity</label>
                    <select
                      className="input"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    >
                      <option value="10-25 meals/day">10–25 tiffins/day (Home scale)</option>
                      <option value="25-50 meals/day">25–50 tiffins/day (Standard)</option>
                      <option value="50-100 meals/day">50–100 tiffins/day (Commercial home kitchen)</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Cooking Experience</label>
                    <select
                      className="input"
                      value={formData.experienceYears}
                      onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                    >
                      <option value="2">2–5 Years</option>
                      <option value="5">5–10 Years</option>
                      <option value="10">10+ Years</option>
                    </select>
                  </div>
                </div>

                {/* Delivery Slots */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <label className="label">Delivery Slots You Can Serve</label>
                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    {[
                      "Breakfast (7:30 – 9:00 AM)",
                      "Lunch (12:00 – 1:30 PM)",
                      "Dinner (7:00 – 8:30 PM)",
                    ].map((slot) => {
                      const checked = formData.deliverySlots.includes(slot);
                      return (
                        <label
                          key={slot}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.625rem 1rem",
                            borderRadius: "8px",
                            border: `1.5px solid ${checked ? "var(--primary)" : "var(--border)"}`,
                            background: checked ? "rgba(232, 101, 10, 0.05)" : "var(--surface)",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                            fontWeight: 500,
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleSlot(slot)}
                          />
                          {slot}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <button type="button" onClick={() => setStep(1)} className="btn btn-ghost">
                    ← Back
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ padding: "0.75rem 2rem" }}>
                    Continue to Verification <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: FSSAI & Hygiene Compliance */}
            {step === 3 && (
              <div>
                <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.25rem", color: "var(--text)", marginBottom: "1.25rem" }}>
                  Step 3: FSSAI License & Hygiene Compliance
                </h3>

                <div style={{ marginBottom: "1.5rem" }}>
                  <label className="label">FSSAI Registration Status *</label>
                  <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                    <label
                      style={{
                        flex: 1,
                        padding: "0.875rem",
                        borderRadius: "8px",
                        border: `1.5px solid ${formData.fssaiStatus === "have_fssai" ? "var(--primary)" : "var(--border)"}`,
                        background: formData.fssaiStatus === "have_fssai" ? "rgba(232, 101, 10, 0.05)" : "var(--surface)",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                      }}
                    >
                      <input
                        type="radio"
                        name="fssai"
                        checked={formData.fssaiStatus === "have_fssai"}
                        onChange={() => setFormData({ ...formData, fssaiStatus: "have_fssai" })}
                        style={{ marginRight: "0.5rem" }}
                      />
                      I have an active FSSAI License
                    </label>

                    <label
                      style={{
                        flex: 1,
                        padding: "0.875rem",
                        borderRadius: "8px",
                        border: `1.5px solid ${formData.fssaiStatus === "need_fssai" ? "var(--primary)" : "var(--border)"}`,
                        background: formData.fssaiStatus === "need_fssai" ? "rgba(232, 101, 10, 0.05)" : "var(--surface)",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                      }}
                    >
                      <input
                        type="radio"
                        name="fssai"
                        checked={formData.fssaiStatus === "need_fssai"}
                        onChange={() => setFormData({ ...formData, fssaiStatus: "need_fssai" })}
                        style={{ marginRight: "0.5rem" }}
                      />
                      I need help getting FSSAI registration
                    </label>
                  </div>

                  {formData.fssaiStatus === "have_fssai" && (
                    <div>
                      <label className="label">14-Digit FSSAI License / Registration Number</label>
                      <input
                        type="text"
                        placeholder="e.g. 10020042003854"
                        className="input"
                        maxLength={14}
                        pattern="[0-9]{14}"
                        value={formData.fssaiNo}
                        onChange={(e) => setFormData({ ...formData, fssaiNo: e.target.value.replace(/\D/g, "") })}
                      />
                    </div>
                  )}
                </div>

                {/* Hygiene Declaration Checkboxes */}
                <div style={{ background: "var(--surface-alt)", borderRadius: "var(--radius)", padding: "1.25rem", marginBottom: "1.75rem" }}>
                  <h4 style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text)", marginBottom: "0.75rem" }}>
                    HomeFeast Quality & Hygiene Standards
                  </h4>

                  <label style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", marginBottom: "0.75rem", cursor: "pointer", fontSize: "0.875rem" }}>
                    <input
                      type="checkbox"
                      required
                      checked={formData.hygieneDeclaration}
                      onChange={(e) => setFormData({ ...formData, hygieneDeclaration: e.target.checked })}
                      style={{ marginTop: "0.2rem" }}
                    />
                    <span>
                      I declare that all meals are cooked in a clean, sanitized environment using filtered water, fresh ingredients, and clean utensils with hair covers & gloves.
                    </span>
                  </label>

                  <label style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", cursor: "pointer", fontSize: "0.875rem" }}>
                    <input
                      type="checkbox"
                      required
                      checked={formData.termsAccepted}
                      onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                      style={{ marginTop: "0.2rem" }}
                    />
                    <span>
                      I agree to the <Link href="/terms" target="_blank" style={{ color: "var(--primary)" }}>Partner Terms of Service</Link> and <Link href="/privacy" target="_blank" style={{ color: "var(--primary)" }}>Privacy Policy</Link>.
                    </span>
                  </label>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <button type="button" onClick={() => setStep(2)} className="btn btn-ghost">
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={!formData.hygieneDeclaration || !formData.termsAccepted}
                    className="btn btn-primary"
                    style={{ padding: "0.75rem 2.25rem" }}
                  >
                    Submit Partner Application <CheckCircle size={18} />
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
