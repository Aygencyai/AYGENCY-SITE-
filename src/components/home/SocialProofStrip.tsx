"use client";

import { motion } from "framer-motion";
import { agents } from "@/lib/data";

const names = agents.map((a) => a.name);

function MarqueeTrack() {
  return (
    <div className="flex shrink-0 items-center" aria-hidden>
      {names.map((name) => (
        <div key={name} className="flex items-center">
          <span className="font-mono text-sm text-ghost-dim tracking-[0.18em] uppercase px-9">
            {name}
          </span>
          <span className="w-1 h-1 rounded-full bg-cyan/40 shrink-0" />
        </div>
      ))}
    </div>
  );
}

export default function SocialProofStrip() {
  return (
    <section className="bg-void py-9 md:py-11 border-y border-ghost/[0.06] overflow-hidden">
      {/* Marquee ticker: two identical tracks for a seamless loop */}
      <div className="relative">
        <div className="flex whitespace-nowrap marquee-scroll">
          <MarqueeTrack />
          <MarqueeTrack />
        </div>

        {/* Edge fades so names enter and leave cleanly */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-void to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-void to-transparent" />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="font-mono text-xs text-ghost-dim mt-7 text-center tracking-[0.18em] uppercase"
      >
        The Aygency System. Eight specialist agents, composed around your operation.
      </motion.p>
    </section>
  );
}
