"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ServiceCards } from "@/components/home/ServicesGrid";
import MagneticButton from "@/components/ui/MagneticButton";
import PageTransition from "@/components/ui/PageTransition";

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
});

// A simple way in: every service one click away. The selling happens on each service's own page.
export default function ServicesClient() {
  return (
    <PageTransition>
      <section className="blend-void pt-28 lg:pt-36 pb-16 lg:pb-24">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <motion.div {...reveal()} className="max-w-3xl">
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-cyan mb-5 lg:mb-6">{`// our services`}</p>
            <h1 className="font-heading text-[2.25rem] sm:text-[3rem] lg:text-[3.75rem] leading-[1.02] uppercase font-bold text-white">
              Start at the core. <span className="text-cyan">Build out from there.</span>
            </h1>
            <p className="font-sans text-base lg:text-lg leading-[1.65] text-ghost-muted mt-5 lg:mt-6">
              Most engagements start with the command centre and the back-office agents that can save a business hundreds
              of hours a week. From there we build out the rest, all designed around how your business already works.
            </p>
          </motion.div>
          <motion.div {...reveal(0.1)} className="mt-10 lg:mt-14">
            <ServiceCards />
          </motion.div>
        </div>
      </section>

      <section className="blend-surface section-padding">
        <motion.div {...reveal()} className="max-w-3xl mx-auto px-6 md:px-8 text-center">
          <h2 className="font-heading text-[1.75rem] sm:text-4xl lg:text-5xl leading-[1.08] uppercase font-semibold text-ghost">
            Not sure which system you need?
          </h2>
          <p className="font-sans text-base lg:text-lg leading-[1.65] text-ghost-muted mt-4">
            Most clients start with a conversation. Tell us where things slow down and we&rsquo;ll map the system that
            would make the biggest difference. You keep the plan whether you build it with us or not.
          </p>
          <div className="mt-7">
            <MagneticButton className="inline-block">
              <Link
                href="/audit"
                className="inline-block rounded-lg bg-cyan px-6 sm:px-8 py-3 text-center font-heading text-[13px] font-semibold uppercase tracking-[0.15em] text-void transition-all duration-200 hover:brightness-110 hover:shadow-glow-sm"
              >
                Book your free AI growth audit
              </Link>
            </MagneticButton>
          </div>
        </motion.div>
      </section>
    </PageTransition>
  );
}
