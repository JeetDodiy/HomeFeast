"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChefHat,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle,
  CreditCard,
  QrCode,
  Banknote,
  ArrowRight,
  ArrowLeft,
  Tag,
  AlertCircle,
  Calendar,
  Sparkles,
} from "lucide-react";
import { COOKS, CITIES } from "@/lib/mockData";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const cookId = searchParams.get("cook") || "c1";
  const planId = searchParams.get("plan") || "p2";

  const cook = COOKS.find((c) => c.id === cookId) || COOKS[0];
  const plan = cook.plans.find((p) => p.id === planId) || cook.plans[0];

  // Form State
  const [formData, setFormData] = useState({
    fullName: "Priya Sharma",
    phone: "9876543210",
    email: "priya.sharma@example.com",
    address: "Flat 402, Royal Residency, Opp. Reliance Mall",
    area: "Race Course",
    city: cook.city || "Rajkot",
    pincode: "360001",
    landmark: "Near Reliance Mall",
    mealSlot: "Lunch (12:00 PM – 1:30 PM)",
    deliveryDays: "all-7-days",
    startDate: "2026-10-15",
    dietaryNotes: "Less spicy, less oil please.",
    paymentMethod: "cod",
  });

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>({
    code: "FIRSTFEAST",
    discount: Math.round(plan.price * 0.1),
  });
  const [couponError, setCouponError] = useState("");

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState("");

  const subtotal = plan.price;
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const deliveryFee = 0; // Free home delivery
  const platformFee = 0; // Transparent ₹0 Platform Fee (No hidden charges)
  const totalAmount = Math.max(0, subtotal - discountAmount + platformFee);

  const [termsAgreed, setTermsAgreed] = useState(false);
  const [formError, setFormError] = useState("");

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    const code = couponInput.trim().toUpperCase();

    if (code === "WELCOME50") {
      setAppliedCoupon({ code, discount: 50 });
      setCouponInput("");
    } else if (code === "FIRSTFEAST") {
      setAppliedCoupon({ code, discount: Math.round(plan.price * 0.1) });
      setCouponInput("");
    } else if (code === "HOMELOVE") {
      setAppliedCoupon({ code, discount: 100 });
      setCouponInput("");
    } else {
      setCouponError("Invalid promo code. Try 'FIRSTFEAST' or 'WELCOME50'");
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAgreed) {
      setFormError("Please confirm that you are 18+ years old and accept our Terms, Privacy, and Refund policies.");
      return;
    }
    setFormError("");
    setIsSubmitting(true);

    setTimeout(() => {
      const generatedId = `HF-${Math.floor(100000 + Math.random() * 900000)}`;
      setConfirmedOrderId(generatedId);
      setIsSubmitting(false);
      setOrderConfirmed(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1200);
  };

  if (orderConfirmed) {
    return (
      <div style={{ minHeight: "85vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem", background: "var(--bg)" }}>
        <div className="card" style={{ maxWidth: 640, width: "100%", padding: "2.5rem", textAlign: "center" }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "rgba(47, 125, 79, 0.12)",
              color: "var(--secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
            }}
          >
            <CheckCircle size={44} />
          </div>

          <span className="badge badge-success" style={{ marginBottom: "0.75rem", display: "inline-block" }}>
            Subscription Confirmed!
          </span>

          <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.75rem", color: "var(--text)", marginBottom: "0.5rem" }}>
            Delicious Meals Coming Your Way!
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "1.75rem", lineHeight: 1.6 }}>
            Thank you, <strong>{formData.fullName}</strong>. Your subscription request has been received and forwarded to{" "}
            <strong>{cook.kitchenName}</strong>. You will receive an SMS and WhatsApp confirmation shortly.
          </p>

          {/* Order Details Card */}
          <div
            style={{
              background: "var(--surface-alt)",
              borderRadius: "var(--radius)",
              padding: "1.5rem",
              textAlign: "left",
              marginBottom: "2rem",
              border: "1px solid var(--border)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: "0.75rem", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Subscription ID</span>
              <strong style={{ fontFamily: "monospace", fontSize: "0.95rem", color: "var(--primary)" }}>{confirmedOrderId}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: "0.75rem", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Home Cook</span>
              <strong style={{ fontSize: "0.875rem", color: "var(--text)" }}>{cook.kitchenName} ({cook.name})</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: "0.75rem", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Selected Plan</span>
              <span style={{ fontSize: "0.875rem", color: "var(--text)", fontWeight: 600 }}>{plan.label} ({plan.type})</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: "0.75rem", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>First Delivery Date</span>
              <strong style={{ fontSize: "0.875rem", color: "var(--secondary)" }}>{formData.startDate} • {formData.mealSlot}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "0.25rem" }}>
              <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Amount Payable ({formData.paymentMethod.toUpperCase()})</span>
              <strong style={{ fontSize: "1.125rem", color: "var(--primary)", fontFamily: "Poppins" }}>₹{totalAmount}</strong>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/customer/dashboard" className="btn btn-primary" style={{ padding: "0.75rem 1.75rem" }}>
              Track Subscription in Dashboard
            </Link>
            <Link href="/" className="btn btn-ghost" style={{ padding: "0.75rem 1.75rem" }}>
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "2rem 0 4rem" }}>
      <div className="container-custom">
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: "1.5rem" }}>
          <Link
            href={`/cooks/${cook.id}`}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", fontSize: "0.875rem", textDecoration: "none" }}
          >
            <ArrowLeft size={16} /> Back to {cook.kitchenName}
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem", alignItems: "start" }}>
          {/* Main Checkout Form */}
          <div style={{ flex: 1 }}>
            <div className="card" style={{ padding: "2rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                  1
                </div>
                <div>
                  <h2 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.25rem", color: "var(--text)" }}>Delivery Address</h2>
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>Where should your daily tiffin be delivered?</p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label className="label">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="input"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    className="input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label className="label">Delivery Address (House/Flat No, Apartment, Street) *</label>
                <textarea
                  required
                  rows={2}
                  className="input"
                  style={{ resize: "vertical" }}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label className="label">Area / Locality *</label>
                  <input
                    type="text"
                    required
                    className="input"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">City</label>
                  <select
                    className="input"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  >
                    {CITIES.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Pincode *</label>
                  <input
                    type="text"
                    required
                    className="input"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="label">Nearby Landmark (Optional)</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Near HDFC Bank, Opp. Garden"
                  value={formData.landmark}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                />
              </div>
            </div>

            {/* Step 2: Subscription Preferences */}
            <div className="card" style={{ padding: "2rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                  2
                </div>
                <div>
                  <h2 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.25rem", color: "var(--text)" }}>Schedule & Preferences</h2>
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>Choose delivery slot, start date, and special instructions</p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
                <div>
                  <label className="label">Delivery Meal Slot *</label>
                  <select
                    className="input"
                    value={formData.mealSlot}
                    onChange={(e) => setFormData({ ...formData, mealSlot: e.target.value })}
                  >
                    {cook.deliverySlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                    <option value="Both Lunch & Dinner">Both Lunch & Dinner</option>
                  </select>
                </div>
                <div>
                  <label className="label">Subscription Start Date *</label>
                  <input
                    type="date"
                    required
                    className="input"
                    value={formData.startDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label className="label">Delivery Days Schedule</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.75rem" }}>
                  {[
                    { id: "all-7-days", label: "All 7 Days", sub: "Mon – Sun" },
                    { id: "mon-sat", label: "6 Days/Week", sub: "Mon – Sat" },
                    { id: "mon-fri", label: "5 Days/Week", sub: "Mon – Fri (Weekdays)" },
                  ].map((sched) => (
                    <label
                      key={sched.id}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        padding: "0.75rem 1rem",
                        borderRadius: "var(--radius-sm)",
                        border: `2px solid ${formData.deliveryDays === sched.id ? "var(--primary)" : "var(--border)"}`,
                        background: formData.deliveryDays === sched.id ? "rgba(232, 101, 10, 0.05)" : "var(--surface)",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="radio"
                        name="deliveryDays"
                        value={sched.id}
                        checked={formData.deliveryDays === sched.id}
                        onChange={() => setFormData({ ...formData, deliveryDays: sched.id })}
                        style={{ display: "none" }}
                      />
                      <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text)" }}>{sched.label}</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{sched.sub}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Dietary Instructions & Preferences (Optional)</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Less oil, no onion/garlic, extra phulkas"
                  value={formData.dietaryNotes}
                  onChange={(e) => setFormData({ ...formData, dietaryNotes: e.target.value })}
                />
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="card" style={{ padding: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                  3
                </div>
                <div>
                  <h2 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.25rem", color: "var(--text)" }}>Payment Method</h2>
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>Zero advance risk — pay securely per your convenience</p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[
                  {
                    id: "cod",
                    name: "Pay on First Delivery (Cash / UPI QR)",
                    desc: "Inspect your first tiffin before paying. Most popular for new subscribers.",
                    icon: Banknote,
                    recommended: true,
                  },
                  {
                    id: "upi",
                    name: "Instant UPI (GPay / PhonePe / Paytm)",
                    desc: "Pay directly via any UPI app with 100% buyer protection.",
                    icon: QrCode,
                  },
                  {
                    id: "card",
                    name: "Credit / Debit Card or NetBanking",
                    desc: "Visa, Mastercard, RuPay, and all major Indian banks supported.",
                    icon: CreditCard,
                  },
                ].map((pm) => (
                  <label
                    key={pm.id}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "1rem",
                      padding: "1rem 1.25rem",
                      borderRadius: "var(--radius-sm)",
                      border: `2px solid ${formData.paymentMethod === pm.id ? "var(--primary)" : "var(--border)"}`,
                      background: formData.paymentMethod === pm.id ? "rgba(232, 101, 10, 0.05)" : "var(--surface)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={pm.id}
                      checked={formData.paymentMethod === pm.id}
                      onChange={() => setFormData({ ...formData, paymentMethod: pm.id })}
                      style={{ marginTop: "0.25rem" }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--text)" }}>{pm.name}</span>
                        {pm.recommended && (
                          <span className="badge badge-success" style={{ fontSize: "0.7rem", padding: "0.15rem 0.5rem" }}>
                            Recommended
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{pm.desc}</p>
                    </div>
                    <pm.icon size={22} style={{ color: formData.paymentMethod === pm.id ? "var(--primary)" : "var(--text-muted)" }} />
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar: Order Summary & Confirmation */}
          <div style={{ position: "sticky", top: "96px" }}>
            <div className="card" style={{ padding: "1.75rem", marginBottom: "1.5rem" }}>
              <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.125rem", color: "var(--text)", marginBottom: "1.25rem" }}>
                Order Summary
              </h3>

              {/* Cook Preview */}
              <div style={{ display: "flex", gap: "0.875rem", alignItems: "center", paddingBottom: "1.25rem", borderBottom: "1px solid var(--border)", marginBottom: "1.25rem" }}>
                <img
                  src={cook.coverImage}
                  alt={cook.kitchenName}
                  style={{ width: 64, height: 64, borderRadius: "10px", objectFit: "cover" }}
                />
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text)", marginBottom: "0.25rem" }}>
                    {cook.kitchenName}
                  </h4>
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>By {cook.name} • {cook.area}</p>
                  <span className={`badge ${cook.isVeg ? "badge-veg" : "badge-nonveg"}`} style={{ marginTop: "0.35rem", fontSize: "0.7rem" }}>
                    <span className={cook.isVeg ? "veg-dot" : "nonveg-dot"} />
                    {cook.isVeg ? "Pure Veg" : "Non-Veg"}
                  </span>
                </div>
              </div>

              {/* Selected Plan Details */}
              <div style={{ background: "var(--surface-alt)", borderRadius: "var(--radius-sm)", padding: "1rem", marginBottom: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--text)" }}>{plan.label}</span>
                  <strong style={{ fontFamily: "Poppins", color: "var(--primary)", fontSize: "1.125rem" }}>₹{plan.price}</strong>
                </div>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{plan.description}</p>
                <div style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "var(--secondary)", fontWeight: 600 }}>
                  ₹{plan.perMeal}/meal • Includes: {plan.includes.slice(0, 3).join(", ")}
                </div>
              </div>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} style={{ marginBottom: "1.25rem" }}>
                <label className="label" style={{ fontSize: "0.8125rem" }}>Have a Promo Code?</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. FIRSTFEAST"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    style={{ textTransform: "uppercase", fontSize: "0.875rem" }}
                  />
                  <button type="submit" className="btn btn-ghost" style={{ border: "1.5px solid var(--border)", flexShrink: 0 }}>
                    Apply
                  </button>
                </div>
                {couponError && <p style={{ color: "var(--danger)", fontSize: "0.75rem", marginTop: "0.35rem" }}>{couponError}</p>}
                {appliedCoupon && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem", background: "rgba(47, 125, 79, 0.08)", padding: "0.35rem 0.65rem", borderRadius: "6px" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--secondary)", fontWeight: 600 }}>
                      ✓ Applied: {appliedCoupon.code} (-₹{appliedCoupon.discount})
                    </span>
                    <button
                      type="button"
                      onClick={() => setAppliedCoupon(null)}
                      style={{ background: "none", border: "none", color: "var(--danger)", fontSize: "0.75rem", cursor: "pointer", fontWeight: 600 }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </form>

              {/* Price Breakdown */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", paddingBottom: "1.25rem", borderBottom: "1px solid var(--border)", marginBottom: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", color: "var(--text-muted)" }}>
                  <span>Plan Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {appliedCoupon && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", color: "var(--secondary)", fontWeight: 600 }}>
                    <span>Promo Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", color: "var(--text-muted)" }}>
                  <span>Daily Delivery Fee</span>
                  <span style={{ color: "var(--secondary)", fontWeight: 600 }}>FREE</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", color: "var(--text-muted)" }}>
                  <span>Platform Fee & Packaging</span>
                  <span style={{ color: "var(--secondary)", fontWeight: 600 }}>₹0 (Zero Hidden Charges)</span>
                </div>
              </div>

              {/* Total */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.125rem", color: "var(--text)" }}>Total Payable</span>
                <span style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.5rem", color: "var(--primary)" }}>₹{totalAmount}</span>
              </div>

              {formError && (
                <div
                  style={{
                    padding: "0.625rem 0.875rem",
                    background: "rgba(198,47,47,0.1)",
                    color: "var(--danger)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.8125rem",
                    marginBottom: "1rem",
                    border: "1px solid var(--danger)",
                  }}
                >
                  ⚠️ {formError}
                </div>
              )}

              {/* Legal & 18+ Age Consent Checkbox */}
              <div style={{ marginBottom: "1.25rem" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.5rem",
                    fontSize: "0.8125rem",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    lineHeight: 1.5,
                  }}
                >
                  <input
                    type="checkbox"
                    id="checkout-terms-consent"
                    checked={termsAgreed}
                    onChange={(e) => {
                      setTermsAgreed(e.target.checked);
                      if (e.target.checked) setFormError("");
                    }}
                    style={{ marginTop: "2px", accentColor: "var(--primary)" }}
                    required
                  />
                  <span>
                    I confirm that I am <strong>18 years of age or older</strong>, and I agree to HomeFeast's{" "}
                    <a href="/terms" target="_blank" style={{ color: "var(--primary)", textDecoration: "underline", fontWeight: 600 }}>
                      Terms of Service
                    </a>,{" "}
                    <a href="/privacy" target="_blank" style={{ color: "var(--primary)", textDecoration: "underline", fontWeight: 600 }}>
                      Privacy Policy
                    </a>, and{" "}
                    <a href="/refund" target="_blank" style={{ color: "var(--primary)", textDecoration: "underline", fontWeight: 600 }}>
                      Refund Policy
                    </a>{" "}
                    (including the 8:00 PM previous-day cutoff rule).
                  </span>
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="button"
                id="confirm-subscription-btn"
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
                className="btn btn-primary"
                style={{ width: "100%", justifyContent: "center", padding: "0.875rem 1.5rem", fontSize: "1rem" }}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                    Confirming Subscription...
                  </>
                ) : (
                  <>
                    Confirm & Start Subscription <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginTop: "1rem", color: "var(--text-muted)", fontSize: "0.75rem" }}>
                <ShieldCheck size={16} style={{ color: "var(--secondary)" }} />
                <span>100% Hygiene Audited · Pause or Cancel Anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
          <div style={{ textAlign: "center" }}>
            <div className="spinner" style={{ margin: "0 auto 1rem" }} />
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>Loading subscription checkout...</p>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
