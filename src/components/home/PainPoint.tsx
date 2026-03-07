"use client";

import { motion } from "framer-motion";
import SectionContainer from "@/components/ui/SectionContainer";

const painLines = [
  "Ten hours a week on procurement that could be automated.",
  "Leads sitting in a CRM that nobody follows up on time.",
  "Reports compiled by hand from three different spreadsheets.",
  "You know AI should be handling this. You just haven\u2019t found someone who actually builds it.",
];

const lineVariants = {
  hidden: { y: "100%" },
  visible: {
    y: "0%",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function PainPoint() {
  return (
    <section className="bg-primary section-padding">
      <SectionContainer>
        <div className="max-w-3xl mx-auto text-center">
          {painLines.map((line, i) => (
            <div key={i} className="overflow-hidden mb-4">
              <motion.p
                variants={lineVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.15 }}
                className="font-body text-xl md:text-2xl text-text-secondary leading-relaxed"
              >
                {line}
              </motion.p>
            </div>
          ))}

          <div className="overflow-hidden mt-12">
            <motion.p
              variants={lineVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.6 }}
              className="font-heading font-semibold text-3xl md:text-4xl text-text-primary"
            >
              That&rsquo;s where we come in.
            </motion.p>
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.6,
              delay: 0.75,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="w-16 h-1 bg-accent rounded-full mx-auto mt-4 origin-left"
          />
        </div>
      </SectionContainer>
    </section>
  );
}
