"use client";
import { useState } from "react";
import Link from "next/link";

const QUESTIONS = [
  { q: "What's your position?", options: ["Point Guard", "Shooting Guard", "Small Forward", "Power Forward", "Center"] },
  { q: "How long have you been playing?", options: ["Just starting out", "1-2 years", "3-5 years", "5+ years"] },
  { q: "What's your biggest weakness?", options: ["Ball handling", "Shooting", "Defense", "Athleticism", "Basketball IQ"] },
  { q: "What's your main goal?", options: ["Make the school team", "Improve my game", "Play college ball", "Go pro one day"] },
  { q: "How many days per week can you train?", options: ["2 days", "3 days", "4-5 days", "Every day"] },
];

export default function AssessmentPage() {
  const [answers, setAnswers] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState(false);

  function answer(option: string) {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);
    if (current < QUESTIONS.length - 1) {
      setCurrent(current + 1);
    } else {
      setDone(true);
    }
  }

  function reset() {
    setAnswers([]);
    setCurrent(0);
    setDone(false);
  }

  const drillRecs: Record<string, string[]> = {
    "Ball handling": ["Two-Ball Dribbling", "Cone Weave", "Figure 8 Dribble", "Crossover Series"],
    "Shooting": ["Form Shooting", "Catch & Shoot Spot Work", "Off-Screen Shooting"],
    "Defense": ["Zig-Zag Defense", "5-10-5 Pro Agility", "Lateral Shuffle Cone Drill"],
    "Athleticism": ["Box Jumps", "Resisted Sprints", "Bulgarian Split Squat"],
    "Basketball IQ": ["3-Man Weave", "Post Moves Series", "Off-Screen Shooting"],
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <nav style={{ background: "var(--bg2)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", height: "64px" }}>
        <Link href="/dashboard" style={{ fontSize: "20px", fontWeight: 900, letterSpacing: "-1px" }}>RZ<span style={{ color: "var(--accent)" }}>.</span></Link>
        <span style={{ fontWeight: 700 }}>🎯 Skill Assessment</span>
        <Link href="/dashboard"><button style={{ background: "none", border: "1px solid var(--border)", color: "var(--text2)", padding: "6px 16px", borderRadius: "8px", fontSize: "13px" }}>← Dashboard</button></Link>
      </nav>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "60px 24px" }}>
        {!done ? (
          <>
            {/* Progress */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "13px", color: "var(--text2)" }}>
              <span>Question {current + 1} of {QUESTIONS.length}</span>
              <span>{Math.round(((current) / QUESTIONS.length) * 100)}% complete</span>
            </div>
            <div style={{ background: "var(--bg3)", borderRadius: "100px", height: "6px", marginBottom: "48px" }}>
              <div style={{ background: "var(--accent)", height: "100%", borderRadius: "100px", width: `${(current / QUESTIONS.length) * 100}%`, transition: "width 0.3s" }} />
            </div>

            <h2 style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "-1px", marginBottom: "32px" }}>{QUESTIONS[current].q}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {QUESTIONS[current].options.map((opt) => (
                <button key={opt} onClick={() => answer(opt)} style={{
                  background: "var(--bg2)", border: "1px solid var(--border)",
                  color: "var(--text)", padding: "16px 24px", borderRadius: "12px",
                  fontSize: "16px", fontWeight: 600, textAlign: "left", transition: "border-color 0.2s, background 0.2s",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)"; (e.currentTarget as HTMLButtonElement).style.background = "var(--bg3)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLButtonElement).style.background = "var(--bg2)"; }}>
                  {opt}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎯</div>
              <h2 style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "-1px", marginBottom: "8px" }}>Your personalised plan is ready</h2>
              <p style={{ color: "var(--text2)" }}>Based on your answers, here's exactly what to focus on.</p>
            </div>

            <div style={{ background: "var(--bg2)", border: "1px solid var(--accent)", borderRadius: "16px", padding: "28px", marginBottom: "24px" }}>
              <div style={{ fontWeight: 800, fontSize: "18px", marginBottom: "16px" }}>Your Profile</div>
              {QUESTIONS.map((q, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < QUESTIONS.length - 1 ? "1px solid var(--border)" : "none", fontSize: "14px" }}>
                  <span style={{ color: "var(--text2)" }}>{q.q}</span>
                  <span style={{ fontWeight: 600, color: "var(--accent)" }}>{answers[i]}</span>
                </div>
              ))}
            </div>

            <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "16px", padding: "28px", marginBottom: "24px" }}>
              <div style={{ fontWeight: 800, fontSize: "18px", marginBottom: "16px" }}>Recommended Drills for You</div>
              {(drillRecs[answers[2]] || drillRecs["Ball handling"]).map((drill, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)", fontSize: "15px" }}>
                  <span style={{ color: "var(--accent)" }}>→</span>
                  <span>{drill}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <Link href="/drills" style={{ flex: 1 }}>
                <button style={{ width: "100%", background: "var(--accent)", color: "#fff", padding: "14px", borderRadius: "10px", fontSize: "15px", fontWeight: 800 }}>
                  Start Training →
                </button>
              </Link>
              <button onClick={reset} style={{ flex: 1, background: "var(--bg2)", border: "1px solid var(--border)", color: "var(--text)", padding: "14px", borderRadius: "10px", fontSize: "15px", fontWeight: 600 }}>
                Retake Quiz
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
