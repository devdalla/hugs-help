import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Billboard } from "@react-three/drei";
import * as THREE from "three";

const SKILLS = [
  "Python", "TypeScript", "React", "Next.js", "Three.js",
  "OpenAI", "LangChain", "n8n", "Make", "Zapier",
  "Node.js", "PostgreSQL", "Vector DB", "Pinecone", "Supabase",
  "TailwindCSS", "GSAP", "WebGL", "GLSL", "Figma",
];

export function SkillsGalaxy({ position = [0, 0, 0] as [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);

  const items = useMemo(() => {
    return SKILLS.map((label, i) => {
      const t = i / SKILLS.length;
      const phi = Math.acos(1 - 2 * t);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 4.5;
      return {
        label,
        pos: [
          r * Math.cos(theta) * Math.sin(phi),
          r * Math.sin(theta) * Math.sin(phi),
          r * Math.cos(phi),
        ] as [number, number, number],
        speed: 0.3 + Math.random() * 0.4,
      };
    });
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.08;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Central glow sphere */}
      <mesh>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshBasicMaterial color="#7dd3fc" transparent opacity={0.15} />
      </mesh>
      <pointLight color="#7dd3fc" intensity={3} distance={8} />

      {items.map((it, i) => (
        <group key={i} position={it.pos}>
          <Billboard>
            <Text
              fontSize={0.32}
              color="#e9d5ff"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.005}
              outlineColor="#7dd3fc"
            >
              {it.label}
            </Text>
          </Billboard>
          <mesh>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color={i % 2 ? "#a855f7" : "#7dd3fc"} />
          </mesh>
        </group>
      ))}

      {/* Connecting lines (orbital rings) */}
      {[1.2, 1.5, 1.8].map((s, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.4, i * 0.6, 0]}>
          <torusGeometry args={[4.5 * s * 0.5, 0.005, 8, 100]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}
