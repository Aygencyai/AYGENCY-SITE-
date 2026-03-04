"use client";

import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { caseStudies } from "@/lib/data";

export default function CaseStudies() {
  return (
    <section id="case-studies" className="bg-secondary section-padding">
      <SectionContainer>
        <SectionHeading
          eyebrow="Proof of Work"
          heading="Systems we've shipped"
          align="left"
        />

        <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide mt-16 -mx-6 px-6 md:-mx-8 md:px-8">
          {caseStudies.map((study, i) => (
            <Reveal key={study.slug} delay={i * 0.1} direction="right">
              <Link
                href={`/case-studies/${study.slug}`}
                className="group block min-w-[340px] md:min-w-[420px] max-w-[480px] flex-shrink-0 snap-start bg-primary border border-border rounded-2xl p-8 hover:shadow-card-hover transition-all duration-300"
              >
                <span className="inline-block bg-accent-light text-accent text-xs font-medium px-3 py-1 rounded-full">
                  {study.industry}
                </span>

                <h3 className="font-heading font-semibold text-2xl text-text-primary mt-4">
                  {study.title}
                </h3>
                <p className="text-sm text-text-tertiary mt-1">
                  {study.client}
                </p>

                <p className="font-body text-text-secondary mt-4">
                  {study.challenge.length > 120
                    ? study.challenge.slice(0, 120) + "..."
                    : study.challenge}
                </p>

                <div className="mt-6 space-y-2">
                  {study.results.slice(0, 2).map((result) => (
                    <div key={result} className="flex items-start gap-2">
                      <Check
                        size={16}
                        className="text-accent mt-0.5 flex-shrink-0"
                      />
                      <span className="font-body text-sm text-text-secondary">
                        {result}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-6 pt-6 border-t border-border text-accent font-heading font-medium text-sm">
                  <span>Read case study</span>
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}
