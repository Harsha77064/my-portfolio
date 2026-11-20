import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";
import { projects } from "../constants";
import TiltCard from "../components/TiltCard";
import SectionTitle from "../components/SectionTitle";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Projects() {
  const root = useRef(null);

  useGSAP(
    () => {
      gsap.from(".project-card", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
    },
    { scope: root }
  );

  return (
    <section id="projects" ref={root} className="px-6 py-24 md:px-20">
      <SectionTitle>Projects</SectionTitle>
      <div className={`grid gap-6 ${projects.length > 1 ? "md:grid-cols-2" : ""}`}>
        {projects.map((p) => (
          <TiltCard key={p.title} as="article" className="project-card" innerClassName="p-6 md:p-8">
            <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
              <h3 className="text-xl font-semibold md:text-2xl">{p.title}</h3>
              <p className="text-white/60">{p.year}</p>
            </div>
            <p className="mb-4 text-white/50">{p.role}</p>
            <p className="text-white/80">{p.description}</p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <motion.li
                  key={t}
                  whileHover={{ y: -3, scale: 1.06 }}
                  className="rounded-full border border-white/15 px-3 py-1 text-sm text-white/70 transition-colors hover:border-violet-400/60 hover:text-white"
                >
                  {t}
                </motion.li>
              ))}
            </ul>

            {(p.github || p.live) && (
              <div className="mt-6 flex flex-wrap gap-3">
                {p.github && (
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={p.github}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-white px-5 py-2 font-semibold text-black transition hover:bg-white/80"
                  >
                    View code
                  </motion.a>
                )}
                {p.live && (
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={p.live}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/30 px-5 py-2 font-semibold transition hover:bg-white/10"
                  >
                    Live demo
                  </motion.a>
                )}
              </div>
            )}
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
