import { motion } from "framer-motion";
import { Magnetic } from "./Magnetic";
import { scrollToId } from "@/lib/scrollTo";

const LINKS = [
  { id: "about",    label: "About"    },
  { id: "work",     label: "Work"     },
  { id: "web",      label: "Web"      },
  { id: "services", label: "Services" },
  { id: "contact",  label: "Contact"  },
];

export function Nav({ active }: { active?: string }) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 0.4, ease: [0.7, 0, 0.2, 1] }}
      className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-12 py-5"
      style={{
        background: "linear-gradient(180deg, oklch(0.06 0.012 250 / 0.8) 0%, transparent 100%)",
        backdropFilter: "blur(0px)",
      }}
    >
      {/* Logo */}
      <Magnetic strength={0.3}>
        <button
          onClick={() => scrollToId("top")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          {/* Dot mark */}
          <div className="relative w-4 h-4">
            <div className="absolute inset-0 rounded-full bg-primary/30 group-hover:scale-150 transition-transform duration-500" />
            <div className="absolute inset-[3px] rounded-full bg-primary" />
          </div>
          <span
            className="font-display font-semibold tracking-tight text-sm text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Aryan Garg
          </span>
        </button>
      </Magnetic>

      {/* Center nav */}
      <nav
        className="hidden md:flex items-center gap-1 text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-mono"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {LINKS.map((l) => {
          const isActive = active === l.id;
          return (
            <Magnetic key={l.id} strength={0.25}>
              <button
                onClick={() => scrollToId(l.id)}
                className={`relative px-3 py-2 transition-colors duration-300 cursor-pointer rounded-full ${
                  isActive ? "text-foreground" : "hover:text-foreground"
                }`}
              >
                {l.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full border border-primary/30 bg-primary/8"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            </Magnetic>
          );
        })}
      </nav>

      {/* CTA */}
      <Magnetic strength={0.4}>
        <button
          onClick={() => scrollToId("contact")}
          className="relative text-[10px] uppercase tracking-[0.25em] font-mono px-5 py-2.5 rounded-full border border-white/15 hover:border-primary/50 hover:bg-primary/8 transition-all duration-500 cursor-pointer overflow-hidden group"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span
            aria-hidden
            className="absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-600"
            style={{ background: "linear-gradient(90deg,transparent,oklch(0.72 0.13 240/0.12),transparent)" }}
          />
          Let's talk
        </button>
      </Magnetic>
    </motion.header>
  );
}
