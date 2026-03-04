"use client";

import { useRef, useEffect, useState } from "react";
import {
  useInView,
  useMotionValue,
  useSpring,
  motion,
} from "framer-motion";
import SectionContainer from "@/components/ui/SectionContainer";
import { metrics } from "@/lib/data";

function AnimatedCounter({
  value,
  suffix,
  hasPlus,
}: {
  value: number;
  suffix?: string;
  hasPlus: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 1500, bounce: 0 });
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      setDisplay(Math.round(latest).toString());
    });
    return unsubscribe;
  }, [spring]);

  return (
    <span ref={ref}>
      {display}
      {hasPlus && "+"}
      {suffix && suffix}
    </span>
  );
}

export default function Metrics() {
  return (
    <section className="bg-bg-dark py-16 md:py-20">
      <SectionContainer>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {metrics.map((metric) => {
            const hasPlus = metric.value.includes("+");
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6 }}
              >
                <p className="font-heading font-semibold text-4xl md:text-5xl text-white">
                  <AnimatedCounter
                    value={metric.numericValue}
                    suffix={metric.suffix}
                    hasPlus={hasPlus}
                  />
                </p>
                <p className="font-body text-sm text-white/70 mt-2">
                  {metric.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </SectionContainer>
    </section>
  );
}
