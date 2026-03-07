"use client";

import Link from "next/link";
import { Bot, Megaphone, Cog, Search, Check, ArrowRight } from "lucide-react";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import PageTransition from "@/components/ui/PageTransition";
import { services } from "@/lib/data";

const iconMap = {
  "agent-design": Bot,
  "ai-marketing": Megaphone,
  automation: Cog,
  consulting: Search,
} as const;

export default function ServicesClient() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="bg-ivory pt-32 pb-20">
        <SectionContainer>
          <Reveal>
            <SectionHeading
              eyebrow="Our Services"
              heading="What We Build"
              description="Every business we work with has a different problem. These are the four ways we typically engage — but the build always starts with understanding yours."
              display
            />
          </Reveal>
        </SectionContainer>
      </section>

      {/* Service Cards */}
      <section className="bg-ivory py-20 md:py-24">
        <SectionContainer>
          <div className="flex flex-col gap-8 md:gap-12">
            {services.map((service, i) => {
              const Icon = iconMap[service.slug as keyof typeof iconMap];
              return (
                <Reveal key={service.slug} delay={i * 0.1}>
                  <div className="border border-ivory-dark rounded-lg p-8 md:p-12 bg-ivory hover:shadow-card-hover transition-shadow duration-300">
                    <div className="md:grid md:grid-cols-[1fr_1.5fr] md:gap-12">
                      {/* Left */}
                      <div>
                        <div className="w-16 h-16 bg-green/10 rounded-xl flex items-center justify-center">
                          <Icon size={36} className="text-green" />
                        </div>
                        <h3 className="font-serif text-2xl text-green mt-6">
                          {service.title}
                        </h3>
                        <p className="font-sans text-green-muted mt-3 leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      {/* Right — Use cases */}
                      <div className="mt-8 md:mt-0">
                        <p className="font-sans font-medium text-sm text-muted tracking-widest uppercase mb-4">
                          What this looks like
                        </p>
                        <div className="space-y-3">
                          {service.useCases.map((useCase) => (
                            <div
                              key={useCase}
                              className="flex items-start gap-3"
                            >
                              <Check
                                size={16}
                                className="text-green mt-1 flex-shrink-0"
                              />
                              <span className="font-sans text-green-muted">
                                {useCase}
                              </span>
                            </div>
                          ))}
                        </div>

                        <Link
                          href={`/services/${service.slug}`}
                          className="group inline-flex items-center gap-2 mt-6 text-green font-sans font-medium text-sm"
                        >
                          <span>Explore {service.shortTitle}</span>
                          <ArrowRight
                            size={16}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </SectionContainer>
      </section>

      {/* CTA Band */}
      <section className="bg-green py-16">
        <SectionContainer>
          <div className="text-center">
            <Reveal>
              <h2 className="font-serif text-2xl md:text-3xl text-white uppercase">
                Don&rsquo;t see your use case?
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-sans text-white/70 text-lg mt-4">
                We work across industries. If you&rsquo;ve got a process that&rsquo;s manual, expensive, or doesn&rsquo;t scale — we&rsquo;ve probably built something like it.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-8">
                <Button variant="white" size="lg" href="/contact">
                  Get in Touch
                </Button>
              </div>
            </Reveal>
          </div>
        </SectionContainer>
      </section>
    </PageTransition>
  );
}
