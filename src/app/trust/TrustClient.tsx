"use client";

import { Lock, ShieldCheck, Activity, type LucideIcon } from "lucide-react";
import PageTransition from "@/components/ui/PageTransition";
import SectionContainer from "@/components/ui/SectionContainer";
import Reveal from "@/components/ui/Reveal";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import TypewriterText from "@/components/effects/TypewriterText";
import GlowOrb from "@/components/effects/GlowOrb";
import AnimatedGrid from "@/components/effects/AnimatedGrid";
import MagneticButton from "@/components/ui/MagneticButton";

const pillars: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Lock,
    title: "Your data, your environment",
    body: "Every system runs inside your own infrastructure. Your data never trains external models, and never leaves your environment unless you say so. Handled to UK GDPR standards.",
  },
  {
    icon: ShieldCheck,
    title: "Human oversight where it matters",
    body: "High-impact actions route to a human before they happen. Every system has a kill-switch and can roll back to a known-good state. The agents act; you keep control.",
  },
  {
    icon: Activity,
    title: "Operated, not abandoned",
    body: "We monitor every system, tune it, and catch edge cases as they appear. Reliability isn’t a promise we make once — it’s the work we do every month.",
  },
];

export default function TrustClient() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="bg-void pt-32 pb-10">
        <SectionContainer>
          <Reveal>
            <p className="text-cyan font-mono text-xs tracking-[0.2em] uppercase mb-4">
              {`// trust`}
            </p>
          </Reveal>
          <h1 className="font-heading text-ghost text-4xl md:text-5xl lg:text-6xl uppercase font-semibold leading-tight mb-6">
            <TypewriterText
              text={"Built to be trusted with your operation"}
              delay={300}
              speed={35}
            />
          </h1>
          <Reveal delay={0.1}>
            <p className="text-ghost-muted text-lg md:text-xl max-w-2xl leading-relaxed font-sans">
              We operate agent systems inside real businesses, on real data. That
              only works if it&rsquo;s safe. Here&rsquo;s how we hold that line.
            </p>
          </Reveal>
        </SectionContainer>
      </section>

      {/* Pillars */}
      <section className="bg-void pt-12 pb-24 md:pt-16 md:pb-32">
        <SectionContainer>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <Reveal key={pillar.title} delay={i * 0.1}>
                  <GlassCard tilt={false} className="h-full">
                    <div className="w-10 h-10 rounded-lg bg-cyan/[0.08] border border-cyan/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-cyan" strokeWidth={1.5} />
                    </div>
                    <h2 className="font-heading text-xl font-semibold text-white mt-5">
                      {pillar.title}
                    </h2>
                    <p className="font-sans text-ghost-muted mt-3 leading-relaxed">
                      {pillar.body}
                    </p>
                  </GlassCard>
                </Reveal>
              );
            })}
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
                Questions about how we&rsquo;d handle your data?
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-sans text-ghost-muted text-lg mt-4 max-w-2xl mx-auto">
                Tell us your requirements and we&rsquo;ll walk you through exactly how
                a system would run inside your environment.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-8">
                <MagneticButton className="inline-block">
                  <Button variant="primary" size="lg" href="/contact">
                    Talk to Us
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
