"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import HeroBackground from "./HeroBackground";
const headingWords = ["YOU'RE", "OVERPAYING", "FOR", "WORK", "THAT", "SHOULD", "RUN", "ITSELF"];

const wordVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.2, ease: "easeOut" as const },
  }),
};

export default function Hero() {
  const headingAnimDuration = headingWords.length * 0.2 + 0.6;

  return (
    <section className="relative min-h-screen bg-ivory overflow-hidden">
      <HeroBackground />

      {/* Main content — vertically centred */}
      <div className="relative z-10 flex min-h-screen items-center">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
          {/* Desktop: side-by-side | Mobile: stacked */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-16">
            {/* Heading */}
            <h1 className="font-serif text-[36px] sm:text-[48px] lg:text-[80px] uppercase leading-[0.95] text-green">
              {headingWords.map((word, i) => (
                <motion.span
                  key={word + i}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={wordVariants}
                  className="inline-block mr-[0.3em]"
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            {/* Bridge line + Body text */}
            <div className="max-w-[400px]">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: headingAnimDuration + 0.3, ease: "easeOut" }}
                className="font-serif text-2xl leading-[1.2] text-green"
              >
                Increase your revenue by decreasing your costs
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: headingAnimDuration + 0.5, ease: "easeOut" }}
                className="font-sans text-base font-normal leading-[1.6] text-green-muted mt-4"
              >
                We exist to make AI agents the operating standard for businesses that
                refuse to stay manual. Every system we ship is custom-built,
                production-ready, and designed to compound in value the longer it runs.
              </motion.p>
            </div>
          </div>

          {/* CTA Buttons — below heading + body, centred */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: headingAnimDuration + 0.6, ease: "easeOut" }}
            className="mt-12 flex flex-col items-center gap-4 min-[480px]:flex-row min-[480px]:justify-center"
          >
            <Link
              href="/contact"
              className="inline-block rounded-full bg-green px-8 py-3 font-sans text-[13px] font-semibold uppercase tracking-[0.15em] text-white transition-colors duration-200 hover:bg-green-light"
            >
              Book a Call
            </Link>
            <Link
              href="/services"
              className="inline-block rounded-full border border-green bg-transparent px-8 py-3 font-sans text-[13px] font-semibold uppercase tracking-[0.15em] text-green transition-colors duration-200 hover:bg-ivory-dark"
            >
              What We Build
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator — bottom centre */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="mx-auto h-10 w-px bg-muted" />
      </motion.div>
    </section>
  );
}
