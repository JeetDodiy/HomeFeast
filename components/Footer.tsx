"use client";
import Link from "next/link";
import { ChefHat, Mail, Phone, MapPin, Globe, Camera, MessageCircle, Play } from "lucide-react";

const footerLinks = {
  Company: [
    { label: "About Us", href: "/about" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Our Story", href: "/about#story" },
    { label: "Contact Us", href: "/contact" },
  ],
  "For Customers": [
    { label: "Find Nearby Cooks", href: "/search" },
    { label: "Subscription Plans", href: "/#plans" },
    { label: "My Orders & Tiffins", href: "/customer/dashboard?tab=orders" },
    { label: "Customer Support", href: "/contact" },
    { label: "Hygiene Standards", href: "/fssai" },
  ],
  "For Home Cooks": [
    { label: "Join as a Home Cook", href: "/cook/register" },
    { label: "Cook Dashboard", href: "/cook/dashboard" },
    { label: "FSSAI Assistance", href: "/fssai" },
    { label: "Cook Support", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Refund & Cancellation", href: "/refund" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "FSSAI Compliance", href: "/fssai" },
  ],
};

const socialLinks = [
  { icon: Globe, label: "Facebook", href: "#" },
  { icon: Camera, label: "Instagram", href: "#" },
  { icon: MessageCircle, label: "Twitter / X", href: "#" },
  { icon: Play, label: "YouTube", href: "#" },
];

const cities = ["Rajkot", "Ahmedabad", "Surat", "Vadodara", "Gandhinagar"];

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "var(--surface)",
        borderTop: "1px solid var(--border)",
        marginTop: "auto",
      }}
    >
      {/* Main Footer */}
      <div className="container-custom" style={{ padding: "4rem 1.5rem 2rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2.5rem",
          }}
        >
          {/* Brand Column */}
          <div style={{ gridColumn: "span 1" }}>
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                textDecoration: "none",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "10px",
                  background: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <ChefHat size={22} />
              </div>
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 800,
                  fontSize: "1.25rem",
                  color: "var(--text)",
                }}
              >
                Home<span style={{ color: "var(--primary)" }}>Feast</span>
              </span>
            </Link>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>
              Connecting you with trusted home cooks for fresh, hygienic, and affordable homemade meals delivered to your door.
            </p>
            {/* Contact */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              <a href="mailto:support@homefeast.in" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", fontSize: "0.875rem", textDecoration: "none" }}>
                <Mail size={15} style={{ color: "var(--primary)", flexShrink: 0 }} />
                support@homefeast.in
              </a>
              <a href="tel:+919876543210" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", fontSize: "0.875rem", textDecoration: "none" }}>
                <Phone size={15} style={{ color: "var(--primary)", flexShrink: 0 }} />
                +91 98765 43210
              </a>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                <MapPin size={15} style={{ color: "var(--primary)", flexShrink: 0 }} />
                Rajkot & Ahmedabad, Gujarat, India
              </div>
            </div>
            {/* Social */}
            <div style={{ display: "flex", gap: "0.625rem", marginTop: "1.25rem" }}>
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "8px",
                    border: "1.5px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-muted)",
                    transition: "all 0.2s ease",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--primary)";
                    e.currentTarget.style.color = "var(--primary)";
                    e.currentTarget.style.background = "rgba(232,101,10,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.color = "var(--text-muted)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 700,
                  fontSize: "0.9375rem",
                  color: "var(--text)",
                  marginBottom: "1rem",
                }}
              >
                {category}
              </h3>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "0.875rem",
                        textDecoration: "none",
                        transition: "color 0.2s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Cities */}
        <div
          style={{
            marginTop: "2.5rem",
            paddingTop: "2rem",
            borderTop: "1px solid var(--border)",
          }}
        >
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "0.75rem", fontWeight: 600 }}>
            🏙️ Cities We Serve:
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {cities.map((city) => (
              <Link
                key={city}
                href={`/search?city=${city}`}
                style={{
                  padding: "0.25rem 0.875rem",
                  borderRadius: "var(--radius-pill)",
                  border: "1px solid var(--border)",
                  fontSize: "0.8125rem",
                  color: "var(--text-muted)",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  backgroundColor: "var(--surface-alt)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--primary)";
                  e.currentTarget.style.color = "var(--primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.color = "var(--text-muted)";
                }}
              >
                {city}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          padding: "1.5rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          backgroundColor: "var(--surface-alt)",
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "0.75rem" }}>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} HomeFeast Technologies Pvt. Ltd. All rights reserved. Made with ❤️ in India.
          </p>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
            FSSAI License: 10020042003854 | DPDP Act 2023 Compliant
          </p>
        </div>
        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", opacity: 0.85, margin: 0 }}>
          CIN: U72900GJ2026PTC148920 · Regd. Office: 302, Silicon Hub, Race Course Road, Rajkot, Gujarat - 360001 · Grievance Officer: Mr. Rajesh Vora (grievance@homefeast.in)
        </p>
      </div>
    </footer>
  );
}
