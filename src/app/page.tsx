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
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(10,10,10,0.9)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 48px", height: "60px",
      }}>
        <div style={{ fontSize: "18px", fontWeight: 900, letterSpacing: "-0.5px" }}>
          RZ<span style={{ color: "var(--accent)" }}>.</span>
        </div>
        <div style={{ display: "flex", gap: "32px", fontSize: "13px", color: "var(--text2)" }}>
          {["#features", "#how-it-works", "#pricing", "#faq"].map((href, i) => (
            <a key={i} href={href}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text2)")}>
              {["Features", "How it works", "Pricing", "FAQ"][i]}
            </a>
          ))}
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link href="/login">
            <button style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text2)", padding: "7px 18px", borderRadius: "6px", fontSize: "13px" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#555"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text2)"; }}>
              Log in
            </button>
          </Link>
          <Link href="/signup">
            <button style={{ background: "var(--accent)", color: "#fff", padding: "7px 18px", borderRadius: "6px", fontSize: "13px", fontWeight: 700 }}>
              Get Started
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
          position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)",
          width: "800px", height: "500px",
          background: "radial-gradient(ellipse, rgba(14,165,233,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Left image — basketball player dribbling */}
        <div style={{
          position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
          width: "320px", height: "560px", pointerEvents: "none", overflow: "hidden",
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1519861531473-9200262188bf?w=500&h=700&fit=crop&q=80"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.55 }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 30%, #0a0a0a 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, #0a0a0a 0%, transparent 20%, transparent 80%, #0a0a0a 100%)" }} />
        </div>

        {/* Right image — gym/strength training */}
        <div style={{
          position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)",
          width: "320px", height: "560px", pointerEvents: "none", overflow: "hidden",
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500&h=700&fit=crop&q=80"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.55 }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to left, transparent 30%, #0a0a0a 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, #0a0a0a 0%, transparent 20%, transparent 80%, #0a0a0a 100%)" }} />
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

        <p style={{ fontSize: "clamp(15px, 1.8vw, 18px)", color: "var(--text2)", maxWidth: "500px", lineHeight: 1.7, marginBottom: "48px" }}>
          Basketball drills, gym programs, nutrition and progress tracking — structured, personalised and built for people who take their game seriously.
        </p>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/signup">
            <button style={{
              background: "var(--accent)", color: "#fff",
              padding: "14px 36px", borderRadius: "6px",
              fontSize: "15px", fontWeight: 700,
              transition: "opacity 0.2s",
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
              fontSize: "15px", fontWeight: 600,
            }}>
              See What's Inside
            </button>
          </a>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "64px", marginTop: "96px", flexWrap: "wrap", justifyContent: "center", borderTop: "1px solid var(--border)", paddingTop: "48px" }}>
          {[["500+", "Athletes"], ["100+", "Drills & Programs"], ["$7.99", "Per Month"], ["20+", "Meal Plans"]].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "-1px" }}>{num}</div>
              <div style={{ fontSize: "12px", color: "var(--text2)", marginTop: "4px", textTransform: "uppercase", letterSpacing: "1px" }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ paddingTop: "80px", paddingBottom: "80px", paddingLeft: "24px", paddingRight: "24px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 900, textAlign: "left", marginBottom: "8px" }}>How it works</h2>
          <p style={{ color: "var(--text2)", fontSize: "15px", marginBottom: "40px" }}>Three steps to becoming the athlete you want to be.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
            {[
              { n: "1", title: "Sign up free", desc: "Create your account in under a minute. No credit card needed to get started." },
              { n: "2", title: "Get your programme", desc: "Complete a quick skill assessment and get a personalised plan built around your position and goals." },
              { n: "3", title: "Train, track, level up", desc: "Complete drills, earn XP, unlock badges and watch your stats improve in real time." },
            ].map((s) => (
              <div key={s.n} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "12px", padding: "28px" }}>
                <div style={{ fontSize: "48px", fontWeight: 900, color: "var(--accent)", opacity: 0.4, lineHeight: 1, marginBottom: "20px" }}>{s.n}</div>
                <div style={{ fontSize: "16px", fontWeight: 800, marginBottom: "8px" }}>{s.title}</div>
                <div style={{ fontSize: "14px", color: "var(--text2)", lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: "120px 48px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ marginBottom: "80px" }}>
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
          },
          {
            label: "STRENGTH",
            title: "Athlete-specific gym programs",
            desc: "Periodised lifting programs built for basketball athletes. Explosive power, vertical jump, sprint speed and injury prevention — not generic bodybuilder workouts.",
            points: ["5 training categories", "30+ exercises with coaching cues", "Sets, reps and rest periods included", "YouTube form guides on every exercise"],
          },
          {
            label: "NUTRITION",
            title: "Fuel and recovery plans",
            desc: "Pre-game, post-game, daily meals and snacks with exact macros, ingredient lists and explanations of why each meal helps your performance.",
            points: ["50+ meals with full macros", "Pre-game and post-game specific", "Hydration guides included", "Designed for athletic performance"],
          },
          {
            label: "TRACKING",
            title: "Progress that actually means something",
            desc: "XP system, skill assessment, stats card, weekly schedule and 22 collectible badges. See yourself improve week over week.",
            points: ["Skill assessment quiz", "XP and level system", "Day streak tracking", "22 achievement badges"],
          },
        ].map((f, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px",
            alignItems: "center", marginBottom: "100px",
            direction: i % 2 === 1 ? "rtl" : "ltr",
          }}>
            <div style={{ direction: "ltr" }}>
              <p style={{ color: "var(--accent)", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px" }}>{f.label}</p>
              <h3 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 900, letterSpacing: "-1px", marginBottom: "16px" }}>{f.title}</h3>
              <p style={{ color: "var(--text2)", fontSize: "15px", lineHeight: 1.8, marginBottom: "28px" }}>{f.desc}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {f.points.map((p, pi) => (
                  <div key={pi} style={{ display: "flex", gap: "10px", alignItems: "center", fontSize: "14px", color: "var(--text2)" }}>
                    <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />
                    {p}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ direction: "ltr", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "12px", padding: "40px", minHeight: "220px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "48px", fontWeight: 900, color: "var(--accent)", letterSpacing: "-2px", marginBottom: "8px" }}>
                  {["100+", "30+", "50+", "22"][i]}
                </div>
                <div style={{ fontSize: "13px", color: "var(--text2)", textTransform: "uppercase", letterSpacing: "1px" }}>
                  {["Drills", "Exercises", "Meals", "Badges"][i]}
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "100px 48px", background: "var(--bg2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <p style={{ color: "var(--accent)", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px" }}>Process</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900, letterSpacing: "-2px", marginBottom: "64px", maxWidth: "400px" }}>Up and running in minutes</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "48px" }}>
            {[
              { n: "01", title: "Sign up free", desc: "Create an account — no credit card required." },
              { n: "02", title: "Take the assessment", desc: "Tell us your position, goals and weaknesses." },
              { n: "03", title: "Get your program", desc: "Personalised day-by-day training plan built for you." },
              { n: "04", title: "Train and track", desc: "Log sessions, earn XP and measure real progress." },
            ].map((s) => (
              <div key={s.n}>
                <div style={{ fontSize: "11px", color: "var(--text3)", fontWeight: 700, letterSpacing: "1px", marginBottom: "16px" }}>{s.n}</div>
                <div style={{ width: "1px", height: "32px", background: "var(--border)", marginBottom: "16px" }} />
                <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>{s.title}</div>
                <div style={{ fontSize: "13px", color: "var(--text2)", lineHeight: 1.7 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: "120px 48px", maxWidth: "860px", margin: "0 auto" }}>
        <div style={{ marginBottom: "64px" }}>
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
              <button style={{ width: "100%", marginTop: "28px", background: "transparent", border: "1px solid var(--border)", color: "var(--text)", padding: "12px", borderRadius: "6px", fontSize: "14px", fontWeight: 600 }}>
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
              <button style={{ width: "100%", marginTop: "28px", background: "var(--accent)", color: "#fff", padding: "12px", borderRadius: "6px", fontSize: "14px", fontWeight: 700 }}>
                Start Free →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "100px 48px", background: "var(--bg2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <p style={{ color: "var(--accent)", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px" }}>Reviews</p>
          <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 900, letterSpacing: "-1px", marginBottom: "48px" }}>What athletes say</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            {[
              { name: "Marcus T.", age: 19, text: "The drill programs are actually structured. Not random videos — it tells me exactly what to do each day. My handles improved noticeably in 3 weeks." },
              { name: "Jordan L.", age: 21, text: "The gym program is built for basketball, not just for looks. I'm jumping higher and moving faster. Worth every dollar." },
              { name: "Aiden K.", age: 17, text: "YouTube has no structure. Rize gave me an actual plan. I know exactly what to train every single day." },
            ].map((t, i) => (
              <div key={i} style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "10px", padding: "24px" }}>
                <p style={{ fontSize: "14px", color: "var(--text2)", lineHeight: 1.8, marginBottom: "20px" }}>"{t.text}"</p>
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
      <section id="faq" style={{ padding: "100px 48px", maxWidth: "680px", margin: "0 auto" }}>
        <p style={{ color: "var(--accent)", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px" }}>FAQ</p>
        <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 900, letterSpacing: "-1px", marginBottom: "48px" }}>Common questions</h2>
        {faqs.map((f, i) => (
          <div key={i} style={{ borderBottom: "1px solid var(--border)", padding: "18px 0" }}>
            <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{
              width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
              background: "none", color: "var(--text)", fontSize: "15px", fontWeight: 600, textAlign: "left",
            }}>
              {f.q}
              <span style={{ color: "var(--text2)", fontSize: "18px", transform: faqOpen === i ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.2s", display: "inline-block", flexShrink: 0, marginLeft: "16px" }}>+</span>
            </button>
            {faqOpen === i && <p style={{ color: "var(--text2)", fontSize: "14px", lineHeight: 1.8, marginTop: "12px" }}>{f.a}</p>}
          </div>
        ))}
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: "120px 48px", textAlign: "center", borderTop: "1px solid var(--border)" }}>
        <h2 style={{ fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 900, letterSpacing: "-3px", marginBottom: "20px", lineHeight: 0.95 }}>
          READY TO RIZE?
        </h2>
        <p style={{ color: "var(--text2)", fontSize: "16px", maxWidth: "380px", margin: "0 auto 40px", lineHeight: 1.7 }}>
          Start free. No credit card. Cancel anytime.
        </p>
        <Link href="/signup">
          <button style={{ background: "var(--accent)", color: "#fff", padding: "14px 40px", borderRadius: "6px", fontSize: "15px", fontWeight: 700 }}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}>
            Get Started Free →
          </button>
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "28px 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: "16px", fontWeight: 900, letterSpacing: "-0.5px" }}>
          RZ<span style={{ color: "var(--accent)" }}>.</span>
        </div>
        <p style={{ color: "var(--text3)", fontSize: "12px" }}>© 2026 Rize Athletics</p>
      </footer>

    </div>
  );
}
