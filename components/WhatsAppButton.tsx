"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const phoneNumber = "919876543210";
  const defaultMessage = encodeURIComponent(
    "Hi HomeFeast! I would like to inquire about homemade tiffin subscriptions."
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <aside
      className="fixed z-40"
      style={{
        bottom: "5rem", // Above mobile bottom nav
        right: "1.25rem",
      }}
      aria-label="Direct Support"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        id="whatsapp-support-btn"
        className="group flex items-center gap-2 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{
          backgroundColor: "#25D366",
          color: "#FFFFFF",
          padding: "0.625rem 1rem",
          fontWeight: 600,
          fontSize: "0.875rem",
          textDecoration: "none",
          boxShadow: "0 4px 18px rgba(37, 211, 102, 0.4)",
        }}
        aria-label="Chat with HomeFeast Support on WhatsApp (opens in new tab)"
        title="Chat on WhatsApp"
      >
        <MessageCircle size={20} className="fill-white stroke-none" />
        <span className="hidden sm:inline font-sans font-medium">WhatsApp Support</span>
      </a>
    </aside>
  );
}
