"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Target, Workflow, TrendingUp, type LucideIcon } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

const facets: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Target,
    title: "Our pipeline",
    body: "The leads we chase and the outreach that wins them run on Lead Gen and Outreach. It is the same engine we would build into your new business.",
  },
  {
    icon: Workflow,
    title: "Our operations",
    body: "The reporting, the follow-ups, and the day-to-day admin that keep Aygency moving run on the operation core, around the clock.",
  },
  {
    icon: TrendingUp,
    title: "How we scale",
    body: "Running on our own system is how a small team does the work of a much bigger one. That is the whole point, proven on us first.",
  },
];

export default function SelfProof() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <section className="bg-void section-padding">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading text-[2rem] sm:text-[2.5rem] md:text-[3rem] leading-[1.1] text-ghost uppercase font-semibold"
          >
            The exact same pipelines run Aygency
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans text-lg leading-[1.7] text-ghost-muted mt-6"
          >
            The lead generation, the outreach, and the operations that keep Aygency
            running are the same pipelines we build for clients. We built them to run our
            own company first, and we spent a long time getting them right.
          </motion.p>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
          {facets.map((facet, i) => {
            const Icon = facet.icon;
            return (
              <motion.div
                key={facet.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                <GlassCard tilt={false} className="h-full">
                  <div className="w-10 h-10 rounded-lg bg-cyan/[0.08] border border-cyan/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-cyan" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-white mt-5">
                    {facet.title}
                  </h3>
                  <p className="font-sans text-base leading-relaxed text-ghost-muted mt-3">
                    {facet.body}
                  </p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans text-lg leading-[1.7] text-ghost mt-14"
          >
            Every lesson we learned getting it right for ourselves, every edge case and
            every improvement, is expertise we carry straight into your build. We perfected
            it on our own business so we can get yours right faster.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-sm tracking-wide uppercase text-cyan mt-8"
          >
            We don&rsquo;t sell AI. We deploy it, starting with our own company.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
