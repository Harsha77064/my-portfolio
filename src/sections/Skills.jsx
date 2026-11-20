import { lazy, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "motion/react";
import { skillGroups } from "../constants";
import TiltCard from "../components/TiltCard";
import SectionTitle from "../components/SectionTitle";
import SceneCanvas from "../components/three/SceneCanvas";
// Loaded on demand so the page text shows before the 3D code arrives
const TechStackScene = lazy(() => import("../components/three/TechStackScene"));

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Skills() {
  const root = useRef(null);
  const [hovered, setHovered] = useState(null);

  useGSAP(
    () => {
      gsap.from(".skill-card", {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
    },
    { scope: root }
  );

  return (
    <section id="skills" ref={root} className="px-6 py-24 md:px-20">
      <SectionTitle className="mb-4">Skills</SectionTitle>

      {/* Interactive 3D row of the tools I build with */}
      <div className="relative mb-10">
        <SceneCanvas className="h-[200px] md:h-[260px]" camera={{ position: [0, 0, 7], fov: 40 }}>
          <TechStackScene onHover={setHovered} />
        </SceneCanvas>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-8 justify-center" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.p
              key={hovered ?? "hint"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className={hovered ? "text-lg font-semibold text-violet-200" : "text-sm text-white/40"}
            >
              {hovered ?? "Hover a logo"}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {skillGroups.map((group) => (
          <TiltCard key={group.title} className="skill-card" innerClassName="p-6">
            <h3 className="mb-4 text-xl font-semibold">{group.title}</h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <motion.span
                  key={item}
                  whileHover={{ y: -3, scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="cursor-default rounded-full bg-white/10 px-3 py-1 text-sm transition-colors hover:bg-violet-500/30"
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}