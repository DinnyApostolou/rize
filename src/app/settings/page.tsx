"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";

export default function SettingsPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [position, setPosition] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = getSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setEmail(user.email || "");
      setDisplayName(localStorage.getItem("rize_display_name") || "");
      setPosition(localStorage.getItem("rize_position") || "");
      setSkillLevel(localStorage.getItem("rize_skill_level") || "");
    }
    load();
  }, [router]);

  async function saveProfile() {
    setSaving(true);
    localStorage.setItem("rize_display_name", displayName);
    localStorage.setItem("rize_position", position);
    localStorage.setItem("rize_skill_level", skillLevel);
    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("profiles") as any).update({ display_name: displayName }).eq("id", user.id);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function signOut() {
    await getSupabase().auth.signOut();
    router.push("/");
  }

  const POSITIONS = ["Point Guard (PG)", "Shooting Guard (SG)", "Small Forward (SF)", "Power Forward (PF)", "Center (C)"];
  const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced", "Elite"];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <Sidebar />
      <main className="inner-main" style={{ flex: 1, padding: "48px 52px 80px", maxWidth: "640px" }}>
        <div style={{ marginBottom: "36px" }}>
          <p style={{ fontSize: "11px", color: "var(--accent)", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Account</p>
          <h1 style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-1.5px" }}>Settings</h1>
        </div>

        {/* Profile section */}
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "14px", padding: "28px", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 800, marginBottom: "20px" }}>Profile</h2>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "6px" }}>Display Name</label>
            <input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="What should we call you?" style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "8px", padding: "11px 14px", fontSize: "14px", color: "var(--text)" }} />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "6px" }}>Position</label>
            <select value={position} onChange={e => setPosition(e.target.value)} style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "8px", padding: "11px 14px", fontSize: "14px", color: "var(--text)" }}>
              <option value="">Select position...</option>
              {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "6px" }}>Skill Level</label>
            <select value={skillLevel} onChange={e => setSkillLevel(e.target.value)} style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "8px", padding: "11px 14px", fontSize: "14px", color: "var(--text)" }}>
              <option value="">Select level...</option>
              {SKILL_LEVELS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button onClick={saveProfile} disabled={saving} style={{ background: saved ? "#10B981" : "var(--accent)", color: "#fff", padding: "11px 24px", borderRadius: "8px", fontSize: "14px", fontWeight: 700, opacity: saving ? 0.7 : 1 }}>
            {saved ? "✓ Saved" : saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Account section */}
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "14px", padding: "28px", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 800, marginBottom: "20px" }}>Account</h2>
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "12px", color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Email</div>
            <div style={{ fontSize: "14px", color: "var(--text2)" }}>{email}</div>
          </div>
          <button onClick={() => router.push("/reset-password")} style={{ background: "var(--bg3)", border: "1px solid var(--border)", color: "var(--text)", padding: "10px 20px", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
            Change Password
          </button>
        </div>

        {/* Sign out */}
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "14px", padding: "28px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 800, marginBottom: "8px" }}>Sign Out</h2>
          <p style={{ fontSize: "13px", color: "var(--text2)", marginBottom: "16px" }}>You&apos;ll need to sign back in to access your account.</p>
          <button onClick={signOut} style={{ background: "transparent", border: "1px solid #ef4444", color: "#ef4444", padding: "10px 24px", borderRadius: "8px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
            Sign Out
          </button>
        </div>
      </main>
    </div>
  );
}
