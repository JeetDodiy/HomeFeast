import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | HomeFeast",
  description:
    "HomeFeast Refund & Cancellation Policy — clear, transparent rules on meal cancellations, 8:00 PM cutoff, dispute resolutions, and pro-rata refunds.",
};

export default function RefundPage() {
  const sections = [
    {
      title: "1. Overview & Fair Refund Commitment",
      content: `At HomeFeast, we value transparent pricing, mutual respect between home cooks and subscribers, and zero hidden deductions. Because our verified home cooks purchase fresh groceries and handcraft meals daily according to confirmed orders, our cancellation and refund policies balance customer flexibility with cook sustainability.`,
    },
    {
      title: "2. The 8:00 PM Cutoff Rule",
      content: `To ensure home cooks do not waste fresh ingredients:

• **Next-Day Meal Pause / Skip:** Any pause, meal skip, or cancellation for lunch or dinner must be requested before **8:00 PM IST** on the previous calendar day.
• **Automatic Rescheduling:** When you pause or skip before 8:00 PM, your subscription validity is automatically extended by 1 day or credited to your account balance.
• **Late Cancellation (After 8:00 PM):** If a meal is cancelled after 8:00 PM on the previous day, the meal cost cannot be refunded as ingredients have already been procured and prepped by the cook.`,
    },
    {
      title: "3. Pro-Rata Refunds for Subscriptions",
      content: `If you need to permanently cancel an active Weekly or Monthly subscription midway:

• **Pro-Rata Calculation:** You are refunded for all unconsumed, un-prepped meals from the day following your cancellation request (subject to the 8:00 PM cutoff).
• **Promotional Discounts:** If a discount coupon (e.g. FIRSTFEAST or WELCOME50) was applied to a monthly bundle and the subscription is terminated in week 1, the refund is calculated based on the standard daily rate for meals actually consumed.
• **Processing Window:** Approved refunds are initiated immediately and credited to your original payment mode (or UPI ID) within **5 to 7 business days**.`,
    },
    {
      title: "4. Quality Disputes & Missing Items",
      content: `If your meal fails to meet our hygiene and quality expectations:

• **Report Within 2 Hours:** Raise a complaint via your Customer Dashboard or call our support line within 2 hours of meal receipt.
• **Resolution Options:** Upon review, HomeFeast will provide:
  1. An immediate replacement meal from the kitchen, or
  2. A 100% full credit/refund for that day's meal.
• **Zero Questions Asked on Hygiene:** Any verified packaging tamper or hygiene violation results in an immediate 100% refund and a formal audit of the cook.`,
    },
    {
      title: "5. Cook Cancellation / Leave Mode",
      content: `If a home cook goes on emergency leave or is unable to fulfill a confirmed subscription order:

• You will be notified immediately via SMS and email.
• 100% of the daily meal cost will be automatically credited back or an equivalent verified kitchen nearby will be offered with your approval.`,
    },
    {
      title: "6. How to Request a Refund",
      content: `You can initiate a refund or dispute through:

1. **Customer Dashboard:** Go to *Complaints & Disputes* tab ➔ *Raise Complaint*.
2. **Email:** Send your Order ID and photos to **refunds@homefeast.in**.
3. **WhatsApp / Phone Support:** Contact our grievance desk at **+91 98765 43210** (9:00 AM – 9:00 PM IST).`,
    },
  ];

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <section
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
          padding: "4rem 0 3rem",
        }}
      >
        <div className="container-custom" style={{ maxWidth: 840 }}>
          <div className="section-tag" style={{ display: "inline-flex", marginBottom: "1rem" }}>
            🛡️ Transparency & Trust
          </div>
          <h1
            style={{
              fontFamily: "Poppins",
              fontWeight: 800,
              fontSize: "2.5rem",
              color: "var(--text)",
              marginBottom: "0.75rem",
            }}
          >
            Refund & Cancellation Policy
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
            Last updated: October 14, 2026 · Plain language · Zero dark patterns
          </p>
          <p style={{ color: "var(--text-muted)", marginTop: "1rem", lineHeight: 1.7 }}>
            We believe in honest food and transparent pricing. Here is our straightforward policy regarding pausing,
            skipping, cancelling subscriptions, and receiving prompt refunds.
          </p>
        </div>
      </section>

      <section style={{ padding: "3rem 0 5rem" }}>
        <div className="container-custom" style={{ maxWidth: 840 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {sections.map((section) => (
              <div
                key={section.title}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: "2rem",
                  boxShadow: "var(--shadow)",
                }}
              >
                <h2
                  style={{
                    fontFamily: "Poppins",
                    fontWeight: 700,
                    fontSize: "1.25rem",
                    color: "var(--text)",
                    marginBottom: "1rem",
                  }}
                >
                  {section.title}
                </h2>
                <div
                  style={{
                    color: "var(--text-muted)",
                    lineHeight: 1.8,
                    fontSize: "0.9375rem",
                    whiteSpace: "pre-line",
                  }}
                >
                  {section.content}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "3rem",
              padding: "1.5rem",
              background: "var(--surface-alt)",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
              textAlign: "center",
            }}
          >
            <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem" }}>
              Questions about an active refund? Contact our dedicated support team at{" "}
              <a href="mailto:refunds@homefeast.in" style={{ color: "var(--primary)", fontWeight: 600 }}>
                refunds@homefeast.in
              </a>{" "}
              or view our{" "}
              <Link href="/terms" style={{ color: "var(--primary)", fontWeight: 600 }}>
                Terms of Service
              </Link>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
