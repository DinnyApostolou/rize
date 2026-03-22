"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ParticleBackground from "@/components/ParticleBackground";

function useCountUp(target: number, duration = 1500, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let current = 0;
    const steps = 60;
    const increment = target / steps;
    const interval = duration / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, interval);
    return () => clearInterval(timer);
  }, [start, target, duration]);
  return count;
}

export default function Home() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  const athletes = useCountUp(500, 1500, statsVisible);
  const drills = useCountUp(100, 1500, statsVisible);
  const meals = useCountUp(20, 1200, statsVisible);

  useEffect(() => {
    // Scroll fade-up observer
    const fadeObserver = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.15 }
    );
    document.querySelectorAll(".fade-up").forEach(el => fadeObserver.observe(el));

    // Stats counter observer
    const statsObserver = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.5 }
    );
    if (statsRef.current) statsObserver.observe(statsRef.current);

    return () => { fadeObserver.disconnect(); statsObserver.disconnect(); };
  }, []);

  const faqs = [
    { q: "Who is Rize for?", a: "Rize is built for any athlete who wants to level up their basketball and gym training. Whether you're in middle school, high school or playing at a higher level — if you're serious about improving, Rize is for you." },
    { q: "Do I need a gym membership?", a: "No. Many programs can be done at home or on the court. The gym programs are optional — you can focus purely on basketball if that's your goal." },
    { q: "How is Rize different from YouTube?", a: "YouTube gives you random videos with no structure or accountability. Rize gives you a personalised program, progress tracking, nutrition plans and scheduling — all in one place." },
    { q: "Can I cancel anytime?", a: "Yes. No contracts, no commitments. Cancel anytime and you won't be charged again." },
    { q: "What is the drill camera?", a: "Every drill has a Start Drill button that opens your camera and tracks your basketball in real time. It detects the ball using colour recognition, counts your dribbles and overlays your body position — all included in Pro." },
  ];

  const mockups = [
    // Basketball
    <div key="b" style={{ width: "100%", fontFamily: "inherit" }}>
      <div style={{ fontSize: "11px", color: "var(--text3)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "16px" }}>Today&apos;s Drills</div>
      {[
        { name: "Crossover Combo", diff: "Medium", xp: 50, color: "#F59E0B" },
        { name: "Shooting Form", diff: "Hard", xp: 80, color: "#EF4444" },
        { name: "Ball Handling", diff: "Easy", xp: 30, color: "#10B981" },
      ].map((d, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "var(--bg3)", borderRadius: "8px", marginBottom: "8px", border: "1px solid var(--border)" }}>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>{d.name}</div>
            <div style={{ fontSize: "11px", color: d.color, fontWeight: 600 }}>{d.diff}</div>
          </div>
          <div style={{ fontSize: "12px", color: "var(--accent)", fontWeight: 700 }}>+{d.xp} XP</div>
        </div>
      ))}
    </div>,
    // Strength
    <div key="s" style={{ width: "100%", fontFamily: "inherit" }}>
      <div style={{ fontSize: "11px", color: "var(--text3)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "16px" }}>Strength Program</div>
      {[
        { name: "Squat Jump", detail: "4 × 8 reps" },
        { name: "Box Jump", detail: "3 × 6 reps" },
        { name: "Hip Thrust", detail: "4 × 12 reps" },
      ].map((e, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "var(--bg3)", borderRadius: "8px", marginBottom: "8px", border: "1px solid var(--border)" }}>
          <div style={{ fontSize: "13px", fontWeight: 600 }}>{e.name}</div>
          <div style={{ fontSize: "12px", color: "var(--text2)" }}>{e.detail}</div>
        </div>
      ))}
    </div>,
    // Nutrition
    <div key="n" style={{ width: "100%", fontFamily: "inherit" }}>
      <div style={{ fontSize: "11px", color: "var(--text3)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "16px" }}>Pre-Game Meal</div>
      {[
        { label: "Protein", value: 42, max: 60, color: "#0EA5E9" },
        { label: "Carbs", value: 85, max: 100, color: "#10B981" },
        { label: "Fat", value: 18, max: 40, color: "#F59E0B" },
      ].map((m, i) => (
        <div key={i} style={{ marginBottom: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontSize: "12px", color: "var(--text2)" }}>{m.label}</span>
            <span style={{ fontSize: "12px", fontWeight: 700 }}>{m.value}g</span>
          </div>
          <div style={{ height: "6px", background: "var(--bg3)", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(m.value / m.max) * 100}%`, background: m.color, borderRadius: "3px" }} />
          </div>
        </div>
      ))}
    </div>,
    // Tracking
    <div key="t" style={{ width: "100%", fontFamily: "inherit" }}>
      <div style={{ fontSize: "11px", color: "var(--text3)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "16px" }}>Your Progress</div>
      <div style={{ padding: "14px", background: "var(--bg3)", borderRadius: "8px", border: "1px solid var(--border)", marginBottom: "10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ fontSize: "13px", fontWeight: 700 }}>Level 12</span>
          <span style={{ fontSize: "12px", color: "var(--accent)" }}>2,450 / 3,000 XP</span>
        </div>
        <div style={{ height: "6px", background: "var(--bg)", borderRadius: "3px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: "82%", background: "linear-gradient(90deg, #0EA5E9, #38BDF8)", borderRadius: "3px" }} />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 14px", background: "var(--bg3)", borderRadius: "8px", border: "1px solid var(--border)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "18px", marginBottom: "2px" }}>🏀</div>
          <div style={{ fontSize: "10px", color: "var(--text3)" }}>Baller</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "18px", marginBottom: "2px" }}>🔥</div>
          <div style={{ fontSize: "10px", color: "var(--text3)" }}>On Fire</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "18px", marginBottom: "2px" }}>⚡</div>
          <div style={{ fontSize: "10px", color: "var(--text3)" }}>Speed</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "18px", marginBottom: "2px" }}>🎯</div>
          <div style={{ fontSize: "10px", color: "var(--text3)" }}>Sharp</div>
        </div>
      </div>
    </div>,
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
        {/* Logo */}
        <div style={{ fontSize: "18px", fontWeight: 900, letterSpacing: "-0.5px" }}>
          RIZE<span style={{ color: "var(--accent)" }}>.</span>
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
        background: "#050810",
      }}>
        {/* Interactive particle background */}
        <ParticleBackground />
        {/* Animated glowing orbs — visible on mobile, layered under video on desktop */}
        <div className="hero-mobile-bg" style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
          {/* Orb 1 — electric blue, top left */}
          <div style={{
            position: "absolute", top: "-10%", left: "-5%",
            width: "600px", height: "600px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,116,255,0.55) 0%, rgba(0,116,255,0.15) 50%, transparent 70%)",
            filter: "blur(60px)",
            animation: "orbFloat1 12s ease-in-out infinite",
          }} />
          {/* Orb 2 — purple, top right */}
          <div style={{
            position: "absolute", top: "-15%", right: "-10%",
            width: "700px", height: "700px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.45) 0%, rgba(124,58,237,0.12) 50%, transparent 70%)",
            filter: "blur(70px)",
            animation: "orbFloat2 15s ease-in-out infinite",
          }} />
          {/* Orb 3 — cyan, bottom center */}
          <div style={{
            position: "absolute", bottom: "-20%", left: "30%",
            width: "500px", height: "500px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,212,255,0.3) 0%, rgba(0,116,255,0.08) 50%, transparent 70%)",
            filter: "blur(80px)",
            animation: "orbFloat3 18s ease-in-out infinite",
          }} />
        </div>
        {/* Overlay */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
          background: "linear-gradient(to bottom, rgba(10,15,20,0.5) 0%, rgba(10,15,20,0.1) 40%, rgba(10,15,20,0.8) 100%)",
        }} />

        {/* Hero content */}
        <div style={{ position: "relative", zIndex: 2 }}>
          {/* Bracket box label */}
          <div className="bracket-box" style={{ marginBottom: "32px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "var(--accent)" }}>
              BASKETBALL · GYM · NUTRITION · PROGRESS
            </span>
            <span />
          </div>
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
          <div ref={statsRef} className="stats-bar" style={{
            display: "flex", gap: "64px", marginTop: "96px", flexWrap: "wrap",
            justifyContent: "center", borderTop: "1px solid var(--border)", paddingTop: "56px",
          }}>
            {[
              { num: athletes + "+", label: "Athletes" },
              { num: drills + "+", label: "Drills & Programs" },
              { num: "$7.99", label: "Per Month" },
              { num: meals + "+", label: "Meal Plans" },
            ].map(({ num, label }) => (
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
      <section id="features" className="features-section fade-up" style={{ padding: "140px 48px", maxWidth: "1100px", margin: "0 auto", position: "relative" }}>

        {/* Section glow orb */}
        <div style={{ position: "absolute", top: "10%", right: "-20%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,116,255,0.12) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "absolute", bottom: "20%", left: "-15%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none", zIndex: 0 }} />

        <div style={{ marginBottom: "96px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(0,116,255,0.08)", border: "1px solid rgba(0,116,255,0.2)", borderRadius: "999px", padding: "6px 16px", marginBottom: "20px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 8px var(--accent)" }} />
            <span style={{ color: "var(--accent)", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase" }}>Platform</span>
          </div>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 900, letterSpacing: "-2px", maxWidth: "560px", lineHeight: 1.1 }}>
            Everything a serious<br />
            <span style={{ background: "linear-gradient(90deg, #0074FF, #7C3AED, #38BDF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>athlete needs</span>
          </h2>
        </div>

        {[
          { label: "BASKETBALL", color: "#0074FF", title: "100+ structured drills", desc: "Ball handling, shooting, finishing, defense and IQ — every drill has coaching cues, difficulty rating and a YouTube tutorial. New drills added every week.", points: ["Beginner to advanced levels", "Categorised by skill area", "YouTube tutorials on every drill", "Track completions and earn XP"] },
          { label: "STRENGTH", color: "#8B5CF6", title: "Athlete-specific gym programs", desc: "Periodised lifting programs built for basketball athletes. Explosive power, vertical jump, sprint speed and injury prevention — not generic bodybuilder workouts.", points: ["5 training categories", "30+ exercises with coaching cues", "Sets, reps and rest periods included", "YouTube form guides on every exercise"] },
          { label: "NUTRITION", color: "#10B981", title: "Fuel and recovery plans", desc: "Pre-game, post-game, daily meals and snacks with exact macros, ingredient lists and explanations of why each meal helps your performance.", points: ["50+ meals with full macros", "Pre-game and post-game specific", "Hydration guides included", "Designed for athletic performance"] },
          { label: "TRACKING", color: "#F59E0B", title: "Progress that actually means something", desc: "XP system, skill assessment, stats card, weekly schedule and 22 collectible badges. See yourself improve week over week.", points: ["Skill assessment quiz", "XP and level system", "Day streak tracking", "22 achievement badges"] },
        ].map((f, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center", marginBottom: "120px", direction: i % 2 === 1 ? "rtl" : "ltr", position: "relative", zIndex: 1 }} className="feature-row">
            <div style={{ direction: "ltr" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: `${f.color}15`, border: `1px solid ${f.color}40`, borderRadius: "999px", padding: "5px 14px", marginBottom: "20px" }}>
                <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: f.color, boxShadow: `0 0 6px ${f.color}` }} />
                <span style={{ color: f.color, fontSize: "10px", fontWeight: 800, letterSpacing: "2px" }}>{f.label}</span>
              </div>
              <h3 style={{ fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 900, letterSpacing: "-1px", marginBottom: "16px", lineHeight: 1.1 }}>{f.title}</h3>
              <p style={{ color: "var(--text2)", fontSize: "15px", lineHeight: 1.8, marginBottom: "28px" }}>{f.desc}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {f.points.map((p, pi) => (
                  <div key={pi} style={{ display: "flex", gap: "12px", alignItems: "center", fontSize: "14px", color: "var(--text2)" }}>
                    <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: `${f.color}20`, border: `1px solid ${f.color}60`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: f.color }} />
                    </div>
                    {p}
                  </div>
                ))}
              </div>
            </div>
            {/* Glowing mockup card */}
            <div
              className="stat-box"
              style={{
                direction: "ltr",
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: `1px solid ${f.color}40`,
                borderRadius: "16px",
                padding: "28px 24px",
                boxShadow: `0 0 30px ${f.color}15, 0 20px 60px rgba(0,0,0,0.4)`,
                transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = "translateY(-8px)";
                el.style.boxShadow = `0 0 0 1px ${f.color}, 0 0 40px ${f.color}60, 0 0 80px ${f.color}25, 0 20px 60px rgba(0,0,0,0.5)`;
                el.style.borderColor = f.color;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = "translateY(0)";
                el.style.boxShadow = `0 0 30px ${f.color}15, 0 20px 60px rgba(0,0,0,0.4)`;
                el.style.borderColor = `${f.color}40`;
              }}
            >
              {mockups[i]}
            </div>
          </div>
        ))}
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="how-it-works-section fade-up" style={{ padding: "120px 48px", background: "linear-gradient(180deg, var(--bg) 0%, var(--bg2) 50%, var(--bg) 100%)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "600px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,116,255,0.07) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1000px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(0,116,255,0.08)", border: "1px solid rgba(0,116,255,0.2)", borderRadius: "999px", padding: "6px 16px", marginBottom: "20px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 8px var(--accent)" }} />
            <span style={{ color: "var(--accent)", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase" }}>Process</span>
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900, letterSpacing: "-2px", marginBottom: "72px", maxWidth: "400px" }}>Up and running in minutes</h2>
          <div className="how-works-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "48px" }}>
            {[
              { n: "01", title: "Sign up free", desc: "Create an account — no credit card required.", color: "#0074FF" },
              { n: "02", title: "Take the assessment", desc: "Tell us your position, goals and weaknesses.", color: "#8B5CF6" },
              { n: "03", title: "Get your program", desc: "Personalised day-by-day training plan built for you.", color: "#10B981" },
              { n: "04", title: "Train and track", desc: "Log sessions, earn XP and measure real progress.", color: "#F59E0B" },
            ].map((s) => (
              <div key={s.n} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "28px 24px", transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease", cursor: "default" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-6px)"; el.style.boxShadow = `0 0 0 1px ${s.color}, 0 0 30px ${s.color}50, 0 0 60px ${s.color}20`; el.style.borderColor = s.color; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; el.style.borderColor = "rgba(255,255,255,0.06)"; }}
              >
                <div style={{ fontSize: "28px", fontWeight: 900, color: s.color, textShadow: `0 0 20px ${s.color}80`, marginBottom: "16px", fontVariantNumeric: "tabular-nums" }}>{s.n}</div>
                <div style={{ width: "24px", height: "2px", background: s.color, boxShadow: `0 0 8px ${s.color}`, marginBottom: "16px", borderRadius: "2px" }} />
                <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "10px" }}>{s.title}</div>
                <div style={{ fontSize: "13px", color: "var(--text2)", lineHeight: 1.7 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="pricing-section fade-up" style={{ padding: "140px 48px", maxWidth: "860px", margin: "0 auto" }}>
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
      <section className="testimonials-section fade-up" style={{ padding: "120px 48px", background: "var(--bg2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
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
      <section id="faq" className="faq-section fade-up" style={{ padding: "120px 48px", maxWidth: "680px", margin: "0 auto" }}>
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
      <section className="cta-section fade-up" style={{
        padding: "140px 48px", textAlign: "center", borderTop: "1px solid var(--border)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: "600px", height: "400px",
          background: "radial-gradient(ellipse, rgba(14,165,233,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <h2 style={{ fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 900, letterSpacing: "-3px", marginBottom: "20px", lineHeight: 0.95, position: "relative" }}>
          READY TO RIZE?
        </h2>
        <p style={{ color: "var(--text2)", fontSize: "16px", maxWidth: "380px", margin: "0 auto 40px", lineHeight: 1.7, position: "relative" }}>
          Start free. No credit card. Cancel anytime.
        </p>
        <Link href="/signup" style={{ position: "relative" }}>
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
          RIZE<span style={{ color: "var(--accent)" }}>.</span>
        </div>
        <p style={{ color: "var(--text3)", fontSize: "12px" }}>© 2026 Rize Athletics</p>
      </footer>

    </div>
  );
}
