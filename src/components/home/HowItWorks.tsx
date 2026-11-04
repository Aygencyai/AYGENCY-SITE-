"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
const steps = [
  {
    number: "01",
    title: "Learn",
    description:
      "We go into your business and learn how it really runs: the workflows, the handoffs and the exact points where things slow down.",
  },
  {
    number: "02",
    title: "Design",
    description:
      "We design agents around those workflows. Each one has a clear job and works like a dedicated employee, only faster and to a higher standard.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "We build every agent and connect it to the tools and data you already use. You see the system come together, piece by piece.",
  },
  {
    number: "04",
    title: "Slot in",
    description:
      "It goes live inside the way you already work, so the day-to-day carries on as normal. You approve anything high-impact from one command centre.",
  },
  {
    number: "05",
    title: "Improve",
    description:
      "From there we operate it for as long as you run it. It sharpens every cycle, we keep tuning it, and we add agents as the business grows.",
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="blend-surface section-padding">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-heading text-[2rem] sm:text-[2.5rem] md:text-[3rem] leading-[1.1] text-ghost uppercase font-semibold">
            How It Works
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans text-lg leading-[1.7] text-ghost-muted mt-5 max-w-2xl"
        >
          From the first call to agents working inside your business, here is the path.
          Five steps, and we carry the work the whole way.
        </motion.p>

        {/* Desktop: horizontal layout */}
        <div ref={ref} className="hidden md:flex items-start mt-16 justify-between">
          {steps.map((step, i) => (
            <div key={step.number} className="flex items-start flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.7,
                  delay: i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex flex-col items-center text-center max-w-[200px] mx-auto"
              >
                <div className="w-12 h-12 rounded-full bg-void-light/60 backdrop-blur-sm border border-cyan/20 flex items-center justify-center mb-4">
                  <span className="font-mono text-sm font-medium text-cyan">
                    {step.number}
                  </span>
                </div>
                <h3 className="font-heading text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="font-sans text-sm text-ghost-muted mt-2 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>

              {/* Connecting line */}
              {i < steps.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.12 + 0.3,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="h-px flex-1 mt-6 origin-left mx-[-8px]"
                  style={{
                    minWidth: "24px",
                    background: "linear-gradient(90deg, rgba(0,229,255,0.3), rgba(0,229,255,0.05))",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Mobile: vertical timeline */}
        <div className="md:hidden mt-12 space-y-0">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex items-start gap-4 relative pl-8 pb-8"
            >
              {/* Vertical dashed line */}
              {i < steps.length - 1 && (
                <div className="absolute left-[23px] top-12 bottom-0 border-l border-dashed border-cyan/20" />
              )}
              <div className="w-12 h-12 rounded-full bg-void-light/60 backdrop-blur-sm border border-cyan/20 flex-shrink-0 flex items-center justify-center relative z-10">
                <span className="font-mono text-sm font-medium text-cyan">
                  {step.number}
                </span>
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="font-sans text-sm text-ghost-muted mt-1 leading-relaxed">
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
