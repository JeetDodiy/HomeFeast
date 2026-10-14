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
      title: "5. Your Rights (DPDP Act 2023)",
      content: `Under India's Digital Personal Data Protection Act, 2023, you have the right to:

• **Access** your personal data stored on HomeFeast
• **Correct** inaccurate or incomplete personal data
• **Delete** your account and all associated personal data
• **Withdraw consent** for data processing at any time
• **Data portability** — request a copy of your data in a machine-readable format
• **Grievance redressal** — raise a complaint with our Data Protection Officer

To exercise any of these rights, email us at **privacy@homefeast.in** or use the "Delete Account" option in your Profile Settings.`,
    },
    {
      title: "6. Cookies",
      content: `We use essential cookies for:

• **Authentication** — maintaining your logged-in session (HttpOnly, Secure, SameSite=Strict)
• **Theme preference** — remembering your light/dark mode choice (localStorage)
• **CSRF protection** — preventing cross-site request forgery attacks

We do NOT use third-party tracking cookies or advertising cookies.`,
    },
    {
      title: "7. Data Retention",
      content: `• **Active accounts** — data is retained as long as your account is active
• **Deleted accounts** — personal data is deleted within 30 days of account deletion
• **Order and subscription history** — retained for 3 years for legal and audit purposes
• **Cook verification documents** — retained as long as the cook partnership is active, deleted 90 days after termination
• **Server logs** — retained for 90 days for security and debugging`,
    },
    {
      title: "8. Children's Privacy",
      content: `HomeFeast is not intended for use by children under the age of 16. We do not knowingly collect personal data from children. If we learn that a child under 16 has provided us with personal information, we will delete it immediately.`,
    },
    {
      title: "9. Changes to This Policy",
      content: `We may update this privacy policy from time to time. When we do, we will:

• Update the "Last Updated" date at the top
• Notify registered users via email for significant changes
• Post a notice on our website

Continued use of HomeFeast after changes constitutes acceptance of the updated policy.`,
    },
    {
      title: "10. Contact Us",
      content: `If you have any questions about this privacy policy, contact us at:

**Data Protection Officer**
Email: privacy@homefeast.in
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
