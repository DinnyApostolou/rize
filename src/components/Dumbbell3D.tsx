"use client";

export default function Dumbbell3D() {
  return (
    <div style={{ width: "100%", height: "260px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <div style={{
        position: "absolute",
        width: "220px", height: "140px",
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(139,92,246,0.35) 0%, transparent 70%)",
        filter: "blur(28px)",
        pointerEvents: "none",
      }} />
      <div style={{
        fontSize: "120px",
        lineHeight: 1,
        animation: "illustrationFloat 4s ease-in-out infinite",
        filter: "drop-shadow(0 24px 40px rgba(139,92,246,0.55))",
        userSelect: "none",
      }}>
        🏋️
      </div>
      <p style={{ fontSize: "11px", color: "var(--text3)", marginTop: "12px", letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: 600 }}>Strength Training</p>
    </div>
  );
}
