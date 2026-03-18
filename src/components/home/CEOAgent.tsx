"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import GlowOrb from "@/components/effects/GlowOrb";

function NodeGraph() {
  return (
    <svg viewBox="0 0 200 80" className="w-48 mx-auto mb-8" fill="none">
      {/* Central node (CEO) */}
      <motion.circle
        cx="100" cy="20" r="8"
        stroke="#00E5FF" strokeWidth="1.5" fill="#00E5FF" fillOpacity="0.1"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
      {/* Child nodes */}
      {[40, 100, 160].map((x, i) => (
        <motion.circle
          key={x}
          cx={x} cy="65" r="5"
          stroke="#9B9BAE" strokeWidth="1" fill="#9B9BAE" fillOpacity="0.1"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
        />
      ))}
      {/* Connecting lines */}
      {[40, 100, 160].map((x, i) => (
        <motion.line
          key={`line-${x}`}
          x1="100" y1="28" x2={x} y2="60"
          stroke="#00E5FF" strokeWidth="0.5" strokeOpacity="0.3"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
        />
      ))}
      {/* Pulsing ring on CEO node */}
      <motion.circle
        cx="100" cy="20" r="12"
        stroke="#00E5FF" strokeWidth="0.5" fill="none"
        animate={{ r: [12, 18, 12], opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

export default function CEOAgent() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-surface section-padding relative overflow-hidden">
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
            This isn&rsquo;t a dashboard. It&rsquo;s not a report you read on
            Monday morning. It&rsquo;s an agent that thinks about your business
            the way you do &mdash; except it never stops, it sees everything,
            and it doesn&rsquo;t have blind spots.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans text-base leading-relaxed text-ghost-muted"
          >
            Every agent system we build includes something most companies
            don&rsquo;t even know to ask for. We call it the CEO Agent. It sits
            above every other agent in your system, receives their data in real
            time, and does what a great CEO does &mdash; looks across the entire
            operation, spots the patterns no single department can see, and finds
            the opportunities nobody briefed it to find.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans text-base leading-relaxed text-ghost-muted"
          >
            Your workflow agents reduce costs. Your CEO agent finds revenue. It
            identifies which customer segments are quietly growing, which
            operational changes would unlock capacity, which pricing adjustments
            would land, and which processes are creating bottlenecks that ripple
            across your whole business.
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
