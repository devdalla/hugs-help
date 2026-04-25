import { useRef, type ReactNode, type CSSProperties } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticProps {
  children: ReactNode;
  strength?: number;
  className?: string;
  style?: CSSProperties;
  as?: "div" | "a" | "button";
  href?: string;
  onClick?: () => void;
}

/** Cursor-following magnetic wrapper. Wrap buttons / links for premium feel. */
export function Magnetic({
  children,
  strength = 0.35,
  className,
  style,
  as = "div",
  href,
  onClick,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) * strength;
    const dy = (e.clientY - (r.top + r.height / 2)) * strength;
    x.set(dx);
    y.set(dy);
  };
  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Comp: any = as === "a" ? motion.a : as === "button" ? motion.button : motion.div;

  return (
    <Comp
      ref={ref as any}
      href={href}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: sx, y: sy, ...style }}
      className={className}
      data-cursor="hover"
    >
      {children}
    </Comp>
  );
}
