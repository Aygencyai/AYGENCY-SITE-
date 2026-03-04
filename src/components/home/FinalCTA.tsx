"use client";

import SectionContainer from "@/components/ui/SectionContainer";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

export default function FinalCTA() {
  return (
    <section className="bg-secondary section-padding">
      <SectionContainer>
        <div className="text-center max-w-2xl mx-auto">
          <Reveal>
            <h2 className="font-heading font-semibold text-3xl md:text-4xl text-text-primary">
              Ready to stop talking about AI and start using it?
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="font-body text-lg text-text-secondary mt-4">
              Book a free discovery call. We&rsquo;ll diagnose your
              highest-impact opportunity in 30 minutes.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-8">
              <Button variant="primary" size="lg" href="/contact">
                Book a Discovery Call
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="text-sm text-text-tertiary mt-4">
              No commitment. No sales pitch. Just a conversation about what AI
              can do for your business.
            </p>
          </Reveal>
        </div>
      </SectionContainer>
    </section>
  );
}
