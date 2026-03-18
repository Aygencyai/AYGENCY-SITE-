"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import HeroBackground from "./HeroBackground";
import TypewriterText from "@/components/effects/TypewriterText";
import MagneticButton from "@/components/ui/MagneticButton";

const headingLines = [
  ["BUILT", "ONCE,"],
  ["COMPOUND", "FOREVER"],
];

const wordVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.4 + i * 0.1, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-void overflow-hidden">
      <HeroBackground />

      {/* Main content — vertically centred */}
      <div className="relative z-10 flex min-h-screen items-center">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-mono text-xs tracking-[0.2em] uppercase text-cyan mb-8"
          >
            {`// AI agent systems`}
          </motion.p>

          {/* Desktop: side-by-side | Mobile: stacked */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-16">
            {/* Heading */}
            <h1 className="font-heading text-[28px] min-[400px]:text-[36px] sm:text-[48px] lg:text-[68px] font-bold uppercase leading-[0.95] text-white lg:max-w-[680px]">
              {headingLines.map((line, lineIdx) => {
                const wordOffset = headingLines.slice(0, lineIdx).reduce((sum, l) => sum + l.length, 0);
                return (
                  <span key={lineIdx} className="block sm:whitespace-nowrap">
                    {line.map((word, wi) => (
                      <motion.span
                        key={word + wi}
                        custom={wordOffset + wi}
                        initial="hidden"
                        animate="visible"
                        variants={wordVariants}
                        className="inline-block mr-[0.3em]"
                      >
                        {word}
                      </motion.span>
                    ))}
                  </span>
                );
              })}
            </h1>

            {/* Bridge line + Body text */}
            <div className="max-w-[400px]">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <p className="font-mono text-lg leading-[1.3] text-cyan whitespace-pre-line">
                  <TypewriterText
                    text={"You're overpaying for work,\nthat should run itself"}
                    delay={1200}
                    speed={30}
                  />
                </p>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 2.8, ease: "easeOut" }}
                className="font-sans text-base font-normal leading-[1.7] text-ghost-muted mt-4"
              >
                We exist to make AI agents the operating standard for businesses that
                refuse to stay manual. Every system we ship is custom-built,
                production-ready, and designed to compound in value the longer it runs.
              </motion.p>
            </div>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 3.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 flex flex-col items-center gap-4 min-[480px]:flex-row min-[480px]:justify-center"
          >
            <MagneticButton>
              <Link
                href="/contact"
                className="inline-block rounded-lg bg-cyan px-8 py-3 font-heading text-[13px] font-semibold uppercase tracking-[0.15em] text-void transition-all duration-200 hover:brightness-110 hover:shadow-glow-sm"
              >
                Book a Call
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link
                href="/services"
                className="inline-block rounded-lg border border-cyan/30 bg-transparent px-8 py-3 font-heading text-[13px] font-semibold uppercase tracking-[0.15em] text-cyan transition-all duration-200 hover:bg-cyan/[0.05] hover:border-cyan/50"
              >
                What We Build
              </Link>
            </MagneticButton>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator — pulsing cyan dot */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0.2, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-2 h-2 rounded-full bg-cyan"
        />
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="h-8 w-px bg-ghost/20"
        />
      </div>
    </section>
  );
}
