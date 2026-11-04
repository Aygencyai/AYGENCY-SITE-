"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";

const comparisons = [
  {
    title: "Built around you.",
    body: "Every system starts with your real workflows. We design the agents around how your business already works, so they fit in from day one and your team carries on as normal.",
  },
  {
    title: "Your AI transformation partner.",
    body: "We go deep into your business to find the most valuable things to build first. Then we keep deploying AI and solving new problems as your growth operators, for as long as you grow.",
  },
  {
    title: "Built once, compounding forever.",
    body: "We operate every system we build. It learns from how your business runs, so it is worth more next quarter than it is today, and each new agent adds to what is already there.",
  },
];

export default function WhyAygency() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="blend-void section-padding">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-heading text-[2rem] sm:text-[2.5rem] md:text-[3rem] leading-[1.1] text-ghost uppercase font-semibold">
            Most AI agencies make you work for the system.
            <br />
            <span className="text-cyan">We make the system work for you.</span>
          </h2>
        </motion.div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {comparisons.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 0.7,
                delay: i * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="h-full"
            >
              <GlassCard className="h-full">
                <h3 className="font-heading text-xl font-semibold text-white">
                  {item.title}
                </h3>
                <p className="font-sans text-base leading-relaxed text-ghost-muted mt-3">
                  {item.body}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
