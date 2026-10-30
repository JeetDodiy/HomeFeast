"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import {
  Sun,
  Moon,
  Menu,
  X,
  ChefHat,
  Bell,
  User,
  LogOut,
  Settings,
  LayoutDashboard,
  Search,
  UtensilsCrossed,
  Calendar,
  DollarSign,
} from "lucide-react";

const navLinks = [
  { label: "Find Cooks", href: "/search" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Plans", href: "/#plans" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Authenticated user state from localStorage
  const [currentUser, setCurrentUser] = useState<{ name: string; role: string; email?: string } | null>(null);

  const syncUser = () => {
    try {
      const stored = localStorage.getItem("hf_user");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      } else {
        setCurrentUser(null);
      }
    } catch {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    syncUser();

    const onAuthChange = () => syncUser();
    window.addEventListener("storage", onAuthChange);
    window.addEventListener("auth-state-changed", onAuthChange);

    return () => {
      window.removeEventListener("storage", onAuthChange);
      window.removeEventListener("auth-state-changed", onAuthChange);
    };
  }, [pathname]);

  const handleLogout = () => {
    try {
      localStorage.removeItem("hf_token");
      localStorage.removeItem("hf_user");
      window.dispatchEvent(new Event("auth-state-changed"));
    } catch {}
    setCurrentUser(null);
    setUserDropdown(false);
    window.location.href = "/";
  };

  const isLoggedIn = !!currentUser;
  const user = currentUser || { name: "Guest User", role: "customer" };

  const [seniorMode, setSeniorMode] = useState(false);

  useEffect(() => {
    const isSenior = typeof window !== "undefined" && localStorage.getItem("homefeast-senior-mode") === "true";
    setSeniorMode(isSenior);
  }, []);

  const toggleSeniorMode = () => {
    const next = !seniorMode;
    setSeniorMode(next);
    if (next) {
      document.documentElement.classList.add("senior-mode");
      localStorage.setItem("homefeast-senior-mode", "true");
    } else {
      document.documentElement.classList.remove("senior-mode");
      localStorage.setItem("homefeast-senior-mode", "false");
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className="navbar"
      style={{
        boxShadow: scrolled ? "0 2px 24px rgba(43,33,24,0.1)" : undefined,
      }}
      aria-label="Main navigation"
    >
      <div className="container-custom" style={{ display: "flex", alignItems: "center", height: "72px", gap: "2rem" }}>
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
            flexShrink: 0,
          }}
          aria-label="HomeFeast Home"
        >
          <img
            src="/logo-icon.png"
            alt="HomeFeast Logo"
            style={{
              width: 44,
              height: 44,
              objectFit: "contain",
              display: "block",
            }}
          />
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 800,
              fontSize: "1.375rem",
              color: "var(--text)",
              letterSpacing: "-0.02em",
            }}
          >
            Home<span style={{ color: "var(--primary)" }}>Feast</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            flex: 1,
          }}
          className="hide-mobile"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              style={{
                padding: "0.5rem 0.875rem",
                borderRadius: "8px",
                color: "var(--text-muted)",
                fontWeight: 500,
                fontSize: "0.9375rem",
                transition: "all 0.2s ease",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--text)";
                e.currentTarget.style.backgroundColor = "var(--surface-alt)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-muted)";
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginLeft: "auto" }}>
          {/* Search icon (mobile) */}
          <Link
            href="/search"
            className="btn btn-ghost"
            style={{ padding: "0.5rem", width: 40, height: 40, borderRadius: "10px" }}
            aria-label="Search cooks"
          >
            <Search size={18} />
          </Link>

          {/* Theme Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="btn btn-ghost"
            style={{ padding: "0.5rem", width: 40, height: 40, borderRadius: "10px" }}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Elderly / Large Text Mode Toggle */}
          <button
            id="senior-mode-btn"
            onClick={toggleSeniorMode}
            className="btn btn-ghost"
            style={{
              padding: "0.25rem 0.5rem",
              height: 40,
              borderRadius: "10px",
              fontSize: "0.8125rem",
              fontWeight: 700,
              backgroundColor: seniorMode ? "var(--surface-alt)" : "transparent",
              color: seniorMode ? "var(--primary)" : "var(--text-muted)",
              border: seniorMode ? "1.5px solid var(--primary)" : "1.5px solid transparent",
            }}
            title={seniorMode ? "Turn off Senior/Large Font Mode" : "Turn on Senior/Large Font Mode"}
            aria-label="Toggle Senior Accessible Text Mode"
          >
            A+
          </button>

          {isLoggedIn ? (
            <>
              {/* Notifications */}
              <button
                className="btn btn-ghost"
                style={{ padding: "0.5rem", width: 40, height: 40, borderRadius: "10px", position: "relative" }}
                aria-label="Notifications"
              >
                <Bell size={18} />
                <span
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "var(--danger)",
                    border: "2px solid var(--surface)",
                  }}
                />
              </button>

              {/* User Avatar/Dropdown */}
              <div style={{ position: "relative" }} ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.375rem 0.75rem 0.375rem 0.375rem",
                    borderRadius: "var(--radius-pill)",
                    border: "1.5px solid var(--border)",
                    background: "var(--surface)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  aria-label="User menu"
                  aria-expanded={userDropdown}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "var(--primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      fontFamily: "Poppins",
                    }}
                  >
                    {user.name[0]}
                  </div>
                  <span
                    style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text)" }}
                    className="hide-mobile"
                  >
                    {user.name.split(" ")[0]}
                  </span>
                </button>

                {userDropdown && (
                  <div className="dropdown" style={{ minWidth: "220px", right: 0 }}>
                    <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--border)" }}>
                      <p style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--text)", margin: 0 }}>{user.name}</p>
                      <p style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: 600, margin: "0.25rem 0 0" }}>
                        {(user.role || "").toLowerCase() === "cook"
                          ? "👨‍🍳 Verified Home Cook"
                          : (user.role || "").toLowerCase() === "admin"
                          ? "🔐 System Administrator"
                          : "🍱 HomeFeast Customer"}
                      </p>
                    </div>

                    {(user.role || "").toLowerCase() === "cook" ? (
                      <>
                        <Link href="/cook/dashboard" onClick={() => setUserDropdown(false)} className="dropdown-item">
                          <LayoutDashboard size={16} /> Cook Dashboard
                        </Link>
                        <Link href="/cook/dashboard?tab=menu" onClick={() => setUserDropdown(false)} className="dropdown-item">
                          <UtensilsCrossed size={16} /> Menu Manager
                        </Link>
                        <Link href="/cook/dashboard?tab=weekly" onClick={() => setUserDropdown(false)} className="dropdown-item">
                          <Calendar size={16} /> Weekly Meal Plan
                        </Link>
                        <Link href="/cook/dashboard?tab=plans" onClick={() => setUserDropdown(false)} className="dropdown-item">
                          <DollarSign size={16} /> Plans & Pricing
                        </Link>
                        <Link href="/cook/dashboard?tab=profile" onClick={() => setUserDropdown(false)} className="dropdown-item">
                          <Settings size={16} /> Kitchen Profile
                        </Link>
                      </>
                    ) : (user.role || "").toLowerCase() === "admin" ? (
                      <Link href="/admin/dashboard" onClick={() => setUserDropdown(false)} className="dropdown-item">
                        <LayoutDashboard size={16} /> Admin Console
                      </Link>
                    ) : (
                      <>
                        <Link href="/customer/dashboard" onClick={() => setUserDropdown(false)} className="dropdown-item">
                          <LayoutDashboard size={16} /> My Tiffins & Orders
                        </Link>
                        <Link href="/customer/dashboard?tab=profile" onClick={() => setUserDropdown(false)} className="dropdown-item">
                          <Settings size={16} /> Account Profile
                        </Link>
                      </>
                    )}

                    <div className="dropdown-divider" />
                    <button
                      onClick={handleLogout}
                      className="dropdown-item"
                      style={{ width: "100%", color: "var(--danger)", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: "flex", gap: "0.625rem", alignItems: "center" }} className="hide-mobile">
              <Link href="/auth/login" className="btn btn-ghost" id="nav-login-btn" style={{ padding: "0.5rem 1.125rem", minHeight: "40px" }}>
                Sign In
              </Link>
              <Link href="/auth/register" className="btn btn-primary" id="nav-register-btn" style={{ padding: "0.5rem 1.25rem", minHeight: "40px" }}>
                Get Started
              </Link>
            </div>
          )}

          {/* Hamburger (mobile) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="btn btn-ghost show-mobile"
            style={{ padding: "0.5rem", width: 40, height: 40, borderRadius: "10px" }}
            aria-label="Toggle mobile menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          style={{
            borderTop: "1px solid var(--border)",
            padding: "1rem",
            backgroundColor: "var(--surface)",
            animation: "fadeInUp 0.2s ease",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                padding: "0.875rem 1rem",
                borderRadius: "var(--radius-sm)",
                color: "var(--text)",
                fontWeight: 500,
                fontSize: "1rem",
                marginBottom: "0.25rem",
              }}
            >
              {link.label}
            </Link>
          ))}

          {isLoggedIn ? (
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem", marginTop: "0.5rem" }}>
              <div style={{ padding: "0.5rem 1rem", marginBottom: "0.5rem" }}>
                <p style={{ fontWeight: 700, color: "var(--text)", margin: 0 }}>{user.name}</p>
                <p style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: 600, margin: "0.125rem 0 0" }}>
                  {(user.role || "").toLowerCase() === "cook"
                    ? "👨‍🍳 Verified Home Cook"
                    : (user.role || "").toLowerCase() === "admin"
                    ? "🔐 System Administrator"
                    : "🍱 HomeFeast Customer"}
                </p>
              </div>

              {(user.role || "").toLowerCase() === "cook" ? (
                <>
                  <Link href="/cook/dashboard" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                    <LayoutDashboard size={16} /> Cook Dashboard
                  </Link>
                  <Link href="/cook/dashboard?tab=menu" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                    <UtensilsCrossed size={16} /> Menu Manager
                  </Link>
                  <Link href="/cook/dashboard?tab=weekly" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                    <Calendar size={16} /> Weekly Meal Plan
                  </Link>
                  <Link href="/cook/dashboard?tab=profile" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                    <Settings size={16} /> Kitchen Profile
                  </Link>
                </>
              ) : (user.role || "").toLowerCase() === "admin" ? (
                <Link href="/admin/dashboard" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                  <LayoutDashboard size={16} /> Admin Console
                </Link>
              ) : (
                <>
                  <Link href="/customer/dashboard" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                    <LayoutDashboard size={16} /> My Tiffins
                  </Link>
                  <Link href="/customer/dashboard?tab=profile" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                    <Settings size={16} /> Profile
                  </Link>
                </>
              )}

              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="dropdown-item"
                style={{ width: "100%", color: "var(--danger)", marginTop: "0.5rem", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          ) : (
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem", marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
              <Link href="/auth/login" className="btn btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={() => setMenuOpen(false)}>
                Sign In
              </Link>
              <Link href="/auth/register" className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={() => setMenuOpen(false)}>
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
