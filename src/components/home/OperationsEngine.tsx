"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  Workflow,
  LineChart,
  MessageSquare,
  ArrowLeftRight,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

type Stage = {
  icon: LucideIcon;
  label: string;
  title: string;
  body: string;
};

const stages: Stage[] = [
  {
    icon: Workflow,
    label: "Operations",
    title: "It runs the admin that eats the day",
    body: "Onboarding, approvals, data syncing between tools, chasing documents, invoice follow-up. The multi-step work that lives between your people and your systems, handled end to end and around the clock.",
  },
  {
    icon: LineChart,
    label: "Analyst",
    title: "It keeps the numbers straight",
    body: "It reconciles the figures, flags what is overdue or off, and produces the reports your team used to build by hand. On schedule, or the moment you ask for them.",
  },
  {
    icon: MessageSquare,
    label: "Front-Desk",
    title: "It fields the questions for you",
    body: "The routine inbound, the status checks, the document requests, the billing questions, all answered instantly. Anything that needs a person is routed to the right one with the full context attached.",
  },
];

function StageCard({ stage, active }: { stage: Stage; active: boolean }) {
  const Icon = stage.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <GlassCard tilt={false} className="h-full">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-cyan/[0.08] border border-cyan/20 flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-cyan" strokeWidth={1.5} />
          </div>
          <p className="font-mono text-base md:text-lg uppercase tracking-[0.18em] text-cyan font-medium">
            {stage.label}
          </p>
        </div>
        <h3 className="font-heading text-xl font-semibold text-white mt-5">
          {stage.title}
        </h3>
        <p className="font-sans text-base leading-relaxed text-ghost-muted mt-3">
          {stage.body}
        </p>
      </GlassCard>
    </motion.div>
  );
}

function Connector({ active }: { active: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={active ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center justify-center"
    >
      <span className="w-11 h-11 rounded-full border border-cyan/30 bg-cyan/[0.06] flex items-center justify-center shadow-glow-sm">
        <ArrowLeftRight className="w-5 h-5 text-cyan rotate-90 md:rotate-0" strokeWidth={1.5} />
      </span>
    </motion.div>
  );
}

export default function OperationsEngine() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <section className="blend-void section-padding">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-mono text-xs tracking-[0.2em] uppercase text-cyan mb-6"
          >
            {`// operations`}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading text-[2rem] sm:text-[2.5rem] md:text-[3rem] leading-[1.1] text-ghost uppercase font-semibold"
          >
            Reclaim the hours your operation wastes.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans text-lg leading-[1.7] text-ghost-muted mt-6"
          >
            Three agents take the repetitive operation off your team. One runs the work,
            one keeps the numbers honest, one fields the questions, and together they hand
            your people their hours back.
          </motion.p>
        </div>

        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-6 md:gap-4 mt-14 items-stretch"
        >
          <StageCard stage={stages[0]} active={isInView} />
          <Connector active={isInView} />
          <StageCard stage={stages[1]} active={isInView} />
          <Connector active={isInView} />
          <StageCard stage={stages[2]} active={isInView} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between"
        >
          <p className="font-sans text-lg leading-[1.7] text-ghost max-w-2xl">
            It runs around the clock and absorbs more every month. The admin that used to
            mean another hire just gets handled, at a fraction of the cost.
          </p>
          <Link
            href="/services/cost-reduction"
            className="inline-flex items-center gap-2 font-heading text-[13px] font-semibold uppercase tracking-[0.15em] text-cyan transition-colors hover:text-cyan-muted whitespace-nowrap"
          >
            See the cost-reduction system
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
