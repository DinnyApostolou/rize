"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  async function handleForgotPassword() {
    if (!email) { setError("Enter your email above first"); return; }
    setResetLoading(true);
    const supabase = getSupabase();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setResetSent(true);
    setResetLoading(false);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = getSupabase();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
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
        <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div style={{ width: "100%", maxWidth: "420px", position: "relative", zIndex: 1 }}>
        <Link href="/" style={{ display: "block", fontSize: "20px", fontWeight: 900, letterSpacing: "-0.5px", marginBottom: "48px", textAlign: "center" }}>
          RIZE<span style={{ color: "var(--accent)" }}>.</span>
        </Link>

        <div style={{
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px",
          padding: "40px 36px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
        }}>
          <h1 style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "-1px", marginBottom: "8px" }}>Welcome back</h1>
          <p style={{ color: "var(--text2)", fontSize: "14px", marginBottom: "32px" }}>Log in to your Rize account</p>

          <form onSubmit={handleLogin}>
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
                type="password" value={password} onChange={e => setPassword(e.target.value)} required
                style={inputStyle("password")}
                placeholder="••••••••"
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            {error && (
              <div style={{ background: "rgba(255,77,77,0.1)", border: "1px solid rgba(255,77,77,0.3)", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px" }}>
                <p style={{ color: "#ff6b6b", fontSize: "13px" }}>{error}</p>
              </div>
            )}
            {resetSent && (
              <div style={{ background: "rgba(0,230,118,0.08)", border: "1px solid rgba(0,230,118,0.25)", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px" }}>
                <p style={{ color: "var(--green)", fontSize: "13px" }}>Reset link sent — check your email.</p>
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
              {loading ? "Logging in..." : "Log In →"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <button onClick={handleForgotPassword} disabled={resetLoading} style={{
              background: "none", color: "var(--text3)", fontSize: "13px",
              textDecoration: "underline", cursor: "pointer", transition: "color 0.2s",
            }}
              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = "var(--text2)")}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = "var(--text3)")}>
              {resetLoading ? "Sending..." : "Forgot password?"}
            </button>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: "24px", paddingTop: "24px", textAlign: "center" }}>
            <p style={{ color: "var(--text2)", fontSize: "14px" }}>
              Don&apos;t have an account?{" "}
              <Link href="/signup" style={{ color: "var(--accent)", fontWeight: 700 }}>Sign up free</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
