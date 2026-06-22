"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import GlowOrb from "@/components/effects/GlowOrb";

function NodeGraph() {
  return (
    <motion.svg
      viewBox="0 0 200 80"
      className="w-48 mx-auto mb-8"
      fill="none"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px 0px" }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* Central node (CEO) */}
      <circle
        cx="100" cy="20" r="8"
        stroke="#00E5FF" strokeWidth="1.5" fill="#00E5FF" fillOpacity="0.1"
      />
      {/* Child nodes */}
      {[40, 100, 160].map((x) => (
        <circle
          key={x}
          cx={x} cy="65" r="5"
          stroke="#9B9BAE" strokeWidth="1" fill="#9B9BAE" fillOpacity="0.1"
        />
      ))}
      {/* Connecting lines */}
      {[40, 100, 160].map((x) => (
        <line
          key={`line-${x}`}
          x1="100" y1="28" x2={x} y2="60"
          stroke="#00E5FF" strokeWidth="0.5" strokeOpacity="0.3"
        />
      ))}
      {/* Pulsing ring on CEO node */}
      <motion.circle
        cx="100" cy="20" r="12"
        stroke="#00E5FF" strokeWidth="0.5" fill="none"
        animate={{ r: [12, 18, 12], opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}

export default function CEOAgent() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-void section-padding relative overflow-hidden">
      <GlowOrb
        size={500}
        opacity={0.06}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        parallaxStrength={20}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-8 text-center">
        <NodeGraph />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-heading text-[2rem] sm:text-[2.5rem] md:text-[3rem] leading-[1.1] text-ghost uppercase font-semibold">
            Every System Comes With a CEO
          </h2>
        </motion.div>

        <div ref={ref} className="mt-12 space-y-5">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans text-base leading-relaxed text-ghost-muted"
          >
            It&rsquo;s not a dashboard. The CEO Agent sits on top of every other
            agent and reads across the whole operation as it happens. It does what
            a sharp operator does. It catches the patterns no single department can
            see, and finds the openings nobody thought to look for.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans text-base leading-relaxed text-ghost-muted"
          >
            Your specialist agents do the work. The CEO Agent reads across all of it
            and surfaces what you&rsquo;d usually only catch months later, like the
            segment that&rsquo;s quietly growing or the bottleneck that&rsquo;s
            quietly costing you.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-sm tracking-wide uppercase text-cyan mt-6"
          >
            Included with every system we build. No add-on. No upgrade tier.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
