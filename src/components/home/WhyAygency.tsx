"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";

const comparisons = [
  {
    title: "We operate it. Forever.",
    body: "Most builds get handed over and quietly decay. We run every system we build \u2014 monitoring it, tuning it, expanding it. That is the only reason it keeps getting better instead of going stale.",
  },
  {
    title: "A team, not one bot.",
    body: "Each agent is a specialist with one job, coordinated by the CEO Agent. You get a department that works together, not one stretched bot trying to do everything.",
  },
  {
    title: "We prescribe. You don\u2019t architect.",
    body: "You shouldn\u2019t have to design your own AI department. We show you what fits, prescribe the system, and tailor it to how you actually work.",
  },
];

export default function WhyAygency() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-void section-padding">
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
            >
              <GlassCard>
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
