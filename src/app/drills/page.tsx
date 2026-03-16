"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";

const FREE_LIMIT = 5;

const DRILLS = [
  { id: 1, title: "Two-Ball Dribbling", category: "Ball Handling", difficulty: "Beginner", xp: 50, duration: "10 min", youtube: "0M4xoLxMqUM", desc: "Build coordination and ambidextrous handles by dribbling two balls simultaneously.", tips: ["Keep your head up at all times", "Start slow, build speed over time", "Stay on your fingertips, not your palm"] },
  { id: 2, title: "Cone Weave", category: "Ball Handling", difficulty: "Beginner", xp: 50, duration: "8 min", youtube: "YbVYQnkH_Rw", desc: "Improve change-of-direction speed and low dribble control with cone weave patterns.", tips: ["Stay low in athletic stance", "Push the ball slightly ahead", "Accelerate explosively out of each cone"] },
  { id: 3, title: "Mikan Drill", category: "Finishing", difficulty: "Beginner", xp: 50, duration: "10 min", youtube: "yBIQjEQhBmw", desc: "Classic finishing drill that builds touch, footwork and ambidextrous layups around the basket.", tips: ["Use the backboard every time", "Soft touch off the glass", "Alternate sides without stopping"] },
  { id: 4, title: "Form Shooting", category: "Shooting", difficulty: "Beginner", xp: 60, duration: "15 min", youtube: "XgPbHBvqEyk", desc: "Master your shooting mechanics up close before extending range. Foundation of every great shooter.", tips: ["One hand, use BEEF technique", "Hold your follow through every rep", "Consistent release point is everything"] },
  { id: 5, title: "Figure 8 Dribble", category: "Ball Handling", difficulty: "Beginner", xp: 50, duration: "8 min", youtube: "5LGEiIXSN_w", desc: "Low dribble pattern through the legs building coordination and handle tightness.", tips: ["Keep dribbles low and tight to your legs", "Minimise bounces between switches", "Eyes up at all times"] },
  { id: 6, title: "3-Man Weave", category: "Passing", difficulty: "Intermediate", xp: 80, duration: "15 min", youtube: "asjIBCH4pAc", desc: "Classic team drill building passing precision, communication and transition speed.", tips: ["Call for the ball loudly", "Lead your teammate perfectly", "Sprint to the corner immediately after passing"] },
  { id: 7, title: "Crossover Series", category: "Ball Handling", difficulty: "Intermediate", xp: 80, duration: "12 min", youtube: "kEHMKXvH-KE", desc: "Full crossover progression — basic, between legs, behind back and spin move.", tips: ["Attack the defender/cone hard", "Keep dribble below knee", "Explosive first step out of the move"] },
  { id: 8, title: "Spot Shooting", category: "Shooting", difficulty: "Intermediate", xp: 80, duration: "20 min", youtube: "2vc4e4TkBqY", desc: "Catch and shoot from 5 spots on the floor. Game-realistic, 3 reps per spot.", tips: ["Ready stance before you catch", "Quick feet to set your base", "High release point on every shot"] },
  { id: 9, title: "Euro Step", category: "Finishing", difficulty: "Intermediate", xp: 80, duration: "10 min", youtube: "VTnkFEv-aBs", desc: "Two-step finishing move to beat shot blockers in the paint. Essential for guards.", tips: ["Long aggressive first step", "Gather before the second step", "Shield the ball with your body"] },
  { id: 10, title: "Zig-Zag Defense", category: "Defense", difficulty: "Intermediate", xp: 80, duration: "12 min", youtube: "HFkKW91XJMQ", desc: "Defensive footwork drill across the full court — slides, drops and retreat steps.", tips: ["Stay low the entire length", "Never cross your feet", "Touch the line fully each time"] },
  { id: 11, title: "Pull-Up Jumper", category: "Shooting", difficulty: "Intermediate", xp: 90, duration: "15 min", youtube: "7TiSHBBUKEQ", desc: "Dribble pull-up jump shot off 1 and 2 dribbles. Critical mid-range skill.", tips: ["Hard dribble into the pull-up", "Gather quickly, don't rush", "Balanced base at the jump"] },
  { id: 12, title: "Triple Threat Moves", category: "Ball Handling", difficulty: "Intermediate", xp: 80, duration: "12 min", youtube: "GxMpTmYlrCQ", desc: "From triple threat position — shot fake, jab step, live dribble and drive combos.", tips: ["Sell your shot fake", "Jab step hard to move the defender", "Read the defense before you act"] },
  { id: 13, title: "Off-Screen Shooting", category: "Shooting", difficulty: "Advanced", xp: 120, duration: "20 min", youtube: "WPn5SqSMhAw", desc: "Use a screen to create game-realistic shooting at full speed. Pop and curl reads.", tips: ["Brush the screen as tight as possible", "Pop or curl based on defender", "Shoot immediately at full pace"] },
  { id: 14, title: "Post Moves Series", category: "Finishing", difficulty: "Advanced", xp: 120, duration: "20 min", youtube: "KIlHpGQxafc", desc: "Drop step, up-and-under, baby hook and seal positioning. Complete post game.", tips: ["Seal with your hip and forearm", "Read the defender's position", "Go up strong through contact every time"] },
  { id: 15, title: "Ball Screen Actions", category: "Basketball IQ", difficulty: "Advanced", xp: 120, duration: "20 min", youtube: "FBbbUKAPDqQ", desc: "Reading ball screens — reject, turn corner, pull-up or lob. IQ-heavy drill.", tips: ["Read the hedge before you commit", "Reject tight hedges immediately", "Change pace to set up the read"] },
  { id: 16, title: "Shooting Off Dribble Handoff", category: "Shooting", difficulty: "Advanced", xp: 110, duration: "15 min", youtube: "2vc4e4TkBqY", desc: "DHO (dribble hand-off) shooting action — momentum shot coming off the exchange.", tips: ["Attack the hand-off aggressively", "Shoulder into the defender", "Ready to shoot before you receive it"] },
  { id: 17, title: "Close-out & Contest Drill", category: "Defense", difficulty: "Advanced", xp: 120, duration: "15 min", youtube: "HFkKW91XJMQ", desc: "Close out on shooters with high hand, then recover to on-ball defense.", tips: ["Sprint then chop steps on close-out", "High hand on the shooter", "Recover and stay in stance"] },
  { id: 18, title: "Floater Finish", category: "Finishing", difficulty: "Advanced", xp: 110, duration: "12 min", youtube: "VTnkFEv-aBs", desc: "Develop the floater over shot blockers in the paint. Left and right hand.", tips: ["One or two step gather", "Release high over the shot blocker", "Use the glass from angles"] },
  { id: 19, title: "Full Court Layup Speed Drill", category: "Finishing", difficulty: "Intermediate", xp: 90, duration: "10 min", youtube: "yBIQjEQhBmw", desc: "Full court speed layups alternating left and right. Conditioning and finishing combo.", tips: ["Push the pace on every rep", "Stay in control approaching the rim", "Alternate hands each repetition"] },
  { id: 20, title: "Stephen Curry Dribble Series", category: "Ball Handling", difficulty: "Advanced", xp: 130, duration: "20 min", youtube: "kEHMKXvH-KE", desc: "Advanced dribble combination series inspired by elite guard footwork and handle patterns.", tips: ["Speed is the goal — push your limits", "Stay low through all combinations", "Game speed or it doesn't count"] },
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
      setSubscribed((data as { is_subscribed?: boolean } | null)?.is_subscribed || false);
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

  const diffColor = (d: string) => d === "Beginner" ? "#00e676" : d === "Intermediate" ? "var(--accent)" : "#a855f7";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <nav style={{ background: "var(--bg2)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", height: "60px", position: "sticky", top: 0, zIndex: 50 }}>
        <Link href="/dashboard" style={{ fontSize: "18px", fontWeight: 900, letterSpacing: "-0.5px" }}>RZ<span style={{ color: "var(--accent)" }}>.</span></Link>
        <span style={{ fontWeight: 700, fontSize: "15px" }}>Basketball Drills</span>
        <Link href="/dashboard"><button style={{ background: "none", border: "1px solid var(--border)", color: "var(--text2)", padding: "6px 14px", borderRadius: "6px", fontSize: "13px" }}>← Back</button></Link>
      </nav>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 24px" }}>
        {!subscribed && (
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px 20px", marginBottom: "28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
            <div style={{ fontSize: "14px" }}>
              <span style={{ fontWeight: 700 }}>Free preview:</span>
              <span style={{ color: "var(--text2)", marginLeft: "6px" }}>5 of {DRILLS.length} drills unlocked. Upgrade for full access.</span>
            </div>
            <Link href="/subscribe"><button style={{ background: "var(--accent)", color: "#fff", padding: "7px 16px", borderRadius: "6px", fontSize: "13px", fontWeight: 700, whiteSpace: "nowrap" }}>Unlock All →</button></Link>
          </div>
        )}

        {lockedMsg && (
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "10px", padding: "14px 18px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "14px" }}>🔒 <Link href="/subscribe" style={{ color: "var(--accent)", fontWeight: 700 }}>Upgrade to Pro</Link> to unlock this drill.</span>
            <button onClick={() => setLockedMsg(false)} style={{ background: "none", color: "var(--text2)", fontSize: "16px" }}>×</button>
          </div>
        )}

        {/* Filters */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}>
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{
              padding: "7px 16px", borderRadius: "6px", fontSize: "13px", fontWeight: 600,
              background: filter === c ? "var(--accent)" : "var(--bg2)",
              border: `1px solid ${filter === c ? "var(--accent)" : "var(--border)"}`,
              color: filter === c ? "#fff" : "var(--text2)",
            }}>{c}</button>
          ))}
        </div>

        <div style={{ fontSize: "13px", color: "var(--text2)", marginBottom: "16px" }}>{filtered.length} drills</div>

        {/* Drills */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {filtered.map((drill) => {
            const globalIndex = DRILLS.indexOf(drill);
            const locked = !subscribed && globalIndex >= FREE_LIMIT;
            const isOpen = expanded === globalIndex;
            return (
              <div key={drill.id} onClick={() => handleDrillClick(globalIndex)} style={{
                background: "var(--bg2)", border: `1px solid ${isOpen ? "var(--accent)" : "var(--border)"}`,
                borderRadius: "10px", padding: "18px 20px", cursor: "pointer",
                opacity: locked ? 0.45 : 1, transition: "border-color 0.2s",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    {locked && <span style={{ fontSize: "14px" }}>🔒</span>}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "15px" }}>{drill.title}</div>
                      <div style={{ display: "flex", gap: "10px", marginTop: "5px", flexWrap: "wrap", alignItems: "center" }}>
                        <span style={{ fontSize: "12px", color: "var(--text2)" }}>{drill.category}</span>
                        <span style={{ fontSize: "11px", background: "var(--bg3)", padding: "2px 8px", borderRadius: "4px", color: diffColor(drill.difficulty), fontWeight: 600 }}>{drill.difficulty}</span>
                        <span style={{ fontSize: "12px", color: "var(--text3)" }}>{drill.duration}</span>
                        <span style={{ fontSize: "12px", color: "var(--accent)", fontWeight: 600 }}>+{drill.xp} XP</span>
                      </div>
                    </div>
                  </div>
                  <span style={{ color: "var(--text2)", fontSize: "18px", flexShrink: 0 }}>{isOpen ? "−" : "+"}</span>
                </div>
                {isOpen && (
                  <div style={{ marginTop: "18px", paddingTop: "18px", borderTop: "1px solid var(--border)" }}>
                    <p style={{ color: "var(--text2)", fontSize: "14px", lineHeight: 1.7, marginBottom: "16px" }}>{drill.desc}</p>
                    <div style={{ fontWeight: 700, fontSize: "13px", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Coaching Cues:</div>
                    {drill.tips.map((t, ti) => (
                      <div key={ti} style={{ display: "flex", gap: "8px", marginBottom: "7px", fontSize: "14px", color: "var(--text2)", alignItems: "flex-start" }}>
                        <span style={{ color: "var(--accent)", flexShrink: 0 }}>→</span> {t}
                      </div>
                    ))}
                    <div style={{ display: "flex", gap: "10px", marginTop: "18px", flexWrap: "wrap" }}>
                      <a href={`https://www.youtube.com/watch?v=${drill.youtube}`} target="_blank" rel="noopener noreferrer">
                        <button style={{ background: "#FF0000", color: "#fff", padding: "9px 18px", borderRadius: "6px", fontSize: "13px", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
                          ▶ Watch Tutorial on YouTube
                        </button>
                      </a>
                      <button style={{ background: "var(--accent)", color: "#fff", padding: "9px 18px", borderRadius: "6px", fontSize: "13px", fontWeight: 700 }}>
                        ✓ Mark Complete (+{drill.xp} XP)
                      </button>
                    </div>
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
