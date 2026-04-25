import { useRef, useEffect } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

interface TextScrubProps {
  children: string;
  className?: string;
}

/**
 * Splits text into words. As the user scrolls through the section,
 * each word goes from dim → bright sequentially.
 */
export function TextScrub({ children, className = "" }: TextScrubProps) {
  const container = useRef<HTMLDivElement>(null);
  const words = children.split(" ");

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.9", "end 0.3"],
  });

  return (
    <div ref={container} className={`relative ${className}`}>
      <p className="flex flex-wrap gap-x-[0.35em] gap-y-1">
        {words.map((word, i) => {
          const start = i / words.length;
          const end = (i + 1) / words.length;
          return (
            <Word
              key={i}
              word={word}
              progress={scrollYProgress}
              range={[start, end]}
            />
          );
        })}
      </p>
    </div>
  );
}

function Word({
  word,
  progress,
  range,
}: {
  word: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const y = useTransform(progress, range, [8, 0]);
  return (
    <motion.span style={{ opacity, y }} className="inline-block">
      {word}
    </motion.span>
  );
}
