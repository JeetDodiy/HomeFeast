"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ChefHat, Mail, Lock, User, ArrowRight, LogOut, CheckCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "demo@cook.com", password: "demo123" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"customer" | "cook" | "admin">("cook");
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const u = localStorage.getItem("hf_user");
        if (u) setCurrentUser(JSON.parse(u));
      } catch {}
    }
  }, []);

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("hf_token");
      localStorage.removeItem("hf_user");
      document.cookie = "hf_token=; path=/; max-age=0";
      document.cookie = "hf_role=; path=/; max-age=0";
      window.dispatchEvent(new Event("auth-state-changed"));
      setCurrentUser(null);
      setForm({ email: "", password: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/v1/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          email: form.email,
          password: form.password,
          role: activeTab.toUpperCase(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        if (typeof window !== "undefined") {
          const userRole = (data.user?.role || activeTab).toLowerCase();
          localStorage.setItem("hf_token", data.token || "hf_session_token");
          localStorage.setItem("hf_user", JSON.stringify(data.user || { email: form.email, role: userRole }));
          
          // Set client cookies for middleware synchronization
          document.cookie = `hf_token=${data.token || "hf_session_token"}; path=/; max-age=604800; SameSite=Lax`;
          document.cookie = `hf_role=${userRole}; path=/; max-age=604800; SameSite=Lax`;
          
          window.dispatchEvent(new Event("auth-state-changed"));
          
          // Redirect strictly according to authenticated account role
          const target = userRole === "cook" ? "/cook/dashboard" : userRole === "admin" ? "/admin/dashboard" : "/customer/dashboard";
          window.location.href = target;
          return;
        }
      } else {
        setError(data.error || "Authentication failed. Please check your credentials.");
      }
    } catch {
      setError("Network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRole = (role: "customer" | "cook" | "admin") => {
    setActiveTab(role);
    setError("");
    if (role === "customer") {
      setForm({ email: "demo@customer.com", password: "demo123" });
    } else if (role === "cook") {
      setForm({ email: "demo@cook.com", password: "demo123" });
    } else if (role === "admin") {
      setForm({ email: "admin@homefeast.in", password: "admin123" });
    }
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
          <Link href="/" style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", textDecoration: "none" }}>
            <img
              src="/HomeFeast Fresh Delivery Logo.png"
              alt="HomeFeast Fresh Delivery Logo"
              style={{ width: 150, height: "auto", objectFit: "contain", display: "block" }}
            />
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
              onClick={() => handleSelectRole(role)}
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
          {currentUser && (
            <div
              style={{
                padding: "0.875rem 1rem",
                background: "rgba(47, 125, 79, 0.08)",
                border: "1.5px solid var(--secondary)",
                borderRadius: "var(--radius-sm)",
                marginBottom: "1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.85rem", color: "var(--text)", fontWeight: 600 }}>
                  Active Session Detected:
                </span>
                <span className="badge badge-success" style={{ fontSize: "0.7rem", padding: "0.2rem 0.5rem" }}>
                  Currently Logged In
                </span>
              </div>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-muted)" }}>
                You are currently signed in as <strong>{currentUser.name}</strong> ({currentUser.email || currentUser.role}).
              </p>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
                <button
                  type="button"
                  onClick={() => {
                    const role = (currentUser.role || "").toLowerCase();
                    const target = role === "cook" ? "/cook/dashboard" : role === "admin" ? "/admin/dashboard" : "/customer/dashboard";
                    router.push(target);
                  }}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: "0.45rem", fontSize: "0.8125rem", justifyContent: "center" }}
                >
                  Go to Dashboard →
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="btn btn-ghost"
                  style={{ padding: "0.45rem 0.75rem", fontSize: "0.8125rem", color: "var(--danger)" }}
                >
                  <LogOut size={14} /> Sign Out / Switch
                </button>
              </div>
            </div>
          )}

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
              padding: "1rem",
              background: "var(--surface-alt)",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.8125rem",
              color: "var(--text-muted)",
              border: "1px solid var(--border)",
            }}
          >
            <p style={{ fontWeight: 700, marginBottom: "0.5rem", color: "var(--text)" }}>
              ⚡ Quick Fill Demo Logins (Click to autofill):
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <button
                type="button"
                onClick={() => handleSelectRole("customer")}
                style={{
                  textAlign: "left",
                  background: activeTab === "customer" ? "var(--primary-subtle, rgba(232,101,10,0.1))" : "var(--surface)",
                  border: activeTab === "customer" ? "1px solid var(--primary)" : "1px solid var(--border)",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  color: "var(--text)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span><strong>🧑 Customer (Pooja Patel):</strong> demo@customer.com</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>password: demo123</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectRole("cook")}
                style={{
                  textAlign: "left",
                  background: activeTab === "cook" ? "var(--primary-subtle, rgba(232,101,10,0.1))" : "var(--surface)",
                  border: activeTab === "cook" ? "1px solid var(--primary)" : "1px solid var(--border)",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  color: "var(--text)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span><strong>👨‍🍳 Cook (Meenaben Patel):</strong> demo@cook.com</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>password: demo123</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectRole("admin")}
                style={{
                  textAlign: "left",
                  background: activeTab === "admin" ? "var(--primary-subtle, rgba(232,101,10,0.1))" : "var(--surface)",
                  border: activeTab === "admin" ? "1px solid var(--primary)" : "1px solid var(--border)",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  color: "var(--text)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span><strong>🔐 Admin (Jeet Dodiya):</strong> admin@homefeast.in</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>password: admin123</span>
              </button>
            </div>
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
