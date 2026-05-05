import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

const PROJECTS = [
  { title: "NEURAL SYNC", tag: "AI AUTOMATION", color: "#a855f7" },
  { title: "FLOW ENGINE", tag: "WORKFLOW AI", color: "#7dd3fc" },
  { title: "VOID CHAT", tag: "LLM PRODUCT", color: "#f0abfc" },
  { title: "ORBIT DASH", tag: "DATA VIZ", color: "#67e8f9" },
];

function Panel({
  position,
  rotation,
  data,
  index,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  data: (typeof PROJECTS)[number];
  index: number;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.6 + index) * 0.15;
      ref.current.rotation.y =
        rotation[1] + Math.sin(state.clock.elapsedTime * 0.3 + index) * 0.05;
    }
  });

  return (
    <group ref={ref} position={position} rotation={rotation}>
      <RoundedBox args={[2.4, 1.5, 0.05]} radius={0.08} smoothness={4}>
        <meshPhysicalMaterial
          color="#0a0a14"
          emissive={data.color}
          emissiveIntensity={0.15}
          metalness={0.9}
          roughness={0.2}
          clearcoat={1}
          transparent
          opacity={0.92}
        />
      </RoundedBox>
      {/* Glow border */}
      <mesh position={[0, 0, 0.027]}>
        <planeGeometry args={[2.42, 1.52]} />
        <meshBasicMaterial color={data.color} transparent opacity={0.05} />
      </mesh>
      <Text
        position={[0, 0.15, 0.04]}
        fontSize={0.22}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.005}
        outlineColor={data.color}
      >
        {data.title}
      </Text>
      <Text
        position={[0, -0.2, 0.04]}
        fontSize={0.09}
        color={data.color}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.15}
      >
        {data.tag}
      </Text>
      <pointLight color={data.color} intensity={1.5} distance={3} position={[0, 0, 0.5]} />
    </group>
  );
}

export function ProjectPanels({ position = [0, 0, 0] as [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {PROJECTS.map((p, i) => {
        const angle = (i / PROJECTS.length) * Math.PI * 2;
        const r = 3.2;
        return (
          <Panel
            key={i}
            index={i}
            data={p}
            position={[Math.cos(angle) * r, Math.sin(i * 0.7) * 0.5, Math.sin(angle) * r]}
            rotation={[0, -angle + Math.PI / 2, 0]}
          />
        );
      })}
    </group>
  );
}
