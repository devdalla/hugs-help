import { useEffect, useRef, useState } from "react";
import { MagneticButton } from "./MagneticButton";

/** Neon Chrome-Dino style runner. Space / Tap to jump. */
export function DinoGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const stateRef = useRef({
    y: 0,
    vy: 0,
    onGround: true,
    obstacles: [] as { x: number; w: number; h: number }[],
    speed: 6,
    spawn: 0,
    score: 0,
    running: false,
    gameOver: false,
    raf: 0,
  });

  const reset = () => {
    const s = stateRef.current;
    s.y = 0;
    s.vy = 0;
    s.onGround = true;
    s.obstacles = [];
    s.speed = 6;
    s.spawn = 0;
    s.score = 0;
    s.running = true;
    s.gameOver = false;
    setScore(0);
    setGameOver(false);
    setRunning(true);
  };

  const jump = () => {
    const s = stateRef.current;
    if (s.gameOver) {
      reset();
      return;
    }
    if (!s.running) {
      reset();
      return;
    }
    if (s.onGround) {
      s.vy = -13;
      s.onGround = false;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    const W = 800;
    const H = 220;
    const GROUND = H - 40;

    const resize = () => {
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = "100%";
      canvas.style.aspectRatio = `${W} / ${H}`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", onKey);

    let last = performance.now();
    let groundOffset = 0;

    const loop = (now: number) => {
      const s = stateRef.current;
      const dt = Math.min(32, now - last) / 16.6667;
      last = now;

      // Clear
      ctx.clearRect(0, 0, W, H);

      // BG grid
      ctx.strokeStyle = "rgba(255, 200, 240, 0.05)";
      ctx.lineWidth = 1;
      const cell = 30;
      const gridShift = (groundOffset % cell);
      for (let x = -gridShift; x < W; x += cell) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += cell) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Ground line — neon
      const grad = ctx.createLinearGradient(0, 0, W, 0);
      grad.addColorStop(0, "rgba(236, 72, 153, 0.9)");
      grad.addColorStop(0.5, "rgba(168, 85, 247, 0.9)");
      grad.addColorStop(1, "rgba(56, 189, 248, 0.9)");
      ctx.strokeStyle = grad;
      ctx.shadowColor = "rgba(236, 72, 153, 0.8)";
      ctx.shadowBlur = 12;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, GROUND + 24);
      ctx.lineTo(W, GROUND + 24);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // dashed ground markers
      ctx.strokeStyle = "rgba(236, 72, 153, 0.4)";
      ctx.setLineDash([18, 22]);
      ctx.lineDashOffset = -groundOffset;
      ctx.beginPath();
      ctx.moveTo(0, GROUND + 30);
      ctx.lineTo(W, GROUND + 30);
      ctx.stroke();
      ctx.setLineDash([]);

      if (s.running && !s.gameOver) {
        // Physics
        s.vy += 0.7 * dt;
        s.y += s.vy * dt;
        if (s.y >= 0) {
          s.y = 0;
          s.vy = 0;
          s.onGround = true;
        }

        // Spawn obstacles
        s.spawn -= dt;
        if (s.spawn <= 0) {
          const h = 24 + Math.random() * 28;
          const w = 14 + Math.random() * 18;
          s.obstacles.push({ x: W + 20, w, h });
          s.spawn = 60 + Math.random() * 70;
        }

        // Move obstacles
        for (const o of s.obstacles) o.x -= s.speed * dt;
        s.obstacles = s.obstacles.filter((o) => o.x + o.w > -10);

        // Speed up + score
        s.score += dt * 0.5;
        s.speed = 6 + s.score * 0.015;
        groundOffset += s.speed * dt;

        // Collisions
        const playerX = 80;
        const playerW = 38;
        const playerH = 42;
        const py = GROUND - playerH + s.y;
        for (const o of s.obstacles) {
          const ox = o.x;
          const oy = GROUND - o.h;
          if (
            playerX + playerW > ox &&
            playerX < ox + o.w &&
            py + playerH > oy &&
            py < oy + o.h
          ) {
            s.gameOver = true;
            s.running = false;
            setGameOver(true);
            setRunning(false);
            setScore(Math.floor(s.score));
            setBest((b) => {
              const n = Math.max(b, Math.floor(s.score));
              try { localStorage.setItem("dino_best", String(n)); } catch {}
              return n;
            });
          }
        }
        setScore(Math.floor(s.score));
      } else {
        groundOffset += 2 * dt;
      }

      // Draw obstacles (neon spikes)
      for (const o of s.obstacles) {
        const ox = o.x;
        const oy = GROUND - o.h;
        const og = ctx.createLinearGradient(ox, oy, ox, oy + o.h);
        og.addColorStop(0, "#a855f7");
        og.addColorStop(1, "#ec4899");
        ctx.fillStyle = og;
        ctx.shadowColor = "#ec4899";
        ctx.shadowBlur = 16;
        ctx.fillRect(ox, oy, o.w, o.h);
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.strokeRect(ox + 0.5, oy + 0.5, o.w - 1, o.h - 1);
      }

      // Draw player — Pookie the Unicorn 🦄
      const playerX = 80;
      const playerW = 44;
      const playerH = 46;
      const py = GROUND - playerH + s.y;
      const cx = playerX + playerW / 2;
      const cy = py + playerH / 2;
      const t = now * 0.005;
      const bob = s.onGround ? Math.sin(t * 2) * 1.2 : 0;

      // Sparkle trail
      for (let i = 0; i < 3; i++) {
        const sx = playerX - 6 - i * 10 + Math.sin(t + i) * 2;
        const sy = py + 18 + Math.cos(t * 2 + i) * 4;
        ctx.fillStyle = `hsla(${300 + i * 20}, 90%, 75%, ${0.8 - i * 0.25})`;
        ctx.shadowColor = "#f9a8d4";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(sx, sy, 2.5 - i * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // Body (rounded pastel)
      const bodyGrad = ctx.createLinearGradient(playerX, py, playerX, py + playerH);
      bodyGrad.addColorStop(0, "#fce7f3");
      bodyGrad.addColorStop(1, "#f9a8d4");
      ctx.fillStyle = bodyGrad;
      ctx.shadowColor = "#f9a8d4";
      ctx.shadowBlur = 16;
      // body ellipse
      ctx.beginPath();
      ctx.ellipse(cx - 2, cy + 6 + bob, 18, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      // head
      ctx.beginPath();
      ctx.ellipse(cx + 10, cy - 6 + bob, 12, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Legs
      ctx.fillStyle = "#f9a8d4";
      const legSwing = s.onGround ? Math.sin(t * 6) * 3 : 0;
      ctx.fillRect(cx - 10, cy + 14 + bob, 4, 8 - Math.abs(legSwing));
      ctx.fillRect(cx + 4, cy + 14 + bob, 4, 8 + Math.abs(legSwing));

      // Mane (rainbow)
      const maneColors = ["#a78bfa", "#7dd3fc", "#fcd34d", "#fb7185"];
      maneColors.forEach((col, i) => {
        ctx.fillStyle = col;
        ctx.shadowColor = col;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(cx + 2 + i * 2, cy - 8 + bob - i, 4, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      // Horn (golden)
      const hornGrad = ctx.createLinearGradient(cx + 12, cy - 18 + bob, cx + 12, cy - 8 + bob);
      hornGrad.addColorStop(0, "#fde68a");
      hornGrad.addColorStop(1, "#f59e0b");
      ctx.fillStyle = hornGrad;
      ctx.shadowColor = "#fde68a";
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.moveTo(cx + 10, cy - 8 + bob);
      ctx.lineTo(cx + 14, cy - 8 + bob);
      ctx.lineTo(cx + 12, cy - 19 + bob);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      // Eye
      ctx.fillStyle = "#0c0118";
      ctx.beginPath();
      ctx.arc(cx + 14, cy - 6 + bob, 1.6, 0, Math.PI * 2);
      ctx.fill();
      // Cheek blush
      ctx.fillStyle = "rgba(244, 114, 182, 0.6)";
      ctx.beginPath();
      ctx.arc(cx + 16, cy - 2 + bob, 2, 0, Math.PI * 2);
      ctx.fill();
      // Smile
      ctx.strokeStyle = "#831843";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx + 15, cy - 3 + bob, 1.5, 0, Math.PI);
      ctx.stroke();

      // Tail
      ctx.fillStyle = "#a78bfa";
      ctx.shadowColor = "#a78bfa";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.ellipse(cx - 18, cy + 4 + bob + Math.sin(t * 4) * 2, 5, 8, 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Game over overlay text
      if (s.gameOver) {
        ctx.fillStyle = "rgba(12, 1, 24, 0.55)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#f9a8d4";
        ctx.font = "600 28px 'Space Grotesk', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("SYSTEM CRASH", W / 2, H / 2 - 6);
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.font = "12px 'JetBrains Mono', monospace";
        ctx.fillText("PRESS SPACE OR TAP TO RESTART", W / 2, H / 2 + 18);
      } else if (!s.running) {
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.font = "12px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText("PRESS SPACE OR TAP TO START", W / 2, H / 2);
      }

      stateRef.current.raf = requestAnimationFrame(loop);
    };
    stateRef.current.raf = requestAnimationFrame(loop);

    try {
      const stored = localStorage.getItem("dino_best");
      if (stored) setBest(parseInt(stored, 10));
    } catch {}

    return () => {
      cancelAnimationFrame(stateRef.current.raf);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="game" className="relative px-6 py-32 md:px-12 md:py-40">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex flex-col items-start gap-3">
          <div className="font-mono-tech text-[10px] uppercase tracking-[0.4em] text-accent">
            06 / Coffee Break
          </div>
          <h2 className="font-display text-4xl font-light leading-[0.95] md:text-6xl">
            Take a break — <span className="gradient-text">play something.</span>
          </h2>
          <p className="max-w-md text-sm text-foreground/60">
            A tiny neon runner I built in an evening. Press space (or tap) to jump.
          </p>
        </div>

        <div className="glass relative overflow-hidden rounded-3xl border border-primary/30 p-2 shadow-neon">
          <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 py-3 text-[10px] uppercase tracking-[0.3em] font-mono-tech text-foreground/70">
            <span>SCORE · {String(score).padStart(4, "0")}</span>
            <span className="text-accent">BEST · {String(best).padStart(4, "0")}</span>
          </div>
          <canvas
            ref={canvasRef}
            onClick={jump}
            onTouchStart={(e) => { e.preventDefault(); jump(); }}
            className="block w-full rounded-2xl bg-[oklch(0.08_0.04_320)] cursor-pointer"
            data-hover
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="font-mono-tech text-[10px] uppercase tracking-[0.3em] text-foreground/50">
            {gameOver ? "Crashed. Try again ↻" : running ? "Running..." : "Idle"}
          </div>
          <MagneticButton
            onClick={reset}
            className="rounded-full border border-primary/50 bg-primary/10 px-6 py-3 font-mono-tech text-[10px] uppercase tracking-[0.3em] text-foreground hover:border-primary"
          >
            ↻ Restart
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}