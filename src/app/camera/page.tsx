"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

const DRILLS = [
  "Free Dribble",
  "Stationary Crossover",
  "Between the Legs",
  "Behind the Back",
  "Figure 8",
  "Two Ball Dribble",
  "Speed Dribble — Right Hand",
  "Speed Dribble — Left Hand",
];

declare global {
  interface Window {
    tf: any;
    poseDetection: any;
  }
}

export default function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const detectorRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const wristHistoryRef = useRef<number[]>([]);
  const lastDribbleRef = useRef<number>(0);
  const dribbleStateRef = useRef<"up" | "down">("up");
  const dribbleCountRef = useRef(0);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [status, setStatus] = useState<"idle" | "loading" | "running" | "done">("idle");
  const [error, setError] = useState("");
  const [dribbleCount, setDribbleCount] = useState(0);
  const [timer, setTimer] = useState(30);
  const [selectedDrill, setSelectedDrill] = useState(DRILLS[0]);
  const [drillDuration, setDrillDuration] = useState(30);
  const [poseReady, setPoseReady] = useState(false);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  // Load TF.js scripts from CDN once
  useEffect(() => {
    const urls = [
      "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core@4.11.0/dist/tf-core.min.js",
      "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl@4.11.0/dist/tf-backend-webgl.min.js",
      "https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection@2.1.3/dist/pose-detection.min.js",
    ];

    let loaded = 0;
    urls.forEach(src => {
      if (document.querySelector(`script[src="${src}"]`)) {
        loaded++;
        if (loaded === urls.length) setScriptsLoaded(true);
        return;
      }
      const s = document.createElement("script");
      s.src = src;
      s.async = false;
      s.onload = () => {
        loaded++;
        if (loaded === urls.length) setScriptsLoaded(true);
      };
      document.head.appendChild(s);
    });
  }, []);

  const stopCamera = useCallback(() => {
    cancelAnimationFrame(animRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  }, []);

  const drawSkeleton = (ctx: CanvasRenderingContext2D, keypoints: any[]) => {
    const connections = [
      [5, 7], [7, 9], [6, 8], [8, 10],
      [5, 6], [5, 11], [6, 12], [11, 12],
      [11, 13], [13, 15], [12, 14], [14, 16],
    ];
    ctx.strokeStyle = "rgba(14,165,233,0.9)";
    ctx.lineWidth = 2.5;
    connections.forEach(([a, b]) => {
      const kpA = keypoints[a];
      const kpB = keypoints[b];
      if (kpA?.score > 0.3 && kpB?.score > 0.3) {
        ctx.beginPath();
        ctx.moveTo(kpA.x, kpA.y);
        ctx.lineTo(kpB.x, kpB.y);
        ctx.stroke();
      }
    });
    keypoints.forEach(kp => {
      if (kp?.score > 0.3) {
        ctx.beginPath();
        ctx.arc(kp.x, kp.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#38BDF8";
        ctx.fill();
      }
    });
  };

  const countDribble = (wristY: number, canvasH: number) => {
    const history = wristHistoryRef.current;
    history.push(wristY);
    if (history.length > 10) history.shift();
    if (history.length < 6) return;

    const avg = history.reduce((a, b) => a + b, 0) / history.length;
    const threshold = canvasH * 0.035;
    const now = Date.now();

    if (dribbleStateRef.current === "up" && wristY > avg + threshold) {
      dribbleStateRef.current = "down";
    } else if (dribbleStateRef.current === "down" && wristY < avg - threshold && now - lastDribbleRef.current > 250) {
      dribbleStateRef.current = "up";
      lastDribbleRef.current = now;
      dribbleCountRef.current += 1;
      setDribbleCount(dribbleCountRef.current);
    }
  };

  const runDetection = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const detector = detectorRef.current;
    if (!video || !canvas || !detector) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const detect = async () => {
      if (video.readyState < 2) {
        animRef.current = requestAnimationFrame(detect);
        return;
      }
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      ctx.save();
      ctx.scale(-1, 1);
      ctx.translate(-canvas.width, 0);
      ctx.drawImage(video, 0, 0);
      ctx.restore();

      try {
        const poses = await detector.estimatePoses(video);
        if (poses.length > 0) {
          const kps = poses[0].keypoints;
          const mirrored = kps.map((kp: any) => ({ ...kp, x: canvas.width - kp.x }));
          drawSkeleton(ctx, mirrored);
          setPoseReady(true);
          const rightWrist = kps[10];
          if (rightWrist?.score > 0.35) {
            countDribble(rightWrist.y, canvas.height);
          }
        } else {
          setPoseReady(false);
        }
      } catch { /* skip */ }

      animRef.current = requestAnimationFrame(detect);
    };
    detect();
  }, []);

  const startDrill = async () => {
    if (!scriptsLoaded) {
      setError("Still loading — wait a moment and try again.");
      return;
    }
    setError("");
    setStatus("loading");
    setDribbleCount(0);
    dribbleCountRef.current = 0;
    wristHistoryRef.current = [];
    dribbleStateRef.current = "up";
    setTimer(drillDuration);
    setPoseReady(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 }, audio: false,
      });
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

      setStatus("running");
      startTimeRef.current = Date.now();

      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const remaining = drillDuration - elapsed;
        if (remaining <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          cancelAnimationFrame(animRef.current);
          setTimer(0);
          setStatus("done");
          stopCamera();
        } else {
          setTimer(remaining);
        }
      }, 500);

      runDetection();
    } catch (err: any) {
      setError(err.message?.includes("Permission") || err.message?.includes("NotAllowed")
        ? "Camera access denied. Please allow camera permission in your browser."
        : err.message || "Something went wrong. Try again.");
      setStatus("idle");
    }
  };

  const resetDrill = () => {
    stopCamera();
    setStatus("idle");
    setDribbleCount(0);
    dribbleCountRef.current = 0;
    setTimer(drillDuration);
    setPoseReady(false);
    setError("");
  };

  useEffect(() => () => stopCamera(), [stopCamera]);

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(10,10,10,0.95)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 32px", height: "56px",
      }}>
        <div style={{ fontSize: "18px", fontWeight: 900, letterSpacing: "-0.5px" }}>
          RZ<span style={{ color: "var(--accent)" }}>.</span>
        </div>
        <div style={{ fontSize: "13px", color: "var(--text2)", fontWeight: 600, letterSpacing: "0.5px" }}>DRILL CAMERA</div>
        <Link href="/dashboard">
          <button style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text2)", padding: "6px 16px", borderRadius: "6px", fontSize: "13px" }}>
            ← Dashboard
          </button>
        </Link>
      </nav>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "80px 24px 48px" }}>
        <div style={{ marginBottom: "32px" }}>
          <p style={{ color: "var(--accent)", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px" }}>
            Beta Feature
          </p>
          <h1 style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-1px", marginBottom: "8px" }}>Drill Camera</h1>
          <p style={{ color: "var(--text2)", fontSize: "14px", lineHeight: 1.6 }}>
            Uses your camera to detect body position and count dribbles in real time. Keep your full body visible.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: "20px", alignItems: "start" }}>
          {/* Camera */}
          <div style={{
            background: "#000", border: "1px solid var(--border)",
            borderRadius: "12px", overflow: "hidden", position: "relative",
            aspectRatio: "4/3",
          }}>
            <video ref={videoRef} style={{ display: "none" }} playsInline muted />
            <canvas ref={canvasRef} style={{
              width: "100%", height: "100%", objectFit: "cover",
              display: status === "running" || status === "done" ? "block" : "none",
            }} />

            {status === "idle" && (
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                <div style={{ fontSize: "40px" }}>📷</div>
                <p style={{ color: "var(--text3)", fontSize: "13px" }}>Camera will appear here</p>
              </div>
            )}
            {status === "loading" && (
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}>
                <div style={{ width: "36px", height: "36px", border: "3px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                <p style={{ color: "var(--text2)", fontSize: "13px" }}>Loading pose detection...</p>
                <p style={{ color: "var(--text3)", fontSize: "12px" }}>First load takes ~15 seconds</p>
              </div>
            )}

            {status === "running" && (
              <>
                <div style={{ position: "absolute", top: "12px", left: "12px", background: "rgba(0,0,0,0.75)", borderRadius: "8px", padding: "6px 16px", fontSize: "30px", fontWeight: 900, color: timer <= 5 ? "#ef4444" : "#fff" }}>
                  {timer}s
                </div>
                <div style={{
                  position: "absolute", top: "12px", right: "12px",
                  background: poseReady ? "rgba(0,230,118,0.15)" : "rgba(0,0,0,0.5)",
                  border: `1px solid ${poseReady ? "var(--green)" : "var(--border)"}`,
                  borderRadius: "6px", padding: "4px 10px", fontSize: "10px",
                  color: poseReady ? "var(--green)" : "var(--text3)", fontWeight: 700, letterSpacing: "1px",
                }}>
                  {poseReady ? "POSE DETECTED" : "SCANNING..."}
                </div>
                <div style={{ position: "absolute", bottom: "12px", left: "12px", background: "rgba(0,0,0,0.75)", borderRadius: "8px", padding: "8px 16px" }}>
                  <div style={{ fontSize: "11px", color: "var(--text2)", letterSpacing: "1px", textTransform: "uppercase" }}>Dribbles</div>
                  <div style={{ fontSize: "40px", fontWeight: 900, color: "var(--accent)", lineHeight: 1.1 }}>{dribbleCount}</div>
                </div>
                <div style={{ position: "absolute", bottom: "12px", right: "12px", background: "rgba(0,0,0,0.6)", borderRadius: "6px", padding: "6px 12px", fontSize: "12px", color: "var(--text2)" }}>
                  {selectedDrill}
                </div>
              </>
            )}

            {status === "done" && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.88)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px" }}>
                <p style={{ color: "var(--green)", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase" }}>Drill Complete</p>
                <div style={{ fontSize: "80px", fontWeight: 900, color: "var(--accent)", letterSpacing: "-3px", lineHeight: 1 }}>{dribbleCount}</div>
                <p style={{ color: "var(--text2)", fontSize: "14px" }}>dribbles in {drillDuration}s</p>
                <p style={{ color: "var(--text3)", fontSize: "13px" }}>{Math.round(dribbleCount / drillDuration * 60)} dribbles / min</p>
                <button onClick={resetDrill} style={{ marginTop: "8px", background: "var(--accent)", color: "#fff", padding: "10px 28px", borderRadius: "6px", fontSize: "14px", fontWeight: 700 }}>
                  Go Again
                </button>
              </div>
            )}
          </div>

          {/* Controls */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {/* Drill */}
            <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px" }}>
              <p style={{ fontSize: "10px", color: "var(--text3)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px" }}>Drill</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                {DRILLS.map(drill => (
                  <button key={drill} onClick={() => status === "idle" && setSelectedDrill(drill)} style={{
                    textAlign: "left",
                    background: selectedDrill === drill ? "rgba(14,165,233,0.12)" : "transparent",
                    border: `1px solid ${selectedDrill === drill ? "var(--accent)" : "var(--border)"}`,
                    color: selectedDrill === drill ? "#fff" : "var(--text2)",
                    borderRadius: "6px", padding: "7px 10px", fontSize: "12px",
                    cursor: status === "idle" ? "pointer" : "default",
                  }}>
                    {drill}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px" }}>
              <p style={{ fontSize: "10px", color: "var(--text3)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px" }}>Duration</p>
              <div style={{ display: "flex", gap: "6px" }}>
                {[30, 60, 90].map(s => (
                  <button key={s} onClick={() => { if (status === "idle") { setDrillDuration(s); setTimer(s); } }} style={{
                    flex: 1, padding: "8px 0", borderRadius: "6px", fontSize: "13px", fontWeight: 700,
                    background: drillDuration === s ? "var(--accent)" : "transparent",
                    border: `1px solid ${drillDuration === s ? "var(--accent)" : "var(--border)"}`,
                    color: drillDuration === s ? "#fff" : "var(--text2)",
                    cursor: status === "idle" ? "pointer" : "default",
                  }}>
                    {s}s
                  </button>
                ))}
              </div>
            </div>

            {status === "idle" && (
              <button onClick={startDrill} style={{ background: "var(--accent)", color: "#fff", padding: "13px", borderRadius: "8px", fontSize: "14px", fontWeight: 700, width: "100%" }}>
                Start Drill →
              </button>
            )}
            {status === "loading" && (
              <button disabled style={{ background: "var(--bg3)", color: "var(--text3)", padding: "13px", borderRadius: "8px", fontSize: "14px", width: "100%", cursor: "not-allowed" }}>
                Loading...
              </button>
            )}
            {status === "running" && (
              <button onClick={resetDrill} style={{ background: "transparent", border: "1px solid #ef4444", color: "#ef4444", padding: "13px", borderRadius: "8px", fontSize: "14px", fontWeight: 700, width: "100%" }}>
                Stop
              </button>
            )}

            {error && (
              <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "8px", padding: "10px 12px", fontSize: "12px", color: "#ef4444", lineHeight: 1.5 }}>
                {error}
              </div>
            )}

            <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "10px", padding: "14px" }}>
              <p style={{ fontSize: "10px", color: "var(--text3)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>Tips</p>
              {["Stand 1.5–2m from camera", "Good lighting = better tracking", "Full body in frame", "Dribble right hand for counting"].map(tip => (
                <p key={tip} style={{ fontSize: "11px", color: "var(--text2)", marginBottom: "5px", lineHeight: 1.4 }}>
                  <span style={{ color: "var(--accent)", marginRight: "5px" }}>—</span>{tip}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
