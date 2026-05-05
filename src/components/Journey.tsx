import { motion } from "framer-motion";
import { FadeUp } from "./SplitReveal";

const TIMELINE = [
  { year: "2020", title: "First lines of code", note: "Started with HTML/CSS, fell in love with the web." },
  { year: "2022", title: "Discovered React", note: "Began building real interfaces, shipped first side projects." },
  { year: "2023", title: "Diving into AI", note: "LLMs, embeddings, agents — explored what AI can do for product." },
  { year: "2024", title: "WebGL & motion", note: "Three.js, GLSL, Framer Motion. Interfaces became experiences." },
  { year: "2025", title: "Building in public", note: "Now shipping AI-powered tools and creative tech experiments." },
];

export function Journey() {
  return (
    <section id="journey" className="relative px-6 py-32 md:px-12 md:py-40">
      <div className="mx-auto max-w-5xl">
        <FadeUp className="mb-16 max-w-2xl">
          <div className="font-mono-tech text-[10px] uppercase tracking-[0.4em] text-accent">
            07 / Journey
          </div>
          <h2 className="font-display mt-4 text-4xl font-light md:text-6xl">
            How I got <span className="gradient-text">here.</span>
          </h2>
        </FadeUp>

        <div className="relative">
          {/* line */}
          <div className="absolute left-3 top-0 h-full w-px bg-gradient-to-b from-primary/60 via-accent/40 to-transparent md:left-1/2 md:-translate-x-1/2" />

          {TIMELINE.map((t, i) => (
            <motion.div
              key={t.year}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className={`relative mb-12 flex gap-6 md:mb-16 md:gap-0 ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* dot */}
              <div className="absolute left-3 -translate-x-1/2 md:left-1/2 z-10">
                <div className="h-3 w-3 rounded-full bg-primary shadow-neon" />
                <div className="absolute inset-0 h-3 w-3 animate-ping rounded-full bg-primary/40" />
              </div>

              <div className="ml-10 md:ml-0 md:w-1/2 md:px-12">
                <div className="font-mono-tech text-[10px] uppercase tracking-[0.3em] text-accent">
                  {t.year}
                </div>
                <h3 className="font-display mt-2 text-2xl font-light text-foreground">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/60">{t.note}</p>
              </div>
              <div className="hidden md:block md:w-1/2" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}