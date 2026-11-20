import { motion } from "motion/react";
import { profile } from "../constants";

const socials = [
  {
    name: "GitHub",
    href: profile.github,
    path: "M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z",
  },
  {
    name: "LinkedIn",
    href: profile.linkedin,
    path: "M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z",
  },
  {
    name: "Email",
    href: `mailto:${profile.email}`,
    path: "M2 4h20a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm10 8.2L2.4 6v.3L12 12.6l9.6-6.3V6L12 12.2Z",
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden px-6 pt-24 pb-10 md:px-20">
      {/* Fading grid behind the call to action */}
      <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/2 h-72 w-[40rem] max-w-full -translate-x-1/2 rounded-full bg-violet-600/20 blur-3xl"
      />

      <motion.div
        className="relative flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="max-w-3xl text-3xl font-bold md:text-5xl">
          Ready to bring <span className="bg-gradient-to-r from-violet-300 to-sky-300 bg-clip-text text-transparent">AI</span>{" "}
          into your product?
        </h2>
        <p className="mt-4 max-w-xl text-white/60">
          Reach out and let's talk about how I can help you build, ship and scale it.
        </p>
        <motion.a
          href="#contact"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="moving-border mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold"
        >
          Let's get in touch
          <span aria-hidden="true">→</span>
        </motion.a>
      </motion.div>

      <div className="relative mt-20 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 md:flex-row">
        <p className="text-sm text-white/50">
          © {new Date().getFullYear()} {profile.name}. Built with React, Three.js and Motion.
        </p>
        <ul className="flex gap-3">
          {socials.map((s) => (
            <li key={s.name}>
              <motion.a
                href={s.href}
                target={s.name === "Email" ? undefined : "_blank"}
                rel="noreferrer"
                aria-label={s.name}
                whileHover={{ y: -3 }}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition-colors hover:border-violet-400/50 hover:text-white"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                  <path d={s.path} />
                </svg>
              </motion.a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
