import { useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial, Environment } from "@react-three/drei";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

function TimelineCore3D() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
      groupRef.current.rotation.x += delta * 0.1;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh>
          <icosahedronGeometry args={[4, 1]} />
          <meshBasicMaterial color="#7fb0ff" wireframe transparent opacity={0.03} />
        </mesh>
        <mesh scale={0.8}>
          <icosahedronGeometry args={[2.5, 3]} />
          <MeshTransmissionMaterial 
            backside
            samples={4}
            thickness={1.5}
            chromaticAberration={0.1}
            ior={1.2}
            color="#7fb0ff"
            attenuationColor="#0a1f4a"
            attenuationDistance={3}
            transparent
            opacity={0.6}
          />
        </mesh>
        <pointLight color="#7fb0ff" intensity={2} distance={8} />
      </Float>
    </group>
  );
}

const TIMELINE = [
  { year: "2019", label: "First line of code", body: "Fell into programming at 16. Built a website in a weekend and never looked back." },
  { year: "2021", label: "First AI in production", body: "Deployed a live NLP pipeline for a startup. It ran for 18 months untouched by human hands." },
  { year: "2022", label: "Went independent", body: "Left university. Month one was terrifying. Month two, three clients." },
  { year: "2024", label: "40+ systems shipped", body: "Crossed the milestone — 40 production AI systems across 12 industries and 3 continents." },
  { year: "2025", label: "Now", body: "Building AI-native products and taking select client engagements. Open to what's next." },
];

const TRAITS = [
  { label: "Based in", value: "India 🇮🇳" },
  { label: "Age", value: "21" },
  { label: "Started coding", value: "2019" },
  { label: "Specialty", value: "AI Systems" },
  { label: "Status", value: "Available Q3" },
  { label: "Chess rating", value: "1800+ ♟" },
];

export function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!timelineRef.current || !lineRef.current) return;

    // Energy line animation
    gsap.to(lineRef.current, {
      scaleY: 1,
      ease: "none",
      scrollTrigger: {
        trigger: timelineRef.current,
        start: "top center",
        end: "bottom center",
        scrub: true,
      },
    });

    // Milestone animations
    nodesRef.current.forEach((node, i) => {
      if (!node) return;
      const dot = node.querySelector('.timeline-dot');
      const ring = node.querySelector('.timeline-ring');
      const content = node.querySelector('.timeline-content');
      const year = node.querySelector('.timeline-year');
      
      const isLast = i === TIMELINE.length - 1;

      // Inactive initial state
      gsap.set(content, { opacity: 0.3, scale: 0.96, filter: "blur(4px)" });
      gsap.set(dot, { scale: 0.6, backgroundColor: "transparent", borderColor: "rgba(255,255,255,0.15)" });
      gsap.set(ring, { scale: 0, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: node,
          start: "top 60%", 
          end: "bottom 30%",
          toggleActions: isLast ? "play none none reverse" : "play reverse play reverse",
        }
      });

      tl.to(content, {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.8,
        ease: "power3.out"
      }, 0)
      .to(year, {
        color: "var(--color-primary)",
        duration: 0.5
      }, 0)
      .to(dot, {
        scale: 1,
        backgroundColor: "var(--color-primary)",
        borderColor: "var(--color-primary)",
        boxShadow: "0 0 20px oklch(0.72 0.13 240 / 0.8)",
        duration: 0.5,
        ease: "back.out(2)"
      }, 0)
      .to(ring, {
        scale: 3,
        opacity: 0,
        duration: 1.2,
        ease: "power2.out"
      }, 0);

      if (isLast) {
        gsap.to(dot, {
          scale: 1.25,
          boxShadow: "0 0 30px oklch(0.72 0.13 240 / 1)",
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
        gsap.to(content, {
          scale: 1.02,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }
    });
  }, { scope: timelineRef });

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative overflow-hidden"
    >
      {/* ── Part 1: Full-bleed identity statement ── */}
      <div className="relative px-6 md:px-16 lg:px-24 py-28 md:py-40 border-b border-white/6">
        {/* Smooth top fade from hero */}
        <div
          aria-hidden
          className="absolute top-0 inset-x-0 h-32 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, oklch(0.055 0.010 250) 0%, transparent 100%)" }}
        />
        {/* Large decorative chapter number */}
        <div
          aria-hidden
          className="absolute right-6 md:right-12 top-12 font-display font-bold text-[clamp(6rem,18vw,16rem)] leading-none text-white/[0.03] select-none pointer-events-none"
          style={{ fontFamily: "var(--font-display)" }}
        >
          01
        </div>

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="chapter-num mb-10"
          >
            <span className="text-primary mr-3">01</span> About
          </motion.div>

          {/* Name + role strip */}
          <div className="flex flex-col gap-6 mb-16">
            {/* The headline */}
            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1.1, ease: [0.7, 0, 0.2, 1] }}
                className="font-display font-bold text-[clamp(2.8rem,8vw,8rem)] leading-[0.92] tracking-[-0.03em] text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Aryan Garg
              </motion.h2>
            </div>

            <div className="overflow-hidden">
              <motion.p
                initial={{ y: "100%", opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1, delay: 0.15, ease: [0.7, 0, 0.2, 1] }}
                className="font-display text-[clamp(1.4rem,3.5vw,3.5rem)] font-light leading-tight tracking-[-0.01em] text-primary/80"
                style={{ fontFamily: "var(--font-display)" }}
              >
                AI Engineer · Full-Stack Dev
              </motion.p>
            </div>
          </div>

          {/* Two-col layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16 lg:gap-24 items-start">
            {/* Left — rich bio */}
            <div>
              {[
                "I'm a 21-year-old independent engineer who dropped out of university to build AI systems full-time. Not chatbots. Not demos. Real systems that replace real work.",
                "My craft is at the intersection of large language models, workflow automation, and premium product engineering. I design end-to-end pipelines with proper evals, observability, and guardrails — the kind that run for months untouched.",
                "When I'm not shipping production systems, I'm deep in competitive chess, exploring how interfaces can feel alive, or writing about what's coming next in AI.",
              ].map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.9, delay: i * 0.12 }}
                  className={`leading-[1.75] ${i === 0 ? "text-lg md:text-xl text-foreground/90 font-medium mb-6" : "text-base text-muted-foreground mb-5"}`}
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {para}
                </motion.p>
              ))}

              {/* Tag chips */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.7 }}
                className="flex flex-wrap gap-2 mt-8"
              >
                {["LangGraph", "OpenAI API", "LLM Ops", "RAG Systems", "Voice AI", "Next.js", "Three.js", "Python"].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-md text-[11px] font-mono uppercase tracking-[0.15em] border border-white/10 text-muted-foreground/70 hover:border-primary/50 hover:text-primary/80 transition-all duration-300 cursor-default"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right — elegant info card */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.7, 0, 0.2, 1] }}
              className="relative"
            >
              {/* Card */}
              <div
                className="relative rounded-2xl overflow-hidden border border-white/10"
                style={{
                  background: "linear-gradient(135deg, oklch(0.12 0.018 250) 0%, oklch(0.09 0.012 250) 100%)",
                  boxShadow: "0 40px 80px oklch(0 0 0 / 0.4), inset 0 1px 0 oklch(1 0 0 / 0.08)",
                }}
              >
                {/* Glow accent top */}
                <div
                  aria-hidden
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: "linear-gradient(90deg, transparent, oklch(0.72 0.13 240 / 0.6), transparent)" }}
                />

                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                      <span className="text-primary text-sm">AG</span>
                    </div>
                    <div>
                      <div
                        className="text-sm font-display font-semibold text-foreground"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        Aryan Garg
                      </div>
                      <div
                        className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary/70"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        Independent · AI Engineer
                      </div>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span
                        className="text-[9px] font-mono uppercase tracking-[0.2em] text-emerald-400/70"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        Available
                      </span>
                    </div>
                  </div>

                  {/* Traits grid */}
                  <div className="grid grid-cols-2 gap-px bg-white/6 rounded-xl overflow-hidden">
                    {TRAITS.map((t, i) => (
                      <motion.div
                        key={t.label}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + i * 0.06 }}
                        className="flex flex-col gap-1 p-4 bg-[oklch(0.10_0.015_250)] hover:bg-[oklch(0.13_0.018_250)] transition-colors duration-300"
                      >
                        <span
                          className="text-[9px] font-mono uppercase tracking-[0.25em] text-muted-foreground/50"
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          {t.label}
                        </span>
                        <span
                          className="text-sm font-display font-semibold text-foreground"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {t.value}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Big stats */}
                  <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-white/8">
                    {[
                      { k: "40+", v: "Shipped" },
                      { k: "$8M+", v: "Saved" },
                      { k: "12", v: "Industries" },
                    ].map((s, i) => (
                      <div key={s.v} className="text-center">
                        <div
                          className="font-display font-bold text-2xl text-primary"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {s.k}
                        </div>
                        <div
                          className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground/60 mt-0.5"
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          {s.v}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating glow behind card */}
              <div
                aria-hidden
                className="absolute -inset-4 -z-10 rounded-3xl opacity-30 pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse at center, oklch(0.72 0.13 240 / 0.3), transparent 70%)",
                  filter: "blur(24px)",
                }}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Part 2: Timeline (Cinematic 3D) ── */}
      <div
        ref={timelineRef}
        className="relative px-6 md:px-16 lg:px-24 py-32"
      >
        {/* Local 3D Canvas Background */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
          <Canvas
            camera={{ position: [0, 0, 10], fov: 35 }}
            gl={{ alpha: true, antialias: true }}
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} intensity={1} />
            <TimelineCore3D />
            <Environment preset="studio" />
          </Canvas>
        </div>

        {/* Decorative "TIMELINE" watermark */}
        <div
          aria-hidden
          className="absolute left-0 top-16 font-display font-bold text-[clamp(3rem,10vw,9rem)] leading-none text-white/[0.015] select-none pointer-events-none tracking-widest z-0"
          style={{ fontFamily: "var(--font-display)" }}
        >
          TIMELINE
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="chapter-num mb-20"
          >
            The story so far
          </motion.div>

          <div className="relative pl-2 md:pl-0">
            {/* Energy progress line */}
            <div className="absolute left-[5.5rem] md:left-[8rem] top-0 bottom-0 w-px bg-white/5 overflow-hidden">
              <div
                ref={lineRef}
                className="w-full h-full origin-top bg-gradient-to-b from-primary/80 via-primary to-primary/0"
                style={{ transform: "scaleY(0)" }}
              />
            </div>

            <div className="flex flex-col gap-0">
              {TIMELINE.map((item, i) => (
                <div
                  key={item.year}
                  ref={(el) => {
                    nodesRef.current[i] = el;
                  }}
                  className="group relative flex items-start gap-0 py-16 border-b border-white/5 last:border-0"
                >
                  {/* Year column */}
                  <div
                    className="timeline-year w-[5.5rem] md:w-[8rem] flex-shrink-0 font-mono text-[11px] uppercase tracking-[0.3em] text-primary/30 pt-1"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {item.year}
                  </div>

                  {/* Dot on the line */}
                  <div className="relative flex-shrink-0 -translate-x-[0.5px]">
                    {/* Ring for pulse animation */}
                    <div className="timeline-ring absolute inset-0 rounded-full border border-primary bg-primary/20 pointer-events-none" />
                    {/* Main dot */}
                    <div className="timeline-dot w-3 h-3 rounded-full border border-white/20 bg-background relative z-10" />
                  </div>

                  {/* Content (Fake 3D Depth) */}
                  <div className="timeline-content flex-1 pl-8 md:pl-16 origin-left">
                    <h3
                      className="font-display font-semibold text-2xl md:text-3xl text-foreground mb-3 tracking-tight"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {item.label}
                    </h3>
                    <p
                      className="text-base text-muted-foreground/80 leading-relaxed max-w-lg"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
