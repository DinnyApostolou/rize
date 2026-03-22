"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import dynamic from "next/dynamic";
const Basketball3D = dynamic(() => import("@/components/Basketball3D"), { ssr: false });
import Sidebar from "@/components/Sidebar";

declare global {
  interface Window { tf: any; poseDetection: any; }
}

// ─── Camera Overlay Component ───────────────────────────────────────────────
function CameraOverlay({ drill, onClose, onComplete }: { drill: { id: number; title: string; xp: number; duration: string } | null; onClose: () => void; onComplete: (xp: number, drillId: number) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<any>(null);
  const wristHistRef = useRef<number[]>([]);
  const lastDribbleRef = useRef<number>(0);
  const dribbleStateRef = useRef<"up" | "down">("up");
  const dribbleCountRef = useRef(0);
  const startTimeRef = useRef(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [camStatus, setCamStatus] = useState<"loading" | "running" | "done">("loading");
  const [dribbleCount, setDribbleCount] = useState(0);
  const [timer, setTimer] = useState(30);
  const [poseReady, setPoseReady] = useState(false);
  const [camError, setCamError] = useState("");
  const [duration] = useState(30);

  const stopAll = useCallback(() => {
    cancelAnimationFrame(animRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
  }, []);

  const detectBall = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const step = 4;
    const d = ctx.getImageData(0, 0, w, h).data;
    let sx = 0, sy = 0, count = 0;
    for (let py = 0; py < h; py += step) {
      for (let px = 0; px < w; px += step) {
        const i = (py * w + px) * 4;
        const r = d[i], g = d[i + 1], b = d[i + 2];
        if (r > 150 && g > 60 && g < 145 && b < 70 && r > g * 1.4 && r > b * 2.5) { sx += px; sy += py; count++; }
      }
    }
    if (count < 5) return null;
    return { x: sx / count, y: sy / count, r: Math.sqrt((count * step * step) / Math.PI) * 1.2 };
  };

  const countDribble = (y: number, h: number) => {
    const hist = wristHistRef.current;
    hist.push(y); if (hist.length > 10) hist.shift(); if (hist.length < 6) return;
    const avg = hist.reduce((a, b) => a + b, 0) / hist.length;
    const thr = h * 0.035; const now = Date.now();
    if (dribbleStateRef.current === "up" && y > avg + thr) { dribbleStateRef.current = "down"; }
    else if (dribbleStateRef.current === "down" && y < avg - thr && now - lastDribbleRef.current > 250) {
      dribbleStateRef.current = "up"; lastDribbleRef.current = now;
      dribbleCountRef.current++; setDribbleCount(dribbleCountRef.current);
    }
  };

  const runDetection = useCallback(() => {
    const video = videoRef.current; const canvas = canvasRef.current; const detector = detectorRef.current;
    if (!video || !canvas || !detector) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const detect = async () => {
      if (video.readyState < 2) { animRef.current = requestAnimationFrame(detect); return; }
      canvas.width = video.videoWidth || 640; canvas.height = video.videoHeight || 480;
      ctx.save(); ctx.scale(-1, 1); ctx.translate(-canvas.width, 0); ctx.drawImage(video, 0, 0); ctx.restore();
      const ball = detectBall(ctx, canvas.width, canvas.height);
      if (ball) {
        ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r + 6, 0, Math.PI * 2); ctx.strokeStyle = "rgba(14,165,233,0.4)"; ctx.lineWidth = 8; ctx.stroke();
        ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); ctx.strokeStyle = "#0EA5E9"; ctx.lineWidth = 2.5; ctx.stroke();
        ctx.font = "bold 11px sans-serif"; ctx.fillStyle = "#0EA5E9"; ctx.fillText("BALL", ball.x - 14, ball.y - ball.r - 8);
        countDribble(ball.y, canvas.height);
      }
      try {
        const poses = await detector.estimatePoses(video);
        if (poses.length > 0) {
          const kps = poses[0].keypoints;
          const mir = kps.map((k: any) => ({ ...k, x: canvas.width - k.x }));
          const conns = [[5,7],[7,9],[6,8],[8,10],[5,6],[5,11],[6,12],[11,12],[11,13],[13,15],[12,14],[14,16]];
          ctx.strokeStyle = "rgba(14,165,233,0.8)"; ctx.lineWidth = 2;
          conns.forEach(([a, b]) => { const A = mir[a], B = mir[b]; if (A?.score > 0.3 && B?.score > 0.3) { ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke(); } });
          mir.forEach((kp: any) => { if (kp?.score > 0.3) { ctx.beginPath(); ctx.arc(kp.x, kp.y, 4, 0, Math.PI * 2); ctx.fillStyle = "#38BDF8"; ctx.fill(); } });
          setPoseReady(true);
          if (!ball) { const rw = kps[10]; if (rw?.score > 0.35) countDribble(rw.y, canvas.height); }
        } else { setPoseReady(false); }
      } catch { /* skip */ }
      animRef.current = requestAnimationFrame(detect);
    };
    detect();
  }, []);

  useEffect(() => {
    // Load TF.js scripts
    const urls = [
      "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.11.0/dist/tf.min.js",
      "https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection@2.1.3/dist/pose-detection.min.js",
    ];
    let loaded = 0;
    const onLoaded = async () => {
      loaded++;
      if (loaded < urls.length) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: 640, height: 480 }, audio: false });
        streamRef.current = stream;
        const video = videoRef.current!;
        video.srcObject = stream;
        await video.play();
        await window.tf.ready();
        const detector = await window.poseDetection.createDetector(
          window.poseDetection.SupportedModels.MoveNet,
          { modelType: window.poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING }
        );
        detectorRef.current = detector;
        setCamStatus("running");
        startTimeRef.current = Date.now();
        setTimer(duration);
        timerIntervalRef.current = setInterval(() => {
          const remaining = duration - Math.floor((Date.now() - startTimeRef.current) / 1000);
          if (remaining <= 0) {
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            cancelAnimationFrame(animRef.current);
            setCamStatus("done");
            stopAll();
          } else { setTimer(remaining); }
        }, 500);
        runDetection();
      } catch (err: any) {
        setCamError(err.message?.includes("NotAllowed") ? "Camera access denied. Allow camera permission and try again." : "Could not start camera. Try again.");
        stopAll();
      }
    };
    urls.forEach(src => {
      if (document.querySelector(`script[src="${src}"]`)) { onLoaded(); return; }
      const s = document.createElement("script"); s.src = src; s.async = false; s.onload = onLoaded; document.head.appendChild(s);
    });
    return () => stopAll();
  }, []);

  if (!drill) return null;

  return (
    <div onClick={e => e.stopPropagation()} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.97)", zIndex: 200, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid var(--border)" }}>
        <div>
          <div style={{ fontSize: "11px", color: "var(--accent)", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "2px" }}>Now Tracking</div>
          <div style={{ fontSize: "16px", fontWeight: 800 }}>{drill.title}</div>
        </div>
        <button onClick={() => { stopAll(); onClose(); }} style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text2)", padding: "6px 16px", borderRadius: "6px", fontSize: "13px" }}>
          ✕ Close
        </button>
      </div>

      {/* Camera area */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", gap: "20px" }}>
        <div style={{ position: "relative", width: "100%", maxWidth: "700px", aspectRatio: "4/3", background: "#000", borderRadius: "12px", overflow: "hidden" }}>
          <video ref={videoRef} style={{ display: "none" }} playsInline muted />
          <canvas ref={canvasRef} style={{ width: "100%", height: "100%", objectFit: "cover", display: camStatus === "running" ? "block" : "none" }} />

          {camStatus === "loading" && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px" }}>
              <div style={{ width: "40px", height: "40px", border: "3px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              <p style={{ color: "var(--text2)", fontSize: "14px" }}>Starting camera & loading AI...</p>
              <p style={{ color: "var(--text3)", fontSize: "12px" }}>First load takes ~15 seconds</p>
            </div>
          )}

          {camError && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", padding: "24px", textAlign: "center" }}>
              <p style={{ color: "#ef4444", fontSize: "14px" }}>{camError}</p>
              <button onClick={() => { stopAll(); onClose(); }} style={{ background: "var(--accent)", color: "#fff", padding: "8px 20px", borderRadius: "6px", fontSize: "13px", fontWeight: 700 }}>Close</button>
            </div>
          )}

          {camStatus === "running" && (
            <>
              <div style={{ position: "absolute", top: "12px", left: "12px", background: "rgba(0,0,0,0.75)", borderRadius: "8px", padding: "6px 16px", fontSize: "28px", fontWeight: 900, color: timer <= 5 ? "#ef4444" : "#fff" }}>{timer}s</div>
              <div style={{ position: "absolute", top: "12px", right: "12px", background: poseReady ? "rgba(0,230,118,0.15)" : "rgba(0,0,0,0.5)", border: `1px solid ${poseReady ? "var(--green)" : "var(--border)"}`, borderRadius: "6px", padding: "4px 10px", fontSize: "10px", color: poseReady ? "var(--green)" : "var(--text3)", fontWeight: 700, letterSpacing: "1px" }}>
                {poseReady ? "POSE DETECTED" : "SCANNING..."}
              </div>
              <div style={{ position: "absolute", bottom: "12px", left: "12px", background: "rgba(0,0,0,0.75)", borderRadius: "8px", padding: "8px 16px" }}>
                <div style={{ fontSize: "11px", color: "var(--text2)", textTransform: "uppercase", letterSpacing: "1px" }}>Dribbles</div>
                <div style={{ fontSize: "40px", fontWeight: 900, color: "var(--accent)", lineHeight: 1.1 }}>{dribbleCount}</div>
              </div>
            </>
          )}

          {camStatus === "done" && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px" }}>
              <p style={{ color: "var(--green)", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase" }}>Drill Complete</p>
              <div style={{ fontSize: "72px", fontWeight: 900, color: "var(--accent)", letterSpacing: "-3px" }}>{dribbleCount}</div>
              <p style={{ color: "var(--text2)", fontSize: "14px" }}>dribbles in {duration}s — +{drill.xp} XP earned</p>
              <button onClick={() => { onComplete(drill.xp, drill.id); onClose(); }} style={{ marginTop: "8px", background: "var(--accent)", color: "#fff", padding: "12px 32px", borderRadius: "8px", fontSize: "15px", fontWeight: 700 }}>
                Save & Continue →
              </button>
            </div>
          )}
        </div>

        {/* Side stats */}
        {camStatus === "running" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", minWidth: "160px" }}>
            <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: "10px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>Dribbles/min</div>
              <div style={{ fontSize: "28px", fontWeight: 900, color: "var(--accent)" }}>
                {timer < duration ? Math.round(dribbleCount / ((duration - timer) / 60)) || 0 : 0}
              </div>
            </div>
            <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: "10px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>XP Reward</div>
              <div style={{ fontSize: "28px", fontWeight: 900, color: "var(--green)" }}>+{drill.xp}</div>
            </div>
            <button onClick={() => { stopAll(); onClose(); }} style={{ background: "transparent", border: "1px solid #ef4444", color: "#ef4444", padding: "10px", borderRadius: "8px", fontSize: "13px", fontWeight: 700 }}>
              Stop Drill
            </button>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const FREE_LIMIT = 5;

const DRILLS = [
  { id: 1, title: "Two-Ball Dribbling", category: "Ball Handling", difficulty: "Beginner", xp: 50, duration: "10 min", youtube: "0M4xoLxMqUM", desc: "Build coordination and ambidextrous handles by dribbling two balls simultaneously.", tips: ["Keep your head up at all times", "Start slow, build speed over time", "Stay on your fingertips, not your palm"] },
  { id: 2, title: "Cone Weave", category: "Ball Handling", difficulty: "Beginner", xp: 50, duration: "8 min", youtube: "YbVYQnkH_Rw", desc: "Improve change-of-direction speed and low dribble control with cone weave patterns.", tips: ["Stay low in athletic stance", "Push the ball slightly ahead", "Accelerate explosively out of each cone"] },
  { id: 3, title: "Mikan Drill", category: "Finishing", difficulty: "Beginner", xp: 50, duration: "10 min", youtube: "yBIQjEQhBmw", desc: "Classic finishing drill that builds touch, footwork and ambidextrous layups around the basket.", tips: ["Use the backboard every time", "Soft touch off the glass", "Alternate sides without stopping"] },
  { id: 4, title: "Form Shooting", category: "Shooting", difficulty: "Beginner", xp: 60, duration: "15 min", youtube: "XgPbHBvqEyk", desc: "Master your shooting mechanics up close before extending range. Foundation of every great shooter.", tips: ["One hand, use BEEF technique", "Hold your follow through every rep", "Consistent release point is everything"] },
  { id: 5, title: "Figure 8 Dribble", category: "Ball Handling", difficulty: "Beginner", xp: 50, duration: "8 min", youtube: "5LGEiIXSN_w", desc: "Low dribble pattern through the legs building coordination and handle tightness.", tips: ["Keep dribbles low and tight to your legs", "Minimise bounces between switches", "Eyes up at all times"] },
  { id: 6, title: "3-Man Weave", category: "Passing", difficulty: "Intermediate", xp: 80, duration: "15 min", youtube: "asjIBCH4pAc", desc: "Classic team drill building passing precision, communication and transition speed.", tips: ["Call for the ball loudly", "Lead your teammate perfectly", "Sprint to the corner immediately after passing"] },
  { id: 7, title: "Crossover Series", category: "Ball Handling", difficulty: "Intermediate", xp: 80, duration: "12 min", youtube: "kEHMKXvH-KE", desc: "Full crossover progression — basic, between legs, behind back and spin move.", tips: ["Attack the defender/cone hard", "Keep dribble below knee", "Explosive first step out of the move"] },
  { id: 8, title: "Spot Shooting", category: "Shooting", difficulty: "Intermediate", xp: 80, duration: "20 min", youtube: "2vc4e4TkBqY", desc: "Catch and shoot from 5 spots on the floor. Game-realistic, 3 reps per spot.", tips: ["Ready stance before you catch", "Quick feet to set your base", "High release point on every shot"] },
  { id: 9, title: "Euro Step", category: "Finishing", difficulty: "Intermediate", xp: 80, duration: "10 min", youtube: "VTnkFEv-aBs", desc: "Two-step finishing move to beat shot blockers in the paint. Essential for guards.", tips: ["Long aggressive first step", "Gather before the second step", "Shield the ball with your body"] },
  { id: 10, title: "Zig-Zag Defense", category: "Defense", difficulty: "Intermediate", xp: 80, duration: "12 min", youtube: "HFkKW91XJMQ", desc: "Defensive footwork drill across the full court — slides, drops and retreat steps.", tips: ["Stay low the entire length", "Never cross your feet", "Touch the line fully each time"] },
  { id: 11, title: "Pull-Up Jumper", category: "Shooting", difficulty: "Intermediate", xp: 90, duration: "15 min", youtube: "7TiSHBBUKEQ", desc: "Dribble pull-up jump shot off 1 and 2 dribbles. Critical mid-range skill.", tips: ["Hard dribble into the pull-up", "Gather quickly, don't rush", "Balanced base at the jump"] },
  { id: 12, title: "Triple Threat Moves", category: "Ball Handling", difficulty: "Intermediate", xp: 80, duration: "12 min", youtube: "GxMpTmYlrCQ", desc: "From triple threat position — shot fake, jab step, live dribble and drive combos.", tips: ["Sell your shot fake", "Jab step hard to move the defender", "Read the defense before you act"] },
  { id: 13, title: "Off-Screen Shooting", category: "Shooting", difficulty: "Advanced", xp: 120, duration: "20 min", youtube: "WPn5SqSMhAw", desc: "Use a screen to create game-realistic shooting at full speed. Pop and curl reads.", tips: ["Brush the screen as tight as possible", "Pop or curl based on defender", "Shoot immediately at full pace"] },
  { id: 14, title: "Post Moves Series", category: "Finishing", difficulty: "Advanced", xp: 120, duration: "20 min", youtube: "KIlHpGQxafc", desc: "Drop step, up-and-under, baby hook and seal positioning. Complete post game.", tips: ["Seal with your hip and forearm", "Read the defender's position", "Go up strong through contact every time"] },
  { id: 15, title: "Ball Screen Actions", category: "Basketball IQ", difficulty: "Advanced", xp: 120, duration: "20 min", youtube: "FBbbUKAPDqQ", desc: "Reading ball screens — reject, turn corner, pull-up or lob. IQ-heavy drill.", tips: ["Read the hedge before you commit", "Reject tight hedges immediately", "Change pace to set up the read"] },
  { id: 16, title: "Shooting Off Dribble Handoff", category: "Shooting", difficulty: "Advanced", xp: 110, duration: "15 min", youtube: "2vc4e4TkBqY", desc: "DHO (dribble hand-off) shooting action — momentum shot coming off the exchange.", tips: ["Attack the hand-off aggressively", "Shoulder into the defender", "Ready to shoot before you receive it"] },
  { id: 17, title: "Close-out & Contest Drill", category: "Defense", difficulty: "Advanced", xp: 120, duration: "15 min", youtube: "HFkKW91XJMQ", desc: "Close out on shooters with high hand, then recover to on-ball defense.", tips: ["Sprint then chop steps on close-out", "High hand on the shooter", "Recover and stay in stance"] },
  { id: 18, title: "Floater Finish", category: "Finishing", difficulty: "Advanced", xp: 110, duration: "12 min", youtube: "VTnkFEv-aBs", desc: "Develop the floater over shot blockers in the paint. Left and right hand.", tips: ["One or two step gather", "Release high over the shot blocker", "Use the glass from angles"] },
  { id: 19, title: "Full Court Layup Speed Drill", category: "Finishing", difficulty: "Intermediate", xp: 90, duration: "10 min", youtube: "yBIQjEQhBmw", desc: "Full court speed layups alternating left and right. Conditioning and finishing combo.", tips: ["Push the pace on every rep", "Stay in control approaching the rim", "Alternate hands each repetition"] },
  { id: 20, title: "Stephen Curry Dribble Series", category: "Ball Handling", difficulty: "Advanced", xp: 130, duration: "20 min", youtube: "kEHMKXvH-KE", desc: "Advanced dribble combination series inspired by elite guard footwork and handle patterns.", tips: ["Speed is the goal — push your limits", "Stay low through all combinations", "Game speed or it doesn't count"] },
];

export default function DrillsPage() {
  const router = useRouter();
  const [subscribed, setSubscribed] = useState(false);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [lockedMsg, setLockedMsg] = useState(false);
  const [activeCameraDrill, setActiveCameraDrill] = useState<{ id: number; title: string; xp: number; duration: string } | null>(null);
  const [completedDrills, setCompletedDrills] = useState<Set<number>>(new Set());
  const [saveMsg, setSaveMsg] = useState("");
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const supabase = getSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setSubscribed((data as { is_subscribed?: boolean } | null)?.is_subscribed || false);
      setUserProfile(data);

      // Load completed drills from localStorage
      try {
        const stored = localStorage.getItem("rize_completed_drills");
        if (stored) {
          const parsed: number[] = JSON.parse(stored);
          setCompletedDrills(new Set(parsed));
        }
      } catch { /* ignore */ }
    }
    load();
  }, [router]);

  const categories = ["All", ...Array.from(new Set(DRILLS.map(d => d.category)))];
  const filtered = DRILLS.filter(d => {
    const matchCat = filter === "All" || d.category === filter;
    const matchSearch = !searchQuery || d.title.toLowerCase().includes(searchQuery.toLowerCase()) || d.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  function handleDrillClick(index: number) {
    if (!subscribed && index >= FREE_LIMIT) { setLockedMsg(true); return; }
    setExpanded(expanded === index ? null : index);
    setLockedMsg(false);
  }

  async function onComplete(xp: number, drillId: number) {
    // Mark drill as completed locally
    const newCompleted = new Set(completedDrills);
    newCompleted.add(drillId);
    setCompletedDrills(newCompleted);
    localStorage.setItem("rize_completed_drills", JSON.stringify(Array.from(newCompleted)));

    // Increment week drills
    const currentWeekDrills = parseInt(localStorage.getItem("rize_week_drills") || "0");
    localStorage.setItem("rize_week_drills", String(currentWeekDrills + 1));

    // Update Supabase
    try {
      const supabase = getSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      if (user && userProfile) {
        const profileData = userProfile;
        const today = new Date().toDateString();
        const lastDate = profileData.last_drill_date;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        let newStreak = profileData.streak || 0;
        if (lastDate !== today) {
          newStreak = (lastDate === yesterday.toDateString()) ? newStreak + 1 : 1;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from("profiles") as any).update({
          xp: (profileData.xp || 0) + xp,
          drills_completed: (profileData.drills_completed || 0) + 1,
          streak: newStreak,
          last_drill_date: today,
        }).eq("id", user.id);

        setUserProfile({ ...profileData, xp: (profileData.xp || 0) + xp, drills_completed: (profileData.drills_completed || 0) + 1, streak: newStreak, last_drill_date: today });
      }
    } catch { /* ignore */ }

    setSaveMsg(`+${xp} XP saved! Great work.`);
    setTimeout(() => setSaveMsg(""), 3000);
  }

  const diffColor = (d: string) => d === "Beginner" ? "#00e676" : d === "Intermediate" ? "var(--accent)" : "#a855f7";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      {/* Save toast */}
      {saveMsg && (
        <div style={{ position: "fixed", bottom: "32px", left: "50%", transform: "translateX(-50%)", background: "#10B981", color: "#fff", padding: "12px 24px", borderRadius: "10px", fontSize: "14px", fontWeight: 700, zIndex: 300, whiteSpace: "nowrap" }}>
          {saveMsg}
        </div>
      )}

      {activeCameraDrill && (
        <CameraOverlay
          drill={activeCameraDrill}
          onClose={() => setActiveCameraDrill(null)}
          onComplete={(xp, drillId) => { onComplete(xp, drillId); setActiveCameraDrill(null); }}
        />
      )}
      <Sidebar />

      <main className="inner-main" style={{ flex: 1, padding: "48px 52px", maxWidth: "900px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "40px", marginBottom: "36px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <p style={{ fontSize: "11px", color: "var(--accent)", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>Basketball</p>
            <h1 style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1 }}>Drills</h1>
            <p style={{ color: "var(--text2)", fontSize: "14px", marginTop: "10px", lineHeight: 1.6 }}>Structured ball handling, shooting and defence drills. Grab and spin the basketball.</p>
          </div>
          <div style={{ width: "260px", flexShrink: 0 }}>
            <Basketball3D />
          </div>
        </div>
        {!subscribed && (
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px 20px", marginBottom: "28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
            <div style={{ fontSize: "14px" }}>
              <span style={{ fontWeight: 700 }}>Free preview:</span>
              <span style={{ color: "var(--text2)", marginLeft: "6px" }}>5 of {DRILLS.length} drills unlocked. Upgrade for full access.</span>
            </div>
            <Link href="/subscribe"><button style={{ background: "var(--accent)", color: "#fff", padding: "7px 16px", borderRadius: "6px", fontSize: "13px", fontWeight: 700, whiteSpace: "nowrap" }}>Unlock All →</button></Link>
          </div>
        )}

        {lockedMsg && (
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "10px", padding: "14px 18px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "14px" }}>🔒 <Link href="/subscribe" style={{ color: "var(--accent)", fontWeight: 700 }}>Upgrade to Pro</Link> to unlock this drill.</span>
            <button onClick={() => setLockedMsg(false)} style={{ background: "none", color: "var(--text2)", fontSize: "16px" }}>×</button>
          </div>
        )}

        {/* Search bar */}
        <input
          type="text"
          placeholder="Search drills..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            width: "100%", background: "var(--bg2)", border: "1px solid var(--border)",
            borderRadius: "10px", padding: "12px 16px", fontSize: "14px",
            color: "var(--text)", marginBottom: "16px",
          }}
        />

        {/* Filters */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}>
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{
              padding: "7px 16px", borderRadius: "6px", fontSize: "13px", fontWeight: 600,
              background: filter === c ? "var(--accent)" : "var(--bg2)",
              border: `1px solid ${filter === c ? "var(--accent)" : "var(--border)"}`,
              color: filter === c ? "#fff" : "var(--text2)",
            }}>{c}</button>
          ))}
        </div>

        <div style={{ fontSize: "13px", color: "var(--text2)", marginBottom: "16px" }}>{filtered.length} drills</div>

        {/* Drills */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {filtered.map((drill) => {
            const globalIndex = DRILLS.indexOf(drill);
            const locked = !subscribed && globalIndex >= FREE_LIMIT;
            const isOpen = expanded === globalIndex;
            const isDone = completedDrills.has(drill.id);
            return (
              <div key={drill.id} onClick={() => handleDrillClick(globalIndex)} style={{
                background: "var(--bg2)", border: `1px solid ${isOpen ? "var(--accent)" : "var(--border)"}`,
                borderRadius: "10px", padding: "18px 20px", cursor: "pointer",
                opacity: locked ? 0.45 : 1, transition: "border-color 0.2s",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    {locked && <span style={{ fontSize: "14px" }}>🔒</span>}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
                        {drill.title}
                        {isDone && (
                          <span style={{ fontSize: "11px", background: "rgba(0,230,118,0.15)", border: "1px solid rgba(0,230,118,0.3)", color: "#00e676", borderRadius: "4px", padding: "2px 7px", fontWeight: 700 }}>
                            ✓ Done
                          </span>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: "10px", marginTop: "5px", flexWrap: "wrap", alignItems: "center" }}>
                        <span style={{ fontSize: "12px", color: "var(--text2)" }}>{drill.category}</span>
                        <span style={{ fontSize: "11px", background: "var(--bg3)", padding: "2px 8px", borderRadius: "4px", color: diffColor(drill.difficulty), fontWeight: 600 }}>{drill.difficulty}</span>
                        <span style={{ fontSize: "12px", color: "var(--text3)" }}>{drill.duration}</span>
                        <span style={{ fontSize: "12px", color: "var(--accent)", fontWeight: 600 }}>+{drill.xp} XP</span>
                      </div>
                    </div>
                  </div>
                  <span style={{ color: "var(--text2)", fontSize: "18px", flexShrink: 0 }}>{isOpen ? "−" : "+"}</span>
                </div>
                {isOpen && (
                  <div style={{ marginTop: "18px", paddingTop: "18px", borderTop: "1px solid var(--border)" }}>
                    <p style={{ color: "var(--text2)", fontSize: "14px", lineHeight: 1.7, marginBottom: "16px" }}>{drill.desc}</p>
                    <div style={{ fontWeight: 700, fontSize: "13px", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Coaching Cues:</div>
                    {drill.tips.map((t, ti) => (
                      <div key={ti} style={{ display: "flex", gap: "8px", marginBottom: "7px", fontSize: "14px", color: "var(--text2)", alignItems: "flex-start" }}>
                        <span style={{ color: "var(--accent)", flexShrink: 0 }}>→</span> {t}
                      </div>
                    ))}
                    <div style={{ display: "flex", gap: "10px", marginTop: "18px", flexWrap: "wrap" }}>
                      <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(drill.title + ' basketball tutorial')}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                        <button style={{ background: "#FF0000", color: "#fff", padding: "9px 18px", borderRadius: "6px", fontSize: "13px", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
                          ▶ Watch Tutorial
                        </button>
                      </a>
                      <button onClick={e => { e.stopPropagation(); setActiveCameraDrill({ id: drill.id, title: drill.title, xp: drill.xp, duration: drill.duration }); }} style={{ background: "var(--accent)", color: "#fff", padding: "9px 20px", borderRadius: "6px", fontSize: "13px", fontWeight: 700, display: "flex", alignItems: "center", gap: "7px" }}>
                        📷 Start Drill
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
