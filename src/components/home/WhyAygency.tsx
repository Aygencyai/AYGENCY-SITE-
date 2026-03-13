"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const comparisons = [
  {
    title: "Hiring In-House",
    body: "6+ months to recruit. \u00A3150K+ per head. Still need to figure out what to build. By the time your team is assembled, we\u2019ve already shipped and iterated.",
  },
  {
    title: "Big Consultancies",
    body: "They\u2019ll charge you six figures for a strategy deck and a timeline measured in quarters. You\u2019ll get recommendations. We give you a working system.",
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
    <section className="bg-ivory-dark py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="font-serif text-[3rem] leading-[1.1] text-green uppercase"
        >
          Why Aygency, Not the Alternatives
        </motion.h2>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {comparisons.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: "easeOut",
              }}
              className="bg-ivory border border-ivory-dark rounded-lg p-8 pt-0 overflow-hidden"
            >
              <div className="h-[3px] bg-green -mx-8 mb-8" />
              <h3 className="font-serif text-2xl text-green">{item.title}</h3>
              <p className="font-sans text-base leading-relaxed text-green-muted mt-3">
                {item.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
