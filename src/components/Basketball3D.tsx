"use client";

export default function Basketball3D() {
  return (
    <div style={{ width: "100%", height: "280px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <div style={{
        position: "absolute",
        width: "190px", height: "190px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(220,90,15,0.4) 0%, rgba(180,60,10,0.12) 55%, transparent 75%)",
        filter: "blur(26px)",
        pointerEvents: "none",
      }} />

      <svg width="200" height="200" viewBox="0 0 200 200"
        style={{ animation: "illustrationFloat 3.8s ease-in-out infinite", filter: "drop-shadow(0 22px 44px rgba(160,60,5,0.65))" }}>
        <defs>
          {/* Realistic basketball gradient — strong light source top-left */}
          <radialGradient id="ball" cx="34%" cy="27%" r="74%">
            <stop offset="0%"   stopColor="#F9C07A" />
            <stop offset="12%"  stopColor="#F09030" />
            <stop offset="38%"  stopColor="#D06018" />
            <stop offset="68%"  stopColor="#943008" />
            <stop offset="88%"  stopColor="#5C1500" />
            <stop offset="100%" stopColor="#380800" />
          </radialGradient>

          {/* Subtle pebble texture via turbulence */}
          <filter id="pebble" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" result="noise"/>
            <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise"/>
            <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="blended"/>
            <feComponentTransfer in="blended">
              <feFuncA type="linear" slope="1"/>
            </feComponentTransfer>
          </filter>

          <clipPath id="clip"><circle cx="100" cy="100" r="90"/></clipPath>
        </defs>

        {/* Ground shadow */}
        <ellipse cx="100" cy="198" rx="64" ry="7" fill="rgba(0,0,0,0.45)" />

        {/* Main ball */}
        <circle cx="100" cy="100" r="90" fill="url(#ball)" filter="url(#pebble)" />

        {/* Seam lines */}
        <g clipPath="url(#clip)" fill="none" strokeLinecap="round">
          {/* Horizontal equatorial seam — wavy */}
          <path d="M 10 100 C 38 87 70 115 100 100 C 130 85 162 113 190 100"
            stroke="#1E0600" strokeWidth="4" opacity="0.88"/>

          {/* Left pole-to-pole seam — curves left like a parenthesis ( */}
          <path d="M 100 10 C 62 28 40 65 42 100 C 40 135 62 168 100 190"
            stroke="#1E0600" strokeWidth="4" opacity="0.88"/>

          {/* Right pole-to-pole seam — mirror ) */}
          <path d="M 100 10 C 138 28 160 65 158 100 C 160 135 138 168 100 190"
            stroke="#1E0600" strokeWidth="4" opacity="0.88"/>
        </g>

        {/* Rim edge darkening for 3D sphere */}
        <circle cx="100" cy="100" r="89" fill="none" stroke="rgba(20,5,0,0.55)" strokeWidth="5"/>

        {/* Large soft specular highlight */}
        <ellipse cx="64" cy="55" rx="28" ry="17" fill="rgba(255,225,170,0.28)" transform="rotate(-32 64 55)"/>
        {/* Small bright specular */}
        <ellipse cx="56" cy="46" rx="11" ry="7" fill="rgba(255,250,220,0.60)" transform="rotate(-32 56 46)"/>
        {/* Faint rim light at top edge */}
        <path d="M 38 28 C 56 16 82 10 104 10" stroke="rgba(255,190,100,0.25)" strokeWidth="5" fill="none" strokeLinecap="round"/>

        {/* Bottom ambient shadow */}
        <ellipse cx="108" cy="158" rx="52" ry="28" fill="rgba(25,5,0,0.22)"/>
      </svg>

      <p style={{ fontSize: "11px", color: "var(--text3)", marginTop: "10px", letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: 600 }}>Basketball Training</p>
    </div>
  );
}
