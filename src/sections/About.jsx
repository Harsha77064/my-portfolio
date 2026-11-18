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
      gsap.from(".about-photo", {
        x: 80,
        rotate: 6,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
    },
    { scope: root }
  );

  return (
    <section id="about" ref={root} className="overflow-x-clip px-6 py-24 md:px-20">
      <div className="grid items-center gap-12 md:grid-cols-[1fr_auto]">
        <div>
          <h2 className="about-item text-3xl font-bold md:text-5xl">About me</h2>
          <p className="about-item mt-6 max-w-3xl text-lg text-white/80">{profile.summary}</p>
          <p className="about-item mt-2 text-white/50">{profile.location}</p>
        </div>

        <div className="about-photo mx-auto w-[240px] md:w-[300px]">
          <div
            className="relative aspect-[4/5] -rotate-3 overflow-hidden rounded-3xl border-2 border-violet-400/50 shadow-[0_0_40px_rgba(139,92,246,0.35)]"
          >
            <img
              src={profile.photo}
              alt={`Photo of ${profile.name}`}
              loading="lazy"
              className="h-full w-full object-cover"
              style={{ objectPosition: "50% 30%" }}
            />
          </div>
        </div>
      </div>

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
