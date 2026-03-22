"use client";
import { useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

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

const typeConfig: Record<string, { color: string; label: string }> = {
  court: { color: "#0EA5E9", label: "Court" },
  gym: { color: "#8B5CF6", label: "Gym" },
  recovery: { color: "#10B981", label: "Recovery" },
};

export default function SchedulePage() {
  const [activeDay, setActiveDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const day = DAYS[activeDay];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <Sidebar />

      <main style={{ marginLeft: "220px", flex: 1, padding: "48px 52px", maxWidth: "900px" }}>
        <div style={{ marginBottom: "40px" }}>
          <p style={{ fontSize: "11px", color: "var(--accent)", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Weekly Schedule</p>
          <h1 style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1 }}>Training Week</h1>
        </div>

        {/* Day selector */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "40px" }}>
          {DAYS.map((d, i) => (
            <button key={i} onClick={() => setActiveDay(i)} style={{
              padding: "8px 16px", borderRadius: "6px", fontSize: "13px", fontWeight: 500,
              background: activeDay === i ? "var(--accent)" : "var(--bg2)",
              border: `1px solid ${activeDay === i ? "var(--accent)" : "var(--border)"}`,
              color: activeDay === i ? "#fff" : "var(--text2)",
              cursor: "pointer", transition: "all 0.15s",
            }}>{d.day.slice(0, 3)}</button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {/* Sessions */}
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "4px" }}>{day.day}</h2>
            <p style={{ color: "var(--accent)", fontSize: "13px", fontWeight: 600, marginBottom: "24px" }}>{day.focus}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {day.sessions.map((s, i) => {
                const cfg = typeConfig[s.type];
                return (
                  <div key={i} style={{
                    background: "var(--bg2)", border: "1px solid var(--border)",
                    borderLeft: `3px solid ${cfg.color}`,
                    borderRadius: "8px", padding: "16px 18px",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontSize: "10px", color: "var(--text3)", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" }}>{s.time}</div>
                        <div style={{ fontWeight: 700, fontSize: "14px" }}>{s.title}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "11px", color: cfg.color, fontWeight: 600, marginBottom: "2px" }}>{cfg.label}</div>
                        <div style={{ fontSize: "12px", color: "var(--text3)" }}>{s.duration}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Nutrition */}
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "4px" }}>Nutrition</h2>
            <p style={{ color: "var(--text2)", fontSize: "13px", marginBottom: "24px" }}>Fuel plan for {day.day}</p>
            <div style={{
              background: "var(--bg2)", border: "1px solid var(--border)",
              borderTop: "2px solid #10B981",
              borderRadius: "8px", padding: "20px",
            }}>
              <p style={{ color: "var(--text2)", fontSize: "14px", lineHeight: 1.8 }}>{day.nutrition}</p>
              <Link href="/nutrition">
                <button style={{
                  marginTop: "20px", background: "transparent",
                  border: "1px solid var(--border)", color: "var(--text2)",
                  padding: "9px 18px", borderRadius: "6px", fontSize: "13px",
                  fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = "#10B981"; el.style.color = "#10B981"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = "var(--border)"; el.style.color = "var(--text2)"; }}>
                  Full meal plans →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
