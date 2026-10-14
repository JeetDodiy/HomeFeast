import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | HomeFeast",
  description: "HomeFeast terms of service — rules, policies, and guidelines for customers, home cooks, and platform usage.",
};

export default function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: `By accessing or using the HomeFeast platform ("Service"), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Service.

HomeFeast reserves the right to modify these terms at any time. Continued use after changes constitutes acceptance.`,
    },
    {
      title: "2. Account Registration & Eligibility",
      content: `• You must be at least 18 years of age to register or place orders on HomeFeast
• In compliance with India's DPDP Act 2023, parents or legal guardians may manage accounts on behalf of family members
• You must provide accurate, verifiable contact and delivery details
• You are solely responsible for maintaining login credential confidentiality and for all activity under your profile
• Multiple duplicate accounts or fraudulent identity creation is strictly prohibited and subject to immediate termination`,
    },
    {
      title: "3. Customer Terms & Cutoff Policy",
      content: `**Ordering & Subscriptions:**
• Orders and subscriptions are subject to verified cook availability and delivery radiuses in your selected city
• Subscription plans (Daily, Weekly, Monthly) are clearly specified with per-meal costs and included menus
• **The 8:00 PM Cutoff Rule:** Any pause, meal skip, or cancellation for next-day lunch or dinner must be submitted before **8:00 PM IST** on the previous calendar day
• Cancellations submitted after 8:00 PM cannot be refunded as home cooks purchase fresh daily ingredients based on locked preparation rosters
• Full details on pro-rata returns and meal replacements are set forth in our [Refund & Cancellation Policy](/refund)

**Transparent Pricing & No Hidden Fees:**
• All prices shown on HomeFeast are 100% transparent: zero surprise delivery markups or mandatory platform gratuities
• Current payment modes: Cash on Delivery (COD) and UPI on Delivery

**Verified Reviews:**
• Only customers who received and completed a verified delivery may leave a rating and review
• Defamatory, abusive, or fake reviews are moderated and removed immediately`,
    },
    {
      title: "4. Home Cook / Tiffin Provider Terms",
      content: `**Registration & Approval:**
• Cook registration requires valid identity documents and FSSAI license (where applicable)
• All cook accounts are subject to admin approval before activation
• HomeFeast may reject or revoke cook registrations at its discretion

**Obligations:**
• Cooks must provide fresh, hygienic, and accurately described meals
• Cooks must maintain cleanliness standards in their kitchens
• Cooks must fulfill accepted subscription orders on time and as described
• A valid reason must be provided when rejecting subscription requests
• Cooks must update their menu, availability, and service area accurately
• Holiday/leave mode must be activated in advance to prevent undelivered orders

**Earnings:**
• Cook earnings are calculated based on completed orders
• Payout schedules and methods will be communicated upon registration
• HomeFeast may deduct a platform service fee (percentage communicated at registration)`,
    },
    {
      title: "5. Prohibited Conduct",
      content: `You agree NOT to:

• Use the platform for any unlawful purpose
• Impersonate another person or entity
• Submit false information during registration
• Harass, abuse, or threaten other users or cooks
• Attempt to access other users' accounts
• Scrape, crawl, or use bots on the platform
• Upload malicious files, viruses, or harmful code
• Circumvent security measures or rate limiting
• Resell, redistribute, or commercially exploit the platform without permission
• Post spam, advertisements, or irrelevant content in reviews`,
    },
    {
      title: "6. Complaints & Dispute Resolution",
      content: `• Customers can raise complaints through their dashboard
• Complaints are categorized as: Open → In Review → Resolved
• HomeFeast aims to resolve all complaints within 24–48 hours
• In case of disputes between customers and cooks, HomeFeast will act as a mediator
• HomeFeast's decision in dispute resolution is final
• Repeated complaints against a cook may result in suspension or removal from the platform`,
    },
    {
      title: "7. Intellectual Property",
      content: `• The HomeFeast name, logo, design, and all associated content are the intellectual property of HomeFeast
• Cook-uploaded content (photos, menus, descriptions) remains the property of the cook but grants HomeFeast a non-exclusive license to display it on the platform
• You may not copy, reproduce, or distribute any platform content without written permission`,
    },
    {
      title: "8. Limitation of Liability",
      content: `• HomeFeast acts as a platform connecting customers with home cooks
• HomeFeast is NOT responsible for the quality, taste, or hygiene of food prepared by individual cooks
• HomeFeast is NOT liable for any illness, injury, or damages resulting from food consumption
• HomeFeast's total liability shall not exceed the amount paid by you in the last 30 days
• HomeFeast is not responsible for delivery delays caused by weather, traffic, or other unforeseen events
• The platform is provided "as is" without warranties of any kind`,
    },
    {
      title: "9. Privacy",
      content: `Your use of HomeFeast is also governed by our Privacy Policy. Please review it to understand how we collect, use, and protect your personal data.

[Read our Privacy Policy →](/privacy)`,
    },
    {
      title: "10. Termination",
      content: `• You may delete your account at any time through Profile Settings
• HomeFeast may suspend or terminate your account for violations of these terms
• Upon termination, your active subscriptions will be cancelled
• Data deletion follows our Privacy Policy retention schedule (personal data deleted within 30 days)`,
    },
    {
      title: "11. Governing Law",
      content: `These terms are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Rajkot, Gujarat, India.`,
    },
    {
      title: "12. Contact",
      content: `For questions about these Terms of Service, contact us at:

Email: legal@homefeast.in
Phone: +91 98765 43210
Address: Race Course Road, Rajkot, Gujarat 360001, India`,
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
        <div className="container-custom" style={{ maxWidth: 800 }}>
          <div className="section-tag" style={{ display: "inline-flex", marginBottom: "1rem" }}>📜 Legal</div>
          <h1
            style={{
              fontFamily: "Poppins",
              fontWeight: 800,
              fontSize: "2.5rem",
              color: "var(--text)",
              marginBottom: "0.75rem",
            }}
          >
            Terms of Service
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
            Last updated: October 13, 2026 · Effective immediately
          </p>
          <p
            style={{
              color: "var(--text-muted)",
              marginTop: "1rem",
              lineHeight: 1.7,
            }}
          >
            Please read these terms carefully before using HomeFeast. By using our
            platform, you agree to these terms and conditions.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-custom" style={{ maxWidth: 800 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {sections.map((s) => (
              <div key={s.title}>
                <h2
                  style={{
                    fontFamily: "Poppins",
                    fontWeight: 700,
                    fontSize: "1.25rem",
                    color: "var(--text)",
                    marginBottom: "1rem",
                    paddingBottom: "0.75rem",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  {s.title}
                </h2>
                <div
                  style={{
                    color: "var(--text-muted)",
                    lineHeight: 1.85,
                    fontSize: "0.9375rem",
                    whiteSpace: "pre-line",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: s.content
                      .replace(
                        /\*\*(.*?)\*\*/g,
                        '<strong style="color:var(--text)">$1</strong>'
                      )
                      .replace(
                        /\[([^\]]+)\]\(([^)]+)\)/g,
                        '<a href="$2" style="color:var(--primary);font-weight:600">$1</a>'
                      ),
                  }}
                />
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "3rem",
              padding: "1.5rem",
              background: "var(--surface-alt)",
              borderRadius: "var(--radius)",
              textAlign: "center",
            }}
          >
            <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
              Questions about our terms?
            </p>
            <Link href="/contact" className="btn btn-outline" id="terms-contact-btn">
              Contact Legal Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
