"use client";

import Link from "next/link";
import { ArrowRight, Bot } from "lucide-react";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
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
      <section className="bg-ivory pt-32 pb-20">
        <SectionContainer>
          <div className="max-w-3xl">
            <Reveal>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-green/10 text-green font-sans text-xs font-medium tracking-widest uppercase px-3 py-1.5 rounded-full">
                  {useCase.sector}
                </span>
                <span className="bg-green/10 text-green font-sans text-xs font-medium tracking-widest uppercase px-3 py-1.5 rounded-full">
                  {useCase.systemType}
                </span>
              </div>
              <h1 className="font-serif text-green text-4xl md:text-5xl lg:text-6xl leading-tight uppercase">
                {useCase.title}
              </h1>
              <p className="text-green-muted font-sans text-lg md:text-xl leading-relaxed mt-6">
                {useCase.subtext}
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
                heading="What they were dealing with"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-sans text-green-muted text-lg leading-relaxed">
                {useCase.problem}
              </p>
            </Reveal>
          </div>
        </SectionContainer>
      </section>

      {/* C. The System — Agent Architecture */}
      <section className="bg-ivory py-20 md:py-24">
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
                <div className="bg-green text-white rounded-lg p-6 md:p-8 mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Bot size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-white">
                        {ceoAgent.name}
                      </h3>
                      <p className="font-sans text-white/70 mt-2 leading-relaxed text-sm">
                        {ceoAgent.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            )}

            {/* Connection lines */}
            {ceoAgent && (
              <div className="flex justify-center py-2">
                <div className="w-px h-6 bg-ivory-dark" />
              </div>
            )}

            {/* Operational agents grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {operationalAgents.map((agent, i) => (
                <Reveal key={agent.name} delay={0.15 + i * 0.1}>
                  <div className="bg-ivory border border-ivory-dark rounded-lg p-6 h-full hover:shadow-card-hover transition-shadow duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Bot size={20} className="text-green" />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg text-green">
                          {agent.name}
                        </h3>
                        <p className="font-sans text-green-muted mt-2 leading-relaxed text-sm">
                          {agent.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* D. Estimated Impact */}
      <section className="bg-ivory-dark py-20 md:py-24">
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
              <p className="font-sans text-green text-xl md:text-2xl font-medium leading-relaxed">
                {useCase.estimatedImpact}
              </p>
            </Reveal>

            {/* Next Use Case link */}
            <Reveal delay={0.2}>
              <div className="mt-12">
                <Link
                  href={`/use-cases/${nextUseCase.slug}`}
                  className="group inline-flex items-center gap-2 text-green font-sans font-medium text-sm"
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
      <section className="bg-ivory py-20 md:py-24">
        <SectionContainer>
          <div className="text-center max-w-2xl mx-auto">
            <Reveal>
              <h2 className="font-serif text-3xl md:text-4xl text-green uppercase">
                {useCase.ctaHeading}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-sans text-lg text-green-muted mt-4">
                {useCase.ctaBody}
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="primary" size="lg" href="/contact">
                  Book a Call
                </Button>
                <Link
                  href="/use-cases"
                  className="group inline-flex items-center gap-2 text-green font-sans font-medium text-sm"
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
