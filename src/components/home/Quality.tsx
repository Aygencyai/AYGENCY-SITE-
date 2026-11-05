"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

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

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
});

// Desktop: heading and ticks side by side, with the proof across the width below.
// Phone: heading, then the proof, then the ticks.
export default function Quality() {
  return (
    <section id="proof" className="blend-void section-padding">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_6fr] gap-x-20 items-start">
          <motion.div {...reveal()}>
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-cyan mb-5 lg:mb-6">{`// our standard`}</p>
            <h2 className="font-heading text-[2rem] sm:text-[2.5rem] md:text-[3rem] leading-[1.1] text-ghost uppercase font-semibold">
              Proven before it goes live. Proven again once it does.
            </h2>
            <p className="font-sans text-base lg:text-lg leading-[1.7] text-ghost-muted mt-5 lg:mt-6">
              Our quality bar is higher than most of the AI market, because an agent inside your
              business has to be right, not just impressive. No agent reaches your team until it
              has earned it.
            </p>
          </motion.div>

          <ol className="order-3 lg:order-none mt-14 lg:mt-0">
            {points.map((p, i) => (
              <motion.li
                key={p.title}
                {...reveal(i * 0.1)}
                className="relative grid grid-cols-[32px_1fr] gap-4 lg:gap-5 pb-7 lg:pb-9 last:pb-0"
              >
                {i < points.length - 1 && (
                  <span aria-hidden className="absolute left-[15.5px] top-8 bottom-0 w-px bg-cyan/40" />
                )}
                <span className="w-8 h-8 rounded-full border border-cyan flex items-center justify-center text-cyan">
                  <Check className="w-4 h-4" strokeWidth={2} />
                </span>
                <div className="pt-0.5">
                  <h3 className="font-heading text-lg lg:text-xl font-semibold text-white">{p.title}</h3>
                  <p className="font-sans text-[15px] lg:text-base leading-relaxed text-ghost-muted mt-1.5 lg:mt-2">
                    {p.body}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>

          <motion.div {...reveal(0.1)} className="order-2 lg:order-none lg:col-span-2 mt-12 lg:mt-24">
            <p className="font-heading text-[1.875rem] sm:text-[2.5rem] lg:text-[3.5rem] leading-[1.14] tracking-[-0.01em] font-medium text-ghost">
              A manual job that took <span className="text-white font-semibold whitespace-nowrap">4 hours</span> now takes{" "}
              <span className="text-cyan font-semibold whitespace-nowrap">12 minutes</span>, and someone on the team checks it
              before it goes anywhere.
            </p>
            {/* The two lengths, drawn to scale: 12 minutes is 5% of 4 hours. */}
            <div className="mt-8 lg:mt-12 space-y-3" aria-hidden>
              <div className="flex items-center gap-3">
                <span className="h-[3px] flex-1 bg-ghost/35" />
                <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-ghost-muted w-16 text-right">4 hrs</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex-1">
                  <span className="block h-[3px] w-[5%] bg-cyan" />
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-cyan w-16 text-right">12 min</span>
              </div>
            </div>
            <p className="font-sans text-base lg:text-lg leading-[1.7] text-ghost-muted mt-6 lg:mt-8">
              We’re able to save more than 100 hours of work per month.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
