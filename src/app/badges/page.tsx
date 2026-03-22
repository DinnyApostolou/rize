"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";

const BADGES = [
  { id: 1, name: "First Step", icon: "👟", desc: "Complete your first drill", rarity: "Common", earned: true },
  { id: 2, name: "On Fire", icon: "🔥", desc: "3-day training streak", rarity: "Common", earned: true },
  { id: 3, name: "Hooper", icon: "🏀", desc: "Complete 10 drills", rarity: "Common", earned: false },
  { id: 4, name: "Grinder", icon: "💪", desc: "Train 7 days in a row", rarity: "Uncommon", earned: false },
  { id: 5, name: "Shooter", icon: "🎯", desc: "Complete all shooting drills", rarity: "Uncommon", earned: false },
  { id: 6, name: "Iron Man", icon: "⚡", desc: "14-day training streak", rarity: "Uncommon", earned: false },
  { id: 7, name: "Court Vision", icon: "👁️", desc: "Complete the skill assessment", rarity: "Uncommon", earned: true },
  { id: 8, name: "Power Forward", icon: "🏋️", desc: "Complete all strength programs", rarity: "Rare", earned: false },
  { id: 9, name: "Buckets", icon: "🪣", desc: "Complete 50 drills", rarity: "Rare", earned: false },
  { id: 10, name: "Nutrition Pro", icon: "🥗", desc: "View all meal plans", rarity: "Rare", earned: false },
  { id: 11, name: "30-Day Beast", icon: "📅", desc: "30-day training streak", rarity: "Rare", earned: false },
  { id: 12, name: "Level 5", icon: "🆙", desc: "Reach Level 5", rarity: "Rare", earned: false },
  { id: 13, name: "Handles God", icon: "🔮", desc: "Master all ball handling drills", rarity: "Epic", earned: false },
  { id: 14, name: "Lock Down", icon: "🔒", desc: "Complete all defensive drills", rarity: "Epic", earned: false },
  { id: 15, name: "Athlete", icon: "🏆", desc: "Reach Level 10", rarity: "Epic", earned: false },
  { id: 16, name: "100 Drills", icon: "💯", desc: "Complete 100 total drills", rarity: "Epic", earned: false },
  { id: 17, name: "60-Day Streak", icon: "🗓️", desc: "60-day training streak", rarity: "Epic", earned: false },
  { id: 18, name: "Elite", icon: "💎", desc: "Reach Level 20", rarity: "Legendary", earned: false },
  { id: 19, name: "Untouchable", icon: "👑", desc: "Complete every drill in the app", rarity: "Legendary", earned: false },
  { id: 20, name: "365", icon: "🌟", desc: "Train every day for a year", rarity: "Legendary", earned: false },
  { id: 21, name: "OG", icon: "🔑", desc: "Joined Rize in the first month", rarity: "Legendary", earned: true },
  { id: 22, name: "Pro Athlete", icon: "🚀", desc: "Subscribed to Rize Pro", rarity: "Epic", earned: false },
];

const rarityColors: Record<string, string> = {
  Common: "#9ca3af",
  Uncommon: "#22c55e",
  Rare: "#3b82f6",
  Epic: "#a855f7",
  Legendary: "#f59e0b",
};

export default function BadgesPage() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "EARNED", "Common", "Uncommon", "Rare", "Epic", "Legendary"];
  const filtered = BADGES.filter(b => {
    if (filter === "All") return true;
    if (filter === "EARNED") return b.earned;
    return b.rarity === filter;
  });
  const earned = BADGES.filter(b => b.earned).length;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <Sidebar />

      <main className="inner-main" style={{ flex: 1, padding: "48px 52px", maxWidth: "900px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-1px" }}>Badge Collection</h1>
            <p style={{ color: "var(--text2)", marginTop: "8px" }}>{earned} / {BADGES.length} earned</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "28px", fontWeight: 900, color: "var(--accent)" }}>{Math.round((earned / BADGES.length) * 100)}%</div>
            <div style={{ fontSize: "13px", color: "var(--text2)" }}>Complete</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ background: "var(--bg3)", borderRadius: "100px", height: "8px", marginBottom: "32px" }}>
          <div style={{ background: "linear-gradient(90deg, var(--accent), #ffd700)", height: "100%", borderRadius: "100px", width: `${(earned / BADGES.length) * 100}%` }} />
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "32px" }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "8px 16px", borderRadius: "100px", fontSize: "13px", fontWeight: 600,
              background: filter === f ? "var(--accent)" : "var(--bg2)",
              border: `1px solid ${filter === f ? "var(--accent)" : "var(--border)"}`,
              color: filter === f ? "#fff" : "var(--text2)",
            }}>{f}</button>
          ))}
        </div>

        {/* Badges grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px" }}>
          {filtered.map(b => (
            <div key={b.id} style={{
              background: "var(--bg2)", border: `1px solid ${b.earned ? rarityColors[b.rarity] : "var(--border)"}`,
              borderRadius: "16px", padding: "20px 16px", textAlign: "center",
              opacity: b.earned ? 1 : 0.4, transition: "opacity 0.2s",
            }}>
              <div style={{ fontSize: "36px", marginBottom: "8px" }}>{b.icon}</div>
              <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "4px" }}>{b.name}</div>
              <div style={{ fontSize: "11px", color: rarityColors[b.rarity], fontWeight: 600, marginBottom: "8px", textTransform: "uppercase" }}>{b.rarity}</div>
              <div style={{ fontSize: "12px", color: "var(--text2)", lineHeight: 1.4 }}>{b.desc}</div>
              {b.earned && <div style={{ marginTop: "8px", fontSize: "12px", color: "var(--green)", fontWeight: 700 }}>✓ Earned</div>}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
