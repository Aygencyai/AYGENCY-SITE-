"use client";

import { motion } from "framer-motion";
import SectionContainer from "@/components/ui/SectionContainer";
import { CountUp } from "@/components/ui/CountUp";

const metricsData = [
  { target: 12, suffix: "+", label: "Agents Deployed" },
  { target: 3, suffix: "wk", label: "Avg. Deployment Time" },
  { target: 80, suffix: "%", label: "Reduction in Procurement Time" },
  { target: 5, suffix: "+", label: "Industries Served" },
];

export default function Metrics() {
  return (
    <section className="animated-gradient-dark py-16 md:py-20">
      <SectionContainer>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {metricsData.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <p className="font-heading font-semibold text-4xl md:text-5xl text-white">
                <CountUp target={metric.target} suffix={metric.suffix} />
              </p>
              <p className="font-body text-sm text-white/70 mt-2">
                {metric.label}
              </p>
            </motion.div>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}
