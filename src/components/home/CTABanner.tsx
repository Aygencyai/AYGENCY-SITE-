"use client";

import { useRef, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import AnimatedGrid from "@/components/effects/AnimatedGrid";
import GlowOrb from "@/components/effects/GlowOrb";
import MagneticButton from "@/components/ui/MagneticButton";

function Particles() {
  const dots = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
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
    <section ref={ref} className="relative bg-surface section-padding overflow-hidden">
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
          You Will Build This.
          <br />
          How Much More Will You Waste Until You Do?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans text-base text-ghost-muted mt-6 max-w-lg mx-auto"
        >
          Book 30 minutes. We&rsquo;ll map your operation, find the workflows
          bleeding time and money, and tell you exactly what we&rsquo;d build.
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
              Book a Call
            </Link>
          </MagneticButton>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="font-sans text-sm text-ghost-dim mt-8"
        >
          Helping forward-looking companies thrive with custom AI agent systems
          and automated workflows.
        </motion.p>
      </div>
    </section>
  );
}
