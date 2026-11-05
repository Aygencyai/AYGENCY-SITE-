"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import HeroBackground from "./HeroBackground";
import TypewriterText from "@/components/effects/TypewriterText";
import MagneticButton from "@/components/ui/MagneticButton";
import HeroFilm from "./HeroFilm";

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
      {/* Lands the glow and grid on plain void, so the next section starts with no visible edge. */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 z-0 h-48 bg-gradient-to-b from-transparent to-void" />

      {/* Main content: text left, film right */}
      <div className="relative z-10 flex min-h-screen items-center pt-28 pb-4 lg:py-0">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-8">
            {/* Left: text content */}
            <div className="lg:w-[55%] flex-shrink-0">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="font-mono text-xs tracking-[0.2em] uppercase text-cyan mb-8"
              >
                {`// AI agent systems for growing businesses`}
              </motion.p>

              <h1 className="font-heading text-[28px] min-[400px]:text-[36px] sm:text-[48px] lg:text-[52px] xl:text-[64px] font-bold uppercase leading-[0.95] text-white">
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

              <div className="max-w-[400px] mt-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  <p className="font-mono text-lg leading-[1.3] min-h-[2.6em] text-cyan whitespace-pre-line">
                    <TypewriterText
                      text={"How far could you scale\nif nothing held you back?"}
                      delay={1800}
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
                  AI agents that take over the manual work running your operation. They
                  slot into the way your business already works and do the job like
                  your best people, only faster, more accurate and never a day off.
                </motion.p>
              </div>

            </div>

            {/* Right: the film, and under it the button its last frame shows. */}
            <div className="lg:w-[45%] mt-8 lg:mt-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.6 }}
              >
                <HeroFilm />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 3.2, ease: [0.16, 1, 0.3, 1] }}
                className="mt-5 lg:mt-6 flex justify-center"
              >
                <MagneticButton>
                  <Link
                    href="/audit"
                    className="inline-block rounded-lg bg-cyan px-6 sm:px-8 py-3 text-center font-heading text-[13px] font-semibold uppercase tracking-[0.15em] text-void transition-all duration-200 hover:brightness-110 hover:shadow-glow-sm"
                  >
                    Book your free AI growth audit
                  </Link>
                </MagneticButton>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
