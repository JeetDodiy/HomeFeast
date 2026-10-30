"use client";
import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User, Phone, Eye, EyeOff, CheckCircle, Clock, Utensils, MapPin, Building, ArrowRight } from "lucide-react";
import { CITIES } from "@/lib/mockData";

export default function RegisterPage() {
  const [role, setRole] = useState<"customer" | "cook">("customer");
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    kitchenName: "",
    email: "",
    phone: "",
    city: "Rajkot",
    area: "",
    pincode: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [ageConsent, setAgeConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = passwordStrength(form.password);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "var(--danger)", "var(--accent)", "var(--info)", "var(--secondary)"][strength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!ageConsent) {
      setError("Please confirm you are 18 years of age or older and accept the Terms & Privacy Policy.");
      return;
    }

    if (role === "cook") {
      if (!form.name.trim() || !form.kitchenName.trim()) {
        setError("Please enter both your full name and kitchen / brand name.");
        return;
      }
      if (!form.area.trim() || !form.address.trim()) {
        setError("Please provide your area / locality and full kitchen address.");
        return;
      }
    }

    const cleanPhone = form.phone.replace(/[\s\-\+]/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/v1/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          name: form.name.trim(),
          kitchenName: form.kitchenName.trim(),
          email: form.email.trim().toLowerCase(),
          phone: cleanPhone,
          password: form.password,
          city: form.city || "Rajkot",
          area: form.area.trim(),
          pincode: form.pincode.trim(),
          address: form.address.trim(),
          role: role.toUpperCase(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Clear local storage order pollution for new cooks
        if (role === "cook" && typeof window !== "undefined") {
          try {
            const cleanKey = form.email.trim().toLowerCase().replace(/[^a-z0-9]/g, "_");
            localStorage.setItem(`hf_cook_orders_${cleanKey}`, JSON.stringify([]));
            localStorage.setItem(`hf_cook_subscribers_${cleanKey}`, JSON.stringify([]));
            localStorage.setItem("hf_cook_orders", JSON.stringify([]));
            localStorage.setItem("hf_cook_subscribers", JSON.stringify([]));
          } catch (e) {
            console.warn("Storage sync error:", e);
          }
        }

        // Strictly do NOT auto-login. User must log in at /auth/login.
        setStep(2);
      } else {
        setError(data.error || "Registration failed. Please try again.");
      }
    } catch {
      setError("Network error occurred during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: REGISTRATION SUCCESS SCREEN
  if (step === 2) {
    if (role === "cook") {
      return (
        <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2.5rem 1rem" }}>
          <div className="card" style={{ maxWidth: 620, width: "100%", padding: "2.5rem", textAlign: "center" }}>
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
                margin: "0 auto 1.25rem",
              }}
            >
              <Clock size={40} />
            </div>

            <span className="badge badge-pending" style={{ marginBottom: "0.875rem", display: "inline-block", fontSize: "0.85rem", padding: "0.4rem 0.85rem" }}>
              ⏳ Application Registered — Pending Admin Review
            </span>

            <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.75rem", color: "var(--text)", marginBottom: "0.75rem" }}>
              Kitchen Registered, Chef {form.name}! 🎉
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              Your kitchen <strong>{form.kitchenName}</strong> in <strong>{form.city}</strong> has been registered under <strong>{form.email}</strong>.
              To maintain authentic homemade hygiene standards, <strong>your kitchen will go LIVE after Admin Approval</strong>.
            </p>

            <div style={{ background: "var(--surface-alt)", borderRadius: "var(--radius)", padding: "1.25rem", textAlign: "left", marginBottom: "1.75rem", border: "1px solid var(--border)" }}>
              <h4 style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text)", marginBottom: "0.5rem" }}>
                What Happens Next:
              </h4>
              <ul style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.8, paddingLeft: "1.25rem", margin: 0 }}>
                <li><strong>Admin Verification:</strong> Our compliance team verifies your kitchen application.</li>
                <li><strong>Log In to Your Portal:</strong> Sign in anytime with <strong>{form.email}</strong> and your password.</li>
                <li><strong>Configure Dishes & Plans:</strong> You can manage meal prices, Gujarati / Kathiyawadi menus, and delivery slots.</li>
                <li><strong>Go Live:</strong> Once approved in the Admin Console, your kitchen appears on the public search for hungry customers!</li>
              </ul>
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/auth/login" className="btn btn-primary" style={{ padding: "0.75rem 1.75rem" }}>
                Go to Login →
              </Link>
              <Link href="/cook/register" className="btn btn-outline" style={{ padding: "0.75rem 1.75rem" }}>
                Complete Cuisines & FSSAI Setup →
              </Link>
            </div>
          </div>
        </div>
      );
    }

    // Customer success screen
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
        <div style={{ textAlign: "center", maxWidth: 460 }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--secondary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", color: "white" }}>
            <CheckCircle size={40} />
          </div>
          <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "2rem", color: "var(--text)", marginBottom: "1rem" }}>Account Created! 🎉</h1>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.7, marginBottom: "2rem" }}>
            Your customer account has been created for <strong>{form.email}</strong>.
            Please sign in with your email and password to start subscribing to verified home kitchens.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/auth/login" className="btn btn-primary" style={{ padding: "0.75rem 1.75rem" }}>Go to Login →</Link>
            <Link href="/" className="btn btn-ghost" style={{ padding: "0.75rem 1.75rem" }}>Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2.5rem 1rem" }}>
      <div style={{ width: "100%", maxWidth: role === "cook" ? 640 : 520, transition: "max-width 0.3s ease" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href="/" style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", textDecoration: "none" }}>
            <img
              src="/HomeFeast Fresh Delivery Logo.png"
              alt="HomeFeast Fresh Delivery Logo"
              style={{ width: 150, height: "auto", objectFit: "contain", display: "block" }}
            />
          </Link>
          <h1 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.75rem", color: "var(--text)", marginTop: "1.5rem", marginBottom: "0.5rem" }}>
            {role === "cook" ? "Register Your Kitchen" : "Create your account"}
          </h1>
          <p style={{ color: "var(--text-muted)" }}>
            {role === "cook"
              ? "Join 350+ verified home cooks earning ₹25,000–₹60,000/mo"
              : "Join 12,000+ happy food lovers enjoying fresh tiffins"}
          </p>
        </div>

        {/* Role Toggle */}
        <div style={{ display: "flex", background: "var(--surface-alt)", borderRadius: "var(--radius)", padding: "0.25rem", marginBottom: "1.5rem" }}>
          <button
            onClick={() => setRole("customer")}
            id="register-customer-btn"
            type="button"
            style={{
              flex: 1, padding: "0.875rem", border: "none",
              borderRadius: "var(--radius-sm)",
              background: role === "customer" ? "var(--surface)" : "transparent",
              color: role === "customer" ? "var(--primary)" : "var(--text-muted)",
              fontFamily: "Poppins", fontWeight: 700, fontSize: "0.9375rem", cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: role === "customer" ? "var(--shadow)" : "none",
            }}
          >
            🍛 I want to order food
          </button>
          <button
            onClick={() => setRole("cook")}
            id="register-cook-btn"
            type="button"
            style={{
              flex: 1, padding: "0.875rem", border: "none",
              borderRadius: "var(--radius-sm)",
              background: role === "cook" ? "var(--surface)" : "transparent",
              color: role === "cook" ? "var(--primary)" : "var(--text-muted)",
              fontFamily: "Poppins", fontWeight: 700, fontSize: "0.9375rem", cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: role === "cook" ? "var(--shadow)" : "none",
            }}
          >
            🧑‍🍳 I want to cook
          </button>
        </div>

        {/* Cook Notice Banner */}
        {role === "cook" && (
          <div style={{ padding: "0.875rem 1rem", background: "rgba(47,125,79,0.08)", border: "1px solid rgba(47,125,79,0.2)", borderRadius: "var(--radius-sm)", marginBottom: "1.5rem", fontSize: "0.875rem", color: "var(--secondary)" }}>
            🧑‍🍳 <strong>Cook & Kitchen Registration:</strong> Fill in your kitchen details and create your cook credentials. Your kitchen will go LIVE after Admin Approval.
          </div>
        )}

        <div className="card" style={{ padding: role === "cook" ? "2.25rem" : "2rem" }}>
          <form onSubmit={handleSubmit} noValidate>
            {/* COOK REGISTRATION: Kitchen & Contact Information (Matching Screenshot 2) */}
            {role === "cook" ? (
              <div>
                <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.15rem", color: "var(--text)", marginBottom: "1.25rem" }}>
                  Step 1: Your Kitchen & Contact Information
                </h3>

                {/* Full Name & Kitchen Name */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <label htmlFor="cook-name" style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", color: "var(--text)", marginBottom: "0.5rem" }}>
                      Your Full Name *
                    </label>
                    <input
                      id="cook-name"
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Meera Patel"
                      className="input-base"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="cook-kitchen" style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", color: "var(--text)", marginBottom: "0.5rem" }}>
                      Kitchen / Brand Name *
                    </label>
                    <input
                      id="cook-kitchen"
                      type="text"
                      value={form.kitchenName}
                      onChange={(e) => setForm({ ...form, kitchenName: e.target.value })}
                      placeholder="e.g. Meera's Home Kitchen"
                      className="input-base"
                      required
                    />
                  </div>
                </div>

                {/* Phone & Email */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <label htmlFor="cook-phone" style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", color: "var(--text)", marginBottom: "0.5rem" }}>
                      Mobile Number (WhatsApp) *
                    </label>
                    <input
                      id="cook-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                      maxLength={10}
                      pattern="[6-9][0-9]{9}"
                      placeholder="10-digit mobile number"
                      className="input-base"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="cook-email" style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", color: "var(--text)", marginBottom: "0.5rem" }}>
                      Email Address *
                    </label>
                    <input
                      id="cook-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@gmail.com"
                      className="input-base"
                      required
                    />
                  </div>
                </div>

                {/* City, Area, Pincode */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <label htmlFor="cook-city" style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", color: "var(--text)", marginBottom: "0.5rem" }}>
                      City *
                    </label>
                    <select
                      id="cook-city"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="input-base"
                      style={{ height: "46px" }}
                      required
                    >
                      {CITIES.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name} ({c.state})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="cook-area" style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", color: "var(--text)", marginBottom: "0.5rem" }}>
                      Area / Locality *
                    </label>
                    <input
                      id="cook-area"
                      type="text"
                      value={form.area}
                      onChange={(e) => setForm({ ...form, area: e.target.value })}
                      placeholder="e.g. Kalavad Road"
                      className="input-base"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="cook-pincode" style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", color: "var(--text)", marginBottom: "0.5rem" }}>
                      Pincode *
                    </label>
                    <input
                      id="cook-pincode"
                      type="text"
                      value={form.pincode}
                      onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                      placeholder="360001"
                      className="input-base"
                      required
                    />
                  </div>
                </div>

                {/* Full Kitchen Address */}
                <div style={{ marginBottom: "1rem" }}>
                  <label htmlFor="cook-address" style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", color: "var(--text)", marginBottom: "0.5rem" }}>
                    Full Kitchen Address *
                  </label>
                  <textarea
                    id="cook-address"
                    rows={2}
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="House/Plot No, Street, Society, Landmark"
                    className="input-base"
                    style={{ resize: "vertical", minHeight: "68px" }}
                    required
                  />
                </div>

                {/* Password & Confirm Password */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <label htmlFor="cook-password" style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", color: "var(--text)", marginBottom: "0.5rem" }}>
                      Cook Account Password *
                    </label>
                    <div style={{ position: "relative" }}>
                      <Lock size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                      <input
                        id="cook-password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder="Min 8 characters"
                        className="input-base"
                        style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="cook-confirm" style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", color: "var(--text)", marginBottom: "0.5rem" }}>
                      Confirm Password *
                    </label>
                    <input
                      id="cook-confirm"
                      type="password"
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      placeholder="Repeat password"
                      className="input-base"
                      required
                    />
                  </div>
                </div>

                {form.password && (
                  <div style={{ marginBottom: "1rem" }}>
                    <div style={{ display: "flex", gap: "0.25rem", marginBottom: "0.25rem" }}>
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= strength ? strengthColor : "var(--border)", transition: "background 0.2s" }} />
                      ))}
                    </div>
                    <span style={{ fontSize: "0.8rem", color: strengthColor }}>{strengthLabel}</span>
                  </div>
                )}
              </div>
            ) : (
              /* CUSTOMER REGISTRATION FORM */
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <label htmlFor="reg-name" style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", color: "var(--text)", marginBottom: "0.5rem" }}>Full Name</label>
                    <div style={{ position: "relative" }}>
                      <User size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                      <input id="reg-name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" className="input-base" style={{ paddingLeft: "2.5rem" }} required />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="reg-phone" style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", color: "var(--text)", marginBottom: "0.5rem" }}>Phone</label>
                    <div style={{ position: "relative" }}>
                      <Phone size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                      <input
                        id="reg-phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                        maxLength={10}
                        pattern="[6-9][0-9]{9}"
                        placeholder="10-digit mobile number"
                        className="input-base"
                        style={{ paddingLeft: "2.5rem" }}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label htmlFor="reg-email" style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", color: "var(--text)", marginBottom: "0.5rem" }}>Email Address</label>
                  <div style={{ position: "relative" }}>
                    <Mail size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    <input id="reg-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="input-base" style={{ paddingLeft: "2.5rem" }} required />
                  </div>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label htmlFor="reg-password" style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", color: "var(--text)", marginBottom: "0.5rem" }}>Password</label>
                  <div style={{ position: "relative" }}>
                    <Lock size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                    <input id="reg-password" type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min 8 characters" className="input-base" style={{ paddingLeft: "2.5rem", paddingRight: "2.75rem" }} required minLength={8} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {form.password && (
                    <div style={{ marginTop: "0.5rem" }}>
                      <div style={{ display: "flex", gap: "0.25rem", marginBottom: "0.25rem" }}>
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= strength ? strengthColor : "var(--border)", transition: "background 0.2s" }} />
                        ))}
                      </div>
                      <span style={{ fontSize: "0.8rem", color: strengthColor }}>{strengthLabel}</span>
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <label htmlFor="reg-confirm" style={{ display: "block", fontWeight: 600, fontSize: "0.875rem", color: "var(--text)", marginBottom: "0.5rem" }}>Confirm Password</label>
                  <input id="reg-confirm" type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Repeat your password" className="input-base" required />
                  {form.confirmPassword && form.password !== form.confirmPassword && (
                    <p style={{ color: "var(--danger)", fontSize: "0.8rem", marginTop: "0.25rem" }}>Passwords do not match</p>
                  )}
                </div>
              </div>
            )}

            {/* Terms and Age Consent */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.8125rem", color: "var(--text-muted)", cursor: "pointer", lineHeight: 1.5 }}>
                <input
                  type="checkbox"
                  id="register-age-consent"
                  checked={ageConsent}
                  onChange={(e) => setAgeConsent(e.target.checked)}
                  style={{ marginTop: "2px", accentColor: "var(--primary)" }}
                  required
                />
                <span>
                  I confirm that I am <strong>18 years of age or older</strong>, and I agree to HomeFeast's{" "}
                  <Link href="/terms" target="_blank" style={{ color: "var(--primary)", textDecoration: "underline", fontWeight: 600 }}>
                    Terms of Service
                  </Link> and{" "}
                  <Link href="/privacy" target="_blank" style={{ color: "var(--primary)", textDecoration: "underline", fontWeight: 600 }}>
                    Privacy Policy
                  </Link>.
                </span>
              </label>
            </div>

            {error && (
              <div style={{ padding: "0.75rem 1rem", background: "rgba(239, 68, 68, 0.1)", border: "1px solid var(--danger)", borderRadius: "8px", color: "var(--danger)", fontSize: "0.875rem", marginBottom: "1rem" }}>
                {error}
              </div>
            )}

            <button
              id="register-submit-btn"
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center", fontSize: "1rem", padding: "0.875rem" }}
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : role === "cook"
                ? "Register Kitchen & Create Cook Account →"
                : "Create Customer Account"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
            By signing up, you agree to our{" "}
            <Link href="/terms" style={{ color: "var(--primary)" }}>Terms</Link> and{" "}
            <Link href="/privacy" style={{ color: "var(--primary)" }}>Privacy Policy</Link>.
          </p>

          <div style={{ textAlign: "center", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "0.9375rem" }}>Already have an account?{" "}</span>
            <Link href="/auth/login" style={{ fontWeight: 700, color: "var(--primary)" }}>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
