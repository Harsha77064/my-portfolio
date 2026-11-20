import { lazy, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { profile, stats } from "../constants";
import SectionTitle from "../components/SectionTitle";
import SceneCanvas from "../components/three/SceneCanvas";
// Loaded on demand so the page text shows before the 3D code arrives
const GlobeScene = lazy(() => import("../components/three/GlobeScene"));

const stackLeft = ["Python", "LangChain", "Gemini", "GPT-4", "FAISS", "FastAPI"];
const stackRight = ["GCP", "Docker", "PostgreSQL", "TensorFlow", "Hugging Face", "OpenCV"];

// Each tile rises in as it scrolls into view, one after another
const tile = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const tileBase =
  "group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-6 md:p-8 transition-colors hover:border-violet-400/40";

// A column of chips that scrolls upward forever (duplicated so the loop is seamless)
function StackColumn({ items, reverse = false }) {
  return (
    <div className="h-full overflow-hidden [mask-image:linear-gradient(transparent,black_20%,black_80%,transparent)]">
      <div className="marquee-up flex flex-col gap-3" style={reverse ? { animationDirection: "reverse" } : undefined}>
        {[...items, ...items].map((item, i) => (
          <span
            key={`${item}-${i}`}
            aria-hidden={i >= items.length ? "true" : undefined}
            className="rounded-xl bg-white/[0.06] px-4 py-2.5 text-center text-sm whitespace-nowrap text-white/80"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function CopyEmail() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <motion.button
      type="button"
      onClick={copy}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.95 }}
      className="relative mt-6 inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-violet-500 to-sky-500 px-5 py-3 font-semibold text-white shadow-[0_0_30px_rgba(139,92,246,0.4)]"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "done" : "copy"}
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {copied ? "✓ Email copied" : "Copy my email"}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

export default function About() {
  return (
    <section id="about" className="px-6 py-24 md:px-20">
      <SectionTitle>About me</SectionTitle>

      <motion.div
        className="grid auto-rows-[minmax(190px,auto)] gap-5 md:grid-cols-6"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {/* Intro with photo */}
        <motion.div variants={tile} className={`${tileBase} md:col-span-4 md:row-span-2`}>
          <div className="flex h-full flex-col gap-6 sm:flex-row sm:items-end">
            <div className="relative mx-auto aspect-[4/5] w-44 shrink-0 overflow-hidden rounded-2xl border-2 border-violet-400/50 shadow-[0_0_40px_rgba(139,92,246,0.35)] sm:mx-0 md:w-56">
              <img
                src={profile.photo}
                alt={`Photo of ${profile.name}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ objectPosition: "50% 30%" }}
              />
            </div>
            <div>
              <p className="text-sm tracking-widest text-violet-300 uppercase">AI Engineer · B.Tech in AI</p>
              <h3 className="mt-2 text-2xl font-bold md:text-3xl">
                I design, deploy and retrain ML models that hold up in production.
              </h3>
              <p className="mt-4 text-white/70">{profile.summary}</p>
            </div>
          </div>
        </motion.div>

        {/* Globe */}
        <motion.div variants={tile} className={`${tileBase} flex flex-col md:col-span-2 md:row-span-2`}>
          <p className="text-sm tracking-widest text-sky-300 uppercase">Location</p>
          <h3 className="mt-2 text-xl font-bold md:text-2xl">Based in Hyderabad, open to working with teams anywhere</h3>
          <SceneCanvas className="-mx-6 -mb-6 mt-2 min-h-[260px] flex-1 md:-mx-8 md:-mb-8" camera={{ position: [0, 0, 7.2], fov: 45 }}>
            <GlobeScene />
          </SceneCanvas>
        </motion.div>

        {/* Tech stack marquee */}
        <motion.div variants={tile} className={`${tileBase} md:col-span-2`}>
          <p className="text-sm text-white/50">I constantly try to improve</p>
          <h3 className="mt-2 text-xl font-bold md:text-2xl">My tech stack</h3>
          <div className="mt-4 grid h-36 grid-cols-2 gap-3">
            <StackColumn items={stackLeft} />
            <StackColumn items={stackRight} reverse />
          </div>
        </motion.div>

        {/* Impact numbers */}
        <motion.div variants={tile} className={`${tileBase} md:col-span-2`}>
          <p className="text-sm text-white/50">Impact so far</p>
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-4">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="bg-gradient-to-r from-violet-300 to-sky-300 bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
                  {s.value}
                </p>
                <p className="text-xs text-white/60">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Call to action */}
        <motion.div variants={tile} className={`${tileBase} md:col-span-2`}>
          <div
            aria-hidden="true"
            className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-violet-500/30 blur-3xl transition-transform duration-700 group-hover:scale-125"
          />
          <p className="relative text-sm text-white/50">Have an AI problem worth solving?</p>
          <h3 className="relative mt-2 text-xl font-bold md:text-2xl">Let's build something intelligent together</h3>
          <CopyEmail />
        </motion.div>
      </motion.div>
    </section>
  );
}
