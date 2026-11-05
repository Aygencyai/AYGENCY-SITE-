"use client";

import { useRef, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import AnimatedGrid from "@/components/effects/AnimatedGrid";
import GlowOrb from "@/components/effects/GlowOrb";
import MagneticButton from "@/components/ui/MagneticButton";

function Particles() {
  const dots = useMemo(() => {
    // Keep the decorative layout identical during server render and hydration.
    let seed = 47021;
    const next = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: next() * 100,
      y: next() * 100,
      size: next() * 3 + 1,
      duration: next() * 8 + 12,
      delay: next() * 5,
    }));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {dots.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute rounded-full"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: dot.size,
            height: dot.size,
            backgroundColor: "#00E5FF",
            opacity: 0,
          }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              y: [0, -30, 0],
              opacity: [0, 0.2, 0],
              transition: {
                duration: dot.duration,
                delay: dot.delay,
                repeat: Infinity,
                ease: "easeInOut",
              },
            },
          }}
        />
      ))}
    </motion.div>
  );
}

export default function CTABanner() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative blend-surface section-padding overflow-hidden">
      <AnimatedGrid />
      <GlowOrb
        size={500}
        opacity={0.12}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        parallaxStrength={25}
      />
      <Particles />

      <div className="relative z-10 max-w-3xl mx-auto text-center px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading text-[2rem] sm:text-[2.5rem] md:text-[3rem] leading-[1.1] text-white uppercase font-semibold"
        >
          See how far
          <br />
          you could scale.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans text-base text-ghost-muted mt-6 max-w-lg mx-auto"
        >
          Tell us where the hours go. We&rsquo;ll show you which agents would win them back
          first.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10"
        >
          <MagneticButton>
            <Link
              href="/contact"
              className="inline-block rounded-lg bg-cyan px-10 py-4 font-heading text-sm font-semibold uppercase tracking-[0.15em] text-void transition-all duration-200 hover:brightness-110 hover:shadow-glow-sm"
            >
              Book a call
            </Link>
          </MagneticButton>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="font-sans text-sm text-ghost-dim mt-8"
        >
          Built once, compound forever.
        </motion.p>
      </div>
    </section>
  );
}
