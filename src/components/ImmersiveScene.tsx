import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { AICore } from "./three/AICoreScene";
import { ParticleField } from "./three/Particles";
import { SkillsGalaxy } from "./three/SkillsGalaxy";
import { Portal } from "./three/Portal";
import { ProjectPanels } from "./three/ProjectPanels";

// Scroll-driven camera that flies through the scenes
function ScrollCamera({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  const { camera, mouse } = useThree();
  const target = useRef(new THREE.Vector3());

  // Waypoints — y position = scene index * -20
  const waypoints = [
    { pos: new THREE.Vector3(0, 0, 6), look: new THREE.Vector3(0, 0, 0) },        // hero / AI core
    { pos: new THREE.Vector3(0, -20, 7), look: new THREE.Vector3(0, -20, 0) },     // projects
    { pos: new THREE.Vector3(0, -40, 8), look: new THREE.Vector3(0, -40, 0) },     // skills galaxy
    { pos: new THREE.Vector3(0, -60, 6), look: new THREE.Vector3(0, -60, 0) },     // portal
  ];

  useFrame(() => {
    const p = scrollRef.current * (waypoints.length - 1);
    const i = Math.floor(p);
    const t = p - i;
    const a = waypoints[Math.min(i, waypoints.length - 1)];
    const b = waypoints[Math.min(i + 1, waypoints.length - 1)];

    // Smoothstep
    const ts = t * t * (3 - 2 * t);
    const camPos = a.pos.clone().lerp(b.pos, ts);
    const lookAt = a.look.clone().lerp(b.look, ts);

    // Mouse parallax
    camPos.x += mouse.x * 0.8;
    camPos.y += mouse.y * 0.4;

    camera.position.lerp(camPos, 0.08);
    target.current.lerp(lookAt, 0.08);
    camera.lookAt(target.current);
  });

  return null;
}

interface ImmersiveSceneProps {
  scrollRef: React.MutableRefObject<number>;
}

export function ImmersiveScene({ scrollRef }: ImmersiveSceneProps) {
  return (
    <Canvas
      className="!fixed inset-0"
      camera={{ position: [0, 0, 6], fov: 55 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      dpr={[1, 2]}
    >
      <color attach="background" args={["#05030d"]} />
      <fog attach="fog" args={["#05030d", 10, 28]} />

      <Suspense fallback={null}>
        <ScrollCamera scrollRef={scrollRef} />

        {/* Ambient lighting */}
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={0.4} color="#a855f7" />

        {/* Background particles — sparse, subtle */}
        <group>
          <ParticleField count={800} radius={30} color="#a855f7" size={0.014} />
        </group>
        <group position={[0, -30, 0]}>
          <ParticleField count={700} radius={28} color="#7dd3fc" size={0.012} />
        </group>

        {/* Scene 1: Hero AI Core */}
        <AICore position={[0, 0, 0]} />

        {/* Scene 2: Projects */}
        <ProjectPanels position={[0, -20, 0]} />

        {/* Scene 3: Skills Galaxy */}
        <SkillsGalaxy position={[0, -40, 0]} />

        {/* Scene 4: Portal */}
        <Portal position={[0, -60, 0]} />

        <EffectComposer>
          <Bloom
            intensity={0.6}
            luminanceThreshold={0.4}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.3} darkness={0.6} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
