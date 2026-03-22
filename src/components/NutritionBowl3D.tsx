"use client";
import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

function Bowl() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.004;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.06;
  });

  return (
    <group ref={groupRef}>
      {/* Bowl body */}
      <mesh position={[0, -0.1, 0]}>
        <sphereGeometry args={[1.2, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshStandardMaterial color="#e8e0d5" roughness={0.3} metalness={0.05} side={THREE.DoubleSide} />
      </mesh>

      {/* Bowl rim */}
      <mesh position={[0, 0.53, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.18, 0.06, 16, 64]} />
        <meshStandardMaterial color="#d4ccc2" roughness={0.25} metalness={0.1} />
      </mesh>

      {/* Rice/grain base */}
      <mesh position={[0, 0.25, 0]}>
        <sphereGeometry args={[1.0, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.3]} />
        <meshStandardMaterial color="#f5f0e0" roughness={0.9} />
      </mesh>

      {/* Chicken / protein piece */}
      <mesh position={[0.2, 0.55, 0.1]} rotation={[0.3, 0.5, 0.2]}>
        <boxGeometry args={[0.55, 0.2, 0.4]} />
        <meshStandardMaterial color="#c8763a" roughness={0.8} />
      </mesh>

      {/* Broccoli blobs */}
      {[[-0.4, 0.65, 0.3], [0.35, 0.62, -0.35], [-0.1, 0.68, -0.3]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.18 + i * 0.02, 12, 12]} />
          <meshStandardMaterial color={i === 1 ? "#2d8a3e" : "#3aad52"} roughness={0.9} />
        </mesh>
      ))}

      {/* Cherry tomatoes */}
      {[[0.6, 0.6, 0.1], [-0.55, 0.58, -0.1], [0.1, 0.62, 0.45]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#e03030" roughness={0.6} />
        </mesh>
      ))}

      {/* Avocado slice */}
      <mesh position={[-0.3, 0.57, 0.35]} rotation={[0.5, 0, 0.3]}>
        <sphereGeometry args={[0.18, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color="#5a8a2e" roughness={0.7} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export default function NutritionBowl3D() {
  return (
    <div style={{ width: "100%", height: "320px", cursor: "grab" }}>
      <Canvas camera={{ position: [0, 2.5, 4.5], fov: 42 }} shadows>
        <ambientLight intensity={0.7} />
        <pointLight position={[5, 5, 5]} intensity={2} color="#fff8e8" />
        <pointLight position={[-4, 2, -3]} intensity={0.6} color="#10B981" />
        <pointLight position={[2, -1, 3]} intensity={0.4} color="#ffffff" />
        <Suspense fallback={null}>
          <Bowl />
          <Environment preset="apartment" />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
      <p style={{ textAlign: "center", fontSize: "11px", color: "var(--text3)", marginTop: "8px", letterSpacing: "1px" }}>DRAG TO ROTATE</p>
    </div>
  );
}
