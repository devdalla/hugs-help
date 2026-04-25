import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  children: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  /** Reveal each word vs each character. */
  by?: "word" | "char";
}

/** Word/char-by-word reveal animation with cinematic ease. */
export function SplitReveal({ children, className, delay = 0, as = "h2", by = "word" }: Props) {
  const Tag: any = motion[as];
  const tokens = by === "word" ? children.split(/(\s+)/) : Array.from(children);

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-15%" }}
      transition={{ staggerChildren: by === "char" ? 0.018 : 0.05, delayChildren: delay }}
      aria-label={children}
    >
      {tokens.map((t, i) => {
        if (/^\s+$/.test(t)) return <span key={i}>{t}</span>;
        return (
          <span key={i} className="inline-block overflow-hidden align-bottom" style={{ lineHeight: 1.05 }}>
            <motion.span
              className="inline-block will-change-transform"
              variants={{
                hidden: { y: "110%", opacity: 0 },
                show: { y: "0%", opacity: 1 },
              }}
              transition={{ duration: 0.9, ease: [0.7, 0, 0.2, 1] }}
            >
              {t as ReactNode}
            </motion.span>
          </span>
        );
      })}
    </Tag>
  );
}
