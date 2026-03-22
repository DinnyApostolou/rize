"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";

interface Profile {
  username: string;
  xp: number;
  streak: number;
  drills_completed: number;
  is_subscribed: boolean;
}

const POSITIONS = ["PG", "SG", "SF", "PF", "C", "Not sure"];
const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced"];

function getLevel(xp: number): number {
  return Math.floor(xp / 500) + 1;
}

function getXpProgress(xp: number): number {
  return xp % 500;
}

function getInitials(username: string): string {
  if (!username) return "?";
  return username
    .split(/\s+/)
    .filter(w => w.length > 0)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  const [position, setPosition] = useState<string>("");
  const [skillLevel, setSkillLevel] = useState<string>("");
  const [goal, setGoal] = useState<string>("");

  const [editingPosition, setEditingPosition] = useState(false);
  const [editingSkill, setEditingSkill] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = getSupabase();
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push("/login");
        return;
      }

      setEmail(user.email ?? "");

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(profileData || {
        username: user.email?.split("@")[0] || "Athlete",
        xp: 0,
        streak: 0,
        drills_completed: 0,
        is_subscribed: false,
      });
      setPosition(localStorage.getItem("rize_position") ?? "");
      setSkillLevel(localStorage.getItem("rize_skill_level") ?? "");
      setGoal(localStorage.getItem("rize_goal") ?? "");
      setLoading(false);
    }

    load();
  }, [router]);

  function selectPosition(value: string) {
    setPosition(value);
    localStorage.setItem("rize_position", value);
    setEditingPosition(false);
  }

  function selectSkillLevel(value: string) {
    setSkillLevel(value);
    localStorage.setItem("rize_skill_level", value);
    setEditingSkill(false);
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text2)" }}>
        Loading...
      </div>
    );
  }

  if (!profile) return null;

  const xp = profile.xp ?? 0;
  const level = getLevel(xp);
  const xpProgress = getXpProgress(xp);
  const initials = getInitials(profile.username ?? "");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <Sidebar username={profile.username ?? ""} level={level} xp={xp} isSubscribed={profile.is_subscribed} />

      <main style={{ marginLeft: "220px", flex: 1, padding: "48px 52px", maxWidth: "760px" }}>
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <p style={{ fontSize: "11px", color: "var(--accent)", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Account</p>
          <h1 style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1 }}>Your Profile</h1>
        </div>

        {/* Avatar card */}
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "12px", padding: "28px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "24px" }}>
          <div style={{
            width: "72px", height: "72px", borderRadius: "50%",
            background: "rgba(14,165,233,0.15)", border: "2px solid rgba(14,165,233,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "26px", fontWeight: 800, color: "var(--accent)", flexShrink: 0,
          }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "2px" }}>{profile.username}</div>
            <div style={{ fontSize: "13px", color: "var(--text2)", marginBottom: "12px" }}>{email}</div>
            {/* XP bar */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "12px", color: "var(--accent)", fontWeight: 700, whiteSpace: "nowrap" }}>Level {level}</span>
              <div style={{ flex: 1, height: "4px", background: "var(--border)", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ width: `${(xpProgress / 500) * 100}%`, height: "100%", background: "var(--accent)", borderRadius: "2px", transition: "width 0.5s ease" }} />
              </div>
              <span style={{ fontSize: "12px", color: "var(--text3)", whiteSpace: "nowrap" }}>{xpProgress ?? 0}/500 XP</span>
            </div>
          </div>
        </div>

        {/* Upgrade to Pro CTA — shown only if not subscribed */}
        {!profile.is_subscribed && (
          <Link href="/subscribe" style={{ textDecoration: "none", display: "block", marginBottom: "16px" }}>
            <div style={{
              background: "linear-gradient(135deg, rgba(14,165,233,0.12), rgba(56,189,248,0.06))",
              border: "1px solid rgba(14,165,233,0.35)",
              borderRadius: "12px", padding: "20px 24px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              cursor: "pointer", transition: "border-color 0.15s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(14,165,233,0.6)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(14,165,233,0.35)"; }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--accent)", marginBottom: "4px" }}>Upgrade to Pro — $7.99/month</div>
                <div style={{ fontSize: "13px", color: "var(--text2)" }}>Unlock all drills, programs, nutrition plans and more.</div>
              </div>
              <span style={{ color: "var(--accent)", fontSize: "18px", marginLeft: "16px", flexShrink: 0 }}>→</span>
            </div>
          </Link>
        )}

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "16px" }}>
          {[
            { label: "Total XP", value: xp.toLocaleString(), color: "#38BDF8" },
            { label: "Level", value: level, color: "#38BDF8" },
            { label: "Day Streak", value: profile.streak ?? 0, color: "#38BDF8" },
            { label: "Drills Done", value: profile.drills_completed ?? 0, color: "#38BDF8" },
          ].map((stat) => (
            <div key={stat.label} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px 12px", textAlign: "center" }}>
              <div style={{ fontSize: "22px", fontWeight: 800, color: stat.color, marginBottom: "4px", textShadow: "0 0 24px rgba(14,165,233,0.55), 0 0 8px rgba(14,165,233,0.3)" }}>{stat.value}</div>
              <div style={{ fontSize: "11px", color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Profile details */}
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text)", marginBottom: "20px", textTransform: "uppercase", letterSpacing: "1px" }}>Athlete Details</h2>

          {/* Position */}
          <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: "18px", marginBottom: "18px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: editingPosition ? "14px" : "0" }}>
              <div>
                <div style={{ fontSize: "11px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Position</div>
                <div style={{ fontSize: "14px", color: position ? "var(--text)" : "var(--text3)" }}>{position || "Not set"}</div>
              </div>
              {!editingPosition && (
                <button onClick={() => setEditingPosition(true)} style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "7px", color: "var(--text2)", fontSize: "12px", padding: "6px 14px", cursor: "pointer" }}>
                  Edit
                </button>
              )}
            </div>
            {editingPosition && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {POSITIONS.map((p) => (
                  <button key={p} onClick={() => selectPosition(p)} style={{
                    background: position === p ? "var(--accent)" : "var(--bg3)",
                    border: `1px solid ${position === p ? "var(--accent)" : "var(--border)"}`,
                    borderRadius: "7px", color: position === p ? "#fff" : "var(--text2)",
                    fontSize: "13px", fontWeight: position === p ? 600 : 400, padding: "7px 14px", cursor: "pointer",
                  }}>{p}</button>
                ))}
                <button onClick={() => setEditingPosition(false)} style={{ background: "transparent", border: "none", color: "var(--text3)", fontSize: "13px", padding: "7px 6px", cursor: "pointer" }}>Cancel</button>
              </div>
            )}
          </div>

          {/* Skill Level */}
          <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: "18px", marginBottom: "18px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: editingSkill ? "14px" : "0" }}>
              <div>
                <div style={{ fontSize: "11px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Skill Level</div>
                <div style={{ fontSize: "14px", color: skillLevel ? "var(--text)" : "var(--text3)" }}>{skillLevel || "Not set"}</div>
              </div>
              {!editingSkill && (
                <button onClick={() => setEditingSkill(true)} style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "7px", color: "var(--text2)", fontSize: "12px", padding: "6px 14px", cursor: "pointer" }}>
                  Edit
                </button>
              )}
            </div>
            {editingSkill && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {SKILL_LEVELS.map((s) => (
                  <button key={s} onClick={() => selectSkillLevel(s)} style={{
                    background: skillLevel === s ? "var(--accent)" : "var(--bg3)",
                    border: `1px solid ${skillLevel === s ? "var(--accent)" : "var(--border)"}`,
                    borderRadius: "7px", color: skillLevel === s ? "#fff" : "var(--text2)",
                    fontSize: "13px", fontWeight: skillLevel === s ? 600 : 400, padding: "7px 14px", cursor: "pointer",
                  }}>{s}</button>
                ))}
                <button onClick={() => setEditingSkill(false)} style={{ background: "transparent", border: "none", color: "var(--text3)", fontSize: "13px", padding: "7px 6px", cursor: "pointer" }}>Cancel</button>
              </div>
            )}
          </div>

          {/* Goal */}
          <div>
            <div style={{ fontSize: "11px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Goal</div>
            <div style={{ fontSize: "14px", color: goal ? "var(--text)" : "var(--text3)" }}>{goal || "Not set"}</div>
          </div>
        </div>

        {/* Subscription status */}
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>Subscription</h2>
          {profile.is_subscribed ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "2px" }}>Pro Member</div>
                <div style={{ fontSize: "13px", color: "var(--text2)" }}>Active — full access to all features</div>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "2px" }}>Free Plan</div>
                <div style={{ fontSize: "13px", color: "var(--text2)" }}>Limited access — upgrade to unlock everything</div>
              </div>
              <Link href="/subscribe" style={{ background: "var(--accent)", color: "#fff", textDecoration: "none", borderRadius: "8px", padding: "9px 18px", fontSize: "13px", fontWeight: 700, whiteSpace: "nowrap" }}>
                Upgrade to Pro →
              </Link>
            </div>
          )}
        </div>

        {/* Sign out */}
        <button
          onClick={async () => {
            await getSupabase().auth.signOut();
            router.push("/");
          }}
          style={{
            width: "100%", background: "transparent", border: "1px solid #2a1515",
            borderRadius: "10px", color: "#ef4444", fontSize: "13px", fontWeight: 600,
            padding: "13px", cursor: "pointer",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#ef4444"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#2a1515"; }}
        >
          Sign Out
        </button>
      </main>
    </div>
  );
}
