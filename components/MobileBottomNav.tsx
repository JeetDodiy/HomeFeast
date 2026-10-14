"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, User } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Don't show bottom nav on admin routes
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Search", href: "/search", icon: Search },
    { label: "Orders", href: "/customer/dashboard?tab=orders", icon: ShoppingBag },
    { label: "Profile", href: "/customer/dashboard", icon: User },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--surface)] border-t border-[var(--border)] px-4 py-2 flex items-center justify-around shadow-lg transition-colors"
      aria-label="Mobile Navigation"
      id="mobile-bottom-nav"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href.split("?")[0]);

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] text-xs font-medium transition-colors ${
              isActive
                ? "text-[var(--primary)] font-semibold"
                : "text-[var(--text-muted)] hover:text-[var(--text)]"
            }`}
          >
            <Icon size={20} className={isActive ? "stroke-[2.5]" : "stroke-[1.75]"} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
