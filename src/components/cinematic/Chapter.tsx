import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface ChapterProps {
  index: string;
  title?: string;
  children: ReactNode;
  align?: "left" | "right" | "center";
}

/** A full-viewport "chapter" that fades + slides as it enters/exits the viewport. */
export function Chapter({ index, title, children, align = "left" }: ChapterProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // ease via spring for cinematic feel
  const sp = useSpring(scrollYProgress, { stiffness: 80, damping: 20, mass: 0.4 });

  const opacity = useTransform(sp, [0, 0.25, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(sp, [0, 0.3, 0.7, 1], [60, 0, 0, -40]);
  const blur = useTransform(sp, [0, 0.25, 0.75, 1], [10, 0, 0, 8]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  const justify =
    align === "center" ? "items-center text-center" : align === "right" ? "items-end text-right" : "items-start text-left";

  return (
    <section
      ref={ref}
      className="relative min-h-screen w-full flex px-6 md:px-16 lg:px-24 py-32"
    >
      <motion.div
        style={{ opacity, y, filter }}
        className={`relative z-10 flex flex-col justify-center ${justify} w-full max-w-6xl mx-auto`}
      >
        <div className="chapter-num mb-6">
          <span className="text-primary mr-3">{index}</span>
          {title}
        </div>
        {children}
      </motion.div>
    </section>
  );
}

export function useChapterProgress(ref: React.RefObject<HTMLElement>): MotionValue<number> {
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  return useSpring(scrollYProgress, { stiffness: 80, damping: 20 });
}
