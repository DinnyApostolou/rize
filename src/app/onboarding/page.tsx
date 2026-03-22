"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const POSITIONS = ["Point Guard (PG)", "Shooting Guard (SG)", "Small Forward (SF)", "Power Forward (PF)", "Center (C)"];
const SKILL_LEVELS = [
  { label: "Beginner", desc: "Just getting started with basketball" },
  { label: "Intermediate", desc: "Played recreationally, want to level up" },
  { label: "Advanced", desc: "Serious player, compete regularly" },
  { label: "Elite", desc: "High school varsity / college level" },
];
const GOALS = ["Improve ball handling", "Increase shooting accuracy", "Get faster & more athletic", "Build strength & power", "Learn better basketball IQ", "Improve defense", "Increase my vertical", "Make the team"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [position, setPosition] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [displayName, setDisplayName] = useState("");

  function toggleGoal(g: string) {
    setGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : prev.length < 3 ? [...prev, g] : prev);
  }

  function finish() {
    localStorage.setItem("rize_position", position);
    localStorage.setItem("rize_skill_level", skillLevel);
    localStorage.setItem("rize_goals", JSON.stringify(goals));
    localStorage.setItem("rize_display_name", displayName);
    localStorage.setItem("rize_onboarded", "true");
    router.push("/dashboard");
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>
        {/* Logo */}
        <div style={{ fontSize: "20px", fontWeight: 900, marginBottom: "40px", letterSpacing: "-0.5px" }}>
          RIZE<span style={{ color: "var(--accent)" }}>.</span>
        </div>

        {/* Progress */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "32px" }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ flex: 1, height: "3px", borderRadius: "2px", background: i <= step ? "var(--accent)" : "var(--bg3)", transition: "background 0.3s" }} />
          ))}
        </div>

        {step === 1 && (
          <div>
            <p style={{ fontSize: "12px", color: "var(--accent)", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Step 1 of 4</p>
            <h1 style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "-1px", marginBottom: "8px" }}>What do you go by?</h1>
            <p style={{ color: "var(--text2)", fontSize: "14px", marginBottom: "28px" }}>We&apos;ll use this to personalise your experience.</p>
            <input
              type="text"
              placeholder="Your name or nickname..."
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              style={{ width: "100%", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "10px", padding: "14px 16px", fontSize: "16px", color: "var(--text)", marginBottom: "20px" }}
              autoFocus
            />
            <button onClick={() => setStep(2)} disabled={!displayName.trim()} style={{ width: "100%", background: displayName.trim() ? "var(--accent)" : "var(--bg3)", color: displayName.trim() ? "#fff" : "var(--text3)", padding: "14px", borderRadius: "10px", fontSize: "15px", fontWeight: 700, cursor: displayName.trim() ? "pointer" : "default" }}>
              Continue →
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <p style={{ fontSize: "12px", color: "var(--accent)", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Step 2 of 4</p>
            <h1 style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "-1px", marginBottom: "8px" }}>What&apos;s your position?</h1>
            <p style={{ color: "var(--text2)", fontSize: "14px", marginBottom: "28px" }}>We&apos;ll tailor your drills and programs to your role.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
              {POSITIONS.map(p => (
                <button key={p} onClick={() => setPosition(p)} style={{
                  padding: "14px 16px", borderRadius: "10px", textAlign: "left",
                  background: position === p ? "rgba(14,165,233,0.1)" : "var(--bg2)",
                  border: `1px solid ${position === p ? "var(--accent)" : "var(--border)"}`,
                  color: position === p ? "var(--accent)" : "var(--text)", fontSize: "15px", fontWeight: 600, cursor: "pointer",
                }}>
                  {p}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, background: "var(--bg2)", border: "1px solid var(--border)", color: "var(--text2)", padding: "14px", borderRadius: "10px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>← Back</button>
              <button onClick={() => setStep(3)} disabled={!position} style={{ flex: 2, background: position ? "var(--accent)" : "var(--bg3)", color: position ? "#fff" : "var(--text3)", padding: "14px", borderRadius: "10px", fontSize: "15px", fontWeight: 700, cursor: position ? "pointer" : "default" }}>Continue →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <p style={{ fontSize: "12px", color: "var(--accent)", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Step 3 of 4</p>
            <h1 style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "-1px", marginBottom: "8px" }}>Your skill level?</h1>
            <p style={{ color: "var(--text2)", fontSize: "14px", marginBottom: "28px" }}>Be honest — we&apos;ll set the right intensity for you.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
              {SKILL_LEVELS.map(s => (
                <button key={s.label} onClick={() => setSkillLevel(s.label)} style={{
                  padding: "14px 16px", borderRadius: "10px", textAlign: "left",
                  background: skillLevel === s.label ? "rgba(14,165,233,0.1)" : "var(--bg2)",
                  border: `1px solid ${skillLevel === s.label ? "var(--accent)" : "var(--border)"}`,
                  cursor: "pointer",
                }}>
                  <div style={{ color: skillLevel === s.label ? "var(--accent)" : "var(--text)", fontSize: "15px", fontWeight: 700, marginBottom: "2px" }}>{s.label}</div>
                  <div style={{ color: "var(--text2)", fontSize: "13px" }}>{s.desc}</div>
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => setStep(2)} style={{ flex: 1, background: "var(--bg2)", border: "1px solid var(--border)", color: "var(--text2)", padding: "14px", borderRadius: "10px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>← Back</button>
              <button onClick={() => setStep(4)} disabled={!skillLevel} style={{ flex: 2, background: skillLevel ? "var(--accent)" : "var(--bg3)", color: skillLevel ? "#fff" : "var(--text3)", padding: "14px", borderRadius: "10px", fontSize: "15px", fontWeight: 700, cursor: skillLevel ? "pointer" : "default" }}>Continue →</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <p style={{ fontSize: "12px", color: "var(--accent)", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Step 4 of 4</p>
            <h1 style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "-1px", marginBottom: "8px" }}>What are your goals?</h1>
            <p style={{ color: "var(--text2)", fontSize: "14px", marginBottom: "28px" }}>Pick up to 3 — we&apos;ll focus your training around them.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "20px" }}>
              {GOALS.map(g => (
                <button key={g} onClick={() => toggleGoal(g)} style={{
                  padding: "12px 14px", borderRadius: "10px", textAlign: "left",
                  background: goals.includes(g) ? "rgba(14,165,233,0.1)" : "var(--bg2)",
                  border: `1px solid ${goals.includes(g) ? "var(--accent)" : "var(--border)"}`,
                  color: goals.includes(g) ? "var(--accent)" : "var(--text2)",
                  fontSize: "13px", fontWeight: 600, cursor: "pointer", lineHeight: 1.3,
                }}>
                  {goals.includes(g) && <span style={{ marginRight: "4px" }}>✓ </span>}
                  {g}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => setStep(3)} style={{ flex: 1, background: "var(--bg2)", border: "1px solid var(--border)", color: "var(--text2)", padding: "14px", borderRadius: "10px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>← Back</button>
              <button onClick={finish} disabled={goals.length === 0} style={{ flex: 2, background: goals.length > 0 ? "var(--accent)" : "var(--bg3)", color: goals.length > 0 ? "#fff" : "var(--text3)", padding: "14px", borderRadius: "10px", fontSize: "15px", fontWeight: 700, cursor: goals.length > 0 ? "pointer" : "default" }}>
                Let&apos;s go, {displayName} →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
