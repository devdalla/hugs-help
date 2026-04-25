import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SplitReveal } from "./SplitReveal";

export interface WebsiteProject {
  n: string;
  title: string;
  category: string;
  year: string;
  desc: string;
  url: string;
  tech: string[];
  image: string;
  accentColor: string;
  features: string[];
}

interface WebsiteShowcaseProps {
  projects: WebsiteProject[];
}

export function WebsiteShowcase({ projects }: WebsiteShowcaseProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = projects[activeIdx];

  return (
    <section className="relative px-6 md:px-16 lg:px-24 py-32">
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="chapter-num mb-6"
        >
          <span className="text-primary mr-3">03</span> Web Projects
        </motion.div>

        <SplitReveal
          as="h2"
          by="word"
          className="font-display font-light tracking-[-0.03em] text-[clamp(2rem,5vw,4.5rem)] leading-[1.05] mb-16 max-w-3xl"
        >
          Websites built to convert.
        </SplitReveal>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 lg:gap-12 items-start">
          {/* Left — project list */}
          <div className="flex flex-col">
            {projects.map((p, i) => (
              <motion.button
                key={p.n}
                onClick={() => setActiveIdx(i)}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className={`group relative text-left flex items-start gap-5 py-6 border-b transition-all duration-500 ${
                  activeIdx === i
                    ? "border-primary/40"
                    : "border-white/8 hover:border-white/16"
                }`}
              >
                {/* Active indicator bar */}
                <motion.div
                  className="absolute left-0 top-0 w-0.5 rounded-full bg-primary"
                  animate={{ height: activeIdx === i ? "100%" : "0%" }}
                  transition={{ duration: 0.4, ease: [0.7, 0, 0.2, 1] }}
                />

                {/* Number */}
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.3em] pt-1 flex-shrink-0 transition-colors duration-400 ${
                    activeIdx === i ? "text-primary" : "text-muted-foreground/50 group-hover:text-muted-foreground"
                  }`}
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {p.n}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 mb-1.5">
                    <h3
                      className={`font-display text-lg md:text-xl font-light transition-colors duration-400 ${
                        activeIdx === i ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                      }`}
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {p.title}
                    </h3>
                    <span
                      className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50 flex-shrink-0"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {p.year}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground/60">{p.category}</p>

                  {/* Tech pills — only show on active */}
                  <AnimatePresence>
                    {activeIdx === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {p.tech.map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-[0.15em] border border-white/10 text-muted-foreground"
                              style={{ fontFamily: "var(--font-mono)" }}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Right — preview */}
          <div className="sticky top-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.97 }}
                transition={{ duration: 0.45, ease: [0.7, 0, 0.2, 1] }}
                className="relative rounded-2xl overflow-hidden border border-white/10"
                style={{
                  boxShadow: `0 40px 80px oklch(0 0 0 / 0.5), 0 0 0 1px oklch(1 0 0 / 0.05)`,
                }}
              >
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-4 py-3 bg-[oklch(0.12_0.015_250)] border-b border-white/8">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                    <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/8">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-muted-foreground/50 flex-shrink-0">
                        <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.2" />
                        <path d="M3 5h4M5 3v4" stroke="currentColor" strokeWidth="1.2" />
                      </svg>
                      <span className="font-mono text-[10px] text-muted-foreground/50 truncate" style={{ fontFamily: "var(--font-mono)" }}>
                        {active.url}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Screenshot */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={active.image}
                    alt={active.title}
                    className="w-full h-full object-cover object-top"
                  />
                  {/* Gradient overlay at bottom */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-32"
                    style={{
                      background: `linear-gradient(to top, oklch(0.08 0.012 250) 0%, transparent 100%)`,
                    }}
                  />
                </div>

                {/* Card footer */}
                <div className="p-6 bg-[oklch(0.10_0.015_250)]">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3
                        className="font-display text-xl font-light text-foreground mb-1"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {active.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{active.desc}</p>
                    </div>
                    <a
                      href={active.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-[0.15em] border border-white/15 hover:border-primary/40 hover:bg-primary/8 hover:text-foreground text-muted-foreground transition-all duration-400"
                      style={{ fontFamily: "var(--font-mono)" }}
                      data-cursor="view"
                    >
                      Visit ↗
                    </a>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-x-5 gap-y-1 mt-4 border-t border-white/6 pt-4">
                    {active.features.map((f) => (
                      <span key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
                        <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: active.accentColor }} />
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
