"use client";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, ChefHat } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* Header */}
      <section
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
          padding: "4rem 0 3rem",
        }}
      >
        <div className="container-custom" style={{ textAlign: "center" }}>
          <div className="section-tag" style={{ display: "inline-flex" }}>
            📬 Get in Touch
          </div>
          <h1
            style={{
              fontFamily: "Poppins",
              fontWeight: 800,
              fontSize: "clamp(2rem, 4vw, 3rem)",
              color: "var(--text)",
              marginTop: "1rem",
              marginBottom: "0.75rem",
            }}
          >
            Contact HomeFeast
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "1.0625rem",
              maxWidth: 520,
              margin: "0 auto",
            }}
          >
            Have a question, feedback, or issue? We'd love to hear from you. Our
            team responds within 24 hours.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-custom">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.2fr",
              gap: "3rem",
              alignItems: "start",
            }}
          >
            {/* Contact Info */}
            <div>
              <h2
                style={{
                  fontFamily: "Poppins",
                  fontWeight: 700,
                  fontSize: "1.375rem",
                  color: "var(--text)",
                  marginBottom: "1.5rem",
                }}
              >
                Reach Us Directly
              </h2>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                  marginBottom: "2.5rem",
                }}
              >
                {[
                  {
                    icon: Mail,
                    label: "Email",
                    value: "hello@homefeast.in",
                    href: "mailto:hello@homefeast.in",
                    color: "var(--primary)",
                  },
                  {
                    icon: Phone,
                    label: "Phone",
                    value: "+91 98765 43210",
                    href: "tel:+919876543210",
                    color: "var(--secondary)",
                  },
                  {
                    icon: MapPin,
                    label: "Address",
                    value: "Race Course Road, Rajkot, Gujarat 360001, India",
                    href: null,
                    color: "var(--info)",
                  },
                  {
                    icon: Clock,
                    label: "Working Hours",
                    value: "Mon–Sat: 9 AM – 7 PM IST",
                    href: null,
                    color: "var(--accent)",
                  },
                ].map(({ icon: Icon, label, value, href, color }) => (
                  <div
                    key={label}
                    className="card"
                    style={{
                      padding: "1.25rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "12px",
                        background: `${color}15`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={22} style={{ color }} />
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "0.8125rem",
                          color: "var(--text-muted)",
                          marginBottom: "0.25rem",
                          fontWeight: 500,
                        }}
                      >
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          style={{
                            fontWeight: 600,
                            color: "var(--text)",
                            textDecoration: "none",
                          }}
                        >
                          {value}
                        </a>
                      ) : (
                        <p
                          style={{
                            fontWeight: 600,
                            color: "var(--text)",
                            margin: 0,
                          }}
                        >
                          {value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Help Topics */}
              <h3
                style={{
                  fontFamily: "Poppins",
                  fontWeight: 700,
                  fontSize: "1.125rem",
                  color: "var(--text)",
                  marginBottom: "1rem",
                }}
              >
                Quick Help Topics
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.625rem",
                }}
              >
                {[
                  "How do I cancel my subscription?",
                  "How do I become a cook partner?",
                  "I have a complaint about food quality",
                  "Payment and billing issues",
                  "My cook isn't delivering on time",
                ].map((topic) => (
                  <div
                    key={topic}
                    style={{
                      padding: "0.75rem 1rem",
                      background: "var(--surface-alt)",
                      borderRadius: "var(--radius-sm)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.625rem",
                      fontSize: "0.9rem",
                      color: "var(--text-muted)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      border: "1px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--primary)";
                      e.currentTarget.style.color = "var(--primary)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "transparent";
                      e.currentTarget.style.color = "var(--text-muted)";
                    }}
                  >
                    <MessageSquare size={14} style={{ flexShrink: 0 }} />
                    {topic}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="card" style={{ padding: "2rem" }}>
              {sent ? (
                <div style={{ textAlign: "center", padding: "2rem 0" }}>
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      background: "rgba(47,125,79,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 1.5rem",
                    }}
                  >
                    <Send
                      size={32}
                      style={{ color: "var(--secondary)" }}
                    />
                  </div>
                  <h2
                    style={{
                      fontFamily: "Poppins",
                      fontWeight: 700,
                      fontSize: "1.5rem",
                      color: "var(--text)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Message Sent! 🎉
                  </h2>
                  <p
                    style={{
                      color: "var(--text-muted)",
                      lineHeight: 1.7,
                      marginBottom: "1.5rem",
                    }}
                  >
                    Thank you for reaching out! Our team will get back to you
                    within 24 hours at{" "}
                    <strong style={{ color: "var(--text)" }}>{form.email}</strong>.
                  </p>
                  <button
                    onClick={() => {
                      setSent(false);
                      setForm({ name: "", email: "", subject: "", message: "" });
                    }}
                    className="btn btn-outline"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h2
                    style={{
                      fontFamily: "Poppins",
                      fontWeight: 700,
                      fontSize: "1.375rem",
                      color: "var(--text)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Send Us a Message
                  </h2>
                  <p
                    style={{
                      color: "var(--text-muted)",
                      marginBottom: "1.5rem",
                      fontSize: "0.9375rem",
                    }}
                  >
                    Fill in the form below and we'll respond within 24 hours.
                  </p>

                  <form onSubmit={handleSubmit} noValidate>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "1rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <div>
                        <label
                          htmlFor="contact-name"
                          style={{
                            display: "block",
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            color: "var(--text)",
                            marginBottom: "0.5rem",
                          }}
                        >
                          Your Name
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          value={form.name}
                          onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                          }
                          placeholder="John Doe"
                          className="input-base"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="contact-email"
                          style={{
                            display: "block",
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            color: "var(--text)",
                            marginBottom: "0.5rem",
                          }}
                        >
                          Email Address
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          value={form.email}
                          onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                          }
                          placeholder="you@example.com"
                          className="input-base"
                          required
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                      <label
                        htmlFor="contact-subject"
                        style={{
                          display: "block",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          color: "var(--text)",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Subject
                      </label>
                      <select
                        id="contact-subject"
                        value={form.subject}
                        onChange={(e) =>
                          setForm({ ...form, subject: e.target.value })
                        }
                        className="input-base"
                        style={{ cursor: "pointer" }}
                        required
                      >
                        <option value="">Select a topic</option>
                        <option value="general">General Inquiry</option>
                        <option value="subscription">
                          Subscription Issue
                        </option>
                        <option value="complaint">Food Quality Complaint</option>
                        <option value="cook">Cook Partnership</option>
                        <option value="payment">Payment / Billing</option>
                        <option value="feedback">Feedback / Suggestion</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div style={{ marginBottom: "1.5rem" }}>
                      <label
                        htmlFor="contact-message"
                        style={{
                          display: "block",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          color: "var(--text)",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Message
                      </label>
                      <textarea
                        id="contact-message"
                        value={form.message}
                        onChange={(e) =>
                          setForm({ ...form, message: e.target.value })
                        }
                        placeholder="Describe your issue or question in detail..."
                        className="input-base"
                        style={{
                          minHeight: 140,
                          resize: "vertical",
                          fontFamily: "Inter, sans-serif",
                        }}
                        required
                      />
                    </div>

                    <button
                      id="contact-submit-btn"
                      type="submit"
                      className="btn btn-primary"
                      style={{
                        width: "100%",
                        justifyContent: "center",
                        fontSize: "1rem",
                        padding: "0.875rem",
                      }}
                      disabled={loading}
                    >
                      {loading ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send size={16} /> Send Message
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
