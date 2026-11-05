"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check } from "lucide-react";
import Faq from "@/components/ui/Faq";
import MagneticButton from "@/components/ui/MagneticButton";
import type { Faq as FaqItem } from "@/types";
import BeforeAfterDrawing, { type BeforeAfterContent } from "./BeforeAfterDrawing";
import { SampleNote } from "./ProductScreens";

export type TourStop = {
  eyebrow: string;
  title: string;
  text: string;
  steps: string[];
  picture: ReactNode;
};

export type ServiceTourContent = {
  eyebrow: string;
  promise: [string, string, string];
  intro: string;
  heroDesktop: ReactNode;
  heroPhone: ReactNode;
  toolsHeading: string;
  drawing: BeforeAfterContent;
  tour: TourStop[];
  getBackLine: [string, string];
  getBackText: string;
  getBack: { title: string; text: string }[];
  closing: string;
  faqs: FaqItem[];
};

const howWeWork = [
  { title: "Your tools stay", text: "Your team keeps working the way it does today. The agents work inside what you already use." },
  { title: "Proven first", text: "Each workflow is proven on your own history before it goes live." },
  { title: "You approve", text: "Nothing high-impact happens without your team’s say-so." },
  { title: "We run it, always", text: "We monitor it, fix it and keep improving it, so your team never has to maintain anything." },
];

const running = [
  "Your AI strategy, every month",
  "Training for each person, and anyone new",
  "All AI and hosting costs",
  "Monitoring and fixes",
  "Changes whenever your process changes",
  "Upgrades as better models come out",
  "Your Brain kept current",
];

const label = "font-mono text-[11px] uppercase tracking-[0.18em]";
const wrap = "max-w-6xl mx-auto px-6 md:px-8";
const bodyText = "font-sans text-base lg:text-lg leading-[1.65] text-ghost-muted";

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
});

function AuditButton() {
  return (
    <MagneticButton className="inline-block">
      <Link
        href="/audit"
        className="inline-block rounded-lg bg-cyan px-6 sm:px-8 py-3 text-center font-heading text-[13px] font-semibold uppercase tracking-[0.15em] text-void transition-all duration-200 hover:brightness-110 hover:shadow-glow-sm"
      >
        Book your free AI growth audit
      </Link>
    </MagneticButton>
  );
}

function TourRow({ stop, flip }: { stop: TourStop; flip: boolean }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-7 items-center">
      <motion.div {...reveal()} className={flip ? "lg:order-2" : ""}>
        <p className={`${label} text-ghost-muted mb-3`}>{stop.eyebrow}</p>
        <h3 className="font-heading text-[1.75rem] lg:text-[2.5rem] leading-[1.08] font-semibold text-white">{stop.title}</h3>
        <p className={`${bodyText} mt-3 lg:mt-4`}>{stop.text}</p>
        <p className={`${label} text-cyan mt-5 lg:mt-7 mb-3`}>What the AI is doing</p>
        <ol className="space-y-2.5">
          {stop.steps.map((step) => (
            <li key={step} className="grid grid-cols-[18px_1fr] gap-2.5 font-sans text-[15px] leading-snug text-ghost">
              <Check className="w-4 h-4 text-cyan mt-0.5" strokeWidth={2} />
              {step}
            </li>
          ))}
        </ol>
      </motion.div>
      <motion.div {...reveal(0.1)} className={flip ? "lg:order-1" : ""}>
        {stop.picture}
      </motion.div>
    </div>
  );
}

// The service page shape Louis chose (layout A): the page walks through the product itself,
// showing what the AI is doing at each stop. Every section starts on the colour the last one ended on.
export default function ServiceTourPage({ content }: { content: ServiceTourContent }) {
  return (
    <>
      <section className="blend-void pt-28 lg:pt-36 pb-16 lg:pb-28 overflow-hidden">
        <div className={wrap}>
          <motion.div {...reveal()}>
            <p className={`${label} text-cyan mb-5`}>{`// ${content.eyebrow}`}</p>
            <h1 className="font-heading text-[2.5rem] sm:text-[3.25rem] lg:text-[4.5rem] leading-[0.98] tracking-[-0.01em] uppercase font-bold text-white">
              <span className="block">{content.promise[0]}</span>
              <span className="block">{content.promise[1]}</span>
              <span className="block text-cyan">{content.promise[2]}</span>
            </h1>
            <p className={`${bodyText} mt-5 lg:mt-7 max-w-2xl`}>{content.intro}</p>
            <div className="mt-6 lg:mt-8">
              <AuditButton />
            </div>
          </motion.div>
          <motion.div {...reveal(0.15)} className="mt-12 lg:mt-16">
            <div className="hidden lg:block">{content.heroDesktop}</div>
            <div className="lg:hidden">{content.heroPhone}</div>
          </motion.div>
          <SampleNote className="mt-4 lg:mt-14" />
        </div>
      </section>

      {/* Before and after. Flat surface: the hero ends on it and the tour starts on it. */}
      <section className="bg-surface section-padding overflow-hidden">
        <div className={wrap}>
          <motion.h2
            {...reveal()}
            className="max-w-4xl font-heading text-[2rem] sm:text-[2.5rem] md:text-[3rem] leading-[1.08] text-ghost uppercase font-semibold"
          >
            {content.toolsHeading}
          </motion.h2>
          <motion.div {...reveal(0.1)}>
            <BeforeAfterDrawing content={content.drawing} />
          </motion.div>
        </div>
      </section>

      <section className="blend-surface section-padding">
        <h2 className="sr-only">What it can do</h2>
        <div className={`${wrap} space-y-16 lg:space-y-32`}>
          {content.tour.map((stop, i) => (
            <TourRow key={stop.eyebrow} stop={stop} flip={i % 2 === 1} />
          ))}
          <SampleNote className="!mt-8 lg:!mt-12" />
        </div>
      </section>

      <section className="blend-void section-padding">
        <div className={`${wrap} grid grid-cols-1 lg:grid-cols-[6fr_5fr] gap-y-9 gap-x-20 items-start`}>
          <motion.div {...reveal()}>
            <p className={`${label} text-cyan mb-5`}>{`// what you get back`}</p>
            <h2 className="font-heading text-[2.25rem] sm:text-[3rem] lg:text-[4.25rem] leading-[1.02] tracking-[-0.01em] uppercase font-semibold text-white">
              {content.getBackLine[0]}
              <br />
              <span className="text-cyan">{content.getBackLine[1]}</span>
            </h2>
            <p className={`${bodyText} mt-5 lg:mt-6`}>{content.getBackText}</p>
          </motion.div>
          <ul>
            {content.getBack.map((item, i) => (
              <motion.li
                key={item.title}
                {...reveal(i * 0.08)}
                className="grid grid-cols-1 sm:grid-cols-[110px_1fr] gap-x-5 gap-y-1 py-4 lg:py-5 border-t border-ghost/15"
              >
                <span className="font-heading text-lg font-semibold text-white">{item.title}</span>
                <span className="font-sans text-[15px] lg:text-base leading-relaxed text-ghost-muted">{item.text}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      <section className="blend-surface section-padding">
        <div className={wrap}>
          <p className={`${label} text-cyan mb-5`}>{`// how we work`}</p>
          <ul className="grid grid-cols-1 lg:grid-cols-4 lg:gap-8">
            {howWeWork.map((item, i) => (
              <motion.li key={item.title} {...reveal(i * 0.08)} className="border-t border-ghost/15 py-4 lg:py-5">
                <h3 className="font-heading text-lg font-semibold text-white">{item.title}</h3>
                <p className="font-sans text-[15px] leading-relaxed text-ghost-muted mt-1.5">{item.text}</p>
              </motion.li>
            ))}
          </ul>
          <div className="mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-x-20 gap-y-5">
            <h3 className="font-heading text-2xl lg:text-3xl font-semibold leading-tight text-ghost">What running it can include</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
              {running.map((item) => (
                <li key={item} className="grid grid-cols-[18px_1fr] gap-2.5 font-sans text-[15px] leading-snug text-ghost-muted">
                  <Check className="w-4 h-4 text-cyan mt-0.5" strokeWidth={2} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Faq items={content.faqs} />

      <section className="bg-void pb-20 lg:pb-32 pt-4">
        <motion.div {...reveal()} className="max-w-3xl mx-auto px-6 md:px-8 text-center">
          <p className="font-heading text-[1.75rem] sm:text-4xl lg:text-5xl leading-[1.08] uppercase font-semibold text-ghost">
            {content.closing}
          </p>
          <div className="mt-7">
            <AuditButton />
          </div>
        </motion.div>
      </section>
    </>
  );
}
