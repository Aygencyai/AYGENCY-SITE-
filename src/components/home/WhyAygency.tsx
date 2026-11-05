"use client";

import { motion } from "framer-motion";

const items = [
  {
    label: "Before we build",
    title: "Built around you.",
    body: "We come to where your information lives. Your team keeps the systems they know. We connect to them and take it from there.",
  },
  {
    label: "When it goes live",
    title: "Built to your standards.",
    body: "Every agent is trained on how your business does the work, so it fits in from its first day.",
  },
  {
    label: "Every month after",
    title: "Compounding, not depreciating.",
    body: "We operate every agent for you and stay on as your growth partners, finding the next bottleneck and clearing it. Each correction your team makes is remembered, so the system gets better the longer it runs.",
  },
];

// How far down the drawing each dot sits. The line in the SVG passes through these points.
const tops = [260, 176, 70];

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
});

export default function WhyAygency() {
  return (
    <section className="blend-surface section-padding overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <motion.h2
          {...reveal()}
          className="max-w-4xl font-heading text-[2rem] sm:text-[2.5rem] md:text-[3rem] leading-[1.1] text-ghost uppercase font-semibold"
        >
          Most AI agencies make you work for the system.
          <br />
          <span className="text-cyan">We make the system work for you.</span>
        </motion.h2>

        {/* Desktop: one line through all three stages, running off the page still climbing. */}
        <div className="hidden lg:block relative mt-16 h-[480px]">
          <svg
            viewBox="0 0 1000 480"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full overflow-visible"
            fill="none"
            aria-hidden
          >
            <defs>
              <linearGradient id="why-line" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1000" y2="0">
                <stop offset="0" stopColor="#00E5FF" stopOpacity="0.2" />
                <stop offset="1" stopColor="#00E5FF" />
              </linearGradient>
            </defs>
            <path
              d="M4 260C116 237.6 227 208.5 339 176S562 107 674 70 891 6 1000 -30 1200 -107 1300 -140 1700 -280 2000 -380"
              stroke="url(#why-line)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <ul className="absolute inset-0 grid grid-cols-3">
            {items.map((item, i) => (
              <motion.li
                key={item.title}
                {...reveal(0.2 + i * 0.12)}
                className="relative pr-10"
                style={{ paddingTop: tops[i] }}
              >
                <span
                  className="block rounded-full bg-cyan"
                  style={{ width: 9 + i * 4, height: 9 + i * 4, marginTop: -((9 + i * 4) / 2) }}
                />
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-cyan mt-4">{item.label}</p>
                <h3 className="font-heading text-xl font-semibold text-white leading-snug mt-2">{item.title}</h3>
                <p className="font-sans text-[15px] leading-relaxed text-ghost-muted mt-2">{item.body}</p>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Phone: the line runs down the side and fades out instead of stopping. */}
        <ol className="lg:hidden mt-9">
          {items.map((item, i) => (
            <li key={item.title} className="relative grid grid-cols-[24px_1fr] gap-4 pb-7">
              <span
                aria-hidden
                className={`absolute left-[11.5px] top-4 bottom-0 w-px ${
                  i < items.length - 1 ? "bg-cyan/50" : "bg-gradient-to-b from-cyan/50 to-transparent"
                }`}
              />
              <span className="flex justify-center pt-1">
                <span className="block rounded-full bg-cyan" style={{ width: 8 + i * 4, height: 8 + i * 4 }} />
              </span>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-cyan">{item.label}</p>
                <h3 className="font-heading text-lg font-semibold text-white leading-snug mt-1.5">{item.title}</h3>
                <p className="font-sans text-[15px] leading-relaxed text-ghost-muted mt-1.5">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
