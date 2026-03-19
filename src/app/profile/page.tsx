"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";

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

function getInitials(username: string): string {
  return username
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const [position, setPosition] = useState<string>("");
  const [skillLevel, setSkillLevel] = useState<string>("");
  const [goal, setGoal] = useState<string>("");

  const [editingPosition, setEditingPosition] = useState(false);
  const [editingSkill, setEditingSkill] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = getSupabase();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push("/login");
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError || !profileData) {
        router.push("/login");
        return;
      }

      setProfile(profileData as Profile);

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
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text2)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!profile) return null;

  const level = getLevel(profile.xp);
  const initials = getInitials(profile.username);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text)",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <style>{`
        :root {
          --bg: #0a0a0a;
          --bg2: #111111;
          --bg3: #1a1a1a;
          --border: #222222;
          --text: #ffffff;
          --text2: #a0a0a0;
          --text3: #555555;
          --accent: #0EA5E9;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* Nav */}
      <nav
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "0 24px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--bg2)",
        }}
      >
        <span
          style={{
            fontWeight: 800,
            fontSize: "20px",
            letterSpacing: "-0.5px",
            color: "var(--accent)",
          }}
        >
          RZ.
        </span>
        <Link
          href="/dashboard"
          style={{
            color: "var(--text2)",
            textDecoration: "none",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 14px",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            background: "var(--bg3)",
            transition: "color 0.15s",
          }}
        >
          <span style={{ fontSize: "13px" }}>&#8592;</span> Dashboard
        </Link>
      </nav>

      {/* Content */}
      <div
        style={{
          maxWidth: "640px",
          margin: "0 auto",
          padding: "48px 24px 80px",
        }}
      >
        {/* Page title */}
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            marginBottom: "40px",
            letterSpacing: "-0.5px",
          }}
        >
          Your Profile
        </h1>

        {/* Avatar + identity */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "40px",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "rgba(14,165,233,0.15)",
              border: "2px solid rgba(14,165,233,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: 700,
              color: "var(--accent)",
              letterSpacing: "1px",
            }}
          >
            {initials}
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "22px",
                fontWeight: 700,
                letterSpacing: "-0.3px",
                marginBottom: "4px",
              }}
            >
              {profile.username}
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "var(--accent)",
                fontWeight: 600,
              }}
            >
              Level {level} Athlete
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          {[
            { label: "Total XP", value: profile.xp.toLocaleString() },
            { label: "Level", value: level },
            { label: "Day Streak", value: profile.streak },
            { label: "Drills Done", value: profile.drills_completed },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "var(--bg2)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "16px 12px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "var(--text)",
                  marginBottom: "4px",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--text2)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Profile details card */}
        <div
          style={{
            background: "var(--bg2)",
            border: "1px solid var(--border)",
            borderRadius: "14px",
            padding: "24px",
            marginBottom: "16px",
          }}
        >
          <h2
            style={{
              fontSize: "15px",
              fontWeight: 600,
              color: "var(--text)",
              marginBottom: "20px",
              letterSpacing: "-0.2px",
            }}
          >
            Profile Details
          </h2>

          {/* Position */}
          <div
            style={{
              borderBottom: "1px solid var(--border)",
              paddingBottom: "20px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: editingPosition ? "14px" : "0",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--text3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "4px",
                  }}
                >
                  Position
                </div>
                <div
                  style={{
                    fontSize: "15px",
                    color: position ? "var(--text)" : "var(--text3)",
                  }}
                >
                  {position || "Not set"}
                </div>
              </div>
              {!editingPosition && (
                <button
                  onClick={() => setEditingPosition(true)}
                  style={{
                    background: "var(--bg3)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--text2)",
                    fontSize: "13px",
                    padding: "6px 14px",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
              )}
            </div>
            {editingPosition && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {POSITIONS.map((p) => (
                  <button
                    key={p}
                    onClick={() => selectPosition(p)}
                    style={{
                      background: position === p ? "var(--accent)" : "var(--bg3)",
                      border: `1px solid ${position === p ? "var(--accent)" : "var(--border)"}`,
                      borderRadius: "8px",
                      color: position === p ? "#fff" : "var(--text2)",
                      fontSize: "13px",
                      fontWeight: position === p ? 600 : 400,
                      padding: "7px 14px",
                      cursor: "pointer",
                    }}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setEditingPosition(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--text3)",
                    fontSize: "13px",
                    padding: "7px 6px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Skill Level */}
          <div
            style={{
              borderBottom: "1px solid var(--border)",
              paddingBottom: "20px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: editingSkill ? "14px" : "0",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--text3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "4px",
                  }}
                >
                  Skill Level
                </div>
                <div
                  style={{
                    fontSize: "15px",
                    color: skillLevel ? "var(--text)" : "var(--text3)",
                  }}
                >
                  {skillLevel || "Not set"}
                </div>
              </div>
              {!editingSkill && (
                <button
                  onClick={() => setEditingSkill(true)}
                  style={{
                    background: "var(--bg3)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--text2)",
                    fontSize: "13px",
                    padding: "6px 14px",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
              )}
            </div>
            {editingSkill && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {SKILL_LEVELS.map((s) => (
                  <button
                    key={s}
                    onClick={() => selectSkillLevel(s)}
                    style={{
                      background: skillLevel === s ? "var(--accent)" : "var(--bg3)",
                      border: `1px solid ${skillLevel === s ? "var(--accent)" : "var(--border)"}`,
                      borderRadius: "8px",
                      color: skillLevel === s ? "#fff" : "var(--text2)",
                      fontSize: "13px",
                      fontWeight: skillLevel === s ? 600 : 400,
                      padding: "7px 14px",
                      cursor: "pointer",
                    }}
                  >
                    {s}
                  </button>
                ))}
                <button
                  onClick={() => setEditingSkill(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--text3)",
                    fontSize: "13px",
                    padding: "7px 6px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Goal (read-only) */}
          <div>
            <div
              style={{
                fontSize: "12px",
                color: "var(--text3)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "4px",
              }}
            >
              Goal
            </div>
            <div
              style={{
                fontSize: "15px",
                color: goal ? "var(--text)" : "var(--text3)",
              }}
            >
              {goal || "Not set"}
            </div>
          </div>
        </div>

        {/* Subscription card */}
        <div
          style={{
            background: "var(--bg2)",
            border: "1px solid var(--border)",
            borderRadius: "14px",
            padding: "24px",
            marginBottom: "32px",
          }}
        >
          <h2
            style={{
              fontSize: "15px",
              fontWeight: 600,
              color: "var(--text)",
              marginBottom: "16px",
              letterSpacing: "-0.2px",
            }}
          >
            Subscription
          </h2>
          {profile.is_subscribed ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#22c55e",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "var(--text)",
                      marginBottom: "2px",
                    }}
                  >
                    Pro Member
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--text2)" }}>
                    Active subscription
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "var(--text)",
                    marginBottom: "2px",
                  }}
                >
                  Free Plan
                </div>
                <div style={{ fontSize: "13px", color: "var(--text2)" }}>
                  Unlock all drills and features
                </div>
              </div>
              <Link
                href="/subscribe"
                style={{
                  background: "var(--accent)",
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: "8px",
                  padding: "9px 18px",
                  fontSize: "14px",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                Upgrade to Pro &#8594;
              </Link>
            </div>
          )}
        </div>

        {/* Sign out */}
        <button
          onClick={async () => {
            const supabase = getSupabase();
            await supabase.auth.signOut();
            router.push("/");
          }}
          style={{
            width: "100%",
            background: "transparent",
            border: "1px solid #3a1a1a",
            borderRadius: "12px",
            color: "#ef4444",
            fontSize: "14px",
            fontWeight: 600,
            padding: "14px",
            cursor: "pointer",
            marginBottom: "32px",
          }}
        >
          Sign Out
        </button>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            fontSize: "13px",
            color: "var(--text3)",
          }}
        >
          Rize Athlete
        </div>
      </div>
    </div>
  );
}
