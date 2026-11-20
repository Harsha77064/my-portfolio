import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

const spring = { stiffness: 220, damping: 20, mass: 0.6 };

/**
 * A card that tilts toward the mouse in 3D, lifts on hover and shows a soft
 * violet glow under the cursor.
 *
 * `className` goes on the outer wrapper (GSAP scroll reveals target it), and
 * `innerClassName` on the tilting card itself. Keeping them on separate
 * elements stops GSAP and Motion from fighting over the same transform.
 */
export default function TiltCard({ as = "div", className = "", innerClassName = "", children }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0); // -0.5 .. 0.5 across the card
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), spring);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), spring);
  const glowX = useTransform(x, (v) => `${(v + 0.5) * 100}%`);
  const glowY = useTransform(y, (v) => `${(v + 0.5) * 100}%`);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${glowX} ${glowY}, rgba(139, 92, 246, 0.22), transparent 60%)`;

  const Inner = motion[as];

  const handleMove = (e) => {
    if (reduce || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className={`[perspective:1000px] ${className}`}>
      <Inner
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={reduce ? undefined : { y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className={`group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-colors duration-300 hover:border-violet-400/40 ${innerClassName}`}
      >
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glow }}
        />
        <div className="relative">{children}</div>
      </Inner>
    </div>
  );
}
