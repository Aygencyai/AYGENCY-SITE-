"use client";

import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import type { Service, CaseStudy } from "@/types";

const numberMap: Record<string, string> = {
  "agent-design": "01",
  "ai-marketing": "02",
  automation: "03",
  consulting: "04",
};

const ctaBodyMap: Record<string, string> = {
  "agent-design":
    "30 minutes. We\u2019ll look at your operation, identify the highest-value automation, and tell you exactly what we\u2019d build, how long it takes, and what it costs.",
  "ai-marketing":
    "30 minutes. We\u2019ll audit your current setup and show you exactly where an agent system would outperform what you\u2019re running today.",
  automation:
    "30 minutes. We\u2019ll find the workflows that are bleeding time and money, and tell you exactly what a system would look like to fix them.",
  consulting:
    "30 minutes. We\u2019ll look at your operation and help you figure out where AI actually belongs \u2014 before you spend a penny on development.",
};

export default function ServiceDetailClient({
  service,
  relatedStudy,
}: {
  service: Service;
  relatedStudy?: CaseStudy;
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

      {/* D. Related Case Study */}
      {relatedStudy && (
        <section className="bg-ivory-dark py-20 md:py-24">
          <SectionContainer>
            <div className="md:grid md:grid-cols-2 md:gap-12 md:items-start">
              {/* Left */}
              <div>
                <Reveal>
                  <p className="text-green font-sans font-medium text-sm tracking-widest uppercase mb-4">
                    Related Case Study
                  </p>
                  <h2 className="font-serif text-3xl md:text-4xl text-green uppercase">
                    {relatedStudy.title}
                  </h2>
                  <p className="text-sm text-muted mt-1">
                    {relatedStudy.client}
                  </p>
                  <p className="font-sans text-green-muted mt-4 leading-relaxed">
                    {relatedStudy.challenge.length > 200
                      ? relatedStudy.challenge.slice(0, 200) + "..."
                      : relatedStudy.challenge}
                  </p>
                </Reveal>
              </div>

              {/* Right */}
              <div className="mt-8 md:mt-0">
                <Reveal delay={0.1}>
                  <div className="space-y-3">
                    {relatedStudy.results.map((result) => (
                      <div key={result} className="flex items-start gap-3">
                        <Check
                          size={16}
                          className="text-green mt-1 flex-shrink-0"
                        />
                        <span className="font-sans text-green-muted">
                          {result}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={`/case-studies/${relatedStudy.slug}`}
                    className="group inline-flex items-center gap-2 mt-8 text-green font-sans font-medium text-sm"
                  >
                    <span>Read full case study</span>
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                </Reveal>
              </div>
            </div>
          </SectionContainer>
        </section>
      )}

      {/* E. CTA */}
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
                {ctaBodyMap[service.slug] ??
                  "30 minutes. We\u2019ll look at your operation and tell you exactly what a system would look like."}
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
