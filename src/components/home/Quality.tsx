"use client";

import { motion } from "framer-motion";

const points = [
  {
    title: "Built on your history.",
    body: "We build and test every agent against your own historical data, so it learns how the work is really done in your business.",
  },
  {
    title: "Stress-tested for accuracy.",
    body: "We push each agent with altered and unusual data until we can show it holds up.",
  },
  {
    title: "Hundreds of edge cases, covered.",
    body: "Before anything goes live, we test it against the real-world exceptions an operation throws at it.",
  },
  {
    title: "Fast to deliver, fast to run.",
    body: "Deep hands-on experience with agents and the tools behind them means we ship quickly, and the agents run lean.",
  },
];

const results = [
  { stat: "100+ hours", label: "of work saved by a single agent" },
  { stat: "4 hours to 12 minutes", label: "a complex weekly workflow, rebuilt with autonomous agents" },
];

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
});

// Quality and results in one section: the testing first, then the numbers that prove it.
export default function Quality() {
  return (
    <section id="proof" className="blend-void section-padding">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <motion.div {...reveal()} className="max-w-3xl">
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-cyan mb-6">{`// our standard`}</p>
          <h2 className="font-heading text-[2rem] sm:text-[2.5rem] md:text-[3rem] leading-[1.1] text-ghost uppercase font-semibold">
            Proven before it goes live. Proven again once it does.
          </h2>
          <p className="font-sans text-lg leading-[1.7] text-ghost-muted mt-6">
            Our quality bar is higher than most of the AI market, because an agent inside your
            business has to be right, not just impressive. No agent reaches your team until it
            has earned it.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {points.map((p, i) => (
            <motion.div key={p.title} {...reveal(i * 0.08)} className="border-t border-cyan/30 pt-5">
              <h3 className="font-heading text-lg font-semibold text-white">{p.title}</h3>
              <p className="font-sans text-sm leading-relaxed text-ghost-muted mt-2">{p.body}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14">
          {results.map((r, i) => (
            <motion.div
              key={r.stat}
              {...reveal(i * 0.1)}
              className="rounded-2xl border border-cyan/25 bg-cyan/[0.04] p-8 md:p-10"
            >
              <p className="font-heading text-4xl sm:text-5xl font-bold text-cyan leading-none">{r.stat}</p>
              <p className="font-mono text-sm uppercase tracking-[0.18em] text-ghost mt-4">{r.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.p {...reveal(0.2)} className="font-sans text-lg leading-[1.7] text-ghost mt-12 max-w-2xl">
          That&rsquo;s the standard every Aygency agent is built to. As you grow, you add
          agents, not overheads.
        </motion.p>
      </div>
    </section>
  );
}
