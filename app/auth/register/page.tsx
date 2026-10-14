"use client";
import { useState } from "react";
import Link from "next/link";
import { ChefHat, Mail, Lock, User, Phone, Eye, EyeOff, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const [role, setRole] = useState<"customer" | "cook">("customer");
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "", city: "" });
  const [ageConsent, setAgeConsent] = useState(false);
  const [loading, setLoading] = useState(false);

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
    if (!ageConsent) {
      alert("Please confirm you are 18 years of age or older and accept the Terms & Privacy Policy.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setStep(2);
  };

  if (step === 2) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
        <div style={{ textAlign: "center", maxWidth: 420 }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--secondary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", color: "white" }}>
            <CheckCircle size={40} />
          </div>
          <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "2rem", color: "var(--text)", marginBottom: "1rem" }}>Account Created! 🎉</h1>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.7, marginBottom: "2rem" }}>
            We've sent a verification email to <strong>{form.email}</strong>.
            Please verify your email to activate your account.
            {role === "cook" && <><br /><br />Your cook profile is under admin review. You'll be notified within 24–48 hours.</>}
          </p>
          <Link href="/auth/login" className="btn btn-primary" style={{ justifyContent: "center" }}>Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
      <div style={{ width: "100%", maxWidth: 520 }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
            <div style={{ width: 48, height: 48, borderRadius: "12px", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
              <ChefHat size={26} />
            </div>
            <span style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.5rem", color: "var(--text)" }}>
              Home<span style={{ color: "var(--primary)" }}>Feast</span>
            </span>
          </Link>
          <h1 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.75rem", color: "var(--text)", marginTop: "1.5rem", marginBottom: "0.5rem" }}>
            Create your account
          </h1>
          <p style={{ color: "var(--text-muted)" }}>Join 12,000+ happy food lovers</p>
        </div>

        {/* Role Toggle */}
        <div style={{ display: "flex", background: "var(--surface-alt)", borderRadius: "var(--radius)", padding: "0.25rem", marginBottom: "1.5rem" }}>
          <button
            onClick={() => setRole("customer")}
            id="register-customer-btn"
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
            🧑 I want to order food
          </button>
          <button
            onClick={() => setRole("cook")}
            id="register-cook-btn"
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
            👨‍🍳 I want to cook
          </button>
        </div>

        {role === "cook" && (
          <div style={{ padding: "1rem", background: "rgba(47,125,79,0.08)", border: "1px solid rgba(47,125,79,0.2)", borderRadius: "var(--radius-sm)", marginBottom: "1.5rem", fontSize: "0.875rem", color: "var(--secondary)" }}>
            🍳 <strong>Cook Registration:</strong> After signup, you'll need to submit your FSSAI license and ID proof for admin verification.
          </div>
        )}

        <div className="card" style={{ padding: "2rem" }}>
          <form onSubmit={handleSubmit} noValidate>
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
                  <input id="reg-phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" className="input-base" style={{ paddingLeft: "2.5rem" }} />
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

            <button id="register-submit-btn" type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: "1rem", padding: "0.875rem" }} disabled={loading}>
              {loading ? "Creating account..." : `Create ${role === "cook" ? "Cook" : "Customer"} Account`}
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
