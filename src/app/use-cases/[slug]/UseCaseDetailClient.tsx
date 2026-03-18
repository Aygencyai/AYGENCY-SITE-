"use client";

import Link from "next/link";
import { ArrowRight, Bot } from "lucide-react";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import MagneticButton from "@/components/ui/MagneticButton";
import type { UseCase } from "@/types";

export default function UseCaseDetailClient({
  useCase,
  nextUseCase,
}: {
  useCase: UseCase;
  nextUseCase: UseCase;
}) {
  const ceoAgent = useCase.agents.find((a) => a.name === "CEO Agent");
  const operationalAgents = useCase.agents.filter(
    (a) => a.name !== "CEO Agent"
  );

  return (
    <>
      {/* A. Hero */}
      <section className="bg-void pt-32 pb-20">
        <SectionContainer>
          <div className="max-w-3xl">
            <Reveal>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-cyan/[0.08] text-cyan font-mono text-xs tracking-wider uppercase px-3 py-1.5 rounded-md border border-cyan/20">
                  {useCase.sector}
                </span>
                <span className="bg-cyan/[0.08] text-cyan font-mono text-xs tracking-wider uppercase px-3 py-1.5 rounded-md border border-cyan/20">
                  {useCase.systemType}
                </span>
              </div>
              <h1 className="font-heading text-ghost text-4xl md:text-5xl lg:text-6xl leading-tight uppercase font-semibold">
                {useCase.title}
              </h1>
              <p className="text-ghost-muted font-sans text-lg md:text-xl leading-relaxed mt-6">
                {useCase.subtext}
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
                heading="What they were dealing with"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-sans text-ghost-muted text-lg leading-relaxed">
                {useCase.problem}
              </p>
            </Reveal>
          </div>
        </SectionContainer>
      </section>

      {/* C. The System — Agent Architecture */}
      <section className="bg-void section-padding">
        <SectionContainer>
          <Reveal>
            <SectionHeading
              eyebrow="The System"
              heading="What we&rsquo;d build"
              align="center"
            />
          </Reveal>

          {/* Agent Architecture Diagram */}
          <div className="mt-16 max-w-4xl mx-auto">
            {/* CEO Agent at top */}
            {ceoAgent && (
              <Reveal delay={0.1}>
                <div className="bg-cyan/[0.08] border border-cyan/20 rounded-xl p-6 md:p-8 mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-cyan/[0.15] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Bot size={20} className="text-cyan" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-white">
                        {ceoAgent.name}
                      </h3>
                      <p className="font-sans text-ghost-muted mt-2 leading-relaxed text-sm">
                        {ceoAgent.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            )}

            {/* Connection line */}
            {ceoAgent && (
              <div className="flex justify-center py-2">
                <div className="w-px h-6 border-l border-dashed border-cyan/30" />
              </div>
            )}

            {/* Operational agents grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {operationalAgents.map((agent, i) => (
                <Reveal key={agent.name} delay={0.15 + i * 0.1}>
                  <GlassCard>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-cyan/[0.08] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Bot size={20} className="text-cyan" />
                      </div>
                      <div>
                        <h3 className="font-heading text-lg font-semibold text-white">
                          {agent.name}
                        </h3>
                        <p className="font-sans text-ghost-muted mt-2 leading-relaxed text-sm">
                          {agent.description}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </Reveal>
              ))}
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* D. Estimated Impact */}
      <section className="bg-surface section-padding">
        <SectionContainer>
          <div className="text-center max-w-3xl mx-auto">
            <Reveal>
              <SectionHeading
                eyebrow="Estimated Impact"
                heading="What this system delivers"
                align="center"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-sans text-ghost text-xl md:text-2xl font-medium leading-relaxed">
                {useCase.estimatedImpact}
              </p>
            </Reveal>

            {/* Next Use Case link */}
            <Reveal delay={0.2}>
              <div className="mt-12">
                <Link
                  href={`/use-cases/${nextUseCase.slug}`}
                  className="group inline-flex items-center gap-2 text-cyan font-sans font-medium text-sm"
                >
                  <span>Next: {nextUseCase.title}</span>
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

      {/* E. CTA */}
      <section className="bg-void section-padding">
        <SectionContainer>
          <div className="text-center max-w-2xl mx-auto">
            <Reveal>
              <h2 className="font-heading text-3xl md:text-4xl text-ghost uppercase font-semibold">
                {useCase.ctaHeading}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-sans text-lg text-ghost-muted mt-4">
                {useCase.ctaBody}
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <MagneticButton className="inline-block">
                  <Button variant="primary" size="lg" href="/contact">
                    Book a Call
                  </Button>
                </MagneticButton>
                <Link
                  href="/use-cases"
                  className="group inline-flex items-center gap-2 text-cyan font-sans font-medium text-sm"
                >
                  <span>Or view all use cases</span>
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
