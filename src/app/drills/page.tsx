"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";

const FREE_LIMIT = 5;

const DRILLS = [
  { id: 1, title: "Two-Ball Dribbling", category: "Ball Handling", difficulty: "Beginner", xp: 50, duration: "10 min", desc: "Build coordination and ambidextrous handles by dribbling two balls simultaneously.", tips: ["Keep your head up", "Start slow, build speed", "Stay on your fingertips"] },
  { id: 2, title: "Cone Weave", category: "Ball Handling", difficulty: "Beginner", xp: 50, duration: "8 min", desc: "Improve change-of-direction speed and low dribble control.", tips: ["Stay low in athletic stance", "Push the ball ahead slightly", "Accelerate out of each cone"] },
  { id: 3, title: "Mikan Drill", category: "Finishing", difficulty: "Beginner", xp: 50, duration: "10 min", desc: "Classic finishing drill that builds touch, footwork and ambidextrous layups.", tips: ["Use the backboard", "Soft touch off the glass", "Alternate sides each rep"] },
  { id: 4, title: "Form Shooting", category: "Shooting", difficulty: "Beginner", xp: 60, duration: "15 min", desc: "Master your shooting mechanics close to the basket before extending range.", tips: ["One hand, BEEF technique", "Hold your follow through", "Consistent release point"] },
  { id: 5, title: "Figure 8 Dribble", category: "Ball Handling", difficulty: "Beginner", xp: 50, duration: "8 min", desc: "Low dribble pattern through the legs building coordination and handle tightness.", tips: ["Low and tight to your legs", "Minimise bounces between switches", "Eyes up at all times"] },
  { id: 6, title: "3-Man Weave", category: "Passing", difficulty: "Intermediate", xp: 80, duration: "15 min", desc: "Classic team drill building passing precision, communication and transition speed.", tips: ["Call for the ball", "Lead your teammate", "Sprint to the corner after passing"] },
  { id: 7, title: "Crossover Series", category: "Ball Handling", difficulty: "Intermediate", xp: 80, duration: "12 min", desc: "Full crossover move progression — basic, between legs, behind back and spin.", tips: ["Attack the cones/defender", "Keep dribble below knee", "Explosive first step after move"] },
  { id: 8, title: "Catch & Shoot (Spot Shooting)", category: "Shooting", difficulty: "Intermediate", xp: 80, duration: "20 min", desc: "Game-realistic shooting from 5 spots on the floor with 3 reps per spot.", tips: ["Ready stance before catch", "Quick feet to set", "High release every shot"] },
  { id: 9, title: "Euro Step", category: "Finishing", difficulty: "Intermediate", xp: 80, duration: "10 min", desc: "Two-step finishing move to beat shot blockers in the paint.", tips: ["Long first step", "Gather before second step", "Shield the ball with body"] },
  { id: 10, title: "Zig-Zag Defense", category: "Defense", difficulty: "Intermediate", xp: 80, duration: "12 min", desc: "Defensive footwork drill across the full court — slides, drops and retreats.", tips: ["Stay low all the way", "Don't cross your feet", "Touch the line each time"] },
  { id: 11, title: "Off-Screen Shooting", category: "Shooting", difficulty: "Advanced", xp: 120, duration: "20 min", desc: "Use a screen to create game-realistic shooting opportunities at full speed.", tips: ["Brush the screen tight", "Pop or curl based on read", "Shoot at full pace"] },
  { id: 12, title: "Post Moves Series", category: "Finishing", difficulty: "Advanced", xp: 120, duration: "20 min", desc: "Complete post game — drop step, up-and-under, baby hook and seal positioning.", tips: ["Seal with your hip and arm", "Read the defender", "Go up strong through contact"] },
];

export default function DrillsPage() {
  const router = useRouter();
  const [subscribed, setSubscribed] = useState(false);
  const [filter, setFilter] = useState("All");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [lockedMsg, setLockedMsg] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = getSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setSubscribed((data as any)?.is_subscribed || false);
    }
    load();
  }, [router]);

  const categories = ["All", ...Array.from(new Set(DRILLS.map(d => d.category)))];
  const filtered = filter === "All" ? DRILLS : DRILLS.filter(d => d.category === filter);

  function handleDrillClick(index: number) {
    if (!subscribed && index >= FREE_LIMIT) { setLockedMsg(true); return; }
    setExpanded(expanded === index ? null : index);
    setLockedMsg(false);
  }

  const diffColor = (d: string) => d === "Beginner" ? "#00e676" : d === "Intermediate" ? "#ff8c00" : "#ff4d00";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <nav style={{ background: "var(--bg2)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", height: "64px" }}>
        <Link href="/dashboard" style={{ fontSize: "20px", fontWeight: 900, letterSpacing: "-1px" }}>RZ<span style={{ color: "var(--accent)" }}>.</span></Link>
        <span style={{ fontWeight: 700, fontSize: "16px" }}>🏀 Basketball Drills</span>
        <Link href="/dashboard"><button style={{ background: "none", border: "1px solid var(--border)", color: "var(--text2)", padding: "6px 16px", borderRadius: "8px", fontSize: "13px" }}>← Dashboard</button></Link>
      </nav>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}>
        {!subscribed && (
          <div style={{ background: "linear-gradient(135deg, #1a0a00, #2a1000)", border: "1px solid var(--accent)", borderRadius: "16px", padding: "20px 24px", marginBottom: "32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <span style={{ fontWeight: 700 }}>⚡ Free preview — 5 of {DRILLS.length} drills unlocked.</span>
              <span style={{ color: "var(--text2)", fontSize: "14px", marginLeft: "8px" }}>Go Pro for full access.</span>
            </div>
            <Link href="/subscribe"><button style={{ background: "var(--accent)", color: "#fff", padding: "8px 20px", borderRadius: "8px", fontSize: "14px", fontWeight: 700 }}>Unlock All →</button></Link>
          </div>
        )}

        {lockedMsg && (
          <div style={{ background: "var(--bg2)", border: "1px solid var(--accent)", borderRadius: "12px", padding: "16px 20px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>🔒 This drill is locked. <Link href="/subscribe" style={{ color: "var(--accent)", fontWeight: 700 }}>Go Pro for $8.99/month →</Link></span>
            <button onClick={() => setLockedMsg(false)} style={{ background: "none", color: "var(--text2)", fontSize: "18px" }}>×</button>
          </div>
        )}

        {/* Filters */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "32px" }}>
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{
              padding: "8px 18px", borderRadius: "100px", fontSize: "13px", fontWeight: 600,
              background: filter === c ? "var(--accent)" : "var(--bg2)",
              border: `1px solid ${filter === c ? "var(--accent)" : "var(--border)"}`,
              color: filter === c ? "#fff" : "var(--text2)",
            }}>{c}</button>
          ))}
        </div>

        {/* Drills */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filtered.map((drill, i) => {
            const globalIndex = DRILLS.indexOf(drill);
            const locked = !subscribed && globalIndex >= FREE_LIMIT;
            const isOpen = expanded === globalIndex;
            return (
              <div key={drill.id} onClick={() => handleDrillClick(globalIndex)} style={{
                background: "var(--bg2)", border: `1px solid ${isOpen ? "var(--accent)" : "var(--border)"}`,
                borderRadius: "16px", padding: "20px 24px", cursor: "pointer",
                opacity: locked ? 0.5 : 1, transition: "border-color 0.2s",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <span style={{ fontSize: "20px" }}>{locked ? "🔒" : "🏀"}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "16px" }}>{drill.title}</div>
                      <div style={{ display: "flex", gap: "8px", marginTop: "4px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "12px", color: "var(--text2)" }}>{drill.category}</span>
                        <span style={{ fontSize: "12px", color: diffColor(drill.difficulty), fontWeight: 600 }}>{drill.difficulty}</span>
                        <span style={{ fontSize: "12px", color: "var(--text3)" }}>⏱ {drill.duration}</span>
                        <span style={{ fontSize: "12px", color: "#ff8c00" }}>+{drill.xp} XP</span>
                      </div>
                    </div>
                  </div>
                  <span style={{ color: "var(--text2)", fontSize: "20px" }}>{isOpen ? "−" : "+"}</span>
                </div>
                {isOpen && (
                  <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid var(--border)" }}>
                    <p style={{ color: "var(--text2)", fontSize: "15px", lineHeight: 1.7, marginBottom: "16px" }}>{drill.desc}</p>
                    <div style={{ fontWeight: 700, marginBottom: "10px" }}>Pro Tips:</div>
                    {drill.tips.map((t, ti) => (
                      <div key={ti} style={{ display: "flex", gap: "8px", marginBottom: "8px", fontSize: "14px", color: "var(--text2)" }}>
                        <span style={{ color: "var(--accent)" }}>→</span> {t}
                      </div>
                    ))}
                    <button style={{ marginTop: "16px", background: "var(--accent)", color: "#fff", padding: "10px 24px", borderRadius: "8px", fontSize: "14px", fontWeight: 700 }}>
                      ✅ Mark Complete (+{drill.xp} XP)
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
