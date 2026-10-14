import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | HomeFeast",
  description: "HomeFeast privacy policy — how we collect, use, and protect your personal data. DPDP Act 2023 compliant.",
};

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Information We Collect",
      content: `We collect the following types of information when you use HomeFeast:
      
**Personal Information:** Name, email address, phone number, delivery address, city, and pincode when you register.

**Cook-Specific Data:** Kitchen name, FSSAI license number, ID documents, kitchen photos, bank account details for payouts.

**Usage Data:** Pages visited, features used, IP address, browser type, device information, and referral source.

**Order Data:** Subscription history, order history, reviews, ratings, and complaints.

We do NOT collect or store any payment card details. All future payments will be processed through Razorpay/Stripe hosted checkout.`,
    },
    {
      title: "2. How We Use Your Information",
      content: `We use your information to:

• Create and manage your account
• Connect you with nearby home cooks
• Process and manage subscriptions and orders
• Send delivery confirmations and status updates (email/SMS)
• Verify cook registrations and FSSAI compliance
• Improve our platform and user experience
• Send promotional communications (with your consent, opt-out available)
• Comply with legal obligations
• Resolve disputes and complaints`,
    },
    {
      title: "3. Data Protection & Security",
      content: `We take the security of your data seriously:

• **Passwords** are hashed using Argon2id / bcrypt (never stored in plain text)
• **Sensitive fields** (phone number, full address, ID documents) are encrypted using AES-256-GCM at rest
• **Data in transit** is protected with TLS 1.2+ (HTTPS everywhere)
• **Access tokens** use short-lived JWTs (15 min) with rotating refresh tokens in HttpOnly cookies
• **Rate limiting** is enforced on login, registration, and password reset endpoints
• **File uploads** are validated for MIME type and size, renamed, and stored securely on Cloudinary/S3
• **Secrets** are stored in environment variables, never committed to code repositories
• **Database backups** are automated daily with tested restore procedures`,
    },
    {
      title: "4. Data Sharing",
      content: `We do NOT sell your personal data. We share data only in these cases:

• **With home cooks** — your name, delivery address, and order details so they can prepare and deliver your meals
• **With service providers** — email (Nodemailer), image hosting (Cloudinary), error monitoring (Sentry), and analytics tools that help us operate the platform
• **With law enforcement** — if required by law, court order, or government regulation
• **With your consent** — any other sharing requires your explicit permission`,
    },
    {
      title: "4. Data Minimization Principle",
      content: `In compliance with the Digital Personal Data Protection (DPDP) Act, 2023, HomeFeast follows strict data minimization:
• We only request the minimum personal information required to execute your meal subscription (Name, Phone number, Delivery Address).
• We do not collect biometric data, intrusive device sensors, or background location.
• You have the right to provide an alternate delivery landmark and may decline optional marketing communications at any time.`,
    },
    {
      title: "5. Your Rights (DPDP Act 2023 & GDPR)",
      content: `Under India's DPDP Act 2023 and global privacy standards, you have the right to:

• **Access & Review:** Inspect all personal information held about you.
• **Correction & Updating:** Update or correct out-of-date information in your dashboard.
• **Right to Erasure (Data Deletion):** Request permanent deletion of your account and data through the "Delete Account" button in your Customer Dashboard, or by emailing grievance@homefeast.in.
• **Withdraw Consent:** Revoke consent for processing at any time without penalty.
• **Grievance Redressal:** Escalate any unresolved data concerns to our appointed Grievance Officer.`,
    },
    {
      title: "6. Cookies & Tracking",
      content: `We use only essential cookies for authentication and session integrity, plus localized preference storage for theme and accessibility settings. For full details, please review our dedicated [Cookie Policy](/cookies).`,
    },
    {
      title: "7. Data Retention",
      content: `• **Active accounts:** Data is retained as long as your account remains active.
• **Deleted accounts:** Personal data is purged within 30 days of account deletion.
• **Order records:** Retained in encrypted form for 3 years to comply with statutory taxation and commercial laws.
• **Server logs:** Retained for 90 days strictly for cybersecurity and threat mitigation.`,
    },
    {
      title: "8. Protection of Children's Data (18+ Requirement)",
      content: `In compliance with Section 9 of the DPDP Act 2023, HomeFeast does not offer services directly to or knowingly process the personal data of children under 18 years of age without verifiable parental/guardian consent. Any accounts discovered to belong to unverified minors will be permanently deleted along with all collected data.`,
    },
    {
      title: "9. Changes to This Policy",
      content: `We review our privacy practices periodically. Any material modifications will be communicated via your registered email and highlighted through a notice on our homepage.`,
    },
    {
      title: "10. Grievance Officer & Contact Details",
      content: `In accordance with the Information Technology Act 2000 and DPDP Act 2023, the details of our Grievance Redressal Officer are:

**Mr. Rajesh Vora (Grievance Officer)**
HomeFeast Technologies Private Limited
CIN: U72900GJ2026PTC148920
Registered Address: 302, Silicon Hub, Race Course Road, Rajkot, Gujarat - 360001, India
Email: grievance@homefeast.in | privacy@homefeast.in
Phone: +91 98765 43210 (Mon–Fri, 10:00 AM – 6:00 PM IST)`,
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
          <div className="section-tag" style={{ display: "inline-flex", marginBottom: "1rem" }}>🔐 Legal</div>
          <h1
            style={{
              fontFamily: "Poppins",
              fontWeight: 800,
              fontSize: "2.5rem",
              color: "var(--text)",
              marginBottom: "0.75rem",
            }}
          >
            Privacy Policy
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
            At HomeFeast, your privacy is our priority. This policy explains how
            we collect, use, protect, and share your personal data when you use
            our platform — in full compliance with India's Digital Personal Data
            Protection (DPDP) Act, 2023.
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
              Have questions about your privacy?
            </p>
            <Link href="/contact" className="btn btn-outline" id="privacy-contact-btn">
              Contact Our Privacy Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
