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
        {loading ? "Redirecting to checkout..." : "Start Pro — $7.99/month →"}
      </button>
      {error && <p style={{ color: "#ff4d4d", fontSize: "14px", marginTop: "8px", textAlign: "center" }}>{error}</p>}
      <p style={{ color: "var(--text2)", fontSize: "13px", textAlign: "center", marginTop: "8px" }}>Cancel anytime. No long-term commitment.</p>
    </div>
  );
}

export default function SubscribePage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const benefits = [
    { tag: "BASKETBALL", title: "100+ Basketball Drills", desc: "Full library across every skill area — ball handling, shooting, finishing, defense and basketball IQ." },
    { tag: "STRENGTH", title: "Gym Strength Programs", desc: "Periodized programs built for athletes. Explosive power, lower body strength, speed and agility." },
    { tag: "NUTRITION", title: "Athlete Nutrition Plans", desc: "Pre-game, post-game and daily meals designed to fuel peak performance and recovery." },
    { tag: "SCHEDULE", title: "Weekly Training Plan", desc: "Structured week-by-week plans balancing court work, gym sessions and recovery." },
    { tag: "TRACKING", title: "Progress & XP Tracking", desc: "Log every session, earn XP, level up and track your improvement over time." },
    { tag: "BADGES", title: "Achievements System", desc: "22 badges across 5 rarities. Earn them as your real-world skills develop." },
    { tag: "CAMERA", title: "Live Drill Camera with Ball Tracking", desc: "Start any drill and the camera activates automatically. Tracks your basketball in real time using colour detection, counts your dribbles and overlays your body position." },
    { tag: "WEEKLY", title: "New Content Added Weekly", desc: "New drills, programs and meal plans added every week to keep training fresh." },
    { tag: "YOUTUBE", title: "Video Tutorials on Every Drill", desc: "Every drill and exercise links directly to a YouTube tutorial so you know exactly what to do." },
    { tag: "ASSESSMENT", title: "Skill Assessment & Personalisation", desc: "Take the assessment quiz and get a training program tailored to your position, level and goals." },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <nav style={{ background: "var(--bg2)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", height: "64px" }}>
        <Link href="/dashboard" style={{ fontSize: "20px", fontWeight: 900, letterSpacing: "-1px" }}>RZ<span style={{ color: "var(--accent)" }}>.</span></Link>
        <Link href="/dashboard"><button style={{ background: "none", border: "1px solid var(--border)", color: "var(--text2)", padding: "6px 16px", borderRadius: "8px", fontSize: "13px" }}>← Dashboard</button></Link>
      </nav>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "60px 24px" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, letterSpacing: "-3px", lineHeight: 0.95, marginBottom: "20px" }}>
            Unlock your full{" "}
            <span style={{ background: "linear-gradient(90deg, #0EA5E9, #38BDF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>potential</span>
          </h1>
          <p style={{ color: "var(--text2)", fontSize: "18px", maxWidth: "480px", margin: "0 auto 40px", lineHeight: 1.6 }}>
            Everything you need to train like a pro athlete — all for less than a coffee a week.
          </p>
        </div>

        {/* Pricing card */}
        <div style={{ background: "var(--bg2)", border: "1px solid rgba(14,165,233,0.4)", borderRadius: "20px", padding: "40px", maxWidth: "480px", margin: "0 auto 64px", boxShadow: "0 0 60px rgba(14,165,233,0.15)", position: "relative" }}>
          <div style={{ position: "absolute", top: "-13px", left: "50%", transform: "translateX(-50%)", background: "var(--accent)", color: "#fff", fontSize: "11px", fontWeight: 800, letterSpacing: "2px", padding: "4px 16px", borderRadius: "6px" }}>
            MOST POPULAR
          </div>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ fontSize: "13px", color: "var(--accent)", fontWeight: 700, letterSpacing: "1px", marginBottom: "8px" }}>RIZE PRO</div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "8px", marginBottom: "8px" }}>
              <span style={{ fontSize: "64px", fontWeight: 900, letterSpacing: "-3px" }}>$7.99</span>
              <span style={{ color: "var(--text2)", fontSize: "18px" }}>/ month</span>
            </div>
            <div style={{ fontSize: "13px", color: "var(--text3)" }}>Cancel anytime. No contracts.</div>
          </div>
          <SubscribeButton />
        </div>

        {/* Free vs Pro comparison */}
        <div style={{ marginBottom: "64px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "24px", letterSpacing: "-0.5px", textAlign: "center" }}>Free vs Pro</h2>
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: "var(--bg3)", padding: "12px 20px", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "var(--text2)" }}>
              <div>Feature</div>
              <div style={{ textAlign: "center" }}>Free</div>
              <div style={{ textAlign: "center", color: "var(--accent)" }}>Pro</div>
            </div>
            {[
              ["Basketball Drills", "5 drills", "20+ drills"],
              ["Strength Programs", "—", "Full access"],
              ["Nutrition Plans", "—", "Full access"],
              ["Weekly Schedule", "—", "Full access"],
              ["Camera Drill Tracking", "—", "Included"],
              ["XP & Badges", "Basic", "Full system"],
              ["Skill Assessment", "Included", "Included"],
              ["Video Tutorials", "Included", "Included"],
            ].map(([feature, free, pro], i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "14px 20px", borderTop: "1px solid var(--border)", fontSize: "14px" }}>
                <div style={{ fontWeight: 600 }}>{feature}</div>
                <div style={{ textAlign: "center", color: free === "—" ? "var(--text3)" : "var(--text2)" }}>{free}</div>
                <div style={{ textAlign: "center", color: "#10B981", fontWeight: 700 }}>{pro}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "4px", letterSpacing: "-0.5px" }}>Everything included</h2>
        <p style={{ color: "var(--text2)", fontSize: "14px", marginBottom: "32px" }}>One subscription. Every tool you need to level up.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1px", background: "var(--border)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", marginBottom: "64px" }}>
          {benefits.map((b, i) => (
            <div key={i} style={{ background: "var(--bg2)", padding: "20px 24px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <div style={{ width: "3px", height: "100%", minHeight: "40px", background: "var(--accent)", borderRadius: "2px", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", color: "var(--accent)", marginBottom: "4px" }}>{b.tag}</div>
                <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "4px" }}>{b.title}</div>
                <div style={{ color: "var(--text2)", fontSize: "13px", lineHeight: 1.5 }}>{b.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <h2 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "24px", letterSpacing: "-0.5px" }}>Common questions</h2>
        {[
          { q: "Can I cancel anytime?", a: "Yes, absolutely. Cancel anytime from your account settings. You won't be charged again after cancelling." },
          { q: "Is there a free trial?", a: "Yes — you can try 5 drills and the skill assessment for free before upgrading to Pro." },
          { q: "What payment methods are accepted?", a: "All major credit and debit cards via Stripe — the most trusted payment platform online." },
          { q: "What age is this for?", a: "Rize is for any athlete who wants to get better — middle school, high school, college or beyond. If you're serious about your game, this is for you." },
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
