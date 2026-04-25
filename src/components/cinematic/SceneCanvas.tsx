import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  Environment,
  MeshTransmissionMaterial,
  Stars,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useRef, Suspense, useMemo } from "react";
import * as THREE from "three";

export type SceneMode =
  | "intro" | "about" | "ai"
  | "work"  | "web"   | "services"
  | "stack" | "contact";

interface Props {
  progress: number;
  mode: SceneMode;
}

const FALLBACK_MODE = {
  color: "#bcd6ff", emissive: "#0a1f4a", ringColor: "#7fb0ff",
  particleColor: "#bcd6ff", scale: 1.0,
} as const;

const MODES: Record<SceneMode, typeof FALLBACK_MODE> = {
  intro:    { color: "#bcd6ff", emissive: "#0a1f4a", ringColor: "#7fb0ff", particleColor: "#bcd6ff", scale: 1.00 },
  about:    { color: "#a8d8ff", emissive: "#0a1830", ringColor: "#6fa8e8", particleColor: "#c0d8ff", scale: 0.90 },
  ai:       { color: "#9c88ff", emissive: "#1a0a3a", ringColor: "#b39bff", particleColor: "#c4b5fd", scale: 1.05 },
  work:     { color: "#ff9c6b", emissive: "#3a1a0a", ringColor: "#ffb088", particleColor: "#ffd0b5", scale: 0.85 },
  web:      { color: "#6bccff", emissive: "#0a2a3a", ringColor: "#88ddff", particleColor: "#b5eeff", scale: 0.95 },
  services: { color: "#6bffb0", emissive: "#0a3a1f", ringColor: "#88ffc4", particleColor: "#b5ffd0", scale: 1.10 },
  stack:    { color: "#ffe06b", emissive: "#3a2a0a", ringColor: "#ffe788", particleColor: "#fff1b5", scale: 0.75 },
  contact:  { color: "#ff6bb0", emissive: "#3a0a1f", ringColor: "#ff88c4", particleColor: "#ffb5d0", scale: 1.15 },
};

function getMode(mode: string): typeof FALLBACK_MODE {
  return (MODES as Record<string, typeof FALLBACK_MODE>)[mode] ?? FALLBACK_MODE;
}

function lerpColor(c: THREE.Color, hex: string, t: number) {
  c.lerp(new THREE.Color(hex), t);
}

/* ── Clean glass orb ── */
function GlassOrb({ progress, mode }: { progress: number; mode: SceneMode }) {
  const ref = useRef<THREE.Mesh>(null);
  const colorRef = useRef(new THREE.Color(MODES.intro.color));
  const attRef = useRef(new THREE.Color(MODES.intro.emissive));

  useFrame((state, delta) => {
    if (!ref.current) return;
    const m = getMode(mode);
    ref.current.rotation.x += delta * 0.06;
    ref.current.rotation.y += delta * 0.09;
    const s = (1.0 + Math.sin(state.clock.elapsedTime * 0.5) * 0.025 + progress * 0.1) * m.scale;
    ref.current.scale.setScalar(s);
    lerpColor(colorRef.current, m.color, 0.03);
    lerpColor(attRef.current, m.emissive, 0.03);
    const mat = ref.current.material as any;
    if (mat?.color) mat.color.copy(colorRef.current);
    if (mat?.attenuationColor) mat.attenuationColor.copy(attRef.current);
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.1, 3]} />
      <MeshTransmissionMaterial
        backside
        samples={8}
        thickness={0.8}
        chromaticAberration={0.15}
        anisotropy={0.1}
        distortion={0.2}
        distortionScale={0.2}
        temporalDistortion={0.08}
        ior={1.5}
        roughness={0.0}
        color={MODES.intro.color}
        attenuationColor={MODES.intro.emissive}
        attenuationDistance={1.5}
        transmissionSampler
      />
    </mesh>
  );
}

/* ── Thin elegant orbit rings ── */
function ElegantRing({ radius, tilt, speed, mode, opacity }: {
  radius: number; tilt: [number, number, number];
  speed: number; mode: SceneMode; opacity: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const colorRef = useRef(new THREE.Color(MODES.intro.ringColor));

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * speed;
    lerpColor(colorRef.current, getMode(mode).ringColor, 0.03);
    (ref.current.material as THREE.MeshBasicMaterial).color.copy(colorRef.current);
  });

  return (
    <mesh ref={ref} rotation={tilt}>
      <torusGeometry args={[radius, 0.003, 4, 180]} />
      <meshBasicMaterial color={MODES.intro.ringColor} transparent opacity={opacity} />
    </mesh>
  );
}

/* ── Very sparse, fine particle field ── */
function ParticleField({ count = 80, progress, mode }: {
  count?: number; progress: number; mode: SceneMode;
}) {
  const ref = useRef<THREE.Points>(null);
  const colorRef = useRef(new THREE.Color(MODES.intro.particleColor));
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 6 + Math.random() * 9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.018 + progress * 0.8;
    ref.current.rotation.x = state.clock.elapsedTime * 0.009;
    lerpColor(colorRef.current, getMode(mode).particleColor, 0.03);
    (ref.current.material as THREE.PointsMaterial).color.copy(colorRef.current);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.016} color={MODES.intro.particleColor} transparent opacity={0.45} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/* ── Core group ── */
function Core({ progress, mode }: { progress: number; mode: SceneMode }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.position.x = Math.sin(progress * Math.PI * 2) * 0.8;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.04 - progress * 0.2;
    group.current.rotation.y += delta * 0.08;
  });

  return (
    <group ref={group}>
      <Float speed={0.7} rotationIntensity={0.15} floatIntensity={0.35}>
        <GlassOrb progress={progress} mode={mode} />
      </Float>
      <ElegantRing radius={2.0}  tilt={[0, 0, 0]}                           speed={0.10}  mode={mode} opacity={0.35} />
      <ElegantRing radius={2.55} tilt={[Math.PI / 2.2, 0, 0]}               speed={-0.07} mode={mode} opacity={0.20} />
      <ElegantRing radius={3.1}  tilt={[Math.PI / 4, Math.PI / 3.5, 0]}     speed={0.05}  mode={mode} opacity={0.12} />
    </group>
  );
}

/* ── Camera ── */
function Rig({ progress }: { progress: number }) {
  useFrame((state) => {
    const cam = state.camera;
    const targetZ = 5.8 - Math.sin(progress * Math.PI) * 0.9;
    const targetY = Math.sin(progress * Math.PI * 1.5) * 0.4;
    const targetX = Math.sin(progress * Math.PI * 1.2) * -0.5;
    cam.position.x += (targetX - cam.position.x) * 0.04;
    cam.position.y += (targetY - cam.position.y) * 0.04;
    cam.position.z += (targetZ - cam.position.z) * 0.04;
    cam.lookAt(0, 0, 0);
  });
  return null;
}

export function SceneCanvas({ progress, mode }: Props) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 5.8], fov: 42 }}
      style={{ position: "fixed", inset: 0, pointerEvents: "none" }}
    >
      <Suspense fallback={null}>
        <color attach="background" args={["#05060a"]} />
        <fog attach="fog" args={["#05060a", 9, 22]} />

        <ambientLight intensity={0.2} />
        <directionalLight position={[4, 6, 4]}  intensity={1.6} color="#aaccff" />
        <directionalLight position={[-4, -2, -4]} intensity={0.5} color="#334466" />
        <pointLight position={[0, 0, 3]} intensity={0.6} color="#7fb0ff" />

        {/* Very faint star field — background depth only */}
        <Stars radius={80} depth={60} count={600} factor={1.8} fade speed={0.2} />
        <ParticleField progress={progress} mode={mode} />

        <Core progress={progress} mode={mode} />
        <Rig progress={progress} />

        <Environment preset="studio" />

        <EffectComposer>
          <Bloom intensity={0.8} luminanceThreshold={0.4} luminanceSmoothing={0.92} mipmapBlur />
          <Vignette eskil={false} offset={0.25} darkness={0.9} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
