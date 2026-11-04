"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";

const comparisons = [
  {
    title: "We learn your business first.",
    body: "Every system starts with your real workflows and pain points. The agents are designed around how you already work, so they fit in from day one and your team carries on as normal.",
  },
  {
    title: "We operate it. Forever.",
    body: "We run the system for as long as you do, keeping it safe and tuning it as the business changes. It learns from how your business runs, so it is worth more next quarter than it is today.",
  },
  {
    title: "It grows with you.",
    body: "Each agent is a specialist built for one job, with the CEO Agent reading across all of them. As the business grows we add agents, so the system keeps pace with you.",
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
            Why Aygency
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
