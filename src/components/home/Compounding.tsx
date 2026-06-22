"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const beats = [
  { when: "Day one", what: "the system runs the workflow." },
  { when: "Month three", what: "it runs it better than any person could." },
  { when: "Month six", what: "it surfaces opportunities no one asked it to find." },
];

export default function Compounding() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-surface section-padding">
      <div className="max-w-3xl mx-auto px-6 md:px-8 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-mono text-xs tracking-[0.2em] uppercase text-cyan mb-6"
        >
          {`// the compounding effect`}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading text-[2rem] sm:text-[2.5rem] md:text-[3rem] leading-[1.1] text-ghost uppercase font-semibold"
        >
          Depreciating cost. Appreciating value.
        </motion.h2>

        <div ref={ref} className="mt-12 space-y-4 text-left max-w-md mx-auto">
          {beats.map((beat, i) => (
            <motion.div
              key={beat.when}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-baseline gap-4"
            >
              <span className="font-mono text-sm text-cyan whitespace-nowrap min-w-[110px]">
                {beat.when}
              </span>
              <span className="font-sans text-base text-ghost-muted">{beat.what}</span>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans text-base leading-relaxed text-ghost-muted mt-12"
        >
          That climb is the system&rsquo;s own doing. An agent learns from every cycle
          and gets sharper on its own, without being told to. We operate it to keep that
          learning safe and pointed at the right things, and we keep tuning it as you go.
          The cost stays flat. The value keeps climbing.
        </motion.p>
      </div>
    </section>
  );
}
