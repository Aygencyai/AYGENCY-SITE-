"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
const steps = [
  {
    number: "01",
    title: "Prescribe",
    description:
      "We show you what a business like yours runs and prescribe the agents that fit. No blank page, no menu to self-architect.",
  },
  {
    number: "02",
    title: "Tailor",
    description:
      "We configure what each agent does inside your operation: what it reads, what it writes, what it decides. You see the whole system before we build.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "We build every agent and connect it to your live tools and data. You watch it come together.",
  },
  {
    number: "04",
    title: "Deploy",
    description:
      "The system goes live in your environment, on real data, making real decisions. Results in the first weeks.",
  },
  {
    number: "05",
    title: "Compound",
    description:
      "We operate it from here. It learns every cycle, we tune it, and it gets more valuable the longer it runs.",
  },
];

export default function HowItWorks() {
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
