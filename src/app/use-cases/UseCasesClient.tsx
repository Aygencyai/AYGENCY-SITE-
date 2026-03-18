"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionContainer from "@/components/ui/SectionContainer";
import Reveal from "@/components/ui/Reveal";
import TypewriterText from "@/components/effects/TypewriterText";
import Button from "@/components/ui/Button";
import PageTransition from "@/components/ui/PageTransition";
import GlowOrb from "@/components/effects/GlowOrb";
import AnimatedGrid from "@/components/effects/AnimatedGrid";
import MagneticButton from "@/components/ui/MagneticButton";
import { useCases } from "@/lib/data";

export default function UseCasesClient() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="bg-void pt-32 pb-10">
        <SectionContainer>
          <div>
            <Reveal>
              <p className="text-cyan font-mono text-xs tracking-[0.2em] uppercase mb-4">
                Use Cases
              </p>
            </Reveal>
            <h2 className="font-heading text-ghost text-4xl md:text-5xl lg:text-6xl uppercase font-semibold leading-tight mb-6">
              <TypewriterText
                text="Systems We Design"
                delay={300}
                speed={35}
              />
            </h2>
            <Reveal delay={0.1}>
              <p className="text-ghost-muted text-lg md:text-xl max-w-2xl leading-relaxed font-sans">
                Every business has different problems. These are examples of the agent systems we architect &mdash; showing how we&rsquo;d approach real operational challenges across different sectors.
              </p>
            </Reveal>
          </div>
        </SectionContainer>
      </section>

      {/* Grid */}
      <section className="bg-void pt-12 pb-24 md:pt-16 md:pb-32">
        <SectionContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, i) => (
              <Reveal key={useCase.slug} delay={i * 0.1}>
                <Link
                  href={`/use-cases/${useCase.slug}`}
                  className="group block rounded-xl bg-void-light/60 backdrop-blur-xl border border-ghost/[0.06] overflow-hidden hover:shadow-card-hover hover:border-ghost/[0.12] transition-all duration-300 h-full relative"
                >
                  {/* Gradient top border */}
                  <div className="h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />

                  <div className="p-8">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-cyan/[0.08] text-cyan font-mono text-xs tracking-wider uppercase px-3 py-1.5 rounded-md border border-cyan/20">
                        {useCase.sector}
                      </span>
                      <span className="bg-cyan/[0.08] text-cyan font-mono text-xs tracking-wider uppercase px-3 py-1.5 rounded-md border border-cyan/20">
                        {useCase.systemType}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-heading text-2xl font-semibold text-white mt-4">
                      {useCase.title}
                    </h3>

                    {/* Subtext */}
                    <p className="font-sans text-ghost-muted mt-3 leading-relaxed text-sm">
                      {useCase.subtext}
                    </p>

                    {/* Divider */}
                    <div className="border-t border-ghost/[0.06] my-6" />

                    {/* Impact preview */}
                    <p className="font-sans text-sm font-medium text-ghost">
                      {useCase.estimatedImpact}
                    </p>

                    {/* Link */}
                    <div className="inline-flex items-center gap-2 mt-6 text-cyan font-sans font-medium text-sm">
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
      <section className="bg-surface section-padding relative overflow-hidden">
        <AnimatedGrid />
        <GlowOrb
          size={400}
          opacity={0.1}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
        <SectionContainer>
          <div className="relative z-10 text-center">
            <Reveal>
              <h2 className="font-heading text-2xl md:text-3xl text-white uppercase font-semibold">
                Your Operation Is Different. That&rsquo;s The Point.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-sans text-ghost-muted text-lg mt-4 max-w-2xl mx-auto">
                These examples show how we think. Your system would be designed
                around your specific operation, your data, and your problems.
                Book 30 minutes and we&rsquo;ll show you what we&rsquo;d build
                for you.
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
    </PageTransition>
  );
}
