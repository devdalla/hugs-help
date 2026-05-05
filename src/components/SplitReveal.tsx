import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "span" | "div";
};

/** Splits text by word and reveals each with a stagger. Decorative — keep semantics in parent heading. */
export function SplitReveal({ text, className = "", delay = 0, stagger = 0.06 }: Props) {
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ delay: delay + i * stagger, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block"
          >
            {w}
            {i < words.length - 1 && "\u00A0"}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function FadeUp({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}