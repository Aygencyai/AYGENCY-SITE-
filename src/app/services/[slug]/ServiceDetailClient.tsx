"use client";

import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import MagneticButton from "@/components/ui/MagneticButton";
import type { Service } from "@/types";

const numberMap: Record<string, string> = {
  "cost-reduction": "01",
  "revenue-operations": "02",
  intelligence: "03",
  "full-department": "04",
};

export default function ServiceDetailClient({
  service,
}: {
  service: Service;
}) {
  return (
    <>
      {/* A. Hero */}
      <section className="bg-void pt-32 pb-20">
        <SectionContainer>
          <div className="max-w-3xl">
            <Reveal>
              <p className="text-cyan font-mono text-xs tracking-[0.2em] uppercase mb-4">
                {numberMap[service.slug] ?? "01"} — {service.shortTitle}
              </p>
              <h1 className="font-heading text-ghost text-4xl md:text-5xl lg:text-6xl leading-tight uppercase font-semibold">
                {service.title}
              </h1>
              <p className="text-ghost-muted font-sans text-lg md:text-xl leading-relaxed mt-6">
                {service.longDescription}
              </p>
            </Reveal>
          </div>
        </SectionContainer>
      </section>

      {/* B. The Problem */}
      <section className="bg-surface section-padding">
        <SectionContainer>
          <div className="max-w-3xl">
            <Reveal>
              <SectionHeading
                eyebrow="The Problem"
                heading="Why this matters"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-sans text-ghost-muted text-lg leading-relaxed">
                {service.problem}
              </p>
            </Reveal>
          </div>
        </SectionContainer>
      </section>

      {/* C. Our Approach */}
      <section className="bg-void section-padding">
        <SectionContainer>
          <Reveal>
            <SectionHeading
              eyebrow="Our Approach"
              heading="How we build it"
              align="center"
            />
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            {service.approach.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.1}>
                <GlassCard>
                  <p className="text-cyan font-mono text-xs">
                    Step {i + 1}
                  </p>
                  <h3 className="font-heading text-lg font-semibold text-white mt-2">
                    {step.title}
                  </h3>
                  <p className="font-sans text-ghost-muted mt-2 leading-relaxed">
                    {step.desc}
                  </p>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </SectionContainer>
      </section>

      {/* D. CTA */}
      <section className="bg-void section-padding">
        <SectionContainer>
          <div className="text-center max-w-2xl mx-auto">
            <Reveal>
              <h2 className="font-heading text-3xl md:text-4xl text-ghost uppercase font-semibold">
                {service.ctaHeading}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-sans text-lg text-ghost-muted mt-4">
                {service.ctaBody}
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-8">
                <MagneticButton className="inline-block">
                  <Button variant="primary" size="lg" href="/contact">
                    Book a Call
                  </Button>
                </MagneticButton>
              </div>
            </Reveal>
          </div>
        </SectionContainer>
      </section>
    </>
  );
}
