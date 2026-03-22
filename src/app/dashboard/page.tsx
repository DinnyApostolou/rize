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
  { href: "/dashboard", label: "Home", icon: "⊞" },
  { href: "/drills", label: "Drills", icon: "🏀" },
  { href: "/strength", label: "Strength", icon: "⚡" },
  { href: "/nutrition", label: "Nutrition", icon: "◈" },
  { href: "/schedule", label: "Schedule", icon: "▦" },
  { href: "/stats", label: "My Stats", icon: "↗" },
  { href: "/badges", label: "Badges", icon: "◎" },
  { href: "/assessment", label: "Assessment", icon: "▤" },
  { href: "/profile", label: "Profile", icon: "○" },
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
  { category: "Court", title: "Crossover Series", duration: "20 min", href: "/drills", color: "#0EA5E9" },
  { category: "Gym", title: "Lower Body Power", duration: "45 min", href: "/strength", color: "#8B5CF6" },
  { category: "Nutrition", title: "Pre-workout meal", duration: "30 min before", href: "/nutrition", color: "#10B981" },
];

function getStreakBadge(streak: number): string | null {
  if (streak >= 100) return "LEGEND";
  if (streak >= 30) return "IRON ATHLETE";
  if (streak >= 7) return "WEEK WARRIOR";
  return null;
}

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [weekDrills, setWeekDrills] = useState(0);
  const [position, setPosition] = useState<string | null>(null);
  const [skillLevel, setSkillLevel] = useState<string | null>(null);
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

      if (typeof window !== "undefined" && !localStorage.getItem("rize_onboarded")) {
        router.push("/onboarding");
        return;
      }

      const today = new Date();
      const dayOfWeek = today.getDay();
      const monday = new Date(today);
      monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      monday.setHours(0, 0, 0, 0);
      const weekKey = monday.toISOString().split("T")[0];
      const storedWeekKey = localStorage.getItem("rize_week_key");
      if (storedWeekKey !== weekKey) {
        localStorage.setItem("rize_week_key", weekKey);
        localStorage.setItem("rize_week_drills", "0");
      }
      setWeekDrills(parseInt(localStorage.getItem("rize_week_drills") || "0"));
      setPosition(localStorage.getItem("rize_position"));
      setSkillLevel(localStorage.getItem("rize_skill_level"));
    }
    load();
  }, [router]);

  async function handleLogout() {
    await getSupabase().auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
        <div style={{ width: "240px", background: "var(--bg2)", borderRight: "1px solid var(--border)", flexShrink: 0 }} />
        <div style={{ flex: 1, padding: "40px" }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ background: "var(--bg2)", borderRadius: "12px", height: "120px", marginBottom: "16px", animation: "pulse 1.5s ease infinite" }} />
          ))}
        </div>
      </div>
    );
  }

  const xp = profile?.xp || 0;
  const level = Math.floor(xp / 1000) + 1;
  const xpInLevel = xp % 1000;
  const xpProgress = (xpInLevel / 1000) * 100;
  const streak = profile?.streak || 0;
  const streakBadge = getStreakBadge(streak);
  const weekGoal = 5;
  const weekProgress = Math.min(weekDrills, weekGoal);
  const weekComplete = weekDrills >= weekGoal;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>

      {/* SIDEBAR */}
      <aside style={{
        width: "240px", flexShrink: 0,
        background: "var(--bg2)", borderRight: "1px solid var(--border)",
        position: "fixed", top: 0, left: 0, bottom: 0,
        display: "flex", flexDirection: "column",
        zIndex: 50,
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontSize: "18px", fontWeight: 900, letterSpacing: "-0.5px" }}>
            RIZE<span style={{ color: "var(--accent)" }}>.</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "12px", flex: 1, overflowY: "auto" }}>
          {NAV.map(n => (
            <Link key={n.href} href={n.href}>
              <div style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "9px 12px", borderRadius: "8px", marginBottom: "2px",
                fontSize: "14px", fontWeight: 500, color: "var(--text2)",
                cursor: "pointer", transition: "all 0.15s",
              }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.background = "var(--bg3)"; el.style.color = "#fff"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.background = "transparent"; el.style.color = "var(--text2)"; }}>
                <span style={{ fontSize: "13px", width: "18px", textAlign: "center" }}>{n.icon}</span>
                {n.label}
              </div>
            </Link>
          ))}

        </nav>

        {/* User info + sign out */}
        <div style={{ padding: "16px", borderTop: "1px solid var(--border)" }}>
          <div style={{ marginBottom: "10px" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "2px" }}>{profile?.username}</div>
            <div style={{ fontSize: "11px", color: "var(--text3)" }}>Level {level} · {xp.toLocaleString()} XP</div>
          </div>
          {!profile?.is_subscribed && (
            <Link href="/subscribe" style={{ textDecoration: "none", display: "block", marginBottom: "10px" }}>
              <div style={{
                padding: "8px 12px", borderRadius: "7px",
                fontSize: "12px", fontWeight: 700, color: "var(--accent)",
                background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.2)",
                cursor: "pointer", transition: "all 0.15s", textAlign: "center",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(14,165,233,0.15)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(14,165,233,0.08)"; }}>
                ★ Upgrade to Pro
              </div>
            </Link>
          )}
          <button onClick={handleLogout} style={{
            width: "100%", background: "none", border: "1px solid var(--border)",
            color: "var(--text3)", fontSize: "12px", padding: "7px",
            borderRadius: "6px", cursor: "pointer", transition: "all 0.15s",
          }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = "#555"; el.style.color = "#fff"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = "var(--border)"; el.style.color = "var(--text3)"; }}>
            Sign out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ marginLeft: "240px", flex: 1, padding: "40px 48px", maxWidth: "1000px" }}>

        {/* Greeting */}
        <div style={{ marginBottom: "40px" }}>
          <p style={{ fontSize: "12px", color: "var(--accent)", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>
            {greeting}
          </p>
          <h1 style={{ fontSize: "36px", fontWeight: 900, letterSpacing: "-2px", lineHeight: 1, marginBottom: "8px" }}>
            {profile?.username}<span style={{ color: "var(--accent)" }}>.</span>
          </h1>
          {(position || skillLevel) && (
            <div style={{ fontSize: "13px", color: "var(--text2)" }}>
              {[position, skillLevel].filter(Boolean).join(" · ")}
            </div>
          )}
        </div>

        {/* XP Bar */}
        <div style={{
          background: "var(--bg2)", border: "1px solid var(--border)",
          borderRadius: "12px", padding: "20px 24px", marginBottom: "20px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                background: "rgba(14,165,233,0.1)", border: "1px solid rgba(14,165,233,0.25)",
                borderRadius: "8px", padding: "4px 12px",
                fontSize: "13px", fontWeight: 900, color: "var(--accent)",
              }}>LVL {level}</div>
              <span style={{ fontSize: "13px", color: "var(--text2)" }}>
                {xpInLevel.toLocaleString()} / 1,000 XP
              </span>
            </div>
            <span style={{ fontSize: "12px", color: "var(--accent)", fontWeight: 700 }}>
              {(1000 - xpInLevel).toLocaleString()} XP to Level {level + 1}
            </span>
          </div>
          <div style={{ background: "var(--bg3)", borderRadius: "8px", height: "10px", overflow: "hidden" }}>
            <div style={{
              background: "linear-gradient(90deg, #7C3AED, #6366F1, #0EA5E9, #38BDF8)",
              backgroundSize: "200% 100%",
              animation: "flowGradient 3s ease infinite",
              height: "100%", borderRadius: "8px",
              width: `${xpProgress}%`,
              transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)",
              boxShadow: "0 0 12px rgba(99,102,241,0.5)",
            }} />
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "20px" }}>
          {[
            { label: "Day Streak", value: streak, unit: streak === 1 ? "day" : "days", color: "#F59E0B", badge: streakBadge },
            { label: "Drills Done", value: profile?.drills_completed || 0, unit: "total", color: "#0EA5E9", badge: null },
            { label: "XP Earned", value: xp.toLocaleString(), unit: "points", color: "#8B5CF6", badge: null },
            { label: "This Week", value: `${weekDrills}/${weekGoal}`, unit: "drills", color: "#10B981", badge: weekComplete ? "DONE" : null },
          ].map((s, i) => (
            <div key={i} style={{
              background: "var(--bg2)", border: "1px solid var(--border)",
              borderRadius: "12px", padding: "20px",
              borderTop: `2px solid ${s.color}`,
            }}>
              <div style={{ fontSize: "10px", color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "12px" }}>{s.label}</div>
              <div style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "-1px", color: s.color, lineHeight: 1, marginBottom: "6px" }}>{s.value}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "11px", color: "var(--text3)" }}>{s.unit}</span>
                {s.badge && (
                  <span style={{
                    fontSize: "9px", fontWeight: 800, letterSpacing: "0.5px",
                    background: `${s.color}22`, border: `1px solid ${s.color}44`,
                    borderRadius: "4px", padding: "1px 6px", color: s.color,
                  }}>{s.badge}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Upgrade to Pro banner — only for free users */}
        {!profile?.is_subscribed && (
          <Link href="/subscribe" style={{ textDecoration: "none", display: "block", marginBottom: "20px" }}>
            <div style={{
              background: "linear-gradient(135deg, rgba(14,165,233,0.10), rgba(56,189,248,0.05))",
              border: "1px solid rgba(14,165,233,0.3)",
              borderRadius: "12px", padding: "18px 24px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              cursor: "pointer", transition: "border-color 0.15s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(14,165,233,0.6)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(14,165,233,0.3)"; }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--accent)", marginBottom: "3px" }}>Upgrade to Pro — $7.99/month</div>
                <div style={{ fontSize: "12px", color: "var(--text2)" }}>Unlock all 100+ drills, strength programs, nutrition plans, camera tracking and more.</div>
              </div>
              <span style={{ color: "var(--accent)", fontSize: "18px", marginLeft: "20px", flexShrink: 0 }}>→</span>
            </div>
          </Link>
        )}

        {/* Main 2-col */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>

          {/* Today's Plan */}
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
            <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: "10px", color: "var(--accent)", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "2px" }}>Today</p>
                <h2 style={{ fontSize: "15px", fontWeight: 800 }}>Training Plan</h2>
              </div>
              <span style={{ fontSize: "11px", color: "var(--text3)" }}>3 sessions</span>
            </div>
            <div style={{ padding: "8px" }}>
              {TODAY.map((t, i) => (
                <Link key={i} href={t.href}>
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 12px", borderRadius: "8px", cursor: "pointer",
                    marginBottom: "2px", transition: "background 0.15s",
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "var(--bg3)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "3px", height: "32px", background: t.color, borderRadius: "2px", flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: "10px", color: t.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "2px" }}>{t.category}</div>
                        <div style={{ fontSize: "13px", fontWeight: 700 }}>{t.title}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: "11px", color: "var(--text3)" }}>{t.duration}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Weekly Challenge */}
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px" }}>
            <p style={{ fontSize: "10px", color: "var(--accent)", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "4px" }}>Weekly Challenge</p>
            <h2 style={{ fontSize: "15px", fontWeight: 800, marginBottom: "20px" }}>Complete 5 drills this week</h2>

            {/* Progress dots */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
              {Array.from({ length: weekGoal }).map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: "8px", borderRadius: "4px",
                  background: i < weekProgress ? "var(--accent)" : "var(--bg3)",
                  transition: "background 0.3s",
                  boxShadow: i < weekProgress ? "0 0 8px rgba(14,165,233,0.4)" : "none",
                }} />
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "var(--text2)" }}>
                {weekComplete ? "Challenge complete! 🎉" : `${weekDrills} of ${weekGoal} done`}
              </span>
              <Link href="/drills">
                <button style={{
                  background: weekComplete ? "rgba(16,185,129,0.1)" : "var(--accent)",
                  color: weekComplete ? "#10B981" : "#fff",
                  border: weekComplete ? "1px solid rgba(16,185,129,0.3)" : "none",
                  padding: "7px 14px", borderRadius: "6px", fontSize: "12px",
                  fontWeight: 700, cursor: "pointer",
                }}>
                  {weekComplete ? "View drills" : "Train now →"}
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Streak + Quote */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>

          {/* Streak */}
          <div style={{
            background: streak ? "rgba(14,165,233,0.05)" : "var(--bg2)",
            border: `1px solid ${streak ? "rgba(14,165,233,0.2)" : "var(--border)"}`,
            borderRadius: "12px", padding: "24px",
          }}>
            <div style={{ fontSize: "10px", color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "12px" }}>Training Streak</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", marginBottom: "8px" }}>
              <div style={{ fontSize: "52px", fontWeight: 900, letterSpacing: "-3px", color: streak ? "var(--accent)" : "var(--text3)", lineHeight: 1 }}>
                {streak}
              </div>
              <div style={{ paddingBottom: "8px" }}>
                {streakBadge ? (
                  <span style={{
                    fontSize: "9px", fontWeight: 800, letterSpacing: "1px",
                    background: "rgba(14,165,233,0.15)", border: "1px solid rgba(14,165,233,0.3)",
                    borderRadius: "4px", padding: "2px 8px", color: "var(--accent)", display: "block",
                  }}>{streakBadge}</span>
                ) : (
                  <span style={{ fontSize: "13px", color: "var(--text3)" }}>days</span>
                )}
              </div>
            </div>
            <div style={{ fontSize: "13px", color: "var(--text2)", lineHeight: 1.5 }}>
              {streak ? `${streak} day${streak > 1 ? "s" : ""} in a row — keep it up` : "Start training to build your streak"}
            </div>
          </div>

          {/* Quote */}
          <div style={{
            background: "var(--bg2)", border: "1px solid var(--border)",
            borderRadius: "12px", padding: "24px",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
          }}>
            <div style={{ fontSize: "10px", color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", marginBottom: "16px" }}>Today&apos;s Mindset</div>
            <p style={{ fontSize: "14px", color: "var(--text2)", lineHeight: 1.7, fontStyle: "italic", flex: 1 }}>
              &ldquo;{quote}&rdquo;
            </p>
            <Link href="/badges" style={{ marginTop: "20px" }}>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 14px", background: "var(--bg3)", borderRadius: "8px",
                cursor: "pointer", border: "1px solid var(--border)", transition: "border-color 0.15s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)"; }}>
                <span style={{ fontSize: "13px", fontWeight: 700 }}>View Badges</span>
                <span style={{ color: "var(--accent)", fontSize: "14px" }}>→</span>
              </div>
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}
