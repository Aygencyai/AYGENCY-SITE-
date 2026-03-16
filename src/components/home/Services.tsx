"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

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
    <section className="bg-ivory py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="font-serif text-[3rem] leading-[1.1] text-green uppercase"
        >
          What We Build
        </motion.h2>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {serviceCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: "easeOut",
              }}
              whileHover={{ y: -4 }}
              className="bg-ivory border border-ivory-dark rounded-lg p-8 pt-0 overflow-hidden transition-all duration-300 hover:shadow-card-hover"
            >
              <div className="h-[3px] bg-green -mx-8 mb-8" />
              <h3 className="font-serif text-2xl text-green">{card.title}</h3>
              <p className="font-sans text-base leading-relaxed text-green-muted mt-3">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
