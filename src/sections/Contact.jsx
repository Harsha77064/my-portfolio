import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { profile } from "../constants";

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
      <h2 className="text-3xl font-bold md:text-5xl">Get in touch</h2>
      <p className="mt-4 max-w-xl text-white/70">
        Open to AI engineering roles and interesting projects. Send a message or reach me directly.
      </p>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <div className="space-y-4">
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
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
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

          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:bg-white/80 disabled:opacity-50"
          >
            {status === "sending" ? "Sending..." : "Send message"}
          </button>

          <div aria-live="polite">
            {status === "sent" && <p className="text-green-400">Message sent. Thank you!</p>}
            {status === "wait" && (
              <p className="text-yellow-300">Please wait a moment before sending another message.</p>
            )}
            {status === "error" && (
              <p className="text-red-400">Something went wrong. Please email me directly.</p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
