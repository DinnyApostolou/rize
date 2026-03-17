"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";

interface Profile {
  username: string;
  xp: number;
  streak: number;
  is_subscribed: boolean;
  drills_completed: number;
}

const NAV = [
  { href: "/drills", label: "Drills" },
  { href: "/strength", label: "Strength" },
  { href: "/nutrition", label: "Nutrition" },
  { href: "/schedule", label: "Schedule" },
  { href: "/assessment", label: "Assessment" },
  { href: "/stats", label: "My Stats" },
  { href: "/badges", label: "Badges" },
  { href: "/subscribe", label: "Upgrade" },
];

const QUICK = [
  { href: "/drills", label: "Basketball Drills", desc: "100+ drills with camera tracking" },
  { href: "/strength", label: "Strength", desc: "Explosive power & gym programs" },
  { href: "/nutrition", label: "Nutrition", desc: "Athlete meal plans & timing" },
  { href: "/schedule", label: "Schedule", desc: "Your weekly training plan" },
  { href: "/stats", label: "My Stats", desc: "Progress over time" },
  { href: "/badges", label: "Badges", desc: "Achievements & milestones" },
];

const QUOTES = [
  "The work you put in today is the edge you have tomorrow.",
  "Every rep, every drill, every session adds up.",
  "Champions are made in the off-season.",
  "Train hard. Stay consistent. Trust the process.",
  "The best players in the world were once beginners who refused to quit.",
  "Discipline beats motivation every single time.",
];

const TODAY = [
  { category: "Court", title: "Crossover Series", duration: "20 min", type: "drills" },
  { category: "Gym", title: "Lower Body Power", duration: "45 min", type: "strength" },
  { category: "Nutrition", title: "Pre-workout meal", duration: "30 min before", type: "nutrition" },
];

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const quote = QUOTES[new Date().getDay() % QUOTES.length];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    async function load() {
      const supabase = getSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(data || { username: user.email?.split("@")[0] || "Athlete", xp: 0, streak: 0, is_subscribed: false, drills_completed: 0 });
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleLogout() {
    await getSupabase().auth.signOut();
    router.push("/");
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "var(--text2)", fontSize: "14px", letterSpacing: "2px", textTransform: "uppercase" }}>Loading</div>
    </div>
  );

  const xp = profile?.xp || 0;
  const level = Math.floor(xp / 1000) + 1;
  const xpProgress = (xp % 1000) / 1000 * 100;
  const xpInLevel = xp % 1000;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>

      {/* NAV */}
      <nav style={{
        background: "rgba(10,10,10,0.95)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 40px", height: "60px", position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
          <div style={{ fontSize: "18px", fontWeight: 900, letterSpacing: "-0.5px" }}>RZ<span style={{ color: "var(--accent)" }}>.</span></div>
          <div style={{ display: "flex", gap: "2px" }}>
            {NAV.slice(0, 6).map(n => (
              <Link key={n.href} href={n.href}>
                <button style={{ background: "none", color: "var(--text2)", fontSize: "13px", padding: "6px 12px", borderRadius: "6px", fontWeight: 500 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--bg3)"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "none"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text2)"; }}>
                  {n.label}
                </button>
              </Link>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {!profile?.is_subscribed && (
            <Link href="/subscribe">
              <button style={{ background: "var(--accent)", color: "#fff", fontSize: "12px", fontWeight: 700, padding: "6px 14px", borderRadius: "6px", letterSpacing: "0.5px" }}>
                UPGRADE TO PRO
              </button>
            </Link>
          )}
          <button onClick={handleLogout} style={{ background: "none", color: "var(--text2)", fontSize: "13px", padding: "6px 12px", border: "1px solid var(--border)", borderRadius: "6px" }}>
            Sign out
          </button>
        </div>
      </nav>

      {/* HERO BANNER */}
      <div style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #0f1a24 50%, #0a0a0a 100%)",
        borderBottom: "1px solid var(--border)",
        padding: "48px 40px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Background accent */}
        <div style={{
          position: "absolute", top: "-60px", right: "-60px",
          width: "400px", height: "400px",
          background: "radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "24px" }}>
          <div>
            <p style={{ fontSize: "11px", color: "var(--accent)", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "10px" }}>
              {greeting}
            </p>
            <h1 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-2px", lineHeight: 1, marginBottom: "16px" }}>
              {profile?.username || "Athlete"}<span style={{ color: "var(--accent)" }}>.</span>
            </h1>
            <p style={{ color: "var(--text2)", fontSize: "14px", maxWidth: "480px", lineHeight: 1.6, fontStyle: "italic" }}>
              &ldquo;{quote}&rdquo;
            </p>
          </div>

          {/* Level badge */}
          <div style={{
            background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.25)",
            borderRadius: "12px", padding: "20px 28px", textAlign: "center", minWidth: "140px",
          }}>
            <div style={{ fontSize: "10px", color: "var(--accent)", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "6px" }}>Current Level</div>
            <div style={{ fontSize: "52px", fontWeight: 900, letterSpacing: "-3px", color: "var(--accent)", lineHeight: 1 }}>{level}</div>
            <div style={{ fontSize: "11px", color: "var(--text2)", marginTop: "4px" }}>{xp.toLocaleString()} XP total</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 40px" }}>

        {/* XP Progress */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "1px" }}>Level {level}</span>
              <span style={{ fontSize: "12px", color: "var(--text3)" }}>→</span>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "1px" }}>Level {level + 1}</span>
            </div>
            <span style={{ fontSize: "12px", color: "var(--text2)" }}>{xpInLevel} / 1000 XP — <span style={{ color: "var(--accent)", fontWeight: 700 }}>{1000 - xpInLevel} to go</span></span>
          </div>
          <div style={{ background: "var(--bg2)", borderRadius: "4px", height: "8px", position: "relative", overflow: "hidden" }}>
            <div style={{
              background: "linear-gradient(90deg, #0EA5E9, #38BDF8)",
              height: "100%", borderRadius: "4px",
              width: `${xpProgress}%`,
              transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)",
              boxShadow: "0 0 12px rgba(14,165,233,0.5)",
            }} />
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "32px" }}>
          {[
            { label: "Day Streak", value: profile?.streak || 0, unit: "days", accent: false },
            { label: "Drills Done", value: profile?.drills_completed || 0, unit: "total", accent: false },
            { label: "XP Earned", value: xp.toLocaleString(), unit: "points", accent: true },
            { label: "Next Level", value: 1000 - xpInLevel, unit: "XP away", accent: false },
          ].map((s, i) => (
            <div key={i} style={{
              background: "var(--bg2)", border: `1px solid ${s.accent ? "rgba(14,165,233,0.3)" : "var(--border)"}`,
              borderRadius: "10px", padding: "20px",
              borderTop: `2px solid ${s.accent ? "var(--accent)" : "var(--border)"}`,
            }}>
              <div style={{ fontSize: "10px", color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "10px" }}>{s.label}</div>
              <div style={{ fontSize: "30px", fontWeight: 900, letterSpacing: "-1px", color: s.accent ? "var(--accent)" : "var(--text)", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: "11px", color: "var(--text3)", marginTop: "6px" }}>{s.unit}</div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "20px", marginBottom: "24px" }}>

          {/* Today's Plan */}
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: "10px", color: "var(--accent)", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "2px" }}>Today</p>
                <h2 style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "-0.5px" }}>Your Training Plan</h2>
              </div>
              <div style={{ fontSize: "11px", color: "var(--text3)", fontWeight: 600 }}>3 sessions</div>
            </div>
            <div style={{ padding: "12px" }}>
              {TODAY.map((t, i) => (
                <Link key={i} href={"/" + t.type}>
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "16px", borderRadius: "8px", cursor: "pointer",
                    marginBottom: i < TODAY.length - 1 ? "4px" : "0",
                    border: "1px solid transparent", transition: "all 0.15s",
                  }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.background = "var(--bg3)"; el.style.borderColor = "var(--border)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.background = "transparent"; el.style.borderColor = "transparent"; }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <div style={{ width: "3px", height: "36px", background: "var(--accent)", borderRadius: "2px", flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: "10px", color: "var(--accent)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "3px" }}>{t.category}</div>
                        <div style={{ fontSize: "14px", fontWeight: 700 }}>{t.title}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text2)", fontWeight: 500 }}>{t.duration}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Streak + Badges CTA */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* Streak */}
            <div style={{
              background: profile?.streak ? "rgba(14,165,233,0.06)" : "var(--bg2)",
              border: `1px solid ${profile?.streak ? "rgba(14,165,233,0.2)" : "var(--border)"}`,
              borderRadius: "12px", padding: "24px", flex: 1,
            }}>
              <div style={{ fontSize: "10px", color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "12px" }}>Training Streak</div>
              <div style={{ fontSize: "48px", fontWeight: 900, letterSpacing: "-2px", color: profile?.streak ? "var(--accent)" : "var(--text3)", lineHeight: 1, marginBottom: "6px" }}>
                {profile?.streak || 0}
              </div>
              <div style={{ fontSize: "13px", color: "var(--text2)" }}>
                {profile?.streak ? `${profile.streak} day${profile.streak > 1 ? "s" : ""} in a row — keep it up` : "Start training to build your streak"}
              </div>
            </div>

            {/* Badges CTA */}
            <Link href="/badges">
              <div style={{
                background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "12px",
                padding: "20px 24px", cursor: "pointer", transition: "border-color 0.2s",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent)"}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)"}>
                <div>
                  <div style={{ fontSize: "10px", color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "4px" }}>Achievements</div>
                  <div style={{ fontSize: "15px", fontWeight: 800 }}>View your badges</div>
                  <div style={{ fontSize: "12px", color: "var(--text2)", marginTop: "2px" }}>22 badges to unlock</div>
                </div>
                <div style={{ fontSize: "18px", color: "var(--accent)", fontWeight: 900 }}>→</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Quick Access */}
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
            <p style={{ fontSize: "10px", color: "var(--accent)", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "2px" }}>Navigate</p>
            <h2 style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "-0.5px" }}>All Sections</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
            {QUICK.map((n, i) => (
              <Link key={i} href={n.href}>
                <div style={{
                  padding: "20px 24px", cursor: "pointer",
                  borderRight: i % 3 !== 2 ? "1px solid var(--border)" : "none",
                  borderBottom: i < 3 ? "1px solid var(--border)" : "none",
                  transition: "background 0.15s",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "var(--bg3)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}>
                  <div style={{ fontSize: "14px", fontWeight: 800, marginBottom: "4px" }}>{n.label}</div>
                  <div style={{ fontSize: "12px", color: "var(--text2)", lineHeight: 1.4 }}>{n.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
