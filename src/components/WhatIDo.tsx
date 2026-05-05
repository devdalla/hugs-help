import { Code2, Sparkles, Layers } from "lucide-react";
import { FadeUp } from "./SplitReveal";
import { TiltCard } from "./TiltCard";

const ITEMS = [
  {
    icon: Code2,
    title: "Modern Web Apps",
    desc: "Fast, reactive interfaces in React, Next.js and TypeScript — built to feel weightless.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Tools",
    desc: "Agents, RAG systems and creative AI workflows that actually do useful things.",
  },
  {
    icon: Layers,
    title: "Interactive UI/UX",
    desc: "Shaders, motion, micro-interactions — the small details that make products memorable.",
  },
];

export function WhatIDo() {
  return (
    <section id="what" className="relative px-6 py-32 md:px-12 md:py-40">
      <div className="mx-auto max-w-6xl">
        <FadeUp className="mb-14 max-w-2xl">
          <div className="font-mono-tech text-[10px] uppercase tracking-[0.4em] text-accent">
            02 / What I Do
          </div>
          <h2 className="font-display mt-4 text-4xl font-light md:text-6xl">
            I build at the edge of <span className="gradient-text">code & creativity.</span>
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {ITEMS.map((it, i) => (
            <FadeUp key={it.title} delay={i * 0.1}>
              <TiltCard max={8} className="h-full">
                <div className="group relative h-full overflow-hidden rounded-2xl border border-foreground/10 bg-card/40 p-8 backdrop-blur-md transition-all duration-500 hover:border-primary/40">
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl transition-opacity duration-700 group-hover:opacity-100 opacity-0" />
                  <div className="relative">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                      <it.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display mt-6 text-2xl font-light text-foreground">{it.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-foreground/65">{it.desc}</p>
                  </div>
                </div>
              </TiltCard>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}