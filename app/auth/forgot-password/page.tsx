"use client";
import { useState } from "react";
import Link from "next/link";
import { ChefHat, Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch("/api/v1/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "forgot-password", email }),
      });
    } catch {
      // Ignore network errors gracefully and show confirmation
    } finally {
      setLoading(false);
      setSubmitted(true);
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
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "12px",
                background: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <ChefHat size={26} />
            </div>
            <span
              style={{
                fontFamily: "Poppins",
                fontWeight: 800,
                fontSize: "1.5rem",
                color: "var(--text)",
              }}
            >
              Home<span style={{ color: "var(--primary)" }}>Feast</span>
            </span>
          </Link>
        </div>

        <div className="card" style={{ padding: "2.5rem" }}>
          {submitted ? (
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "rgba(47,125,79,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                }}
              >
                <CheckCircle size={36} style={{ color: "var(--secondary)" }} />
              </div>
              <h1
                style={{
                  fontFamily: "Poppins",
                  fontWeight: 700,
                  fontSize: "1.5rem",
                  color: "var(--text)",
                  marginBottom: "0.75rem",
                }}
              >
                Check your email
              </h1>
              <p
                style={{
                  color: "var(--text-muted)",
                  lineHeight: 1.7,
                  marginBottom: "2rem",
                }}
              >
                We sent a password reset link to{" "}
                <strong style={{ color: "var(--text)" }}>{email}</strong>. Click
                the link to create a new password. The link expires in 1 hour.
              </p>
              <Link
                href="/auth/login"
                className="btn btn-primary"
                style={{ width: "100%", justifyContent: "center" }}
                id="back-to-login-btn"
              >
                Back to Sign In
              </Link>
              <p
                style={{
                  marginTop: "1.25rem",
                  fontSize: "0.875rem",
                  color: "var(--text-muted)",
                }}
              >
                Didn't receive the email?{" "}
                <button
                  onClick={() => setSubmitted(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--primary)",
                    fontWeight: 600,
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  Try again
                </button>
              </p>
            </div>
          ) : (
            <>
              <h1
                style={{
                  fontFamily: "Poppins",
                  fontWeight: 700,
                  fontSize: "1.5rem",
                  color: "var(--text)",
                  marginBottom: "0.5rem",
                }}
              >
                Forgot your password?
              </h1>
              <p
                style={{
                  color: "var(--text-muted)",
                  marginBottom: "2rem",
                  lineHeight: 1.6,
                }}
              >
                Enter your email and we'll send you a link to reset your
                password.
              </p>

              <form onSubmit={handleSubmit} noValidate>
                <div style={{ marginBottom: "1.5rem" }}>
                  <label
                    htmlFor="forgot-email"
                    style={{
                      display: "block",
                      fontWeight: 600,
                      fontSize: "0.9375rem",
                      color: "var(--text)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Email Address
                  </label>
                  <div style={{ position: "relative" }}>
                    <Mail
                      size={17}
                      style={{
                        position: "absolute",
                        left: 14,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "var(--text-muted)",
                      }}
                    />
                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="input-base"
                      style={{ paddingLeft: "2.75rem" }}
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <button
                  id="reset-password-btn"
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    fontSize: "1rem",
                    padding: "0.875rem",
                  }}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>

              <div
                style={{
                  textAlign: "center",
                  marginTop: "1.5rem",
                  paddingTop: "1.5rem",
                  borderTop: "1px solid var(--border)",
                }}
              >
                <Link
                  href="/auth/login"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    color: "var(--text-muted)",
                    fontSize: "0.9375rem",
                    fontWeight: 500,
                  }}
                >
                  <ArrowLeft size={16} /> Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
