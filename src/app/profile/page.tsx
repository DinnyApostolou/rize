"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";

interface Profile {
  username: string;
  display_name?: string;
  avatar_url?: string;
  xp: number;
  streak: number;
  drills_completed: number;
  is_subscribed: boolean;
}

const POSITIONS = ["PG", "SG", "SF", "PF", "C", "Not sure"];
const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced"];
const GOALS = ["Make varsity", "College ball", "Go pro", "Get fit", "Just for fun", "Improve my game"];

function getLevel(xp: number) { return Math.floor(xp / 500) + 1; }
function getXpProgress(xp: number) { return xp % 500; }
function getInitials(name: string) {
  if (!name) return "?";
  return name.split(/\s+/).filter(w => w.length > 0).map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?";
}

function getRankLabel(level: number) {
  if (level >= 20) return { label: "LEGEND", color: "#f59e0b" };
  if (level >= 10) return { label: "ELITE", color: "#a78bfa" };
  if (level >= 5) return { label: "VARSITY", color: "#0ea5e9" };
  return { label: "ROOKIE", color: "#6b7280" };
}

export default function ProfilePage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Editable fields
  const [displayName, setDisplayName] = useState("");
  const [editingDisplayName, setEditingDisplayName] = useState(false);
  const [displayNameInput, setDisplayNameInput] = useState("");
  const [savingName, setSavingName] = useState(false);

  const [position, setPosition] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [goal, setGoal] = useState("");
  const [editingPosition, setEditingPosition] = useState(false);
  const [editingSkill, setEditingSkill] = useState(false);
  const [editingGoal, setEditingGoal] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = getSupabase();
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) { router.push("/login"); return; }

      setUserId(user.id);
      setEmail(user.email ?? "");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single() as { data: any };
      const p: Profile = data || {
        username: user.email?.split("@")[0] || "Athlete",
        xp: 0, streak: 0, drills_completed: 0, is_subscribed: false,
      };
      setProfile(p);

      const dn = (data?.display_name as string) || localStorage.getItem("rize_display_name") || "";
      setDisplayName(dn);
      setDisplayNameInput(dn);

      if (data?.avatar_url) setAvatarUrl(data.avatar_url as string);

      setPosition(localStorage.getItem("rize_position") ?? "");
      setSkillLevel(localStorage.getItem("rize_skill_level") ?? "");
      setGoal(localStorage.getItem("rize_goal") ?? "");
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    setUploading(true);
    try {
      const supabase = getSupabase();
      const ext = file.name.split(".").pop();
      const path = `${userId}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
        const url = urlData.publicUrl + "?t=" + Date.now();
        setAvatarUrl(url);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from("profiles") as any).update({ avatar_url: url }).eq("id", userId);
      } else {
        // Fallback: store as base64 in localStorage
        const reader = new FileReader();
        reader.onload = (ev) => {
          const b64 = ev.target?.result as string;
          setAvatarUrl(b64);
          localStorage.setItem("rize_avatar", b64);
        };
        reader.readAsDataURL(file);
      }
    } catch {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const b64 = ev.target?.result as string;
        setAvatarUrl(b64);
        localStorage.setItem("rize_avatar", b64);
      };
      reader.readAsDataURL(file);
    }
    setUploading(false);
  }

  async function saveDisplayName() {
    if (!displayNameInput.trim()) return;
    setSavingName(true);
    const name = displayNameInput.trim();
    setDisplayName(name);
    localStorage.setItem("rize_display_name", name);
    try {
      const supabase = getSupabase();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("profiles") as any).update({ display_name: name }).eq("id", userId);
    } catch { /* non-critical */ }
    setEditingDisplayName(false);
    setSavingName(false);
  }

  function selectPosition(v: string) { setPosition(v); localStorage.setItem("rize_position", v); setEditingPosition(false); }
  function selectSkillLevel(v: string) { setSkillLevel(v); localStorage.setItem("rize_skill_level", v); setEditingSkill(false); }
  function selectGoal(v: string) { setGoal(v); localStorage.setItem("rize_goal", v); setEditingGoal(false); }

  useEffect(() => {
    const saved = localStorage.getItem("rize_avatar");
    if (saved && !avatarUrl) setAvatarUrl(saved);
  }, [avatarUrl]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text2)" }}>
      Loading...
    </div>
  );
  if (!profile) return null;

  const xp = profile.xp ?? 0;
  const level = getLevel(xp);
  const xpProgress = getXpProgress(xp);
  const rank = getRankLabel(level);
  const displayedName = displayName || profile.username || "Athlete";
  const initials = getInitials(displayedName);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <Sidebar username={displayedName} level={level} xp={xp} isSubscribed={profile.is_subscribed} />

      <main style={{ marginLeft: "220px", flex: 1, padding: "48px 52px 80px", maxWidth: "760px" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <p style={{ fontSize: "11px", color: "var(--accent)", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Account</p>
          <h1 style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1 }}>Your Profile</h1>
        </div>

        {/* Hero identity card */}
        <div style={{
          background: "linear-gradient(135deg, #111111 0%, rgba(14,165,233,0.04) 100%)",
          border: "1px solid var(--border)", borderRadius: "16px",
          padding: "32px", marginBottom: "16px",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "24px" }}>

            {/* Avatar with upload */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div
                onClick={() => fileRef.current?.click()}
                style={{
                  width: "88px", height: "88px", borderRadius: "50%",
                  background: avatarUrl ? "transparent" : "rgba(14,165,233,0.12)",
                  border: "2px solid rgba(14,165,233,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "30px", fontWeight: 800, color: "var(--accent)",
                  cursor: "pointer", overflow: "hidden", position: "relative",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(14,165,233,0.7)";
                  const overlay = e.currentTarget.querySelector(".cam-overlay") as HTMLDivElement;
                  if (overlay) overlay.style.opacity = "1";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(14,165,233,0.3)";
                  const overlay = e.currentTarget.querySelector(".cam-overlay") as HTMLDivElement;
                  if (overlay) overlay.style.opacity = "0";
                }}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  uploading ? "..." : initials
                )}
                {/* hover overlay */}
                <div className="cam-overlay" style={{
                  position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: 0, transition: "opacity 0.2s", borderRadius: "50%",
                  fontSize: "22px",
                }}>📷</div>
              </div>
              {uploading && (
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: "20px", height: "20px", border: "2px solid var(--accent)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarUpload} />
              <div style={{ textAlign: "center", marginTop: "6px", fontSize: "10px", color: "var(--text3)" }}>tap to change</div>
            </div>

            {/* Identity info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Display name */}
              {editingDisplayName ? (
                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
                  <input
                    value={displayNameInput}
                    onChange={e => setDisplayNameInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") saveDisplayName(); if (e.key === "Escape") setEditingDisplayName(false); }}
                    autoFocus
                    placeholder="What should we call you?"
                    style={{
                      background: "var(--bg3)", border: "1px solid var(--accent)", borderRadius: "8px",
                      color: "var(--text)", fontSize: "18px", fontWeight: 700, padding: "6px 12px",
                      outline: "none", flex: 1, letterSpacing: "-0.3px",
                    }}
                  />
                  <button onClick={saveDisplayName} disabled={savingName} style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: "7px", padding: "7px 14px", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
                    {savingName ? "..." : "Save"}
                  </button>
                  <button onClick={() => setEditingDisplayName(false)} style={{ background: "transparent", border: "none", color: "var(--text3)", fontSize: "13px", cursor: "pointer" }}>✕</button>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <div style={{ fontSize: "22px", fontWeight: 900, letterSpacing: "-0.5px" }}>{displayedName}</div>
                  <button
                    onClick={() => { setDisplayNameInput(displayName); setEditingDisplayName(true); }}
                    style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "6px", color: "var(--text3)", fontSize: "11px", padding: "3px 10px", cursor: "pointer" }}
                  >
                    edit name
                  </button>
                </div>
              )}

              <div style={{ fontSize: "12px", color: "var(--text3)", marginBottom: "14px" }}>{email}</div>

              {/* Rank badge + level */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                <span style={{
                  fontSize: "10px", fontWeight: 800, letterSpacing: "1.5px",
                  background: `${rank.color}22`, border: `1px solid ${rank.color}55`,
                  borderRadius: "5px", padding: "3px 10px", color: rank.color,
                }}>{rank.label}</span>
                <span style={{ fontSize: "12px", color: "var(--text2)" }}>Level {level} Athlete</span>
              </div>

              {/* XP bar */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "11px", color: "var(--accent)", fontWeight: 700, whiteSpace: "nowrap" }}>Lv {level}</span>
                <div style={{ flex: 1, height: "5px", background: "var(--border)", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{
                    width: `${(xpProgress / 500) * 100}%`, height: "100%", borderRadius: "3px",
                    background: "linear-gradient(90deg, #0EA5E9, #38BDF8)",
                    boxShadow: "0 0 8px rgba(14,165,233,0.5)",
                    transition: "width 0.6s ease",
                  }} />
                </div>
                <span style={{ fontSize: "11px", color: "var(--text3)", whiteSpace: "nowrap" }}>{xpProgress}/500 XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade to Pro */}
        {!profile.is_subscribed && (
          <Link href="/subscribe" style={{ textDecoration: "none", display: "block", marginBottom: "16px" }}>
            <div style={{
              background: "linear-gradient(135deg, rgba(14,165,233,0.1), rgba(56,189,248,0.04))",
              border: "1px solid rgba(14,165,233,0.3)", borderRadius: "12px", padding: "18px 24px",
              display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(14,165,233,0.6)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(14,165,233,0.3)"; }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--accent)", marginBottom: "3px" }}>★ Upgrade to Pro — $7.99/month</div>
                <div style={{ fontSize: "12px", color: "var(--text2)" }}>Unlock all drills, programs, nutrition plans, camera tracking and more.</div>
              </div>
              <span style={{ color: "var(--accent)", fontSize: "18px", marginLeft: "16px", flexShrink: 0 }}>→</span>
            </div>
          </Link>
        )}

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "16px" }}>
          {[
            { label: "Total XP", value: xp.toLocaleString() },
            { label: "Level", value: level },
            { label: "Day Streak", value: profile.streak ?? 0 },
            { label: "Drills Done", value: profile.drills_completed ?? 0 },
          ].map(stat => (
            <div key={stat.label} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px 12px", textAlign: "center" }}>
              <div style={{ fontSize: "22px", fontWeight: 800, color: "#38BDF8", marginBottom: "4px", textShadow: "0 0 24px rgba(14,165,233,0.55), 0 0 8px rgba(14,165,233,0.3)" }}>{stat.value}</div>
              <div style={{ fontSize: "11px", color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Athlete details */}
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "11px", fontWeight: 700, color: "var(--text3)", marginBottom: "20px", textTransform: "uppercase", letterSpacing: "1.5px" }}>Athlete Details</h2>

          {/* Position */}
          <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: "16px", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: editingPosition ? "12px" : 0 }}>
              <div>
                <div style={{ fontSize: "11px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "3px" }}>Position</div>
                <div style={{ fontSize: "14px", color: position ? "var(--text)" : "var(--text3)" }}>{position || "Not set"}</div>
              </div>
              {!editingPosition && <button onClick={() => setEditingPosition(true)} style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "7px", color: "var(--text2)", fontSize: "12px", padding: "5px 12px", cursor: "pointer" }}>Edit</button>}
            </div>
            {editingPosition && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {POSITIONS.map(p => (
                  <button key={p} onClick={() => selectPosition(p)} style={{ background: position === p ? "var(--accent)" : "var(--bg3)", border: `1px solid ${position === p ? "var(--accent)" : "var(--border)"}`, borderRadius: "7px", color: position === p ? "#fff" : "var(--text2)", fontSize: "13px", fontWeight: position === p ? 600 : 400, padding: "7px 14px", cursor: "pointer" }}>{p}</button>
                ))}
                <button onClick={() => setEditingPosition(false)} style={{ background: "transparent", border: "none", color: "var(--text3)", fontSize: "13px", padding: "7px 6px", cursor: "pointer" }}>Cancel</button>
              </div>
            )}
          </div>

          {/* Skill Level */}
          <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: "16px", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: editingSkill ? "12px" : 0 }}>
              <div>
                <div style={{ fontSize: "11px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "3px" }}>Skill Level</div>
                <div style={{ fontSize: "14px", color: skillLevel ? "var(--text)" : "var(--text3)" }}>{skillLevel || "Not set"}</div>
              </div>
              {!editingSkill && <button onClick={() => setEditingSkill(true)} style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "7px", color: "var(--text2)", fontSize: "12px", padding: "5px 12px", cursor: "pointer" }}>Edit</button>}
            </div>
            {editingSkill && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {SKILL_LEVELS.map(s => (
                  <button key={s} onClick={() => selectSkillLevel(s)} style={{ background: skillLevel === s ? "var(--accent)" : "var(--bg3)", border: `1px solid ${skillLevel === s ? "var(--accent)" : "var(--border)"}`, borderRadius: "7px", color: skillLevel === s ? "#fff" : "var(--text2)", fontSize: "13px", fontWeight: skillLevel === s ? 600 : 400, padding: "7px 14px", cursor: "pointer" }}>{s}</button>
                ))}
                <button onClick={() => setEditingSkill(false)} style={{ background: "transparent", border: "none", color: "var(--text3)", fontSize: "13px", padding: "7px 6px", cursor: "pointer" }}>Cancel</button>
              </div>
            )}
          </div>

          {/* Goal */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: editingGoal ? "12px" : 0 }}>
              <div>
                <div style={{ fontSize: "11px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "3px" }}>Goal</div>
                <div style={{ fontSize: "14px", color: goal ? "var(--text)" : "var(--text3)" }}>{goal || "Not set"}</div>
              </div>
              {!editingGoal && <button onClick={() => setEditingGoal(true)} style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "7px", color: "var(--text2)", fontSize: "12px", padding: "5px 12px", cursor: "pointer" }}>Edit</button>}
            </div>
            {editingGoal && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {GOALS.map(g => (
                  <button key={g} onClick={() => selectGoal(g)} style={{ background: goal === g ? "var(--accent)" : "var(--bg3)", border: `1px solid ${goal === g ? "var(--accent)" : "var(--border)"}`, borderRadius: "7px", color: goal === g ? "#fff" : "var(--text2)", fontSize: "13px", fontWeight: goal === g ? 600 : 400, padding: "7px 14px", cursor: "pointer" }}>{g}</button>
                ))}
                <button onClick={() => setEditingGoal(false)} style={{ background: "transparent", border: "none", color: "var(--text3)", fontSize: "13px", padding: "7px 6px", cursor: "pointer" }}>Cancel</button>
              </div>
            )}
          </div>
        </div>

        {/* Subscription */}
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "11px", fontWeight: 700, color: "var(--text3)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1.5px" }}>Subscription</h2>
          {profile.is_subscribed ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", flexShrink: 0, boxShadow: "0 0 8px #22c55e" }} />
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "2px" }}>Pro Member</div>
                <div style={{ fontSize: "12px", color: "var(--text2)" }}>Full access to everything — keep grinding.</div>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "2px" }}>Free Plan</div>
                <div style={{ fontSize: "12px", color: "var(--text2)" }}>Limited access — upgrade to unlock everything.</div>
              </div>
              <Link href="/subscribe" style={{ background: "var(--accent)", color: "#fff", textDecoration: "none", borderRadius: "8px", padding: "9px 18px", fontSize: "13px", fontWeight: 700, whiteSpace: "nowrap" }}>
                Upgrade to Pro →
              </Link>
            </div>
          )}
        </div>

        {/* Sign out */}
        <button
          onClick={async () => { await getSupabase().auth.signOut(); router.push("/"); }}
          style={{ width: "100%", background: "transparent", border: "1px solid #2a1515", borderRadius: "10px", color: "#ef4444", fontSize: "13px", fontWeight: 600, padding: "13px", cursor: "pointer", transition: "border-color 0.15s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#ef4444"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#2a1515"; }}
        >
          Sign Out
        </button>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </main>
    </div>
  );
}
