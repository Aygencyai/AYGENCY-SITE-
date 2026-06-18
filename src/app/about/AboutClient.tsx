"use client";

import PageTransition from "@/components/ui/PageTransition";
import SectionContainer from "@/components/ui/SectionContainer";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import TypewriterText from "@/components/effects/TypewriterText";
import GlowOrb from "@/components/effects/GlowOrb";
import AnimatedGrid from "@/components/effects/AnimatedGrid";
import MagneticButton from "@/components/ui/MagneticButton";

export default function AboutClient() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="bg-void pt-32 pb-10">
        <SectionContainer>
          <Reveal>
            <p className="text-cyan font-mono text-xs tracking-[0.2em] uppercase mb-4">
              {`// about`}
            </p>
          </Reveal>
          <h1 className="font-heading text-ghost text-4xl md:text-5xl lg:text-6xl uppercase font-semibold leading-tight mb-6">
            <TypewriterText text={"We build it. Then we run it."} delay={300} speed={40} />
          </h1>
          <Reveal delay={0.1}>
            <p className="text-ghost-muted text-lg md:text-xl max-w-2xl leading-relaxed font-sans">
              Aygency is an AI automation agency. We design, build, deploy, and
              operate agent systems that run the work a business would otherwise do
              by hand &mdash; and get better the longer they run.
            </p>
          </Reveal>
        </SectionContainer>
      </section>

      {/* The compounding effect */}
      <section className="bg-void pt-12 pb-24 md:pt-16 md:pb-28">
        <SectionContainer>
          <div className="max-w-3xl">
            <Reveal>
              <h2 className="font-heading text-2xl md:text-3xl text-ghost uppercase font-semibold">
                Built once. Compounding forever.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-sans text-ghost-muted text-lg mt-6 leading-relaxed">
                Most things a business buys lose value the moment they&rsquo;re
                bought. Employees plateau. Software licences stay flat. Equipment
                depreciates. Agent systems go the other way.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="font-sans text-ghost-muted text-lg mt-5 leading-relaxed">
                Day one, the system runs the workflow. By month three, it runs it
                better than any person could. By month six, it&rsquo;s surfacing
                opportunities no one asked it to find. The cost stays flat. The value
                climbs.
              </p>
            </Reveal>
          </div>
        </SectionContainer>
      </section>

      {/* Operated, always */}
      <section className="bg-surface section-padding">
        <SectionContainer>
          <div className="max-w-3xl">
            <Reveal>
              <h2 className="font-heading text-2xl md:text-3xl text-ghost uppercase font-semibold">
                We don&rsquo;t ship and walk away.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-sans text-ghost-muted text-lg mt-6 leading-relaxed">
                Static automation can be built and abandoned. Agent systems
                can&rsquo;t &mdash; they need active stewardship to learn, adapt, and
                find the value that justifies them. So we operate every system we
                build: monitoring it, tuning it, expanding its coverage.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="font-sans text-ghost-muted text-lg mt-5 leading-relaxed">
                That&rsquo;s the difference between a system that compounds and one
                that quietly decays. It shapes how we price, how we contract, and
                every technical decision we make.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="font-sans text-ghost-muted text-lg mt-5 leading-relaxed">
                We prove it on ourselves. Aygency runs its own outreach, research, and
                reporting on these agents &mdash; the systems we&rsquo;d build for you are
                the ones already running us.
              </p>
            </Reveal>
          </div>
        </SectionContainer>
      </section>

      {/* Why we exist */}
      <section className="bg-void section-padding">
        <SectionContainer>
          <div className="max-w-3xl">
            <Reveal>
              <h2 className="font-heading text-2xl md:text-3xl text-ghost uppercase font-semibold">
                Why we exist
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-sans text-ghost-muted text-lg mt-6 leading-relaxed">
                Every business has work that should run itself, and a list of things
                it would do if it could hire for them. The old answer was to recruit
                a department, wait months, and hope. We think that&rsquo;s the wrong
                trade.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="font-sans text-ghost-muted text-lg mt-5 leading-relaxed">
                Aygency was founded by Louis and Erik to give a business the
                capability of a department &mdash; built around its operation,
                running around the clock, and operated by us.
              </p>
            </Reveal>
          </div>
        </SectionContainer>
      </section>

      {/* CTA band */}
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
                See what we&rsquo;d build for you
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-sans text-ghost-muted text-lg mt-4 max-w-2xl mx-auto">
                30 minutes. A straight answer on where agents would hit hardest in
                your operation.
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
