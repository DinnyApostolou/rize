"use client";

export default function NutritionBowl3D() {
  return (
    <div style={{ width: "100%", height: "300px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <div style={{
        position: "absolute",
        width: "220px", height: "180px",
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(16,185,129,0.3) 0%, transparent 70%)",
        filter: "blur(28px)",
        pointerEvents: "none",
      }} />

      <svg width="240" height="220" viewBox="0 0 240 220"
        style={{ animation: "illustrationFloat 4.2s ease-in-out infinite", filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.6))" }}>
        <defs>
          {/* Dark pan/bowl gradient */}
          <radialGradient id="panGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#2a3040" />
            <stop offset="100%" stopColor="#111620" />
          </radialGradient>
          <radialGradient id="panInner" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#1e2530" />
            <stop offset="100%" stopColor="#0d1018" />
          </radialGradient>
          {/* Steak gradient */}
          <linearGradient id="steakGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8B4513" />
            <stop offset="50%" stopColor="#6B3010" />
            <stop offset="100%" stopColor="#4A1E08" />
          </linearGradient>
          {/* Avocado */}
          <radialGradient id="avoGrad" cx="45%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#C8E66C" />
            <stop offset="60%" stopColor="#7DB543" />
            <stop offset="100%" stopColor="#4A7A20" />
          </radialGradient>
          <clipPath id="panClip">
            <ellipse cx="120" cy="105" rx="100" ry="88" />
          </clipPath>
        </defs>

        {/* Pan shadow on surface */}
        <ellipse cx="122" cy="216" rx="88" ry="9" fill="rgba(0,0,0,0.45)" />

        {/* Pan outer body */}
        <ellipse cx="120" cy="108" rx="108" ry="96" fill="url(#panGrad)" />
        {/* Pan inner (food area) */}
        <ellipse cx="120" cy="105" rx="100" ry="88" fill="url(#panInner)" />

        {/* Pan rim highlight */}
        <path d="M 24 90 C 50 62 90 50 120 50 C 150 50 190 62 216 90"
          fill="none" stroke="rgba(130,150,180,0.30)" strokeWidth="4" strokeLinecap="round"/>
        <path d="M 26 92 C 52 65 90 52 120 52 C 150 52 188 65 214 92"
          fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeLinecap="round"/>

        {/* ── FOOD CONTENTS ── */}

        {/* Steak strips */}
        <g clipPath="url(#panClip)">
          {/* Main steak strip 1 */}
          <path d="M 70 115 C 80 108 110 105 135 108 C 145 110 148 118 138 122 C 113 128 82 128 70 122 Z"
            fill="url(#steakGrad)" />
          <path d="M 72 116 C 82 110 110 107 133 110" fill="none" stroke="rgba(30,10,0,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M 73 119 C 83 113 111 110 132 113" fill="none" stroke="rgba(30,10,0,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
          {/* Highlight on steak */}
          <path d="M 80 112 C 95 108 118 107 132 110" fill="none" stroke="rgba(200,140,80,0.35)" strokeWidth="2" strokeLinecap="round"/>

          {/* Steak strip 2 (behind) */}
          <path d="M 95 100 C 108 94 140 92 158 96 C 165 99 164 106 155 109 C 136 113 104 113 95 108 Z"
            fill="#7A3A12" />
          <path d="M 98 102 C 112 96 138 95 155 98" fill="none" stroke="rgba(30,10,0,0.45)" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M 99 105 C 113 99 139 98 154 101" fill="none" stroke="rgba(30,10,0,0.45)" strokeWidth="1.5" strokeLinecap="round"/>

          {/* Red bell pepper strips */}
          <path d="M 55 105 C 60 88 68 75 72 82 C 68 90 66 102 64 115 Z" fill="#E03020" />
          <path d="M 57 106 C 61 91 67 80 70 85" fill="none" stroke="rgba(255,180,150,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M 60 96 C 65 82 74 70 78 76 C 73 84 71 96 70 108 Z" fill="#D02810" />

          {/* Yellow bell pepper strips */}
          <path d="M 155 90 C 162 76 170 68 173 75 C 169 83 166 96 163 108 Z" fill="#F0C020" />
          <path d="M 157 92 C 162 78 169 70 171 76" fill="none" stroke="rgba(255,240,180,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M 162 86 C 168 73 176 66 178 73 C 174 81 170 94 168 106 Z" fill="#D4A818" />

          {/* Orange/green pepper */}
          <path d="M 80 85 C 85 72 94 66 96 72 C 92 80 91 93 89 105 Z" fill="#E87820" />

          {/* Green pepper */}
          <path d="M 145 118 C 152 106 160 100 162 106 C 158 112 155 122 152 130 Z" fill="#3A8A30" />

          {/* Onion strips (white/cream, slightly translucent) */}
          <path d="M 105 88 C 112 80 125 78 130 83 C 125 88 112 90 105 92 Z"
            fill="rgba(240,230,210,0.75)" />
          <path d="M 100 118 C 108 112 122 110 128 115 C 122 120 108 122 100 124 Z"
            fill="rgba(240,230,210,0.65)" />

          {/* Avocado slices */}
          <ellipse cx="78" cy="132" rx="14" ry="8" fill="url(#avoGrad)" transform="rotate(-20 78 132)" />
          <ellipse cx="78" cy="132" rx="9" ry="5" fill="#D4E890" transform="rotate(-20 78 132)" />
          <ellipse cx="78" cy="132" rx="3.5" ry="2" fill="#4A3010" transform="rotate(-20 78 132)" />

          <ellipse cx="98" cy="138" rx="13" ry="7" fill="url(#avoGrad)" transform="rotate(-15 98 138)" />
          <ellipse cx="98" cy="138" rx="8" ry="4.5" fill="#D4E890" transform="rotate(-15 98 138)" />
          <ellipse cx="98" cy="138" rx="3" ry="2" fill="#4A3010" transform="rotate(-15 98 138)" />

          <ellipse cx="118" cy="142" rx="12" ry="6.5" fill="url(#avoGrad)" transform="rotate(-10 118 142)" />
          <ellipse cx="118" cy="142" rx="7.5" ry="4" fill="#D4E890" transform="rotate(-10 118 142)" />

          {/* Lime wedge */}
          <path d="M 150 130 C 158 120 170 118 174 126 C 170 136 158 140 150 136 Z" fill="#5AC428" />
          <path d="M 152 132 C 159 124 168 122 171 128" fill="none" stroke="rgba(200,255,150,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
          {/* Lime segments */}
          <path d="M 162 124 L 160 136" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinecap="round"/>
          <path d="M 157 122 L 154 134" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinecap="round"/>
          <path d="M 167 127 L 166 137" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinecap="round"/>

          {/* Cilantro leaves */}
          <ellipse cx="130" cy="130" rx="5" ry="3" fill="#3DA840" transform="rotate(30 130 130)" opacity="0.9"/>
          <ellipse cx="138" cy="126" rx="4" ry="2.5" fill="#4DC050" transform="rotate(-20 138 126)" opacity="0.9"/>
          <ellipse cx="125" cy="136" rx="4" ry="2.5" fill="#3DA840" transform="rotate(50 125 136)" opacity="0.9"/>

          {/* Red chili flakes / paprika dust */}
          <circle cx="85" cy="100" r="2" fill="#CC2020" opacity="0.7"/>
          <circle cx="140" cy="112" r="1.5" fill="#CC2020" opacity="0.6"/>
          <circle cx="110" cy="130" r="1.5" fill="#CC2020" opacity="0.6"/>
        </g>

        {/* Pan handle (right side) */}
        <path d="M 220 108 C 230 105 240 108 240 112 C 240 116 230 119 220 116"
          fill="#1a1f2a" stroke="rgba(100,120,150,0.3)" strokeWidth="1.5"/>

        {/* Pan rim top edge */}
        <ellipse cx="120" cy="52" rx="108" ry="14" fill="none" stroke="rgba(100,120,160,0.25)" strokeWidth="2"/>
      </svg>

      <p style={{ fontSize: "11px", color: "var(--text3)", marginTop: "10px", letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: 600 }}>Athlete Nutrition</p>
    </div>
  );
}
