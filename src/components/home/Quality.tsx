"use client";

import { motion } from "framer-motion";

const points = [
  {
    title: "Trained on your history",
    body: "We build and test every agent against your historical data, so it learns how the work is actually done in your business, not in theory.",
  },
  {
    title: "Proven accurate",
    body: "We stress-test each agent with altered and unusual data until we can show it stays accurate.",
  },
  {
    title: "Edge cases covered",
    body: "Before anything goes live, it is tested against the hundreds of edge cases a real operation throws up.",
  },
  {
    title: "Fast to deliver, fast to run",
    body: "Deep hands-on experience with agents and the tools behind them means we deliver quickly, and the agents run lean. That is how 4 hours becomes 12 minutes.",
  },
];

export default function Quality() {
  return (
    <section className="blend-surface section-padding">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-cyan mb-6">{`// why the results are real`}</p>
          <h2 className="font-heading text-[2rem] sm:text-[2.5rem] md:text-[3rem] leading-[1.1] text-ghost uppercase font-semibold">
            Built properly. Proven before it goes live.
          </h2>
          <p className="font-sans text-lg leading-[1.7] text-ghost-muted mt-6">
            Our quality bar is higher than most of the AI market. No agent reaches your
            business until it has earned it.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {points.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="border-t border-cyan/30 pt-5"
            >
              <h3 className="font-heading text-lg font-semibold text-white">{p.title}</h3>
              <p className="font-sans text-sm leading-relaxed text-ghost-muted mt-2">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
