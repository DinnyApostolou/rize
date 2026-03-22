"use client";

export default function Basketball3D() {
  return (
    <div style={{ width: "100%", height: "280px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <div style={{
        position: "absolute",
        width: "200px", height: "200px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(249,115,22,0.4) 0%, rgba(234,88,12,0.15) 50%, transparent 70%)",
        filter: "blur(30px)",
        pointerEvents: "none",
      }} />

      <svg
        width="190" height="190"
        viewBox="0 0 200 200"
        style={{ animation: "illustrationFloat 3.8s ease-in-out infinite", filter: "drop-shadow(0 18px 36px rgba(234,88,12,0.5))" }}
      >
        <defs>
          <radialGradient id="bball" cx="36%" cy="30%" r="68%">
            <stop offset="0%" stopColor="#FFB060" />
            <stop offset="45%" stopColor="#E8641A" />
            <stop offset="100%" stopColor="#8C3200" />
          </radialGradient>
          <clipPath id="ballClip">
            <circle cx="100" cy="100" r="88" />
          </clipPath>
        </defs>

        <ellipse cx="100" cy="196" rx="58" ry="7" fill="rgba(0,0,0,0.35)" />

        <circle cx="100" cy="100" r="88" fill="url(#bball)" />

        <g clipPath="url(#ballClip)" fill="none" stroke="#3D1200" strokeWidth="3.5" strokeLinecap="round" opacity="0.9">
          <path d="M 12 100 C 50 86 150 114 188 100" />
          <path d="M 12 100 C 50 114 150 86 188 100" />
          <path d="M 100 12 C 68 38 52 70 52 100 C 52 130 68 162 100 188" />
          <path d="M 100 12 C 132 38 148 70 148 100 C 148 130 132 162 100 188" />
        </g>

        <ellipse cx="68" cy="58" rx="24" ry="15" fill="rgba(255,255,255,0.28)" transform="rotate(-30 68 58)" />
        <ellipse cx="79" cy="50" rx="9" ry="5" fill="rgba(255,255,255,0.50)" transform="rotate(-30 79 50)" />
      </svg>

      <p style={{ fontSize: "11px", color: "var(--text3)", marginTop: "10px", letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: 600 }}>Basketball Training</p>
    </div>
  );
}
