"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { processSteps } from "@/lib/data";

export default function Process() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 60%", "end 60%"],
  });

  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="bg-primary section-padding">
      <SectionContainer>
        <SectionHeading
          eyebrow="How We Work"
          heading="How every engagement works"
          align="center"
        />

        <div ref={timelineRef} className="relative mt-16 max-w-2xl mx-auto">
          {/* Centre line — animated */}
          <motion.div
            className="absolute left-[24px] md:left-1/2 md:-translate-x-1/2 w-px bg-green-light/40 top-0 bottom-0 origin-top"
            style={{ scaleY: prefersReducedMotion ? 1 : lineScaleY }}
          />
          {/* Static background line */}
          <div className="absolute left-[24px] md:left-1/2 md:-translate-x-1/2 w-px bg-border top-0 bottom-0" />

          {processSteps.map((step, i) => (
            <Reveal key={step.number} delay={i * 0.15}>
              <div className="relative flex items-start gap-6 mb-12 last:mb-0 md:grid md:grid-cols-[1fr_48px_1fr] md:gap-0 md:items-start">
                {/* Desktop left content (odd steps) */}
                <div
                  className={`hidden md:block ${
                    i % 2 === 0 ? "text-right pr-8" : ""
                  }`}
                >
                  {i % 2 === 0 && (
                    <>
                      <h3 className="font-heading font-semibold text-xl text-text-primary">
                        {step.title}
                      </h3>
                      <p className="font-body text-text-secondary mt-2 leading-relaxed">
                        {step.description}
                      </p>
                    </>
                  )}
                </div>

                {/* Circle — spring animation */}
                <div className="flex-shrink-0 md:flex md:justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      delay: 0.1,
                    }}
                    className="w-12 h-12 rounded-full bg-accent-light border-2 border-accent flex items-center justify-center relative z-10"
                  >
                    <span className="font-heading font-semibold text-accent text-sm">
                      {step.number}
                    </span>
                  </motion.div>
                </div>

                {/* Mobile content (always visible on mobile) */}
                <div className="md:hidden">
                  <h3 className="font-heading font-semibold text-xl text-text-primary">
                    {step.title}
                  </h3>
                  <p className="font-body text-text-secondary mt-2 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Desktop right content (even steps) */}
                <div
                  className={`hidden md:block ${
                    i % 2 === 1 ? "pl-8" : ""
                  }`}
                >
                  {i % 2 === 1 && (
                    <>
                      <h3 className="font-heading font-semibold text-xl text-text-primary">
                        {step.title}
                      </h3>
                      <p className="font-body text-text-secondary mt-2 leading-relaxed">
                        {step.description}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}
