"use client";

import SectionContainer from "@/components/ui/SectionContainer";
import Reveal from "@/components/ui/Reveal";

const painLines = [
  "Your team is drowning in repetitive tasks.",
  "Your leads are slipping through cracks.",
  "Your data sits in silos nobody can read.",
  "You\u2019ve been told AI can help \u2014 but every conversation ends with a proposal, not a product.",
];

export default function PainPoint() {
  return (
    <section className="bg-primary section-padding">
      <SectionContainer>
        <div className="max-w-3xl mx-auto text-center">
          {painLines.map((line, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <p className="font-body text-xl md:text-2xl text-text-secondary leading-relaxed mb-4">
                {line}
              </p>
            </Reveal>
          ))}

          <Reveal delay={0.5}>
            <p className="font-heading font-semibold text-3xl md:text-4xl text-text-primary mt-12">
              We&rsquo;re different.
            </p>
          </Reveal>

          <Reveal delay={0.6}>
            <div className="w-16 h-1 bg-accent rounded-full mx-auto mt-4" />
          </Reveal>
        </div>
      </SectionContainer>
    </section>
  );
}
