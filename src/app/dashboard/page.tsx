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

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

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
    const supabase = getSupabase();
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "var(--text2)" }}>Loading...</div>
    </div>
  );

  const xpToNext = 1000;
  const xpProgress = ((profile?.xp || 0) % xpToNext) / xpToNext * 100;
  const level = Math.floor((profile?.xp || 0) / xpToNext) + 1;

  const navItems = [
    { href: "/drills", icon: "🏀", label: "Drills" },
    { href: "/strength", icon: "🏋️", label: "Strength" },
    { href: "/nutrition", icon: "🥗", label: "Nutrition" },
    { href: "/schedule", icon: "📅", label: "Schedule" },
    { href: "/assessment", icon: "🎯", label: "Assessment" },
    { href: "/stats", icon: "📊", label: "My Stats" },
    { href: "/badges", icon: "🏆", label: "Badges" },
    { href: "/subscribe", icon: "⚡", label: "Go Pro" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      {/* NAV */}
      <nav style={{ background: "var(--bg2)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", height: "64px" }}>
        <div style={{ fontSize: "20px", fontWeight: 900, letterSpacing: "-1px" }}>RZ<span style={{ color: "var(--accent)" }}>.</span></div>
        <div style={{ display: "flex", gap: "8px" }}>
          {navItems.slice(0, 5).map(n => (
            <Link key={n.href} href={n.href}>
              <button style={{ background: "none", color: "var(--text2)", fontSize: "13px", padding: "6px 12px", borderRadius: "8px", border: "1px solid transparent" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--bg3)"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "none"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text2)"; }}>
                {n.icon} {n.label}
              </button>
            </Link>
          ))}
        </div>
        <button onClick={handleLogout} style={{ background: "none", color: "var(--text2)", fontSize: "13px", padding: "6px 14px", border: "1px solid var(--border)", borderRadius: "8px" }}>
          Log out
        </button>
      </nav>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-1px" }}>
            Welcome back, <span style={{ color: "var(--accent)" }}>{profile?.username}</span> 👋
          </h1>
          <p style={{ color: "var(--text2)", marginTop: "8px" }}>Keep the momentum going. Every session counts.</p>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "40px" }}>
          {[
            { label: "Level", value: level, icon: "⚡", accent: true },
            { label: "Total XP", value: (profile?.xp || 0).toLocaleString(), icon: "🔥", accent: false },
            { label: "Day Streak", value: profile?.streak || 0, icon: "📅", accent: false },
            { label: "Drills Done", value: profile?.drills_completed || 0, icon: "✅", accent: false },
          ].map((s, i) => (
            <div key={i} style={{ background: "var(--bg2)", border: `1px solid ${s.accent ? "var(--accent)" : "var(--border)"}`, borderRadius: "16px", padding: "24px" }}>
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>{s.icon}</div>
              <div style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "-1px", color: s.accent ? "var(--accent)" : "var(--text)" }}>{s.value}</div>
              <div style={{ fontSize: "13px", color: "var(--text2)", marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* XP Progress */}
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", marginBottom: "40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ fontWeight: 700 }}>Level {level} Progress</span>
            <span style={{ color: "var(--text2)", fontSize: "14px" }}>{(profile?.xp || 0) % xpToNext} / {xpToNext} XP</span>
          </div>
          <div style={{ background: "var(--bg3)", borderRadius: "100px", height: "10px" }}>
            <div style={{ background: "linear-gradient(90deg, var(--accent), var(--accent2))", height: "100%", borderRadius: "100px", width: `${xpProgress}%`, transition: "width 1s ease" }} />
          </div>
          <p style={{ color: "var(--text2)", fontSize: "13px", marginTop: "8px" }}>{xpToNext - ((profile?.xp || 0) % xpToNext)} XP until Level {level + 1}</p>
        </div>

        {/* Quick links */}
        <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "20px", letterSpacing: "-0.5px" }}>Quick Access</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          {navItems.map((n, i) => (
            <Link key={i} href={n.href}>
              <div style={{
                background: n.label === "Go Pro" ? "linear-gradient(135deg, #0EA5E9, #38BDF8)" : "var(--bg2)",
                border: `1px solid ${n.label === "Go Pro" ? "transparent" : "var(--border)"}`,
                borderRadius: "16px", padding: "24px 20px", cursor: "pointer",
                transition: "transform 0.2s, border-color 0.2s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}>
                <div style={{ fontSize: "28px", marginBottom: "10px" }}>{n.icon}</div>
                <div style={{ fontWeight: 700, fontSize: "16px" }}>{n.label}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pro banner */}
        {!profile?.is_subscribed && (
          <div style={{ marginTop: "40px", background: "var(--bg2)", border: "1px solid var(--accent)", borderRadius: "16px", padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: "18px", marginBottom: "6px" }}>⚡ Unlock everything for $8.99/month</div>
              <div style={{ color: "var(--text2)", fontSize: "14px" }}>100+ drills, full gym programs, nutrition plans and weekly schedules.</div>
            </div>
            <Link href="/subscribe">
              <button style={{ background: "var(--accent)", color: "#fff", padding: "12px 28px", borderRadius: "10px", fontSize: "15px", fontWeight: 800 }}>
                Go Pro →
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
