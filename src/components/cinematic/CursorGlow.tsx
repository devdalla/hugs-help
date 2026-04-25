import { useEffect, useRef, useState } from "react";

const CURSOR_LABELS: Record<string, string> = {
  view: "View",
  drag: "Drag",
  email: "Email",
  book: "Book",
  scroll: "Scroll",
};

/**
 * Advanced reactive cursor:
 * - small precise dot that snaps quickly
 * - large trailing ring that scales/labels on data-cursor elements
 * - ambient glow that lazily follows
 * - color shifts per context
 */
export function CursorGlow() {
  const dotRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const [cursorType, setCursorType] = useState<string>("default");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setEnabled(true);

    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let dx = tx, dy = ty;
    let gx = tx, gy = ty;
    let rx = tx, ry = ty;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const target = e.target as HTMLElement | null;
      const cursorEl = target?.closest?.("[data-cursor]") as HTMLElement | null;
      const v = cursorEl?.dataset.cursor ?? "default";
      setActive(!!cursorEl);
      setCursorType(v);
      setLabel(CURSOR_LABELS[v] ?? null);
    };

    const loop = () => {
      dx += (tx - dx) * 0.38;
      dy += (ty - dy) * 0.38;
      rx += (tx - rx) * 0.14;
      ry += (ty - ry) * 0.14;
      gx += (tx - gx) * 0.07;
      gy += (ty - gy) * 0.07;

      const dotSize = 6;
      const ringSize = active ? 80 : 36;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dx - dotSize / 2}px, ${dy - dotSize / 2}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx - ringSize / 2}px, ${ry - ringSize / 2}px, 0)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${gx - 240}px, ${gy - 240}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [active]);

  if (!enabled) return null;

  const ringColor = active
    ? cursorType === "email" || cursorType === "book"
      ? "oklch(0.78 0.18 160 / 0.8)"
      : cursorType === "drag"
        ? "oklch(0.72 0.18 60 / 0.8)"
        : "oklch(0.72 0.13 240 / 0.8)"
    : "oklch(1 0 0 / 0.3)";

  const ringBg = active
    ? "oklch(0.72 0.13 240 / 0.12)"
    : "transparent";

  return (
    <>
      {/* Ambient glow */}
      <div
        ref={glowRef}
        className="pointer-events-none fixed top-0 left-0 z-30 w-[480px] h-[480px] rounded-full"
        style={{
          background: "radial-gradient(circle, oklch(0.72 0.13 240 / 0.14), transparent 65%)",
          filter: "blur(32px)",
          mixBlendMode: "screen",
        }}
      />

      {/* Outer ring */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[60] flex items-center justify-center rounded-full border backdrop-blur-[1px]"
        style={{
          width: active ? 80 : 36,
          height: active ? 80 : 36,
          backgroundColor: ringBg,
          borderColor: ringColor,
          borderWidth: active ? "1.5px" : "1px",
          transition: "width 0.35s cubic-bezier(0.7,0,0.2,1), height 0.35s cubic-bezier(0.7,0,0.2,1), background-color 0.3s, border-color 0.3s",
          mixBlendMode: active ? "normal" : "difference",
        }}
      >
        {label && (
          <span
            className="font-mono text-[8px] uppercase tracking-[0.2em] text-foreground select-none"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {label}
          </span>
        )}
      </div>

      {/* Center dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[61] w-1.5 h-1.5 rounded-full bg-primary"
        style={{
          mixBlendMode: "difference",
          transition: "transform 0.05s",
        }}
      />
    </>
  );
}
