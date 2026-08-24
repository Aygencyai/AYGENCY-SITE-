"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Check,
  Inbox,
  ListChecks,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react";

interface EdenIntroductionProps {
  isReturning: boolean;
  onStart: () => void;
}

interface Capability {
  icon: LucideIcon;
  number: string;
  title: string;
  description: string;
  examples: string[];
}

const capabilities: Capability[] = [
  {
    icon: Inbox,
    number: "01",
    title: "Own the incoming",
    description:
      "Eden reads the signal across messages, requests, and updates, then coordinates the right next action.",
    examples: ["Triage what matters", "Prepare replies", "Route the next action"],
  },
  {
    icon: ListChecks,
    number: "02",
    title: "Keep work moving",
    description:
      "She carries context between people, tools, and specialist agents so every hand-off has an owner.",
    examples: ["Coordinate follow-ups", "Track open actions", "Surface blockers early"],
  },
  {
    icon: MessageSquareText,
    number: "03",
    title: "Prepare the decision",
    description:
      "Eden brings the context together before you need it, turning scattered information into a clear next move.",
    examples: ["Build concise briefs", "Summarise the signal", "Escalate with context"],
  },
];

const operatingSteps = [
  {
    number: "01",
    title: "She learns the rhythm",
    description:
      "Eden is shaped around your priorities, recurring work, systems, and preferred way of operating.",
  },
  {
    number: "02",
    title: "She coordinates the specialists",
    description:
      "Eden brings in the right specialist, carries the context forward, and keeps the operational thread intact.",
  },
  {
    number: "03",
    title: "She acts within bounds",
    description:
      "You decide where Eden may act, where approval is required, and what must always stay human-led.",
  },
  {
    number: "04",
    title: "She brings you the exception",
    description:
      "Instead of making you monitor everything, Eden brings you the decisions that genuinely need your judgment.",
  },
];

const entrance = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

export default function EdenIntroduction({
  isReturning,
  onStart,
}: EdenIntroductionProps) {
  return (
    <div>
      <section className="grid min-h-[calc(100svh-9rem)] items-center gap-12 py-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:gap-16 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-3 text-cyan">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan/25 bg-cyan/[0.06]">
              <Sparkles size={16} aria-hidden="true" />
            </span>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em]">
              Meet Eden // AI personal assistant
            </p>
          </div>
          <h1
            id="eden-phase-heading"
            className="mt-7 max-w-4xl font-heading text-[34px] font-bold uppercase leading-[0.95] text-white min-[400px]:text-[40px] sm:text-[54px] lg:text-[56px] xl:text-[68px]"
          >
            Meet Eden. Your new AI personal assistant.
          </h1>
          <p className="mt-7 max-w-2xl font-sans text-base leading-relaxed text-ghost-muted sm:text-xl">
            Eden gives you one clear point of contact for the AI agent system
            working around you. She coordinates the right specialists, keeps
            the operational thread moving, and brings you the decisions that
            need your judgment.
          </p>
          <p className="mt-5 max-w-xl border-l border-cyan/30 pl-4 font-sans text-sm leading-relaxed text-ghost sm:text-base">
            Your personal interface to Aygency&rsquo;s specialist-agent system,
            built around how you and your business actually work.
          </p>
          <div className="mt-9 flex flex-col items-start gap-3 min-[440px]:flex-row sm:gap-4">
            <a
              href="#eden-capabilities"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-cyan px-8 py-3 font-heading text-[13px] font-semibold uppercase tracking-[0.15em] text-void transition-all duration-200 hover:brightness-110 hover:shadow-glow-sm active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/40 focus-visible:ring-offset-2 focus-visible:ring-offset-void"
            >
              See how Eden works
              <ArrowRight size={16} aria-hidden="true" />
            </a>
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-cyan/30 px-8 py-3 font-heading text-[13px] font-semibold uppercase tracking-[0.15em] text-cyan transition-all duration-200 hover:border-cyan/50 hover:bg-cyan/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/40"
            >
              Talk to us
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.12,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative mx-auto w-full max-w-lg"
        >
          <div className="absolute -inset-8 rounded-full bg-cyan/[0.06] blur-3xl" />
          <div className="relative overflow-hidden rounded-2xl border border-cyan/20 bg-void-light/90 shadow-glow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-ghost/[0.08] px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-40" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan" />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">
                  Eden // Active
                </span>
              </div>
              <Bot size={17} className="text-ghost-dim" aria-hidden="true" />
            </div>

            <div className="p-5 sm:p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ghost-dim">
                Your operating brief
              </p>
              <p className="mt-3 font-heading text-xl font-semibold uppercase leading-tight text-ghost sm:text-2xl">
                The work is moving. You only need the signal.
              </p>

              <div className="mt-7 space-y-3">
                {[
                  ["Priority inbox", "12 sorted · 3 need you"],
                  ["Open actions", "7 moving · 1 blocked"],
                  ["Next decision", "Brief ready for review"],
                ].map(([label, status], index) => (
                  <div
                    key={label}
                    className="flex items-start justify-between gap-4 rounded-xl border border-ghost/[0.07] bg-surface/70 p-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-cyan/[0.07] font-mono text-[10px] text-cyan-muted">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="font-sans text-sm text-ghost">
                        {label}
                      </span>
                    </div>
                    <span className="max-w-[145px] text-right font-mono text-[9px] uppercase leading-relaxed tracking-[0.1em] text-ghost-muted">
                      {status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-start gap-3 rounded-xl border border-cyan/15 bg-cyan/[0.04] p-4">
                <ShieldCheck
                  size={16}
                  className="mt-0.5 flex-none text-cyan"
                  aria-hidden="true"
                />
                <p className="font-sans text-xs leading-relaxed text-ghost-muted">
                  Eden works to the permissions you set and escalates the
                  moments that require human judgment.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section
        id="eden-capabilities"
        className="scroll-mt-28 border-y border-ghost/[0.08] py-20 sm:py-24"
      >
        <motion.div {...entrance} className="max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan">
            What Eden can do
          </p>
          <h2 className="mt-5 font-heading text-[32px] font-semibold uppercase leading-[1.05] text-ghost sm:text-[44px] lg:text-[48px]">
            One assistant. The right specialist for every job.
          </h2>
          <p className="mt-5 max-w-2xl font-sans text-base leading-relaxed text-ghost-muted sm:text-lg">
            Eden coordinates the recurring work around your role. The right
            specialist handles each job while she keeps the context, priorities,
            and hand-offs connected.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {capabilities.map((capability, index) => {
            const Icon = capability.icon;
            return (
              <motion.article
                key={capability.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.11,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ y: -4 }}
                className="group rounded-2xl border border-ghost/[0.08] bg-surface/70 p-6 transition-colors hover:border-cyan/20 sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan/15 bg-cyan/[0.05] text-cyan">
                    <Icon size={19} aria-hidden="true" />
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.16em] text-ghost-dim">
                    {capability.number}
                  </span>
                </div>
                <h3 className="mt-7 font-heading text-xl font-semibold uppercase text-ghost">
                  {capability.title}
                </h3>
                <p className="mt-3 font-sans text-sm leading-relaxed text-ghost-muted">
                  {capability.description}
                </p>
                <ul className="mt-6 space-y-3 border-t border-ghost/[0.07] pt-5">
                  {capability.examples.map((example) => (
                    <li
                      key={example}
                      className="flex items-center gap-3 font-sans text-xs text-ghost"
                    >
                      <Check size={13} className="text-cyan" aria-hidden="true" />
                      {example}
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-12 py-20 sm:py-24 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <motion.div {...entrance}>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan">
            How Eden operates
          </p>
          <h2 className="mt-5 font-heading text-[32px] font-semibold uppercase leading-[1.05] text-ghost sm:text-[44px]">
            Proactive by design. Controlled by you.
          </h2>
          <p className="mt-5 font-sans text-base leading-relaxed text-ghost-muted">
            Eden follows the operating rhythm you define. She prepares what
            comes next, coordinates the specialists behind her, and works within
            clear boundaries from day one.
          </p>
          <div className="mt-8 rounded-2xl border border-cyan/15 bg-cyan/[0.04] p-5 sm:p-6">
            <div className="flex items-center gap-3 text-cyan">
              <Workflow size={18} aria-hidden="true" />
              <p className="font-mono text-[10px] uppercase tracking-[0.16em]">
                Built around your operation
              </p>
            </div>
            <p className="mt-4 font-sans text-sm leading-relaxed text-ghost-muted">
              Your version of Eden coordinates the specialists your operation
              needs, from executive assistance and customer work to operations,
              finance, knowledge, and growth.
            </p>
          </div>
        </motion.div>

        <div className="divide-y divide-ghost/[0.08] border-y border-ghost/[0.08]">
          {operatingSteps.map((step, index) => (
            <motion.div
              key={step.number}
              data-eden-operating-step
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.7,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="grid gap-3 py-6 sm:grid-cols-[52px_1fr] sm:gap-5"
            >
              <span className="font-mono text-xs text-cyan-muted">
                {step.number}
              </span>
              <div>
                <h3 className="font-heading text-lg font-semibold uppercase text-ghost">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xl font-sans text-sm leading-relaxed text-ghost-muted">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <motion.section
        {...entrance}
        className="relative mb-8 overflow-hidden rounded-2xl border border-cyan/20 bg-cyan px-6 py-10 text-void sm:px-10 sm:py-12 lg:px-12"
      >
        <div className="absolute inset-y-0 right-0 w-2/3 bg-gradient-to-l from-white/20 to-transparent opacity-30" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12">
          <div className="max-w-3xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-void/60">
              Make Eden yours
            </p>
            <h2 className="mt-4 font-heading text-[30px] font-semibold uppercase leading-[1.02] text-void sm:text-[40px] lg:text-[48px]">
              See what Eden could do for your operation.
            </h2>
            <p className="mt-4 max-w-2xl font-sans text-sm leading-relaxed text-void/70 sm:text-base">
              Tell us where work slows down and how you want to stay in control.
              We&rsquo;ll map a practical first version of Eden around your priorities.
            </p>
          </div>
          <button
            type="button"
            onClick={onStart}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-void px-8 py-4 font-heading text-[13px] font-semibold uppercase tracking-[0.15em] text-ghost transition-all duration-200 hover:bg-void-light hover:text-white active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-void/40 focus-visible:ring-offset-2 focus-visible:ring-offset-cyan lg:w-auto"
          >
            {isReturning
              ? "Continue exploring your Eden"
              : "See what Eden could do for you"}
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </motion.section>
    </div>
  );
}
