"use client";
import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, UtensilsCrossed, Calendar, DollarSign, Clock,
  Bell, Settings, LogOut, Plus, Edit2, Trash2, CheckCircle,
  XCircle, TrendingUp, Package, Users, ToggleLeft, ToggleRight,
  ShieldCheck, ArrowRight, Check
} from "lucide-react";
import EarningsChart from "@/components/EarningsChart";

const COOK_SIDEBAR = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "menu", label: "Menu Manager", icon: UtensilsCrossed },
  { key: "plans", label: "Plans & Pricing", icon: DollarSign },
  { key: "requests", label: "Requests Inbox", icon: Bell },
  { key: "orders", label: "Today's Orders", icon: Package },
  { key: "earnings", label: "Earnings & Payouts", icon: TrendingUp },
  { key: "profile", label: "Kitchen Profile", icon: Settings },
];

const INITIAL_REQUESTS = [
  { id: "r1", customerName: "Arjun Verma", plan: "Weekly Plan", startDate: "2024-10-15", slot: "Lunch (12–1 PM)", city: "Rajkot", status: "pending", note: "Less spicy please" },
  { id: "r2", customerName: "Kavya Reddy", plan: "Monthly Plan", startDate: "2024-10-14", slot: "Dinner (7–8 PM)", city: "Rajkot", status: "pending", note: "Extra rotis preferred" },
];

const INITIAL_MENU = [
  { id: "m1", name: "Dal Fry (Tadka)", type: "veg", price: 40, available: true, mealTime: "Lunch" },
  { id: "m2", name: "Aloo Gobi Masala", type: "veg", price: 45, available: true, mealTime: "Lunch & Dinner" },
  { id: "m3", name: "Paneer Butter Masala", type: "veg", price: 65, available: true, mealTime: "Dinner" },
  { id: "m4", name: "Jeera Rice", type: "veg", price: 30, available: true, mealTime: "Lunch & Dinner" },
  { id: "m5", name: "Phulka Roti (Set of 4)", type: "veg", price: 20, available: true, mealTime: "Lunch & Dinner" },
  { id: "m6", name: "Gujarati Kadhi", type: "veg", price: 35, available: false, mealTime: "Dinner" },
];

const INITIAL_ORDERS = [
  { id: "o1", customer: "Arjun V.", plan: "Weekly", slot: "Lunch 12–1 PM", items: ["Dal Fry", "Aloo Gobi", "Rice", "Phulka"], status: "CONFIRMED" },
  { id: "o2", customer: "Rahul M.", plan: "Monthly", slot: "Lunch 12–1 PM", items: ["Chana Dal", "Mix Veg", "Rice", "Phulka"], status: "IN_PREPARATION" },
  { id: "o3", customer: "Anita S.", plan: "Daily", slot: "Lunch 12–1 PM", items: ["Dal Fry", "Bhindi", "Rice", "Phulka"], status: "OUT_FOR_DELIVERY" },
];

export default function CookDashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [menuItems, setMenuItems] = useState(INITIAL_MENU);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [rejectionReason, setRejectionReason] = useState<Record<string, string>>({});

  // New Dish Modal Form State
  const [showAddDish, setShowAddDish] = useState(false);
  const [newDish, setNewDish] = useState({ name: "", type: "veg", price: 50, mealTime: "Lunch & Dinner" });

  const handleAcceptRequest = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    alert(`Request ${id} accepted! Customer received WhatsApp notification.`);
  };

  const handleRejectRequest = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    alert(`Request ${id} declined.`);
  };

  const toggleAvailability = (id: string) => {
    setMenuItems((prev) =>
      prev.map((m) => (m.id === id ? { ...m, available: !m.available } : m))
    );
  };

  const handleAddDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDish.name.trim()) return;
    const dish = {
      id: `m${Date.now()}`,
      name: newDish.name,
      type: newDish.type,
      price: Number(newDish.price),
      available: true,
      mealTime: newDish.mealTime,
    };
    setMenuItems([...menuItems, dish]);
    setNewDish({ name: "", type: "veg", price: 50, mealTime: "Lunch & Dinner" });
    setShowAddDish(false);
  };

  const updateOrderStatus = (id: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      {/* Cook Sidebar */}
      <aside className="sidebar" aria-label="Cook navigation">
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.5rem" }}>
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="Cook"
              style={{ width: 48, height: 48, borderRadius: "50%", border: "2px solid var(--primary)", objectFit: "cover" }}
            />
            <div>
              <p style={{ fontFamily: "Poppins", fontWeight: 700, color: "var(--text)", margin: 0 }}>Meera Patel</p>
              <span className="badge badge-active" style={{ fontSize: "0.7rem", marginTop: "0.25rem" }}>
                ✓ Verified Cook (Rajkot)
              </span>
            </div>
          </div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          {COOK_SIDEBAR.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              className={`sidebar-link${activeTab === key ? " active" : ""}`}
              onClick={() => setActiveTab(key)}
              style={{ width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", borderRadius: "8px", fontWeight: 600 }}
            >
              <Icon size={18} />
              <span style={{ flex: 1 }}>{label}</span>
              {key === "requests" && requests.length > 0 && (
                <span style={{ background: "var(--primary)", color: "white", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700 }}>
                  {requests.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: "auto", paddingTop: "2rem", borderTop: "1px solid var(--border)" }}>
          <Link href="/auth/login" className="sidebar-link" style={{ width: "100%", textDecoration: "none", color: "var(--danger)" }}>
            <LogOut size={18} /> Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "2rem", overflow: "auto" }}>
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === "dashboard" && (
          <div>
            <div style={{ marginBottom: "2rem" }}>
              <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.75rem", color: "var(--text)", marginBottom: "0.25rem" }}>
                Meera's Kitchen Dashboard 👩‍🍳
              </h1>
              <p style={{ color: "var(--text-muted)" }}>FSSAI Lic: 10020042003854 • Race Course, Rajkot • {orders.length} tiffins scheduled today</p>
            </div>

            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "2.5rem" }}>
              {[
                { label: "Today's Deliveries", value: orders.length.toString(), icon: Package, color: "var(--primary)" },
                { label: "Active Subscribers", value: "23", icon: Users, color: "var(--secondary)" },
                { label: "This Month Payout", value: "₹21,450", icon: TrendingUp, color: "var(--info)" },
                { label: "Active Menu Dishes", value: menuItems.filter((m) => m.available).length.toString(), icon: UtensilsCrossed, color: "var(--accent)" },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="kpi-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>{label}</p>
                      <p style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.875rem", color: "var(--text)", margin: 0 }}>{value}</p>
                    </div>
                    <div style={{ width: 44, height: 44, borderRadius: "10px", background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={22} style={{ color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              {/* Requests Widget */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                  <h2 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.125rem", color: "var(--text)" }}>
                    Incoming Requests ({requests.length})
                  </h2>
                  <button onClick={() => setActiveTab("requests")} className="btn btn-ghost" style={{ fontSize: "0.875rem", color: "var(--primary)" }}>
                    View all
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                  {requests.length === 0 ? (
                    <div className="card" style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
                      <CheckCircle size={32} style={{ color: "var(--secondary)", margin: "0 auto 0.5rem" }} />
                      <p>All subscription requests processed!</p>
                    </div>
                  ) : (
                    requests.map((req) => (
                      <div key={req.id} className="card" style={{ padding: "1.25rem" }}>
                        <div style={{ marginBottom: "0.75rem" }}>
                          <p style={{ fontFamily: "Poppins", fontWeight: 700, color: "var(--text)", margin: 0 }}>{req.customerName}</p>
                          <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: "0.25rem 0" }}>
                            {req.plan} · {req.slot} · Start: {req.startDate}
                          </p>
                          {req.note && <p style={{ fontSize: "0.75rem", color: "var(--primary)" }}>Note: {req.note}</p>}
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            onClick={() => handleAcceptRequest(req.id)}
                            className="btn btn-secondary"
                            style={{ flex: 1, justifyContent: "center", fontSize: "0.8125rem", padding: "0.4rem" }}
                          >
                            <CheckCircle size={14} /> Accept
                          </button>
                          <button
                            onClick={() => handleRejectRequest(req.id)}
                            className="btn btn-ghost"
                            style={{ flex: 1, justifyContent: "center", fontSize: "0.8125rem", padding: "0.4rem", color: "var(--danger)" }}
                          >
                            <XCircle size={14} /> Decline
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Today's Orders Quick View */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                  <h2 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.125rem", color: "var(--text)" }}>Today's Live Dispatch</h2>
                  <button onClick={() => setActiveTab("orders")} className="btn btn-ghost" style={{ fontSize: "0.875rem", color: "var(--primary)" }}>
                    Manage
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                  {orders.map((o) => (
                    <div key={o.id} className="card" style={{ padding: "1.25rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                        <strong>{o.customer} ({o.plan})</strong>
                        <span className="badge badge-active">{o.status}</span>
                      </div>
                      <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: "0.25rem 0" }}>Slot: {o.slot}</p>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{o.items.join(" • ")}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MENU MANAGER */}
        {activeTab === "menu" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <div>
                <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.75rem", color: "var(--text)", marginBottom: "0.25rem" }}>
                  Menu Manager
                </h1>
                <p style={{ color: "var(--text-muted)" }}>Add, remove, or toggle availability of dishes for tomorrow's tiffin boxes.</p>
              </div>
              <button onClick={() => setShowAddDish(!showAddDish)} className="btn btn-primary">
                <Plus size={16} /> Add New Dish
              </button>
            </div>

            {/* Add Dish Form */}
            {showAddDish && (
              <div className="card" style={{ padding: "1.75rem", marginBottom: "2rem", background: "var(--surface-alt)" }}>
                <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.125rem", color: "var(--text)", marginBottom: "1rem" }}>
                  Add a New Recipe / Dish
                </h3>
                <form onSubmit={handleAddDish}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                      <label className="label">Dish Name *</label>
                      <input
                        type="text"
                        required
                        className="input"
                        placeholder="e.g. Sev Tameta Sabzi"
                        value={newDish.name}
                        onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="label">Price (₹)</label>
                      <input
                        type="number"
                        required
                        className="input"
                        value={newDish.price}
                        onChange={(e) => setNewDish({ ...newDish, price: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="label">Meal Slot</label>
                      <select
                        className="input"
                        value={newDish.mealTime}
                        onChange={(e) => setNewDish({ ...newDish, mealTime: e.target.value })}
                      >
                        <option value="Lunch & Dinner">Lunch & Dinner</option>
                        <option value="Lunch Only">Lunch Only</option>
                        <option value="Dinner Only">Dinner Only</option>
                        <option value="Breakfast">Breakfast</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <button type="submit" className="btn btn-primary">
                      Save Dish to Menu
                    </button>
                    <button type="button" onClick={() => setShowAddDish(false)} className="btn btn-ghost">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="card" style={{ overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-alt)" }}>
                    {["Dish Name", "Category", "Meal Time", "Price", "Availability", "Action"].map((h) => (
                      <th key={h} style={{ padding: "0.875rem 1.25rem", textAlign: "left", fontSize: "0.8125rem", fontWeight: 700, color: "var(--text-muted)", fontFamily: "Poppins" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map((dish) => (
                    <tr key={dish.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "1rem 1.25rem", fontWeight: 600, color: "var(--text)", fontSize: "0.9375rem" }}>{dish.name}</td>
                      <td style={{ padding: "1rem 1.25rem" }}>
                        <span className={`badge ${dish.type === "veg" ? "badge-veg" : "badge-nonveg"}`}>
                          <span className={dish.type === "veg" ? "veg-dot" : "nonveg-dot"} />
                          {dish.type.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: "1rem 1.25rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>{dish.mealTime}</td>
                      <td style={{ padding: "1rem 1.25rem", fontWeight: 700, color: "var(--text)" }}>₹{dish.price}</td>
                      <td style={{ padding: "1rem 1.25rem" }}>
                        <button
                          onClick={() => toggleAvailability(dish.id)}
                          className={`badge ${dish.available ? "badge-active" : "badge-cancelled"}`}
                          style={{ cursor: "pointer", border: "none" }}
                        >
                          {dish.available ? "In Stock (Available)" : "Sold Out (Hidden)"}
                        </button>
                      </td>
                      <td style={{ padding: "1rem 1.25rem" }}>
                        <button
                          onClick={() => setMenuItems(menuItems.filter((m) => m.id !== dish.id))}
                          className="btn btn-ghost"
                          style={{ color: "var(--danger)", padding: "0.25rem 0.5rem" }}
                          aria-label="Delete dish"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PLANS & PRICING */}
        {activeTab === "plans" && (
          <div>
            <div style={{ marginBottom: "2rem" }}>
              <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.75rem", color: "var(--text)", marginBottom: "0.25rem" }}>
                Plans & Subscription Pricing
              </h1>
              <p style={{ color: "var(--text-muted)" }}>Configure your daily trial, weekly, and monthly rates offered to subscribers.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {[
                { title: "Daily Trial Plan", price: 120, perMeal: 120, billing: "Pay-as-you-go", desc: "1 Dal, 2 Sabzi, 4 Phulkas, Rice, Salad & Papad", color: "var(--primary)" },
                { title: "Weekly Plan (7 Days)", price: 749, perMeal: 107, billing: "Billed weekly", desc: "Save 11% + Weekend special dessert & Kathiyawadi menu", popular: true, color: "var(--secondary)" },
                { title: "Monthly Plan (30 Days)", price: 2799, perMeal: 93, billing: "Billed monthly", desc: "Best value. Includes up to 5 paused delivery days.", color: "var(--info)" },
              ].map((p, idx) => (
                <div key={idx} className="card" style={{ padding: "2rem", border: p.popular ? "2px solid var(--primary)" : "1px solid var(--border)" }}>
                  {p.popular && <span className="badge badge-primary" style={{ marginBottom: "0.75rem" }}>Most Subscribed</span>}
                  <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.25rem", color: "var(--text)", marginBottom: "0.5rem" }}>{p.title}</h3>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <span style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "2rem", color: p.color }}>₹{p.price}</span>
                    <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>/ {p.billing}</span>
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "var(--secondary)", fontWeight: 600, marginBottom: "1rem" }}>₹{p.perMeal} per meal</p>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "1.5rem" }}>{p.desc}</p>
                  <button className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }}>
                    Edit Plan Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: REQUESTS INBOX */}
        {activeTab === "requests" && (
          <div>
            <div style={{ marginBottom: "2rem" }}>
              <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.75rem", color: "var(--text)", marginBottom: "0.25rem" }}>
                Subscription Requests Inbox
              </h1>
              <p style={{ color: "var(--text-muted)" }}>Approve or decline incoming student & professional subscription requests.</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {requests.map((req) => (
                <div key={req.id} className="card" style={{ padding: "1.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                    <div>
                      <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.125rem", color: "var(--text)" }}>{req.customerName}</h3>
                      <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Plan: {req.plan} • Slot: {req.slot} • Start Date: {req.startDate}</p>
                      {req.note && <p style={{ fontSize: "0.8125rem", color: "var(--primary)", marginTop: "0.25rem" }}>Special Instruction: &ldquo;{req.note}&rdquo;</p>}
                    </div>
                    <span className="badge badge-pending">PENDING ACCEPTANCE</span>
                  </div>

                  <div style={{ display: "flex", gap: "1rem" }}>
                    <button onClick={() => handleAcceptRequest(req.id)} className="btn btn-secondary">
                      <CheckCircle size={16} /> Accept & Start Preparing
                    </button>
                    <button onClick={() => handleRejectRequest(req.id)} className="btn btn-ghost" style={{ color: "var(--danger)" }}>
                      <XCircle size={16} /> Decline Request
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: TODAY'S ORDERS */}
        {activeTab === "orders" && (
          <div>
            <div style={{ marginBottom: "2rem" }}>
              <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.75rem", color: "var(--text)", marginBottom: "0.25rem" }}>
                Today&apos;s Tiffin Packing & Dispatch
              </h1>
              <p style={{ color: "var(--text-muted)" }}>Mark meals as in-preparation, out for delivery, or handed over to customer.</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {orders.map((o) => (
                <div key={o.id} className="card" style={{ padding: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <div>
                      <strong style={{ fontFamily: "Poppins", fontSize: "1.0625rem", color: "var(--text)" }}>{o.customer}</strong>
                      <span style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginLeft: "0.75rem" }}>{o.slot}</span>
                    </div>
                    <span className="badge badge-active">{o.status}</span>
                  </div>

                  <div style={{ background: "var(--surface-alt)", borderRadius: "var(--radius-sm)", padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
                    🍱 Items: <strong>{o.items.join(" • ")}</strong>
                  </div>

                  <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    <button
                      onClick={() => updateOrderStatus(o.id, "IN_PREPARATION")}
                      className={`btn ${o.status === "IN_PREPARATION" ? "btn-primary" : "btn-outline"}`}
                      style={{ fontSize: "0.8125rem", padding: "0.4rem 0.875rem" }}
                    >
                      Cooking
                    </button>
                    <button
                      onClick={() => updateOrderStatus(o.id, "OUT_FOR_DELIVERY")}
                      className={`btn ${o.status === "OUT_FOR_DELIVERY" ? "btn-primary" : "btn-outline"}`}
                      style={{ fontSize: "0.8125rem", padding: "0.4rem 0.875rem" }}
                    >
                      Out for Delivery
                    </button>
                    <button
                      onClick={() => updateOrderStatus(o.id, "DELIVERED")}
                      className={`btn ${o.status === "DELIVERED" ? "btn-secondary" : "btn-outline"}`}
                      style={{ fontSize: "0.8125rem", padding: "0.4rem 0.875rem" }}
                    >
                      ✓ Delivered
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: EARNINGS & PAYOUTS */}
        {activeTab === "earnings" && (
          <div>
            <div style={{ marginBottom: "2rem" }}>
              <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.75rem", color: "var(--text)", marginBottom: "0.25rem" }}>
                Cook Earnings & Payouts
              </h1>
              <p style={{ color: "var(--text-muted)" }}>Weekly direct bank settlements every Monday morning.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
              <div className="card" style={{ padding: "1.5rem" }}>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>Gross Revenue (Oct 2026)</p>
                <h3 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.875rem", color: "var(--primary)" }}>₹23,800</h3>
              </div>
              <div className="card" style={{ padding: "1.5rem" }}>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>Platform Commission (10%)</p>
                <h3 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.875rem", color: "var(--danger)" }}>-₹2,380</h3>
              </div>
              <div className="card" style={{ padding: "1.5rem" }}>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>Net Bank Deposit</p>
                <h3 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.875rem", color: "var(--secondary)" }}>₹21,420</h3>
              </div>
            </div>

            {/* Weekly Earnings Trend Chart */}
            <div className="card" style={{ padding: "1.75rem", marginBottom: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <div>
                  <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.125rem", color: "var(--text)", margin: 0 }}>
                    Weekly Revenue & Delivery Velocity
                  </h3>
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: "0.25rem 0 0" }}>Daily fulfilled meal subscriptions (Last 7 Days)</p>
                </div>
                <span className="badge badge-success" style={{ fontSize: "0.75rem" }}>+18% vs Last Week</span>
              </div>
              <EarningsChart />
            </div>

            <div className="card" style={{ padding: "1.75rem" }}>
              <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.125rem", color: "var(--text)", marginBottom: "0.75rem" }}>
                Registered Bank Account
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text)", marginBottom: "0.25rem" }}>
                State Bank of India • A/C No: <strong>•••• •••• 4892</strong>
              </p>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>IFSC: SBIN0001234 • Race Course Branch, Rajkot</p>
            </div>
          </div>
        )}

        {/* TAB 7: PROFILE */}
        {activeTab === "profile" && (
          <div>
            <div style={{ marginBottom: "2rem" }}>
              <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.75rem", color: "var(--text)", marginBottom: "0.25rem" }}>
                Kitchen Profile & Operating Area
              </h1>
              <p style={{ color: "var(--text-muted)" }}>Manage your address, delivery timings, and certified hygiene credentials.</p>
            </div>

            <div className="card" style={{ maxWidth: 680, padding: "2rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label className="label">Kitchen Name</label>
                  <input type="text" className="input" defaultValue="Meera's Kitchen" />
                </div>
                <div>
                  <label className="label">Head Cook</label>
                  <input type="text" className="input" defaultValue="Meera Patel" />
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label className="label">FSSAI Registration Number</label>
                <input type="text" className="input" defaultValue="10020042003854" />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label className="label">Service Areas (Within 4 km)</label>
                <input type="text" className="input" defaultValue="Race Course, Kalavad Road, Mavdi, 150 Feet Ring Road" />
              </div>

              <button type="button" onClick={() => alert("Profile saved!")} className="btn btn-primary">
                Save Kitchen Profile
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
