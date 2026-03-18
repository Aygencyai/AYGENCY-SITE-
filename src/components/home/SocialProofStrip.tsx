"use client";

import { motion } from "framer-motion";

const industries = [
  "Hospitality",
  "Real Estate",
  "Digital Marketing",
  "Logistics",
  "Professional Services",
];

export default function SocialProofStrip() {
  const marqueeItems = [...industries, ...industries, ...industries, ...industries];

  return (
    <section className="bg-surface py-8 md:py-10 border-y border-ghost/[0.06] overflow-hidden">
      {/* Marquee ticker */}
      <div className="relative">
        <div
          className="flex gap-8 whitespace-nowrap"
          style={{
            animation: "marquee 30s linear infinite",
            width: "fit-content",
          }}
        >
          {marqueeItems.map((industry, i) => (
            <span key={`${industry}-${i}`} className="flex items-center gap-8">
              <span className="font-mono text-sm text-ghost-dim tracking-wider uppercase">
                {industry}
              </span>
              <span className="text-cyan/40 text-xs">&#x2022;</span>
            </span>
          ))}
        </div>
      </div>

      {/* Systems live text */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="font-mono text-xs text-ghost-dim mt-6 text-center tracking-wider uppercase"
      >
        Systems live in weeks. Running 24/7.
      </motion.p>
    </section>
  );
}
