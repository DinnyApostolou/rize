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

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <Link href="/" style={{ display: "block", fontSize: "24px", fontWeight: 900, letterSpacing: "-1px", marginBottom: "40px", textAlign: "center" }}>
          RZ<span style={{ color: "var(--accent)" }}>.</span>
        </Link>
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "20px", padding: "40px 36px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "-1px", marginBottom: "8px" }}>Create your account</h1>
          <p style={{ color: "var(--text2)", fontSize: "15px", marginBottom: "32px" }}>Start training free — no card needed</p>
          <form onSubmit={handleSignup}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px", color: "var(--text2)" }}>Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required
                style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "10px", padding: "12px 16px", fontSize: "15px", color: "var(--text)", boxSizing: "border-box" }}
                placeholder="athlete123" />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px", color: "var(--text2)" }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "10px", padding: "12px 16px", fontSize: "15px", color: "var(--text)", boxSizing: "border-box" }}
                placeholder="you@example.com" />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px", color: "var(--text2)" }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "10px", padding: "12px 16px", fontSize: "15px", color: "var(--text)", boxSizing: "border-box" }}
                placeholder="Min 6 characters" />
            </div>
            {error && <p style={{ color: "#ff4d4d", fontSize: "14px", marginBottom: "16px" }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ width: "100%", background: "var(--accent)", color: "#fff", padding: "14px", borderRadius: "10px", fontSize: "16px", fontWeight: 800, opacity: loading ? 0.7 : 1 }}>
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>
          <p style={{ textAlign: "center", marginTop: "24px", color: "var(--text2)", fontSize: "14px" }}>
            Already have an account? <Link href="/login" style={{ color: "var(--accent)", fontWeight: 700 }}>Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
