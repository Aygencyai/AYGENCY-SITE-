"use client";

import { motion } from "framer-motion";

export default function Problem() {
  return (
    <section className="bg-void section-padding">
      <div className="max-w-3xl mx-auto px-6 md:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-mono text-xs tracking-[0.2em] uppercase text-cyan mb-6"
        >
          {`// the problem`}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading text-[2rem] sm:text-[2.5rem] md:text-[3rem] leading-[1.1] text-ghost uppercase font-semibold"
        >
          The work that should run itself
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans text-lg leading-[1.7] text-ghost-muted mt-6"
        >
          Every operation has work that doesn&rsquo;t need a person &mdash; it needs a
          system. The reports built by hand. The follow-ups that slip. The data re-typed
          between tools. The decisions waiting on someone to find the time. It runs on
          people because the alternative used to be worse. It isn&rsquo;t anymore.
        </motion.p>
      </div>
    </section>
  );
}
