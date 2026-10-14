import Link from "next/link";
import type { Metadata } from "next";
import { ShieldCheck, CheckCircle, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "FSSAI Compliance & Hygiene Standards | HomeFeast",
  description:
    "HomeFeast food safety and FSSAI standards. Learn how we verify home kitchens, inspect hygiene protocols, and ensure safe tiffin meals.",
};

export default function FssaiCompliancePage() {
  const standards = [
    {
      title: "Mandatory FSSAI Registration",
      desc: "Every home cook listed on HomeFeast must hold a verified 14-digit FSSAI registration certificate before their profile is approved by our admin team.",
    },
    {
      title: "Clean Drinking & Cooking Water",
      desc: "Cooks must prepare all rotis, gravies, and beverages using certified RO-filtered or boiled potable water.",
    },
    {
      title: "Daily Fresh Ingredients",
      desc: "Zero frozen preservatives or leftover reuse. Vegetables and staples are procured fresh on a daily rotational basis.",
    },
    {
      title: "Food-Grade Eco Packaging",
      desc: "Meals are packed in virgin 100% food-grade leakproof containers or traditional stainless steel tiffins to avoid plastic contamination.",
    },
    {
      title: "Hygiene Audits & Random Checks",
      desc: "Our city operations teams conduct periodic kitchen verification visits and inspect hairnet, apron, and pest control compliance.",
    },
    {
      title: "Subscriber Rating & Immediate Flagging",
      desc: "Any hygiene rating below 4.0 triggers an automatic administrative review and temporary suspension pending re-inspection.",
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
            <ShieldCheck size={16} /> FSSAI Verified
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
            FSSAI Food Safety & Hygiene Standards
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
            Cleanliness, hygiene, and authentic home taste are non-negotiable at HomeFeast.
          </p>
        </div>
      </section>

      <section style={{ padding: "3rem 0 5rem" }}>
        <div className="container-custom" style={{ maxWidth: 840 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.5rem",
              marginBottom: "3rem",
            }}
          >
            {standards.map((item) => (
              <div
                key={item.title}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: "1.75rem",
                  boxShadow: "var(--shadow)",
                }}
              >
                <div style={{ color: "var(--secondary)", marginBottom: "0.75rem" }}>
                  <CheckCircle size={28} />
                </div>
                <h3
                  style={{
                    fontFamily: "Poppins",
                    fontWeight: 700,
                    fontSize: "1.125rem",
                    color: "var(--text)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: "2rem",
              textAlign: "center",
            }}
          >
            <Award size={36} style={{ color: "var(--primary)", margin: "0 auto 1rem" }} />
            <h2 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.375rem", marginBottom: "0.5rem" }}>
              Are You a Home Cook?
            </h2>
            <p style={{ color: "var(--text-muted)", maxWidth: 600, margin: "0 auto 1.5rem", fontSize: "0.9375rem" }}>
              We assist passionate home chefs with free FSSAI registration guidance so you can start delivering fresh tiffins to hundreds of happy subscribers in Rajkot and Ahmedabad.
            </p>
            <Link href="/cook/register" className="btn btn-primary">
              Register as a Home Cook ➔
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
