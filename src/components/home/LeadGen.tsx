"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Radar, Send, ArrowRight } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

const stages = [
  {
    step: "01",
    icon: Radar,
    label: "Lead Gen",
    title: "It finds the business you’re missing",
    body: "Your next customer is already out there, leaving signals. A company that just raised, a business hiring fast, an account showing real buying intent. The Lead Gen agent watches for those signals across your market and the open web, finds the right people behind them, and enriches every lead with the context that actually matters. Then it scores them, so what lands in your pipeline is prospects worth talking to, not a list to grind through.",
  },
  {
    step: "02",
    icon: Send,
    label: "Outreach",
    title: "It turns them into conversations that close",
    body: "Then the Outreach agent goes to work, and not with a blast. Every message is built for the person reading it: who they are, what they care about, why this matters to them now. We pour real work into the psychology of how it opens, how it follows up, how it reads and handles a reply, all so more of those conversations become meetings, and more of those meetings become revenue.",
  },
];

export default function LeadGen() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <section className="bg-surface section-padding">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-mono text-xs tracking-[0.2em] uppercase text-cyan mb-6"
          >
            {`// new business`}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading text-[2rem] sm:text-[2.5rem] md:text-[3rem] leading-[1.1] text-ghost uppercase font-semibold"
          >
            Find new prospects. Turn them into high-value opportunities.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans text-lg leading-[1.7] text-ghost-muted mt-6"
          >
            Two agents run your new business as one engine. One finds the opportunities,
            the other turns them into revenue, around the clock and without anyone having
            to remember to do it.
          </motion.p>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14">
          {stages.map((stage, i) => {
            const Icon = stage.icon;
            return (
              <motion.div
                key={stage.step}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                <GlassCard tilt={false} className="h-full">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-cyan/[0.08] border border-cyan/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-cyan" strokeWidth={1.5} />
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-sm text-cyan">{stage.step}</span>
                      <span className="font-mono text-[11px] uppercase tracking-wider text-ghost-dim">
                        {stage.label}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-white mt-5">
                    {stage.title}
                  </h3>
                  <p className="font-sans text-base leading-relaxed text-ghost-muted mt-3">
                    {stage.body}
                  </p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between"
        >
          <p className="font-sans text-lg leading-[1.7] text-ghost max-w-2xl">
            It runs every day and finds more than a desk of people could. The better it
            gets at finding and closing, the more revenue it puts on the table. That is
            where the real value lives.
          </p>
          <Link
            href="/services/revenue-operations"
            className="inline-flex items-center gap-2 font-heading text-[13px] font-semibold uppercase tracking-[0.15em] text-cyan transition-colors hover:text-cyan-muted whitespace-nowrap"
          >
            See the revenue system
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
