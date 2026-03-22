"use client";
import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";

function Dumbbell() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.005;
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.07;
  });

  const metalMat = { color: "#888fa0", roughness: 0.15, metalness: 0.95, envMapIntensity: 1.5 };
  const plateMat = { color: "#1a1a2e", roughness: 0.3, metalness: 0.8 };

  return (
    <group ref={groupRef}>
      {/* Bar */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 2.8, 32]} />
        <meshStandardMaterial {...metalMat} />
      </mesh>

      {/* Left plates */}
      {[-1.1, -1.35].map((x, i) => (
        <mesh key={`l${i}`} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[i === 0 ? 0.75 : 0.62, i === 0 ? 0.75 : 0.62, i === 0 ? 0.18 : 0.14, 32]} />
          <meshStandardMaterial {...plateMat} />
        </mesh>
      ))}

      {/* Right plates */}
      {[1.1, 1.35].map((x, i) => (
        <mesh key={`r${i}`} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[i === 0 ? 0.75 : 0.62, i === 0 ? 0.75 : 0.62, i === 0 ? 0.18 : 0.14, 32]} />
          <meshStandardMaterial {...plateMat} />
        </mesh>
      ))}

      {/* Collar rings */}
      {[-0.88, 0.88].map((x, i) => (
        <mesh key={`c${i}`} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.16, 0.16, 0.1, 24]} />
          <meshStandardMaterial color="#0074FF" roughness={0.2} metalness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

export default function Dumbbell3D() {
  return (
    <div style={{ width: "100%", height: "300px", cursor: "grab" }}>
      <Canvas camera={{ position: [0, 1.5, 5], fov: 42 }} shadows>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={2.5} color="#ffffff" />
        <pointLight position={[-5, -2, -3]} intensity={0.6} color="#8B5CF6" />
        <pointLight position={[0, 3, 2]} intensity={1} color="#0074FF" />
        <Suspense fallback={null}>
          <Dumbbell />
          <Environment preset="studio" />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
      <p style={{ textAlign: "center", fontSize: "11px", color: "var(--text3)", marginTop: "8px", letterSpacing: "1px" }}>DRAG TO ROTATE</p>
    </div>
  );
}
