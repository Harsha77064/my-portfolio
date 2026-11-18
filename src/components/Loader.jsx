import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { profile } from "../constants";

gsap.registerPlugin(useGSAP);

// Total length of the intro; the hero waits this long before animating in
export const LOADER_SECONDS = 1.4;

export default function Loader() {
  const root = useRef(null);
  const [done, setDone] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useGSAP(
    () => {
      if (done) return;
      gsap
        .timeline({ onComplete: () => setDone(true) })
        .from(".loader-photo", { scale: 0.6, opacity: 0, duration: 0.5, ease: "back.out(1.7)" })
        .from(".loader-name", { y: 16, opacity: 0, duration: 0.4 }, "-=0.15")
        .to(root.current, { opacity: 0, duration: 0.4, delay: 0.25 });
    },
    { scope: root }
  );

  if (done) return null;

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 bg-black"
    >
      <img
        src={profile.avatar}
        alt=""
        className="loader-photo h-28 w-28 rounded-full object-cover ring-4 ring-violet-400/50 shadow-[0_0_50px_rgba(139,92,246,0.5)]"
      />
      <p className="loader-name text-xl font-semibold tracking-wide text-white">{profile.name}</p>
    </div>
  );
}
