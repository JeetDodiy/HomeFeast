import Link from "next/link";
import { Metadata } from "next";
import { ChefHat, Shield, Heart, TrendingUp, Users, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "About HomeFeast – Our Mission & Story",
  description: "Learn about HomeFeast's mission to connect people with verified home cooks for fresh, healthy, and affordable homemade tiffin subscriptions.",
};

const VALUES = [
  { icon: Heart, title: "Made with Love", desc: "Every meal is prepared by a passionate home cook who treats your food like family food.", color: "var(--danger)" },
  { icon: Shield, title: "Verified & Safe", desc: "All cooks go through FSSAI verification and admin approval before serving on HomeFeast.", color: "var(--secondary)" },
  { icon: TrendingUp, title: "Empowering Cooks", desc: "We help home-based cooks build sustainable income while doing what they love.", color: "var(--info)" },
  { icon: Users, title: "Community First", desc: "From students to elderly citizens – we build healthier communities one meal at a time.", color: "var(--accent)" },
];

const TEAM = [
  { name: "Amit Patel", role: "Founder & CEO", city: "Rajkot", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
  { name: "Priya Shah", role: "Co-Founder & COO", city: "Ahmedabad", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
  { name: "Rahul Mehta", role: "CTO", city: "Rajkot", avatar: "https://randomuser.me/api/portraits/men/45.jpg" },
  { name: "Neha Joshi", role: "Head of Operations", city: "Ahmedabad", avatar: "https://randomuser.me/api/portraits/women/55.jpg" },
];

export default function AboutPage() {
  return (
    <div style={{ background: "var(--bg)" }}>
      {/* Hero */}
      <section style={{ background: "var(--surface)", padding: "5rem 0 4rem", borderBottom: "1px solid var(--border)" }}>
        <div className="container-custom" style={{ textAlign: "center", maxWidth: 700 }}>
          <div className="section-tag" style={{ display: "inline-flex", marginBottom: "1.5rem" }}>🍱 Our Story</div>
          <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "clamp(2.25rem, 5vw, 3.5rem)", color: "var(--text)", marginBottom: "1.25rem" }}>
            Bringing Home Back to the Table
          </h1>
          <p style={{ fontSize: "1.125rem", color: "var(--text-muted)", lineHeight: 1.8 }}>
            HomeFeast was born from a simple observation: millions of students, professionals, and elderly people living away from home
            miss the taste, nutrition, and comfort of a home-cooked meal. We're here to fix that.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="section">
        <div className="container-custom">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
            <div>
              <div className="section-tag">🎯 Our Mission</div>
              <h2 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "2.25rem", color: "var(--text)", marginBottom: "1.25rem", marginTop: "1rem" }}>
                Digitizing Homemade Food for India
              </h2>
              <p style={{ color: "var(--text-muted)", lineHeight: 1.8, marginBottom: "1rem", fontSize: "1.0625rem" }}>
                We connect verified home cooks with people who need healthy, affordable, and hygienic homemade tiffins — eliminating the chaos
                of manual coordination via calls and WhatsApp.
              </p>
              <p style={{ color: "var(--text-muted)", lineHeight: 1.8, fontSize: "1.0625rem" }}>
                For home cooks, we provide a dignified platform to turn their cooking passion into a sustainable livelihood.
                For customers, we provide the comfort of home food at their doorstep.
              </p>
              <div style={{ display: "flex", gap: "1.5rem", marginTop: "2rem" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "2rem", color: "var(--primary)" }}>2022</div>
                  <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>Founded</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "2rem", color: "var(--primary)" }}>2</div>
                  <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>Cities</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "2rem", color: "var(--primary)" }}>350+</div>
                  <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>Cook Partners</div>
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
                "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
                "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80",
                "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80"].map((src, i) => (
                <div key={i} style={{ borderRadius: "var(--radius)", overflow: "hidden", height: 180, boxShadow: "var(--shadow)" }}>
                  <img src={src} alt={`HomeFeast kitchen ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ background: "var(--surface-alt)" }}>
        <div className="container-custom">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="section-tag" style={{ display: "inline-flex" }}>💡 Our Values</div>
            <h2 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "2.25rem", color: "var(--text)" }}>What Drives Us</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.5rem" }}>
            {VALUES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="card" style={{ padding: "2rem", textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
                  <Icon size={28} style={{ color }} />
                </div>
                <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1.125rem", color: "var(--text)", marginBottom: "0.75rem" }}>{title}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem", lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="container-custom">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div className="section-tag" style={{ display: "inline-flex" }}>👥 Our Team</div>
            <h2 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "2.25rem", color: "var(--text)" }}>The People Behind HomeFeast</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.5rem", maxWidth: 900, margin: "0 auto" }}>
            {TEAM.map((member) => (
              <div key={member.name} className="card" style={{ padding: "2rem", textAlign: "center" }}>
                <img src={member.avatar} alt={member.name} style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "3px solid var(--primary)", margin: "0 auto 1rem", display: "block" }} />
                <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "1rem", color: "var(--text)", marginBottom: "0.25rem" }}>{member.name}</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--primary)", fontWeight: 600, marginBottom: "0.25rem" }}>{member.role}</p>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{member.city}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background: "var(--surface-alt)", textAlign: "center" }}>
        <div className="container-custom">
          <h2 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: "2rem", color: "var(--text)", marginBottom: "1rem" }}>
            Join the HomeFeast Family
          </h2>
          <p style={{ color: "var(--text-muted)", maxWidth: 480, margin: "0 auto 2rem", fontSize: "1.0625rem" }}>
            Whether you're hungry for home food or passionate about cooking – there's a place for you here.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/search" className="btn btn-primary" id="about-find-food-btn">🍽️ Find Food Now</Link>
            <Link href="/cook/register" className="btn btn-outline" id="about-cook-btn">👨‍🍳 Become a Cook</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
