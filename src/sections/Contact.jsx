import { lazy, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { AnimatePresence, motion } from "motion/react";
import SectionTitle from "../components/SectionTitle";
import { profile } from "../constants";
import SceneCanvas from "../components/three/SceneCanvas";
// Loaded on demand so the page text shows before the 3D code arrives
const ContactScene = lazy(() => import("../components/three/ContactScene"));

const reveal = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const statusMessages = {
  sent: { text: "Message sent. Thank you!", className: "text-green-400" },
  wait: { text: "Please wait a moment before sending another message.", className: "text-yellow-300" },
  error: { text: "Something went wrong. Please email me directly.", className: "text-red-400" },
};

const COOLDOWN_MS = 30000; // 30 seconds between successful sends

export default function Contact() {
  const formRef = useRef(null);
  const lastSent = useRef(0);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error | wait

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;

    // Honeypot: real users never see or fill this field
    const data = new FormData(formRef.current);
    if (data.get("website")) {
      setStatus("sent"); // pretend success so bots learn nothing
      formRef.current.reset();
      return;
    }

    // Cooldown after a successful send
    if (Date.now() - lastSent.current < COOLDOWN_MS) {
      setStatus("wait");
      return;
    }

    setStatus("sending");
    try {
      await emailjs.sendForm(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        formRef.current,
        { publicKey: import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY }
      );
      lastSent.current = Date.now();
      setStatus("sent");
      formRef.current.reset();
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-white/40 focus-visible:ring-2 focus-visible:ring-white/30";

  return (
    <section id="contact" className="px-6 py-24 md:px-20">
      <SectionTitle className="">Get in touch</SectionTitle>
      <motion.p
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mt-4 max-w-xl text-white/70"
      >
        Open to AI engineering roles and interesting projects. Send a message or reach me directly.
      </motion.p>

      <motion.div
        className="mt-10 grid gap-10 md:grid-cols-2"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.15 }}
      >
        <motion.div variants={reveal} className="space-y-4">
          <div className="relative mb-6">
            <SceneCanvas className="h-[300px] md:h-[360px]" camera={{ position: [0, 1, 8], fov: 40 }}>
              <ContactScene />
            </SceneCanvas>
            <motion.div
              initial={{ scale: 0, rotate: -12, opacity: 0 }}
              whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.5 }}
              style={{ transformOrigin: "bottom left" }}
              className="absolute top-4 right-0 rounded-2xl rounded-bl-sm bg-violet-500/20 px-4 py-3 text-lg font-medium whitespace-nowrap text-white">
              Let's talk{" "}
              <motion.span
                aria-hidden="true"
                className="inline-block origin-[70%_70%]"
                animate={{ rotate: [0, 18, -8, 18, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1.5 }}
              >
                👋
              </motion.span>
            </motion.div>
          </div>
          <a href={`mailto:${profile.email}`} className="block text-lg hover:underline">
            {profile.email}
          </a>
          <a href={profile.github} target="_blank" rel="noreferrer" className="block text-lg hover:underline">
            GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="block text-lg hover:underline">
            LinkedIn
          </a>
          <p className="text-white/50">{profile.location}</p>
        </motion.div>

        <motion.form variants={reveal} ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="from_name" className="sr-only">Your name</label>
          <input
            id="from_name" name="from_name" type="text" placeholder="Your name"
            autoComplete="name" maxLength={100} required className={inputClass}
          />

          <label htmlFor="from_email" className="sr-only">Your email</label>
          <input
            id="from_email" name="from_email" type="email" placeholder="Your email"
            autoComplete="email" maxLength={150} required className={inputClass}
          />

          <label htmlFor="message" className="sr-only">Your message</label>
          <textarea
            id="message" name="message" rows="5" placeholder="Your message"
            maxLength={2000} required className={`${inputClass} resize-none`}
          />

          {/* Honeypot field: hidden from humans and screen readers */}
          <input
            name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true"
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
          />

          <motion.button
            whileHover={status === "sending" ? undefined : { scale: 1.04 }}
            whileTap={status === "sending" ? undefined : { scale: 0.95 }}
            type="submit"
            disabled={status === "sending"}
            className="rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:bg-white/80 disabled:opacity-50"
          >
            {status === "sending" ? "Sending..." : "Send message"}
          </motion.button>

          <div aria-live="polite">
            <AnimatePresence mode="wait">
              {statusMessages[status] && (
                <motion.p
                  key={status}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className={statusMessages[status].className}
                >
                  {statusMessages[status].text}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.form>
      </motion.div>
    </section>
  );
}
