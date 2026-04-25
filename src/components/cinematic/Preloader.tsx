import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const raf = useRef<number>(0);
  const start = useRef<number>(0);
  const DURATION = 2200;

  useEffect(() => {
    const tick = (now: number) => {
      if (!start.current) start.current = now;
      const elapsed = now - start.current;
      const pct = Math.min(Math.floor((elapsed / DURATION) * 100), 100);
      setCount(pct);
      if (pct < 100) {
        raf.current = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setDone(true), 400);
      }
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  useEffect(() => {
    if (done) {
      const t = setTimeout(onComplete, 900);
      return () => clearTimeout(t);
    }
  }, [done, onComplete]);

  return (
    <AnimatePresence>
      {!done ? (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.9, ease: [0.7, 0, 0.2, 1] }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[oklch(0.06_0.012_250)]"
        >
          {/* Grid lines */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(oklch(1 0 0 / 0.03) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.03) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />

          {/* Logo mark */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-16 flex items-center gap-3"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="13" stroke="oklch(0.72 0.13 240)" strokeWidth="1.5" />
              <circle cx="14" cy="14" r="6" fill="oklch(0.72 0.13 240)" opacity="0.9" />
            </svg>
            <span
              className="font-display text-lg font-light tracking-[0.15em] text-foreground uppercase"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Aryan Garg
            </span>
          </motion.div>

          {/* Counter */}
          <div className="relative flex items-end gap-1">
            <motion.span
              key={count}
              initial={{ y: 8, opacity: 0.4 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.08 }}
              style={{ fontFamily: "var(--font-mono)" }}
              className="font-mono text-[clamp(4rem,12vw,9rem)] font-extralight leading-none tabular-nums text-foreground"
            >
              {String(count).padStart(2, "0")}
            </motion.span>
            <span
              style={{ fontFamily: "var(--font-mono)" }}
              className="font-mono text-2xl text-muted-foreground pb-3"
            >
              %
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-10 w-48 h-px bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              style={{ width: `${count}%` }}
              transition={{ duration: 0.05 }}
            />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 0.5 }}
            style={{ fontFamily: "var(--font-mono)" }}
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-6"
          >
            Loading experience
          </motion.p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
