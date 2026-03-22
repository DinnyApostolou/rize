"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Home" },
  { href: "/drills", label: "Drills" },
  { href: "/strength", label: "Strength" },
  { href: "/nutrition", label: "Nutrition" },
  { href: "/schedule", label: "Schedule" },
  { href: "/stats", label: "Stats" },
  { href: "/badges", label: "Badges" },
  { href: "/assessment", label: "Assessment" },
  { href: "/profile", label: "Profile" },
];

export default function Sidebar({ username, level, xp, isSubscribed }: {
  username?: string;
  level?: number;
  xp?: number;
  isSubscribed?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await getSupabase().auth.signOut();
    router.push("/");
  }

  return (
    <aside style={{
      width: "220px", flexShrink: 0,
      background: "var(--bg2)", borderRight: "1px solid var(--border)",
      position: "fixed", top: 0, left: 0, bottom: 0,
      display: "flex", flexDirection: "column",
      zIndex: 50,
    }}>
      <div style={{ padding: "20px 20px", borderBottom: "1px solid var(--border)" }}>
        <Link href="/dashboard">
          <div style={{ fontSize: "17px", fontWeight: 900, letterSpacing: "-0.5px", cursor: "pointer" }}>
            RIZE<span style={{ color: "var(--accent)" }}>.</span>
          </div>
        </Link>
      </div>

      <nav style={{ padding: "10px", flex: 1, overflowY: "auto" }}>
        {NAV.map(n => {
          const active = pathname === n.href;
          return (
            <Link key={n.href} href={n.href}>
              <div style={{
                padding: "9px 12px", borderRadius: "7px", marginBottom: "1px",
                fontSize: "14px", fontWeight: active ? 600 : 400,
                color: active ? "#fff" : "var(--text2)",
                background: active ? "var(--bg3)" : "transparent",
                cursor: "pointer", transition: "all 0.15s",
                borderLeft: active ? "2px solid var(--accent)" : "2px solid transparent",
              }}
                onMouseEnter={e => { if (!active) { const el = e.currentTarget as HTMLDivElement; el.style.background = "var(--bg3)"; el.style.color = "#fff"; } }}
                onMouseLeave={e => { if (!active) { const el = e.currentTarget as HTMLDivElement; el.style.background = "transparent"; el.style.color = "var(--text2)"; } }}>
                {n.label}
              </div>
            </Link>
          );
        })}

        {!isSubscribed && (
          <Link href="/subscribe">
            <div style={{
              padding: "9px 12px", borderRadius: "7px", marginTop: "10px",
              fontSize: "13px", fontWeight: 600, color: "var(--accent)",
              background: "rgba(14,165,233,0.07)",
              border: "1px solid rgba(14,165,233,0.18)",
              cursor: "pointer", transition: "all 0.15s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(14,165,233,0.14)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(14,165,233,0.07)"; }}>
              Upgrade to Pro
            </div>
          </Link>
        )}
      </nav>

      <div style={{ padding: "14px", borderTop: "1px solid var(--border)" }}>
        {username && (
          <div style={{ marginBottom: "10px" }}>
            <div style={{ fontSize: "13px", fontWeight: 600 }}>{username}</div>
            <div style={{ fontSize: "11px", color: "var(--text3)", marginTop: "2px" }}>
              {level ? `Level ${level}` : ""}{xp ? ` · ${xp.toLocaleString()} XP` : ""}
            </div>
          </div>
        )}
        <button onClick={handleLogout} style={{
          width: "100%", background: "none", border: "1px solid var(--border)",
          color: "var(--text3)", fontSize: "12px", padding: "7px",
          borderRadius: "6px", cursor: "pointer", transition: "all 0.15s",
        }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = "#555"; el.style.color = "#fff"; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = "var(--border)"; el.style.color = "var(--text3)"; }}>
          Sign out
        </button>
      </div>
    </aside>
  );
}
