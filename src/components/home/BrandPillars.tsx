"use client";

import { Hammer, Zap, TrendingUp } from "lucide-react";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";

const pillars = [
  {
    icon: Hammer,
    title: "We Build and Run It",
    description:
      "This isn\u2019t consulting. We write the code, deploy the system, and stay on until it\u2019s operating on its own.",
  },
  {
    icon: Zap,
    title: "Live in Weeks",
    description:
      "Your first system ships in weeks, not quarters. We scope tight and move fast.",
  },
  {
    icon: TrendingUp,
    title: "Gets Better Over Time",
    description:
      "Most things a business buys depreciate. Our systems go the other direction \u2014 they learn, adapt, and find value you didn\u2019t brief them on.",
  },
];

export default function BrandPillars() {
  return (
    <section className="bg-secondary section-padding">
      <SectionContainer>
        <SectionHeading
          eyebrow="Why Aygency"
          heading="Why clients work with us"
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {pillars.map((pillar, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <TiltCard>
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
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}
