"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import GlowOrb from "@/components/effects/GlowOrb";

export default function DataSecurity() {
  return (
    <section className="bg-void section-padding relative overflow-hidden">
      <GlowOrb
        size={400}
        opacity={0.06}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        parallaxStrength={15}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <Shield className="w-8 h-8 text-cyan" strokeWidth={1.5} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading text-[3rem] leading-[1.1] text-ghost uppercase font-semibold"
        >
          Your Data Stays Yours
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans text-base leading-relaxed text-ghost-muted mt-6"
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
