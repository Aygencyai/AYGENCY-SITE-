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
            <TypewriterText text={"We build it. Then we run it."} delay={300} speed={40} />
          </h1>
          <Reveal delay={0.1}>
            <p className="text-ghost-muted text-lg md:text-xl max-w-2xl leading-relaxed font-sans">
              Aygency is an AI automation agency. We design, build, and run agent systems
              that take over the work a business would otherwise do by hand, and that get
              sharper the longer they run.
            </p>
          </Reveal>
        </SectionContainer>
      </section>

      {/* From the founders */}
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
                A word from the founders
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-sans text-ghost-muted text-lg mt-6 leading-relaxed">
                Over a year ago, the two of us first sat down to argue about where AI was
                really heading. We kept circling the same idea from opposite directions.
                Then the infrastructure for genuinely autonomous agents arrived, we finally
                had the conversation that mattered, and Erik quit his job that same day.
                Aygency has been the whole focus since. Most days have run long, a fair few
                of them past fourteen hours, because getting the foundations right is the
                part that matters most.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-12">
            <Reveal delay={0.1}>
              <div>
                <h3 className="font-heading text-xl font-semibold text-white">Louis</h3>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan mt-1">
                  Co-founder
                </p>
                <p className="font-sans text-ghost-muted leading-relaxed mt-4">
                  I grew up surrounded by it. My father and both my brothers run their own
                  businesses, so a houseful of entrepreneurs was just normal. I went to
                  Haberdashers&rsquo; Aske&rsquo;s, one of the country&rsquo;s most academic
                  schools, where most of my year was set on Oxford, Cambridge and the rest of
                  the Russell Group. I took a different leap and went straight into the
                  markets, trading AI and crypto and watching a genuine revolution play out in
                  real time. The more obsessed I got, the more I saw the same problem back in
                  my family&rsquo;s businesses: sharp people losing whole days to work a
                  machine should have been doing. The intelligence moving the markets could
                  take that weight off a business entirely, and once I saw it the opportunity
                  was impossible to ignore. I think in openings and a few moves ahead, probably
                  the chess habit showing, and Aygency is that instinct pointed at businesses:
                  find the move that quietly changes the whole board. AI completely
                  transformed my life. I want to help it transform yours, too.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div>
                <h3 className="font-heading text-xl font-semibold text-white">Erik</h3>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan mt-1">
                  Co-founder
                </p>
                <p className="font-sans text-ghost-muted leading-relaxed mt-4">
                  My background is aerospace engineering, a field where approximately right
                  is not a thing. That is exactly how I treat an agent system: every part has
                  one job, and every part has to hold under load. AI took over my interest
                  completely, and after that first conversation with Louis I handed in my
                  notice that same day. We are both perfectionists, and both a little too fond
                  of chess, which turns out to be the right kind of obsession for this. You
                  read the whole board, you protect what matters, and you keep improving the
                  position long after the game looks won. That is how we build, and how we
                  run what we build. AI shouldn&rsquo;t just hand you a pasta recipe. Used
                  properly it takes the weight off your life, clears the obstacles out of
                  your business, and accelerates everything you set out to do. That is the
                  part I want to play: helping people step into this new world of AI, and the
                  freedom that comes with it.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <p className="font-sans text-ghost text-lg leading-relaxed mt-12 max-w-3xl">
              Between us, that is the whole philosophy: build it properly, and never stop
              improving it.
            </p>
          </Reveal>
        </SectionContainer>
      </section>

      {/* The compounding effect */}
      <section className="blend-void section-padding">
        <SectionContainer>
          <div className="max-w-3xl">
            <Reveal>
              <h2 className="font-heading text-2xl md:text-3xl text-ghost uppercase font-semibold">
                Built once. Compounding forever.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-sans text-ghost-muted text-lg mt-6 leading-relaxed">
                Almost everything a business spends money on is worth the most the day it
                arrives, and a little less every day after. People, software, equipment,
                all of it. Agent systems run the other way.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="font-sans text-ghost-muted text-lg mt-5 leading-relaxed">
                Day one, the system runs the workflow. By month three it runs it better
                than any person could. By month six it&rsquo;s surfacing opportunities no
                one asked it to find. The cost you pay stays flat while the thing you own
                keeps getting more valuable.
              </p>
            </Reveal>
          </div>
        </SectionContainer>
      </section>

      {/* Stewardship, not the cause */}
      <section className="blend-surface section-padding">
        <SectionContainer>
          <div className="max-w-3xl">
            <Reveal>
              <h2 className="font-heading text-2xl md:text-3xl text-ghost uppercase font-semibold">
                We don&rsquo;t ship it and walk away.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-sans text-ghost-muted text-lg mt-6 leading-relaxed">
                The compounding is the system&rsquo;s own doing. It learns from how your
                business runs and gets sharper without being asked. What it needs from us
                is stewardship. We keep it safe, keep it honest, and keep tuning it as the
                business changes around it.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="font-sans text-ghost-muted text-lg mt-5 leading-relaxed">
                So we don&rsquo;t hand it over and move on. We run it for as long as you
                do. That&rsquo;s why a system we build keeps earning its place instead of
                quietly going stale, and it&rsquo;s why we price and contract the way we
                do.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="font-sans text-ghost-muted text-lg mt-5 leading-relaxed">
                We prove it on ourselves. The agents behind Aygency&rsquo;s own outreach,
                research, and reporting are the same ones we&rsquo;d build for you. We use
                what we sell.
              </p>
            </Reveal>
          </div>
        </SectionContainer>
      </section>

      {/* Why we exist */}
      <section className="blend-void section-padding">
        <SectionContainer>
          <div className="max-w-3xl">
            <Reveal>
              <h2 className="font-heading text-2xl md:text-3xl text-ghost uppercase font-semibold">
                Why we exist
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-sans text-ghost-muted text-lg mt-6 leading-relaxed">
                Every business has work that should run itself, and a list of things it
                would do if it could afford to hire for them. The old answer was to
                recruit a department, wait half a year, and hope it worked out. We think
                that&rsquo;s the wrong trade.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="font-sans text-ghost-muted text-lg mt-5 leading-relaxed">
                We built Aygency to give a business the capability of a department without
                the department. Shaped around how it actually works, running around the
                clock, and looked after by us.
              </p>
            </Reveal>
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
                30 minutes. We&rsquo;ll show you where agents would hit hardest in your
                operation, and you keep the plan either way.
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
