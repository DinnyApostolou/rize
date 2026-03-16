"use client";
import { useState } from "react";
import Link from "next/link";

const PROGRAMS = [
  {
    category: "Explosive Power",
    icon: "⚡",
    exercises: [
      { name: "Box Jumps", sets: "4x8", rest: "90s", desc: "Explosive lower body power — essential for vertical jump.", tips: ["Full extension at top", "Soft landing with bent knees", "Reset completely between reps"] },
      { name: "Depth Jumps", sets: "3x6", rest: "2min", desc: "Step off box, immediately explode upward. Reactive strength builder.", tips: ["Minimal ground contact time", "Arms drive up explosively", "Land soft, jump fast"] },
      { name: "Barbell Jump Squat", sets: "4x5", rest: "2min", desc: "Load a barbell at 30% of your squat max and explode off the floor.", tips: ["Light weight, max speed", "Controlled landing", "Full hip extension"] },
      { name: "Single Leg Bounds", sets: "3x10 each", rest: "90s", desc: "Lateral and forward bounding to build unilateral power.", tips: ["Drive knee up", "Big, powerful strides", "Stay balanced on landing"] },
    ]
  },
  {
    category: "Lower Body Strength",
    icon: "🦵",
    exercises: [
      { name: "Back Squat", sets: "4x6", rest: "3min", desc: "Foundation of athletic lower body strength. Build quads, glutes and posterior chain.", tips: ["Depth below parallel", "Chest up throughout", "Drive knees out"] },
      { name: "Romanian Deadlift", sets: "3x10", rest: "2min", desc: "Hamstring and glute builder crucial for sprint and jump mechanics.", tips: ["Hinge at the hips", "Bar stays close to legs", "Feel the hamstring stretch"] },
      { name: "Bulgarian Split Squat", sets: "3x8 each", rest: "90s", desc: "Unilateral leg strength — exposes imbalances and builds stability.", tips: ["Front foot out far enough", "Rear knee drops straight down", "Drive through front heel"] },
      { name: "Hip Thrust", sets: "4x10", rest: "2min", desc: "Maximum glute activation for speed, power and injury prevention.", tips: ["Chin tucked", "Full hip extension at top", "Squeeze glutes hard at lockout"] },
    ]
  },
  {
    category: "Upper Body & Core",
    icon: "💪",
    exercises: [
      { name: "Pull-Ups", sets: "4x8", rest: "90s", desc: "Back and bicep strength for fighting through screens and boxing out.", tips: ["Full dead hang at bottom", "Chest to bar at top", "Controlled descent"] },
      { name: "Dumbbell Bench Press", sets: "4x8", rest: "90s", desc: "Balanced chest and shoulder strength without the shoulder stress of barbell.", tips: ["Full range of motion", "Control the eccentric", "Keep wrists neutral"] },
      { name: "Pallof Press", sets: "3x12 each", rest: "60s", desc: "Anti-rotation core exercise that builds functional athletic stability.", tips: ["Resist rotation throughout", "Fully extend arms", "Brace abs hard"] },
      { name: "Hanging Leg Raise", sets: "3x12", rest: "60s", desc: "Full core strength — especially lower abs and hip flexors for explosiveness.", tips: ["No swinging", "Controlled movement", "Touch toes to bar if possible"] },
    ]
  },
  {
    category: "Speed & Agility",
    icon: "💨",
    exercises: [
      { name: "Resisted Sprint (Band)", sets: "6x20m", rest: "2min", desc: "Build acceleration mechanics and first-step quickness.", tips: ["Forward lean", "High knees", "Drive arms back hard"] },
      { name: "Lateral Shuffle Cone Drill", sets: "4x30s", rest: "60s", desc: "Defensive positioning speed and lateral quickness.", tips: ["Stay low", "Don't cross feet", "Tap each cone"] },
      { name: "5-10-5 Pro Agility", sets: "6 reps", rest: "90s", desc: "Classic NFL Combine drill. Change-of-direction explosiveness.", tips: ["Low pivot points", "Reach for the line", "Full sprint each segment"] },
      { name: "Single Leg Calf Raises (Weighted)", sets: "4x15 each", rest: "60s", desc: "Build calf strength and ankle stability for jumping and cutting.", tips: ["Full range of motion", "Slow eccentric (3 seconds)", "Hold top for 1 second"] },
    ]
  },
];

export default function StrengthPage() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <nav style={{ background: "var(--bg2)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", height: "64px" }}>
        <Link href="/dashboard" style={{ fontSize: "20px", fontWeight: 900, letterSpacing: "-1px" }}>RZ<span style={{ color: "var(--accent)" }}>.</span></Link>
        <span style={{ fontWeight: 700 }}>🏋️ Strength Training</span>
        <Link href="/dashboard"><button style={{ background: "none", border: "1px solid var(--border)", color: "var(--text2)", padding: "6px 16px", borderRadius: "8px", fontSize: "13px" }}>← Dashboard</button></Link>
      </nav>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-1px", marginBottom: "8px" }}>Athlete Strength Programs</h1>
        <p style={{ color: "var(--text2)", marginBottom: "32px" }}>Built specifically for basketball athletes. Increase power, speed and durability on the court.</p>

        {/* Category tabs */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "32px" }}>
          {PROGRAMS.map((p, i) => (
            <button key={i} onClick={() => setActiveCategory(i)} style={{
              padding: "10px 20px", borderRadius: "100px", fontSize: "14px", fontWeight: 600,
              background: activeCategory === i ? "var(--accent)" : "var(--bg2)",
              border: `1px solid ${activeCategory === i ? "var(--accent)" : "var(--border)"}`,
              color: activeCategory === i ? "#fff" : "var(--text2)",
            }}>{p.icon} {p.category}</button>
          ))}
        </div>

        {/* Exercises */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {PROGRAMS[activeCategory].exercises.map((ex, i) => {
            const key = `${activeCategory}-${i}`;
            const isOpen = expanded === key;
            return (
              <div key={i} onClick={() => setExpanded(isOpen ? null : key)} style={{
                background: "var(--bg2)", border: `1px solid ${isOpen ? "var(--accent)" : "var(--border)"}`,
                borderRadius: "16px", padding: "20px 24px", cursor: "pointer", transition: "border-color 0.2s",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "17px" }}>{ex.name}</div>
                    <div style={{ display: "flex", gap: "16px", marginTop: "6px" }}>
                      <span style={{ fontSize: "13px", color: "var(--accent)", fontWeight: 600 }}>{ex.sets}</span>
                      <span style={{ fontSize: "13px", color: "var(--text2)" }}>Rest: {ex.rest}</span>
                    </div>
                  </div>
                  <span style={{ color: "var(--text2)", fontSize: "20px" }}>{isOpen ? "−" : "+"}</span>
                </div>
                {isOpen && (
                  <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid var(--border)" }}>
                    <p style={{ color: "var(--text2)", fontSize: "15px", lineHeight: 1.7, marginBottom: "16px" }}>{ex.desc}</p>
                    <div style={{ fontWeight: 700, marginBottom: "10px" }}>Coaching Cues:</div>
                    {ex.tips.map((t, ti) => (
                      <div key={ti} style={{ display: "flex", gap: "8px", marginBottom: "8px", fontSize: "14px", color: "var(--text2)" }}>
                        <span style={{ color: "var(--accent)" }}>→</span> {t}
                      </div>
                    ))}
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
