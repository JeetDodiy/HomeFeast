"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ChefHat, Mail, Lock, User, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"customer" | "cook" | "admin">("customer");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    // In production: call /api/v1/auth/login
    alert("Login successful! (Demo mode - backend integration needed)");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: 460 }}>
        {/* Logo */}
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
            Welcome back! 👋
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem" }}>Sign in to your account</p>
        </div>

        {/* Role Tabs */}
        <div
          style={{
            display: "flex",
            background: "var(--surface-alt)",
            borderRadius: "var(--radius)",
            padding: "0.25rem",
            marginBottom: "1.5rem",
          }}
          role="tablist"
        >
          {(["customer", "cook", "admin"] as const).map((role) => (
            <button
              key={role}
              role="tab"
              aria-selected={activeTab === role}
              id={`login-tab-${role}`}
              onClick={() => setActiveTab(role)}
              style={{
                flex: 1,
                padding: "0.625rem",
                border: "none",
                borderRadius: "var(--radius-sm)",
                background: activeTab === role ? "var(--surface)" : "transparent",
                color: activeTab === role ? "var(--primary)" : "var(--text-muted)",
                fontFamily: "Poppins",
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: activeTab === role ? "var(--shadow)" : "none",
                textTransform: "capitalize",
              }}
            >
              {role === "customer" ? "🧑" : role === "cook" ? "👨‍🍳" : "🔐"} {role}
            </button>
          ))}
        </div>

        {/* Login Card */}
        <div className="card" style={{ padding: "2rem" }}>
          {error && (
            <div
              style={{
                padding: "0.875rem 1rem",
                background: "rgba(198,47,47,0.08)",
                border: "1px solid rgba(198,47,47,0.2)",
                borderRadius: "var(--radius-sm)",
                color: "var(--danger)",
                fontSize: "0.9rem",
                marginBottom: "1.25rem",
              }}
              role="alert"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: "1.25rem" }}>
              <label htmlFor="login-email" style={{ display: "block", fontWeight: 600, fontSize: "0.9375rem", color: "var(--text)", marginBottom: "0.5rem" }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={17} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  id="login-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="input-base"
                  style={{ paddingLeft: "2.75rem" }}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label htmlFor="login-password" style={{ display: "block", fontWeight: 600, fontSize: "0.9375rem", color: "var(--text)", marginBottom: "0.5rem" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={17} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="input-base"
                  style={{ paddingLeft: "2.75rem", paddingRight: "2.75rem" }}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "0.25rem" }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.5rem" }}>
              <Link href="/auth/forgot-password" style={{ fontSize: "0.875rem", color: "var(--primary)", fontWeight: 500 }}>
                Forgot password?
              </Link>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center", fontSize: "1rem", padding: "0.875rem" }}
              disabled={loading}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                  Signing in...
                </span>
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "0.9375rem" }}>Don't have an account?{" "}</span>
            <Link href="/auth/register" style={{ fontWeight: 700, color: "var(--primary)" }}>
              Sign Up Free
            </Link>
          </div>

          {/* Demo Credentials */}
          <div
            style={{
              marginTop: "1.5rem",
              padding: "0.875rem",
              background: "var(--surface-alt)",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.8rem",
              color: "var(--text-muted)",
            }}
          >
            <p style={{ fontWeight: 700, marginBottom: "0.375rem", color: "var(--text)" }}>Demo Credentials</p>
            <p>Customer: demo@customer.com / demo123</p>
            <p>Cook: demo@cook.com / demo123</p>
            <p>Admin: admin@homefeast.in / admin123</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
