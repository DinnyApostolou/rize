"use client";
import { useState } from "react";
import Link from "next/link";

const PROGRAMS = [
  {
    category: "Explosive Power",
    desc: "Build vertical jump, first step explosiveness and reactive strength.",
    exercises: [
      { name: "Box Jumps", sets: "4 × 8", rest: "90s", youtube: "52r_Ul5k03g", desc: "Explosive lower body power — foundational for vertical jump and first step.", cues: ["Full hip extension at top", "Soft landing with bent knees", "Step down, don't jump down"] },
      { name: "Depth Jumps", sets: "3 × 6", rest: "2 min", youtube: "52r_Ul5k03g", desc: "Step off box, contact ground briefly, then explode upward. Reactive strength.", cues: ["Minimum ground contact time", "Arms drive explosively upward", "Land soft and rebound fast"] },
      { name: "Barbell Jump Squat", sets: "4 × 5", rest: "2 min", youtube: "U4s8mA3hBCc", desc: "30% of squat 1RM. Develop force at high velocities.", cues: ["Light weight, maximum intent", "Controlled landing every rep", "Full hip extension on jump"] },
      { name: "Broad Jumps", sets: "4 × 6", rest: "90s", youtube: "U4s8mA3hBCc", desc: "Horizontal power development. Translates directly to first step speed.", cues: ["Aggressive arm swing", "Drive through the hips", "Stick the landing, stay balanced"] },
      { name: "Single Leg Bounds", sets: "3 × 10 each", rest: "90s", youtube: "52r_Ul5k03g", desc: "Unilateral explosive bounding for athletic asymmetry correction.", cues: ["Drive the knee up high", "Powerful, long strides", "Stay controlled on landing"] },
      { name: "Medicine Ball Slam", sets: "4 × 10", rest: "60s", youtube: "52r_Ul5k03g", desc: "Full body power development with emphasis on core-to-extremity sequence.", cues: ["Reach fully overhead", "Slam with total body force", "Athletic hinge on the way down"] },
    ]
  },
  {
    category: "Lower Body Strength",
    desc: "Build the foundation of athletic power — quads, hamstrings, glutes and posterior chain.",
    exercises: [
      { name: "Back Squat", sets: "4 × 6", rest: "3 min", youtube: "ultWZbUMPL8", desc: "The king of lower body strength. Build quads, glutes and posterior chain.", cues: ["Depth below parallel every rep", "Chest up throughout the movement", "Drive knees out, not in"] },
      { name: "Romanian Deadlift", sets: "3 × 10", rest: "2 min", youtube: "JCXUYuzwNrM", desc: "Hamstring and glute loading critical for sprint mechanics and injury prevention.", cues: ["Hinge hard at the hips", "Bar stays close to legs throughout", "Feel the hamstring load at the bottom"] },
      { name: "Bulgarian Split Squat", sets: "3 × 8 each", rest: "90s", youtube: "2C-uNgKwPLE", desc: "Unilateral leg strength — exposes imbalances, builds stability and sport-specific strength.", cues: ["Front foot far enough forward", "Rear knee drops straight down", "Drive through front heel to stand"] },
      { name: "Hip Thrust", sets: "4 × 10", rest: "2 min", youtube: "SEdqd1n0cvg", desc: "Maximum glute activation — essential for speed, power and injury prevention.", cues: ["Chin tucked throughout", "Full hip extension and squeeze at top", "Don't hyperextend the lower back"] },
      { name: "Leg Press", sets: "4 × 12", rest: "90s", youtube: "IZxyjW7MPJQ", desc: "Quad volume work to supplement squats. Control the eccentric.", cues: ["Full range of motion", "Don't lock knees at top", "Slow on the way down (3 seconds)"] },
      { name: "Hack Squat", sets: "3 × 10", rest: "2 min", youtube: "ultWZbUMPL8", desc: "Quad-dominant squat variation. Excellent for building knee strength for jumping.", cues: ["Keep chest up", "Drive through heels", "Control the descent"] },
      { name: "Walking Lunges", sets: "3 × 12 each", rest: "90s", youtube: "2C-uNgKwPLE", desc: "Functional unilateral strength. Builds balance and coordination.", cues: ["Big stride forward", "Knee tracks over toes", "Drive front heel to stand"] },
    ]
  },
  {
    category: "Upper Body & Core",
    desc: "Pressing, pulling and rotational core strength for an athletic physique.",
    exercises: [
      { name: "Pull-Ups / Weighted Pull-Ups", sets: "4 × 8", rest: "90s", youtube: "eGo4IYlbE5g", desc: "Back and bicep strength for fighting through screens and boxing out.", cues: ["Full dead hang at the bottom", "Chest to bar at top", "Slow controlled descent"] },
      { name: "Dumbbell Bench Press", sets: "4 × 10", rest: "90s", youtube: "VmB1G1K7v94", desc: "Chest and shoulder strength. DBs allow greater range of motion.", cues: ["Full range of motion every rep", "Control the eccentric", "Neutral wrists throughout"] },
      { name: "Barbell Row", sets: "4 × 8", rest: "2 min", youtube: "FWJR5Ve8bnQ", desc: "Upper back thickness and strength. Counterbalances pressing work.", cues: ["Hinge to 45 degrees", "Drive elbows back, not out", "Squeeze at the top"] },
      { name: "Overhead Press", sets: "3 × 8", rest: "2 min", youtube: "2aq3sxze3bk", desc: "Shoulder strength and stability for physical play and athleticism.", cues: ["Brace core hard throughout", "Press straight up, not forward", "Full lockout at top"] },
      { name: "Pallof Press", sets: "3 × 12 each", rest: "60s", youtube: "AH_QZLm_0-s", desc: "Anti-rotation core exercise for functional athletic stability.", cues: ["Resist rotation throughout", "Fully extend arms on press", "Brace abs hard before starting"] },
      { name: "Hanging Leg Raise", sets: "3 × 12", rest: "60s", youtube: "hdng3JhMx_I", desc: "Full core strength — lower abs and hip flexors for explosiveness.", cues: ["No swinging momentum", "Controlled movement throughout", "Touch toes to bar if possible"] },
      { name: "Cable Row", sets: "3 × 12", rest: "90s", youtube: "FWJR5Ve8bnQ", desc: "Mid-back and rear delts. Improves posture and upper body pulling strength.", cues: ["Sit upright throughout", "Pull to lower chest", "Squeeze shoulder blades together"] },
      { name: "Tricep Dips", sets: "3 × 12", rest: "60s", youtube: "VmB1G1K7v94", desc: "Tricep and chest strength. Weighted when bodyweight becomes too easy.", cues: ["Slight forward lean for chest focus", "Full depth on each rep", "Lock out at top"] },
    ]
  },
  {
    category: "Speed & Agility",
    desc: "First step speed, change of direction and lateral quickness on the court.",
    exercises: [
      { name: "Resisted Sprint (Band)", sets: "6 × 20m", rest: "2 min", youtube: "4J3ACrUALCM", desc: "Overloads acceleration mechanics. Builds first step power.", cues: ["Forward body lean throughout", "High knee drive", "Pump arms hard and fast"] },
      { name: "Lateral Shuffle Cone Drill", sets: "4 × 30s", rest: "60s", youtube: "HFkKW91XJMQ", desc: "Defensive lateral quickness and positioning speed.", cues: ["Stay low in athletic stance", "Don't cross your feet", "Touch each cone fully"] },
      { name: "5-10-5 Pro Agility", sets: "6 reps", rest: "90s", youtube: "HFkKW91XJMQ", desc: "Elite change-of-direction test drill. Used by NBA and NFL combines.", cues: ["Low pivot at each line", "Reach for the line with your hand", "Full sprint in each direction"] },
      { name: "Single Leg Calf Raises", sets: "4 × 15 each", rest: "60s", youtube: "52r_Ul5k03g", desc: "Calf strength and ankle stability for jumping, sprinting and cutting.", cues: ["Full range of motion", "3-second eccentric (lower slowly)", "Pause 1 second at top"] },
      { name: "Ladder Drills (Various)", sets: "6 × 30s patterns", rest: "45s", youtube: "4J3ACrUALCM", desc: "Foot speed, coordination and ground contact time development.", cues: ["Eyes up, not on the ladder", "Light quick contacts", "Accelerate through the end"] },
      { name: "Sled Push", sets: "6 × 20m", rest: "2 min", youtube: "4J3ACrUALCM", desc: "Pure acceleration strength. No deceleration phase — all drive.", cues: ["Forward lean at 45 degrees", "Short powerful strides", "Drive through the full stride"] },
    ]
  },
  {
    category: "Recovery & Mobility",
    desc: "Active recovery, injury prevention and mobility work to keep you training consistently.",
    exercises: [
      { name: "Hip Flexor Stretch Series", sets: "3 × 60s each side", rest: "30s", youtube: "VIxGiHGKlCo", desc: "Unlock tight hip flexors from sitting and heavy training. Critical for sprint mechanics.", cues: ["Hold at the point of tension", "Don't force the stretch", "Breathe deeply throughout"] },
      { name: "Foam Roll Lower Body", sets: "10 min total", rest: "N/A", youtube: "VIxGiHGKlCo", desc: "Myofascial release for quads, hamstrings, IT band and calves.", cues: ["Slow rolls — 1-2 inches per second", "Pause on tight spots for 20-30s", "Breathe and relax into it"] },
      { name: "Nordic Hamstring Curl", sets: "3 × 6", rest: "2 min", youtube: "JCXUYuzwNrM", desc: "Eccentric hamstring strengthening. Massively reduces hamstring injury risk.", cues: ["Lower as slowly as possible", "Use hands to push up at bottom", "Build up reps over weeks"] },
      { name: "Ankle Mobility Circuit", sets: "3 rounds", rest: "30s", youtube: "VIxGiHGKlCo", desc: "Improve ankle dorsiflexion for squatting, landing and lateral movement.", cues: ["Slow controlled movement", "Full range of motion", "Both directions equally"] },
      { name: "Band Pull-Aparts", sets: "3 × 20", rest: "30s", youtube: "VmB1G1K7v94", desc: "Rear delt and upper back health. Prevents shoulder injuries from pressing.", cues: ["Keep arms straight", "Squeeze hard at end range", "Control the return"] },
      { name: "Thoracic Spine Rotation", sets: "2 × 10 each side", rest: "30s", youtube: "VIxGiHGKlCo", desc: "Upper back rotation mobility — critical for shooting, passing and defensive rotation.", cues: ["Rotate from the upper back, not hips", "Keep hips still", "Reach through the rotation"] },
    ]
  },
];

export default function StrengthPage() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <nav style={{ background: "var(--bg2)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", height: "60px", position: "sticky", top: 0, zIndex: 50 }}>
        <Link href="/dashboard" style={{ fontSize: "18px", fontWeight: 900, letterSpacing: "-0.5px" }}>RZ<span style={{ color: "var(--accent)" }}>.</span></Link>
        <span style={{ fontWeight: 700, fontSize: "15px" }}>Strength Training</span>
        <Link href="/dashboard"><button style={{ background: "none", border: "1px solid var(--border)", color: "var(--text2)", padding: "6px 14px", borderRadius: "6px", fontSize: "13px" }}>← Back</button></Link>
      </nav>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: "32px" }}>
          <p style={{ fontSize: "11px", color: "var(--text2)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "8px" }}>Strength</p>
          <h1 style={{ fontSize: "26px", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "8px" }}>Athlete Strength Programs</h1>
          <p style={{ color: "var(--text2)", fontSize: "14px" }}>Built specifically for basketball athletes. {PROGRAMS.reduce((a, p) => a + p.exercises.length, 0)} exercises across {PROGRAMS.length} training areas.</p>
        </div>

        {/* Category tabs */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "28px" }}>
          {PROGRAMS.map((p, i) => (
            <button key={i} onClick={() => { setActiveCategory(i); setExpanded(null); }} style={{
              padding: "8px 16px", borderRadius: "6px", fontSize: "13px", fontWeight: 600,
              background: activeCategory === i ? "var(--accent)" : "var(--bg2)",
              border: `1px solid ${activeCategory === i ? "var(--accent)" : "var(--border)"}`,
              color: activeCategory === i ? "#fff" : "var(--text2)",
            }}>{p.category}</button>
          ))}
        </div>

        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px 20px", marginBottom: "24px", fontSize: "14px", color: "var(--text2)" }}>
          {PROGRAMS[activeCategory].desc}
        </div>

        {/* Exercises */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {PROGRAMS[activeCategory].exercises.map((ex, i) => {
            const key = `${activeCategory}-${i}`;
            const isOpen = expanded === key;
            return (
              <div key={i} onClick={() => setExpanded(isOpen ? null : key)} style={{
                background: "var(--bg2)", border: `1px solid ${isOpen ? "var(--accent)" : "var(--border)"}`,
                borderRadius: "10px", padding: "18px 20px", cursor: "pointer", transition: "border-color 0.2s",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "15px" }}>{ex.name}</div>
                    <div style={{ display: "flex", gap: "12px", marginTop: "5px" }}>
                      <span style={{ fontSize: "12px", color: "var(--accent)", fontWeight: 700 }}>{ex.sets}</span>
                      <span style={{ fontSize: "12px", color: "var(--text2)" }}>Rest: {ex.rest}</span>
                    </div>
                  </div>
                  <span style={{ color: "var(--text2)", fontSize: "18px" }}>{isOpen ? "−" : "+"}</span>
                </div>
                {isOpen && (
                  <div style={{ marginTop: "18px", paddingTop: "18px", borderTop: "1px solid var(--border)" }}>
                    <p style={{ color: "var(--text2)", fontSize: "14px", lineHeight: 1.7, marginBottom: "16px" }}>{ex.desc}</p>
                    <div style={{ fontWeight: 700, fontSize: "12px", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Coaching Cues:</div>
                    {ex.cues.map((c, ci) => (
                      <div key={ci} style={{ display: "flex", gap: "8px", marginBottom: "7px", fontSize: "14px", color: "var(--text2)", alignItems: "flex-start" }}>
                        <span style={{ color: "var(--accent)", flexShrink: 0 }}>→</span> {c}
                      </div>
                    ))}
                    <div style={{ marginTop: "16px" }}>
                      <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name + ' exercise tutorial')}`} target="_blank" rel="noopener noreferrer">
                        <button style={{ background: "#FF0000", color: "#fff", padding: "9px 18px", borderRadius: "6px", fontSize: "13px", fontWeight: 700 }}>
                          ▶ Watch Tutorial on YouTube
                        </button>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
