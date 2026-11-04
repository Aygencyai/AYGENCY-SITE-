"use client";

import { motion } from "framer-motion";

const results = [
  {
    stat: "100+ hours",
    label: "saved by one agent",
    body: "A single agent we deployed has saved one business over 100 hours of work.",
  },
  {
    stat: "4h → 12m",
    label: "4 hours of weekly work, now 12 minutes",
    body: "A complex workflow that took about 4 hours every week, rebuilt with autonomous agents. It now gets done in about 12 minutes.",
  },
];

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
});

export default function Proof() {
  return (
    <section id="proof" className="blend-void section-padding">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <motion.div {...reveal()} className="max-w-3xl">
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-cyan mb-6">{`// proof of work`}</p>
          <h2 className="font-heading text-[2rem] sm:text-[2.5rem] md:text-[3rem] leading-[1.1] text-ghost uppercase font-semibold">
            Results from live businesses.
          </h2>
          <p className="font-sans text-lg leading-[1.7] text-ghost-muted mt-6">
            Not demos or projections. These are agents running inside real businesses today,
            and Aygency runs on the same agents we build for you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14">
          {results.map((r, i) => (
            <motion.div
              key={r.stat}
              {...reveal(i * 0.1)}
              className="rounded-2xl border border-cyan/25 bg-cyan/[0.04] p-8 md:p-10"
            >
              <p className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-cyan leading-none">{r.stat}</p>
              <p className="font-mono text-sm uppercase tracking-[0.18em] text-ghost mt-4">{r.label}</p>
              <p className="font-sans text-base leading-relaxed text-ghost-muted mt-4">{r.body}</p>
            </motion.div>
          ))}
        </div>

        <motion.p {...reveal(0.2)} className="font-sans text-lg leading-[1.7] text-ghost mt-12 max-w-2xl">
          Every lesson from those builds goes straight into yours. As you grow, you add
          agents, not overheads.
        </motion.p>
      </div>
    </section>
  );
}
