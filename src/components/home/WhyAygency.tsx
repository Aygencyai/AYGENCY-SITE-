"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";

const comparisons = [
  {
    title: "Built around you.",
    body: "Your workflows, your data, your standards. Nothing generic.",
  },
  {
    title: "Your AI transformation partner.",
    body: "We don't build and leave. We stay on as your growth operators for AI, finding the next bottleneck and clearing it.",
  },
  {
    title: "Compounding, not depreciating.",
    body: "Every agent learns from the work it does, so the system is worth more every month it runs.",
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
          <p className="font-sans text-lg leading-[1.7] text-ghost-muted mt-6 max-w-3xl">
            Off-the-shelf AI asks your team to change how they work. We do it the other way
            round. We go deep into your business first, learn how it really runs, and build
            every agent around your people, your tools and your way of doing things.
          </p>
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
