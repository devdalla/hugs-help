import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface Project {
  n: string;
  title: string;
  tag: string;
  client: string;
  desc: string;
  metrics: { k: string; v: string }[];
  image: string;
  color: string;
  url?: string;
}

interface HorizontalScrollProps {
  projects: Project[];
}

export function HorizontalScroll({ projects }: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;

    // Use a function so it recalculates on resize
    const getScrollAmount = () => track.scrollWidth - window.innerWidth;

    gsap.to(track, {
      x: () => -getScrollAmount(),
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: () => `+=${getScrollAmount()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      {/* Section header */}
      <div className="absolute top-10 left-6 md:left-16 lg:left-24 z-20">
        <div
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span className="text-primary mr-3">02</span> Selected Work
        </div>
        <p
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Drag to explore →
        </p>
      </div>

      {/* Scrollable track */}
      <div ref={trackRef} className="flex items-center gap-6 pl-6 md:pl-16 lg:pl-24 pr-24 h-screen">
        {projects.map((project, i) => (
          <HorizontalCard key={project.n} project={project} index={i} />
        ))}
      </div>
    </div>
  );
}

function HorizontalCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "100px" }}
      transition={{ duration: 0.8, ease: [0.7, 0, 0.2, 1] }}
      className="relative flex-shrink-0 w-[80vw] max-w-2xl h-[70vh] rounded-2xl overflow-hidden group cursor-pointer"
      style={{
        boxShadow: `0 40px 100px oklch(0 0 0 / 0.5), 0 0 0 1px oklch(1 0 0 / 0.06)`,
      }}
    >
      {/* Image without broken parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-[-8%] w-[116%]">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover object-top scale-105 group-hover:scale-110 transition-transform duration-1000 ease-out"
          />
        </div>

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(160deg, oklch(0 0 0 / 0.1) 0%, oklch(0.06 0.012 250 / 0.92) 70%)`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-10">
        {/* Number + tag */}
        <div className="flex items-center gap-4 mb-4">
          <span
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {project.n}
          </span>
          <span
            className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {project.tag}
          </span>
        </div>

        <h3
          className="font-display font-light text-[clamp(2rem,4vw,3.5rem)] tracking-tight leading-[0.95] mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {project.title}
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mb-8">
          {project.desc}
        </p>

        {/* Metrics */}
        <div className="flex gap-6 md:gap-8">
          {project.metrics.map((m) => (
            <div key={m.v}>
              <div
                className="font-display text-xl md:text-2xl font-light"
                style={{ color: project.color, fontFamily: "var(--font-display)" }}
              >
                {m.k}
              </div>
              <div
                className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground mt-1"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {m.v}
              </div>
            </div>
          ))}
        </div>

        {/* Hover CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-500"
        >
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-widest border border-white/20 bg-white/5 backdrop-blur-sm text-foreground"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            View case ↗
          </div>
        </motion.div>

        {/* Colored accent bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{ background: project.color }}
        />
      </div>
    </motion.div>
  );
}
