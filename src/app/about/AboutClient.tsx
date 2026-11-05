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
      <section className="blend-void pt-32 pb-10">
        <SectionContainer>
          <Reveal>
            <p className="text-cyan font-mono text-xs tracking-[0.2em] uppercase mb-4">
              {`// about`}
            </p>
          </Reveal>
          <h1 className="font-heading text-ghost text-4xl md:text-5xl lg:text-6xl uppercase font-semibold leading-tight mb-6">
            <TypewriterText text={"We clear the way for businesses to scale."} delay={300} speed={40} />
          </h1>
          <Reveal delay={0.1}>
            <p className="text-ghost-muted text-lg md:text-xl max-w-2xl leading-relaxed font-sans">
              Aygency builds AI agents that take on the work slowing a business down. We
              learn how you run, build agents around it, and keep improving them. You stay
              in control, and the business grows further than you thought it could.
            </p>
          </Reveal>
        </SectionContainer>
      </section>

      {/* Why we exist */}
      <section className="blend-surface section-padding">
        <SectionContainer>
          <div className="max-w-3xl">
            <Reveal>
              <p className="text-cyan font-mono text-xs tracking-[0.2em] uppercase mb-4">
                {`// why we exist`}
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-heading text-2xl md:text-3xl text-ghost uppercase font-semibold">
                Good businesses get stuck on the wrong work
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-sans text-ghost-muted text-lg mt-6 leading-relaxed">
                Most businesses don&rsquo;t stall for lack of ideas or demand. They stall
                because the admin grows with every new client. Invoices, documents,
                follow-ups and reports pile up, and the only answer has been to hire.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="font-sans text-ghost-muted text-lg mt-5 leading-relaxed">
                We started Aygency to remove those bottlenecks. Clear the back office
                first, then put agents to work bringing in new business. Growth stops
                waiting on headcount.
              </p>
            </Reveal>
          </div>
        </SectionContainer>
      </section>

      {/* How we work */}
      <section className="blend-void section-padding">
        <SectionContainer>
          <div className="max-w-3xl">
            <Reveal>
              <p className="text-cyan font-mono text-xs tracking-[0.2em] uppercase mb-4">
                {`// how we work`}
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-heading text-2xl md:text-3xl text-ghost uppercase font-semibold">
                Built around your business, not the other way round
              </h2>
            </Reveal>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-10">
            {[
              {
                title: "We learn the business",
                body: "We sit with you and your team to understand the real workflows, the handoffs, and where time quietly disappears.",
              },
              {
                title: "We build agents around it",
                body: "Each agent works like a dedicated employee, only faster and to a higher standard. It fits the way you already work, using the tools you already have.",
              },
              {
                title: "You stay in control",
                body: "Everything runs through one command centre. Agents act, and anything high-impact comes to you for approval first.",
              },
              {
                title: "We keep improving it",
                body: "We don’t hand it over and walk away. We run the system, tune it, and add agents as the business grows.",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={0.05 * i}>
                <div>
                  <h3 className="font-heading text-xl font-semibold text-white">{item.title}</h3>
                  <p className="font-sans text-ghost-muted leading-relaxed mt-3">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </SectionContainer>
      </section>

      {/* The founders */}
      <section className="blend-surface section-padding">
        <SectionContainer>
          <div className="max-w-3xl">
            <Reveal>
              <p className="text-cyan font-mono text-xs tracking-[0.2em] uppercase mb-4">
                {`// the founders`}
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-heading text-2xl md:text-3xl text-ghost uppercase font-semibold">
                Who&rsquo;s behind Aygency
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-sans text-ghost-muted text-lg mt-6 leading-relaxed">
                Louis and Erik spent over a year debating where AI was really heading. When
                the technology for reliable, autonomous agents arrived, they stopped talking
                and started building. Erik handed in his notice the same day. Aygency has
                had their full focus ever since.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-12">
            <Reveal delay={0.1}>
              <div>
                <h3 className="font-heading text-xl font-semibold text-white">Louis Rosenberg</h3>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan mt-1">
                  Co-founder and CEO
                </p>
                <p className="font-sans text-ghost-muted leading-relaxed mt-4">
                  Louis grew up in a family of business owners. His father and both his
                  brothers run their own companies. He went from Haberdashers&rsquo;
                  Aske&rsquo;s straight into the markets, trading AI and crypto, and kept
                  seeing the same thing at home: sharp people losing whole days to work a
                  machine should do. Aygency is his answer to that. He leads strategy, client
                  work and how each system is designed.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div>
                <h3 className="font-heading text-xl font-semibold text-white">Erik</h3>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan mt-1">
                  Co-founder and CTO
                </p>
                <p className="font-sans text-ghost-muted leading-relaxed mt-4">
                  Erik trained in aerospace engineering, where &ldquo;roughly right&rdquo;
                  isn&rsquo;t good enough. He builds agent systems the same way: every part
                  has one job, and every part has to hold under load. He leads the technical
                  build and the platform every Aygency system runs on.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <p className="font-sans text-ghost text-lg leading-relaxed mt-12 max-w-3xl">
              Both are perfectionists, and both a little too fond of chess. Read the whole
              board, protect what matters, and keep improving the position. That&rsquo;s
              how we build.
            </p>
          </Reveal>
        </SectionContainer>
      </section>

      {/* What we stand for */}
      <section className="blend-void section-padding">
        <SectionContainer>
          <div className="max-w-3xl">
            <Reveal>
              <p className="text-cyan font-mono text-xs tracking-[0.2em] uppercase mb-4">
                {`// what we stand for`}
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-heading text-2xl md:text-3xl text-ghost uppercase font-semibold">
                Three things we won&rsquo;t compromise on
              </h2>
            </Reveal>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-10">
            {[
              {
                title: "Privacy first",
                body: "Your data never trains external models. Data handling is GDPR-aligned, with a data processing agreement (DPA) available.",
              },
              {
                title: "A human signs off",
                body: "Agents do the work. High-impact actions wait for a person to approve them, and every system can be paused or rolled back.",
              },
              {
                title: "Built to last",
                body: "A system should get better every month, not go stale. So we stay on to run it, and it keeps learning how your business works.",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={0.05 * i}>
                <div>
                  <h3 className="font-heading text-xl font-semibold text-white">{item.title}</h3>
                  <p className="font-sans text-ghost-muted leading-relaxed mt-3">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </SectionContainer>
      </section>

      {/* CTA band */}
      <section className="blend-surface section-padding relative overflow-hidden">
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
                30 minutes. We&rsquo;ll find the bottlenecks holding you back and show you
                what agents would take off your plate. You keep the plan either way.
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
