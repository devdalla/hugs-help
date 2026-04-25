import { motion, useScroll, useTransform } from "framer-motion";
import { scrollToId } from "@/lib/scrollTo";

export function ProgressRail({
  chapters,
  active,
}: {
  chapters: { id: string; label: string }[];
  active?: string;
}) {
  const { scrollYProgress } = useScroll();
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-end gap-6">
      <div className="relative h-48 w-px bg-white/10 overflow-hidden">
        <motion.div
          style={{ scaleY, transformOrigin: "top" }}
          className="absolute inset-0 bg-gradient-to-b from-primary to-transparent"
        />
      </div>
      <ul className="flex flex-col gap-2 text-[10px] tracking-[0.25em] uppercase font-mono">
        {chapters.map((c, i) => {
          const isActive = active === c.id;
          return (
            <li key={c.id}>
              <button
                onClick={() => scrollToId(c.id)}
                className={`group flex items-center gap-3 cursor-pointer transition-colors ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                data-cursor="hover"
              >
                <span className={`transition-colors ${isActive ? "text-primary" : "text-primary/40"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{c.label}</span>
                <span
                  className={`block h-px bg-primary transition-all ${isActive ? "w-6 opacity-100" : "w-2 opacity-30 group-hover:w-4 group-hover:opacity-70"}`}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
