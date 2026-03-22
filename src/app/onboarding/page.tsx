"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const POSITIONS = ["Point Guard (PG)", "Shooting Guard (SG)", "Small Forward (SF)", "Power Forward (PF)", "Center (C)"];
const SKILL_LEVELS = [
  { label: "Beginner", desc: "Just getting started with basketball", icon: "🌱" },
  { label: "Intermediate", desc: "Played recreationally, want to level up", icon: "📈" },
  { label: "Advanced", desc: "Serious player, compete regularly", icon: "⚡" },
  { label: "Elite", desc: "High school varsity / college level", icon: "👑" },
];
const GOALS = ["Improve ball handling", "Increase shooting accuracy", "Get faster & more athletic", "Build strength & power", "Better basketball IQ", "Improve defense", "Increase my vertical", "Make the team"];

const STEP_COLORS = ["#0074FF", "#8B5CF6", "#10B981", "#F59E0B"];

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

  const color = STEP_COLORS[step - 1];
  const progress = (step / 4) * 100;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", display: "flex", flexDirection: "column" }}>

      {/* Fixed progress bar at top */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "3px", background: "var(--bg3)", zIndex: 100 }}>
        <div style={{ height: "100%", width: `${progress}%`, background: color, transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)", boxShadow: `0 0 8px ${color}` }} />
      </div>

      {/* Background glow */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)", width: "600px", height: "400px", borderRadius: "50%", background: `radial-gradient(ellipse, ${color}18 0%, transparent 70%)`, filter: "blur(60px)", transition: "background 0.5s ease" }} />
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 24px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ width: "100%", maxWidth: "500px" }}>

          {/* Logo */}
          <div style={{ fontSize: "18px", fontWeight: 900, letterSpacing: "-0.5px", marginBottom: "48px", textAlign: "center" }}>
            RIZE<span style={{ color: "var(--accent)" }}>.</span>
          </div>

          {/* Step pills */}
          <div style={{ display: "flex", gap: "6px", marginBottom: "40px", justifyContent: "center" }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{
                height: "4px", width: i <= step ? "32px" : "20px",
                borderRadius: "2px",
                background: i <= step ? STEP_COLORS[i-1] : "var(--bg3)",
                transition: "all 0.3s ease",
                boxShadow: i === step ? `0 0 8px ${STEP_COLORS[i-1]}` : "none",
              }} />
            ))}
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div style={{ animation: "fadeUp 0.35s ease forwards" }}>
              <p style={{ fontSize: "11px", color: color, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "10px" }}>Step 1 of 4</p>
              <h1 style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1.1, marginBottom: "10px" }}>What do you go by?</h1>
              <p style={{ color: "var(--text2)", fontSize: "14px", marginBottom: "32px", lineHeight: 1.6 }}>We&apos;ll personalise your training around you.</p>
              <input
                type="text"
                placeholder="Your name or nickname..."
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && displayName.trim() && setStep(2)}
                style={{
                  width: "100%", background: "var(--bg2)",
                  border: `1px solid ${displayName.trim() ? color : "var(--border)"}`,
                  borderRadius: "12px", padding: "16px 18px", fontSize: "16px",
                  color: "var(--text)", marginBottom: "16px",
                  boxShadow: displayName.trim() ? `0 0 0 3px ${color}18` : "none",
                  transition: "all 0.2s",
                }}
                autoFocus
              />
              <button onClick={() => setStep(2)} disabled={!displayName.trim()} style={{
                width: "100%", background: displayName.trim() ? color : "var(--bg3)",
                color: displayName.trim() ? "#fff" : "var(--text3)",
                padding: "16px", borderRadius: "12px", fontSize: "15px", fontWeight: 800,
                cursor: displayName.trim() ? "pointer" : "default",
                boxShadow: displayName.trim() ? `0 4px 20px ${color}40` : "none",
                transition: "all 0.2s", border: "none",
              }}>
                Continue →
              </button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div style={{ animation: "fadeUp 0.35s ease forwards" }}>
              <p style={{ fontSize: "11px", color: color, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "10px" }}>Step 2 of 4</p>
              <h1 style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1.1, marginBottom: "10px" }}>Your position?</h1>
              <p style={{ color: "var(--text2)", fontSize: "14px", marginBottom: "28px", lineHeight: 1.6 }}>We&apos;ll tailor your drills and programs to your role.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
                {POSITIONS.map(p => (
                  <button key={p} onClick={() => setPosition(p)} style={{
                    padding: "15px 18px", borderRadius: "12px", textAlign: "left",
                    background: position === p ? `${color}15` : "var(--bg2)",
                    border: `1px solid ${position === p ? color : "var(--border)"}`,
                    color: position === p ? "#fff" : "var(--text2)",
                    fontSize: "15px", fontWeight: position === p ? 700 : 500, cursor: "pointer",
                    boxShadow: position === p ? `0 0 0 1px ${color}40` : "none",
                    transition: "all 0.15s", display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    {p}
                    {position === p && <span style={{ color: color, fontSize: "16px" }}>✓</span>}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, background: "var(--bg2)", border: "1px solid var(--border)", color: "var(--text2)", padding: "15px", borderRadius: "12px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>← Back</button>
                <button onClick={() => setStep(3)} disabled={!position} style={{ flex: 2, background: position ? color : "var(--bg3)", color: position ? "#fff" : "var(--text3)", padding: "15px", borderRadius: "12px", fontSize: "15px", fontWeight: 800, cursor: position ? "pointer" : "default", boxShadow: position ? `0 4px 20px ${color}40` : "none", transition: "all 0.2s", border: "none" }}>Continue →</button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div style={{ animation: "fadeUp 0.35s ease forwards" }}>
              <p style={{ fontSize: "11px", color: color, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "10px" }}>Step 3 of 4</p>
              <h1 style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1.1, marginBottom: "10px" }}>Your skill level?</h1>
              <p style={{ color: "var(--text2)", fontSize: "14px", marginBottom: "28px", lineHeight: 1.6 }}>Be honest — we&apos;ll set the right intensity for you.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
                {SKILL_LEVELS.map(s => (
                  <button key={s.label} onClick={() => setSkillLevel(s.label)} style={{
                    padding: "15px 18px", borderRadius: "12px", textAlign: "left",
                    background: skillLevel === s.label ? `${color}15` : "var(--bg2)",
                    border: `1px solid ${skillLevel === s.label ? color : "var(--border)"}`,
                    cursor: "pointer", transition: "all 0.15s",
                    boxShadow: skillLevel === s.label ? `0 0 0 1px ${color}40` : "none",
                    display: "flex", alignItems: "center", gap: "14px",
                  }}>
                    <span style={{ fontSize: "22px" }}>{s.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: skillLevel === s.label ? "#fff" : "var(--text)", fontSize: "15px", fontWeight: 700, marginBottom: "2px" }}>{s.label}</div>
                      <div style={{ color: "var(--text2)", fontSize: "12px" }}>{s.desc}</div>
                    </div>
                    {skillLevel === s.label && <span style={{ color: color, fontSize: "16px" }}>✓</span>}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => setStep(2)} style={{ flex: 1, background: "var(--bg2)", border: "1px solid var(--border)", color: "var(--text2)", padding: "15px", borderRadius: "12px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>← Back</button>
                <button onClick={() => setStep(4)} disabled={!skillLevel} style={{ flex: 2, background: skillLevel ? color : "var(--bg3)", color: skillLevel ? "#fff" : "var(--text3)", padding: "15px", borderRadius: "12px", fontSize: "15px", fontWeight: 800, cursor: skillLevel ? "pointer" : "default", boxShadow: skillLevel ? `0 4px 20px ${color}40` : "none", transition: "all 0.2s", border: "none" }}>Continue →</button>
              </div>
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div style={{ animation: "fadeUp 0.35s ease forwards" }}>
              <p style={{ fontSize: "11px", color: color, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "10px" }}>Step 4 of 4</p>
              <h1 style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1.1, marginBottom: "10px" }}>Your goals?</h1>
              <p style={{ color: "var(--text2)", fontSize: "14px", marginBottom: "28px", lineHeight: 1.6 }}>Pick up to 3 — we&apos;ll focus your training around them.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "24px" }}>
                {GOALS.map(g => {
                  const sel = goals.includes(g);
                  return (
                    <button key={g} onClick={() => toggleGoal(g)} style={{
                      padding: "14px", borderRadius: "12px", textAlign: "left",
                      background: sel ? `${color}18` : "var(--bg2)",
                      border: `1px solid ${sel ? color : "var(--border)"}`,
                      color: sel ? "#fff" : "var(--text2)",
                      fontSize: "13px", fontWeight: sel ? 700 : 500, cursor: "pointer",
                      lineHeight: 1.4, transition: "all 0.15s",
                      boxShadow: sel ? `0 0 0 1px ${color}40, 0 4px 12px ${color}20` : "none",
                    }}>
                      {sel && <span style={{ color: color, marginRight: "5px", fontSize: "11px" }}>✓</span>}
                      {g}
                    </button>
                  );
                })}
              </div>
              <p style={{ fontSize: "12px", color: "var(--text3)", textAlign: "center", marginBottom: "16px" }}>
                {goals.length} / 3 selected
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => setStep(3)} style={{ flex: 1, background: "var(--bg2)", border: "1px solid var(--border)", color: "var(--text2)", padding: "15px", borderRadius: "12px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>← Back</button>
                <button onClick={finish} disabled={goals.length === 0} style={{ flex: 2, background: goals.length > 0 ? color : "var(--bg3)", color: goals.length > 0 ? "#fff" : "var(--text3)", padding: "15px", borderRadius: "12px", fontSize: "15px", fontWeight: 800, cursor: goals.length > 0 ? "pointer" : "default", boxShadow: goals.length > 0 ? `0 4px 24px ${color}50` : "none", transition: "all 0.2s", border: "none" }}>
                  Let&apos;s go, {displayName} →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
