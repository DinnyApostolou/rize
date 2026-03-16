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

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <Link href="/" style={{ display: "block", fontSize: "24px", fontWeight: 900, letterSpacing: "-1px", marginBottom: "40px", textAlign: "center" }}>
          RZ<span style={{ color: "var(--accent)" }}>.</span>
        </Link>
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "20px", padding: "40px 36px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "-1px", marginBottom: "8px" }}>Welcome back</h1>
          <p style={{ color: "var(--text2)", fontSize: "15px", marginBottom: "32px" }}>Log in to your Rize account</p>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px", color: "var(--text2)" }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "10px", padding: "12px 16px", fontSize: "15px", color: "var(--text)", boxSizing: "border-box" }}
                placeholder="you@example.com" />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px", color: "var(--text2)" }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "10px", padding: "12px 16px", fontSize: "15px", color: "var(--text)", boxSizing: "border-box" }}
                placeholder="••••••••" />
            </div>
            {error && <p style={{ color: "#ff4d4d", fontSize: "14px", marginBottom: "16px" }}>{error}</p>}
            {resetSent && <p style={{ color: "var(--green)", fontSize: "14px", marginBottom: "16px" }}>✅ Reset link sent! Check your email.</p>}
            <button type="submit" disabled={loading} style={{ width: "100%", background: "var(--accent)", color: "#fff", padding: "14px", borderRadius: "10px", fontSize: "16px", fontWeight: 800, opacity: loading ? 0.7 : 1 }}>
              {loading ? "Logging in..." : "Log In →"}
            </button>
          </form>
          <p style={{ textAlign: "center", marginTop: "16px", fontSize: "14px" }}>
            <button onClick={handleForgotPassword} disabled={resetLoading} style={{ background: "none", color: "var(--text2)", fontSize: "14px", textDecoration: "underline", cursor: "pointer" }}>
              {resetLoading ? "Sending..." : "Forgot password?"}
            </button>
          </p>
          <p style={{ textAlign: "center", marginTop: "12px", color: "var(--text2)", fontSize: "14px" }}>
            Don't have an account? <Link href="/signup" style={{ color: "var(--accent)", fontWeight: 700 }}>Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
