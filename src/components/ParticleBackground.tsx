"use client";
import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  originX: number; originY: number;
  size: number;
  opacity: number;
  color: string;
  pulse: number;
  pulseSpeed: number;
  speed: number;
  angle: number;
  angleSpeed: number;
}

const COLORS = [
  "0, 116, 255",
  "56, 189, 248",
  "124, 58, 237",
  "0, 200, 255",
  "99, 102, 241",
  "147, 51, 234",
  "14, 165, 233",
];

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    const init = () => {
      const COUNT = Math.min(Math.floor((canvas.width * canvas.height) / 4500), 320);
      particlesRef.current = Array.from({ length: COUNT }, () => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const isLarge = Math.random() < 0.15;
        return {
          x, y,
          originX: x, originY: y,
          vx: 0, vy: 0,
          size: isLarge ? Math.random() * 3 + 2.5 : Math.random() * 1.8 + 0.5,
          opacity: isLarge ? 0.7 + Math.random() * 0.3 : 0.3 + Math.random() * 0.5,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.012 + Math.random() * 0.02,
          speed: 0.3 + Math.random() * 0.5,
          angle: Math.random() * Math.PI * 2,
          angleSpeed: (Math.random() - 0.5) * 0.008,
        };
      });
    };

    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMouseMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const ATTRACT_RADIUS = 200;

      for (const p of particles) {
        // Organic floating — each particle drifts in a slowly rotating direction
        p.angle += p.angleSpeed;
        const driftX = Math.cos(p.angle) * p.speed;
        const driftY = Math.sin(p.angle) * p.speed;

        // Cursor attraction — gently pulls nearby dots toward cursor
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let attractX = 0, attractY = 0;
        if (dist < ATTRACT_RADIUS && dist > 0) {
          const force = (1 - dist / ATTRACT_RADIUS) * 0.6;
          attractX = (dx / dist) * force;
          attractY = (dy / dist) * force;
        }

        p.vx += driftX * 0.05 + attractX * 0.08;
        p.vy += driftY * 0.05 + attractY * 0.08;

        // Damping
        p.vx *= 0.92;
        p.vy *= 0.92;

        // Cap speed
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const maxSpeed = 2.5;
        if (spd > maxSpeed) { p.vx = (p.vx / spd) * maxSpeed; p.vy = (p.vy / spd) * maxSpeed; }

        p.x += p.vx;
        p.y += p.vy;

        // Soft boundary wrap
        const pad = 50;
        if (p.x < -pad) p.x = canvas.width + pad;
        if (p.x > canvas.width + pad) p.x = -pad;
        if (p.y < -pad) p.y = canvas.height + pad;
        if (p.y > canvas.height + pad) p.y = -pad;

        // Pulse opacity
        p.pulse += p.pulseSpeed;
        const pFactor = 0.8 + Math.sin(p.pulse) * 0.2;
        const baseOp = dist < ATTRACT_RADIUS && dist > 0
          ? Math.min(p.opacity + (1 - dist / ATTRACT_RADIUS) * 0.5, 1)
          : p.opacity;
        const finalOp = baseOp * pFactor;

        // Outer glow
        const glowR = p.size * 6;
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
        grd.addColorStop(0,   `rgba(${p.color}, ${finalOp * 0.8})`);
        grd.addColorStop(0.25, `rgba(${p.color}, ${finalOp * 0.35})`);
        grd.addColorStop(0.6,  `rgba(${p.color}, ${finalOp * 0.1})`);
        grd.addColorStop(1,    `rgba(${p.color}, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${Math.min(finalOp + 0.15, 1)})`;
        ctx.fill();
      }

      // Cursor glow ring
      if (mouse.x > 0 && mouse.x < canvas.width) {
        const cg = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 180);
        cg.addColorStop(0,   "rgba(0,116,255,0.1)");
        cg.addColorStop(0.4, "rgba(124,58,237,0.05)");
        cg.addColorStop(1,   "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 180, 0, Math.PI * 2);
        ctx.fillStyle = cg;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }} />
  );
}
