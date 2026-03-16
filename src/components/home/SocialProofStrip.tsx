"use client";

import { motion } from "framer-motion";

const industries = [
  "Hospitality",
  "Real Estate",
  "Digital Marketing",
  "Logistics",
  "Professional Services",
];

export default function SocialProofStrip() {
  return (
    <section className="bg-ivory py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="flex flex-wrap justify-center gap-3"
        >
          {industries.map((industry) => (
            <span
              key={industry}
              className="inline-block rounded-full border border-ivory-dark bg-ivory px-5 py-2 font-sans text-sm text-green-muted"
            >
              {industry}
            </span>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="font-sans text-sm text-muted mt-8 max-w-xl mx-auto"
        >
          Systems live in weeks. Running 24/7.
        </motion.p>
      </div>
    </section>
  );
}
