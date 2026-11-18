import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { experience, profile } from "../constants";

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
    { scope: root }
  );

  return (
    <section id="experience" ref={root} className="px-6 py-24 md:px-20">
      <h2 className="mb-12 text-3xl font-bold md:text-5xl">Experience</h2>

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
              className="exp-item relative rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8"
            >
              <span
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
    </section>
  );
}
