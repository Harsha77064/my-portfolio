import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { experience } from "../constants";

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
    },
    { scope: root }
  );

  return (
    <section id="experience" ref={root} className="px-6 py-24 md:px-20">
      <h2 className="mb-12 text-3xl font-bold md:text-5xl">Experience</h2>
      <div className="space-y-8">
        {experience.map((job) => (
          <div
            key={job.company}
            className="exp-item rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8"
          >
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
    </section>
  );
}