"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";

export default function StatsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<{ username: string; xp: number; streak: number; drills_completed: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = getSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(data || { username: "Athlete", xp: 0, streak: 0, drills_completed: 0 });
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) return <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "var(--text2)" }}>Loading...</span></div>;

  const xp = profile?.xp || 0;
  const streak = profile?.streak || 0;
  const drills = profile?.drills_completed || 0;
  const level = Math.floor(xp / 1000) + 1;

  const attrs = [
    { name: "Ball Handling", value: Math.min(99, 40 + drills * 3), color: "#0066FF" },
    { name: "Shooting", value: Math.min(99, 35 + drills * 2), color: "#0099FF" },
    { name: "Consistency", value: Math.min(99, 30 + streak * 5), color: "#ffd700" },
    { name: "Athleticism", value: Math.min(99, 45 + Math.floor(xp / 100)), color: "#00e676" },
    { name: "Defense", value: Math.min(99, 38 + drills * 2), color: "#00bcd4" },
    { name: "Basketball IQ", value: Math.min(99, 42 + level * 3), color: "#a855f7" },
  ];

  const overall = Math.round(attrs.reduce((sum, a) => sum + a.value, 0) / attrs.length);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <nav style={{ background: "var(--bg2)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", height: "64px" }}>
        <Link href="/dashboard" style={{ fontSize: "20px", fontWeight: 900, letterSpacing: "-1px" }}>RZ<span style={{ color: "var(--accent)" }}>.</span></Link>
        <span style={{ fontWeight: 700 }}>📊 My Stats</span>
        <Link href="/dashboard"><button style={{ background: "none", border: "1px solid var(--border)", color: "var(--text2)", padding: "6px 16px", borderRadius: "8px", fontSize: "13px" }}>← Dashboard</button></Link>
      </nav>

      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-1px", marginBottom: "32px" }}>Athlete Card</h1>

        {/* Player card */}
        <div style={{ background: "linear-gradient(135deg, #1a0800, #0a0a0a)", border: "1px solid var(--accent)", borderRadius: "24px", padding: "40px", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
            <div>
              <div style={{ fontSize: "14px", color: "var(--text2)", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase" }}>Rize Athlete</div>
              <div style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-1px", marginTop: "4px" }}>{profile?.username}</div>
              <div style={{ fontSize: "14px", color: "var(--text2)", marginTop: "4px" }}>Level {level} · {xp.toLocaleString()} XP</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "72px", fontWeight: 900, letterSpacing: "-3px", color: "var(--accent)", lineHeight: 1 }}>{overall}</div>
              <div style={{ fontSize: "13px", color: "var(--text2)", fontWeight: 600 }}>OVR</div>
            </div>
          </div>

          {/* Attributes */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {attrs.map((a) => (
              <div key={a.name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "14px" }}>
                  <span style={{ color: "var(--text2)" }}>{a.name}</span>
                  <span style={{ fontWeight: 800, color: a.color }}>{a.value}</span>
                </div>
                <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: "100px", height: "8px" }}>
                  <div style={{ background: a.color, height: "100%", borderRadius: "100px", width: `${a.value}%`, transition: "width 1s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <p style={{ color: "var(--text2)", fontSize: "14px", textAlign: "center" }}>
          Stats improve as you complete drills, maintain your streak and earn XP.{" "}
          <Link href="/drills" style={{ color: "var(--accent)", fontWeight: 700 }}>Start training →</Link>
        </p>
      </div>
    </div>
  );
}
