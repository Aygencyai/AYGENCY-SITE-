"use client";

import { useScroll, useTransform, motion } from "framer-motion";

/**
 * Fixed, full-viewport background for the homepage's continuous scroll.
 * A faint drifting grid plus two cyan glows that gently parallax with scroll.
 * Rendered outside PageTransition so `fixed` stays relative to the viewport.
 * Homepage sections are transparent, so this shows through all of them.
 */
export default function HomeBackground() {
  const { scrollYProgress } = useScroll();
  const glowY1 = useTransform(scrollYProgress, [0, 1], ["-8%", "22%"]);
  const glowY2 = useTransform(scrollYProgress, [0, 1], ["12%", "-16%"]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-void">
      {/* Faint drifting grid */}
      <motion.div
        aria-hidden
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,229,255,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,229,255,0.6) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
        animate={{ backgroundPosition: ["0px 0px", "64px 64px"] }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      />

      {/* Drifting glows, gently parallaxed by scroll */}
      <motion.div aria-hidden style={{ y: glowY1 }} className="absolute top-[6%] -left-32">
        <motion.div
          className="w-[600px] h-[600px] rounded-full bg-cyan/[0.05] blur-[140px]"
          animate={{ x: [0, 40, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
      <motion.div aria-hidden style={{ y: glowY2 }} className="absolute top-[58%] -right-32">
        <motion.div
          className="w-[520px] h-[520px] rounded-full bg-cyan/[0.04] blur-[140px]"
          animate={{ x: [0, -36, 0] }}
          transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}
