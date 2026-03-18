"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";

const serviceCards = [
  {
    title: "Diagnose & Design",
    description:
      "We go inside your operation. We map the real workflows, find the highest-cost bottlenecks, and architect a system of agents purpose-built for your specific problems.",
  },
  {
    title: "Build & Ship",
    description:
      "We build the full system and put it live in your environment \u2014 connected to your platforms, reading your data, and making decisions from day one. A fully working production system.",
  },
  {
    title: "Run & Compound",
    description:
      "We don\u2019t hand you a system and walk away. We monitor performance, handle edge cases, and expand coverage. Month three outperforms month one. Month six makes month three look like a trial run.",
  },
];

export default function Services() {
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
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-cyan mb-4">
            {`// Our Process`}
          </p>
          <h2 className="font-heading text-[3rem] leading-[1.1] text-ghost uppercase font-semibold">
            What We Build
          </h2>
        </motion.div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {serviceCards.map((card, i) => (
            <motion.div
              key={card.title}
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
                  {card.title}
                </h3>
                <p className="font-sans text-base leading-relaxed text-ghost-muted mt-3">
                  {card.description}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
