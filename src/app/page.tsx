"use client";
import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const faqs = [
    { q: "Who is Rize for?", a: "Rize is built for any athlete who wants to level up their basketball and gym training. Whether you're in middle school, high school or playing at a higher level — if you're serious about improving, Rize is for you." },
    { q: "Do I need a gym membership?", a: "No. Many programs can be done at home or on the court. The gym programs are optional — you can focus purely on basketball if that's your goal." },
    { q: "How is Rize different from YouTube?", a: "YouTube gives you random videos with no structure or accountability. Rize gives you a personalised program, progress tracking, nutrition plans and scheduling — all in one place." },
    { q: "Can I cancel anytime?", a: "Yes. No contracts, no commitments. Cancel anytime and you won't be charged again." },
    { q: "What is the drill camera?", a: "Every drill has a Start Drill button that opens your camera and tracks your basketball in real time. It detects the ball using colour recognition, counts your dribbles and overlays your body position — all included in Pro." },
  ];

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>

      {/* NAV */}
      <nav className="landing-nav" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(10,10,10,0.9)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 48px", height: "60px",
      }}>
        <div style={{ fontSize: "18px", fontWeight: 900, letterSpacing: "-0.5px" }}>
          RZ<span style={{ color: "var(--accent)" }}>.</span>
        </div>
        <div className="landing-nav-links" style={{ display: "flex", gap: "32px", fontSize: "13px", color: "var(--text2)" }}>
          {["#features", "#how-it-works", "#pricing", "#faq"].map((href, i) => (
            <a key={i} href={href}
              style={{ transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text2)")}>
              {["Features", "How it works", "Pricing", "FAQ"][i]}
            </a>
          ))}
        </div>
        <div className="landing-nav-actions" style={{ display: "flex", gap: "10px" }}>
          <Link href="/login">
            <button style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text2)", padding: "7px 18px", borderRadius: "6px", fontSize: "13px", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#555"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text2)"; }}>
              Log in
            </button>
          </Link>
          <Link href="/signup">
            <button style={{ background: "var(--accent)", color: "#fff", padding: "7px 18px", borderRadius: "6px", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-section" style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", textAlign: "center",
        padding: "140px 24px 100px", position: "relative", overflow: "hidden",
        backgroundImage: "url('https://images.unsplash.com/photo-1546519638405-a1bcbd3a5f8b?w=1600&h=900&fit=crop&q=80')",
        backgroundSize: "cover", backgroundPosition: "center",
      }}>
        {/* Dark overlay — Nike style, moody */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: "linear-gradient(to bottom, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.25) 40%, rgba(10,10,10,0.8) 100%)",
          pointerEvents: "none",
        }} />
        {/* Subtle blue glow */}
        <div style={{
          position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)",
          width: "900px", height: "600px",
          background: "radial-gradient(ellipse, rgba(14,165,233,0.06) 0%, transparent 70%)",
          pointerEvents: "none", zIndex: 1,
        }} />

        {/* Hero content — z-index above overlays */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <h1 style={{
            fontSize: "clamp(48px, 8vw, 96px)", fontWeight: 900,
            lineHeight: 0.92, letterSpacing: "-4px", marginBottom: "32px",
            maxWidth: "860px",
          }}>
            THE TRAINING APP<br />
            <span style={{ background: "linear-gradient(90deg, #0EA5E9, #38BDF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              BUILT FOR ATHLETES
            </span>
          </h1>

          <p style={{ fontSize: "clamp(15px, 1.8vw, 18px)", color: "var(--text2)", maxWidth: "500px", lineHeight: 1.7, marginBottom: "48px", margin: "0 auto 48px" }}>
            Basketball drills, gym programs, nutrition and progress tracking — structured, personalised and built for people who take their game seriously.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/signup">
              <button style={{
                background: "var(--accent)", color: "#fff",
                padding: "14px 36px", borderRadius: "6px",
                fontSize: "15px", fontWeight: 700,
                cursor: "pointer", transition: "opacity 0.2s",
              }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}>
                Start Free →
              </button>
            </Link>
            <a href="#features">
              <button style={{
                background: "transparent", border: "1px solid var(--border)",
                color: "var(--text2)", padding: "14px 36px", borderRadius: "6px",
                fontSize: "15px", fontWeight: 600, cursor: "pointer",
              }}>
                See What&apos;s Inside
              </button>
            </a>
          </div>

          {/* Stats bar */}
          <div className="stats-bar" style={{
            display: "flex", gap: "64px", marginTop: "96px", flexWrap: "wrap",
            justifyContent: "center", borderTop: "1px solid var(--border)", paddingTop: "56px",
          }}>
            {[["500+", "Athletes"], ["100+", "Drills & Programs"], ["$7.99", "Per Month"], ["20+", "Meal Plans"]].map(([num, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{
                  fontSize: "30px", fontWeight: 900, letterSpacing: "-1px",
                  color: "#38BDF8",
                  textShadow: "0 0 24px rgba(14,165,233,0.55), 0 0 8px rgba(14,165,233,0.3)",
                }}>{num}</div>
                <div style={{ fontSize: "11px", color: "var(--text2)", marginTop: "6px", textTransform: "uppercase", letterSpacing: "1.5px" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="features-section" style={{ padding: "140px 48px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ marginBottom: "96px" }}>
          <p style={{ color: "var(--accent)", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px" }}>Platform</p>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-2px", maxWidth: "500px" }}>Everything a serious athlete needs</h2>
        </div>

        {/* Feature rows */}
        {[
          {
            label: "BASKETBALL",
            title: "100+ structured drills",
            desc: "Ball handling, shooting, finishing, defense and IQ — every drill has coaching cues, difficulty rating and a YouTube tutorial. New drills added every week.",
            points: ["Beginner to advanced levels", "Categorised by skill area", "YouTube tutorials on every drill", "Track completions and earn XP"],
            stat: "100+", statLabel: "Drills",
          },
          {
            label: "STRENGTH",
            title: "Athlete-specific gym programs",
            desc: "Periodised lifting programs built for basketball athletes. Explosive power, vertical jump, sprint speed and injury prevention — not generic bodybuilder workouts.",
            points: ["5 training categories", "30+ exercises with coaching cues", "Sets, reps and rest periods included", "YouTube form guides on every exercise"],
            stat: "30+", statLabel: "Exercises",
          },
          {
            label: "NUTRITION",
            title: "Fuel and recovery plans",
            desc: "Pre-game, post-game, daily meals and snacks with exact macros, ingredient lists and explanations of why each meal helps your performance.",
            points: ["50+ meals with full macros", "Pre-game and post-game specific", "Hydration guides included", "Designed for athletic performance"],
            stat: "50+", statLabel: "Meals",
          },
          {
            label: "TRACKING",
            title: "Progress that actually means something",
            desc: "XP system, skill assessment, stats card, weekly schedule and 22 collectible badges. See yourself improve week over week.",
            points: ["Skill assessment quiz", "XP and level system", "Day streak tracking", "22 achievement badges"],
            stat: "22", statLabel: "Badges",
          },
        ].map((f, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px",
            alignItems: "center", marginBottom: "120px",
            direction: i % 2 === 1 ? "rtl" : "ltr",
          }} className="feature-row">
            <div style={{ direction: "ltr" }}>
              <p style={{ color: "var(--accent)", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px" }}>{f.label}</p>
              <h3 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 900, letterSpacing: "-1px", marginBottom: "16px" }}>{f.title}</h3>
              <p style={{ color: "var(--text2)", fontSize: "15px", lineHeight: 1.8, marginBottom: "28px" }}>{f.desc}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {f.points.map((p, pi) => (
                  <div key={pi} style={{ display: "flex", gap: "10px", alignItems: "center", fontSize: "14px", color: "var(--text2)" }}>
                    <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />
                    {p}
                  </div>
                ))}
              </div>
            </div>
            {/* Visual stat box — thin accent top border + inner glow */}
            <div style={{
              direction: "ltr",
              background: "var(--bg2)",
              border: "1px solid var(--border)",
              borderTop: "2px solid var(--accent)",
              borderRadius: "12px",
              padding: "48px 40px",
              minHeight: "220px",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "inset 0 0 40px rgba(14,165,233,0.05), 0 0 0 1px rgba(14,165,233,0.04)",
            }} className="stat-box">
              <div style={{ textAlign: "center" }}>
                <div style={{
                  fontSize: "56px", fontWeight: 900, letterSpacing: "-3px", marginBottom: "10px",
                  color: "#38BDF8",
                  textShadow: "0 0 32px rgba(14,165,233,0.5), 0 0 10px rgba(14,165,233,0.25)",
                }}>
                  {f.stat}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text2)", textTransform: "uppercase", letterSpacing: "2px" }}>
                  {f.statLabel}
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="how-it-works-section" style={{ padding: "120px 48px", background: "var(--bg2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <p style={{ color: "var(--accent)", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px" }}>Process</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900, letterSpacing: "-2px", marginBottom: "72px", maxWidth: "400px" }}>Up and running in minutes</h2>
          <div className="how-works-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "48px" }}>
            {[
              { n: "01", title: "Sign up free", desc: "Create an account — no credit card required." },
              { n: "02", title: "Take the assessment", desc: "Tell us your position, goals and weaknesses." },
              { n: "03", title: "Get your program", desc: "Personalised day-by-day training plan built for you." },
              { n: "04", title: "Train and track", desc: "Log sessions, earn XP and measure real progress." },
            ].map((s) => (
              <div key={s.n}>
                <div style={{ fontSize: "11px", color: "var(--text3)", fontWeight: 700, letterSpacing: "1px", marginBottom: "16px" }}>{s.n}</div>
                <div style={{ width: "1px", height: "32px", background: "var(--border)", marginBottom: "16px" }} />
                <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "10px" }}>{s.title}</div>
                <div style={{ fontSize: "13px", color: "var(--text2)", lineHeight: 1.7 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="pricing-section" style={{ padding: "140px 48px", maxWidth: "860px", margin: "0 auto" }}>
        <div style={{ marginBottom: "72px" }}>
          <p style={{ color: "var(--accent)", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px" }}>Pricing</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900, letterSpacing: "-2px" }}>No hidden fees. No BS.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          {/* Free */}
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "12px", padding: "36px 32px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text2)", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "12px" }}>Free</div>
            <div style={{ fontSize: "42px", fontWeight: 900, letterSpacing: "-2px", marginBottom: "6px" }}>$0</div>
            <div style={{ color: "var(--text2)", fontSize: "13px", marginBottom: "32px", paddingBottom: "32px", borderBottom: "1px solid var(--border)" }}>No card required</div>
            {["5 drills to try", "Skill assessment", "Basic dashboard"].map(f => (
              <div key={f} style={{ display: "flex", gap: "10px", marginBottom: "12px", fontSize: "14px", alignItems: "center" }}>
                <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--text3)", flexShrink: 0 }} />
                <span style={{ color: "var(--text2)" }}>{f}</span>
              </div>
            ))}
            <Link href="/signup">
              <button style={{ width: "100%", marginTop: "28px", background: "transparent", border: "1px solid var(--border)", color: "var(--text)", padding: "12px", borderRadius: "6px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
                Get Started
              </button>
            </Link>
          </div>
          {/* Pro */}
          <div style={{ background: "var(--bg2)", border: "1px solid var(--accent)", borderRadius: "12px", padding: "36px 32px", position: "relative" }}>
            <div style={{
              position: "absolute", top: "-1px", right: "20px",
              background: "var(--accent)", color: "#fff", fontSize: "10px", fontWeight: 800,
              padding: "4px 12px", borderRadius: "0 0 6px 6px", letterSpacing: "1px", textTransform: "uppercase",
            }}>PRO</div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent)", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "12px" }}>Pro</div>
            <div style={{ fontSize: "42px", fontWeight: 900, letterSpacing: "-2px", marginBottom: "4px" }}>
              $7.99<span style={{ fontSize: "16px", fontWeight: 400, color: "var(--text2)" }}>/mo</span>
            </div>
            <div style={{ color: "var(--text2)", fontSize: "13px", marginBottom: "32px", paddingBottom: "32px", borderBottom: "1px solid var(--border)" }}>Cancel anytime</div>
            {[
              "100+ basketball drills",
              "Full strength programs",
              "50+ athlete meal plans",
              "Weekly training schedule",
              "XP and progress tracking",
              "22 achievement badges",
              "YouTube tutorials on every drill",
              "Live camera with ball tracking",
            ].map(f => (
              <div key={f} style={{ display: "flex", gap: "10px", marginBottom: "11px", fontSize: "14px", alignItems: "center" }}>
                <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />
                {f}
              </div>
            ))}
            <Link href="/signup">
              <button style={{ width: "100%", marginTop: "28px", background: "var(--accent)", color: "#fff", padding: "12px", borderRadius: "6px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
                Start Free →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-section" style={{ padding: "120px 48px", background: "var(--bg2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <p style={{ color: "var(--accent)", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px" }}>Reviews</p>
          <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 900, letterSpacing: "-1px", marginBottom: "56px" }}>What athletes say</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            {[
              { name: "Marcus T.", age: 19, text: "The drill programs are actually structured. Not random videos — it tells me exactly what to do each day. My handles improved noticeably in 3 weeks." },
              { name: "Jordan L.", age: 21, text: "The gym program is built for basketball, not just for looks. I'm jumping higher and moving faster. Worth every dollar." },
              { name: "Aiden K.", age: 17, text: "YouTube has no structure. Rize gave me an actual plan. I know exactly what to train every single day." },
            ].map((t, i) => (
              <div key={i} style={{
                background: "var(--bg3)", border: "1px solid var(--border)",
                borderRadius: "12px", padding: "28px 24px",
              }}>
                {/* Star ratings */}
                <div style={{ display: "flex", gap: "4px", marginBottom: "16px" }}>
                  {[1,2,3,4,5].map(s => (
                    <span key={s} style={{ color: "#FBBF24", fontSize: "14px" }}>&#9733;</span>
                  ))}
                </div>
                <p style={{ fontSize: "14px", color: "var(--text2)", lineHeight: 1.8, marginBottom: "20px" }}>&ldquo;{t.text}&rdquo;</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, fontSize: "13px" }}>{t.name}</span>
                  <span style={{ color: "var(--text3)", fontSize: "12px" }}>Age {t.age}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="faq-section" style={{ padding: "120px 48px", maxWidth: "680px", margin: "0 auto" }}>
        <p style={{ color: "var(--accent)", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px" }}>FAQ</p>
        <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 900, letterSpacing: "-1px", marginBottom: "56px" }}>Common questions</h2>
        {faqs.map((f, i) => (
          <div key={i} style={{ borderBottom: "1px solid var(--border)", padding: "20px 0" }}>
            <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{
              width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
              background: "none", color: "var(--text)", fontSize: "15px", fontWeight: 600, textAlign: "left",
              cursor: "pointer",
            }}>
              {f.q}
              <span style={{ color: "var(--text2)", fontSize: "18px", transform: faqOpen === i ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.2s", display: "inline-block", flexShrink: 0, marginLeft: "16px" }}>+</span>
            </button>
            {faqOpen === i && <p style={{ color: "var(--text2)", fontSize: "14px", lineHeight: 1.8, marginTop: "14px" }}>{f.a}</p>}
          </div>
        ))}
      </section>

      {/* FINAL CTA */}
      <section className="cta-section" style={{ padding: "140px 48px", textAlign: "center", borderTop: "1px solid var(--border)" }}>
        <h2 style={{ fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 900, letterSpacing: "-3px", marginBottom: "20px", lineHeight: 0.95 }}>
          READY TO RIZE?
        </h2>
        <p style={{ color: "var(--text2)", fontSize: "16px", maxWidth: "380px", margin: "0 auto 40px", lineHeight: 1.7 }}>
          Start free. No credit card. Cancel anytime.
        </p>
        <Link href="/signup">
          <button style={{ background: "var(--accent)", color: "#fff", padding: "14px 40px", borderRadius: "6px", fontSize: "15px", fontWeight: 700, cursor: "pointer", transition: "opacity 0.2s" }}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}>
            Get Started Free →
          </button>
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer" style={{ borderTop: "1px solid var(--border)", padding: "28px 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: "16px", fontWeight: 900, letterSpacing: "-0.5px" }}>
          RZ<span style={{ color: "var(--accent)" }}>.</span>
        </div>
        <p style={{ color: "var(--text3)", fontSize: "12px" }}>© 2026 Rize Athletics</p>
      </footer>

    </div>
  );
}
