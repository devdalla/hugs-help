import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";

interface Service {
  n: string;
  title: string;
  body: string;
  icon: string;
  details: string[];
}

interface ServiceHoverProps {
  services: Service[];
}

export function ServiceHover({ services }: ServiceHoverProps) {
  const [active, setActive] = useState<number | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseMove={handleMouseMove}
    >
      {/* Floating preview card that follows cursor */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.25, ease: [0.7, 0, 0.2, 1] }}
            className="absolute z-20 pointer-events-none hidden lg:flex flex-col gap-3 p-5 rounded-2xl border border-white/10 bg-card/80 backdrop-blur-xl w-56"
            style={{
              left: cursorPos.x + 28,
              top: cursorPos.y - 80,
              boxShadow: "0 20px 60px oklch(0 0 0 / 0.4)",
            }}
          >
            <span className="text-3xl">{services[active].icon}</span>
            <ul className="flex flex-col gap-1">
              {services[active].details.map((d, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Service rows */}
      {services.map((service, i) => (
        <motion.div
          key={service.n}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: i * 0.08, ease: [0.7, 0, 0.2, 1] }}
          onMouseEnter={() => setActive(i)}
          onMouseLeave={() => setActive(null)}
          className="group relative flex items-center gap-6 md:gap-10 border-b border-white/8 py-8 md:py-10 cursor-pointer"
        >
          {/* Number */}
          <div
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary/60 group-hover:text-primary transition-colors duration-500 flex-shrink-0 w-10"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {service.n}
          </div>

          {/* Title */}
          <h3
            className="font-display font-light text-[clamp(1.5rem,3.5vw,3rem)] tracking-tight leading-none flex-1 transition-colors duration-500 group-hover:text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {service.title}
          </h3>

          {/* Body — fades in on hover */}
          <motion.p
            animate={{ opacity: active === i ? 1 : 0, x: active === i ? 0 : 10 }}
            transition={{ duration: 0.4 }}
            className="hidden md:block text-sm text-muted-foreground max-w-xs leading-relaxed"
          >
            {service.body}
          </motion.p>

          {/* Arrow */}
          <motion.span
            animate={{ x: active === i ? 0 : -8, opacity: active === i ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-primary text-2xl flex-shrink-0"
          >
            ↗
          </motion.span>

          {/* Sweep highlight */}
          <motion.div
            aria-hidden
            animate={{ scaleX: active === i ? 1 : 0 }}
            transition={{ duration: 0.6, ease: [0.7, 0, 0.2, 1] }}
            className="absolute inset-0 origin-left pointer-events-none"
            style={{
              background: "linear-gradient(90deg, oklch(0.72 0.13 240 / 0.05) 0%, transparent 60%)",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
