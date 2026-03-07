"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import PageTransition from "@/components/ui/PageTransition";
import { caseStudies } from "@/lib/data";

export default function CaseStudiesClient() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="bg-ivory pt-32 pb-20">
        <SectionContainer>
          <Reveal>
            <SectionHeading
              eyebrow="Case Studies"
              heading="Systems we've shipped"
              description="Every engagement here started the same way — with a specific problem and a conversation about how to solve it."
              display
            />
          </Reveal>
        </SectionContainer>
      </section>

      {/* Grid */}
      <section className="bg-ivory py-20 md:py-24">
        <SectionContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.map((study, i) => (
              <Reveal key={study.slug} delay={i * 0.1}>
                <Link
                  href={`/case-studies/${study.slug}`}
                  className="group block bg-ivory border border-ivory-dark rounded-lg overflow-hidden hover:shadow-card-hover hover:translate-y-[-2px] transition-all duration-300 h-full"
                >
                  {/* Accent strip */}
                  <div className="h-[3px] bg-green" />

                  <div className="p-8">
                    {/* Industry tag */}
                    <p className="text-green font-sans font-medium text-xs tracking-widest uppercase">
                      {study.industry}
                    </p>

                    {/* Title */}
                    <h3 className="font-serif text-2xl text-green mt-3">
                      {study.title}
                    </h3>

                    {/* Client */}
                    <p className="text-sm text-muted mt-1">
                      {study.client}
                    </p>

                    {/* Challenge excerpt */}
                    <p className="font-sans text-green-muted mt-4 leading-relaxed text-sm">
                      {study.challenge.length > 140
                        ? study.challenge.slice(0, 140) + "..."
                        : study.challenge}
                    </p>

                    {/* Divider */}
                    <div className="border-t border-ivory-dark my-6" />

                    {/* Key result */}
                    <div>
                      <span className="text-3xl font-serif font-bold text-green">
                        {study.keyMetric.value}
                      </span>
                      <p className="text-sm text-green-muted mt-1">
                        {study.keyMetric.label}
                      </p>
                    </div>

                    {/* Link */}
                    <div className="inline-flex items-center gap-2 mt-6 text-green font-sans font-medium text-sm">
                      <span>Read case study</span>
                      <ArrowRight
                        size={16}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </SectionContainer>
      </section>
    </PageTransition>
  );
}
