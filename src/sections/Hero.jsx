import { lazy, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";
import { profile } from "../constants";
import { LOADER_SECONDS } from "../components/Loader";
import SceneCanvas from "../components/three/SceneCanvas";
import Spotlight from "../components/ui/Spotlight";
import TextGenerate from "../components/ui/TextGenerate";
// Loaded on demand so the page text shows before the 3D code arrives
const HeroScene = lazy(() => import("../components/three/HeroScene"));

gsap.registerPlugin(useGSAP);

const buttonMotion = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { type: "spring", stiffness: 400, damping: 17 },
};

export default function Hero() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Text comes in once the loading screen has gone
      gsap.from(".hero-text", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        delay: LOADER_SECONDS,
      });
    },
    { scope: root }
  );

  return (
    <section
      id="home"
      ref={root}
      className="relative grid min-h-screen items-center gap-6 overflow-hidden px-6 pt-24 md:grid-cols-[1fr_1.15fr] md:px-20"
    >
      {/* Sweeping spotlights and a fading grid behind the hero */}
      <Spotlight className="-top-40 -left-10 md:-top-20 md:-left-32" fill="white" />
      <Spotlight className="top-10 left-full h-[80vh] w-[50vw]" fill="#a78bfa" />
      <Spotlight className="top-28 left-80 h-[80vh] w-[50vw]" fill="#38bdf8" />
      <div className="hero-grid pointer-events-none absolute inset-0 -z-0" aria-hidden="true" />

      <div className="relative z-10">
        <p className="hero-text inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Open to AI engineering roles
        </p>
        <p className="hero-text mt-6 text-lg text-white/60">Hi, I'm</p>
        <h1 className="hero-text bg-gradient-to-r from-white via-violet-200 to-sky-300 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent md:text-7xl">
          {profile.name}
        </h1>
        <p className="hero-text mt-4 text-lg text-white/70 md:text-2xl">{profile.title}</p>
        <TextGenerate
          text="Turning data into intelligent, production-ready AI systems."
          highlight={["intelligent", "production-ready"]}
          delay={LOADER_SECONDS + 0.6}
          className="mt-5 max-w-xl text-2xl leading-snug font-semibold text-white/90 md:text-3xl"
        />
        <div className="hero-text mt-8 flex flex-wrap gap-4">
          <motion.a
            {...buttonMotion}
            href="#projects"
            className="rounded-full bg-gradient-to-r from-violet-500 to-sky-500 px-6 py-3 font-semibold text-white shadow-[0_0_30px_rgba(139,92,246,0.45)]"
          >
            View Projects
          </motion.a>
          <motion.a
            {...buttonMotion}
            href={profile.resume}
            download
            className="rounded-full border border-white/30 px-6 py-3 font-semibold backdrop-blur transition-colors hover:bg-white/10"
          >
            Download Resume
          </motion.a>
        </div>
        <p className="hero-text mt-6 hidden text-sm text-white/40 md:block">
          Tip: move your mouse over the scene
        </p>
      </div>

      {/* 3D sci-fi AI engineer with a live neural network and holograms */}
      <SceneCanvas
        className="relative h-[420px] md:h-[680px]"
        camera={{ position: [0, 0.9, 9], fov: 42 }}
      >
        <HeroScene delay={LOADER_SECONDS} />
      </SceneCanvas>

      {/* Scroll cue: a mouse outline with a bouncing wheel */}
      <motion.a
        href="#about"
        aria-label="Scroll to About"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: LOADER_SECONDS + 1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block"
      >
        <span className="flex h-10 w-6 justify-center rounded-full border-2 border-white/40 pt-2">
          <motion.span
            animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="block h-2 w-1 rounded-full bg-white/80"
          />
        </span>
      </motion.a>
    </section>
  );
}
