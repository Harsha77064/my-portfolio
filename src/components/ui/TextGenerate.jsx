import { motion } from "motion/react";

/**
 * Reveals a sentence one word at a time, each word sharpening from a blur.
 * Words listed in `highlight` get the accent gradient.
 */
export default function TextGenerate({ text, highlight = [], delay = 0, className = "" }) {
  const words = text.split(" ");

  return (
    <motion.p
      className={className}
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.08, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          aria-hidden="true"
          className={`inline-block ${
            highlight.includes(word.replace(/[^\w-]/g, ""))
              ? "bg-gradient-to-r from-violet-300 to-sky-300 bg-clip-text text-transparent"
              : ""
          }`}
          variants={{
            hidden: { opacity: 0, filter: "blur(10px)", y: 6 },
            show: { opacity: 1, filter: "blur(0px)", y: 0 },
          }}
          transition={{ duration: 0.5 }}
        >
          {word}
          {i < words.length - 1 && " "}
        </motion.span>
      ))}
    </motion.p>
  );
}
