"use client";
import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Users, ChefHat, ShoppingBag, MessageSquare,
  BarChart2, Settings, LogOut, CheckCircle, XCircle, Clock,
  TrendingUp, TrendingDown, AlertTriangle, Plus, Filter,
  Shield, Check, ArrowRight
} from "lucide-react";
import AdminKpiChart from "@/components/AdminKpiChart";

const INITIAL_PENDING_COOKS = [
  { id: "pc1", name: "Suresh Bhai's Kitchen", owner: "Suresh Patel", city: "Rajkot", submittedAt: "2024-10-13", fssai: "10020042004991", docs: 3, cuisine: "Gujarati & Kathiyawadi", capacity: "40 meals/day" },
  { id: "pc2", name: "Mamta Didi's Tiffin", owner: "Mamta Joshi", city: "Ahmedabad", submittedAt: "2024-10-12", fssai: "10020042005112", docs: 2, cuisine: "North Indian & Jain", capacity: "25 meals/day" },
  { id: "pc3", name: "Gopal Bhai Kitchen", owner: "Gopal Sharma", city: "Rajkot", submittedAt: "2024-10-11", fssai: "Pending Verification", docs: 1, cuisine: "Punjabi", capacity: "30 meals/day" },
];

const INITIAL_COMPLAINTS = [
  { id: "cp1", user: "Rahul M.", cook: "Meera's Kitchen", issue: "Delivery was 35 mins late on Tuesday.", status: "open", date: "2024-10-11", priority: "Medium" },
  { id: "cp2", user: "Anita S.", cook: "Priya's Home Kitchen", issue: "Spicy level was higher than requested.", status: "in_review", date: "2024-10-10", priority: "Low" },
  { id: "cp3", user: "Vikram K.", cook: "Jain Bhavan Tiffin", issue: "Salad was missing from lunch pack.", status: "resolved", date: "2024-10-08", priority: "Low" },
];

const MOCK_USERS_LIST = [
  { id: "u1", name: "Arjun Verma", role: "Customer", email: "arjun.v@gmail.com", city: "Rajkot", status: "Active", joined: "Jan 2024", subs: 2 },
  { id: "u2", name: "Meera Patel", role: "Cook", email: "meera.patel@gmail.com", city: "Rajkot", status: "Active", joined: "Nov 2023", subs: 23 },
  { id: "u3", name: "Priya Shah", role: "Cook", email: "priya.shah@gmail.com", city: "Rajkot", status: "Active", joined: "Feb 2024", subs: 18 },
  { id: "u4", name: "Kavya Reddy", role: "Customer", email: "kavya.r@gmail.com", city: "Ahmedabad", status: "Active", joined: "Mar 2024", subs: 1 },
  { id: "u5", name: "Suresh Patel", role: "Cook (Applicant)", email: "suresh.b@gmail.com", city: "Rajkot", status: "Pending", joined: "Oct 2024", subs: 0 },
];

const KPI_DATA = [
  { label: "Registered Users", value: "12,480", change: "+8%", positive: true, icon: Users },
  { label: "Active Subscriptions", value: "3,241", change: "+12%", positive: true, icon: CheckCircle },
  { label: "Cook Onboarding Rate", value: "68%", change: "+5%", positive: true, icon: ChefHat },
  { label: "Pending Complaints", value: "14", change: "-23%", positive: true, icon: AlertTriangle },
];

const ADMIN_SIDEBAR = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "users", label: "Users & Customers", icon: Users },
  { key: "cooks", label: "Cook Approvals", icon: ChefHat },
  { key: "orders", label: "Orders & Subs", icon: ShoppingBag },
  { key: "complaints", label: "Complaints & Disputes", icon: MessageSquare },
  { key: "kpi", label: "KPI Reports", icon: BarChart2 },
  { key: "settings", label: "Platform Settings", icon: Settings },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [pendingCooks, setPendingCooks] = useState(INITIAL_PENDING_COOKS);
  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  const [approving, setApproving] = useState<string | null>(null);

  const handleApproveCook = (id: string) => {
    setApproving(id);
    setTimeout(() => {
      setPendingCooks((prev) => prev.filter((c) => c.id !== id));
      setApproving(null);
    }, 600);
  };

  const handleRejectCook = (id: string) => {
    setPendingCooks((prev) => prev.filter((c) => c.id !== id));
  };

  const handleResolveComplaint = (id: string) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "resolved" } : c))
    );
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      {/* Admin Sidebar */}
      <aside className="sidebar" aria-label="Admin navigation">
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.5rem" }}>
            <div style={{ width: 40, height: 40, borderRadius: "10px", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "Poppins", fontWeight: 800 }}>
              A
            </div>
            <div>
              <p style={{ fontFamily: "Poppins", fontWeight: 700, color: "var(--text)", margin: 0, fontSize: "0.9375rem" }}>Super Admin</p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>admin@homefeast.in</p>
            </div>
          </div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          {ADMIN_SIDEBAR.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              className={`sidebar-link${activeTab === key ? " active" : ""}`}
              onClick={() => setActiveTab(key)}
              style={{ width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", borderRadius: "8px", fontWeight: 600 }}
            >
              <Icon size={18} />
              <span style={{ flex: 1 }}>{label}</span>
              {key === "cooks" && pendingCooks.length > 0 && (
                <span style={{ background: "var(--danger)", color: "white", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontFamily: "Poppins", fontWeight: 700 }}>
                  {pendingCooks.length}
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

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: "2rem", overflow: "auto" }}>
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div>
            <div style={{ marginBottom: "2rem" }}>
              <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.75rem", color: "var(--text)", marginBottom: "0.25rem" }}>
                Admin Operations Panel
              </h1>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem" }}>
                Real-time monitor for orders, subscriber retention, cook verifications, and customer disputes.
              </p>
            </div>

            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "2.5rem" }}>
              {KPI_DATA.map(({ label, value, change, positive, icon: Icon }) => (
                <div key={label} className="kpi-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: "0.375rem", fontWeight: 500 }}>{label}</p>
                      <p style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "2rem", color: "var(--text)", margin: 0 }}>{value}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.375rem" }}>
                        {positive ? <TrendingUp size={13} style={{ color: "var(--secondary)" }} /> : <TrendingDown size={13} style={{ color: "var(--danger)" }} />}
                        <span style={{ fontSize: "0.8rem", color: positive ? "var(--secondary)" : "var(--danger)", fontWeight: 600 }}>{change}</span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>vs last month</span>
                      </div>
                    </div>
                    <div style={{ width: 44, height: 44, borderRadius: "10px", background: "var(--surface-alt)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={22} style={{ color: "var(--primary)" }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              {/* Pending Cook Approvals Preview */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                  <h2 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.125rem", color: "var(--text)" }}>
                    Pending Cook Approvals ({pendingCooks.length})
                  </h2>
                  <button onClick={() => setActiveTab("cooks")} className="btn btn-ghost" style={{ fontSize: "0.875rem", color: "var(--primary)" }}>
                    View all
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                  {pendingCooks.length === 0 ? (
                    <div className="card" style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
                      <CheckCircle size={32} style={{ color: "var(--secondary)", margin: "0 auto 0.5rem" }} />
                      <p>All cook registrations reviewed!</p>
                    </div>
                  ) : (
                    pendingCooks.map((cook) => (
                      <div key={cook.id} className="card" style={{ padding: "1.25rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                          <div>
                            <p style={{ fontFamily: "Poppins", fontWeight: 700, color: "var(--text)", margin: 0 }}>{cook.name}</p>
                            <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: "0.2rem 0" }}>by {cook.owner} · {cook.city}</p>
                            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>FSSAI: {cook.fssai}</p>
                          </div>
                          <span className="badge badge-pending" style={{ fontSize: "0.7rem" }}>
                            {cook.docs} Docs Attached
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: "0.625rem" }}>
                          <button
                            onClick={() => handleApproveCook(cook.id)}
                            disabled={approving === cook.id}
                            className="btn btn-secondary"
                            style={{ flex: 1, justifyContent: "center", fontSize: "0.8125rem", padding: "0.5rem" }}
                          >
                            {approving === cook.id ? "Approving..." : <><CheckCircle size={14} /> Approve Cook</>}
                          </button>
                          <button
                            onClick={() => handleRejectCook(cook.id)}
                            className="btn btn-ghost"
                            style={{ flex: 1, justifyContent: "center", fontSize: "0.8125rem", padding: "0.5rem", color: "var(--danger)" }}
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Recent Complaints Preview */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                  <h2 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.125rem", color: "var(--text)" }}>Recent Complaints Desk</h2>
                  <button onClick={() => setActiveTab("complaints")} className="btn btn-ghost" style={{ fontSize: "0.875rem", color: "var(--primary)" }}>
                    View all
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                  {complaints.map((c) => (
                    <div key={c.id} className="card" style={{ padding: "1.25rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                        <span style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text)" }}>
                          {c.user} ➔ {c.cook}
                        </span>
                        <span className={`badge ${c.status === "resolved" ? "badge-active" : "badge-cancelled"}`} style={{ fontSize: "0.7rem" }}>
                          {c.status.toUpperCase()}
                        </span>
                      </div>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.75rem", lineHeight: 1.5 }}>
                        {c.issue}
                      </p>
                      {c.status !== "resolved" && (
                        <button
                          onClick={() => handleResolveComplaint(c.id)}
                          className="btn btn-outline"
                          style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}
                        >
                          Mark as Resolved
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USERS */}
        {activeTab === "users" && (
          <div>
            <div style={{ marginBottom: "2rem" }}>
              <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.75rem", color: "var(--text)", marginBottom: "0.25rem" }}>
                User Management
              </h1>
              <p style={{ color: "var(--text-muted)" }}>Directory of registered customers, home cooks, and pending partner accounts.</p>
            </div>

            <div className="card" style={{ overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-alt)" }}>
                    {["User", "Role", "Email", "City", "Joined", "Status", "Action"].map((h) => (
                      <th key={h} style={{ padding: "0.875rem 1.25rem", textAlign: "left", fontSize: "0.8125rem", fontWeight: 700, color: "var(--text-muted)", fontFamily: "Poppins" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MOCK_USERS_LIST.map((u) => (
                    <tr key={u.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "1rem 1.25rem", fontWeight: 700, color: "var(--text)", fontSize: "0.875rem" }}>{u.name}</td>
                      <td style={{ padding: "1rem 1.25rem", fontSize: "0.875rem" }}>
                        <span className={`badge ${u.role.includes("Cook") ? "badge-primary" : "badge-secondary"}`}>{u.role}</span>
                      </td>
                      <td style={{ padding: "1rem 1.25rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>{u.email}</td>
                      <td style={{ padding: "1rem 1.25rem", fontSize: "0.875rem" }}>{u.city}</td>
                      <td style={{ padding: "1rem 1.25rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>{u.joined}</td>
                      <td style={{ padding: "1rem 1.25rem" }}>
                        <span className={`badge ${u.status === "Active" ? "badge-active" : "badge-pending"}`}>{u.status}</span>
                      </td>
                      <td style={{ padding: "1rem 1.25rem" }}>
                        <button className="btn btn-ghost" style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}>Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: COOK APPROVALS */}
        {activeTab === "cooks" && (
          <div>
            <div style={{ marginBottom: "2rem" }}>
              <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.75rem", color: "var(--text)", marginBottom: "0.25rem" }}>
                Cook Verification & Onboarding Desk
              </h1>
              <p style={{ color: "var(--text-muted)" }}>Review hygiene declarations, FSSAI numbers, and food samples before approving public listings.</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {pendingCooks.map((cook) => (
                <div key={cook.id} className="card" style={{ padding: "1.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                      <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.2rem", color: "var(--text)", margin: 0 }}>{cook.name}</h3>
                      <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", margin: "0.25rem 0" }}>Owner: {cook.owner} • {cook.city} • Capacity: {cook.capacity}</p>
                      <p style={{ fontSize: "0.8125rem", color: "var(--primary)", fontWeight: 600 }}>Cuisines: {cook.cuisine}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span className="badge badge-pending" style={{ fontSize: "0.8rem", padding: "0.35rem 0.75rem" }}>Under Audit</span>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>FSSAI: {cook.fssai}</p>
                    </div>
                  </div>

                  <div style={{ background: "var(--surface-alt)", borderRadius: "var(--radius-sm)", padding: "1rem", marginBottom: "1.25rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    ✓ Cleanliness Checklist: Water filter verified • Kitchen photos attached • ID proof verified
                  </div>

                  <div style={{ display: "flex", gap: "1rem" }}>
                    <button
                      onClick={() => handleApproveCook(cook.id)}
                      className="btn btn-secondary"
                      style={{ padding: "0.625rem 1.5rem" }}
                    >
                      <CheckCircle size={16} /> Approve & Publish Listing
                    </button>
                    <button
                      onClick={() => handleRejectCook(cook.id)}
                      className="btn btn-ghost"
                      style={{ color: "var(--danger)" }}
                    >
                      <XCircle size={16} /> Reject Application
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ORDERS & SUBS */}
        {activeTab === "orders" && (
          <div>
            <div style={{ marginBottom: "2rem" }}>
              <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.75rem", color: "var(--text)", marginBottom: "0.25rem" }}>
                Platform-Wide Orders & Subscriptions
              </h1>
              <p style={{ color: "var(--text-muted)" }}>Live stream of meal deliveries, billing, and order completions across all active cities.</p>
            </div>

            <div className="card" style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                <span className="badge badge-active" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}>Total Subscriptions: 3,241</span>
                <span className="badge badge-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}>Deliveries Today: 2,890</span>
                <span className="badge badge-secondary" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}>On-Time Rate: 98.4%</span>
              </div>
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Order dispatching operates automatically via cook push notifications.</p>
            </div>
          </div>
        )}

        {/* TAB 5: COMPLAINTS */}
        {activeTab === "complaints" && (
          <div>
            <div style={{ marginBottom: "2rem" }}>
              <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.75rem", color: "var(--text)", marginBottom: "0.25rem" }}>
                Complaints & Disputes Resolution Desk
              </h1>
              <p style={{ color: "var(--text-muted)" }}>Direct escalation line between customers and home cooks.</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {complaints.map((c) => (
                <div key={c.id} className="card" style={{ padding: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <div>
                      <strong style={{ fontSize: "1rem", color: "var(--text)" }}>Ticket #{c.id}</strong>
                      <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginLeft: "0.75rem" }}>{c.user} vs {c.cook} ({c.date})</span>
                    </div>
                    <span className={`badge ${c.status === "resolved" ? "badge-active" : "badge-cancelled"}`}>{c.status.toUpperCase()}</span>
                  </div>
                  <p style={{ fontSize: "0.9rem", color: "var(--text)", marginBottom: "1rem" }}>{c.issue}</p>
                  {c.status !== "resolved" && (
                    <button onClick={() => handleResolveComplaint(c.id)} className="btn btn-secondary" style={{ fontSize: "0.8125rem" }}>
                      <Check size={14} /> Resolve & Close Ticket
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: KPI REPORTS */}
        {activeTab === "kpi" && (
          <div>
            <div style={{ marginBottom: "2rem" }}>
              <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.75rem", color: "var(--text)", marginBottom: "0.25rem" }}>
                Key Performance Indicator (KPI) Analytics
              </h1>
              <p style={{ color: "var(--text-muted)" }}>Metrics aligning with the HomeFeast PRD targets.</p>
            </div>

            {/* City Growth & Subscriber Chart */}
            <div className="card" style={{ padding: "1.75rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <div>
                  <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.125rem", color: "var(--text)", margin: 0 }}>
                    Active Subscribers vs. Verified Cooks by City
                  </h3>
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: "0.25rem 0 0" }}>Regional platform adoption overview (Rajkot, Ahmedabad, Surat, Vadodara)</p>
                </div>
                <span className="badge badge-primary" style={{ fontSize: "0.75rem" }}>Live Network Data</span>
              </div>
              <AdminKpiChart />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
              <div className="card" style={{ padding: "1.75rem" }}>
                <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.0625rem", color: "var(--text)", marginBottom: "0.5rem" }}>City Penetration</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "1rem" }}>Active subscriber share by region</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.875rem", lineHeight: 2 }}>
                  <li>📍 <strong>Rajkot:</strong> 54% (1,750 active subscribers)</li>
                  <li>📍 <strong>Ahmedabad:</strong> 32% (1,037 active subscribers)</li>
                  <li>📍 <strong>Surat:</strong> 14% (454 active subscribers)</li>
                </ul>
              </div>

              <div className="card" style={{ padding: "1.75rem" }}>
                <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.0625rem", color: "var(--text)", marginBottom: "0.5rem" }}>Retention & LTV</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "1rem" }}>Subscription continuity stats</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.875rem", lineHeight: 2 }}>
                  <li>🔄 <strong>Monthly Renewal Rate:</strong> 74.2%</li>
                  <li>⭐ <strong>Average Cook Rating:</strong> 4.72 / 5.0</li>
                  <li>⏱️ <strong>Average Resolution Time:</strong> 3.4 hours</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: SETTINGS */}
        {activeTab === "settings" && (
          <div>
            <div style={{ marginBottom: "2rem" }}>
              <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "1.75rem", color: "var(--text)", marginBottom: "0.25rem" }}>
                Platform Settings & Governance
              </h1>
              <p style={{ color: "var(--text-muted)" }}>Configure commission tiers, compliance rules, and city rollouts.</p>
            </div>

            <div className="card" style={{ maxWidth: 640, padding: "2rem" }}>
              <div style={{ marginBottom: "1.25rem" }}>
                <label className="label">Platform Commission (%)</label>
                <input type="number" className="input" defaultValue={10} />
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>Current fee charged to home cooks per fulfilled subscription</p>
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label className="label">FSSAI Verification Mode</label>
                <select className="input" defaultValue="mandatory">
                  <option value="mandatory">Mandatory before listing goes live (Recommended)</option>
                  <option value="grace">15-day grace period for new home cooks</option>
                </select>
              </div>

              <button type="button" onClick={() => alert("Settings saved!")} className="btn btn-primary">
                Save Global Settings
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
