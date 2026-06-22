"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { agents } from "@/lib/data";

export default function SystemTeaser() {
  return (
    <section className="blend-void section-padding">
      <div className="max-w-5xl mx-auto px-6 md:px-8 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-mono text-xs tracking-[0.2em] uppercase text-cyan mb-6"
        >
          {`// the aygency system`}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading text-[2rem] sm:text-[2.5rem] md:text-[3rem] leading-[1.1] text-ghost uppercase font-semibold"
        >
          Eight agents. Any system your operation needs.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans text-lg leading-[1.7] text-ghost-muted mt-6 max-w-2xl mx-auto"
        >
          We didn&rsquo;t build a different agency for every client. We handpicked eight
          agents that, between them, cover what almost any business needs to run and grow.
          They&rsquo;re the template we design from.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans text-lg leading-[1.7] text-ghost-muted mt-5 max-w-2xl mx-auto"
        >
          From those eight we compose your system. Sometimes one, often several, each one
          tailored to the workflows you actually run. Start with the few that move the
          needle first and add the rest as they earn their place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-10 flex flex-wrap justify-center gap-2.5"
        >
          {agents.map((agent) => (
            <Link
              key={agent.name}
              href={`/system#${agent.name.toLowerCase().replace(/\s+/g, "-")}`}
              className={`font-mono text-xs uppercase tracking-wider rounded px-3 py-1.5 border transition-colors ${
                agent.group === "ceo"
                  ? "border-cyan/50 text-cyan bg-cyan/[0.06] hover:bg-cyan/[0.12]"
                  : "border-ghost/15 text-ghost-muted hover:border-cyan/40 hover:text-cyan"
              }`}
            >
              {agent.name}
            </Link>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="font-sans text-sm leading-relaxed text-ghost-dim mt-8 max-w-xl mx-auto"
        >
          Need something none of the eight cover? We either fold the capability into one of
          them or build you a new agent on request. The eight are where we start, not the
          ceiling.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10"
        >
          <Link
            href="/system"
            className="inline-flex items-center gap-2 font-heading text-[13px] font-semibold uppercase tracking-[0.15em] text-cyan transition-colors hover:text-cyan-muted"
          >
            Explore the system
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
