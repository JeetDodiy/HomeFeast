"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard, ShoppingBag, Calendar, Star, AlertCircle,
  Bell, Settings, LogOut, ChefHat, Clock, MapPin, Pause,
  Play, XCircle, ChevronRight, Package, ArrowUpRight, TrendingUp,
  Plus, CheckCircle, Send, MessageSquare, Trash2, Shield
} from "lucide-react";

const INITIAL_SUBSCRIPTIONS = [
  {
    id: "s1",
    cookName: "Meera's Kitchen",
    cookAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    plan: "Weekly Plan – Gujarati Thali",
    status: "ACTIVE",
    startDate: "2024-10-07",
    endDate: "2024-10-14",
    slot: "Lunch (12–1 PM)",
    price: 749,
    nextDelivery: "Today, 12:30 PM",
    remainingMeals: 4,
  },
  {
    id: "s2",
    cookName: "Jain Bhavan Tiffin",
    cookAvatar: "https://randomuser.me/api/portraits/women/55.jpg",
    plan: "Monthly Plan – Pure Jain Thali",
    status: "PAUSED",
    startDate: "2024-09-15",
    endDate: "2024-10-15",
    slot: "Lunch (11:30 AM–1 PM)",
    price: 3599,
    nextDelivery: "Paused by User",
    remainingMeals: 14,
  },
];

const MOCK_ORDERS = [
  { id: "HF-ORD-101", cookName: "Meera's Kitchen", date: "2024-10-13", status: "DELIVERED", amount: 120, items: ["Dal Fry", "Aloo Gobi", "Roti", "Rice"], slot: "Lunch" },
  { id: "HF-ORD-102", cookName: "Meera's Kitchen", date: "2024-10-12", status: "DELIVERED", amount: 120, items: ["Chana Dal", "Bhindi Masala", "Rice", "Roti"], slot: "Lunch" },
  { id: "HF-ORD-103", cookName: "Priya's Home Kitchen", date: "2024-10-09", status: "CANCELLED", amount: 130, items: ["Idli (4 pcs)", "Sambar", "Coconut Chutney"], slot: "Breakfast" },
  { id: "HF-ORD-104", cookName: "Meera's Kitchen", date: "2024-10-08", status: "DELIVERED", amount: 120, items: ["Moong Dal", "Mix Veg", "Roti", "Pulao"], slot: "Lunch" },
];

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "badge-active",
  PAUSED: "badge-pending",
  CANCELLED: "badge-cancelled",
  DELIVERED: "badge-active",
  CONFIRMED: "badge-primary",
};

const SIDEBAR_TABS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "subscriptions", label: "Subscriptions", icon: Calendar },
  { key: "orders", label: "Order History", icon: ShoppingBag },
  { key: "reviews", label: "Reviews & Ratings", icon: Star },
  { key: "complaints", label: "Support & Disputes", icon: AlertCircle },
  { key: "profile", label: "Profile & Addresses", icon: Settings },
];

export default function CustomerDashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [cutoffWarning, setCutoffWarning] = useState("");
  const [currentUser, setCurrentUser] = useState<{ id?: string; name: string; email: string; city: string; phone?: string; address?: string }>({
    id: "",
    name: "Customer",
    email: "",
    city: "Rajkot",
    phone: "",
    address: "",
  });

  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    pref: "veg",
    spice: "medium",
  });

  // Complaints and reviews state
  const [complaints, setComplaints] = useState<any[]>([]);
  const [newComplaint, setNewComplaint] = useState({ cook: "Meera's Kitchen", issue: "" });
  const [complaintSubmitted, setComplaintSubmitted] = useState(false);

  const [userReviews, setUserReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({ cook: "Meera's Kitchen", rating: 5, comment: "" });
  const [deleteSuccess, setDeleteSuccess] = useState("");

  const custCleanKey = (currentUser?.email || "").toLowerCase().replace(/[^a-z0-9]/g, "_");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam && SIDEBAR_TABS.some((s) => s.key === tabParam)) {
        setActiveTab(tabParam);
      }

      // Check current logged in user
      let isDemoAccount = false;
      let activeUser: any = null;
      try {
        const u = localStorage.getItem("hf_user");
        if (u) {
          activeUser = JSON.parse(u);
          if (activeUser && (activeUser.name || activeUser.email)) {
            isDemoAccount = activeUser.email === "demo@customer.com" || activeUser.email === "arjun.verma@example.com";
            const userPhone = (activeUser.phone || "").replace(/\D/g, "").slice(0, 10);
            setCurrentUser({
              id: activeUser.id || "",
              name: activeUser.name || "Customer",
              email: activeUser.email || "",
              city: activeUser.city || "Rajkot",
              phone: userPhone,
              address: activeUser.address || "",
            });
            setProfileForm({
              name: activeUser.name || "Customer",
              phone: userPhone,
              email: activeUser.email || "",
              address: activeUser.address || "",
              pref: activeUser.dietaryPreference || "veg",
              spice: activeUser.spicePreference || "medium",
            });
          }
        }
      } catch {}

      const userCleanKey = (activeUser?.email || "").toLowerCase().replace(/[^a-z0-9]/g, "_");

      // Load customer subscriptions scoped strictly to this user
      try {
        const scopedSubs = userCleanKey ? localStorage.getItem(`hf_customer_subscriptions_${userCleanKey}`) : null;
        const storedSubs = scopedSubs || (isDemoAccount ? localStorage.getItem("hf_customer_subscriptions") : null);
        if (storedSubs) {
          const parsed = JSON.parse(storedSubs);
          if (Array.isArray(parsed)) {
            setSubscriptions(parsed);
          }
        } else if (isDemoAccount) {
          setSubscriptions(INITIAL_SUBSCRIPTIONS);
        } else {
          setSubscriptions([]);
        }
      } catch {
        setSubscriptions([]);
      }

      // Load customer orders scoped strictly to this user
      try {
        const scopedOrders = userCleanKey ? localStorage.getItem(`hf_customer_orders_${userCleanKey}`) : null;
        const storedOrders = scopedOrders || (isDemoAccount ? localStorage.getItem("hf_customer_orders") : null);
        if (storedOrders) {
          const parsed = JSON.parse(storedOrders);
          if (Array.isArray(parsed)) {
            setOrders(parsed);
          }
        } else if (isDemoAccount) {
          setOrders(MOCK_ORDERS);
        } else {
          setOrders([]);
        }
      } catch {
        setOrders([]);
      }

      // Live Backend Query: only sync real orders & subscriptions if the user has a real registered ID or is demo
      const targetUserId = activeUser?.id || (isDemoAccount ? "usr_customer_1" : "");
      if (targetUserId) {
        fetch(`/api/v1/orders?userId=${encodeURIComponent(targetUserId)}`)
          .then((res) => res.json())
          .then((orderData) => {
            if (orderData.success && Array.isArray(orderData.data) && orderData.data.length > 0) {
              const formatted = orderData.data.map((o: any) => ({
                id: o.id,
                cookName: o.cookName || "HomeFeast Kitchen",
                date: o.deliveryDate || o.date || new Date().toISOString().split("T")[0],
                status: o.status || "CONFIRMED",
                amount: o.totalAmount || o.amount || 120,
                items: o.items || ["Daily Thali Meal Box"],
                slot: o.slot || "Lunch (12–1:30 PM)",
              }));
              setOrders((prev) => {
                const prevIds = new Set(prev.map((p) => p.id));
                const merged = [...prev, ...formatted.filter((f: any) => !prevIds.has(f.id))];
                if (typeof window !== "undefined") {
                  if (userCleanKey) localStorage.setItem(`hf_customer_orders_${userCleanKey}`, JSON.stringify(merged));
                  if (isDemoAccount) localStorage.setItem("hf_customer_orders", JSON.stringify(merged));
                }
                return merged;
              });
            }
          })
          .catch(() => {});

        fetch(`/api/v1/subscriptions?userId=${encodeURIComponent(targetUserId)}`)
          .then((res) => res.json())
          .then((subJson) => {
            if (subJson.success && Array.isArray(subJson.data) && subJson.data.length > 0) {
              const formattedSubs = subJson.data.map((s: any) => ({
                id: s.id,
                cookName: s.cookName || "Meera's Kitchen",
                cookAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
                plan: s.planName || s.plan || "Weekly Plan",
                status: s.status || "ACTIVE",
                startDate: s.startDate || "2026-10-14",
                endDate: s.endDate || "2026-10-21",
                slot: s.slot || "Lunch (12–1:30 PM)",
                price: s.price || 749,
                nextDelivery: `Tomorrow, ${s.slot ? (s.slot.includes("Lunch") ? "12:30 PM" : "7:30 PM") : "12:30 PM"}`,
                remainingMeals: s.remainingMeals ?? s.totalMeals ?? 7,
                totalMeals: s.totalMeals ?? 7,
              }));
              setSubscriptions((prev) => {
                const prevIds = new Set(prev.map((p) => p.id));
                const merged = [...prev, ...formattedSubs.filter((f: any) => !prevIds.has(f.id))];
                if (typeof window !== "undefined") {
                  if (userCleanKey) localStorage.setItem(`hf_customer_subscriptions_${userCleanKey}`, JSON.stringify(merged));
                  if (isDemoAccount) localStorage.setItem("hf_customer_subscriptions", JSON.stringify(merged));
                }
                return merged;
              });
            }
          })
          .catch(() => {});
      }

      // Load complaints scoped strictly to user
      try {
        const scopedComp = userCleanKey ? localStorage.getItem(`hf_customer_complaints_${userCleanKey}`) : null;
        const storedComplaints = scopedComp || (isDemoAccount ? localStorage.getItem("hf_customer_complaints") : null);
        if (storedComplaints) {
          const parsed = JSON.parse(storedComplaints);
          if (Array.isArray(parsed)) setComplaints(parsed);
        } else if (isDemoAccount) {
          setComplaints([
            { id: "TKT-304", cook: "Priya's Home Kitchen", issue: "Breakfast was 30 mins late on Oct 9", status: "RESOLVED", date: "2024-10-09", reply: "Cook apologized and credited 1 free meal." },
          ]);
        } else {
          setComplaints([]);
        }
      } catch {
        setComplaints([]);
      }

      // Load user reviews scoped strictly to user
      try {
        const scopedRev = userCleanKey ? localStorage.getItem(`hf_customer_reviews_${userCleanKey}`) : null;
        const storedReviews = scopedRev || (isDemoAccount ? localStorage.getItem("hf_customer_reviews") : null);
        if (storedReviews) {
          const parsed = JSON.parse(storedReviews);
          if (Array.isArray(parsed)) setUserReviews(parsed);
        } else if (isDemoAccount) {
          setUserReviews([
            { cook: "Meera's Kitchen", rating: 5, date: "2024-10-10", comment: "The Sunday special thali was incredible! Best home food in Rajkot." },
          ]);
        } else {
          setUserReviews([]);
        }
      } catch {
        setUserReviews([]);
      }
    }
  }, []);

  const handleDeleteAccount = async () => {
    if (confirm("Are you sure you want to request permanent account deletion under the DPDP Act 2023? This cannot be undone.")) {
      try {
        const res = await fetch("/api/v1/auth/delete-account", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: "arjun_verma_usr" }),
        });
        const data = await res.json();
        setDeleteSuccess(`Request registered (Ref: ${data.deletionId || "DEL-2026"}). All personal data will be permanently purged within 30 days.`);
      } catch {
        setDeleteSuccess("Request registered. Our grievance officer will process your deletion within 30 days.");
      }
    }
  };

  const toggleSubscriptionStatus = (id: string) => {
    const currentHour = new Date().getHours();
    const isPastCutoff = currentHour >= 20; // 8:00 PM cutoff rule
    let targetStatus = "PAUSED";

    setSubscriptions((prev) => {
      const updated = prev.map((sub) => {
        if (sub.id === id) {
          const nextStatus = sub.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
          targetStatus = nextStatus;
          const nextDeliveryText =
            nextStatus === "ACTIVE"
              ? isPastCutoff
                ? "Day after tomorrow, 12:30 PM (8 PM Cutoff passed)"
                : "Tomorrow, 12:30 PM"
              : "Paused by User";
          return {
            ...sub,
            status: nextStatus,
            nextDelivery: nextDeliveryText,
          };
        }
        return sub;
      });

      if (typeof window !== "undefined") {
        try {
          if (custCleanKey) localStorage.setItem(`hf_customer_subscriptions_${custCleanKey}`, JSON.stringify(updated));
          localStorage.setItem("hf_customer_subscriptions", JSON.stringify(updated));
        } catch {}
      }

      return updated;
    });

    // Sync status change to backend API
    fetch("/api/v1/subscriptions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: targetStatus }),
    }).catch(() => {});

    if (isPastCutoff) {
      setCutoffWarning("Notice: It is past the 8:00 PM cutoff. Tomorrow's meal is already in preparation. Your pause/resume change will take effect starting from the day after tomorrow.");
    } else {
      setCutoffWarning("Subscription updated successfully! Changes take effect starting tomorrow morning.");
    }
    setTimeout(() => setCutoffWarning(""), 7000);
  };

  const handleCreateComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComplaint.issue.trim()) return;
    const item = {
      id: `TKT-${Math.floor(100 + Math.random() * 900)}`,
      cook: newComplaint.cook,
      issue: newComplaint.issue,
      status: "IN REVIEW",
      date: new Date().toISOString().split("T")[0],
      reply: "Under investigation by HomeFeast Support. Our representative will contact you.",
    };
    const updated = [item, ...complaints];
    setComplaints(updated);
    if (typeof window !== "undefined") {
      try {
        if (custCleanKey) localStorage.setItem(`hf_customer_complaints_${custCleanKey}`, JSON.stringify(updated));
        localStorage.setItem("hf_customer_complaints", JSON.stringify(updated));
      } catch {}
    }
    setNewComplaint({ cook: "Meera's Kitchen", issue: "" });
    setComplaintSubmitted(true);
    setTimeout(() => setComplaintSubmitted(false), 3000);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.comment.trim()) return;
    const updated = [
      { ...newReview, date: new Date().toISOString().split("T")[0] },
      ...userReviews,
    ];
    setUserReviews(updated);
    if (typeof window !== "undefined") {
      try {
        if (custCleanKey) localStorage.setItem(`hf_customer_reviews_${custCleanKey}`, JSON.stringify(updated));
        localStorage.setItem("hf_customer_reviews", JSON.stringify(updated));
      } catch {}
    }

    // Persist to backend reviews API
    fetch("/api/v1/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cookId: "c1",
        customerName: currentUser?.name || "Customer",
        rating: Number(newReview.rating) || 5,
        comment: newReview.comment.trim(),
      }),
    }).catch(() => {});

    setNewReview({ cook: "Meera's Kitchen", rating: 5, comment: "" });
  };

  // Dynamic KPI Calculations
  const activeSubsCount = subscriptions.filter((s) => s.status === "ACTIVE").length;
  const totalDeliveredCount = orders.filter((o) => o.status === "DELIVERED").length;
  const totalMonthSpent = orders
    .filter((o) => o.status === "DELIVERED" || o.status === "CONFIRMED")
    .reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
  const reviewsCount = userReviews.length;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      {/* Sidebar */}
      <aside className="sidebar" aria-label="Customer navigation">
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.5rem" }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--primary), #f5b82e)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontFamily: "Poppins",
                fontWeight: 800,
                fontSize: "1.25rem",
                flexShrink: 0,
              }}
            >
              {(currentUser.name || "C").trim().charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ fontFamily: "Poppins", fontWeight: 700, color: "var(--text)", fontSize: "0.9375rem", margin: 0 }}>
                {currentUser.name}
              </p>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>Customer • {currentUser.city}</p>
            </div>
          </div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          {SIDEBAR_TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              className={`sidebar-link${activeTab === key ? " active" : ""}`}
              onClick={() => setActiveTab(key)}
              style={{ width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", borderRadius: "8px", fontWeight: 600 }}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: "auto", paddingTop: "2rem", borderTop: "1px solid var(--border)" }}>
          <Link href="/auth/login" className="sidebar-link" style={{ width: "100%", textDecoration: "none", color: "var(--danger)" }}>
            <LogOut size={18} /> Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: "2rem", overflow: "auto" }}>
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === "dashboard" && (
          <div>
            <div style={{ marginBottom: "2rem" }}>
              <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.75rem", color: "var(--text)", marginBottom: "0.5rem" }}>
                Good afternoon, {currentUser.name.split(" ")[0]}! 👋
              </h1>
              <p style={{ color: "var(--text-muted)" }}>Here is an overview of your active meal plans and recent deliveries.</p>
            </div>

            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "2.5rem" }}>
              {[
                { label: "Active Subscriptions", value: activeSubsCount.toString(), icon: Calendar, color: "var(--secondary)", bg: "rgba(47,125,79,0.1)" },
                { label: "Total Orders Delivered", value: totalDeliveredCount.toString(), icon: Package, color: "var(--primary)", bg: "rgba(232,101,10,0.1)" },
                { label: "This Month Spent", value: `₹${totalMonthSpent.toLocaleString("en-IN")}`, icon: TrendingUp, color: "var(--info)", bg: "rgba(37,99,235,0.1)" },
                { label: "Reviews Given", value: reviewsCount.toString(), icon: Star, color: "var(--accent)", bg: "rgba(245,184,46,0.1)" },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="kpi-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "0.375rem" }}>{label}</p>
                      <p style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "2rem", color: "var(--text)" }}>{value}</p>
                    </div>
                    <div style={{ width: 44, height: 44, borderRadius: "10px", background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={22} style={{ color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Active Subscriptions Quick View */}
            <div style={{ marginBottom: "2.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <h2 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.25rem", color: "var(--text)" }}>Active Subscriptions</h2>
                {subscriptions.length > 0 && (
                  <button onClick={() => setActiveTab("subscriptions")} className="btn btn-ghost" style={{ fontSize: "0.875rem", color: "var(--primary)" }}>
                    Manage All <ChevronRight size={14} />
                  </button>
                )}
              </div>

              {subscriptions.length === 0 ? (
                <div className="card" style={{ padding: "2.5rem 1.5rem", textAlign: "center", border: "1px dashed var(--border)" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(232,101,10,0.1)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                    <Calendar size={28} />
                  </div>
                  <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.1rem", color: "var(--text)", marginBottom: "0.5rem" }}>
                    No Active Subscriptions
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", maxWidth: 440, margin: "0 auto 1.25rem", lineHeight: 1.6 }}>
                    You haven't subscribed to any meal plans yet. Explore certified home cooks in your city and get delicious, hot tiffins delivered to your doorstep.
                  </p>
                  <Link href="/search" className="btn btn-primary" style={{ display: "inline-flex" }}>
                    <Plus size={16} /> Explore Local Cooks & Tiffins
                  </Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {subscriptions.map((sub) => (
                    <div key={sub.id} className="card" style={{ padding: "1.5rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                          <img src={sub.cookAvatar} alt={sub.cookName} style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover" }} />
                          <div>
                            <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.0625rem", color: "var(--text)", margin: 0 }}>{sub.cookName}</h3>
                            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", margin: "0.25rem 0" }}>{sub.plan} · ₹{sub.price}</p>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                              <Clock size={13} style={{ color: "var(--secondary)" }} />
                              {sub.slot}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                          <span className={`badge ${STATUS_COLORS[sub.status]}`}>{sub.status}</span>
                          <button
                            onClick={() => toggleSubscriptionStatus(sub.id)}
                            className={`btn ${sub.status === "ACTIVE" ? "btn-ghost" : "btn-secondary"}`}
                            style={{ fontSize: "0.8125rem", padding: "0.375rem 0.875rem" }}
                          >
                            {sub.status === "ACTIVE" ? <><Pause size={14} /> Pause Plan</> : <><Play size={14} /> Resume Plan</>}
                          </button>
                        </div>
                      </div>
                      {sub.status === "ACTIVE" && (
                        <div style={{ marginTop: "1rem", padding: "0.75rem", background: "rgba(47,125,79,0.08)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--secondary)" }}>
                          <Clock size={14} />
                          <strong>Next delivery:</strong> {sub.nextDelivery}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Orders Quick View */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <h2 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.25rem", color: "var(--text)" }}>Recent Orders</h2>
                {orders.length > 0 && (
                  <button onClick={() => setActiveTab("orders")} className="btn btn-ghost" style={{ fontSize: "0.875rem", color: "var(--primary)" }}>
                    View All Orders <ChevronRight size={14} />
                  </button>
                )}
              </div>

              {orders.length === 0 ? (
                <div className="card" style={{ padding: "2.5rem 1.5rem", textAlign: "center", border: "1px dashed var(--border)" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(47,125,79,0.1)", color: "var(--secondary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                    <ShoppingBag size={28} />
                  </div>
                  <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.1rem", color: "var(--text)", marginBottom: "0.5rem" }}>
                    No Orders Placed Yet
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", maxWidth: 440, margin: "0 auto 1.25rem", lineHeight: 1.6 }}>
                    Your daily meal deliveries and subscription trial orders will appear here once placed.
                  </p>
                  <Link href="/search" className="btn btn-secondary" style={{ display: "inline-flex" }}>
                    Find Fresh Homemade Food
                  </Link>
                </div>
              ) : (
                <div className="card" style={{ overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-alt)" }}>
                        {["Order ID", "Cook", "Date", "Slot", "Amount", "Status"].map((h) => (
                          <th key={h} style={{ padding: "0.875rem 1.25rem", textAlign: "left", fontSize: "0.8125rem", fontWeight: 700, color: "var(--text-muted)", fontFamily: "Poppins" }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 3).map((order) => (
                        <tr key={order.id} style={{ borderBottom: "1px solid var(--border)" }}>
                          <td style={{ padding: "1rem 1.25rem", fontWeight: 600, fontSize: "0.875rem", color: "var(--primary)" }}>{order.id}</td>
                          <td style={{ padding: "1rem 1.25rem", fontSize: "0.875rem", color: "var(--text)" }}>{order.cookName}</td>
                          <td style={{ padding: "1rem 1.25rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>{order.date}</td>
                          <td style={{ padding: "1rem 1.25rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>{order.slot}</td>
                          <td style={{ padding: "1rem 1.25rem", fontWeight: 700, color: "var(--text)" }}>₹{order.amount}</td>
                          <td style={{ padding: "1rem 1.25rem" }}>
                            <span className={`badge ${STATUS_COLORS[order.status] || "badge-active"}`}>{order.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SUBSCRIPTIONS */}
        {activeTab === "subscriptions" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <div>
                <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.75rem", color: "var(--text)", marginBottom: "0.25rem" }}>
                  My Meal Subscriptions
                </h1>
                <p style={{ color: "var(--text-muted)" }}>Manage active plans, pause/resume, or modify delivery schedules.</p>
              </div>
              <Link href="/search" className="btn btn-primary">
                <Plus size={16} /> Explore New Cooks
              </Link>
            </div>

            {/* 8:00 PM Cutoff Alert Banner */}
            {cutoffWarning && (
              <div
                style={{
                  background: "rgba(232, 101, 10, 0.08)",
                  border: "1.5px solid var(--primary)",
                  borderRadius: "var(--radius)",
                  padding: "1rem 1.25rem",
                  marginBottom: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  color: "var(--text)",
                  fontSize: "0.9rem",
                }}
              >
                <AlertCircle size={20} style={{ color: "var(--primary)", flexShrink: 0 }} />
                <span>{cutoffWarning}</span>
              </div>
            )}

            {subscriptions.length === 0 ? (
              <div className="card" style={{ padding: "3rem 1.5rem", textAlign: "center", border: "1px dashed var(--border)" }}>
                <Calendar size={48} style={{ color: "var(--primary)", opacity: 0.8, margin: "0 auto 1rem", display: "block" }} />
                <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.2rem", color: "var(--text)", marginBottom: "0.5rem" }}>
                  No Active Subscriptions Found
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: 460, margin: "0 auto 1.5rem", lineHeight: 1.6 }}>
                  You have not subscribed to any meal plans yet. Choose from Daily, Weekly Saver, or Monthly home plans from certified cooks near you.
                </p>
                <Link href="/search" className="btn btn-primary" style={{ display: "inline-flex" }}>
                  <Plus size={16} /> Browse Home Chefs & Plans
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {subscriptions.map((sub) => (
                  <div key={sub.id} className="card" style={{ padding: "2rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <img src={sub.cookAvatar} alt={sub.cookName} style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover" }} />
                        <div>
                          <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.2rem", color: "var(--text)", margin: 0 }}>{sub.cookName}</h3>
                          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", margin: "0.25rem 0" }}>{sub.plan} • ₹{sub.price} • {sub.slot}</p>
                          <p style={{ fontSize: "0.8rem", color: "var(--secondary)", fontWeight: 600 }}>{sub.remainingMeals} meals remaining in current billing cycle</p>
                        </div>
                      </div>
                      <span className={`badge ${STATUS_COLORS[sub.status]}`} style={{ fontSize: "0.85rem", padding: "0.35rem 0.85rem" }}>
                        {sub.status}
                      </span>
                    </div>

                    <div style={{ background: "var(--surface-alt)", borderRadius: "var(--radius-sm)", padding: "1rem", marginBottom: "1.25rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
                      <div>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Duration</span>
                        <p style={{ fontWeight: 600, fontSize: "0.875rem", margin: 0 }}>{sub.startDate} to {sub.endDate}</p>
                      </div>
                      <div>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Delivery Slot</span>
                        <p style={{ fontWeight: 600, fontSize: "0.875rem", margin: 0 }}>{sub.slot}</p>
                      </div>
                      <div>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Next Expected Delivery</span>
                        <p style={{ fontWeight: 600, fontSize: "0.875rem", margin: 0, color: "var(--secondary)" }}>{sub.nextDelivery}</p>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                      <button
                        onClick={() => toggleSubscriptionStatus(sub.id)}
                        className={`btn ${sub.status === "ACTIVE" ? "btn-outline" : "btn-secondary"}`}
                      >
                        {sub.status === "ACTIVE" ? <><Pause size={16} /> Pause Subscription (Up to 5 Days)</> : <><Play size={16} /> Resume Daily Delivery</>}
                      </button>
                      <Link href={`/contact?subject=Subscription%20Issue&id=${sub.id}`} className="btn btn-ghost">
                        <MessageSquare size={16} /> Contact Cook
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ORDER HISTORY */}
        {activeTab === "orders" && (
          <div>
            <div style={{ marginBottom: "2rem" }}>
              <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.75rem", color: "var(--text)", marginBottom: "0.25rem" }}>
                Order & Delivery History
              </h1>
              <p style={{ color: "var(--text-muted)" }}>Detailed record of every tiffin meal prepared and delivered to you.</p>
            </div>

            {orders.length === 0 ? (
              <div className="card" style={{ padding: "3rem 1.5rem", textAlign: "center", border: "1px dashed var(--border)" }}>
                <ShoppingBag size={48} style={{ color: "var(--secondary)", opacity: 0.8, margin: "0 auto 1rem", display: "block" }} />
                <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.2rem", color: "var(--text)", marginBottom: "0.5rem" }}>
                  No Order History Yet
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: 460, margin: "0 auto 1.5rem", lineHeight: 1.6 }}>
                  You haven't placed any meal orders yet. Order a single trial thali or subscribe to a weekly meal plan.
                </p>
                <Link href="/search" className="btn btn-primary" style={{ display: "inline-flex" }}>
                  Order Your First Meal
                </Link>
              </div>
            ) : (
              <div className="card" style={{ overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-alt)" }}>
                      {["Order #", "Home Cook", "Date", "Meal Slot", "Items Included", "Price", "Status"].map((h) => (
                        <th key={h} style={{ padding: "0.875rem 1.25rem", textAlign: "left", fontSize: "0.8125rem", fontWeight: 700, color: "var(--text-muted)", fontFamily: "Poppins" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td style={{ padding: "1.1rem 1.25rem", fontWeight: 600, fontSize: "0.875rem", color: "var(--primary)" }}>{order.id}</td>
                        <td style={{ padding: "1.1rem 1.25rem", fontSize: "0.875rem", color: "var(--text)", fontWeight: 500 }}>{order.cookName}</td>
                        <td style={{ padding: "1.1rem 1.25rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>{order.date}</td>
                        <td style={{ padding: "1.1rem 1.25rem", fontSize: "0.875rem", color: "var(--text)" }}>{order.slot}</td>
                        <td style={{ padding: "1.1rem 1.25rem", fontSize: "0.8125rem", color: "var(--text-muted)" }}>{order.items?.join(", ") || "Fresh Thali"}</td>
                        <td style={{ padding: "1.1rem 1.25rem", fontWeight: 700, color: "var(--text)" }}>₹{order.amount}</td>
                        <td style={{ padding: "1.1rem 1.25rem" }}>
                          <span className={`badge ${STATUS_COLORS[order.status] || "badge-active"}`}>{order.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: REVIEWS & FEEDBACK */}
        {activeTab === "reviews" && (
          <div>
            <div style={{ marginBottom: "2rem" }}>
              <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.75rem", color: "var(--text)", marginBottom: "0.25rem" }}>
                My Reviews & Cook Ratings
              </h1>
              <p style={{ color: "var(--text-muted)" }}>Help local home cooks improve by sharing honest feedback on taste, portion, and hygiene.</p>
            </div>

            {/* Leave a Review Form */}
            <div className="card" style={{ padding: "2rem", marginBottom: "2rem" }}>
              <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.125rem", color: "var(--text)", marginBottom: "1rem" }}>
                Rate Your Recent Meal Experience
              </h3>
              <form onSubmit={handleAddReview}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <label className="label">Select Cook</label>
                    <select
                      className="input"
                      value={newReview.cook}
                      onChange={(e) => setNewReview({ ...newReview, cook: e.target.value })}
                    >
                      <option value="Meera's Kitchen">Meera's Kitchen</option>
                      <option value="Jeet's Kitchen">Jeet's Kitchen</option>
                      <option value="Priya's Home Kitchen">Priya's Home Kitchen</option>
                      <option value="Jain Bhavan Tiffin">Jain Bhavan Tiffin</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Rating (Stars)</label>
                    <select
                      className="input"
                      value={newReview.rating}
                      onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 - Outstanding Home Food)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                      <option value={3}>⭐⭐⭐ (3 - Average)</option>
                      <option value={2}>⭐⭐ (2 - Needs Improvement)</option>
                      <option value={1}>⭐ (1 - Unsatisfactory)</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: "1.25rem" }}>
                  <label className="label">Your Comments / Experience</label>
                  <textarea
                    rows={3}
                    required
                    className="input"
                    placeholder="Tell us about the rotis, sabzi freshness, spice level, or delivery punctuality..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Submit Review
                </button>
              </form>
            </div>

            {/* Past Reviews */}
            {userReviews.length === 0 ? (
              <div className="card" style={{ padding: "2.5rem 1.5rem", textAlign: "center", border: "1px dashed var(--border)" }}>
                <Star size={40} style={{ color: "var(--accent)", opacity: 0.8, margin: "0 auto 0.75rem", display: "block" }} />
                <h4 style={{ fontWeight: 700, color: "var(--text)", marginBottom: "0.25rem" }}>No Reviews Submitted Yet</h4>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }}>
                  Share your experience with your home cooks after receiving deliveries!
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {userReviews.map((rev, i) => (
                  <div key={i} className="card" style={{ padding: "1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <h4 style={{ fontWeight: 700, color: "var(--text)" }}>{rev.cook}</h4>
                      <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{rev.date}</span>
                    </div>
                    <div style={{ color: "var(--accent)", marginBottom: "0.5rem" }}>
                      {"★".repeat(rev.rating)}
                      <span style={{ color: "var(--border)" }}>{"★".repeat(5 - rev.rating)}</span>
                    </div>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: SUPPORT & DISPUTES */}
        {activeTab === "complaints" && (
          <div>
            <div style={{ marginBottom: "2rem" }}>
              <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.75rem", color: "var(--text)", marginBottom: "0.25rem" }}>
                Customer Support & Issue Resolution
              </h1>
              <p style={{ color: "var(--text-muted)" }}>Got an issue with delivery delay, missing items, or food quality? We resolve tickets within 24 hours.</p>
            </div>

            <div className="card" style={{ padding: "2rem", marginBottom: "2rem" }}>
              <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.125rem", color: "var(--text)", marginBottom: "1rem" }}>
                Raise a Support Ticket
              </h3>

              {complaintSubmitted && (
                <div style={{ padding: "1rem", background: "rgba(47, 125, 79, 0.1)", borderRadius: "var(--radius-sm)", color: "var(--secondary)", marginBottom: "1rem", fontWeight: 600 }}>
                  ✓ Support ticket registered! Our team has notified the cook and will call you.
                </div>
              )}

              <form onSubmit={handleCreateComplaint}>
                <div style={{ marginBottom: "1rem" }}>
                  <label className="label">Associated Cook / Kitchen</label>
                  <select
                    className="input"
                    value={newComplaint.cook}
                    onChange={(e) => setNewComplaint({ ...newComplaint, cook: e.target.value })}
                  >
                    <option value="Meera's Kitchen">Meera's Kitchen</option>
                    <option value="Jeet's Kitchen">Jeet's Kitchen</option>
                    <option value="Priya's Home Kitchen">Priya's Home Kitchen</option>
                    <option value="Jain Bhavan Tiffin">Jain Bhavan Tiffin</option>
                  </select>
                </div>

                <div style={{ marginBottom: "1.25rem" }}>
                  <label className="label">Describe the Issue in Detail</label>
                  <textarea
                    rows={3}
                    required
                    className="input"
                    placeholder="e.g. Tiffin was delivered 45 minutes late, or papad/salad was missing from today's meal..."
                    value={newComplaint.issue}
                    onChange={(e) => setNewComplaint({ ...newComplaint, issue: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn btn-danger" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                  <Send size={16} /> Submit Ticket
                </button>
              </form>
            </div>

            {/* List of Tickets */}
            {complaints.length === 0 ? (
              <div className="card" style={{ padding: "2.5rem 1.5rem", textAlign: "center", border: "1px dashed var(--border)" }}>
                <CheckCircle size={40} style={{ color: "var(--secondary)", opacity: 0.8, margin: "0 auto 0.75rem", display: "block" }} />
                <h4 style={{ fontWeight: 700, color: "var(--text)", marginBottom: "0.25rem" }}>No Active Disputes or Complaints</h4>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }}>
                  All your deliveries and meal plans are in good standing. If you ever face an issue, submit a ticket above.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {complaints.map((c) => (
                  <div key={c.id} className="card" style={{ padding: "1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <strong style={{ fontFamily: "Poppins", color: "var(--primary)" }}>{c.id} • {c.cook}</strong>
                      <span className="badge badge-secondary">{c.status}</span>
                    </div>
                    <p style={{ color: "var(--text)", fontSize: "0.9rem", marginBottom: "0.75rem" }}>{c.issue}</p>
                    <div style={{ padding: "0.75rem", background: "var(--surface-alt)", borderRadius: "var(--radius-sm)", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      <strong>Support Update:</strong> {c.reply}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: PROFILE */}
        {activeTab === "profile" && (
          <div>
            <div style={{ marginBottom: "2rem" }}>
              <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.75rem", color: "var(--text)", marginBottom: "0.25rem" }}>
                My Profile & Delivery Preferences
              </h1>
              <p style={{ color: "var(--text-muted)" }}>Manage your personal details, default delivery address, and dietary requirements.</p>
            </div>

            <div className="card" style={{ maxWidth: 680, padding: "2rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label className="label">Full Name</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Your Full Name"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Mobile Number (10 digits)</label>
                  <input
                    type="tel"
                    maxLength={10}
                    pattern="[6-9][0-9]{9}"
                    placeholder="10-digit mobile number"
                    className="input"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label className="label">Email Address</label>
                <input
                  type="email"
                  className="input"
                  placeholder="name@example.com"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label className="label">Primary Delivery Address</label>
                <textarea
                  rows={2}
                  className="input"
                  placeholder="Flat/House no., building, street, area, city and pincode"
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                <div>
                  <label className="label">Default Meal Preference</label>
                  <select
                    className="input"
                    value={profileForm.pref}
                    onChange={(e) => setProfileForm({ ...profileForm, pref: e.target.value })}
                  >
                    <option value="veg">Pure Vegetarian</option>
                    <option value="jain">Jain (No Root Veg)</option>
                    <option value="nonveg">Veg & Non-Veg</option>
                  </select>
                </div>
                <div>
                  <label className="label">Spice Tolerance</label>
                  <select
                    className="input"
                    value={profileForm.spice}
                    onChange={(e) => setProfileForm({ ...profileForm, spice: e.target.value })}
                  >
                    <option value="mild">Mild (Low spice)</option>
                    <option value="medium">Medium Home-style</option>
                    <option value="spicy">Spicy Kathiyawadi</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (profileForm.phone && profileForm.phone.length !== 10) {
                    alert("Please enter a valid 10-digit mobile number.");
                    return;
                  }
                  try {
                    const u = localStorage.getItem("hf_user");
                    const current = u ? JSON.parse(u) : {};
                    const updated = {
                      ...current,
                      name: profileForm.name,
                      phone: profileForm.phone,
                      email: profileForm.email,
                      address: profileForm.address,
                      dietaryPreference: profileForm.pref,
                      spicePreference: profileForm.spice,
                    };
                    localStorage.setItem("hf_user", JSON.stringify(updated));
                    if (custCleanKey) {
                      localStorage.setItem(`hf_customer_profile_${custCleanKey}`, JSON.stringify(profileForm));
                    }
                    setCurrentUser((prev) => ({
                      ...prev,
                      name: profileForm.name,
                      email: profileForm.email,
                      phone: profileForm.phone,
                      address: profileForm.address,
                    }));
                    alert("Profile and delivery preferences updated successfully!");
                  } catch {
                    alert("Profile updated successfully!");
                  }
                }}
                className="btn btn-primary"
              >
                Save Preferences
              </button>
            </div>

            {/* DPDP Act 2023 Data Privacy & Deletion Card */}
            <div className="card" style={{ maxWidth: 680, padding: "2rem", marginTop: "2rem", border: "1.5px solid rgba(198,47,47,0.3)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div style={{ width: 40, height: 40, borderRadius: "8px", background: "rgba(198,47,47,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--danger)" }}>
                  <Trash2 size={20} />
                </div>
                <div>
                  <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.125rem", color: "var(--text)" }}>
                    Data Privacy & Account Erasure
                  </h3>
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                    India DPDP Act 2023 · Right to Erasure
                  </p>
                </div>
              </div>

              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                Under India's Digital Personal Data Protection Act 2023, you have the statutory right to permanently delete your account, saved addresses, and all personal identifiable information. Once submitted, your data will be purged within 30 days.
              </p>

              {deleteSuccess ? (
                <div style={{ padding: "0.875rem 1rem", borderRadius: "8px", background: "var(--surface-alt)", border: "1px solid var(--border)", color: "var(--secondary)", fontWeight: 600, fontSize: "0.875rem" }}>
                  ✓ {deleteSuccess}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="btn btn-outline"
                  style={{ color: "var(--danger)", borderColor: "var(--danger)" }}
                  id="delete-account-btn"
                >
                  <Trash2 size={16} /> Request Permanent Account Deletion
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
