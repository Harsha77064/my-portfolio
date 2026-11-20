import { useEffect, useRef } from "react";

/**
 * An HTML5 canvas of twinkling dots that spreads out from the centre while
 * `active` is true and fades back out when it turns false. It only animates
 * while it's showing, so idle cards cost nothing.
 */
export default function DotMatrix({ active, colors = ["#22d3ee"], gap = 14, size = 2.5, className = "" }) {
  const canvas = useRef(null);
  const state = useRef({ reveal: 0, raf: 0, dots: null, w: 0, h: 0 });

  useEffect(() => {
    const c = canvas.current;
    const s = state.current;
    const ctx = c.getContext("2d");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const setup = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      s.w = c.clientWidth;
      s.h = c.clientHeight;
      c.width = s.w * dpr;
      c.height = s.h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      s.dots = [];
      const cx = s.w / 2;
      const cy = s.h / 2;
      const maxD = Math.hypot(cx, cy);
      for (let x = gap / 2; x < s.w; x += gap) {
        for (let y = gap / 2; y < s.h; y += gap) {
          s.dots.push({
            x,
            y,
            dist: Math.hypot(x - cx, y - cy) / maxD, // 0 at centre, 1 at the corners
            phase: Math.random() * Math.PI * 2,
            speed: 1 + Math.random() * 3,
            color: colors[Math.floor(Math.random() * colors.length)],
          });
        }
      }
    };

    const draw = (time) => {
      const t = time / 1000;
      const target = active ? 1 : 0;
      s.reveal += (target - s.reveal) * (still ? 1 : 0.06);
      ctx.clearRect(0, 0, s.w, s.h);
      for (const d of s.dots) {
        // dots switch on in a ring that grows outward from the middle
        const on = Math.min(1, Math.max(0, (s.reveal * 1.4 - d.dist) * 4));
        if (on <= 0) continue;
        const twinkle = still ? 0.6 : 0.25 + 0.75 * Math.abs(Math.sin(t * d.speed + d.phase));
        ctx.globalAlpha = on * twinkle;
        ctx.fillStyle = d.color;
        ctx.fillRect(d.x - size / 2, d.y - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
      const settled = !active && s.reveal < 0.01;
      if (!settled) s.raf = requestAnimationFrame(draw);
    };

    if (!s.dots) setup();
    cancelAnimationFrame(s.raf);
    s.raf = requestAnimationFrame(draw);

    const ro = new ResizeObserver(setup);
    ro.observe(c);
    return () => {
      cancelAnimationFrame(s.raf);
      ro.disconnect();
    };
  }, [active, colors, gap, size]);

  return <canvas ref={canvas} aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
