"use client";

import { Hammer, Zap, TrendingUp } from "lucide-react";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const pillars = [
  {
    icon: Hammer,
    title: "Operators, Not Consultants",
    description:
      "We write the code. We deploy the agents. We own the outcome until it\u2019s delivering results.",
  },
  {
    icon: Zap,
    title: "Weeks, Not Months",
    description:
      "Our first deployable system ships in weeks. Because your competition isn\u2019t waiting for your vendor to finish scoping.",
  },
  {
    icon: TrendingUp,
    title: "ROI-Obsessed",
    description:
      "Every agent we build has a measurable impact on your bottom line. If it doesn\u2019t move your numbers, we don\u2019t build it.",
  },
];

export default function BrandPillars() {
  return (
    <section className="bg-secondary section-padding">
      <SectionContainer>
        <SectionHeading
          eyebrow="Why Aygency"
          heading="Built to deliver, not to advise"
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {pillars.map((pillar, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <div className="bg-primary p-8 md:p-10 border border-border-light rounded-2xl hover:shadow-card-hover hover:-translate-y-[2px] transition-all duration-300">
                <div className="w-14 h-14 bg-accent-light rounded-xl flex items-center justify-center">
                  <pillar.icon size={32} className="text-accent" />
                </div>
                <h3 className="font-heading font-semibold text-xl text-text-primary mt-6">
                  {pillar.title}
                </h3>
                <p className="font-body text-text-secondary mt-3">
                  {pillar.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}
