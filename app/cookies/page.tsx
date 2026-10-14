import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | HomeFeast",
  description:
    "HomeFeast Cookie Policy — how we use essential cookies and local storage to keep your session secure and save your preferences.",
};

export default function CookiePolicyPage() {
  const sections = [
    {
      title: "1. What Are Cookies?",
      content: `Cookies are small text files placed on your computer or mobile device when you browse websites. They help websites remember your device, keep you signed in, and store user preferences like dark mode and font size.`,
    },
    {
      title: "2. The Cookies & Storage We Use",
      content: `At HomeFeast, we practice **strict data minimization**. We do NOT use invasive advertising trackers or sell your browsing history to third-party ad networks.

We classify our cookies and local storage as follows:

• **Strictly Essential Cookies:**
  - \`hf_session\`: Secure, HttpOnly, SameSite=Strict cookie used to authenticate your session when you log in.
  - \`csrf_token\`: Cryptographic token preventing unauthorized cross-site form submissions.

• **Preference Storage (Local Storage):**
  - \`homefeast-theme\`: Remembers whether you prefer Light or Dark mode.
  - \`homefeast-senior-mode\`: Remembers if you enabled Senior Accessible Large Text mode.
  - \`homefeast-cookie-consent\`: Remembers whether you consented to optional analytics cookies.

• **Optional Analytics (Privacy-First):**
  - We only load privacy-friendly analytics if you provide explicit consent via our Cookie Consent Banner. IP anonymization is permanently enabled.`,
    },
    {
      title: "3. How to Manage or Disable Cookies",
      content: `You can control cookies through:

1. **Our Cookie Banner:** Choose "Essential Only" at any time.
2. **Browser Settings:** All major browsers (Chrome, Safari, Firefox, Edge) allow you to block or delete cookies:
   - Chrome: *Settings ➔ Privacy & Security ➔ Cookies and other site data*
   - Safari: *Preferences ➔ Privacy ➔ Block all cookies*
   - Firefox: *Settings ➔ Privacy & Security ➔ Enhanced Tracking Protection*

*Note: Disabling strictly essential cookies will prevent you from logging into your Customer or Cook Dashboard.*`,
    },
    {
      title: "4. Contact Us",
      content: `For any inquiries regarding our cookie practices, reach out to our privacy officer at **privacy@homefeast.in** or write to us at:
HomeFeast Technologies Private Limited, 302 Silicon Hub, Race Course Road, Rajkot, Gujarat - 360001.`,
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
            🍪 Transparency
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
            Cookie Policy
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
            Last updated: October 14, 2026 · Compliant with DPDP Act 2023 & GDPR
          </p>
          <p style={{ color: "var(--text-muted)", marginTop: "1rem", lineHeight: 1.7 }}>
            Learn how HomeFeast uses cookies and device storage to provide a secure, personalized, and seamless experience.
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
              Want to review your data rights? Read our{" "}
              <Link href="/privacy" style={{ color: "var(--primary)", fontWeight: 600 }}>
                Privacy Policy
              </Link>{" "}
              and{" "}
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
