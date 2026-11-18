import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { skillGroups } from "../constants";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Skills() {
  const root = useRef(null);

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
      <h2 className="mb-12 text-3xl font-bold md:text-5xl">Skills</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {skillGroups.map((group) => (
          <div
            key={group.title}
            className="skill-card rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <h3 className="mb-4 text-xl font-semibold">{group.title}</h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span key={item} className="rounded-full bg-white/10 px-3 py-1 text-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}