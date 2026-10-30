"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { X, Sparkles } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

interface SplashScreenProps {
  /** Visible duration before auto-dismiss in milliseconds. Default: 2500ms */
  duration?: number;
  onComplete?: () => void;
}

export default function SplashScreen({
  duration = 2500,
  onComplete,
}: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { theme } = useTheme();

  const isDark = theme === "dark";

  const dismissSplash = useCallback(() => {
    setIsFadingOut(true);
    if (timerRef.current) clearTimeout(timerRef.current);

    setTimeout(() => {
      setIsVisible(false);
      setIsFadingOut(false);
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
      onComplete?.();
    }, 450);
  }, [onComplete]);

  const startAnimation = useCallback(() => {
    setIsVisible(true);
    setIsFadingOut(false);
    setIsReady(false);

    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }

    // Small timeout to allow DOM mount before triggering CSS transitions
    requestAnimationFrame(() => {
      setIsReady(true);
    });

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      dismissSplash();
    }, duration);
  }, [dismissSplash, duration]);

  useEffect(() => {
    startAnimation();

    const handleSplashEvent = () => {
      startAnimation();
    };

    window.addEventListener("homefeast-trigger-splash", handleSplashEvent);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
      window.removeEventListener("homefeast-trigger-splash", handleSplashEvent);
    };
  }, [startAnimation]);

  if (!isVisible) return null;

  return (
    <div
      id="homefeast-splash-overlay"
      onClick={dismissSplash}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999999,
        backgroundColor: isDark ? "#0A0B0E" : "#FAF9F6",
        backgroundImage: isDark
          ? "radial-gradient(circle 800px at 50% 46%, rgba(255, 107, 26, 0.18) 0%, rgba(20, 16, 14, 0.6) 45%, #0A0B0E 80%)"
          : "radial-gradient(circle 800px at 50% 46%, rgba(255, 122, 26, 0.12) 0%, rgba(255, 248, 240, 0.8) 50%, #FAF9F6 85%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        userSelect: "none",
        overflow: "hidden",
        opacity: isFadingOut ? 0 : 1,
        transform: isFadingOut ? "scale(1.02)" : "scale(1)",
        transition: "opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1), transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
        fontFamily: "'Poppins', sans-serif",
      }}
      aria-label="HomeFeast Splash Animation"
      role="dialog"
      aria-modal="true"
    >
      {/* 60 FPS GPU-accelerated CSS animations */}
      <style>{`
        @keyframes hfLogoEntrance {
          0% {
            transform: scale(0.88) translateY(18px);
            opacity: 0;
          }
          60% {
            transform: scale(1.02) translateY(-2px);
            opacity: 1;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
        @keyframes hfBackGlow {
          0%, 100% {
            transform: scale(0.96);
            opacity: 0.55;
          }
          50% {
            transform: scale(1.08);
            opacity: 0.85;
          }
        }
        @keyframes hfSwirlRotate {
          0% {
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(180deg) scale(1.04);
          }
          100% {
            transform: rotate(360deg) scale(1);
          }
        }
        @keyframes hfSteamRiseA {
          0% {
            transform: translateY(0) translateX(0) scaleX(1);
            opacity: 0;
          }
          25% {
            opacity: 0.75;
          }
          100% {
            transform: translateY(-42px) translateX(-6px) scaleX(1.8);
            opacity: 0;
          }
        }
        @keyframes hfSteamRiseB {
          0% {
            transform: translateY(0) translateX(0) scaleX(1);
            opacity: 0;
          }
          25% {
            opacity: 0.85;
          }
          100% {
            transform: translateY(-50px) translateX(4px) scaleX(2.2);
            opacity: 0;
          }
        }
        @keyframes hfSteamRiseC {
          0% {
            transform: translateY(0) translateX(0) scaleX(1);
            opacity: 0;
          }
          25% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(-44px) translateX(9px) scaleX(1.9);
            opacity: 0;
          }
        }
        @keyframes hfSparkFloat {
          0% {
            transform: translate3d(0, 0, 0);
            opacity: 0;
          }
          20% {
            opacity: 0.9;
          }
          80% {
            opacity: 0.7;
          }
          100% {
            transform: translate3d(12px, -150px, 0);
            opacity: 0;
          }
        }
        @keyframes hfProgressBar {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
        @keyframes hfGlowPulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>

      {/* Floating Golden Sparks - Lightweight CSS transforms, zero lag */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        {[
          { left: "18%", top: "75%", size: 4, delay: "0s", duration: "2.8s" },
          { left: "26%", top: "80%", size: 3, delay: "0.5s", duration: "2.4s" },
          { left: "34%", top: "72%", size: 5, delay: "1.1s", duration: "3.0s" },
          { left: "62%", top: "76%", size: 3, delay: "0.2s", duration: "2.6s" },
          { left: "70%", top: "82%", size: 4, delay: "0.8s", duration: "2.9s" },
          { left: "82%", top: "70%", size: 3, delay: "1.4s", duration: "2.5s" },
          { left: "48%", top: "85%", size: 4, delay: "0.4s", duration: "2.7s" },
          { left: "54%", top: "78%", size: 5, delay: "1.6s", duration: "3.2s" },
        ].map((spark, idx) => (
          <div
            key={`spark-${idx}`}
            style={{
              position: "absolute",
              left: spark.left,
              top: spark.top,
              width: spark.size,
              height: spark.size,
              borderRadius: "50%",
              backgroundColor: isDark ? "#FFB300" : "#FF6F00",
              boxShadow: isDark
                ? "0 0 8px #FFA000, 0 0 16px #FF6D00"
                : "0 0 6px #FF6F00",
              animation: `hfSparkFloat ${spark.duration} infinite ease-out`,
              animationDelay: spark.delay,
              willChange: "transform, opacity",
            }}
          />
        ))}
      </div>

      {/* Skip Button */}
      <div
        style={{
          position: "absolute",
          top: "1.5rem",
          right: "1.5rem",
          zIndex: 40,
        }}
        onClick={(e) => {
          e.stopPropagation();
          dismissSplash();
        }}
      >
        <button
          type="button"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.5rem 1.1rem",
            borderRadius: "9999px",
            background: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
            border: isDark ? "1px solid rgba(255, 255, 255, 0.16)" : "1px solid rgba(0, 0, 0, 0.12)",
            color: isDark ? "#FFFFFF" : "#1C1917",
            fontSize: "0.8125rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          }}
          aria-label="Skip Splash Screen"
        >
          <span>Skip Intro</span>
          <X size={14} />
        </button>
      </div>

      {/* Center Cinematic Card */}
      <div
        style={{
          position: "relative",
          zIndex: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          maxWidth: "460px",
          width: "90%",
          padding: "1rem",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Logo and Swirl Stage */}
        <div
          style={{
            position: "relative",
            width: "360px",
            maxWidth: "92vw",
            height: "300px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.25rem",
            animation: "hfLogoEntrance 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}
        >
          {/* Ambient Warm Golden Backlight Glow */}
          <div
            style={{
              position: "absolute",
              width: "280px",
              height: "280px",
              borderRadius: "50%",
              background: isDark
                ? "radial-gradient(circle, rgba(255, 107, 26, 0.32) 0%, rgba(255, 160, 0, 0.14) 45%, transparent 70%)"
                : "radial-gradient(circle, rgba(255, 122, 26, 0.24) 0%, rgba(255, 180, 50, 0.08) 50%, transparent 70%)",
              pointerEvents: "none",
              animation: "hfBackGlow 3s infinite ease-in-out",
              willChange: "transform, opacity",
            }}
          />

          {/* Golden Swirling Ribbon of Light (From the video!) */}
          <div
            style={{
              position: "absolute",
              width: "340px",
              height: "260px",
              pointerEvents: "none",
              animation: "hfSwirlRotate 4.5s infinite linear",
              willChange: "transform",
            }}
          >
            <svg
              viewBox="0 0 340 260"
              style={{
                width: "100%",
                height: "100%",
                overflow: "visible",
              }}
            >
              <defs>
                <linearGradient id="hfSwirlGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFB300" stopOpacity="0" />
                  <stop offset="50%" stopColor="#FF9100" stopOpacity="0.4" />
                  <stop offset="85%" stopColor="#FFD54F" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
                </linearGradient>
              </defs>
              <ellipse
                cx="170"
                cy="130"
                rx="145"
                ry="95"
                fill="none"
                stroke="url(#hfSwirlGradient)"
                strokeWidth="2.5"
                strokeDasharray="220 320"
                strokeLinecap="round"
              />
              {/* Glowing flare orb at the head of the swirl */}
              <circle
                cx="295"
                cy="85"
                r="4.5"
                fill="#FFF9C4"
                style={{
                  filter: "drop-shadow(0 0 8px #FFB300)",
                }}
              />
            </svg>
          </div>

          {/* Steam Micro-particles rising above the Cloche */}
          <div
            style={{
              position: "absolute",
              top: "128px",
              left: "58%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "7px",
              pointerEvents: "none",
              zIndex: 25,
            }}
          >
            <div
              style={{
                width: "3px",
                height: "22px",
                borderRadius: "9999px",
                background: isDark
                  ? "linear-gradient(to top, rgba(255, 167, 38, 0.85), transparent)"
                  : "linear-gradient(to top, rgba(232, 85, 7, 0.8), transparent)",
                animation: "hfSteamRiseA 1.8s infinite ease-out",
              }}
            />
            <div
              style={{
                width: "3.5px",
                height: "28px",
                borderRadius: "9999px",
                background: isDark
                  ? "linear-gradient(to top, rgba(255, 183, 77, 0.95), transparent)"
                  : "linear-gradient(to top, rgba(255, 112, 67, 0.85), transparent)",
                animation: "hfSteamRiseB 1.8s infinite ease-out 0.25s",
              }}
            />
            <div
              style={{
                width: "3px",
                height: "20px",
                borderRadius: "9999px",
                background: isDark
                  ? "linear-gradient(to top, rgba(255, 167, 38, 0.85), transparent)"
                  : "linear-gradient(to top, rgba(232, 85, 7, 0.8), transparent)",
                animation: "hfSteamRiseC 1.8s infinite ease-out 0.5s",
              }}
            />
          </div>

          {/* Crystal Clear, High-Resolution Dual-Theme Logo */}
          {/* In Dark Mode: Crisp Platinum-White & Vibrant Orange */}
          {/* In Light Mode: Deep Rich Slate & Vibrant Orange */}
          <img
            src={isDark ? "/logo-dark.png" : "/logo.png"}
            alt="HomeFeast Fresh Homemade Meals"
            style={{
              width: "320px",
              maxWidth: "84vw",
              height: "auto",
              objectFit: "contain",
              display: "block",
              position: "relative",
              zIndex: 22,
              filter: isDark
                ? "drop-shadow(0 14px 28px rgba(0, 0, 0, 0.9)) drop-shadow(0 0 24px rgba(255, 107, 26, 0.4))"
                : "drop-shadow(0 12px 24px rgba(232, 85, 7, 0.16)) drop-shadow(0 2px 6px rgba(0, 0, 0, 0.06))",
            }}
          />
        </div>

        {/* Sleek Progress Bar Section */}
        <div
          style={{
            width: "300px",
            maxWidth: "85vw",
            display: "flex",
            flexDirection: "column",
            gap: "0.6rem",
            marginTop: "0.5rem",
          }}
        >
          {/* Track */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "5px",
              borderRadius: "9999px",
              background: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)",
              border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(0, 0, 0, 0.05)",
              overflow: "hidden",
            }}
          >
            {/* GPU-accelerated Fill Bar */}
            <div
              style={{
                height: "100%",
                borderRadius: "9999px",
                background: "linear-gradient(90deg, #FF6B00 0%, #FF9800 60%, #FFD54F 100%)",
                boxShadow: "0 0 12px rgba(255, 107, 26, 0.8)",
                animation: isReady ? `hfProgressBar ${duration - 400}ms cubic-bezier(0.2, 0.8, 0.4, 1) forwards` : "none",
                willChange: "width",
              }}
            />
          </div>

          {/* Status Indicators */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: isDark ? "rgba(255, 255, 255, 0.55)" : "#57534E",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
              <Sparkles size={12} color="#FF9800" />
              <span>{isDark ? "Authentic Taste" : "Pure Freshness"}</span>
            </span>
            <span style={{ color: isDark ? "#FFB74D" : "#E65100" }}>
              Delivering Daily
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Hint */}
      <div
        style={{
          position: "absolute",
          bottom: "1.75rem",
          color: isDark ? "rgba(255, 255, 255, 0.35)" : "rgba(28, 25, 23, 0.4)",
          fontSize: "0.74rem",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        Click anywhere to continue
      </div>
    </div>
  );
}
