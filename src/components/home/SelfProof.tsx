"use client";

import { motion } from "framer-motion";

export default function SelfProof() {
  return (
    <section className="bg-surface section-padding">
      <div className="max-w-3xl mx-auto px-6 md:px-8 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-mono text-xs tracking-[0.2em] uppercase text-cyan mb-6"
        >
          {`// we run on this`}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading text-[2rem] sm:text-[2.5rem] md:text-[3rem] leading-[1.1] text-ghost uppercase font-semibold"
        >
          We run Aygency on these agents
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans text-lg leading-[1.7] text-ghost-muted mt-6"
        >
          You&rsquo;re not our experiment. We operate Aygency itself on the same systems
          we&rsquo;d build for you &mdash; our outreach, our research, our reporting. The
          agents we&rsquo;d put to work in your operation are the ones already running
          ours.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-sm tracking-wide uppercase text-cyan mt-6"
        >
          We don&rsquo;t sell AI. We deploy it &mdash; starting with our own company.
        </motion.p>
      </div>
    </section>
  );
}
