"use client";

import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import type { CaseStudy } from "@/types";

export default function CaseStudyDetailClient({
  study,
  nextStudy,
}: {
  study: CaseStudy;
  nextStudy: CaseStudy;
}) {
  return (
    <>
      {/* A. Hero */}
      <section className="bg-ivory pt-32 pb-20">
        <SectionContainer>
          <div className="max-w-3xl">
            <Reveal>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-green/10 text-green font-sans text-xs font-medium tracking-widest uppercase px-3 py-1.5 rounded-full">
                  {study.industry}
                </span>
                <span className="bg-green/10 text-green font-sans text-xs font-medium tracking-widest uppercase px-3 py-1.5 rounded-full">
                  {study.service}
                </span>
              </div>
              <h1 className="font-serif text-green text-4xl md:text-5xl lg:text-6xl leading-tight uppercase">
                {study.title}
              </h1>
              <p className="text-muted text-lg mt-4">
                {study.client}
              </p>
            </Reveal>
          </div>
        </SectionContainer>
      </section>

      {/* B. Challenge */}
      <section className="bg-ivory-dark py-20 md:py-24">
        <SectionContainer>
          <div className="max-w-3xl">
            <Reveal>
              <SectionHeading
                eyebrow="The Problem"
                heading="What they were dealing with"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-sans text-green-muted text-lg leading-relaxed">
                {study.challenge}
              </p>
            </Reveal>
          </div>
        </SectionContainer>
      </section>

      {/* C. Solution */}
      <section className="bg-ivory py-20 md:py-24">
        <SectionContainer>
          <div className="max-w-3xl">
            <Reveal>
              <SectionHeading
                eyebrow="The Solution"
                heading="What we built"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-sans text-green-muted text-lg leading-relaxed">
                {study.solution}
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="flex flex-wrap gap-2 mt-8">
                {study.tech.map((tag) => (
                  <span
                    key={tag}
                    className="bg-ivory border border-ivory-dark rounded-full px-3 py-1.5 text-xs font-sans text-green-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </SectionContainer>
      </section>

      {/* D. Results */}
      <section className="bg-ivory-dark py-20 md:py-24">
        <SectionContainer>
          <Reveal>
            <SectionHeading
              eyebrow="The Results"
              heading="Impact"
              align="center"
            />
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-6 mt-16 max-w-3xl mx-auto">
            {study.results.map((result, i) => (
              <Reveal key={result} delay={i * 0.1}>
                <div className="bg-ivory border border-ivory-dark rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <Check
                      size={20}
                      className="text-green mt-0.5 flex-shrink-0"
                    />
                    <span className="font-sans font-medium text-lg text-green">
                      {result}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Next Case Study link */}
          <Reveal delay={0.4}>
            <div className="text-center mt-12">
              <Link
                href={`/case-studies/${nextStudy.slug}`}
                className="group inline-flex items-center gap-2 text-green font-sans font-medium text-sm"
              >
                <span>Next Case Study: {nextStudy.title}</span>
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </Reveal>
        </SectionContainer>
      </section>

      {/* E. Quote */}
      <section className="bg-navy py-16 md:py-20">
        <SectionContainer>
          <div className="text-center max-w-3xl mx-auto">
            <Reveal>
              <p className="text-6xl text-white/30 font-serif leading-none mb-4">
                &ldquo;
              </p>
              <blockquote className="text-2xl md:text-3xl text-white font-serif italic leading-snug">
                {study.quote}
              </blockquote>
              <p className="text-white/70 font-sans text-sm mt-6">
                &mdash; {study.quoteAttribution}
              </p>
            </Reveal>
          </div>
        </SectionContainer>
      </section>

      {/* F. CTA */}
      <section className="bg-ivory py-20 md:py-24">
        <SectionContainer>
          <div className="text-center max-w-2xl mx-auto">
            <Reveal>
              <h2 className="font-serif text-3xl md:text-4xl text-green uppercase">
                Dealing with something similar?
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-sans text-lg text-green-muted mt-4">
                Let&rsquo;s talk about it. 30 minutes, no commitment —
                we&rsquo;ll tell you what we&rsquo;d build.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="primary" size="lg" href="/contact">
                  Book a Call
                </Button>
                <Link
                  href="/services"
                  className="group inline-flex items-center gap-2 text-green font-sans font-medium text-sm"
                >
                  <span>Or explore our services</span>
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </Reveal>
          </div>
        </SectionContainer>
      </section>
    </>
  );
}
