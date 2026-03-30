import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { MutableRefObject } from "react";
import type { Group } from "three";

type MouseVector = {
  x: number;
  y: number;
};

function HeroBot({ mouseRef }: { mouseRef: MutableRefObject<MouseVector> }) {
  const rootRef = useRef<Group | null>(null);
  const headRef = useRef<Group | null>(null);

  useFrame((state, delta) => {
    if (rootRef.current) {
      const t = state.clock.getElapsedTime();
      rootRef.current.position.y = -0.62 + Math.sin(t * 1.2) * 0.03;
    }

    if (!headRef.current) return;

    const tx = mouseRef.current.x * 0.45;
    const ty = mouseRef.current.y * 0.18;

    headRef.current.rotation.y += (tx - headRef.current.rotation.y) * Math.min(delta * 6.2, 1);
    headRef.current.rotation.x += (-ty - headRef.current.rotation.x) * Math.min(delta * 6.2, 1);
  });

  return (
    <group ref={rootRef} position={[0, -0.62, 0]}>
      <mesh position={[0, -1.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.85, 1.06, 0.86, 40]} />
        <meshStandardMaterial color="#0d1016" metalness={0.88} roughness={0.28} />
      </mesh>

      <mesh position={[0, -0.72, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.52, 0.74, 0.86, 36]} />
        <meshStandardMaterial color="#131a23" metalness={0.84} roughness={0.22} />
      </mesh>

      <mesh position={[0, -0.37, 0.51]} castShadow>
        <torusGeometry args={[0.32, 0.045, 18, 72]} />
        <meshStandardMaterial color="#f0f4ff" emissive="#a8b7d4" emissiveIntensity={0.25} />
      </mesh>

      <mesh position={[0, -0.26, 0.02]} castShadow receiveShadow>
        <cylinderGeometry args={[0.14, 0.2, 0.26, 24]} />
        <meshStandardMaterial color="#8892a2" metalness={0.4} roughness={0.42} />
      </mesh>

      <group ref={headRef} position={[0, 0.22, 0]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.55, 32, 32]} />
          <meshStandardMaterial color="#d9dee8" metalness={0.3} roughness={0.3} />
        </mesh>

        <mesh position={[0, 0.01, 0.46]}>
          <boxGeometry args={[0.56, 0.22, 0.08]} />
          <meshStandardMaterial color="#090b10" metalness={0.94} roughness={0.14} />
        </mesh>

        <mesh position={[-0.16, 0.03, 0.52]}>
          <sphereGeometry args={[0.045, 20, 20]} />
          <meshStandardMaterial color="#ffffff" emissive="#dfe8ff" emissiveIntensity={0.95} />
        </mesh>

        <mesh position={[0.16, 0.03, 0.52]}>
          <sphereGeometry args={[0.045, 20, 20]} />
          <meshStandardMaterial color="#ffffff" emissive="#dfe8ff" emissiveIntensity={0.95} />
        </mesh>

        <mesh position={[0, -0.2, 0.49]}>
          <cylinderGeometry args={[0.095, 0.12, 0.05, 20]} />
          <meshStandardMaterial color="#a3adbe" metalness={0.36} roughness={0.44} />
        </mesh>
      </group>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.62, 0]} receiveShadow>
        <circleGeometry args={[1.24, 64]} />
        <shadowMaterial opacity={0.26} />
      </mesh>
    </group>
  );
}

export default function HeroModelScene({ mouseRef }: { mouseRef: MutableRefObject<MouseVector> }) {
  return (
    <Canvas shadows dpr={[1, 1.6]} camera={{ position: [0, 0.72, 3.6], fov: 34 }}>
      <ambientLight intensity={0.42} />
      <directionalLight castShadow position={[2.7, 3.8, 3.8]} intensity={1.24} color="#ffffff" />
      <directionalLight position={[-2.7, 2.4, 1.8]} intensity={0.56} color="#b6c6ff" />
      <pointLight position={[0, 0.8, 2]} intensity={0.46} color="#ffffff" />
      <HeroBot mouseRef={mouseRef} />
    </Canvas>
  );
}
