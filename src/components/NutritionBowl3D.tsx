"use client";

export default function NutritionBowl3D() {
  return (
    <div style={{ width: "100%", height: "300px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <div style={{
        position: "absolute",
        width: "210px", height: "210px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(16,185,129,0.35) 0%, rgba(5,150,105,0.12) 50%, transparent 70%)",
        filter: "blur(30px)",
        pointerEvents: "none",
      }} />

      <svg
        width="210" height="210"
        viewBox="0 0 210 210"
        style={{ animation: "illustrationFloat 4.2s ease-in-out infinite", filter: "drop-shadow(0 18px 36px rgba(16,185,129,0.4))" }}
      >
        <defs>
          <radialGradient id="bowlBodyGrad" cx="42%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#f5f0e8" />
            <stop offset="100%" stopColor="#d6cfC4" />
          </radialGradient>
          <radialGradient id="riceGrad" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#faf7ee" />
            <stop offset="100%" stopColor="#ede7d6" />
          </radialGradient>
          <clipPath id="bowlFoodClip">
            <ellipse cx="105" cy="96" rx="76" ry="22" />
          </clipPath>
        </defs>

        {/* Shadow beneath bowl */}
        <ellipse cx="105" cy="206" rx="68" ry="7" fill="rgba(0,0,0,0.28)" />

        {/* Bowl body */}
        <path d="M 29 96 C 29 168 181 168 181 96" fill="url(#bowlBodyGrad)" />

        {/* Bowl inner dark base */}
        <path d="M 34 100 C 34 162 176 162 176 100" fill="#cec7bb" />

        {/* Rice / grain base */}
        <ellipse cx="105" cy="96" rx="76" ry="22" fill="url(#riceGrad)" />

        {/* Rice texture dots */}
        {[70,80,90,100,110,120,130,85,95,115,125,75,105,135].map((x, i) => (
          <ellipse key={i} cx={x} cy={94 + (i % 3) * 3} rx="3.5" ry="2" fill="rgba(200,190,160,0.6)" transform={`rotate(${i * 25} ${x} ${94 + (i % 3) * 3})`} />
        ))}

        {/* Chicken / protein piece */}
        <path d="M 98 78 C 108 72 124 73 128 81 C 132 89 124 96 112 97 C 100 98 90 92 90 84 C 90 80 94 79 98 78 Z" fill="#C8763A" />
        <path d="M 98 78 C 106 74 118 75 124 80 C 118 76 106 76 100 79 Z" fill="rgba(255,220,180,0.35)" />
        {/* Grill marks */}
        <path d="M 100 80 L 120 80" stroke="rgba(100,40,0,0.4)" strokeWidth="2" strokeLinecap="round" />
        <path d="M 98 85 L 122 84" stroke="rgba(100,40,0,0.4)" strokeWidth="2" strokeLinecap="round" />

        {/* Broccoli 1 (left) */}
        <circle cx="70" cy="80" r="10" fill="#2d9944" />
        <circle cx="64" cy="74" r="8.5" fill="#3aad52" />
        <circle cx="76" cy="74" r="8" fill="#44c45e" />
        <circle cx="70" cy="70" r="6" fill="#50d470" />
        <rect x="68" y="87" width="4" height="8" rx="2" fill="#1e6b30" />

        {/* Broccoli 2 (right) */}
        <circle cx="148" cy="82" r="9" fill="#2d9944" />
        <circle cx="142" cy="76" r="7.5" fill="#3aad52" />
        <circle cx="154" cy="76" r="7" fill="#44c45e" />
        <circle cx="148" cy="72" r="5.5" fill="#50d470" />
        <rect x="146" y="88" width="4" height="7" rx="2" fill="#1e6b30" />

        {/* Cherry tomato 1 */}
        <circle cx="80" cy="68" r="10" fill="#E53030" />
        <circle cx="83" cy="65" r="4" fill="rgba(255,255,255,0.32)" />
        <path d="M 80 58 C 80 55 84 56 83 59" fill="none" stroke="#2a6e1a" strokeWidth="1.8" strokeLinecap="round" />

        {/* Cherry tomato 2 */}
        <circle cx="132" cy="70" r="9" fill="#D42828" />
        <circle cx="135" cy="67" r="3.5" fill="rgba(255,255,255,0.28)" />
        <path d="M 132 61 C 132 58 136 59 135 62" fill="none" stroke="#2a6e1a" strokeWidth="1.8" strokeLinecap="round" />

        {/* Avocado slice */}
        <ellipse cx="110" cy="76" rx="10" ry="8" fill="#5a8a2e" transform="rotate(-20 110 76)" />
        <ellipse cx="110" cy="76" rx="6.5" ry="5" fill="#8bc34a" transform="rotate(-20 110 76)" />
        <ellipse cx="110" cy="76" rx="3" ry="2.4" fill="#4A3728" transform="rotate(-20 110 76)" />

        {/* Bowl outer rim */}
        <ellipse cx="105" cy="96" rx="76" ry="22" fill="none" stroke="#c8c0b4" strokeWidth="2" />
        {/* Rim highlight */}
        <path d="M 34 93 C 60 82 150 82 176 93" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2.5" strokeLinecap="round" />

        {/* Bowl body shine */}
        <path d="M 32 110 C 32 140 40 158 52 165" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="5" strokeLinecap="round" />
      </svg>

      <p style={{ fontSize: "11px", color: "var(--text3)", marginTop: "10px", letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: 600 }}>Athlete Nutrition</p>
    </div>
  );
}
