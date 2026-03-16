"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import PageTransition from "@/components/ui/PageTransition";
import { useCases } from "@/lib/data";

export default function UseCasesClient() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="bg-ivory pt-32 pb-20">
        <SectionContainer>
          <Reveal>
            <SectionHeading
              eyebrow="Use Cases"
              heading="Systems We Design"
              description="Every business has different problems. These are examples of the agent systems we architect &mdash; showing how we&rsquo;d approach real operational challenges across different sectors."
              display
            />
          </Reveal>
        </SectionContainer>
      </section>

      {/* Grid */}
      <section className="bg-ivory py-20 md:py-24">
        <SectionContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, i) => (
              <Reveal key={useCase.slug} delay={i * 0.1}>
                <Link
                  href={`/use-cases/${useCase.slug}`}
                  className="group block bg-ivory border border-ivory-dark rounded-lg overflow-hidden hover:shadow-card-hover hover:translate-y-[-2px] transition-all duration-300 h-full"
                >
                  {/* Accent strip */}
                  <div className="h-[3px] bg-green" />

                  <div className="p-8">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-green/10 text-green font-sans text-xs font-medium tracking-widest uppercase px-3 py-1.5 rounded-full">
                        {useCase.sector}
                      </span>
                      <span className="bg-green/10 text-green font-sans text-xs font-medium tracking-widest uppercase px-3 py-1.5 rounded-full">
                        {useCase.systemType}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-2xl text-green mt-4">
                      {useCase.title}
                    </h3>

                    {/* Subtext */}
                    <p className="font-sans text-green-muted mt-3 leading-relaxed text-sm">
                      {useCase.subtext}
                    </p>

                    {/* Divider */}
                    <div className="border-t border-ivory-dark my-6" />

                    {/* Impact preview */}
                    <p className="font-sans text-sm font-medium text-green">
                      {useCase.estimatedImpact}
                    </p>

                    {/* Link */}
                    <div className="inline-flex items-center gap-2 mt-6 text-green font-sans font-medium text-sm">
                      <span>View use case</span>
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

      {/* CTA Band */}
      <section className="bg-green py-16">
        <SectionContainer>
          <div className="text-center">
            <Reveal>
              <h2 className="font-serif text-2xl md:text-3xl text-white uppercase">
                Your Operation Is Different. That&rsquo;s The Point.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-sans text-white/70 text-lg mt-4">
                These examples show how we think. Your system would be designed
                around your specific operation, your data, and your problems.
                Book 30 minutes and we&rsquo;ll show you what we&rsquo;d build
                for you.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-8">
                <Button variant="white" size="lg" href="/contact">
                  Book a Call
                </Button>
              </div>
            </Reveal>
          </div>
        </SectionContainer>
      </section>
    </PageTransition>
  );
}
