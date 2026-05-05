import { FadeUp } from "./SplitReveal";

const EXPERIMENTS = [
  { tag: "GLSL", title: "Liquid Type", note: "Text that bends like water on hover." },
  { tag: "AI", title: "Dream Prompts", note: "An agent that writes prompts for itself." },
  { tag: "Web Audio", title: "Synth Cells", note: "Living sound made of cellular automata." },
  { tag: "Three.js", title: "Soft Particles", note: "10k particles, 60fps, zero shaders." },
  { tag: "AI", title: "Tiny Models", note: "Running TinyLLMs on the edge for fun." },
  { tag: "Motion", title: "Cursor Memory", note: "Cursors that remember where you were." },
];

export function Lab() {
  return (
    <section id="lab" className="relative px-6 py-32 md:px-12 md:py-40">
      <div className="mx-auto max-w-6xl">
        <FadeUp className="mb-14 max-w-2xl">
          <div className="font-mono-tech text-[10px] uppercase tracking-[0.4em] text-accent">
            05 / Lab
          </div>
          <h2 className="font-display mt-4 text-4xl font-light md:text-6xl">
            Side <span className="gradient-text">experiments.</span>
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-foreground/60">
            Quick builds and curiosity projects — half-finished ideas I keep poking at.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/10 sm:grid-cols-2 lg:grid-cols-3">
          {EXPERIMENTS.map((e, i) => (
            <FadeUp key={e.title} delay={i * 0.05}>
              <div
                data-hover
                className="group relative h-full bg-background/70 p-7 backdrop-blur-md transition-colors duration-500 hover:bg-background/40"
              >
                <div className="font-mono-tech text-[9px] uppercase tracking-[0.3em] text-accent">
                  {e.tag}
                </div>
                <h3 className="font-display mt-4 text-xl font-light text-foreground transition-transform duration-500 group-hover:translate-x-1">
                  {e.title}
                </h3>
                <p className="mt-2 text-sm text-foreground/55">{e.note}</p>
                <div className="mt-6 flex items-center gap-2 font-mono-tech text-[10px] uppercase tracking-[0.25em] text-foreground/40">
                  <span className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                  WIP
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}