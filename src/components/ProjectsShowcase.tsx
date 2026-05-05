import { useEffect, useRef, useState } from "react";

export type Project = {
  n: string;
  title: string;
  client: string;
  year: string;
  tag: string;
  desc: string;
  stack: string[];
  metrics: { label: string; value: string }[];
  href?: string;
  accent: "purple" | "cyan" | "magenta" | "lime";
};

const ACCENT_MAP: Record<Project["accent"], { dot: string; text: string; glow: string; bar: string }> = {
  purple: {
    dot: "bg-[oklch(0.75_0.27_305)]",
    text: "text-[oklch(0.85_0.22_310)]",
    glow: "shadow-[0_0_60px_-10px_oklch(0.75_0.27_305_/_0.55)]",
    bar: "bg-gradient-to-r from-[oklch(0.75_0.27_305)] to-[oklch(0.85_0.22_310)]",
  },
  cyan: {
    dot: "bg-[oklch(0.85_0.18_215)]",
    text: "text-[oklch(0.85_0.18_215)]",
    glow: "shadow-[0_0_60px_-10px_oklch(0.75_0.2_220_/_0.55)]",
    bar: "bg-gradient-to-r from-[oklch(0.75_0.2_220)] to-[oklch(0.9_0.18_200)]",
  },
  magenta: {
    dot: "bg-[oklch(0.78_0.28_345)]",
    text: "text-[oklch(0.85_0.25_345)]",
    glow: "shadow-[0_0_60px_-10px_oklch(0.78_0.28_345_/_0.55)]",
    bar: "bg-gradient-to-r from-[oklch(0.78_0.28_345)] to-[oklch(0.85_0.22_310)]",
  },
  lime: {
    dot: "bg-[oklch(0.88_0.22_135)]",
    text: "text-[oklch(0.88_0.22_135)]",
    glow: "shadow-[0_0_60px_-10px_oklch(0.85_0.22_135_/_0.55)]",
    bar: "bg-gradient-to-r from-[oklch(0.88_0.22_135)] to-[oklch(0.85_0.18_180)]",
  },
};

export const PROJECTS: Project[] = [
  {
    n: "001",
    title: "SynthDesk",
    client: "Internal R&D",
    year: "2025",
    tag: "Autonomous Agent",
    desc: "A 24/7 multi-agent support desk that triages tickets, drafts replies in brand voice and escalates with full context. Cut median first-response time from 4h to under 90 seconds.",
    stack: ["GPT-4o", "LangGraph", "Postgres", "Redis", "Next.js"],
    metrics: [
      { label: "Tickets / month", value: "12.4k" },
      { label: "Auto-resolved", value: "78%" },
      { label: "CSAT", value: "4.8/5" },
    ],
    accent: "purple",
  },
  {
    n: "002",
    title: "Lumen RAG",
    client: "Fintech (NDA)",
    year: "2025",
    tag: "Knowledge Engine",
    desc: "Private retrieval-augmented platform indexing 40k+ regulatory documents. Hybrid BM25 + vector search with citation-grounded answers and per-tenant access control.",
    stack: ["Pinecone", "OpenAI", "tRPC", "Supabase", "Edge Fns"],
    metrics: [
      { label: "Docs indexed", value: "42,180" },
      { label: "Query p95", value: "640 ms" },
      { label: "Hallucination", value: "<1.2%" },
    ],
    accent: "cyan",
  },
  {
    n: "003",
    title: "Forge OS",
    client: "B2B SaaS",
    year: "2024",
    tag: "Workflow Builder",
    desc: "A natural-language interface that compiles prompts into production-grade automation pipelines. Non-technical ops teams now ship workflows that used to require an engineer.",
    stack: ["n8n", "Make", "Zod", "React Flow", "Node.js"],
    metrics: [
      { label: "Workflows live", value: "1,240" },
      { label: "Time saved / wk", value: "320h" },
      { label: "Adoption", value: "94%" },
    ],
    accent: "magenta",
  },
  {
    n: "004",
    title: "Helix Studio",
    client: "Creative Agency",
    year: "2024",
    tag: "Generative Tooling",
    desc: "End-to-end content factory: brief → moodboard → copy → layouts. Designers stay in control with editable layers and version branching, all backed by structured prompt graphs.",
    stack: ["Claude 3.5", "Replicate", "Bun", "Drizzle", "S3"],
    metrics: [
      { label: "Assets / day", value: "2,800" },
      { label: "Cost per asset", value: "−87%" },
      { label: "Brands onboarded", value: "26" },
    ],
    accent: "lime",
  },
  {
    n: "005",
    title: "Pulse Signals",
    client: "Sales Ops",
    year: "2025",
    tag: "Revenue Intelligence",
    desc: "Real-time signal engine that watches CRM, intent data and product telemetry to surface the next best account. Reps act on opportunities the day they form, not the week after.",
    stack: ["Kafka", "ClickHouse", "OpenAI", "Temporal", "React"],
    metrics: [
      { label: "Signals / day", value: "18.6k" },
      { label: "Pipeline lift", value: "+34%" },
      { label: "Win rate", value: "+11pts" },
    ],
    accent: "purple",
  },
  {
    n: "006",
    title: "Aether",
    client: "Open Source",
    year: "2025",
    tag: "Web Experience",
    desc: "The shader-driven 3D canvas you're inside right now. Custom GLSL noise, scroll-driven camera and a renderer tuned for 60fps even on mid-range mobile.",
    stack: ["R3F", "GLSL", "TypeScript", "Vite", "TanStack"],
    metrics: [
      { label: "Lighthouse perf", value: "94" },
      { label: "Bundle (gz)", value: "182 kB" },
      { label: "FPS (M2)", value: "60" },
    ],
    accent: "cyan",
  },
];

function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function ProjectRow({ project, index, onHover }: { project: Project; index: number; onHover: (i: number | null) => void }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.25);
  const accent = ACCENT_MAP[project.accent];

  return (
    <div
      ref={ref}
      data-hover
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      className={`group relative cursor-none border-t border-foreground/10 transition-all duration-700 ${
        inView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Animated accent bar that grows in on hover */}
      <span
        className={`pointer-events-none absolute left-0 top-0 h-px w-0 transition-all duration-700 ease-out group-hover:w-full ${accent.bar}`}
      />

      <div className="grid grid-cols-12 items-center gap-4 px-2 py-7 transition-all duration-500 group-hover:px-6 md:py-9">
        {/* Index + dot */}
        <div className="col-span-2 flex items-center gap-3 md:col-span-1">
          <span className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${accent.dot} group-hover:scale-150`} />
          <span className="font-mono-tech text-[10px] uppercase tracking-[0.25em] text-foreground/40">
            {project.n}
          </span>
        </div>

        {/* Title — slides right on hover */}
        <div className="col-span-10 md:col-span-5">
          <h3 className="font-display text-2xl font-light leading-tight transition-all duration-500 group-hover:translate-x-2 md:text-4xl">
            <span className="inline-block bg-gradient-to-r from-foreground to-foreground bg-[length:0%_1px] bg-bottom bg-no-repeat transition-[background-size] duration-700 group-hover:bg-[length:100%_1px]">
              {project.title}
            </span>
          </h3>
          <p className="mt-2 text-xs text-foreground/50 md:hidden">{project.desc}</p>
        </div>

        {/* Tag */}
        <div className="hidden md:col-span-3 md:block">
          <div className={`font-mono-tech text-[10px] uppercase tracking-[0.3em] ${accent.text}`}>
            {project.tag}
          </div>
          <div className="mt-1 font-mono-tech text-[10px] uppercase tracking-[0.2em] text-foreground/40">
            {project.client}
          </div>
        </div>

        {/* Year */}
        <div className="hidden md:col-span-2 md:block">
          <span className="font-mono-tech text-[11px] tracking-[0.2em] text-foreground/50 transition-colors group-hover:text-foreground">
            {project.year}
          </span>
        </div>

        {/* Arrow */}
        <div className="col-span-12 hidden justify-end md:col-span-1 md:flex">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-full border border-foreground/15 text-foreground/50 transition-all duration-500 group-hover:rotate-[-45deg] group-hover:border-foreground group-hover:bg-foreground group-hover:text-background ${accent.glow} group-hover:shadow-none`}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 11L11 3M11 3H4M11 3V10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Expanded panel that slides down on hover */}
      <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-700 ease-out group-hover:grid-rows-[1fr]">
        <div className="overflow-hidden">
          <div className="grid grid-cols-1 gap-8 px-2 pb-9 md:grid-cols-12 md:gap-10 md:px-6">
            {/* Description */}
            <p className="col-span-1 max-w-xl text-sm leading-relaxed text-foreground/70 md:col-span-6">
              {project.desc}
            </p>

            {/* Metrics */}
            <div className="col-span-1 grid grid-cols-3 gap-4 md:col-span-4">
              {project.metrics.map((m, i) => (
                <div
                  key={m.label}
                  className="border-l border-foreground/15 pl-3 opacity-0 transition-all duration-500 group-hover:opacity-100"
                  style={{ transitionDelay: `${200 + i * 100}ms` }}
                >
                  <div className={`font-display text-xl font-light ${accent.text}`}>{m.value}</div>
                  <div className="mt-1 font-mono-tech text-[9px] uppercase tracking-[0.25em] text-foreground/45">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Stack chips */}
            <div className="col-span-1 flex flex-wrap items-start gap-1.5 md:col-span-2 md:justify-end">
              {project.stack.map((s, i) => (
                <span
                  key={s}
                  className="rounded-full border border-foreground/15 bg-foreground/5 px-2.5 py-1 font-mono-tech text-[9px] uppercase tracking-[0.2em] text-foreground/65 opacity-0 transition-all duration-500"
                  style={{ transitionDelay: `${250 + i * 60}ms`, opacity: undefined }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProjectsShowcase() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const { ref: headerRef, inView: headerIn } = useInView<HTMLDivElement>(0.2);

  return (
    <section id="projects" className="relative px-6 py-32 md:px-12 md:py-44">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div
          ref={headerRef}
          className={`mb-20 grid grid-cols-1 items-end gap-10 transition-all duration-1000 md:grid-cols-12 ${
            headerIn ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="md:col-span-7">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-accent" />
              <div className="font-mono-tech text-[10px] uppercase tracking-[0.4em] text-accent">
                02 / Selected Work
              </div>
            </div>
            <h2 className="font-display mt-6 text-5xl font-light leading-[0.95] tracking-tight md:text-7xl">
              Systems shipped,
              <br />
              <span className="gradient-text">not slides shown.</span>
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="max-w-md text-base leading-relaxed text-foreground/65">
              Six recent builds across autonomous agents, retrieval engines and immersive interfaces — each one running in production for real teams.
            </p>
            <div className="mt-6 flex items-center gap-6">
              <div>
                <div className="font-display text-3xl font-light gradient-text">40+</div>
                <div className="mt-1 font-mono-tech text-[9px] uppercase tracking-[0.25em] text-foreground/45">
                  Systems shipped
                </div>
              </div>
              <div className="h-10 w-px bg-foreground/15" />
              <div>
                <div className="font-display text-3xl font-light gradient-text">12</div>
                <div className="mt-1 font-mono-tech text-[9px] uppercase tracking-[0.25em] text-foreground/45">
                  Active clients
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column legend */}
        <div className="hidden grid-cols-12 gap-4 border-b border-foreground/10 px-2 pb-3 md:grid">
          <div className="col-span-1 font-mono-tech text-[9px] uppercase tracking-[0.3em] text-foreground/35">N°</div>
          <div className="col-span-5 font-mono-tech text-[9px] uppercase tracking-[0.3em] text-foreground/35">Project</div>
          <div className="col-span-3 font-mono-tech text-[9px] uppercase tracking-[0.3em] text-foreground/35">Discipline</div>
          <div className="col-span-2 font-mono-tech text-[9px] uppercase tracking-[0.3em] text-foreground/35">Year</div>
          <div className="col-span-1 text-right font-mono-tech text-[9px] uppercase tracking-[0.3em] text-foreground/35">↗</div>
        </div>

        {/* Rows */}
        <div className="relative">
          {PROJECTS.map((p, i) => (
            <ProjectRow key={p.n} project={p} index={i} onHover={setHoveredIdx} />
          ))}
          <div className="border-t border-foreground/10" />
        </div>

        {/* Floating index counter that follows hover */}
        <div className="pointer-events-none mt-10 flex items-center justify-between font-mono-tech text-[10px] uppercase tracking-[0.3em] text-foreground/40">
          <span>
            {hoveredIdx !== null
              ? `[ Now viewing — ${PROJECTS[hoveredIdx].title} ]`
              : "[ Hover any row to expand ]"}
          </span>
          <span>
            {String((hoveredIdx ?? 0) + 1).padStart(2, "0")}
            <span className="mx-2 text-foreground/25">/</span>
            {String(PROJECTS.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}
