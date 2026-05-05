import { useEffect, useState } from "react";

export function TypingText({
  phrases,
  className = "",
  speed = 55,
  pause = 1600,
}: {
  phrases: string[];
  className?: string;
  speed?: number;
  pause?: number;
}) {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[i % phrases.length];
    if (!deleting && text === current) {
      const t = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(t);
    }
    if (deleting && text === "") {
      setDeleting(false);
      setI((v) => v + 1);
      return;
    }
    const t = setTimeout(() => {
      setText((prev) =>
        deleting ? current.substring(0, prev.length - 1) : current.substring(0, prev.length + 1),
      );
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(t);
  }, [text, deleting, i, phrases, speed, pause]);

  return (
    <span className={className}>
      {text}
      <span className="ml-1 inline-block h-[0.9em] w-[2px] -mb-[0.1em] bg-accent animate-pulse" />
    </span>
  );
}