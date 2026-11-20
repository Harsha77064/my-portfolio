import { lazy, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";
import { experience, profile } from "../constants";
import SectionTitle from "../components/SectionTitle";
import SceneCanvas from "../components/three/SceneCanvas";
// Loaded on demand so the page text shows before the 3D code arrives
const RagPipelineScene = lazy(
  () => import("../components/three/RagPipelineScene"),
);

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Experience() {
  const root = useRef(null);

  useGSAP(
    () => {
      gsap.from(".exp-item", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
      // The timeline line draws down from the photo
      gsap.from(".exp-line", {
        scaleY: 0,
        transformOrigin: "top",
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
    },
    { scope: root },
  );

  return (
    <section id="experience" ref={root} className="px-6 py-24 md:px-20">
      <SectionTitle>Experience</SectionTitle>

      <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative pl-14 md:pl-20">
          {/* Timeline: photo at the top, a line running down past each job */}
          <img
            src={profile.avatar}
            alt=""
            loading="lazy"
            className="absolute left-0 top-0 h-10 w-10 rounded-full object-cover ring-2 ring-violet-400/60 md:h-14 md:w-14"
          />
          <div
            className="exp-line absolute bottom-0 left-5 top-12 w-px bg-gradient-to-b from-violet-400/70 to-transparent md:left-7 md:top-16"
            aria-hidden="true"
          />

          <div className="space-y-8">
            {experience.map((job) => (
              <div
                key={job.company}
                className="exp-item moving-border relative rounded-2xl p-6 md:p-8"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: [0, 1.6, 1] }}
                  viewport={{ once: true, amount: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="absolute top-8 -left-[2.6rem] h-3 w-3 rounded-full bg-violet-400 ring-4 ring-violet-400/20 md:-left-[3.6rem]"
                  aria-hidden="true"
                />
                <div className="flex flex-col gap-1 md:flex-row md:justify-between">
                  <h3 className="text-xl font-semibold md:text-2xl">
                    {job.role} · {job.company}
                  </h3>
                  <p className="text-white/60">{job.period}</p>
                </div>
                <p className="mb-4 text-white/50">{job.location}</p>
                <ul className="list-disc space-y-2 pl-5 text-white/80">
                  {job.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 3D view of the RAG pipeline built in this role */}
        <motion.figure
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-violet-500/[0.08] via-transparent to-cyan-500/[0.06] lg:sticky lg:top-24"
        >
          <div
            className="hero-grid pointer-events-none absolute inset-0"
            aria-hidden="true"
          />
          <figcaption className="relative px-6 pt-5">
            <p className="text-xs tracking-widest text-cyan-300 uppercase">
              Inside the work
            </p>
            <p className="mt-1 text-lg font-semibold">
              The RAG pipeline I built and shipped
            </p>
          </figcaption>
          <SceneCanvas
            className="relative h-[520px] md:h-[600px]"
            camera={{ position: [0, 0, 10], fov: 45 }}
          >
            <RagPipelineScene />
          </SceneCanvas>
        </motion.figure>
      </div>
    </section>
  );
}
