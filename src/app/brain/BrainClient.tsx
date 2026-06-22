"use client";

import { Search, RefreshCw, TrendingUp, Download, type LucideIcon } from "lucide-react";
import PageTransition from "@/components/ui/PageTransition";
import SectionContainer from "@/components/ui/SectionContainer";
import Reveal from "@/components/ui/Reveal";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import TypewriterText from "@/components/effects/TypewriterText";
import GlowOrb from "@/components/effects/GlowOrb";
import AnimatedGrid from "@/components/effects/AnimatedGrid";
import MagneticButton from "@/components/ui/MagneticButton";

const beats = [
  { when: "Day one", what: "every process and decision, captured and searchable." },
  { when: "Year one", what: "the answer to almost anything about how you operate." },
  { when: "Year ten", what: "the memory of how the whole business was built." },
];

const pillars: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Search,
    title: "Ask it anything, get it right",
    body: "Every process, policy, decision, and quirk of how your business runs, held in one place an AI can search in an instant. Your team asks in plain language and gets the right answer, not a guess. Onboarding, handovers, the endless how do we usually do this, all answered in seconds.",
  },
  {
    icon: RefreshCw,
    title: "It keeps itself current",
    body: "A knowledge base goes stale the moment people stop maintaining it. This one doesn’t. We keep it up to date, and so do the agents: every system you run writes back what it learns, so the Brain always reflects how the business works today, not how it worked last year.",
  },
  {
    icon: TrendingUp,
    title: "It compounds for years",
    body: "The longer it runs, the more it holds. What is a handy reference this year is irreplaceable in five, and in twenty it is the entire memory of how your business was built. Knowledge that used to leave with people now stays, and the value only moves one way.",
  },
  {
    icon: Download,
    title: "It’s yours, and it travels",
    body: "This is your asset, not ours. It lives in your environment, it is built around your business, and you keep it. Even if you ever moved on from us, you would walk away years ahead, holding a brain no competitor can buy and no new hire has to rebuild.",
  },
];

export default function BrainClient() {
  return (
    <PageTransition>
      {/* Hero */}
      <section className="bg-void pt-32 pb-10">
        <SectionContainer>
          <Reveal>
            <p className="text-cyan font-mono text-xs tracking-[0.2em] uppercase mb-4">
              {`// the brain`}
            </p>
          </Reveal>
          <h1 className="font-heading text-ghost text-4xl md:text-5xl lg:text-6xl uppercase font-semibold leading-tight mb-6">
            <TypewriterText text={"A brain for your business"} delay={300} speed={40} />
          </h1>
          <Reveal delay={0.1}>
            <p className="text-ghost-muted text-lg md:text-xl max-w-2xl leading-relaxed font-sans">
              A private knowledge layer that holds everything your business knows. Kept
              current, searchable in plain language, and yours to keep forever.
            </p>
          </Reveal>
        </SectionContainer>
      </section>

      {/* What it is */}
      <section className="bg-void pt-12 pb-20 md:pt-16 md:pb-28">
        <SectionContainer>
          <div className="max-w-3xl space-y-6">
            <Reveal>
              <p className="font-sans text-ghost-muted text-lg leading-[1.7]">
                Every business runs on knowledge that lives in people&rsquo;s heads and
                scattered across documents nobody can find. When someone leaves, it leaves
                with them. When you need an answer fast, it takes an afternoon and three
                phone calls.
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="font-sans text-ghost-muted text-lg leading-[1.7]">
                With every system we build, we also build you a Brain: a private knowledge
                layer that holds how your business actually works, in a form an AI can
                search in an instant. It is the foundation your agents run on, and it is
                the asset you are left holding long after the work is done.
              </p>
            </Reveal>
          </div>

          {/* What it is worth over time */}
          <div className="mt-14 space-y-4 max-w-md">
            {beats.map((beat, i) => (
              <Reveal key={beat.when} delay={i * 0.1}>
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-sm text-cyan whitespace-nowrap min-w-[90px]">
                    {beat.when}
                  </span>
                  <span className="font-sans text-base text-ghost-muted">{beat.what}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </SectionContainer>
      </section>

      {/* Pillars */}
      <section className="bg-surface section-padding">
        <SectionContainer>
          <Reveal>
            <h2 className="font-heading text-2xl md:text-3xl text-ghost uppercase font-semibold">
              Why it changes everything
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <Reveal key={pillar.title} delay={i * 0.08}>
                  <GlassCard tilt={false} className="h-full">
                    <div className="w-10 h-10 rounded-lg bg-cyan/[0.08] border border-cyan/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-cyan" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-heading text-xl font-semibold text-white mt-5">
                      {pillar.title}
                    </h3>
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
      <section className="bg-void section-padding relative overflow-hidden">
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
                Want a brain for your business?
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-sans text-ghost-muted text-lg mt-4 max-w-2xl mx-auto">
                Tell us how your business runs and we&rsquo;ll show you what your Brain
                would hold, and how your agents would keep it alive. You keep the plan
                whether you build it with us or not.
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
