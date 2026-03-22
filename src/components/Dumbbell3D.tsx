"use client";

export default function Dumbbell3D() {
  return (
    <div style={{ width: "100%", height: "280px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <div style={{
        position: "absolute",
        width: "280px", height: "130px",
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(139,92,246,0.45) 0%, transparent 70%)",
        filter: "blur(30px)",
        pointerEvents: "none",
      }} />

      <svg
        width="280" height="130"
        viewBox="0 0 280 130"
        style={{ animation: "illustrationFloat 4s ease-in-out infinite", filter: "drop-shadow(0 16px 32px rgba(139,92,246,0.55))" }}
      >
        <defs>
          <linearGradient id="barMetal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B0B8C8" />
            <stop offset="35%" stopColor="#D8DCE8" />
            <stop offset="70%" stopColor="#9098A8" />
            <stop offset="100%" stopColor="#606878" />
          </linearGradient>
          <linearGradient id="plateDark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2e2e42" />
            <stop offset="40%" stopColor="#3d3d56" />
            <stop offset="100%" stopColor="#18181f" />
          </linearGradient>
          <linearGradient id="plateOuter" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#222230" />
            <stop offset="100%" stopColor="#101018" />
          </linearGradient>
          <linearGradient id="blueCollar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38A8FF" />
            <stop offset="100%" stopColor="#0050CC" />
          </linearGradient>
        </defs>

        <ellipse cx="140" cy="126" rx="95" ry="6" fill="rgba(0,0,0,0.3)" />

        <rect x="82" y="56" width="116" height="18" rx="9" fill="url(#barMetal)" />
        <rect x="84" y="57" width="112" height="6" rx="3" fill="rgba(255,255,255,0.22)" />

        <rect x="14" y="37" width="22" height="56" rx="6" fill="url(#plateOuter)" />
        <rect x="14" y="37" width="22" height="5" rx="2.5" fill="rgba(255,255,255,0.07)" />

        <rect x="36" y="30" width="28" height="70" rx="6" fill="url(#plateDark)" />
        <rect x="36" y="30" width="28" height="6" rx="3" fill="rgba(255,255,255,0.10)" />

        <rect x="64" y="46" width="18" height="38" rx="6" fill="url(#blueCollar)" />
        <rect x="64" y="46" width="18" height="7" rx="3" fill="rgba(255,255,255,0.25)" />

        <rect x="198" y="46" width="18" height="38" rx="6" fill="url(#blueCollar)" />
        <rect x="198" y="46" width="18" height="7" rx="3" fill="rgba(255,255,255,0.25)" />

        <rect x="216" y="30" width="28" height="70" rx="6" fill="url(#plateDark)" />
        <rect x="216" y="30" width="28" height="6" rx="3" fill="rgba(255,255,255,0.10)" />

        <rect x="244" y="37" width="22" height="56" rx="6" fill="url(#plateOuter)" />
        <rect x="244" y="37" width="22" height="5" rx="2.5" fill="rgba(255,255,255,0.07)" />
      </svg>

      <p style={{ fontSize: "11px", color: "var(--text3)", marginTop: "10px", letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: 600 }}>Strength Training</p>
    </div>
  );
}
