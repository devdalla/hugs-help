import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface MarqueeRowProps {
  items: string[];
  speed?: number;
  direction?: "left" | "right";
  outline?: boolean;
}

function MarqueeRow({ items, direction = "left", outline = false }: MarqueeRowProps) {
  // Duplicate items enough times to fill
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex items-center gap-8 md:gap-12 whitespace-nowrap"
        animate={{ x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {repeated.map((item, i) => (
          <span
            key={i}
            className={`
              inline-block font-display font-light text-[clamp(2.5rem,6vw,5.5rem)] leading-none tracking-[-0.02em] select-none flex-shrink-0
              ${outline
                ? "text-transparent [-webkit-text-stroke:1px_oklch(1_0_0_/_0.18)] hover:[-webkit-text-stroke-color:oklch(0.72_0.13_240_/_0.7)]"
                : "text-foreground/10 hover:text-primary/50"
              } transition-colors duration-500 cursor-default
            `}
            style={{ fontFamily: "var(--font-display)" }}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

interface InfiniteMarqueeProps {
  stacks: string[];
}

export function InfiniteMarquee({ stacks }: InfiniteMarqueeProps) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  // Split into two rows
  const half = Math.ceil(stacks.length / 2);
  const row1 = stacks.slice(0, half);
  const row2 = stacks.slice(half);

  return (
    <motion.div
      ref={container}
      style={{ opacity }}
      className="relative py-12 md:py-20 overflow-hidden border-y border-white/5"
    >
      {/* Gradient fade edges */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-32 z-10 pointer-events-none"
        style={{ background: "linear-gradient(90deg, var(--background) 0%, transparent 100%)" }}
      />
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 w-32 z-10 pointer-events-none"
        style={{ background: "linear-gradient(270deg, var(--background) 0%, transparent 100%)" }}
      />

      <div className="flex flex-col gap-4">
        <MarqueeRow items={row1} direction="left" outline={false} />
        <MarqueeRow items={row2} direction="right" outline={true} />
      </div>
    </motion.div>
  );
}
