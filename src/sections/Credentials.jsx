import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { education, certifications } from "../constants";
import TiltCard from "../components/TiltCard";
import SectionTitle from "../components/SectionTitle";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Credentials() {
  const root = useRef(null);

  useGSAP(
    () => {
      gsap.from(".cred-card", {
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
    <section id="credentials" ref={root} className="px-6 py-24 md:px-20">
      <SectionTitle>Education & Certifications</SectionTitle>
      <div className="grid gap-6 md:grid-cols-2">
        {education.map((e) => (
          <TiltCard key={e.degree} className="cred-card" innerClassName="p-6">
            <p className="text-sm text-white/50">{e.years}</p>
            <h3 className="text-xl font-semibold">{e.degree}</h3>
            <p className="text-white/70">{e.school}</p>
          </TiltCard>
        ))}
        {certifications.map((c) => (
          <TiltCard key={c.title} className="cred-card" innerClassName="p-6">
            <p className="text-sm text-white/50">{c.year}</p>
            <h3 className="text-xl font-semibold">{c.title}</h3>
            <p className="text-white/70">{c.detail}</p>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}