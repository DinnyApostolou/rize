"use client";
import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial, Environment } from "@react-three/drei";
import * as THREE from "three";

function Ball() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += 0.004;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
  });

  return (
    <mesh ref={meshRef} castShadow>
      {/* Main ball */}
      <sphereGeometry args={[1.4, 64, 64]} />
      <meshStandardMaterial
        color="#C85A1A"
        roughness={0.6}
        metalness={0.05}
        envMapIntensity={0.8}
      />
    </mesh>
  );
}

function Seams() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.004;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
  });

  const seamPoints = (count: number, axis: "x" | "y" | "z") => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= count; i++) {
      const t = (i / count) * Math.PI * 2;
      const r = 1.42;
      if (axis === "y") pts.push(new THREE.Vector3(Math.cos(t) * r, 0, Math.sin(t) * r));
      else if (axis === "x") pts.push(new THREE.Vector3(0, Math.cos(t) * r, Math.sin(t) * r));
      else pts.push(new THREE.Vector3(Math.cos(t) * r, Math.sin(t) * r, 0));
    }
    return pts;
  };

  const makeCurve = (axis: "x" | "y" | "z") => {
    const curve = new THREE.CatmullRomCurve3(seamPoints(80, axis));
    const geo = new THREE.TubeGeometry(curve, 100, 0.022, 8, true);
    return geo;
  };

  return (
    <group ref={groupRef}>
      {(["y", "x", "z"] as const).map((axis, i) => (
        <mesh key={i} geometry={makeCurve(axis)}>
          <meshStandardMaterial color="#1a0800" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function Glow() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.08 + Math.sin(state.clock.elapsedTime * 1.2) * 0.03;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.8, 32, 32]} />
      <meshBasicMaterial color="#ff6a1a" transparent opacity={0.08} side={THREE.BackSide} />
    </mesh>
  );
}

export default function Basketball3D() {
  return (
    <div style={{ width: "100%", height: "340px", cursor: "grab" }}>
      <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }} shadows>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
        <pointLight position={[-4, -3, -4]} intensity={0.5} color="#0074FF" />
        <pointLight position={[0, 4, 0]} intensity={0.8} color="#ff8040" />
        <Suspense fallback={null}>
          <Ball />
          <Seams />
          <Glow />
          <Environment preset="night" />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
      </Canvas>
      <p style={{ textAlign: "center", fontSize: "11px", color: "var(--text3)", marginTop: "8px", letterSpacing: "1px" }}>DRAG TO ROTATE</p>
    </div>
  );
}
