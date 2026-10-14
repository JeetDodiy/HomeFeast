"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, ShieldCheck, X } from "lucide-react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("homefeast-cookie-consent");
      if (!consent) {
        // Show after a subtle delay for better UX
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // In case localStorage is disabled
    }
  }, []);

  const handleConsent = (choice: "all" | "essential") => {
    try {
      localStorage.setItem("homefeast-cookie-consent", choice);
      localStorage.setItem("homefeast-cookie-date", new Date().toISOString());
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie Consent"
      className="fixed bottom-16 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-in fade-in slide-in-from-bottom duration-300"
      style={{
        background: "var(--surface)",
        border: "1.5px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "1.25rem",
        boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
      }}
      id="cookie-consent-banner"
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem" }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "var(--surface-alt)",
            color: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Cookie size={20} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.25rem" }}>
            <h4 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "0.9375rem", color: "var(--text)" }}>
              We Value Your Privacy
            </h4>
            <button
              onClick={() => handleConsent("essential")}
              aria-label="Dismiss cookie notice"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "var(--text-muted)",
                padding: "2px",
              }}
            >
              <X size={16} />
            </button>
          </div>

          <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", lineHeight: 1.5, marginBottom: "0.875rem" }}>
            HomeFeast uses essential cookies for secure login and preference saving. We never sell your data or use intrusive ad trackers. Read our{" "}
            <Link href="/cookies" style={{ color: "var(--primary)", textDecoration: "underline", fontWeight: 600 }}>
              Cookie Policy
            </Link>.
          </p>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button
              onClick={() => handleConsent("all")}
              className="btn btn-primary"
              style={{ padding: "0.375rem 0.875rem", fontSize: "0.8125rem", minHeight: 34 }}
              id="cookie-accept-all"
            >
              <ShieldCheck size={14} /> Accept All
            </button>
            <button
              onClick={() => handleConsent("essential")}
              className="btn btn-ghost"
              style={{ padding: "0.375rem 0.875rem", fontSize: "0.8125rem", minHeight: 34 }}
              id="cookie-essential-only"
            >
              Essential Only
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
