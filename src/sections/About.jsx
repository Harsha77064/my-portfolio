import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { profile, stats } from "../constants";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function About() {
  const root = useRef(null);

  useGSAP(
    () => {
      gsap.from(".about-item", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
    },
    { scope: root }
  );

  return (
    <section id="about" ref={root} className="px-6 py-24 md:px-20">
      <h2 className="about-item text-3xl font-bold md:text-5xl">About me</h2>
      <p className="about-item mt-6 max-w-3xl text-lg text-white/80">{profile.summary}</p>
      <p className="about-item mt-2 text-white/50">{profile.location}</p>

      <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="about-item rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-3xl font-bold md:text-4xl">{s.value}</p>
            <p className="mt-2 text-sm text-white/60">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}