"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";

const POSITIONS = [
  { value: "PG", label: "PG", full: "Point Guard" },
  { value: "SG", label: "SG", full: "Shooting Guard" },
  { value: "SF", label: "SF", full: "Small Forward" },
  { value: "PF", label: "PF", full: "Power Forward" },
  { value: "C",  label: "C",  full: "Center" },
];

const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced"];

export default function AICoachPage() {
  const [position, setPosition] = useState<string | null>(null);
  const [skillLevel, setSkillLevel] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!position || !skillLevel) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/ai-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ position, skillLevel }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setResult(data.result);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const canGenerate = position && skillLevel && !loading;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <Sidebar />

      <main className="inner-main" style={{ flex: 1, padding: "48px 52px", maxWidth: "860px" }}>
        {/* Header */}
        <p style={{ fontSize: "11px", color: "var(--accent)", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>
          AI Coach
        </p>
        <h1 style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1, marginBottom: "10px" }}>
          Your Personal Drill Coach
        </h1>
        <p style={{ color: "var(--text2)", fontSize: "14px", marginBottom: "40px" }}>
          Select your position and skill level to get 5 tailored drills from Claude AI.
        </p>

        {/* Position selector */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
            Your Position
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {POSITIONS.map(p => {
              const active = position === p.value;
              return (
                <button
                  key={p.value}
                  onClick={() => setPosition(p.value)}
                  style={{
                    padding: "12px 22px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 700,
                    background: active ? "var(--accent)" : "var(--bg2)",
                    border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
                    color: active ? "#fff" : "var(--text2)",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "3px",
                  }}
                >
                  <span style={{ fontSize: "16px", fontWeight: 900 }}>{p.label}</span>
                  <span style={{ fontSize: "10px", fontWeight: 500, opacity: 0.8 }}>{p.full}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Skill level selector */}
        <div style={{ marginBottom: "36px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
            Skill Level
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {SKILL_LEVELS.map(level => {
              const active = skillLevel === level;
              const colors: Record<string, string> = {
                Beginner: "#10B981",
                Intermediate: "#F59E0B",
                Advanced: "#EF4444",
              };
              const c = colors[level];
              return (
                <button
                  key={level}
                  onClick={() => setSkillLevel(level)}
                  style={{
                    padding: "10px 28px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 600,
                    background: active ? `${c}18` : "var(--bg2)",
                    border: `1px solid ${active ? c : "var(--border)"}`,
                    color: active ? c : "var(--text2)",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {level}
                </button>
              );
            })}
          </div>
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={!canGenerate}
          style={{
            padding: "14px 36px",
            borderRadius: "10px",
            fontSize: "15px",
            fontWeight: 700,
            background: canGenerate ? "var(--accent)" : "var(--bg2)",
            border: "none",
            color: canGenerate ? "#fff" : "var(--text3)",
            cursor: canGenerate ? "pointer" : "not-allowed",
            transition: "all 0.2s",
            marginBottom: "36px",
            opacity: loading ? 0.7 : 1,
            boxShadow: canGenerate ? "var(--glow-blue)" : "none",
          }}
        >
          {loading ? "Generating drills..." : "Get My Drill Recommendations"}
        </button>

        {/* Loading skeleton */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="skeleton-shimmer" style={{ height: "72px", borderRadius: "10px" }} />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: "10px",
            padding: "16px 20px",
            color: "#EF4444",
            fontSize: "14px",
          }}>
            {error}
          </div>
        )}

        {/* Result card */}
        {result && !loading && (
          <div style={{
            background: "var(--bg2)",
            border: "1px solid var(--border)",
            borderLeft: "3px solid var(--accent)",
            borderRadius: "12px",
            padding: "28px 32px",
            boxShadow: "var(--shadow-md)",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
              paddingBottom: "16px",
              borderBottom: "1px solid var(--border)",
            }}>
              <div style={{
                background: "rgba(0,116,255,0.12)",
                border: "1px solid rgba(0,116,255,0.25)",
                borderRadius: "8px",
                padding: "6px 14px",
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--accent)",
              }}>
                AI COACH
              </div>
              <div style={{ fontSize: "13px", color: "var(--text2)" }}>
                {position} · {skillLevel} · 5 Drills
              </div>
            </div>
            <div style={{
              fontSize: "14px",
              color: "var(--text2)",
              lineHeight: 1.85,
              whiteSpace: "pre-wrap",
            }}>
              {result}
            </div>
            <button
              onClick={handleGenerate}
              style={{
                marginTop: "24px",
                padding: "10px 22px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                background: "var(--bg3)",
                border: "1px solid var(--border)",
                color: "var(--text2)",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              Regenerate
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
