"use client";
import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const features = [
    { icon: "🏀", title: "Basketball Drills", desc: "100+ pro-level drills covering handles, shooting, footwork and IQ. New drills added weekly." },
    { icon: "🏋️", title: "Strength Programs", desc: "Periodized gym programs built for athletes. Build explosive power, speed and endurance." },
    { icon: "🥗", title: "Athlete Nutrition", desc: "Pre-game, post-game and daily meal plans designed to fuel performance and recovery." },
    { icon: "📅", title: "Weekly Schedule", desc: "Structured day-by-day training schedule that balances court work, gym and recovery." },
    { icon: "📊", title: "Progress Tracking", desc: "Log your sessions, track XP, monitor your stats and watch yourself improve week over week." },
    { icon: "🎯", title: "Skill Assessment", desc: "Take our assessment quiz and get a personalised training plan built around your weaknesses." },
    { icon: "🏆", title: "Badges & Levels", desc: "Earn badges for hitting milestones. Level up your profile as your real skills improve." },
    { icon: "📸", title: "Drill Camera (Soon)", desc: "Record yourself doing drills and review your form. AI tracking coming soon." },
  ];

  const faqs = [
    { q: "Who is Rize for?", a: "Rize is built for serious athletes aged 16–25 who want to take their basketball and gym training to the next level. Whether you're playing at school, rec league or aspiring to college level — Rize is for you." },
    { q: "Do I need a gym membership?", a: "Not at all. Many of our programs can be done at home or on the court. The gym programs are optional — you can focus purely on basketball if that's your goal." },
    { q: "How is Rize different from YouTube?", a: "YouTube gives you random videos with zero structure. Rize gives you a personalised program, progress tracking, nutrition, scheduling and accountability — all in one place." },
    { q: "Can I cancel anytime?", a: "Yes. No contracts, no commitments. Cancel anytime in two clicks and you won't be charged again." },
    { q: "When is the camera feature coming?", a: "We're actively building it. The drill camera with form tracking will be live within the next few months — included in your subscription at no extra cost." },
  ];

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(10,10,10,0.85)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 32px", height: "64px",
      }}>
        <div style={{ fontSize: "22px", fontWeight: 900, letterSpacing: "-1px" }}>
          RZ<span style={{ color: "var(--accent)" }}>.</span>
        </div>
        <div style={{ display: "flex", gap: "32px", fontSize: "14px", color: "var(--text2)" }}>
          <a href="#features" onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "var(--text2)")}>Features</a>
          <a href="#pricing" onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "var(--text2)")}>Pricing</a>
          <a href="#faq" onMouseEnter={e => (e.currentTarget.style.color = "#fff")} onMouseLeave={e => (e.currentTarget.style.color = "var(--text2)")}>FAQ</a>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <Link href="/login">
            <button style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text2)", padding: "8px 20px", borderRadius: "8px", fontSize: "14px" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#fff"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text2)"; }}>
              Log in
            </button>
          </Link>
          <Link href="/signup">
            <button style={{ background: "var(--accent)", color: "#fff", padding: "8px 20px", borderRadius: "8px", fontSize: "14px", fontWeight: 700 }}>
              Start Free
            </button>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", textAlign: "center",
        padding: "120px 24px 80px", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
          width: "700px", height: "700px",
          background: "radial-gradient(circle, rgba(255,77,0,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "var(--bg3)", border: "1px solid var(--border)",
          borderRadius: "100px", padding: "6px 16px", fontSize: "13px",
          color: "var(--text2)", marginBottom: "32px",
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--green)", display: "inline-block" }} />
          Now in beta — join free today
        </div>

        <h1 style={{
          fontSize: "clamp(52px, 9vw, 104px)", fontWeight: 900,
          lineHeight: 0.95, letterSpacing: "-4px", marginBottom: "28px",
          maxWidth: "900px",
        }}>
          TRAIN SMARTER.{" "}
          <span style={{ background: "linear-gradient(90deg, #0066FF, #0099FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            PERFORM BETTER.
          </span>
        </h1>

        <p style={{ fontSize: "clamp(16px, 2vw, 20px)", color: "var(--text2)", maxWidth: "560px", lineHeight: 1.6, marginBottom: "48px" }}>
          The all-in-one training platform for serious athletes. Basketball drills, gym programs, nutrition and progress tracking — built for the next generation.
        </p>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/signup">
            <button style={{
              background: "var(--accent)", color: "#fff",
              padding: "16px 40px", borderRadius: "12px",
              fontSize: "16px", fontWeight: 800, letterSpacing: "-0.5px",
            }}
              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)")}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)")}>
              Start Training Free →
            </button>
          </Link>
          <a href="#features">
            <button style={{
              background: "var(--bg3)", border: "1px solid var(--border)",
              color: "var(--text)", padding: "16px 40px", borderRadius: "12px",
              fontSize: "16px", fontWeight: 600,
            }}>
              See Features
            </button>
          </a>
        </div>

        <div style={{ display: "flex", gap: "56px", marginTop: "80px", flexWrap: "wrap", justifyContent: "center" }}>
          {[["500+", "Athletes Training"], ["100+", "Drills & Programs"], ["$8.99", "Per Month"]].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-1px" }}>{num}</div>
              <div style={{ fontSize: "13px", color: "var(--text2)", marginTop: "4px" }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: "100px 24px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <p style={{ color: "var(--accent)", fontSize: "13px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px" }}>Everything You Need</p>
          <h2 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 900, letterSpacing: "-2px" }}>One app. Zero excuses.</h2>
          <p style={{ color: "var(--text2)", fontSize: "18px", marginTop: "16px", maxWidth: "500px", margin: "16px auto 0" }}>
            Stop juggling 5 different apps. Rize has everything a serious athlete needs.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
          {features.map((f, i) => (
            <div key={i} style={{
              background: "var(--bg2)", border: "1px solid var(--border)",
              borderRadius: "16px", padding: "28px 24px", transition: "border-color 0.2s, transform 0.2s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}>
              <div style={{ fontSize: "32px", marginBottom: "16px" }}>{f.icon}</div>
              <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>{f.title}</div>
              <div style={{ fontSize: "14px", color: "var(--text2)", lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "100px 24px", background: "var(--bg2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: "var(--accent)", fontSize: "13px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px" }}>How It Works</p>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-2px", marginBottom: "64px" }}>Up and running in 3 minutes</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "32px", textAlign: "left" }}>
            {[
              { n: "01", title: "Create your account", desc: "Sign up free — no credit card needed to get started." },
              { n: "02", title: "Take the assessment", desc: "Tell us your position, goals and biggest weaknesses." },
              { n: "03", title: "Get your plan", desc: "We build you a personalised day-by-day training schedule." },
              { n: "04", title: "Track & improve", desc: "Log sessions, earn XP and watch your stats climb." },
            ].map((s) => (
              <div key={s.n}>
                <div style={{ fontSize: "48px", fontWeight: 900, color: "var(--border)", letterSpacing: "-2px", lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: "18px", fontWeight: 700, margin: "12px 0 8px" }}>{s.title}</div>
                <div style={{ fontSize: "14px", color: "var(--text2)", lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: "100px 24px", maxWidth: "860px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <p style={{ color: "var(--accent)", fontSize: "13px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px" }}>Pricing</p>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-2px" }}>Simple. No BS.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          {/* Free */}
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "20px", padding: "40px 32px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text2)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>Free</div>
            <div style={{ fontSize: "48px", fontWeight: 900, letterSpacing: "-2px", marginBottom: "8px" }}>$0</div>
            <div style={{ color: "var(--text2)", fontSize: "14px", marginBottom: "32px" }}>No card needed</div>
            {["5 drills to try out", "Skill assessment quiz", "Basic dashboard", "Community access"].map(f => (
              <div key={f} style={{ display: "flex", gap: "10px", marginBottom: "12px", fontSize: "15px", alignItems: "center" }}>
                <span style={{ color: "var(--green)" }}>✓</span> {f}
              </div>
            ))}
            <Link href="/signup">
              <button style={{ width: "100%", marginTop: "32px", background: "var(--bg3)", border: "1px solid var(--border)", color: "var(--text)", padding: "14px", borderRadius: "10px", fontSize: "15px", fontWeight: 700 }}>
                Get Started Free
              </button>
            </Link>
          </div>
          {/* Pro */}
          <div style={{ background: "var(--bg2)", border: "2px solid var(--accent)", borderRadius: "20px", padding: "40px 32px", position: "relative" }}>
            <div style={{
              position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)",
              background: "var(--accent)", color: "#fff", fontSize: "12px", fontWeight: 800,
              padding: "4px 16px", borderRadius: "100px", letterSpacing: "1px", textTransform: "uppercase",
            }}>Most Popular</div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--accent)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>Pro</div>
            <div style={{ fontSize: "48px", fontWeight: 900, letterSpacing: "-2px", marginBottom: "4px" }}>
              $8.99<span style={{ fontSize: "18px", fontWeight: 400, color: "var(--text2)" }}>/mo</span>
            </div>
            <div style={{ color: "var(--text2)", fontSize: "14px", marginBottom: "32px" }}>Cancel anytime</div>
            {[
              "Everything in Free",
              "100+ basketball drills",
              "Full gym strength programs",
              "Athlete nutrition plans",
              "Weekly training schedule",
              "Progress tracking & XP",
              "Badges & achievements",
              "Drill camera (coming soon)",
              "New content every week",
            ].map(f => (
              <div key={f} style={{ display: "flex", gap: "10px", marginBottom: "12px", fontSize: "15px", alignItems: "center" }}>
                <span style={{ color: "var(--green)" }}>✓</span> {f}
              </div>
            ))}
            <Link href="/signup">
              <button style={{ width: "100%", marginTop: "32px", background: "var(--accent)", color: "#fff", padding: "14px", borderRadius: "10px", fontSize: "15px", fontWeight: 800 }}>
                Start Free Trial →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "80px 24px", background: "var(--bg2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900, letterSpacing: "-2px", marginBottom: "48px" }}>Athletes are levelling up</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            {[
              { name: "Marcus T.", age: 19, text: "The drill programs are actually structured. Not just random videos — it tells me exactly what to do each day. My handles improved in 3 weeks." },
              { name: "Jordan L.", age: 21, text: "The gym program is built specifically for basketball. I'm jumping higher and moving faster on court. Worth every dollar." },
              { name: "Aiden K.", age: 17, text: "I tried YouTube but there was no structure. Rize gave me an actual plan. I know exactly what to train every day." },
            ].map((t, i) => (
              <div key={i} style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "16px", padding: "28px 24px" }}>
                <div style={{ marginBottom: "12px", fontSize: "14px" }}>⭐⭐⭐⭐⭐</div>
                <p style={{ fontSize: "15px", color: "var(--text2)", lineHeight: 1.7, marginBottom: "20px" }}>"{t.text}"</p>
                <div style={{ fontWeight: 700, fontSize: "14px" }}>{t.name} <span style={{ color: "var(--text3)", fontWeight: 400 }}>· Age {t.age}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: "100px 24px", maxWidth: "700px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900, letterSpacing: "-2px", marginBottom: "48px" }}>FAQ</h2>
        {faqs.map((f, i) => (
          <div key={i} style={{ borderBottom: "1px solid var(--border)", padding: "20px 0" }}>
            <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{
              width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
              background: "none", color: "var(--text)", fontSize: "16px", fontWeight: 600, textAlign: "left",
            }}>
              {f.q}
              <span style={{ color: "var(--accent)", fontSize: "22px", transform: faqOpen === i ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.2s", display: "inline-block" }}>+</span>
            </button>
            {faqOpen === i && (
              <p style={{ color: "var(--text2)", fontSize: "15px", lineHeight: 1.7, marginTop: "14px" }}>{f.a}</p>
            )}
          </div>
        ))}
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: "100px 24px", textAlign: "center", borderTop: "1px solid var(--border)" }}>
        <h2 style={{ fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 900, letterSpacing: "-3px", marginBottom: "24px", lineHeight: 0.95 }}>
          READY TO{" "}
          <span style={{ background: "linear-gradient(90deg, #0066FF, #0099FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>RIZE?</span>
        </h2>
        <p style={{ color: "var(--text2)", fontSize: "18px", maxWidth: "400px", margin: "0 auto 40px" }}>
          Join hundreds of athletes already training smarter. Start free today.
        </p>
        <Link href="/signup">
          <button style={{
            background: "var(--accent)", color: "#fff",
            padding: "18px 48px", borderRadius: "12px",
            fontSize: "18px", fontWeight: 800,
          }}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.transform = "translateY(-3px)")}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)")}>
            Start Training Free →
          </button>
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "32px 24px", textAlign: "center" }}>
        <div style={{ fontSize: "20px", fontWeight: 900, letterSpacing: "-1px", marginBottom: "12px" }}>
          RZ<span style={{ color: "var(--accent)" }}>.</span>
        </div>
        <p style={{ color: "var(--text3)", fontSize: "13px" }}>© 2026 Rize Athletics. All rights reserved.</p>
      </footer>

    </div>
  );
}
