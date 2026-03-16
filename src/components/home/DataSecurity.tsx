"use client";

import { motion } from "framer-motion";

export default function DataSecurity() {
  return (
    <section className="bg-ivory py-24 md:py-32">
      <div className="max-w-3xl mx-auto px-6 md:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="font-serif text-[3rem] leading-[1.1] text-green uppercase"
        >
          Your Data Stays Yours
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.05, ease: "easeOut" }}
          className="font-sans text-base leading-relaxed text-green-muted mt-6"
        >
          Every system we build operates inside your infrastructure. Your data
          never trains external models, never leaves your environment unless you
          say so. We build for businesses that take security seriously &mdash;
          because we do too.
        </motion.p>
      </div>
    </section>
  );
}
