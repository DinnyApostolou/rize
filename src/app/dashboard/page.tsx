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
  { href: "/camera", label: "📷 Camera" },
  { href: "/schedule", label: "Schedule" },
  { href: "/assessment", label: "Assessment" },
  { href: "/stats", label: "My Stats" },
  { href: "/badges", label: "Badges" },
  { href: "/subscribe", label: "Upgrade" },
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
      <div style={{ color: "var(--text2)", fontSize: "14px" }}>Loading...</div>
    </div>
  );

  const xp = profile?.xp || 0;
  const level = Math.floor(xp / 1000) + 1;
  const xpProgress = (xp % 1000) / 1000 * 100;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", display: "flex", flexDirection: "column" }}>
      {/* TOP NAV */}
      <nav style={{ background: "var(--bg2)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", height: "60px", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
          <div style={{ fontSize: "18px", fontWeight: 900, letterSpacing: "-0.5px" }}>RZ<span style={{ color: "var(--accent)" }}>.</span></div>
          <div style={{ display: "flex", gap: "4px" }}>
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
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {!profile?.is_subscribed && (
            <Link href="/subscribe">
              <button style={{ background: "var(--accent)", color: "#fff", fontSize: "12px", fontWeight: 700, padding: "6px 14px", borderRadius: "6px", letterSpacing: "0.3px" }}>
                UPGRADE TO PRO
              </button>
            </Link>
          )}
          <button onClick={handleLogout} style={{ background: "none", color: "var(--text2)", fontSize: "13px", padding: "6px 12px", border: "1px solid var(--border)", borderRadius: "6px" }}>
            Sign out
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 40px", width: "100%" }}>
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <p style={{ color: "var(--text2)", fontSize: "13px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "8px" }}>Dashboard</p>
          <h1 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.5px" }}>
            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}, {profile?.username}
          </h1>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "40px" }}>
          {[
            { label: "Level", value: level, sub: `${xp.toLocaleString()} XP total` },
            { label: "Day Streak", value: profile?.streak || 0, sub: "days in a row" },
            { label: "Drills Done", value: profile?.drills_completed || 0, sub: "total completed" },
            { label: "XP to Next", value: 1000 - (xp % 1000), sub: "until level " + (level + 1) },
          ].map((s, i) => (
            <div key={i} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px" }}>
              <div style={{ fontSize: "11px", color: "var(--text2)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>{s.label}</div>
              <div style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-1px", color: i === 0 ? "var(--accent)" : "var(--text)" }}>{s.value}</div>
              <div style={{ fontSize: "12px", color: "var(--text3)", marginTop: "4px" }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* XP Bar */}
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px 24px", marginBottom: "40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "13px" }}>
            <span style={{ fontWeight: 600 }}>Level {level} → Level {level + 1}</span>
            <span style={{ color: "var(--text2)" }}>{xp % 1000} / 1000 XP</span>
          </div>
          <div style={{ background: "var(--bg3)", borderRadius: "4px", height: "6px" }}>
            <div style={{ background: "var(--accent)", height: "100%", borderRadius: "4px", width: `${xpProgress}%`, transition: "width 1s ease" }} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {/* Today's Plan */}
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px" }}>
            <div style={{ fontSize: "11px", color: "var(--text2)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px" }}>Today&apos;s Plan</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {TODAY.map((t, i) => (
                <Link key={i} href={"/" + t.type}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "var(--bg3)", borderRadius: "8px", cursor: "pointer", transition: "border-color 0.2s", border: "1px solid transparent" }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)"}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = "transparent"}>
                    <div>
                      <div style={{ fontSize: "11px", color: "var(--accent)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>{t.category}</div>
                      <div style={{ fontSize: "15px", fontWeight: 600 }}>{t.title}</div>
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text2)" }}>{t.duration}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Access */}
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px" }}>
            <div style={{ fontSize: "11px", color: "var(--text2)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px" }}>Quick Access</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {NAV.map((n, i) => (
                <Link key={i} href={n.href}>
                  <div style={{ padding: "12px 16px", background: "var(--bg3)", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer", border: "1px solid transparent", transition: "border-color 0.2s, color 0.2s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent)"; (e.currentTarget as HTMLDivElement).style.color = "var(--accent)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "transparent"; (e.currentTarget as HTMLDivElement).style.color = "var(--text)"; }}>
                    {n.label}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
