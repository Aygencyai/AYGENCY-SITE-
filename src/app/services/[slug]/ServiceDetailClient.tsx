"use client";

import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
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
      <section className="bg-ivory pt-32 pb-20">
        <SectionContainer>
          <div className="max-w-3xl">
            <Reveal>
              <p className="text-green font-sans font-medium text-sm tracking-widest uppercase mb-4">
                {numberMap[service.slug] ?? "01"} — {service.shortTitle}
              </p>
              <h1 className="font-serif text-green text-4xl md:text-5xl lg:text-6xl leading-tight uppercase">
                {service.title}
              </h1>
              <p className="text-green-muted font-sans text-lg md:text-xl leading-relaxed mt-6">
                {service.longDescription}
              </p>
            </Reveal>
          </div>
        </SectionContainer>
      </section>

      {/* B. The Problem */}
      <section className="bg-ivory-dark py-20 md:py-24">
        <SectionContainer>
          <div className="max-w-3xl">
            <Reveal>
              <SectionHeading
                eyebrow="The Problem"
                heading="Why this matters"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-sans text-green-muted text-lg leading-relaxed">
                {service.problem}
              </p>
            </Reveal>
          </div>
        </SectionContainer>
      </section>

      {/* C. Our Approach */}
      <section className="bg-ivory py-20 md:py-24">
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
                <div className="bg-ivory border border-ivory-dark p-6 md:p-8 rounded-lg pt-0 overflow-hidden h-full hover:shadow-card-hover transition-shadow duration-300">
                  <div className="h-[3px] bg-green -mx-6 md:-mx-8 mb-6" />
                  <p className="text-green font-sans text-sm font-medium">
                    Step {i + 1}
                  </p>
                  <h3 className="font-serif text-lg text-green mt-2">
                    {step.title}
                  </h3>
                  <p className="font-sans text-green-muted mt-2 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </SectionContainer>
      </section>

      {/* D. CTA */}
      <section className="bg-ivory py-20 md:py-24">
        <SectionContainer>
          <div className="text-center max-w-2xl mx-auto">
            <Reveal>
              <h2 className="font-serif text-3xl md:text-4xl text-green uppercase">
                {service.ctaHeading}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-sans text-lg text-green-muted mt-4">
                {service.ctaBody}
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-8">
                <Button variant="primary" size="lg" href="/contact">
                  Book a Call
                </Button>
              </div>
            </Reveal>
          </div>
        </SectionContainer>
      </section>
    </>
  );
}
