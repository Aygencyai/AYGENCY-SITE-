"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionContainer from "@/components/ui/SectionContainer";
import Reveal from "@/components/ui/Reveal";
import TypewriterText from "@/components/effects/TypewriterText";
import Button from "@/components/ui/Button";
import PageTransition from "@/components/ui/PageTransition";
import GlassCard from "@/components/ui/GlassCard";
import GlowOrb from "@/components/effects/GlowOrb";
import AnimatedGrid from "@/components/effects/AnimatedGrid";
import MagneticButton from "@/components/ui/MagneticButton";
import { services } from "@/lib/data";

const systemFit: Record<string, string> = {
  "cost-reduction": "Operations · Analyst · CEO Agent",
  "revenue-operations": "Scout · Outreach · Strategist · CEO Agent",
  "intelligence": "Analyst · CEO Agent",
  "full-department": "the full operation core + Front Desk",
};

export default function ServicesClient() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="bg-void pt-32 pb-10">
        <SectionContainer>
          <div>
            <Reveal>
              <p className="text-cyan font-mono text-xs tracking-[0.2em] uppercase mb-4">
                Our Services
              </p>
            </Reveal>
            <h2 className="font-heading text-ghost text-4xl md:text-5xl lg:text-6xl uppercase font-semibold leading-tight mb-6 whitespace-pre-line">
              <TypewriterText
                text={"Cut the Cost.\nCapture the Revenue."}
                delay={300}
                speed={35}
              />
            </h2>
            <Reveal delay={0.1}>
              <p className="text-ghost-muted text-lg md:text-xl max-w-2xl leading-relaxed font-sans">
                Every system is the same eight-agent system, tailored to the job. These are the four places they land hardest &mdash; cut cost, drive revenue, see the whole operation, or run an entire function.
              </p>
            </Reveal>
          </div>
        </SectionContainer>
      </section>

      {/* Service Cards */}
      <section className="bg-void pt-12 pb-24 md:pt-16 md:pb-32">
        <SectionContainer>
          <div className="flex flex-col gap-8 md:gap-12">
            {services.map((service, i) => (
                <Reveal key={service.slug} delay={i * 0.1}>
                  <GlassCard tilt={false}>
                    <div className="md:grid md:grid-cols-[1fr_1.5fr] md:gap-12 md:items-center">
                      {/* Left */}
                      <div>
                        <h3 className="font-heading text-2xl font-semibold text-white">
                          {service.title}
                        </h3>
                        <p className="font-sans text-ghost-muted mt-3 leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      {/* Right — Use cases */}
                      <div className="mt-8 md:mt-0">
                        <p className="font-mono text-xs text-ghost-dim tracking-widest uppercase mb-4">
                          What this looks like
                        </p>
                        <ul className="space-y-3 list-disc list-outside ml-4 marker:text-cyan">
                          {service.useCases.map((useCase) => (
                            <li
                              key={useCase}
                              className="font-sans text-ghost-muted"
                            >
                              {useCase}
                            </li>
                          ))}
                        </ul>

                        {systemFit[service.slug] && (
                          <p className="font-mono text-[11px] text-cyan/80 tracking-wider uppercase mt-6">
                            Built from {systemFit[service.slug]}
                          </p>
                        )}

                        <Link
                          href={`/services/${service.slug}`}
                          className="group inline-flex items-center gap-2 mt-6 text-cyan font-sans font-medium text-sm"
                        >
                          <span>Explore {service.shortTitle}</span>
                          <ArrowRight
                            size={16}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        </Link>
                      </div>
                    </div>
                  </GlassCard>
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
                Not Sure Which System You Need?
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-sans text-ghost-muted text-lg mt-4 max-w-2xl mx-auto">
                Most clients start with a conversation. Tell us where it hurts and we&rsquo;ll map the system that fits and where it would save you most &mdash; a plan you can keep whether you build it with us or not.
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
