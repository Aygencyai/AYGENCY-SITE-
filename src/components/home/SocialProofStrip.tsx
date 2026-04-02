"use client";

import { motion } from "framer-motion";

const capabilities = [
  "Workflow Automation",
  "Revenue Agents",
  "AI Personal Assistants",
  "Data & Intelligence Agents",
  "Multi-Agent Orchestration",
  "Autonomous Departments",
  "Web Design & Development",
  "Creative Automation",
  "System Integration",
  "CEO Agent Architecture",
];

function MarqueeTrack() {
  return (
    <div className="flex shrink-0 gap-8">
      {capabilities.map((cap) => (
        <span key={cap} className="font-mono text-sm text-ghost-dim tracking-wider uppercase">
          {cap}
        </span>
      ))}
    </div>
  );
}

export default function SocialProofStrip() {
  return (
    <section className="bg-surface py-8 md:py-10 border-y border-ghost/[0.06] overflow-hidden">
      {/* Marquee ticker — two identical tracks for seamless loop */}
      <div className="relative">
        <div className="flex gap-8 whitespace-nowrap marquee-scroll">
          <MarqueeTrack />
          <MarqueeTrack />
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
