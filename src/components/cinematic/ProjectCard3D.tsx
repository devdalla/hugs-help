import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Environment } from "@react-three/drei";
import { Suspense, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import * as THREE from "three";

interface Project {
  n: string;
  title: string;
  tag: string;
  client: string;
  desc: string;
  metrics: { k: string; v: string }[];
  image: string;
  color: string;
  shape: "ico" | "torus" | "sphere" | "knot";
}

/* Inner shape that tilts with hover */
function HoverShape({ shape, color, hover }: { shape: Project["shape"]; color: string; hover: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * (0.2 + hover * 0.6);
    ref.current.rotation.y += delta * (0.25 + hover * 0.8);
    const s = 0.85 + hover * 0.25 + Math.sin(state.clock.elapsedTime) * 0.02;
    ref.current.scale.setScalar(s);
  });

  const geo =
    shape === "ico" ? <icosahedronGeometry args={[1, 1]} /> :
    shape === "torus" ? <torusGeometry args={[0.75, 0.28, 32, 96]} /> :
    shape === "knot" ? <torusKnotGeometry args={[0.7, 0.22, 128, 32]} /> :
    <sphereGeometry args={[1, 64, 64]} />;

  return (
    <Float speed={1.2} rotationIntensity={0.5} floatIntensity={0.6}>
      <mesh ref={ref}>
        {geo}
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4 + hover * 0.6}
          roughness={0.15}
          metalness={0.85}
          distort={0.35 + hover * 0.25}
          speed={1.5}
        />
      </mesh>
    </Float>
  );
}

export function ProjectCard3D({ project, index }: { project: Project; index: number }) {
  const [hover, setHover] = useState(0);
  const reverse = index % 2 === 1;

  // 3D tilt
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 180, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 180, damping: 20 });
  const tx = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 200, damping: 25 });
  const ty = useSpring(useTransform(my, [-0.5, 0.5], [-12, 12]), { stiffness: 200, damping: 25 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const handleLeave = () => {
    mx.set(0); my.set(0); setHover(0);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.1, ease: [0.7, 0, 0.2, 1] }}
      className={`group grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}
    >
      {/* Visual w/ 3D tilt + canvas overlay */}
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseEnter={() => setHover(1)}
        onMouseLeave={handleLeave}
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200, transformStyle: "preserve-3d" }}
        className="md:col-span-7 relative"
        data-cursor="view"
      >
        <div className="relative aspect-[16/11] overflow-hidden rounded-2xl border border-white/10 bg-card/30">
          <motion.img
            src={project.image}
            alt={`${project.title} — ${project.tag}`}
            loading="lazy"
            width={1280}
            height={896}
            style={{ x: tx, y: ty, scale: 1.08 }}
            className="absolute inset-0 w-full h-full object-cover will-change-transform transition-[filter] duration-700 group-hover:brightness-110"
          />
          {/* Color tint that intensifies on hover */}
          <motion.div
            className="absolute inset-0 mix-blend-color pointer-events-none"
            style={{ background: project.color, opacity: useTransform(rx, () => hover * 0.35) }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent pointer-events-none" />

          {/* 3D Canvas overlay — only mounts on hover for perf */}
          <motion.div
            initial={false}
            animate={{ opacity: hover ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 pointer-events-none"
            style={{ transform: "translateZ(60px)" }}
          >
            {hover > 0 && (
              <Canvas dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }} camera={{ position: [0, 0, 3.2], fov: 45 }}>
                <Suspense fallback={null}>
                  <ambientLight intensity={0.4} />
                  <directionalLight position={[3, 3, 3]} intensity={1.6} />
                  <pointLight position={[-2, -1, 2]} intensity={1} color={project.color} />
                  <HoverShape shape={project.shape} color={project.color} hover={hover} />
                  <Environment preset="city" />
                </Suspense>
              </Canvas>
            )}
          </motion.div>

          {/* Top label */}
          <div className="absolute top-5 left-5 right-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/80 z-10">
            <span>{project.n} / {project.tag}</span>
            <span className="hidden md:inline opacity-60">{project.client}</span>
          </div>

          {/* "View case" pill */}
          <motion.div
            initial={false}
            animate={{ opacity: hover ? 1 : 0, y: hover ? 0 : 12 }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-5 left-5 z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-foreground/90 text-background text-[10px] font-mono uppercase tracking-[0.2em]"
          >
            View case <span>→</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Copy */}
      <div className="md:col-span-5 md:px-2">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary mb-4">
          {project.n} — {project.client}
        </div>
        <h3 className="font-display text-4xl md:text-5xl font-light tracking-[-0.02em] mb-5 group-hover:text-gradient transition-all duration-700">
          {project.title}
        </h3>
        <p className="text-muted-foreground leading-relaxed text-base md:text-[17px] mb-8 max-w-md">
          {project.desc}
        </p>
        <div className="grid grid-cols-3 gap-5 max-w-md border-t border-white/10 pt-6">
          {project.metrics.map((m) => (
            <div key={m.v}>
              <div className="font-display text-xl md:text-2xl font-light text-foreground">{m.k}</div>
              <div className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground leading-tight">
                {m.v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
