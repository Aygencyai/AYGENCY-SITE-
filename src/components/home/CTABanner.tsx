"use client";

import { useRef, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

function Particles() {
  const dots = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 8 + 12,
        delay: Math.random() * 5,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute rounded-full"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: dot.size,
            height: dot.size,
            backgroundColor: "#5BA4C9",
            opacity: 0,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.18, 0],
          }}
          transition={{
            duration: dot.duration,
            delay: dot.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default function CTABanner() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative bg-green py-24 px-8 overflow-hidden">
      <Particles />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="font-serif text-[2rem] sm:text-[2.5rem] md:text-[3rem] leading-[1.1] text-white uppercase"
        >
          Let&rsquo;s Find What&rsquo;s Costing You
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="font-sans text-base text-white/70 mt-6 max-w-lg mx-auto"
        >
          Every engagement starts with a 30-minute call where we map
          your operation and identify the highest-value automation. No fee,
          no slide deck.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mt-10"
        >
          <Link
            href="/contact"
            className="inline-block rounded-full bg-white px-8 py-3 font-sans text-[13px] font-semibold uppercase tracking-[0.15em] text-green transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
          >
            Book a Call
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
