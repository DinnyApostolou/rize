"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [linkExpired, setLinkExpired] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();

    // Implicit flow: Supabase puts the token in the URL hash
    // The client automatically picks it up and fires PASSWORD_RECOVERY
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });

    // If the user already has a valid session (e.g. page refresh)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });

    // After 8 seconds with no recovery event, assume link is expired/bad
    const timeout = setTimeout(() => {
      setLinkExpired(true);
    }, 8000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords don't match"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    setError("");
    const supabase = getSupabase();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setError(error.message); setLoading(false); return; }
    setSuccess(true);
    setTimeout(() => router.push("/login"), 2500);
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <Link href="/" style={{ display: "block", fontSize: "24px", fontWeight: 900, letterSpacing: "-1px", marginBottom: "40px", textAlign: "center" }}>
          RZ<span style={{ color: "var(--accent)" }}>.</span>
        </Link>
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "20px", padding: "40px 36px" }}>
          {success ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
              <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "8px" }}>Password updated!</h2>
              <p style={{ color: "var(--text2)" }}>Redirecting to login...</p>
            </div>
          ) : linkExpired && !ready ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>⏱️</div>
              <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>Link expired</h2>
              <p style={{ color: "var(--text2)", fontSize: "14px", lineHeight: 1.7, marginBottom: "24px" }}>
                This reset link has expired or already been used. Request a new one from the login page.
              </p>
              <Link href="/login" style={{
                display: "inline-block", background: "var(--accent)", color: "#fff",
                padding: "12px 28px", borderRadius: "10px", fontWeight: 700, fontSize: "14px",
              }}>
                Back to Login →
              </Link>
            </div>
          ) : !ready ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "32px", marginBottom: "16px" }}>🔐</div>
              <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>Verifying link...</h2>
              <p style={{ color: "var(--text2)", fontSize: "14px" }}>Just a second...</p>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: "28px", fontWeight: 900, letterSpacing: "-1px", marginBottom: "8px" }}>Set new password</h1>
              <p style={{ color: "var(--text2)", fontSize: "15px", marginBottom: "32px" }}>Choose a new password for your account</p>
              <form onSubmit={handleReset}>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px", color: "var(--text2)" }}>New Password</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                    style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "10px", padding: "12px 16px", fontSize: "15px", color: "var(--text)", boxSizing: "border-box" }}
                    placeholder="Min 6 characters" />
                </div>
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px", color: "var(--text2)" }}>Confirm Password</label>
                  <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required
                    style={{ width: "100%", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "10px", padding: "12px 16px", fontSize: "15px", color: "var(--text)", boxSizing: "border-box" }}
                    placeholder="Re-enter password" />
                </div>
                {error && <p style={{ color: "#ff4d4d", fontSize: "14px", marginBottom: "16px" }}>{error}</p>}
                <button type="submit" disabled={loading} style={{ width: "100%", background: "var(--accent)", color: "#fff", padding: "14px", borderRadius: "10px", fontSize: "16px", fontWeight: 800, opacity: loading ? 0.7 : 1 }}>
                  {loading ? "Updating..." : "Update Password →"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
