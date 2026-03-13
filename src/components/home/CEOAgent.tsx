"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function CEOAgent() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-ivory py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="font-serif text-[3rem] leading-[1.1] text-green uppercase"
        >
          Every System Comes With a CEO
        </motion.h2>

        <div ref={ref} className="max-w-3xl mt-12 space-y-5">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="font-sans text-base leading-relaxed text-green-muted"
          >
            Every agent system we build includes something most companies
            don&rsquo;t even know to ask for. We call it the CEO Agent. It sits
            above every other agent in your system, receives their data in real
            time, and does what a great CEO does &mdash; looks across the entire
            operation, spots the patterns no single department can see, and finds
            the opportunities nobody briefed it to find.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="font-sans text-base leading-relaxed text-green-muted"
          >
            Your workflow agents reduce costs. Your CEO agent finds revenue. It
            identifies which customer segments are quietly growing, which
            operational changes would unlock capacity, which pricing adjustments
            would land, and which processes are creating bottlenecks that ripple
            across your whole business.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="font-sans text-base leading-relaxed text-green-muted"
          >
            This isn&rsquo;t a dashboard. It&rsquo;s not a report you read on
            Monday morning. It&rsquo;s an agent that thinks about your business
            the way you do &mdash; except it never stops, it sees everything,
            and it doesn&rsquo;t have blind spots.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="font-sans text-sm font-medium tracking-wide uppercase text-green mt-4"
          >
            Included with every system we build. No add-on. No upgrade tier.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
