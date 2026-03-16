"use client";
import { useState } from "react";
import Link from "next/link";

const DAYS = [
  {
    day: "Monday", focus: "Basketball — Handles & Finishing",
    sessions: [
      { time: "Morning", title: "Two-Ball Dribbling", duration: "20 min", type: "court" },
      { time: "Afternoon", title: "Mikan Drill + Layup Package", duration: "25 min", type: "court" },
      { time: "Evening", title: "Lower Body Strength", duration: "45 min", type: "gym" },
    ],
    nutrition: "High carb day. Oats for breakfast, chicken & rice pre-workout, salmon & sweet potato post-gym.",
  },
  {
    day: "Tuesday", focus: "Strength — Lower Body Power",
    sessions: [
      { time: "Morning", title: "Box Jumps + Depth Jumps", duration: "20 min", type: "gym" },
      { time: "Afternoon", title: "Back Squat + Bulgarian Split Squat", duration: "50 min", type: "gym" },
      { time: "Evening", title: "Form Shooting (light)", duration: "20 min", type: "court" },
    ],
    nutrition: "High protein day. Eggs for breakfast, tuna pasta for lunch, steak & baked potato for dinner.",
  },
  {
    day: "Wednesday", focus: "Active Recovery",
    sessions: [
      { time: "Morning", title: "Light Stretch & Mobility", duration: "20 min", type: "recovery" },
      { time: "Afternoon", title: "Spot Shooting (no fatigue)", duration: "30 min", type: "court" },
    ],
    nutrition: "Moderate calories. Focus on hydration and anti-inflammatory foods. Salmon, vegetables, fruit.",
  },
  {
    day: "Thursday", focus: "Basketball — Shooting & IQ",
    sessions: [
      { time: "Morning", title: "Catch & Shoot Spot Work", duration: "30 min", type: "court" },
      { time: "Afternoon", title: "Off-Screen Shooting Drill", duration: "25 min", type: "court" },
      { time: "Evening", title: "Upper Body & Core Strength", duration: "45 min", type: "gym" },
    ],
    nutrition: "Balanced macros. Overnight oats, chicken burrito bowl, protein shake post-gym.",
  },
  {
    day: "Friday", focus: "Strength — Explosive Speed",
    sessions: [
      { time: "Morning", title: "Sprint Work + 5-10-5 Drill", duration: "25 min", type: "gym" },
      { time: "Afternoon", title: "Full Lower Body Session", duration: "55 min", type: "gym" },
      { time: "Evening", title: "Zig-Zag Defense Drill", duration: "20 min", type: "court" },
    ],
    nutrition: "High carb + protein day. Rice cakes pre-workout, big post-workout meal within 30 minutes.",
  },
  {
    day: "Saturday", focus: "Full Court — Game Simulation",
    sessions: [
      { time: "Morning", title: "Full Skill Run (all areas)", duration: "60 min", type: "court" },
      { time: "Afternoon", title: "Pick-up Game or Scrimmage", duration: "60-90 min", type: "court" },
    ],
    nutrition: "Your biggest eating day. Load up on carbs. Greek yogurt parfait + big pre-game meal + recovery shake.",
  },
  {
    day: "Sunday", focus: "Full Rest & Recovery",
    sessions: [
      { time: "Any", title: "Rest, foam roll and sleep", duration: "All day", type: "recovery" },
    ],
    nutrition: "Eat well but relax. Focus on sleep — this is when your body actually grows and repairs.",
  },
];

export default function SchedulePage() {
  const [activeDay, setActiveDay] = useState(0);
  const day = DAYS[activeDay];
  const typeColor = (t: string) => t === "court" ? "var(--accent)" : t === "gym" ? "#a855f7" : "var(--green)";
  const typeLabel = (t: string) => t === "court" ? "🏀 Court" : t === "gym" ? "🏋️ Gym" : "😴 Recovery";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <nav style={{ background: "var(--bg2)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", height: "64px" }}>
        <Link href="/dashboard" style={{ fontSize: "20px", fontWeight: 900, letterSpacing: "-1px" }}>RZ<span style={{ color: "var(--accent)" }}>.</span></Link>
        <span style={{ fontWeight: 700 }}>📅 Weekly Schedule</span>
        <Link href="/dashboard"><button style={{ background: "none", border: "1px solid var(--border)", color: "var(--text2)", padding: "6px 16px", borderRadius: "8px", fontSize: "13px" }}>← Dashboard</button></Link>
      </nav>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-1px", marginBottom: "32px" }}>Your Training Week</h1>

        {/* Day selector */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "40px" }}>
          {DAYS.map((d, i) => (
            <button key={i} onClick={() => setActiveDay(i)} style={{
              padding: "10px 18px", borderRadius: "12px", fontSize: "14px", fontWeight: 600,
              background: activeDay === i ? "var(--accent)" : "var(--bg2)",
              border: `1px solid ${activeDay === i ? "var(--accent)" : "var(--border)"}`,
              color: activeDay === i ? "#fff" : "var(--text2)",
            }}>{d.day.slice(0, 3)}</button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {/* Sessions */}
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "6px", letterSpacing: "-0.5px" }}>{day.day}</h2>
            <p style={{ color: "var(--accent)", fontSize: "14px", fontWeight: 600, marginBottom: "24px" }}>{day.focus}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {day.sessions.map((s, i) => (
                <div key={i} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "14px", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", color: "var(--text2)", fontWeight: 600 }}>{s.time}</span>
                    <span style={{ fontSize: "12px", color: typeColor(s.type), fontWeight: 600 }}>{typeLabel(s.type)}</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "16px", marginBottom: "4px" }}>{s.title}</div>
                  <div style={{ fontSize: "13px", color: "var(--text2)" }}>⏱ {s.duration}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Nutrition */}
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "6px", letterSpacing: "-0.5px" }}>Today's Nutrition</h2>
            <p style={{ color: "var(--text2)", fontSize: "14px", marginBottom: "24px" }}>Fuel plan for {day.day}</p>
            <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "14px", padding: "24px" }}>
              <span style={{ fontSize: "32px" }}>🥗</span>
              <p style={{ color: "var(--text2)", fontSize: "15px", lineHeight: 1.7, marginTop: "16px" }}>{day.nutrition}</p>
              <Link href="/nutrition">
                <button style={{ marginTop: "20px", background: "var(--bg3)", border: "1px solid var(--border)", color: "var(--text)", padding: "10px 20px", borderRadius: "8px", fontSize: "14px", fontWeight: 600 }}>
                  See Full Meal Plans →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
