import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import SectionTitle from "../components/SectionTitle";
import DotMatrix from "../components/ui/DotMatrix";

const phases = [
  {
    phase: "Phase 1",
    title: "Frame the problem and the data",
    description:
      "I start with the business question, the success metric and the data that can answer it. Collection, cleaning and a trustworthy evaluation set come before any model.",
    colors: ["#22d3ee", "#67e8f9"],
    accent: "from-cyan-400/20",
  },
  {
    phase: "Phase 2",
    title: "Build, evaluate, iterate",
    description:
      "Prototype models, prompts and retrieval, measure them against the eval set, and iterate on fine-tuning and prompt design until accuracy and latency both hold up.",
    colors: ["#a78bfa", "#c4b5fd", "#8b5cf6"],
    accent: "from-violet-400/20",
  },
  {
    phase: "Phase 3",
    title: "Deploy, monitor, retrain",
    description:
      "Ship behind an API on GCP with Docker, automate the data pipelines, then watch for drift and retrain so the system keeps getting better after launch.",
    colors: ["#f472b6", "#f9a8d4", "#38bdf8"],
    accent: "from-pink-400/20",
  },
];

// Corner brackets that frame each card
function Corners() {
  const base = "absolute h-5 w-5 border-white/40";
  return (
    <>
      <span className={`${base} -top-px -left-px border-t-2 border-l-2`} />
      <span className={`${base} -top-px -right-px border-t-2 border-r-2`} />
      <span className={`${base} -bottom-px -left-px border-b-2 border-l-2`} />
      <span className={`${base} -right-px -bottom-px border-r-2 border-b-2`} />
    </>
  );
}

function PhaseCard({ item }) {
  const [active, setActive] = useState(false);

  return (
    <motion.div
      tabIndex={0}
      onPointerEnter={(e) => e.pointerType === "mouse" && setActive(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setActive(false)}
      onPointerUp={(e) => e.pointerType !== "mouse" && setActive((a) => !a)} // tap to toggle on touch screens
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex min-h-[22rem] cursor-pointer items-center justify-center overflow-hidden border border-white/15 bg-gradient-to-b ${item.accent} to-transparent p-8 outline-none focus-visible:ring-2 focus-visible:ring-violet-400`}
    >
      <Corners />
      <DotMatrix active={active} colors={item.colors} />
      {/* Darken the edges so the text stays readable over the dots */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(11,15,26,0.85)_0%,transparent_70%)]" />

      <div className="relative text-center">
        <AnimatePresence mode="wait" initial={false}>
          {active ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-bold md:text-3xl">{item.title}</h3>
              <p className="mt-4 text-white/75">{item.description}</p>
            </motion.div>
          ) : (
            <motion.span
              key="pill"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="moving-border inline-block rounded-full px-6 py-3 text-xl font-bold md:text-2xl"
            >
              {item.phase}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function Approach() {
  return (
    <section id="approach" className="px-6 py-24 md:px-20">
      <SectionTitle className="mb-4">My approach</SectionTitle>
      <p className="mb-12 max-w-xl text-white/60">How I take an AI idea from a question to a system people rely on. Hover a phase to open it.</p>
      <motion.div
        className="grid gap-6 lg:grid-cols-3"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.15 }}
      >
        {phases.map((item) => (
          <PhaseCard key={item.phase} item={item} />
        ))}
      </motion.div>
    </section>
  );
}
