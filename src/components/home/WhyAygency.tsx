"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";

const comparisons = [
  {
    title: "Hiring In-House",
    body: "Months to recruit. Months to onboard. Expensive hires. And you still need to figure out what to build. By the time your team is assembled, we\u2019ve already shipped and iterated.",
  },
  {
    title: "Strategy Firms",
    body: "You\u2019ll pay a premium for a strategy deck and a timeline that stretches into next year. Then you\u2019ll need to find someone else to actually build it. We do both. You leave with a system, not a recommendation.",
  },
  {
    title: "Off-the-Shelf SaaS",
    body: "Generic tools built for everyone, optimised for no one. They don\u2019t know your data, your workflows, or your edge cases. Our agents are built around yours.",
  },
];

export default function WhyAygency() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-surface section-padding">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-heading text-[2rem] sm:text-[2.5rem] md:text-[3rem] leading-[1.1] text-ghost uppercase font-semibold">
            Why Aygency, Not the Alternatives
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
            >
              <GlassCard accentColor="error">
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
