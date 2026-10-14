import Link from "next/link";
import type { Metadata } from "next";
import { ChefHat, Home } from "lucide-react";

export const metadata: Metadata = {
  title: "404 – Page Not Found | HomeFeast",
};

export default function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
        background: "var(--bg)",
      }}
    >
      <div style={{ fontSize: "7rem", marginBottom: "1rem", lineHeight: 1 }}>🍱</div>
      <h1
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 800,
          fontSize: "6rem",
          color: "var(--primary)",
          lineHeight: 1,
          marginBottom: "0.5rem",
        }}
      >
        404
      </h1>
      <h2
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 700,
          fontSize: "1.75rem",
          color: "var(--text)",
          marginBottom: "1rem",
        }}
      >
        Oops! Page not found
      </h2>
      <p
        style={{
          color: "var(--text-muted)",
          fontSize: "1.0625rem",
          maxWidth: 480,
          lineHeight: 1.7,
          marginBottom: "2.5rem",
        }}
      >
        The page you're looking for seems to have gone out for delivery. Let's get you back to something tasty!
      </p>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/" id="not-found-home-btn" className="btn btn-primary">
          <Home size={18} /> Go Home
        </Link>
        <Link href="/search" id="not-found-search-btn" className="btn btn-outline">
          <ChefHat size={18} /> Find Cooks
        </Link>
      </div>
    </div>
  );
}
