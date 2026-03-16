"use client";
import { useState } from "react";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";

function SubscribeButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubscribe() {
    setLoading(true);
    setError("");
    try {
      const { data: { user } } = await getSupabase().auth.getUser();
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, email: user?.email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("Connection error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={handleSubscribe} disabled={loading} style={{
        background: "var(--accent)", color: "#fff",
        padding: "16px 48px", borderRadius: "12px",
        fontSize: "18px", fontWeight: 800,
        width: "100%", opacity: loading ? 0.7 : 1,
        transition: "transform 0.2s",
      }}
        onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}>
        {loading ? "Redirecting to checkout..." : "Start Pro — $8.99/month →"}
      </button>
      {error && <p style={{ color: "#ff4d4d", fontSize: "14px", marginTop: "8px", textAlign: "center" }}>{error}</p>}
      <p style={{ color: "var(--text2)", fontSize: "13px", textAlign: "center", marginTop: "8px" }}>Cancel anytime. No long-term commitment.</p>
    </div>
  );
}

export default function SubscribePage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const benefits = [
    { icon: "🏀", title: "100+ Basketball Drills", desc: "Full library across every skill area — handles, shooting, defense, IQ and more." },
    { icon: "🏋️", title: "Gym Strength Programs", desc: "Periodized programs to build explosive power, speed and athletic durability." },
    { icon: "🥗", title: "Athlete Nutrition Plans", desc: "Pre-game, post-game and daily meals designed to fuel peak performance." },
    { icon: "📅", title: "Weekly Training Schedule", desc: "Structured week-by-week plans balancing court work, gym and recovery." },
    { icon: "📊", title: "Progress Tracking", desc: "Log sessions, earn XP, level up and watch your athlete stats improve." },
    { icon: "🎯", title: "Skill Assessment", desc: "Personalised training plan built around your specific position and weaknesses." },
    { icon: "🏆", title: "Badges & Achievements", desc: "22 badges across 5 rarities. Earn them as your real-world skills improve." },
    { icon: "📸", title: "Drill Camera (Coming Soon)", desc: "Film your drills and review your form. AI ball tracking coming soon." },
    { icon: "🔄", title: "New Content Weekly", desc: "New drills, programs and meal plans added every week." },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <nav style={{ background: "var(--bg2)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", height: "64px" }}>
        <Link href="/dashboard" style={{ fontSize: "20px", fontWeight: 900, letterSpacing: "-1px" }}>RZ<span style={{ color: "var(--accent)" }}>.</span></Link>
        <Link href="/dashboard"><button style={{ background: "none", border: "1px solid var(--border)", color: "var(--text2)", padding: "6px 16px", borderRadius: "8px", fontSize: "13px" }}>← Dashboard</button></Link>
      </nav>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "60px 24px" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div style={{ display: "inline-block", background: "linear-gradient(135deg, rgba(255,77,0,0.15), rgba(255,140,0,0.15))", border: "1px solid rgba(255,77,0,0.3)", borderRadius: "100px", padding: "8px 20px", fontSize: "14px", fontWeight: 700, color: "var(--accent)", marginBottom: "24px" }}>
            ⚡ Rize Pro
          </div>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, letterSpacing: "-3px", lineHeight: 0.95, marginBottom: "20px" }}>
            Unlock your full{" "}
            <span style={{ background: "linear-gradient(90deg, #0EA5E9, #38BDF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>potential</span>
          </h1>
          <p style={{ color: "var(--text2)", fontSize: "18px", maxWidth: "480px", margin: "0 auto 40px", lineHeight: 1.6 }}>
            Everything you need to train like a pro athlete — all for less than a coffee a week.
          </p>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "8px", marginBottom: "32px" }}>
            <span style={{ fontSize: "64px", fontWeight: 900, letterSpacing: "-3px" }}>$8.99</span>
            <span style={{ color: "var(--text2)", fontSize: "18px" }}>/ month</span>
          </div>
          <SubscribeButton />
        </div>

        {/* Benefits */}
        <h2 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "24px", letterSpacing: "-0.5px" }}>Everything included:</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "64px" }}>
          {benefits.map((b, i) => (
            <div key={i} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px 20px" }}>
              <div style={{ fontSize: "28px", marginBottom: "10px" }}>{b.icon}</div>
              <div style={{ fontWeight: 700, marginBottom: "6px", fontSize: "15px" }}>{b.title}</div>
              <div style={{ color: "var(--text2)", fontSize: "13px", lineHeight: 1.5 }}>{b.desc}</div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <h2 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "24px", letterSpacing: "-0.5px" }}>Common questions</h2>
        {[
          { q: "Can I cancel anytime?", a: "Yes, absolutely. Cancel anytime from your account settings. You won't be charged again after cancelling." },
          { q: "Is there a free trial?", a: "Yes — you can try 5 drills and the skill assessment for free before upgrading to Pro." },
          { q: "What payment methods are accepted?", a: "All major credit and debit cards via Stripe — the most trusted payment platform online." },
          { q: "What age is this for?", a: "Rize is designed for athletes aged 16–25, but anyone serious about their game can benefit." },
        ].map((f, i) => (
          <div key={i} style={{ borderBottom: "1px solid var(--border)", padding: "18px 0" }}>
            <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{
              width: "100%", display: "flex", justifyContent: "space-between",
              background: "none", color: "var(--text)", fontSize: "15px", fontWeight: 600, textAlign: "left",
            }}>
              {f.q}
              <span style={{ color: "var(--accent)", fontSize: "20px", transform: faqOpen === i ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.2s", display: "inline-block" }}>+</span>
            </button>
            {faqOpen === i && <p style={{ color: "var(--text2)", fontSize: "14px", lineHeight: 1.7, marginTop: "12px" }}>{f.a}</p>}
          </div>
        ))}

        {/* Bottom CTA */}
        <div style={{ marginTop: "64px", textAlign: "center" }}>
          <SubscribeButton />
        </div>
      </div>
    </div>
  );
}
