"use client";

import {
  Brain,
  Workflow,
  LineChart,
  Radar,
  Send,
  TrendingUp,
  PenTool,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";
import PageTransition from "@/components/ui/PageTransition";
import SectionContainer from "@/components/ui/SectionContainer";
import Reveal from "@/components/ui/Reveal";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import TypewriterText from "@/components/effects/TypewriterText";
import GlowOrb from "@/components/effects/GlowOrb";
import AnimatedGrid from "@/components/effects/AnimatedGrid";
import MagneticButton from "@/components/ui/MagneticButton";
import { agents, tiers } from "@/lib/data";
import type { Agent } from "@/types";

const iconMap: Record<string, LucideIcon> = {
  ceo: Brain,
  operations: Workflow,
  analyst: LineChart,
  scout: Radar,
  outreach: Send,
  strategist: TrendingUp,
  producer: PenTool,
  frontdesk: MessageSquare,
};

function AgentCard({ agent, highlight }: { agent: Agent; highlight?: boolean }) {
  const Icon = iconMap[agent.icon] ?? Brain;
  const anchor = agent.name.toLowerCase().replace(/\s+/g, "-");
  return (
    <div id={anchor} className="scroll-mt-28">
    <GlassCard tilt={false} className={highlight ? "border-cyan/25" : undefined}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-cyan/[0.08] border border-cyan/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-cyan" strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="font-heading text-lg font-semibold text-white">
            {agent.name}
          </h3>
          <p className="font-mono text-[11px] uppercase tracking-wider text-cyan mt-1">
            {agent.role}
          </p>
        </div>
      </div>
      <p className="font-sans text-sm leading-relaxed text-ghost-muted mt-4">
        {agent.description}
      </p>
    </GlassCard>
    </div>
  );
}

export default function SystemClient() {
  const ceo = agents.find((a) => a.group === "ceo");
  const core = agents.filter((a) => a.group === "core");
  const frontDesk = agents.find((a) => a.group === "frontdesk");

  return (
    <PageTransition>
      {/* Hero */}
      <section className="bg-void pt-32 pb-10">
        <SectionContainer>
          <Reveal>
            <p className="text-cyan font-mono text-xs tracking-[0.2em] uppercase mb-4">
              {`// the system`}
            </p>
          </Reveal>
          <h1 className="font-heading text-ghost text-4xl md:text-5xl lg:text-6xl uppercase font-semibold leading-tight mb-6 whitespace-pre-line">
            <TypewriterText text={"The Aygency System"} delay={300} speed={40} />
          </h1>
          <Reveal delay={0.1}>
            <p className="text-ghost-muted text-lg md:text-xl max-w-2xl leading-relaxed font-sans">
              A coordinated team of AI agents that runs your operation. We prescribe it
              to your business, tailor it to how you work, and operate it for you.
            </p>
          </Reveal>
        </SectionContainer>
      </section>

      {/* How the system is built */}
      <section className="bg-void pt-12 pb-24 md:pt-16 md:pb-32">
        <SectionContainer>
          <Reveal>
            <h2 className="font-heading text-2xl md:text-3xl text-ghost uppercase font-semibold">
              How the system is built
            </h2>
          </Reveal>

          {/* CEO on top */}
          {ceo && (
            <div className="mt-10">
              <Reveal>
                <p className="font-mono text-xs text-ghost-dim tracking-widest uppercase mb-4">
                  On top
                </p>
              </Reveal>
              <Reveal delay={0.05}>
                <AgentCard agent={ceo} highlight />
              </Reveal>
            </div>
          )}

          {/* Operation core */}
          <div className="mt-14">
            <Reveal>
              <p className="font-mono text-xs text-ghost-dim tracking-widest uppercase mb-4">
                The operation core
              </p>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {core.map((agent, i) => (
                <Reveal key={agent.name} delay={i * 0.06}>
                  <AgentCard agent={agent} />
                </Reveal>
              ))}
            </div>
          </div>

          {/* Front-Desk, the +1 */}
          {frontDesk && (
            <div className="mt-14">
              <Reveal>
                <p className="font-mono text-xs text-ghost-dim tracking-widest uppercase mb-4">
                  Front-Desk (the +1)
                </p>
              </Reveal>
              <Reveal delay={0.05}>
                <div className="max-w-2xl">
                  <AgentCard agent={frontDesk} highlight />
                  <p className="font-sans text-sm text-ghost-dim mt-4 leading-relaxed">
                    Customer-facing and inbound, Front-Desk doesn&rsquo;t depend on
                    the operation core. It stands alone as its own system, or bolts
                    onto any other.
                  </p>
                </div>
              </Reveal>
            </div>
          )}
        </SectionContainer>
      </section>

      {/* How much system you need — the spectrum */}
      <section className="bg-surface section-padding">
        <SectionContainer>
          <Reveal>
            <h2 className="font-heading text-2xl md:text-3xl text-ghost uppercase font-semibold">
              How much system you need
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="font-sans text-ghost-muted text-lg max-w-2xl mt-4 leading-relaxed">
              Every system starts with the CEO Agent and the specialists that fit.
              Most start with a few and grow. There&rsquo;s no fixed package.
              You run as much system as your operation needs.
            </p>
          </Reveal>

          {/* Spectrum */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 relative">
            {tiers.map((tier, i) => (
              <Reveal key={tier.name} delay={i * 0.1}>
                <div className="relative h-full rounded-xl border border-ghost/[0.06] bg-void-light/40 p-6">
                  <span className="font-mono text-xs text-cyan tracking-widest uppercase">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-heading text-xl font-semibold text-white mt-3">
                    {tier.name}
                  </h3>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-cyan mt-2">
                    {tier.composition}
                  </p>
                  <p className="font-sans text-sm text-ghost-muted mt-4 leading-relaxed">
                    {tier.blurb}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <p className="font-sans text-ghost-dim text-sm mt-8">
              Pricing is tailored to your operation. We give you the number on the
              call, with no gate and no guesswork.
            </p>
          </Reveal>
        </SectionContainer>
      </section>

      {/* We prescribe. You don't architect. */}
      <section className="bg-void section-padding">
        <SectionContainer>
          <div className="max-w-3xl">
            <Reveal>
              <h2 className="font-heading text-2xl md:text-3xl text-ghost uppercase font-semibold">
                We prescribe. You don&rsquo;t architect.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-sans text-ghost-muted text-lg mt-4 leading-relaxed">
                You shouldn&rsquo;t have to design your own AI department. We show you
                what a business like yours runs, prescribe the agents that fit, and
                tailor what each one does inside your operation. You decide; we build.
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
                See exactly what we&rsquo;d build for you
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-sans text-ghost-muted text-lg mt-4 max-w-2xl mx-auto">
                30 minutes. We&rsquo;ll prescribe the system that fits your operation and
                show you where it would hit hardest. You keep the plan whether you build
                it with us or not.
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
