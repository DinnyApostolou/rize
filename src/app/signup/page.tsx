"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = getSupabase();
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { username } } });
    if (error) { setError(error.message); setLoading(false); return; }
    if (data.user) {
      await (supabase.from("profiles") as any).insert({ id: data.user.id, username, xp: 0, streak: 0, is_subscribed: false });
    }
    router.push("/dashboard");
  }

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    background: "var(--bg3)",
    border: `1px solid ${focusedField === field ? "var(--accent)" : "var(--border)"}`,
    borderRadius: "12px",
    padding: "14px 16px",
    fontSize: "15px",
    color: "var(--text)",
    boxSizing: "border-box",
    transition: "all 0.2s",
    boxShadow: focusedField === field ? "0 0 0 3px rgba(0,116,255,0.12)" : "none",
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", position: "relative", overflow: "hidden" }}>

      {/* Background glow */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)", width: "600px", height: "400px", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,116,255,0.15) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", bottom: "-10%", left: "-10%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(16,185,129,0.07) 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div style={{ width: "100%", maxWidth: "420px", position: "relative", zIndex: 1 }}>
        <Link href="/" style={{ display: "block", fontSize: "20px", fontWeight: 900, letterSpacing: "-0.5px", marginBottom: "48px", textAlign: "center" }}>
          RIZE<span style={{ color: "var(--accent)" }}>.</span>
        </Link>

        {/* Trust badges */}
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "24px", flexWrap: "wrap" }}>
          {["Free to start", "No card needed", "Cancel anytime"].map(b => (
            <div key={b} style={{ display: "flex", alignItems: "center", gap: "5px", background: "rgba(0,230,118,0.08)", border: "1px solid rgba(0,230,118,0.2)", borderRadius: "999px", padding: "4px 10px" }}>
              <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--green)", flexShrink: 0 }} />
              <span style={{ fontSize: "11px", color: "var(--green)", fontWeight: 600 }}>{b}</span>
            </div>
          ))}
        </div>

        <div style={{
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px",
          padding: "40px 36px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
        }}>
          <h1 style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "-1px", marginBottom: "8px" }}>Create your account</h1>
          <p style={{ color: "var(--text2)", fontSize: "14px", marginBottom: "32px" }}>Join 500+ athletes already training with Rize</p>

          <form onSubmit={handleSignup}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "8px", color: "var(--text2)", letterSpacing: "0.5px" }}>USERNAME</label>
              <input
                type="text" value={username} onChange={e => setUsername(e.target.value)} required
                style={inputStyle("username")}
                placeholder="athlete123"
                onFocus={() => setFocusedField("username")}
                onBlur={() => setFocusedField(null)}
                autoFocus
              />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "8px", color: "var(--text2)", letterSpacing: "0.5px" }}>EMAIL</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                style={inputStyle("email")}
                placeholder="you@example.com"
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "8px", color: "var(--text2)", letterSpacing: "0.5px" }}>PASSWORD</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                style={inputStyle("password")}
                placeholder="Min 6 characters"
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            {error && (
              <div style={{ background: "rgba(255,77,77,0.1)", border: "1px solid rgba(255,77,77,0.3)", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px" }}>
                <p style={{ color: "#ff6b6b", fontSize: "13px" }}>{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: "100%", background: "var(--accent)", color: "#fff",
              padding: "15px", borderRadius: "12px", fontSize: "15px", fontWeight: 800,
              opacity: loading ? 0.7 : 1, cursor: loading ? "default" : "pointer",
              boxShadow: "0 4px 20px rgba(0,116,255,0.35)",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
            >
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: "24px", paddingTop: "24px", textAlign: "center" }}>
            <p style={{ color: "var(--text2)", fontSize: "14px" }}>
              Already have an account?{" "}
              <Link href="/login" style={{ color: "var(--accent)", fontWeight: 700 }}>Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
