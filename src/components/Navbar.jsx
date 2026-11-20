import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { navLinks, profile } from "../constants";

// Tracks which section is in the middle of the screen
function useActiveSection() {
  const [active, setActive] = useState("#home");

  useEffect(() => {
    const sections = navLinks
      .map((l) => document.querySelector(l.href))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return active;
}

export default function Navbar() {
  const active = useActiveSection();
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25, restDelta: 0.001 });

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-white/5 bg-ink/70 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 text-white">
        <a href="#home" className="flex items-center gap-3 text-lg font-semibold">
          <motion.img
            src={profile.avatar}
            alt=""
            width="36"
            height="36"
            whileHover={{ rotate: 8, scale: 1.08 }}
            className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-violet-400/60"
          />
          {profile.name}
        </a>

        {/* Desktop links with a pill that glides to the active section */}
        <ul className="hidden gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = active === link.href;
            return (
              <li key={link.id} className="relative">
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-white/10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <a
                  href={link.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative block rounded-full px-3 py-1.5 transition ${
                    isActive ? "text-white" : "text-white/70 hover:text-white"
                  }`}
                >
                  {link.name}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Mobile menu button: three bars morph into an X */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="relative flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full md:hidden"
        >
          <motion.span animate={open ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} className="block h-0.5 w-6 bg-white" />
          <motion.span animate={{ opacity: open ? 0 : 1 }} className="block h-0.5 w-6 bg-white" />
          <motion.span animate={open ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} className="block h-0.5 w-6 bg-white" />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-white/5 px-6 md:hidden"
          >
            {navLinks.map((link, i) => (
              <motion.li
                key={link.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.05 * i }}
              >
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block py-3 text-lg ${active === link.href ? "text-violet-300" : "text-white/80"}`}
                >
                  {link.name}
                </a>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {/* Scroll progress bar */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-gradient-to-r from-violet-500 via-fuchsia-400 to-sky-400"
      />
    </header>
  );
}
