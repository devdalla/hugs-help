import { useEffect, useRef, useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

const ABOUT_HEIGHT = 320;

export function ImmersiveAbout() {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const [pinState, setPinState] = useState<"before" | "active" | "after">("before");

  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    progressRef.current = value;
  });

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), {
    stiffness: 150,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), {
    stiffness: 150,
    damping: 18,
  });

  const worldScale = useTransform(scrollYProgress, [0, 0.16, 0.76, 1], [0.96, 1, 1.04, 0.98]);
  const worldBlur = useTransform(scrollYProgress, [0, 0.08, 0.9, 1], [10, 0, 0, 8]);
  const worldOpacity = useTransform(scrollYProgress, [0, 0.08, 0.94, 1], [0.35, 1, 1, 0.55]);
  const worldFilter = useTransform(worldBlur, (value) => `blur(${value}px)`);

  const portraitX = useTransform(scrollYProgress, [0, 0.34, 0.62, 1], [0, -110, -70, 0]);
  const portraitY = useTransform(scrollYProgress, [0, 0.34, 0.74, 1], [24, -8, -34, 12]);
  const portraitScale = useTransform(scrollYProgress, [0, 0.32, 0.72, 1], [0.92, 1.04, 0.82, 0.72]);

  const haloScale = useTransform(scrollYProgress, [0, 0.42, 0.78, 1], [0.8, 1.45, 2.1, 3.2]);
  const haloOpacity = useTransform(scrollYProgress, [0, 0.2, 0.78, 1], [0.22, 0.52, 0.42, 0.08]);
  const tunnelRotate = useTransform(scrollYProgress, [0, 1], [0, 64]);
  const tunnelCounterRotate = useTransform(scrollYProgress, [0, 1], [0, -42]);
  const tunnelScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.72, 1.05, 1.24]);

  const sceneOne = useLeadingScene(scrollYProgress, [0, 0.22, 0.38]);
  const sceneTwo = useScene(scrollYProgress, [0.18, 0.3, 0.54, 0.7]);
  const sceneThree = useScene(scrollYProgress, [0.46, 0.58, 0.8, 0.92]);
  const sceneFour = useTrailingScene(scrollYProgress, [0.74, 0.86, 1]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    const pointer = { x: -9999, y: -9999 };

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      layer: number;
    };

    const particles: Particle[] = [];

    const seed = () => {
      particles.length = 0;
      const count = Math.min(130, Math.max(72, Math.floor((width * height) / 15000)));
      for (let i = 0; i < count; i += 1) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.34,
          vy: (Math.random() - 0.5) * 0.34,
          radius: Math.random() * 1.7 + 0.45,
          layer: Math.random(),
        });
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };

    const draw = () => {
      const p = progressRef.current;
      const intensity = 0.55 + Math.sin(p * Math.PI) * 1.5 + p * 0.35;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(width, height) * 0.72);
      gradient.addColorStop(0, `oklch(0.22 0.08 340 / ${0.34 + p * 0.18})`);
      gradient.addColorStop(0.55, `oklch(0.12 0.04 330 / ${0.34})`);
      gradient.addColorStop(1, "oklch(0.04 0.03 310 / 0.9)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      for (const particle of particles) {
        const speed = (0.55 + particle.layer * 1.8) * intensity;
        particle.x += particle.vx * speed;
        particle.y += particle.vy * speed;

        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distanceSq = dx * dx + dy * dy;
        if (distanceSq < 10000 && distanceSq > 1) {
          const force = ((10000 - distanceSq) / 10000) * 2.5;
          const distance = Math.sqrt(distanceSq);
          particle.x += (dx / distance) * force;
          particle.y += (dy / distance) * force;
        }

        if (particle.x < -12) particle.x = width + 12;
        if (particle.x > width + 12) particle.x = -12;
        if (particle.y < -12) particle.y = height + 12;
        if (particle.y > height + 12) particle.y = -12;

        ctx.beginPath();
        ctx.shadowColor = `oklch(0.78 0.16 ${330 + particle.layer * 35} / 0.72)`;
        ctx.shadowBlur = 8 + particle.layer * 16 * intensity;
        ctx.fillStyle = `oklch(0.86 0.1 ${330 + particle.layer * 45} / ${0.22 + particle.layer * 0.54})`;
        ctx.arc(
          particle.x,
          particle.y,
          particle.radius * (1 + particle.layer * intensity),
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  useEffect(() => {
    const updatePinState = () => {
      const section = rootRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      if (rect.top > 0) {
        setPinState("before");
        return;
      }

      if (rect.bottom <= window.innerHeight) {
        setPinState("after");
        return;
      }

      setPinState("active");
    };

    updatePinState();
    window.addEventListener("scroll", updatePinState, { passive: true });
    window.addEventListener("resize", updatePinState);

    return () => {
      window.removeEventListener("scroll", updatePinState);
      window.removeEventListener("resize", updatePinState);
    };
  }, []);

  const handleCardMove = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mx.set((event.clientX - rect.left) / rect.width - 0.5);
    my.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const resetCard = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section
      id="about"
      ref={rootRef}
      className="relative isolate bg-background"
      style={{ height: `${ABOUT_HEIGHT}vh` }}
    >
      <div
        className={`h-screen w-full overflow-hidden bg-background ${
          pinState === "active"
            ? "fixed inset-x-0 top-0 z-30"
            : pinState === "after"
              ? "absolute inset-x-0 bottom-0"
              : "absolute inset-x-0 top-0"
        }`}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: worldOpacity,
            scale: worldScale,
            filter: worldFilter,
            willChange: "transform, opacity, filter",
          }}
        >
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

          <motion.div
            className="absolute left-1/2 top-1/2 h-[58vmin] w-[58vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20"
            style={{ scale: haloScale, opacity: haloOpacity }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 h-[72vmin] w-[72vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/15"
            style={{ rotate: tunnelRotate, scale: tunnelScale }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 h-[86vmin] w-[86vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/10"
            style={{ rotate: tunnelCounterRotate, scale: tunnelScale }}
          />
        </motion.div>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,oklch(0.06_0.03_330_/_0.35)_58%,oklch(0.03_0.03_320_/_0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,oklch(0.04_0.03_330_/_0.72),transparent_28%,transparent_72%,oklch(0.04_0.03_330_/_0.72))]" />

        <div className="relative z-10 mx-auto grid h-full max-w-7xl grid-cols-1 items-center gap-8 px-6 py-20 md:grid-cols-[0.92fr_1.08fr] md:px-12 md:py-16">
          <motion.div
            onMouseMove={handleCardMove}
            onMouseLeave={resetCard}
            data-hover
            data-cursor="feel"
            className="relative mx-auto hidden w-[min(340px,72vw)] md:block"
            style={{
              x: portraitX,
              y: portraitY,
              scale: portraitScale,
              rotateX,
              rotateY,
              transformPerspective: 1200,
            }}
          >
            <div className="absolute -inset-5 rounded-[2rem] bg-primary/20 blur-3xl" />
            <div className="relative aspect-[0.72] overflow-hidden rounded-[2rem] border border-primary/35 bg-card/60 shadow-2xl backdrop-blur-xl">
              <img
                src="/photo.jpeg"
                alt="Aryan Garg portrait"
                className="h-full w-full object-cover opacity-90 saturate-[0.9]"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-primary/10" />
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between font-mono-tech text-[10px] uppercase tracking-[0.28em] text-foreground/75">
                <span>Aryan Garg</span>
                <span className="text-accent">depth mode</span>
              </div>
            </div>
          </motion.div>

          <div className="relative min-h-[520px] md:min-h-[560px]">
            <AboutScene progress={sceneOne} index="01" label="Entering orbit">
              <h2 className="font-display text-5xl font-light leading-[0.96] md:text-7xl">
                About, but built like a <span className="gradient-text">scene.</span>
              </h2>
              <p className="mt-7 max-w-xl text-base leading-relaxed text-foreground/76 md:text-lg">
                I design and build premium web experiences where motion, systems, and clarity work
                together instead of fighting for attention.
              </p>
            </AboutScene>

            <AboutScene progress={sceneTwo} index="02" label="Signal lock">
              <h2 className="font-display text-5xl font-light leading-[0.98] md:text-7xl">
                Clean interfaces. <span className="text-accent text-glow">Sharp</span> engineering.
                Controlled cinematic detail.
              </h2>
              <p className="mt-7 max-w-xl text-base leading-relaxed text-foreground/70 md:text-lg">
                Every interaction has a reason: hover states, transitions, depth, performance, and a
                product-like story from first scroll to final contact.
              </p>
            </AboutScene>

            <AboutScene progress={sceneThree} index="03" label="Core system">
              <div className="grid max-w-2xl gap-3 sm:grid-cols-3">
                {[
                  ["01", "Interactive frontends"],
                  ["02", "AI product flows"],
                  ["03", "3D / motion systems"],
                ].map(([number, title]) => (
                  <div
                    key={title}
                    className="border border-foreground/12 bg-card/35 p-5 backdrop-blur-md"
                  >
                    <div className="font-mono-tech text-[10px] uppercase tracking-[0.32em] text-accent">
                      {number}
                    </div>
                    <div className="mt-6 font-display text-2xl leading-tight text-foreground">
                      {title}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-8 max-w-xl text-base leading-relaxed text-foreground/72 md:text-lg">
                This is the zone where the background accelerates, the interface locks in, and the
                page stops feeling like a flat document.
              </p>
            </AboutScene>

            <AboutScene progress={sceneFour} index="04" label="Exit vector">
              <h2 className="font-display text-5xl font-light leading-[0.96] md:text-7xl">
                The next section arrives without the{" "}
                <span className="gradient-text">blank gap.</span>
              </h2>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#projects"
                  data-hover
                  className="rounded-full border border-primary/60 bg-primary/15 px-6 py-3 font-mono-tech text-[10px] uppercase tracking-[0.28em] text-foreground transition-colors hover:border-primary hover:text-accent hover:shadow-neon"
                >
                  View work →
                </a>
                <a
                  href="#contact"
                  data-hover
                  className="rounded-full border border-foreground/20 px-6 py-3 font-mono-tech text-[10px] uppercase tracking-[0.28em] text-foreground/80 transition-colors hover:border-accent hover:text-accent"
                >
                  Start project
                </a>
              </div>
            </AboutScene>
          </div>
        </div>

        <ProgressHUD progress={scrollYProgress} />
      </div>
    </section>
  );
}

function useScene(progress: MotionValue<number>, range: [number, number, number, number]) {
  const opacity = useTransform(progress, range, [0, 1, 1, 0]);
  const y = useTransform(progress, range, [44, 0, 0, -44]);
  const scale = useTransform(progress, range, [0.98, 1, 1, 0.98]);
  return { opacity, y, scale };
}

function useLeadingScene(progress: MotionValue<number>, range: [number, number, number]) {
  const opacity = useTransform(progress, range, [1, 1, 0]);
  const y = useTransform(progress, range, [0, 0, -44]);
  const scale = useTransform(progress, range, [1, 1, 0.98]);
  return { opacity, y, scale };
}

function useTrailingScene(progress: MotionValue<number>, range: [number, number, number]) {
  const opacity = useTransform(progress, range, [0, 1, 1]);
  const y = useTransform(progress, range, [44, 0, 0]);
  const scale = useTransform(progress, range, [0.98, 1, 1]);
  return { opacity, y, scale };
}

function AboutScene({
  progress,
  index,
  label,
  children,
}: {
  progress: { opacity: MotionValue<number>; y: MotionValue<number>; scale: MotionValue<number> };
  index: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-center"
      style={{
        opacity: progress.opacity,
        y: progress.y,
        scale: progress.scale,
        willChange: "transform, opacity",
      }}
    >
      <div className="mb-6 flex items-center gap-3 font-mono-tech text-[10px] uppercase tracking-[0.38em] text-accent">
        <span>{index}</span>
        <span className="h-px w-10 bg-accent/60" />
        <span>{label}</span>
      </div>
      {children}
    </motion.div>
  );
}

function ProgressHUD({ progress }: { progress: MotionValue<number> }) {
  const width = useTransform(progress, [0, 1], ["0%", "100%"]);
  const scene = useTransform(
    progress,
    (value) =>
      `${Math.min(4, Math.floor(value * 4) + 1)
        .toString()
        .padStart(2, "0")} / 04`,
  );

  return (
    <div className="pointer-events-none absolute inset-x-6 bottom-6 z-20 flex items-end justify-between font-mono-tech text-[10px] uppercase tracking-[0.34em] text-foreground/55 md:inset-x-10">
      <div>
        <motion.div>{scene}</motion.div>
        <div className="mt-3 h-px w-44 bg-foreground/15 md:w-64">
          <motion.div
            className="h-full bg-accent shadow-[0_0_16px_var(--accent)]"
            style={{ width }}
          />
        </div>
      </div>
      <div className="hidden md:block">Sticky scene active</div>
    </div>
  );
}
