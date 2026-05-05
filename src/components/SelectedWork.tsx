import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TiltCard } from "./TiltCard";
import { FadeUp } from "./SplitReveal";

export type Build = {
  n: string;
  title: string;
  tag: string;
  year: string;
  desc: string;
  why: string;
  stack: string[];
  accent: string; // tailwind gradient classes
};

export const BUILDS: Build[] = [
  {
    n: "001",
    title: "Neural Canvas",
    tag: "AI Experiment",
    year: "2025",
    desc: "A generative shader playground that turns natural-language prompts into live GLSL animations.",
    why: "I wanted to feel what it's like to talk to a renderer. Built in a weekend, kept growing.",
    stack: ["GLSL", "React Three Fiber", "OpenAI", "TypeScript"],
    accent: "from-fuchsia-500 to-purple-500",
  },
  {
    n: "002",
    title: "Inkling",
    tag: "Personal Tool",
    year: "2025",
    desc: "A minimal writing app with an AI ghostwriter that mimics your own past entries — not a chatbot.",
    why: "I journal a lot. Wanted suggestions that sound like me, not like ChatGPT.",
    stack: ["Next.js", "Embeddings", "Postgres", "Tailwind"],
    accent: "from-pink-400 to-rose-500",
  },
  {
    n: "003",
    title: "Loop Studio",
    tag: "Creative Build",
    year: "2024",
    desc: "A browser-based loop sequencer with 3D visualisation that reacts to the audio in real time.",
    why: "Music + code is the most fun I have. This is my favourite playground.",
    stack: ["Web Audio", "Three.js", "Zustand", "Vite"],
    accent: "from-cyan-400 to-sky-500",
  },
  {
    n: "004",
    title: "Glasshouse",
    tag: "Web Experience",
    year: "2024",
    desc: "An immersive scrollytelling site for a friend's design studio — glass, fluids, and physics-based parallax.",
    why: "An excuse to push WebGL composition further than I had before.",
    stack: ["R3F", "GSAP", "Lenis", "TypeScript"],
    accent: "from-violet-500 to-indigo-500",
  },
  {
    n: "005",
    title: "Atlas",
    tag: "AI Agent",
    year: "2025",
    desc: "A research agent that plans, browses, and writes structured reports with citations I can actually trust.",
    why: "Tired of hallucinated answers — built one that shows its work.",
    stack: ["LangGraph", "GPT-4o", "Pinecone", "Edge Fns"],
    accent: "from-emerald-400 to-teal-500",
  },
  {
    n: "006",
    title: "Pulse",
    tag: "Open Source",
    year: "2025",
    desc: "A tiny, dependency-free hook library for building reactive cursor and scroll experiences.",
    why: "Reused the same hooks across five projects, finally extracted them.",
    stack: ["TypeScript", "React", "Zero deps"],
    accent: "from-amber-400 to-orange-500",
  },
];

export function SelectedWork() {
  const [active, setActive] = useState<Build | null>(null);

  return (
    <section id="projects" className="relative px-6 py-32 md:px-12 md:py-40">
      <div className="mx-auto max-w-7xl">
        <FadeUp className="mb-16 max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-accent" />
            <div className="font-mono-tech text-[10px] uppercase tracking-[0.4em] text-accent">
              03 / Selected Work
            </div>
          </div>
          <h2 className="font-display mt-6 text-5xl font-light leading-[0.95] tracking-tight md:text-7xl">
            Things I&apos;ve <span className="gradient-text">built.</span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-foreground/65">
            A handful of recent experiments and personal builds — each one started as a question I wanted to answer for myself.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {BUILDS.map((b, i) => (
            <FadeUp key={b.n} delay={i * 0.06}>
              <TiltCard className="h-full">
                <button
                  type="button"
                  data-hover
                  onClick={() => setActive(b)}
                  className="group relative h-full w-full cursor-pointer overflow-hidden rounded-2xl border border-foreground/10 bg-card/40 p-6 text-left backdrop-blur-md transition-all duration-500 hover:border-primary/40 hover:shadow-neon"
                  style={{ transform: "translateZ(0)" }}
                >
                  {/* preview gradient */}
                  <div
                    className={`relative mb-6 h-44 w-full overflow-hidden rounded-xl bg-gradient-to-br ${b.accent}`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.35),transparent_60%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(0,0,0,0.4)_100%)]" />
                    <div className="absolute bottom-3 left-3 font-mono-tech text-[9px] uppercase tracking-[0.3em] text-white/90">
                      {b.tag}
                    </div>
                    <div className="absolute right-3 top-3 font-mono-tech text-[9px] uppercase tracking-[0.3em] text-white/90">
                      {b.n}
                    </div>
                    <div className="absolute inset-x-0 bottom-0 translate-y-full bg-background/70 px-4 py-2 font-mono-tech text-[10px] uppercase tracking-[0.25em] text-foreground transition-transform duration-500 group-hover:translate-y-0">
                      View Build →
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-display text-2xl font-light text-foreground">{b.title}</h3>
                    <span className="font-mono-tech text-[10px] tracking-[0.2em] text-foreground/40">
                      {b.year}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/60 line-clamp-2">
                    {b.desc}
                  </p>
                </button>
              </TiltCard>
            </FadeUp>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-xl"
              onClick={() => setActive(null)}
            />
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-primary/30 bg-card/95 shadow-neon"
            >
              <button
                onClick={() => setActive(null)}
                data-hover
                className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-foreground/20 bg-background/60 text-foreground/70 transition-colors hover:border-primary hover:text-primary"
                aria-label="Close"
              >
                ×
              </button>
              <div className={`h-56 w-full bg-gradient-to-br ${active.accent} md:h-72`}>
                <div className="h-full w-full bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.35),transparent_60%)]" />
              </div>
              <div className="p-8 md:p-12">
                <div className="font-mono-tech text-[10px] uppercase tracking-[0.3em] text-accent">
                  {active.tag} · {active.year}
                </div>
                <h3 className="font-display mt-3 text-4xl font-light md:text-5xl">{active.title}</h3>
                <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-3">
                  <div className="md:col-span-2 space-y-6">
                    <div>
                      <div className="font-mono-tech text-[10px] uppercase tracking-[0.3em] text-foreground/45">
                        What it is
                      </div>
                      <p className="mt-2 text-base leading-relaxed text-foreground/80">{active.desc}</p>
                    </div>
                    <div>
                      <div className="font-mono-tech text-[10px] uppercase tracking-[0.3em] text-foreground/45">
                        Why I built it
                      </div>
                      <p className="mt-2 text-base leading-relaxed text-foreground/80">{active.why}</p>
                    </div>
                  </div>
                  <div>
                    <div className="font-mono-tech text-[10px] uppercase tracking-[0.3em] text-foreground/45">
                      Tech
                    </div>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {active.stack.map((s) => (
                        <li
                          key={s}
                          className="rounded-full border border-foreground/15 bg-foreground/5 px-3 py-1.5 font-mono-tech text-[10px] uppercase tracking-[0.2em] text-foreground/80"
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}