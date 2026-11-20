import { motion } from "motion/react";

/** Section heading that rises in and draws a gradient underline when scrolled into view. */
export default function SectionTitle({ children, className = "mb-12" }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
    >
      <motion.h2
        className="text-3xl font-bold md:text-5xl"
        variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.h2>
      <motion.span
        aria-hidden="true"
        className="mt-3 block h-1 w-20 origin-left rounded-full bg-gradient-to-r from-violet-400 to-sky-400"
        variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1 } }}
        transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  );
}
