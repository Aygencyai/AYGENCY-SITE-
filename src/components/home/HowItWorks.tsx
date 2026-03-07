"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Diagnose",
    description:
      "We get inside your operation and find what\u2019s costing you.",
  },
  {
    number: "02",
    title: "Design",
    description:
      "We architect the system — agents, data flows, integrations.",
  },
  {
    number: "03",
    title: "Build",
    description: "Full development, testing, and platform integration.",
  },
  {
    number: "04",
    title: "Go Live",
    description:
      "Agents operating in your environment, on your real data.",
  },
  {
    number: "05",
    title: "Get Smarter",
    description:
      "The system learns from every cycle. Month three beats month one.",
  },
];

export default function HowItWorks() {
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
          How It Works
        </motion.h2>

        {/* Desktop: horizontal layout */}
        <div ref={ref} className="hidden md:flex items-start mt-16 justify-between">
          {steps.map((step, i) => (
            <div key={step.number} className="flex items-start flex-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: i * 0.15,
                  ease: "easeOut",
                }}
                className="flex flex-col items-center text-center max-w-[200px] mx-auto"
              >
                <div className="w-12 h-12 rounded-full bg-green flex items-center justify-center mb-4">
                  <span className="font-sans text-sm font-semibold text-white">
                    {step.number}
                  </span>
                </div>
                <h3 className="font-sans text-lg font-semibold text-green">
                  {step.title}
                </h3>
                <p className="font-sans text-sm text-green-muted mt-2 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>

              {/* Connecting line */}
              {i < steps.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.15 + 0.3,
                    ease: "easeOut",
                  }}
                  className="h-px bg-ivory-dark flex-1 mt-6 origin-left mx-[-8px]"
                  style={{ minWidth: "24px" }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Mobile: vertical layout */}
        <div className="md:hidden mt-12 space-y-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: "easeOut",
              }}
              className="flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-green flex-shrink-0 flex items-center justify-center">
                <span className="font-sans text-sm font-semibold text-white">
                  {step.number}
                </span>
              </div>
              <div>
                <h3 className="font-sans text-lg font-semibold text-green">
                  {step.title}
                </h3>
                <p className="font-sans text-sm text-green-muted mt-1 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
