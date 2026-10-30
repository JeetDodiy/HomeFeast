"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Star,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Smartphone,
  ShieldCheck,
  Clock,
  ChefHat,
  Leaf,
  TrendingUp,
  ArrowRight,
  Play,
  Pause,
  Quote,
  Plus,
  Minus,
  MessageCircle,
  Sparkles,
  Image as ImageIcon,
  Flame,
  RefreshCw,
  X,
  Upload,
  Check,
} from "lucide-react";
import { COOKS, TESTIMONIALS, STATS, FAQS, CUISINES, CITIES } from "@/lib/mockData";

// ── Hero Dish Carousel Data ──────────────────────────────────
export const HERO_DISHES = [
  {
    id: "kathiyawadi",
    category: "Kathiyawadi",
    name: "Kathiyawadi Thali & Ringan Olo",
    subtitle: "Smoky Bajra Rotlo, White Makhan & Desi Kadhi",
    cook: "Meenaben Patel",
    city: "Rajkot",
    price: "₹120",
    rating: "4.9",
    reviews: "3,240+",
    tag: "🔥 Today's Bestseller",
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=900&q=80",
    badge: "Traditional Chula Cooked",
    color: "#e8650a",
  },
  {
    id: "punjabi",
    category: "Punjabi",
    name: "Dal Makhani & Shahi Paneer",
    subtitle: "Slow-simmered Black Lentils & Butter Phulkas",
    cook: "Harpreet Kaur",
    city: "Ahmedabad",
    price: "₹140",
    rating: "4.8",
    reviews: "2,890+",
    tag: "👑 Chef's Signature",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=900&q=80",
    badge: "100% Pure Desi Ghee",
    color: "#f59e0b",
  },
  {
    id: "gujarati",
    category: "Gujarati",
    name: "Surati Daily Ghar Ka Dabba",
    subtitle: "Sev Tameta Shaak, Fulka Roti, Gujarati Dal & Bhath",
    cook: "Bhavikbhai S.",
    city: "Surat",
    price: "₹100",
    rating: "4.9",
    reviews: "4,120+",
    tag: "🥗 Zero Soda & Low Oil",
    image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=900&q=80",
    badge: "Mom's Authentic Recipe",
    color: "#16a34a",
  },
  {
    id: "south-indian",
    category: "South Indian",
    name: "Crispy Masala Dosa & Sambar Feast",
    subtitle: "Stone-Ground Batter, Coconut Chutney & Medu Vada",
    cook: "Laxmi Amma",
    city: "Vadodara",
    price: "₹110",
    rating: "4.9",
    reviews: "1,980+",
    tag: "🥥 Freshly Steamed",
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=900&q=80",
    badge: "Traditional Filter Kaapi Friendly",
    color: "#2563eb",
  },
  {
    id: "satvik",
    category: "Satvik Jain",
    name: "Satvik Royal Jain Thali",
    subtitle: "No Onion, No Garlic, Made with Pure Devotion",
    cook: "Rekhaben Shah",
    city: "Ahmedabad",
    price: "₹130",
    rating: "5.0",
    reviews: "2,450+",
    tag: "✨ Pure Jain Rasoi",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=900&q=80",
    badge: "Strict Jain Rules Followed",
    color: "#8b5cf6",
  },
  {
    id: "biryani",
    category: "Hyderabadi",
    name: "Claypot Dum Handi Pulao / Biryani",
    subtitle: "Long-grain Basmati, Golden Fried Onions & Raita",
    cook: "Zubair Ahmed",
    city: "Surat",
    price: "₹150",
    rating: "4.8",
    reviews: "3,110+",
    tag: "🌶️ Aromatic Spices",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=900&q=80",
    badge: "Slow Dum on Woodfire",
    color: "#ea580c",
  },
];

// ── How It Works Steps ───────────────────────────────────────
const HOW_IT_WORKS = [
  {
    step: "01",
    icon: Search,
    title: "Find Your Cook",
    desc: "Browse verified home cooks near you. Filter by cuisine, diet, price, and meal plan.",
    color: "var(--primary)",
  },
  {
    step: "02",
    icon: ChefHat,
    title: "Choose a Plan",
    desc: "Pick daily, weekly, or monthly tiffin plan that fits your schedule and budget.",
    color: "var(--secondary)",
  },
  {
    step: "03",
    icon: Clock,
    title: "Fresh Delivery",
    desc: "Your cook prepares fresh food and delivers at your chosen time slot, every day.",
    color: "var(--accent)",
  },
];

// ── Plans Section Data ────────────────────────────────────────
const PLAN_FEATURES = [
  { feature: "Daily fresh meals", daily: true, weekly: true, monthly: true },
  { feature: "Home delivery", daily: true, weekly: true, monthly: true },
  { feature: "Veg / Non-veg choice", daily: true, weekly: true, monthly: true },
  { feature: "Skip meals", daily: false, weekly: true, monthly: true },
  { feature: "Pause subscription", daily: false, weekly: false, monthly: true },
  { feature: "Weekend specials", daily: false, weekly: true, monthly: true },
  { feature: "Priority support", daily: false, weekly: false, monthly: true },
];

// ── Star Rating Component ─────────────────────────────────────
function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={14}
          fill={n <= Math.round(rating) ? "var(--accent)" : "none"}
          style={{ color: n <= Math.round(rating) ? "var(--accent)" : "var(--border)" }}
        />
      ))}
    </div>
  );
}

// ── Cook Card ─────────────────────────────────────────────────
function CookCard({ cook }: { cook: (typeof COOKS)[0] }) {
  return (
    <Link href={`/cooks/${cook.id}`} style={{ textDecoration: "none" }}>
      <div className="cook-card">
        {/* Cover Image */}
        <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
          <img
            src={cook.coverImage}
            alt={cook.kitchenName}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              display: "flex",
              gap: "0.375rem",
            }}
          >
            <span className={`badge ${cook.isVeg ? "badge-veg" : "badge-nonveg"}`}>
              <span className={cook.isVeg ? "veg-dot" : "nonveg-dot"} />
              {cook.isVeg ? "Pure Veg" : "Non-Veg"}
            </span>
          </div>
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              background: "rgba(0,0,0,0.7)",
              color: "white",
              borderRadius: "8px",
              padding: "0.25rem 0.5rem",
              fontSize: "0.8125rem",
              fontWeight: 700,
              fontFamily: "Poppins",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Star size={12} fill="var(--accent)" style={{ color: "var(--accent)" }} />
            {cook.rating}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.5rem" }}>
            <img
              src={cook.avatar}
              alt={cook.name}
              style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--border)" }}
            />
            <div>
              <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1rem", color: "var(--text)", margin: 0 }}>
                {cook.kitchenName}
              </h3>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: 0 }}>{cook.name}</p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.75rem" }}>
            <MapPin size={13} style={{ color: "var(--primary)", flexShrink: 0 }} />
            <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{cook.area}</span>
          </div>

          <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap", marginBottom: "0.875rem" }}>
            {cook.cuisines.map((c) => {
              const cuisine = CUISINES.find((x) => x.id === c);
              return cuisine ? (
                <span key={c} className="badge" style={{ background: "var(--surface-alt)", color: "var(--text-muted)", fontSize: "0.7375rem" }}>
                  {cuisine.emoji} {cuisine.name}
                </span>
              ) : null;
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.125rem", color: "var(--primary)" }}>
                ₹{Math.min(...cook.plans.map((p) => p.price))}
              </span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>/day onwards</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Stars rating={cook.rating} />
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>({cook.totalReviews})</span>
            </div>
          </div>

          <div
            style={{
              marginTop: "0.875rem",
              padding: "0.625rem",
              background: "var(--surface-alt)",
              borderRadius: "8px",
              fontSize: "0.8125rem",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Clock size={13} style={{ color: "var(--secondary)" }} />
            {cook.deliverySlots[0]}
            {cook.deliverySlots[1] && ` · ${cook.deliverySlots[1]}`}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── FAQ Item ──────────────────────────────────────────────────
function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        border: "1.5px solid var(--border)",
        borderRadius: "var(--radius)",
        overflow: "hidden",
        transition: "border-color 0.2s ease",
        borderColor: open ? "var(--primary)" : "var(--border)",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        id={`faq-${index}`}
        aria-expanded={open}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.25rem",
          background: open ? "var(--surface-alt)" : "var(--surface)",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          gap: "1rem",
        }}
      >
        <span style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: "1rem", color: "var(--text)" }}>{q}</span>
        {open ? (
          <Minus size={18} style={{ color: "var(--primary)", flexShrink: 0 }} />
        ) : (
          <Plus size={18} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
        )}
      </button>
      {open && (
        <div
          style={{
            padding: "0 1.25rem 1.25rem",
            background: "var(--surface-alt)",
            color: "var(--text-muted)",
            fontSize: "0.9375rem",
            lineHeight: 1.7,
            animation: "fadeInUp 0.2s ease",
          }}
        >
          {a}
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function HomePage() {
  const [searchCity, setSearchCity] = useState("");
  const [searchMealType, setSearchMealType] = useState("all");

  // Hero carousel & custom image switcher state
  const [activeDishIndex, setActiveDishIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [featuredCooks, setFeaturedCooks] = useState<any[]>(COOKS);

  // Sync registered cooks into featured cooks section from both localStorage & PostgreSQL API
  useEffect(() => {
    const normalizeKitchenName = (name: string) =>
      (name || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");

    const deduplicateCooks = (cooksList: any[]) => {
      const seenNames = new Set<string>();
      const seenIds = new Set<string>();
      const uniqueList: any[] = [];

      for (const c of cooksList) {
        if (!c) continue;
        const normName = normalizeKitchenName(c.kitchenName || c.name || "");
        const cookId = (c.id || "").toString();

        if (normName && seenNames.has(normName)) continue;
        if (cookId && seenIds.has(cookId)) continue;

        if (normName) seenNames.add(normName);
        if (cookId) seenIds.add(cookId);

        // Deduplicate this cook's plans by type
        const seenPlanTypes = new Set<string>();
        const uniquePlans: any[] = [];
        if (Array.isArray(c.plans)) {
          for (const p of c.plans) {
            const pType = (p.type || p.name || "").toString().toLowerCase();
            if (!seenPlanTypes.has(pType)) {
              seenPlanTypes.add(pType);
              uniquePlans.push(p);
            }
          }
        }

        uniqueList.push({
          ...c,
          plans: uniquePlans.length > 0 ? uniquePlans : c.plans,
        });
      }
      return uniqueList;
    };

    if (typeof window !== "undefined") {
      let initialList = [...COOKS];
      try {
        const stored = localStorage.getItem("hf_registered_cooks");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            initialList = [...parsed, ...COOKS];
          }
        }
      } catch {}

      setFeaturedCooks(deduplicateCooks(initialList));

      // Fetch from PostgreSQL backend (highest priority - real database data)
      fetch("/api/v1/cooks")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            let userLocal: any[] = [];
            try {
              const stored = localStorage.getItem("hf_registered_cooks");
              if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) userLocal = parsed;
              }
            } catch {}
            setFeaturedCooks(deduplicateCooks([...userLocal, ...data.data]));
          }
        })
        .catch(() => {});
    }
  }, []);

  // ── Dynamic Kitchen Plans & Auto-Change State ─────────────────
  const [selectedKitchenFilter, setSelectedKitchenFilter] = useState<string>("all");
  const [selectedDurationFilter, setSelectedDurationFilter] = useState<string>("all");
  const [planSlideIndex, setPlanSlideIndex] = useState(0);
  const [isPlanAutoRotating, setIsPlanAutoRotating] = useState(true);
  const [isPlanHovered, setIsPlanHovered] = useState(false);
  const [planProgressPercent, setPlanProgressPercent] = useState(0);

  // Extract all dynamic plans from all active kitchens - STRICTLY ONE PLAN PER DURATION PER KITCHEN
  const allKitchenPlans = useMemo(() => {
    const list: any[] = [];
    const seenKitchenPlanTypes = new Set<string>();

    (featuredCooks || []).forEach((cook) => {
      if (cook.plans && Array.isArray(cook.plans) && cook.plans.length > 0) {
        cook.plans.forEach((plan: any) => {
          const typeLower = (plan.type || "weekly").toLowerCase();
          const normKitchen = (cook.kitchenName || cook.name || cook.id || "")
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "");

          // Composite key: kitchen name + plan duration type
          const compositeKey = `${normKitchen}_${typeLower}`;
          if (seenKitchenPlanTypes.has(compositeKey)) {
            return; // Skip duplicate copy!
          }
          seenKitchenPlanTypes.add(compositeKey);

          const savings =
            typeLower === "monthly"
              ? "Save up to 17%"
              : typeLower === "weekly"
              ? "Save up to 11%"
              : "Flexible Daily";

          list.push({
            cookId: cook.id,
            cookName: cook.name || cook.kitchenName,
            kitchenName: cook.kitchenName || cook.name,
            avatar: cook.avatar || cook.coverImage || "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
            rating: cook.rating || 4.9,
            totalReviews: cook.totalReviews || 120,
            city: cook.city || "Rajkot",
            area: cook.area || "City Center",
            cuisines: cook.cuisines || ["Gujarati"],
            isVeg: cook.isVeg !== undefined ? cook.isVeg : true,
            planId: plan.id,
            planType: typeLower,
            label: plan.label || plan.name || `${typeLower.toUpperCase()} Plan`,
            price: Number(plan.price) || 120,
            perMeal: Number(plan.perMeal) || Math.round((Number(plan.price) || 120) / (typeLower === "monthly" ? 30 : typeLower === "weekly" ? 7 : 1)),
            period: typeLower === "monthly" ? "/month" : typeLower === "weekly" ? "/week" : "/day",
            savings,
            popular: Boolean(plan.popular || typeLower === "weekly"),
            description: plan.description || "Fresh home-cooked hygienic meals prepared with love.",
            includes: Array.isArray(plan.includes) && plan.includes.length > 0
              ? plan.includes
              : ["Fresh Sabzi", "Dal/Kadhi", "Fresh Phulkas", "Rice/Khichdi", "Salad & Chutney"],
            specialItem: cook.weeklyMenu ? ((Object.values(cook.weeklyMenu) as any[])[0] || [])[0] : "Desi Homestyle Special",
          });
        });
      }
    });
    return list;
  }, [featuredCooks]);

  // Unique list of kitchens for the filter bar
  const availableKitchens = useMemo(() => {
    const seenNames = new Set<string>();
    const list: { id: string; name: string }[] = [];
    allKitchenPlans.forEach((p) => {
      const normKitchen = p.kitchenName.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
      if (!seenNames.has(normKitchen)) {
        seenNames.add(normKitchen);
        list.push({ id: p.cookId, name: p.kitchenName });
      }
    });
    return list;
  }, [allKitchenPlans]);

  // Dynamic slides grouping: filtered by kitchen and duration, chunked into sets of 3
  const planSlides = useMemo(() => {
    let filtered = allKitchenPlans;
    if (selectedKitchenFilter !== "all") {
      filtered = filtered.filter(
        (p) =>
          p.cookId === selectedKitchenFilter ||
          p.kitchenName?.trim().toLowerCase() === selectedKitchenFilter.trim().toLowerCase()
      );
    }
    if (selectedDurationFilter !== "all") {
      filtered = filtered.filter((p) => p.planType === selectedDurationFilter);
    }

    const chunkSize = 3;
    const slides: any[][] = [];
    for (let i = 0; i < filtered.length; i += chunkSize) {
      slides.push(filtered.slice(i, i + chunkSize));
    }
    return slides.length > 0 ? slides : [[]];
  }, [allKitchenPlans, selectedKitchenFilter, selectedDurationFilter]);

  // Auto-change algorithm effect (5.5 seconds per slide rotation)
  useEffect(() => {
    if (!isPlanAutoRotating || isPlanHovered || planSlides.length <= 1) {
      return;
    }

    const intervalStep = 50;
    const totalDuration = 5500;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += intervalStep;
      setPlanProgressPercent(Math.min((elapsed / totalDuration) * 100, 100));

      if (elapsed >= totalDuration) {
        elapsed = 0;
        setPlanSlideIndex((prev) => (prev + 1) % planSlides.length);
        setPlanProgressPercent(0);
      }
    }, intervalStep);

    return () => clearInterval(timer);
  }, [isPlanAutoRotating, isPlanHovered, planSlides.length]);

  // Reset index when filter changes
  useEffect(() => {
    setPlanSlideIndex(0);
    setPlanProgressPercent(0);
  }, [selectedKitchenFilter, selectedDurationFilter]);

  const handlePrevPlanSlide = () => {
    setPlanSlideIndex((prev) => (prev - 1 + planSlides.length) % planSlides.length);
    setPlanProgressPercent(0);
  };

  const handleNextPlanSlide = () => {
    setPlanSlideIndex((prev) => (prev + 1) % planSlides.length);
    setPlanProgressPercent(0);
  };

  // Auto-rotation timer with smooth progress line (5 seconds per slide)
  useEffect(() => {
    if (!isAutoRotating || customImage) {
      setProgressPercent(0);
      return;
    }

    const intervalStep = 50;
    const totalDuration = 5000;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += intervalStep;
      setProgressPercent(Math.min((elapsed / totalDuration) * 100, 100));

      if (elapsed >= totalDuration) {
        elapsed = 0;
        setActiveDishIndex((prev) => (prev + 1) % HERO_DISHES.length);
        setProgressPercent(0);
      }
    }, intervalStep);

    return () => clearInterval(timer);
  }, [isAutoRotating, customImage, activeDishIndex]);

  const activeDish = HERO_DISHES[activeDishIndex];
  const displayImage = customImage || activeDish.image;

  const handlePrevDish = () => {
    setCustomImage(null);
    setActiveDishIndex((prev) => (prev - 1 + HERO_DISHES.length) % HERO_DISHES.length);
    setProgressPercent(0);
  };

  const handleNextDish = () => {
    setCustomImage(null);
    setActiveDishIndex((prev) => (prev + 1) % HERO_DISHES.length);
    setProgressPercent(0);
  };

  const handleSelectDish = (index: number) => {
    setCustomImage(null);
    setActiveDishIndex(index);
    setProgressPercent(0);
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrlInput.trim()) {
      setCustomImage(customUrlInput.trim());
      setIsAutoRotating(false);
      setShowImageModal(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setCustomImage(reader.result);
          setIsAutoRotating(false);
          setShowImageModal(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetCarousel = () => {
    setCustomImage(null);
    setIsAutoRotating(true);
    setShowImageModal(false);
  };

  return (
    <>
      {/* ===== HERO SECTION (FULL WIDTH & EXPANSIVE) ===== */}
      <section
        className="hero-gradient"
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "clamp(3rem, 5vw, 4.75rem) 0 clamp(3.5rem, 5.5vw, 5rem)",
          display: "flex",
          alignItems: "center",
          background: "radial-gradient(ellipse 65% 55% at 75% 35%, rgba(232, 101, 10, 0.14) 0%, transparent 60%), radial-gradient(circle at 10% 85%, rgba(46, 125, 50, 0.1) 0%, transparent 50%), linear-gradient(180deg, var(--surface-alt) 0%, var(--bg) 100%)",
        }}
      >
        {/* Animated ambient backdrop elements */}
        <div
          className="hero-blob glow-aura"
          style={{ width: 620, height: 620, background: "var(--primary)", top: -120, right: -100, opacity: 0.18 }}
        />
        <div
          className="hero-blob float-slow"
          style={{ width: 440, height: 440, background: "var(--secondary)", bottom: -80, left: -60, opacity: 0.14 }}
        />

        <div className="container-wide" style={{ position: "relative", zIndex: 1, width: "100%" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.05fr 1fr",
              gap: "clamp(2rem, 3.5vw, 4.5rem)",
              alignItems: "center",
            }}
            className="hero-grid"
          >
            {/* Left Content */}
            <div>
              <div className="section-tag animate-fadeInUp" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                <img src="/logo-icon.png" alt="HomeFeast" style={{ width: 20, height: 20, objectFit: "contain" }} />
                <span>HomeFeast · Fresh Homemade Meals Delivered Daily</span>
              </div>

              <h1
                className="animate-fadeInUp delay-100"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "clamp(2.4rem, 4.2vw, 3.85rem)",
                  fontWeight: 800,
                  color: "var(--text)",
                  marginBottom: "1.25rem",
                  lineHeight: 1.14,
                  letterSpacing: "-0.02em",
                }}
              >
                Fresh{" "}
                <span style={{ color: "var(--primary)", position: "relative" }}>
                  Homemade
                  <svg style={{ position: "absolute", bottom: -6, left: 0, width: "100%" }} viewBox="0 0 200 12" fill="none">
                    <path d="M2 8 C50 2, 150 2, 198 8" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" opacity="0.45" />
                  </svg>
                </span>{" "}
                Meals,{" "}
                <span style={{ color: "var(--secondary)" }}>Delivered Daily</span>
              </h1>

              <p
                className="animate-fadeInUp delay-200"
                style={{
                  fontSize: "clamp(1rem, 1.2vw, 1.15rem)",
                  color: "var(--text-muted)",
                  marginBottom: "1.85rem",
                  lineHeight: 1.75,
                  maxWidth: 580,
                }}
              >
                Connect with verified home cooks near you offering hygienic, affordable,
                and nutritious daily tiffin subscriptions — prepared fresh with pure ghee and zero soda for students, professionals, and families.
              </p>

              {/* Trust Badges */}
              <div
                className="animate-fadeInUp delay-300"
                style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "2rem" }}
              >
                {[
                  { icon: ShieldCheck, text: "FSSAI Verified Cooks" },
                  { icon: Clock, text: "On-Time Dabba Delivery" },
                  { icon: Leaf, text: "Healthy & Hygienic" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Icon size={17} style={{ color: "var(--secondary)" }} />
                    <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text)" }}>{text}</span>
                  </div>
                ))}
              </div>

              {/* Search Bar */}
              <div className="animate-fadeInUp delay-400">
                <div
                  style={{
                    background: "var(--surface)",
                    border: "1.5px solid var(--border)",
                    borderRadius: "18px",
                    padding: "0.625rem",
                    display: "flex",
                    gap: "0.75rem",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flex: 1, minWidth: "160px", padding: "0.25rem 0.75rem" }}>
                    <MapPin size={20} style={{ color: "var(--primary)", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <label htmlFor="hero-city-select" style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0, marginBottom: "2px", display: "block" }}>
                        Location / City
                      </label>
                      <select
                        id="hero-city-select"
                        value={searchCity}
                        onChange={(e) => setSearchCity(e.target.value)}
                        style={{
                          width: "100%",
                          border: "none",
                          background: "transparent",
                          color: "var(--text)",
                          fontSize: "0.9375rem",
                          fontWeight: 600,
                          outline: "none",
                          cursor: "pointer",
                          fontFamily: "Inter, sans-serif",
                          padding: 0,
                        }}
                        aria-label="Select city"
                      >
                        <option value="">All Cities in Gujarat</option>
                        {CITIES.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div style={{ width: "1px", height: "36px", background: "var(--border)" }} className="hide-mobile" />
                  <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flex: 1, minWidth: "160px", padding: "0.25rem 0.75rem" }}>
                    <ChefHat size={20} style={{ color: "var(--primary)", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <label htmlFor="hero-mealtype-select" style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0, marginBottom: "2px", display: "block" }}>
                        Diet / Meal
                      </label>
                      <select
                        id="hero-mealtype-select"
                        value={searchMealType}
                        onChange={(e) => setSearchMealType(e.target.value)}
                        style={{
                          width: "100%",
                          border: "none",
                          background: "transparent",
                          color: "var(--text)",
                          fontSize: "0.9375rem",
                          fontWeight: 600,
                          outline: "none",
                          cursor: "pointer",
                          fontFamily: "Inter, sans-serif",
                          padding: 0,
                        }}
                        aria-label="Select meal type"
                      >
                        <option value="all">All Meals (Veg & Non-Veg)</option>
                        <option value="veg">Pure Vegetarian Only</option>
                        <option value="nonveg">Non-Veg Friendly</option>
                        <option value="jain">Jain Friendly</option>
                      </select>
                    </div>
                  </div>
                  <Link
                    href={`/search?city=${searchCity}&type=${searchMealType}`}
                    id="hero-search-btn"
                    className="btn btn-primary"
                    style={{ padding: "0.875rem 1.75rem", fontSize: "0.95rem", flexShrink: 0 }}
                  >
                    <Search size={18} />
                    <span>Search Cooks</span>
                  </Link>
                </div>

                {/* Quick Links */}
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.875rem", flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>Popular:</span>
                  {CITIES.slice(0, 3).map((c) => (
                    <Link
                      key={c.id}
                      href={`/search?city=${c.id}`}
                      style={{
                        fontSize: "0.8125rem",
                        color: "var(--primary)",
                        fontWeight: 600,
                        borderBottom: "1px dashed var(--primary)",
                      }}
                    >
                      {c.name}
                    </Link>
                  ))}
                  {CUISINES.slice(0, 3).map((c) => (
                    <Link
                      key={c.id}
                      href={`/search?cuisine=${c.id}`}
                      style={{
                        fontSize: "0.8125rem",
                        color: "var(--primary)",
                        fontWeight: 600,
                        borderBottom: "1px dashed var(--primary)",
                      }}
                    >
                      {c.emoji} {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right – Interactive Dynamic Food Showcase & Custom Image Carousel */}
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
              }}
              className="hide-mobile"
            >
              {/* Interactive Showcase Toolbar */}
              <div
                style={{
                  width: "100%",
                  maxWidth: 520,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                  gap: "0.5rem",
                  flexWrap: "wrap",
                }}
              >
                {/* Category selector pills */}
                <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                  {HERO_DISHES.map((dish, idx) => {
                    const isSelected = activeDishIndex === idx && !customImage;
                    return (
                      <button
                        key={dish.id}
                        onClick={() => handleSelectDish(idx)}
                        style={{
                          padding: "0.3rem 0.65rem",
                          borderRadius: "999px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          border: isSelected ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                          background: isSelected ? "var(--primary)" : "var(--surface)",
                          color: isSelected ? "#fff" : "var(--text-muted)",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {dish.category}
                      </button>
                    );
                  })}
                </div>

                {/* Auto-rotate and Custom Image controls */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <button
                    onClick={() => setIsAutoRotating(!isAutoRotating)}
                    title={isAutoRotating ? "Pause Auto-Rotation" : "Resume Auto-Rotation"}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      border: "1px solid var(--border)",
                      background: "var(--surface)",
                      color: "var(--text)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {isAutoRotating ? <Pause size={14} /> : <Play size={14} />}
                  </button>

                  <button
                    onClick={() => setShowImageModal(true)}
                    title="Change front image or upload your own"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      padding: "0.35rem 0.75rem",
                      borderRadius: "999px",
                      border: customImage ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                      background: customImage ? "var(--primary)" : "var(--surface)",
                      color: customImage ? "#fff" : "var(--text)",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <ImageIcon size={14} />
                    <span>{customImage ? "Custom Active" : "Change Image"}</span>
                  </button>
                </div>
              </div>

              {/* Central Dish Plate Stage */}
              <div
                style={{
                  position: "relative",
                  width: "clamp(340px, 32vw, 480px)",
                  height: "clamp(340px, 32vw, 480px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Glowing neon aura behind plate */}
                <div
                  className="glow-aura"
                  style={{
                    position: "absolute",
                    inset: "-16px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(232, 101, 10, 0.45) 0%, rgba(245, 158, 11, 0.2) 50%, transparent 75%)",
                    filter: "blur(24px)",
                    pointerEvents: "none",
                  }}
                />

                {/* Main circular dish plate */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "6px solid var(--surface)",
                    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.25)",
                    background: "#000",
                  }}
                >
                  <img
                    key={displayImage}
                    src={displayImage}
                    alt={activeDish.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.5s ease",
                      animation: "fadeIn 0.5s ease",
                    }}
                  />

                  {/* Auto-slide progress line */}
                  {isAutoRotating && !customImage && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        height: "4px",
                        width: `${progressPercent}%`,
                        background: "var(--primary)",
                        transition: "width 50ms linear",
                        zIndex: 4,
                      }}
                    />
                  )}

                  {/* Dish Caption Overlay */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: "linear-gradient(to top, rgba(0, 0, 0, 0.92) 0%, rgba(0, 0, 0, 0.6) 65%, transparent 100%)",
                      padding: "1.75rem 1.25rem 1.15rem",
                      color: "#fff",
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      zIndex: 2,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "#f59e0b",
                        marginBottom: "3px",
                      }}
                    >
                      {customImage ? "✨ Custom Front Showcase" : activeDish.tag}
                    </span>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "1.05rem",
                        fontWeight: 700,
                        color: "#fff",
                        lineHeight: 1.25,
                      }}
                    >
                      {customImage ? "Your Custom Selected Dish" : activeDish.name}
                    </h3>
                    <p style={{ margin: "3px 0 0", fontSize: "0.8rem", opacity: 0.85, color: "#e2e8f0" }}>
                      {customImage ? "Tap 'Change Image' anytime to reset or switch" : `By ${activeDish.cook} • ${activeDish.city}`}
                    </p>
                  </div>
                </div>

                {/* Left navigation arrow */}
                <button
                  onClick={handlePrevDish}
                  aria-label="Previous Dish"
                  style={{
                    position: "absolute",
                    left: "-18px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    border: "1.5px solid var(--border)",
                    background: "var(--surface)",
                    color: "var(--text)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
                    zIndex: 10,
                    transition: "transform 0.2s ease, background 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-50%) scale(1.1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(-50%) scale(1.0)")}
                >
                  <ChevronLeft size={22} />
                </button>

                {/* Right navigation arrow */}
                <button
                  onClick={handleNextDish}
                  aria-label="Next Dish"
                  style={{
                    position: "absolute",
                    right: "-18px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    border: "1.5px solid var(--border)",
                    background: "var(--surface)",
                    color: "var(--text)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
                    zIndex: 10,
                    transition: "transform 0.2s ease, background 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-50%) scale(1.1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(-50%) scale(1.0)")}
                >
                  <ChevronRight size={22} />
                </button>

                {/* Floating Card 1: FSSAI Verified (Smooth float animation) */}
                <div
                  className="float-slow"
                  style={{
                    position: "absolute",
                    top: 20,
                    left: -35,
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "14px",
                    padding: "0.875rem 1.1rem",
                    boxShadow: "0 12px 28px rgba(0, 0, 0, 0.12)",
                    zIndex: 5,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--secondary)", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--text)", margin: 0 }}>FSSAI Verified</p>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>350+ Certified Cooks</p>
                    </div>
                  </div>
                </div>

                {/* Floating Card 2: Rating (Smooth reverse float animation) */}
                <div
                  className="float-reverse"
                  style={{
                    position: "absolute",
                    bottom: 25,
                    right: -25,
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "14px",
                    padding: "0.875rem 1.1rem",
                    boxShadow: "0 12px 28px rgba(0, 0, 0, 0.12)",
                    zIndex: 5,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                    <div style={{ fontSize: "1.6rem" }}>⭐</div>
                    <div>
                      <p style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--text)", margin: 0 }}>
                        {customImage ? "5.0 / 5.0" : `${activeDish.rating} / 5.0`}
                      </p>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>
                        {customImage ? "Custom Selected Dish" : `${activeDish.reviews} Reviews`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating Card 3: Price Tag */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 110,
                    left: -40,
                    background: "var(--primary)",
                    color: "white",
                    borderRadius: "14px",
                    padding: "0.875rem 1.15rem",
                    boxShadow: "0 10px 24px rgba(232, 101, 10, 0.35)",
                    zIndex: 5,
                  }}
                  className="pulse-gently"
                >
                  <p style={{ fontWeight: 800, fontSize: "0.95rem", margin: 0 }}>
                    {customImage ? "₹100/meal" : `${activeDish.price}/meal`}
                  </p>
                  <p style={{ fontSize: "0.75rem", opacity: 0.9, margin: 0 }}>Starting Subscription</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== CUSTOM IMAGE CHANGER MODAL ===== */}
        {showImageModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "rgba(0, 0, 0, 0.75)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
            }}
            onClick={() => setShowImageModal(false)}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 620,
                background: "var(--surface)",
                border: "1.5px solid var(--border)",
                borderRadius: "20px",
                padding: "1.75rem",
                boxShadow: "0 25px 60px rgba(0, 0, 0, 0.3)",
                color: "var(--text)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <ImageIcon size={22} style={{ color: "var(--primary)" }} />
                  <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "var(--text)" }}>
                    Change Hero Front Image
                  </h3>
                </div>
                <button
                  onClick={() => setShowImageModal(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    padding: "0.25rem",
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
                Pick from our verified regional meal photos, paste your own image URL, or upload directly from your computer.
              </p>

              {/* Preset Gallery */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", display: "block", marginBottom: "0.6rem" }}>
                  Select Curated Dish Preset
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
                  {HERO_DISHES.map((d, i) => (
                    <div
                      key={d.id}
                      onClick={() => handleSelectDish(i)}
                      style={{
                        position: "relative",
                        borderRadius: "12px",
                        overflow: "hidden",
                        height: 90,
                        border: activeDishIndex === i && !customImage ? "2.5px solid var(--primary)" : "1.5px solid var(--border)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <img src={d.image} alt={d.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: "rgba(0, 0, 0, 0.75)",
                          padding: "0.25rem 0.5rem",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          color: "#fff",
                          textAlign: "center",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {d.category}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Paste Custom URL */}
              <form onSubmit={handleApplyCustomUrl} style={{ marginBottom: "1.25rem" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", display: "block", marginBottom: "0.5rem" }}>
                  Or Paste Custom Image URL
                </label>
                <div style={{ display: "flex", gap: "0.6rem" }}>
                  <input
                    type="url"
                    placeholder="https://example.com/my-food-photo.jpg"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "0.65rem 0.85rem",
                      borderRadius: "10px",
                      border: "1.5px solid var(--border)",
                      background: "var(--surface-alt)",
                      color: "var(--text)",
                      fontSize: "0.875rem",
                      outline: "none",
                    }}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ padding: "0.65rem 1.25rem", fontSize: "0.875rem" }}
                  >
                    Apply URL
                  </button>
                </div>
              </form>

              {/* File Upload or Reset */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileUpload}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.55rem 1rem",
                    borderRadius: "10px",
                    border: "1.5px solid var(--border)",
                    background: "var(--surface-alt)",
                    color: "var(--text)",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <Upload size={16} />
                  <span>Upload Local File</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetCarousel}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.55rem 1rem",
                    borderRadius: "10px",
                    border: "none",
                    background: "none",
                    color: "var(--primary)",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  <RefreshCw size={15} />
                  <span>Reset to Rotating Carousel</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          @media (max-width: 900px) {
            .hero-grid {
              grid-template-columns: 1fr !important;
            }
          }
          @media (max-width: 768px) {
            .hide-mobile { display: none; }
          }
        `}</style>
      </section>

      {/* ===== STATS SHOWCASE ===== */}
      <section style={{ position: "relative", zIndex: 10, marginTop: "-2.5rem", marginBottom: "2.5rem" }}>
        <div className="container-wide">
          <div
            style={{
              background: "var(--surface)",
              border: "1.5px solid var(--border)",
              borderRadius: "20px",
              boxShadow: "var(--shadow-lg)",
              padding: "1.5rem 2rem",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1.25rem",
              alignItems: "center",
            }}
          >
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "0.25rem 0.5rem",
                  borderRight: i < STATS.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: "14px",
                    background: "var(--surface-alt)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    flexShrink: 0,
                  }}
                >
                  {stat.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 800,
                      fontSize: "1.5rem",
                      color: "var(--text)",
                      lineHeight: 1.15,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", fontWeight: 500, marginTop: "0.15rem" }}>
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <style jsx>{`
          @media (max-width: 900px) {
            div[style*="grid-template-columns: repeat(4"] {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          @media (max-width: 540px) {
            div[style*="grid-template-columns: repeat(4"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="section" style={{ background: "var(--bg)" }}>
        <div className="container-custom">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="section-tag" style={{ display: "inline-flex" }}>✨ Simple & Easy</div>
            <h2 style={{ fontFamily: "Poppins", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 800, color: "var(--text)", marginBottom: "1rem" }}>
              How HomeFeast Works
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "1.0625rem", maxWidth: 560, margin: "0 auto" }}>
              Three simple steps to get fresh, homemade food at your doorstep.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem", position: "relative" }}>
            {/* Connecting line */}
            <div
              style={{
                position: "absolute",
                top: 60,
                left: "16.67%",
                right: "16.67%",
                height: 2,
                background: "linear-gradient(to right, var(--primary), var(--secondary))",
                opacity: 0.2,
                zIndex: 0,
              }}
              aria-hidden="true"
            />

            {HOW_IT_WORKS.map((step, i) => (
              <div
                key={step.step}
                style={{
                  textAlign: "center",
                  padding: "2rem 1.5rem",
                  background: "var(--surface)",
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--border)",
                  position: "relative",
                  zIndex: 1,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: `${step.color}18`,
                    border: `2px solid ${step.color}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem",
                  }}
                >
                  <step.icon size={30} style={{ color: step.color }} />
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: -16,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: step.color,
                    color: "white",
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "Poppins",
                    fontWeight: 800,
                    fontSize: "0.875rem",
                    boxShadow: `0 4px 12px ${step.color}40`,
                  }}
                >
                  {i + 1}
                </div>
                <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.125rem", color: "var(--text)", marginBottom: "0.75rem" }}>
                  {step.title}
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem", lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <style jsx>{`
          @media (max-width: 768px) {
            div[style*="grid-template-columns: repeat(3"] { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* ===== FEATURED COOKS ===== */}
      <section className="section" style={{ background: "var(--surface-alt)" }}>
        <div className="container-custom">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div className="section-tag">👨‍🍳 Top Rated</div>
              <h2 style={{ fontFamily: "Poppins", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, color: "var(--text)" }}>
                Featured Home Cooks
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "1rem", marginTop: "0.5rem" }}>
                Verified, FSSAI-certified cooks delivering meals with love.
              </p>
            </div>
            <Link href="/search" className="btn btn-outline" id="view-all-cooks-btn">
              View All Cooks <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {featuredCooks.map((cook) => (
              <CookCard key={cook.id} cook={cook} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== PLANS SECTION (DYNAMIC KITCHEN PLANS & AUTO-CHANGE ROTATION) ===== */}
      <section
        id="plans"
        className="section"
        style={{
          background: "var(--bg)",
          position: "relative",
          overflow: "hidden",
          paddingTop: "4.5rem",
          paddingBottom: "5.5rem",
        }}
        onMouseEnter={() => setIsPlanHovered(true)}
        onMouseLeave={() => setIsPlanHovered(false)}
      >
        {/* Ambient background glow accents */}
        <div
          style={{
            position: "absolute",
            top: "15%",
            left: "5%",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(232, 85, 7, 0.09) 0%, transparent 70%)",
            filter: "blur(70px)",
            pointerEvents: "none",
          }}
          aria-hidden="true"
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "5%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, transparent 70%)",
            filter: "blur(80px)",
            pointerEvents: "none",
          }}
          aria-hidden="true"
        />

        <div className="container-custom" style={{ position: "relative", zIndex: 1 }}>
          {/* Section Header */}
          <div style={{ textAlign: "center", marginBottom: "2.75rem" }}>
            <div
              className="section-tag"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.4rem 1.1rem",
                borderRadius: "999px",
                background: "rgba(232, 85, 7, 0.12)",
                border: "1px solid rgba(232, 85, 7, 0.3)",
                color: "var(--primary)",
                fontWeight: 700,
                fontSize: "0.8125rem",
                marginBottom: "1rem",
              }}
            >
              <Sparkles size={15} style={{ color: "var(--primary)" }} />
              Live Kitchen Plans • Auto-Rotating Showcase
            </div>
            <h2
              style={{
                fontFamily: "Poppins",
                fontSize: "clamp(1.85rem, 4.5vw, 2.85rem)",
                fontWeight: 800,
                color: "var(--text)",
                marginBottom: "0.85rem",
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
              }}
            >
              Choose Your Meal Plan
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "1.0625rem",
                maxWidth: 680,
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              Explore authentic home-cooked meal subscriptions from verified kitchens across Gujarat.
              Rotates automatically through top kitchens or pick a specific kitchen below.
            </p>
          </div>

          {/* Interactive Filter & Auto-Change Control Bar */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              marginBottom: "1.75rem",
              padding: "1rem 1.25rem",
              background: "var(--surface)",
              borderRadius: "16px",
              border: "1px solid var(--border)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            }}
          >
            {/* Kitchen Selector Tabs */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                overflowX: "auto",
                maxWidth: "100%",
                paddingBottom: "0.25rem",
              }}
              className="hide-scrollbar"
            >
              <button
                onClick={() => setSelectedKitchenFilter("all")}
                className={`btn btn-sm ${selectedKitchenFilter === "all" ? "btn-primary" : "btn-outline"}`}
                style={{
                  borderRadius: "999px",
                  fontSize: "0.8125rem",
                  padding: "0.4rem 0.9rem",
                  whiteSpace: "nowrap",
                }}
              >
                🔥 All Kitchens ({allKitchenPlans.length})
              </button>
              {availableKitchens.map((k) => (
                <button
                  key={k.id}
                  onClick={() => setSelectedKitchenFilter(k.id)}
                  className={`btn btn-sm ${selectedKitchenFilter === k.id ? "btn-primary" : "btn-outline"}`}
                  style={{
                    borderRadius: "999px",
                    fontSize: "0.8125rem",
                    padding: "0.4rem 0.9rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  <ChefHat size={13} style={{ marginRight: 4 }} />
                  {k.name}
                </button>
              ))}
            </div>

            {/* Duration Selector & Auto-Rotation HUD */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              {/* Duration filter tabs */}
              <div
                style={{
                  display: "inline-flex",
                  background: "var(--surface-alt)",
                  borderRadius: "999px",
                  padding: "3px",
                  border: "1px solid var(--border)",
                }}
              >
                {[
                  { id: "all", label: "All" },
                  { id: "daily", label: "Daily" },
                  { id: "weekly", label: "Weekly" },
                  { id: "monthly", label: "Monthly" },
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDurationFilter(d.id)}
                    style={{
                      background: selectedDurationFilter === d.id ? "var(--primary)" : "transparent",
                      color: selectedDurationFilter === d.id ? "#fff" : "var(--text-muted)",
                      border: "none",
                      padding: "0.3rem 0.75rem",
                      borderRadius: "999px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              {/* Auto-Rotation Live Status Badge & Toggle */}
              <button
                onClick={() => setIsPlanAutoRotating((prev) => !prev)}
                title={isPlanAutoRotating ? "Pause Auto-Rotation" : "Resume Auto-Rotation"}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  background: isPlanAutoRotating
                    ? isPlanHovered
                      ? "rgba(245, 158, 11, 0.15)"
                      : "rgba(34, 197, 94, 0.15)"
                    : "rgba(156, 163, 175, 0.15)",
                  color: isPlanAutoRotating
                    ? isPlanHovered
                      ? "var(--accent)"
                      : "#22c55e"
                    : "var(--text-muted)",
                  border: "1px solid",
                  borderColor: isPlanAutoRotating
                    ? isPlanHovered
                      ? "rgba(245, 158, 11, 0.3)"
                      : "rgba(34, 197, 94, 0.3)"
                    : "var(--border)",
                  borderRadius: "999px",
                  padding: "0.35rem 0.85rem",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {isPlanAutoRotating ? (
                  isPlanHovered ? (
                    <>
                      <Pause size={12} /> Paused on Hover
                    </>
                  ) : (
                    <>
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "#22c55e",
                          display: "inline-block",
                          boxShadow: "0 0 8px #22c55e",
                        }}
                      />
                      Auto-Cycling ({Math.ceil((5500 - (planProgressPercent / 100) * 5500) / 1000)}s)
                    </>
                  )
                ) : (
                  <>
                    <Play size={12} /> Play Auto-Cycle
                  </>
                )}
              </button>

              {/* Prev / Next Buttons */}
              <div style={{ display: "flex", gap: "0.35rem" }}>
                <button
                  onClick={handlePrevPlanSlide}
                  disabled={planSlides.length <= 1}
                  className="btn btn-outline btn-sm"
                  style={{
                    width: 32,
                    height: 32,
                    padding: 0,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: planSlides.length <= 1 ? 0.4 : 1,
                  }}
                  aria-label="Previous kitchen plans"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={handleNextPlanSlide}
                  disabled={planSlides.length <= 1}
                  className="btn btn-outline btn-sm"
                  style={{
                    width: 32,
                    height: 32,
                    padding: 0,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: planSlides.length <= 1 ? 0.4 : 1,
                  }}
                  aria-label="Next kitchen plans"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Glowing Auto-Change Progress Bar */}
          {isPlanAutoRotating && planSlides.length > 1 && (
            <div
              style={{
                width: "100%",
                height: 3,
                background: "rgba(255,255,255,0.06)",
                borderRadius: "3px",
                overflow: "hidden",
                marginBottom: "2rem",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${planProgressPercent}%`,
                  background: isPlanHovered
                    ? "var(--accent)"
                    : "linear-gradient(90deg, var(--primary) 0%, #F59E0B 100%)",
                  boxShadow: "0 0 10px rgba(232, 85, 7, 0.5)",
                  transition: "width 50ms linear",
                }}
              />
            </div>
          )}

          {/* Dynamic Plan Cards Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                (planSlides[planSlideIndex] || []).length === 1
                  ? "minmax(320px, 460px)"
                  : (planSlides[planSlideIndex] || []).length === 2
                  ? "repeat(auto-fit, minmax(320px, 440px))"
                  : "repeat(3, 1fr)",
              justifyContent: "center",
              gap: "1.75rem",
              alignItems: "stretch",
              maxWidth: (planSlides[planSlideIndex] || []).length === 1 ? "460px" : undefined,
              margin: (planSlides[planSlideIndex] || []).length === 1 ? "0 auto" : undefined,
            }}
          >
            {(planSlides[planSlideIndex] || []).map((item: any, idx: number) => {
              const isPopular = item.popular;
              return (
                <div
                  key={`${item.cookId}_${item.planId}_${idx}`}
                  style={{
                    background: "var(--surface)",
                    borderRadius: "20px",
                    border: isPopular ? "2px solid var(--primary)" : "1px solid var(--border)",
                    boxShadow: isPopular
                      ? "0 18px 45px rgba(232, 85, 7, 0.18)"
                      : "0 12px 30px rgba(0,0,0,0.12)",
                    padding: "1.75rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
                  }}
                  className="kitchen-plan-card"
                >
                  {/* Popular / Best Value Ribbon */}
                  {isPopular && (
                    <div
                      style={{
                        position: "absolute",
                        top: -12,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "linear-gradient(135deg, var(--primary) 0%, #F59E0B 100%)",
                        color: "#fff",
                        fontSize: "0.7rem",
                        fontWeight: 800,
                        fontFamily: "Poppins",
                        padding: "0.25rem 0.9rem",
                        borderRadius: "999px",
                        boxShadow: "0 4px 12px rgba(232, 85, 7, 0.35)",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        whiteSpace: "nowrap",
                        zIndex: 2,
                      }}
                    >
                      <Flame size={12} /> Most Popular Choice
                    </div>
                  )}

                  <div>
                    {/* Kitchen Profile Header Row */}
                    <Link
                      href={`/cooks/${item.cookId}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        textDecoration: "none",
                        marginBottom: "1.25rem",
                        paddingBottom: "1rem",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      <div style={{ position: "relative" }}>
                        <img
                          src={item.avatar}
                          alt={item.kitchenName}
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: "14px",
                            objectFit: "cover",
                            border: "2px solid var(--border)",
                          }}
                        />
                        <span
                          style={{
                            position: "absolute",
                            bottom: -3,
                            right: -3,
                            background: "#22c55e",
                            color: "#fff",
                            borderRadius: "50%",
                            width: 16,
                            height: 16,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "10px",
                            boxShadow: "0 0 4px rgba(0,0,0,0.4)",
                          }}
                          title="FSSAI Verified Kitchen"
                        >
                          ✓
                        </span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <h4
                            style={{
                              fontFamily: "Poppins",
                              fontWeight: 700,
                              fontSize: "1.05rem",
                              color: "var(--text)",
                              margin: 0,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {item.kitchenName}
                          </h4>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            fontSize: "0.8125rem",
                            color: "var(--text-muted)",
                            marginTop: 2,
                          }}
                        >
                          <MapPin size={12} style={{ color: "var(--primary)", flexShrink: 0 }} />
                          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {item.area || item.city}
                          </span>
                          <span>•</span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 2, color: "var(--accent)", fontWeight: 700 }}>
                            <Star size={11} fill="var(--accent)" />
                            {item.rating}
                          </span>
                        </div>
                      </div>
                    </Link>

                    {/* Plan Type Badge & Name */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.6rem" }}>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          padding: "0.2rem 0.65rem",
                          borderRadius: "6px",
                          background:
                            item.planType === "monthly"
                              ? "rgba(139, 92, 246, 0.15)"
                              : item.planType === "weekly"
                              ? "rgba(232, 85, 7, 0.15)"
                              : "rgba(59, 130, 246, 0.15)",
                          color:
                            item.planType === "monthly"
                              ? "#a78bfa"
                              : item.planType === "weekly"
                              ? "var(--primary)"
                              : "#60a5fa",
                        }}
                      >
                        {item.planType.toUpperCase()} PLAN
                      </span>
                      {item.isVeg && (
                        <span
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            color: "#22c55e",
                            background: "rgba(34, 197, 94, 0.1)",
                            padding: "0.15rem 0.5rem",
                            borderRadius: "4px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 3,
                          }}
                        >
                          <Leaf size={11} /> Pure Veg
                        </span>
                      )}
                    </div>

                    <h3
                      style={{
                        fontFamily: "Poppins",
                        fontWeight: 700,
                        fontSize: "1.25rem",
                        color: "var(--text)",
                        marginBottom: "0.5rem",
                        lineHeight: 1.3,
                      }}
                    >
                      {item.label}
                    </h3>

                    {/* Pricing */}
                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.35rem", marginBottom: "0.25rem" }}>
                      <span
                        style={{
                          fontFamily: "Poppins",
                          fontWeight: 800,
                          fontSize: "2rem",
                          color: "var(--primary)",
                          lineHeight: 1,
                        }}
                      >
                        ₹{item.price.toLocaleString("en-IN")}
                      </span>
                      <span style={{ fontSize: "0.875rem", color: "var(--text-muted)", fontWeight: 600 }}>
                        {item.period}
                      </span>
                      <span
                        style={{
                          marginLeft: "auto",
                          fontSize: "0.8rem",
                          background: "var(--surface-alt)",
                          padding: "0.2rem 0.55rem",
                          borderRadius: "6px",
                          color: "var(--text)",
                          fontWeight: 600,
                        }}
                      >
                        ₹{item.perMeal}/meal
                      </span>
                    </div>

                    {/* Savings / Benefits tag */}
                    <div
                      style={{
                        fontSize: "0.8125rem",
                        color: "var(--secondary)",
                        fontWeight: 700,
                        marginBottom: "1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Sparkles size={13} /> {item.savings}
                    </div>

                    {/* Description */}
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--text-muted)",
                        lineHeight: 1.5,
                        marginBottom: "1.25rem",
                        minHeight: "2.6rem",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.description}
                    </p>

                    {/* Included Items Checklist */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.55rem",
                        marginBottom: "1.25rem",
                        background: "var(--surface-alt)",
                        padding: "1rem",
                        borderRadius: "12px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: "var(--text-muted)",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginBottom: "0.25rem",
                        }}
                      >
                        What's Included:
                      </div>
                      {item.includes.slice(0, 4).map((inc: string, i: number) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <CheckCircle
                            size={14}
                            style={{ color: "#22c55e", flexShrink: 0 }}
                            fill="#22c55e"
                          />
                          <span style={{ fontSize: "0.8125rem", color: "var(--text)", fontWeight: 500 }}>
                            {inc}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Kitchen Special Item Preview */}
                    {item.specialItem && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          fontSize: "0.75rem",
                          color: "var(--text-muted)",
                          marginBottom: "1.25rem",
                          padding: "0.4rem 0.75rem",
                          background: "rgba(232, 85, 7, 0.06)",
                          borderRadius: "8px",
                          border: "1px dashed rgba(232, 85, 7, 0.25)",
                        }}
                      >
                        <ChefHat size={14} style={{ color: "var(--primary)", flexShrink: 0 }} />
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          Chef Signature: <strong style={{ color: "var(--text)" }}>{item.specialItem}</strong>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    <Link
                      href={`/checkout?cook=${item.cookId}&plan=${item.planId}`}
                      className="btn btn-primary"
                      style={{
                        width: "100%",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "0.9375rem",
                        padding: "0.75rem 1rem",
                        boxShadow: isPopular ? "0 8px 20px rgba(232, 85, 7, 0.3)" : undefined,
                      }}
                      id={`subscribe-${item.cookId}-${item.planId}`}
                    >
                      Subscribe to {item.kitchenName.split(" ")[0]} <ArrowRight size={16} />
                    </Link>
                    <Link
                      href={`/cooks/${item.cookId}`}
                      style={{
                        textAlign: "center",
                        fontSize: "0.8125rem",
                        color: "var(--text-muted)",
                        textDecoration: "none",
                        fontWeight: 600,
                        padding: "0.25rem",
                      }}
                    >
                      View {item.kitchenName}'s Full Menu →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Slide Indicator Dots & Quick Navigation */}
          {planSlides.length > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.5rem",
                marginTop: "2.5rem",
              }}
            >
              {planSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPlanSlideIndex(i);
                    setPlanProgressPercent(0);
                  }}
                  style={{
                    width: planSlideIndex === i ? 28 : 10,
                    height: 10,
                    borderRadius: "999px",
                    background: planSlideIndex === i ? "var(--primary)" : "var(--border)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: planSlideIndex === i ? "0 0 10px rgba(232, 85, 7, 0.5)" : "none",
                  }}
                  aria-label={`Jump to kitchen slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <style jsx>{`
          @media (max-width: 992px) {
            div[style*="repeat(3, 1fr)"] {
              grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
            }
          }
          @media (max-width: 640px) {
            div[style*="repeat(3, 1fr)"] {
              grid-template-columns: 1fr !important;
            }
          }
          .kitchen-plan-card:hover {
            transform: translateY(-6px);
            border-color: var(--primary) !important;
            box-shadow: 0 20px 40px rgba(232, 85, 7, 0.16) !important;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section" style={{ background: "var(--surface-alt)" }}>
        <div className="container-custom">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="section-tag" style={{ display: "inline-flex" }}>❤️ Happy Customers</div>
            <h2 style={{ fontFamily: "Poppins", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 800, color: "var(--text)" }}>
              What Our Community Says
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="card"
                style={{ padding: "1.75rem" }}
              >
                <Quote size={28} style={{ color: "var(--primary)", opacity: 0.3, marginBottom: "1rem" }} />
                <p style={{ fontSize: "0.9375rem", color: "var(--text-muted)", lineHeight: 1.75, marginBottom: "1.25rem", fontStyle: "italic" }}>
                  "{t.quote}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <img
                    src={t.avatar}
                    alt={t.name}
                    style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--border)" }}
                  />
                  <div>
                    <p style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "0.9375rem", color: "var(--text)", margin: 0 }}>{t.name}</p>
                    <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: 0 }}>{t.role} · {t.city}</p>
                  </div>
                  <div style={{ marginLeft: "auto" }}>
                    <Stars rating={t.rating} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BECOME A COOK CTA BANNER ===== */}
      <section className="section" style={{ background: "var(--bg)", paddingTop: "2.5rem", paddingBottom: "2.5rem" }}>
        <div className="container-custom">
          <div
            style={{
              background: "linear-gradient(135deg, #1C1917 0%, #2B241F 100%)",
              borderRadius: "24px",
              padding: "4rem 2rem",
              position: "relative",
              overflow: "hidden",
              textAlign: "center",
              boxShadow: "0 20px 45px rgba(28,25,23,0.15)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* Ambient orange glow */}
            <div
              style={{
                position: "absolute",
                top: "-40%",
                left: "30%",
                width: "450px",
                height: "450px",
                borderRadius: "50%",
                background: "rgba(232, 85, 7, 0.25)",
                filter: "blur(90px)",
                pointerEvents: "none",
              }}
              aria-hidden="true"
            />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "rgba(255,255,255,0.1)",
                  color: "#FF9A52",
                  padding: "0.375rem 1.125rem",
                  borderRadius: "9999px",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  marginBottom: "1.25rem",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                <TrendingUp size={14} /> Cook Partner Program
              </div>
              <h2
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "clamp(2rem, 4vw, 2.75rem)",
                  fontWeight: 800,
                  color: "#FFFFFF",
                  marginBottom: "1rem",
                }}
              >
                Love to Cook? Earn from Home!
              </h2>
              <p style={{ color: "#E7E5E4", fontSize: "1.0625rem", maxWidth: 580, margin: "0 auto 2.25rem", lineHeight: 1.7 }}>
                Join 350+ certified home cooks across Gujarat earning ₹15,000–₹35,000/month.
                FSSAI guidance, kitchen hygiene verification, and flexible delivery support included.
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
                <Link
                  href="/cook/register"
                  id="become-cook-cta"
                  className="btn btn-primary"
                  style={{ padding: "0.875rem 2.25rem", fontSize: "1rem" }}
                >
                  <ChefHat size={18} /> Start Cooking for HomeFeast
                </Link>
                <Link
                  href="/about"
                  id="cook-learn-more-btn"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    background: "rgba(255, 255, 255, 0.12)",
                    border: "1.5px solid rgba(255, 255, 255, 0.45)",
                    color: "#FFFFFF",
                    padding: "0.875rem 2rem",
                    borderRadius: "9999px",
                    fontWeight: 600,
                    fontSize: "1rem",
                    textDecoration: "none",
                    backdropFilter: "blur(8px)",
                    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
                    transition: "all 0.2s ease",
                  }}
                  className="cook-learn-more-link"
                >
                  <Play size={16} fill="white" /> Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="section" style={{ background: "var(--surface-alt)", padding: "5rem 0" }}>
        <div className="container-custom" style={{ maxWidth: 820 }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="section-tag" style={{ display: "inline-flex" }}>🙋 Common Questions</div>
            <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, color: "var(--text)" }}>
              Frequently Asked Questions
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "1rem", marginTop: "0.5rem" }}>
              Everything you need to know about our home-cooked meal subscriptions.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {FAQS.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>
          <div
            style={{
              marginTop: "3rem",
              background: "var(--surface)",
              border: "1.5px solid var(--border)",
              borderRadius: "16px",
              padding: "2rem",
              textAlign: "center",
              boxShadow: "var(--shadow)",
            }}
          >
            <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "1.25rem", color: "var(--text)", marginBottom: "0.5rem" }}>
              Still have questions or need meal customization?
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem", marginBottom: "1.5rem" }}>
              Our friendly customer team is available 7 days a week to help you choose the right meal plan.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href="https://wa.me/919876543210?text=Hello%20HomeFeast%20Support!%20I%20have%20a%20question%20about%20meal%20subscriptions."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                id="faq-whatsapp-btn"
                style={{ padding: "0.75rem 1.75rem" }}
              >
                <MessageCircle size={18} /> Chat on WhatsApp
              </a>
              <Link href="/contact" className="btn btn-outline" id="contact-us-btn" style={{ padding: "0.75rem 1.75rem" }}>
                Contact Support <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
