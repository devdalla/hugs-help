import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ImmersiveScene } from "@/components/ImmersiveScene";
import { CustomCursor } from "@/components/CustomCursor";
import { SmoothScroll, ScrollProgress } from "@/components/SmoothScroll";
import { SelectedWork } from "@/components/SelectedWork";
import { WhatIDo } from "@/components/WhatIDo";
import { Lab } from "@/components/Lab";
import { Journey } from "@/components/Journey";
import { DinoGame } from "@/components/DinoGame";
import { ContactSection } from "@/components/ContactSection";
import { TiltCard } from "@/components/TiltCard";
import { ImmersiveAbout } from "@/components/ImmersiveAbout";
import { SplitReveal, FadeUp } from "@/components/SplitReveal";
import { TypingText } from "@/components/TypingText";
import { MagneticButton } from "@/components/MagneticButton";
import { Toaster } from "@/components/ui/sonner";

const SECTIONS = [
  { id: "hero", label: "Intro" },
  { id: "about", label: "About" },
  { id: "what", label: "What" },
  { id: "projects", label: "Work" },
  { id: "skills", label: "Stack" },
  { id: "lab", label: "Lab" },
  { id: "game", label: "Play" },
  { id: "journey", label: "Journey" },
  { id: "contact", label: "Contact" },
];

const SKILLS = [
  { group: "AI / ML", items: ["OpenAI", "LangGraph", "Pinecone", "RAG", "Agents", "Embeddings"] },
  { group: "Frontend", items: ["React", "Next.js", "TypeScript", "Three.js", "GLSL", "Tailwind"] },
  { group: "Backend", items: ["Node.js", "PostgreSQL", "Supabase", "Edge Fns", "REST", "tRPC"] },
  { group: "Tools", items: ["Framer Motion", "GSAP", "Lenis", "Vite", "Figma", "Git"] },
];

export function PortfolioPage() {
  const scrollRef = useRef(0);
  const [activeSection, setActiveSection] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      scrollRef.current = Math.min(Math.max(p, 0), 1);
      const idx = Math.min(SECTIONS.length - 1, Math.floor(p * SECTIONS.length + 0.15));
      setActiveSection(idx);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative bg-background text-foreground">
      <SmoothScroll />
      <ScrollProgress />
      <CustomCursor />
      <Toaster />

      {/* Loader */}
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-700 ${
          loaded ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <div className="text-center">
          <div className="font-mono-tech text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Initializing
          </div>
          <div className="mt-4 font-display text-3xl font-light gradient-text">ANUSHKA.SYS</div>
        </div>
      </div>

      {/* Persistent 3D Canvas — sits behind everything */}
      <ImmersiveScene scrollRef={scrollRef} />

      {/* Subtle radial darken to keep text readable */}
      <div
        className="pointer-events-none fixed inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, oklch(0.05 0.02 270 / 0.55) 100%)",
        }}
      />

      {/* Top nav */}
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 md:px-10 md:py-6">
        <a
          href="#hero"
          data-hover
          className="font-mono-tech text-[11px] uppercase tracking-[0.25em] text-foreground"
        >
          ANUSHKA<span className="text-primary">.</span>MISHRA
        </a>
        <nav className="hidden gap-6 lg:flex">
          {SECTIONS.map((s, i) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              data-hover
              className={`font-mono-tech text-[11px] uppercase tracking-[0.2em] transition-colors ${
                activeSection === i ? "text-accent" : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {s.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          data-hover
          className="hidden md:inline-flex items-center rounded-full border border-foreground/20 px-4 py-2 font-mono-tech text-[10px] uppercase tracking-[0.2em] text-foreground/80 transition-colors hover:border-accent hover:text-accent"
        >
          Available
          <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
        </a>
      </header>

      {/* Side progress indicator */}
      <div className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 md:flex">
        {SECTIONS.map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className={`h-px transition-all duration-500 ${
                activeSection === i ? "w-10 bg-accent" : "w-4 bg-foreground/30"
              }`}
            />
          </div>
        ))}
      </div>

      {/* Bottom HUD */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 hidden items-end justify-between px-10 pb-6 md:flex">
        <div className="font-mono-tech text-[10px] uppercase tracking-[0.25em] text-foreground/40">
          New Delhi · IST
        </div>
        <div className="font-mono-tech text-[10px] uppercase tracking-[0.25em] text-foreground/40">
          Scroll to traverse ↓
        </div>
      </div>

      {/* CONTENT */}
      <main className="relative z-20">
        {/* HERO */}
        <section
          id="hero"
          className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-mono-tech text-[10px] uppercase tracking-[0.4em] text-accent"
          >
            [ Web Developer · AI Builder · Creative Technologist ]
          </motion.div>

          <h1 className="font-display mt-8 text-[clamp(3rem,12vw,9rem)] font-light leading-[0.85] tracking-tight">
            <span className="block">
              <SplitReveal text="ANUSHKA" delay={0.5} />
            </span>
            <span className="block gradient-text">
              <SplitReveal text="MISHRA" delay={0.75} />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="mt-10 max-w-xl text-base leading-relaxed text-foreground/70 md:text-lg"
          >
            Crafting <span className="text-accent">intelligent</span>, interactive web experiences powered by code, creativity, and AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7, duration: 0.8 }}
            className="mt-6 font-mono-tech text-xs uppercase tracking-[0.3em] text-foreground/50"
          >
            <span className="text-foreground/40">{">"}</span>{" "}
            <TypingText
              phrases={[
                "building AI-powered tools",
                "shipping web experiences",
                "exploring creative tech",
                "designing the next interface",
              ]}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="mt-12 flex flex-col items-center gap-4 sm:flex-row"
          >
            <MagneticButton
              href="#projects"
              className="rounded-full border border-primary/60 bg-gradient-to-r from-primary/30 to-accent/30 px-8 py-3.5 font-mono-tech text-[11px] uppercase tracking-[0.3em] text-foreground hover:border-primary hover:shadow-neon"
            >
              See my work →
            </MagneticButton>
            <MagneticButton
              href="#contact"
              className="rounded-full border border-foreground/20 px-8 py-3.5 font-mono-tech text-[11px] uppercase tracking-[0.3em] text-foreground/80 hover:border-accent hover:text-accent"
            >
              Say hi
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.3, duration: 0.8 }}
            className="absolute bottom-10 font-mono-tech text-[10px] uppercase tracking-[0.3em] text-foreground/40"
          >
            ↓ Scroll to traverse
          </motion.div>
        </section>

        {/* ABOUT ME — immersive scroll-driven */}
        <ImmersiveAbout />

        {/* WHAT I DO */}
        <WhatIDo />

        {/* PROJECTS */}
        <SelectedWork />

        {/* SKILLS */}
        <section id="skills" className="px-6 py-32 md:px-12 md:py-40">
          <div className="mx-auto max-w-6xl">
            <FadeUp className="mb-16 max-w-2xl">
              <div className="font-mono-tech text-[10px] uppercase tracking-[0.4em] text-accent">
                04 / My Stack
              </div>
              <h2 className="font-display mt-4 text-4xl font-light leading-tight md:text-6xl">
                Tools I <span className="gradient-text">use.</span>
              </h2>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-foreground/60">
                A focused toolkit I keep sharpening — from AI pipelines to shader-heavy interfaces.
              </p>
            </FadeUp>

            <div className="grid gap-px overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/10 md:grid-cols-2 lg:grid-cols-4">
              {SKILLS.map((g, gi) => (
                <FadeUp key={g.group} delay={gi * 0.07}>
                  <div className="group relative h-full overflow-hidden bg-background/70 p-8 backdrop-blur-md transition-colors duration-500 hover:bg-background/40">
                    <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/10 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />
                    <div className="relative">
                      <div className="font-mono-tech text-[10px] uppercase tracking-[0.3em] text-accent">
                        {g.group}
                      </div>
                      <ul className="mt-6 space-y-2.5">
                        {g.items.map((item) => (
                          <li
                            key={item}
                            data-hover
                            className="group/item font-display text-base text-foreground/85 transition-all duration-300 hover:translate-x-1 hover:text-accent"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* LAB */}
        <Lab />

        {/* DINO GAME */}
        <DinoGame />

        {/* JOURNEY */}
        <Journey />

        {/* CONTACT */}
        <ContactSection />
      </main>
    </div>
  );
}
