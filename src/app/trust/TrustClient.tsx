"use client";

import { Lock, Layers, ShieldCheck, Activity, type LucideIcon } from "lucide-react";
import Link from "next/link";
import PageTransition from "@/components/ui/PageTransition";
import SectionContainer from "@/components/ui/SectionContainer";
import Reveal from "@/components/ui/Reveal";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import TypewriterText from "@/components/effects/TypewriterText";
import GlowOrb from "@/components/effects/GlowOrb";
import AnimatedGrid from "@/components/effects/AnimatedGrid";
import MagneticButton from "@/components/ui/MagneticButton";

const ncscUrl =
  "https://www.ncsc.gov.uk/blogs/managing-the-cyber-risk-of-agentic-ai";

const ncscControls: { title: string; body: string }[] = [
  {
    title: "Human approval before high-impact actions",
    body: "The NCSC calls this human in the loop: a person approves actions before they happen. High-impact work waits in the command centre for you to sign off.",
  },
  {
    title: "Limited access per agent",
    body: "The NCSC advises restricting an agent to the resources its task needs. Each Aygency agent gets only the tools and data its role requires.",
  },
  {
    title: "Full logs of what agents do",
    body: "The NCSC asks for agent activity to be logged and available to review. Every action is recorded, so you can see what each agent did.",
  },
  {
    title: "Written red lines agents can't cross",
    body: "The NCSC asks you to set red lines the system must stay within. We agree those rules with you before anything goes live.",
  },
  {
    title: "Pause or stop an agent instantly",
    body: "The NCSC says you should always be able to halt an agent at once. Every Aygency system can be paused or stopped whenever you choose.",
  },
];

const pillars: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Lock,
    title: "Your data, handled with care",
    body: "Every system is built privacy-first. Your data is used only to run your system and never trains external models. GDPR-aligned data handling with a DPA available.",
  },
  {
    icon: Layers,
    title: "Kept separate for every client",
    body: "Each client's system and data are kept separate from every other client's. What your agents learn about your business is used to run your business, and nobody else's.",
  },
  {
    icon: ShieldCheck,
    title: "Human oversight where it matters",
    body: "Everything runs through one command centre. Agents act, and high-impact actions come to you for approval before they happen. Every system can be paused and rolled back to a known-good state.",
  },
  {
    icon: Activity,
    title: "Operated for as long as you run it",
    body: "We monitor every system, tune it and handle edge cases as they appear. Reliability is work we do every month, and the system keeps improving as a result.",
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
              Our agents work inside real businesses, on real data, so safety and
              control are built into every system from the start. Here&rsquo;s how.
            </p>
          </Reveal>
        </SectionContainer>
      </section>

      {/* Pillars */}
      <section className="blend-void pt-12 pb-24 md:pt-16 md:pb-32">
        <SectionContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* How we line up with NCSC guidance */}
      <section id="ncsc-guidance" className="blend-void pb-24 md:pb-32 scroll-mt-28">
        <SectionContainer>
          <Reveal>
            <p className="text-cyan font-mono text-xs tracking-[0.2em] uppercase mb-4">
              {`// ncsc guidance`}
            </p>
            <h2 className="font-heading text-2xl md:text-3xl text-white uppercase font-semibold">
              How we line up with NCSC guidance on agentic AI
            </h2>
            <p className="font-sans text-ghost-muted text-lg mt-4 max-w-3xl leading-relaxed">
              The UK&rsquo;s National Cyber Security Centre published{" "}
              <Link
                href={ncscUrl}
                className="text-cyan font-medium underline-offset-4 hover:underline"
              >
                Managing the cyber risk of agentic AI
              </Link>{" "}
              on 20 August 2026, setting out how to run agents safely. These are
              the controls from that guidance that we already build into every
              system.
            </p>
          </Reveal>
          <div className="mt-10 space-y-8 max-w-3xl">
            {ncscControls.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.05}>
                <div>
                  <h3 className="font-heading text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="font-sans text-ghost-muted mt-2 leading-relaxed">
                    {item.body}
                  </p>
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
                Questions about how we&rsquo;d handle your data?
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-sans text-ghost-muted text-lg mt-4 max-w-2xl mx-auto">
                Tell us your requirements and we&rsquo;ll walk you through exactly how
                a system would handle your data.
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
