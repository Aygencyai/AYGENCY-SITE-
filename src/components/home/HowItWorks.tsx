"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
const steps = [
  {
    number: "01",
    title: "Uncover",
    description:
      "We sit inside your operation and surface what\u2019s actually costing you \u2014 the workflows nobody\u2019s measured, the manual processes everyone\u2019s accepted.",
  },
  {
    number: "02",
    title: "Architect",
    description:
      "We design the agent system \u2014 which agents, what each handles, how they coordinate, what data feeds them, and what decisions they make autonomously.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "Full development. Full integration with your platforms. Full testing against your real data.",
  },
  {
    number: "04",
    title: "Go Live",
    description:
      "Agents deployed into your environment, operating on live data, making real decisions. You\u2019ll see results in the first week.",
  },
  {
    number: "05",
    title: "Compound",
    description:
      "The system learns from every cycle, flags its own gaps, and improves without being told to. This is the part most companies never reach. We build it in from day one.",
  },
];

export default function HowItWorks() {
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
            {`// Engagement Model`}
          </p>
          <h2 className="font-heading text-[2rem] sm:text-[2.5rem] md:text-[3rem] leading-[1.1] text-ghost uppercase font-semibold">
            How It Works
          </h2>
        </motion.div>

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
