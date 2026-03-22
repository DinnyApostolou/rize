"use client";

export default function Basketball3D() {
  return (
    <div style={{ width: "100%", height: "260px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <div style={{
        position: "absolute",
        width: "180px", height: "180px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(234,88,12,0.35) 0%, transparent 70%)",
        filter: "blur(28px)",
        pointerEvents: "none",
      }} />
      <div style={{
        fontSize: "140px",
        lineHeight: 1,
        animation: "illustrationFloat 3.8s ease-in-out infinite",
        filter: "drop-shadow(0 24px 40px rgba(200,70,5,0.65))",
        userSelect: "none",
      }}>
        🏀
      </div>
      <p style={{ fontSize: "11px", color: "var(--text3)", marginTop: "12px", letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: 600 }}>Basketball Training</p>
    </div>
  );
}
