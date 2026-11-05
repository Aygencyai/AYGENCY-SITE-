"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Bot, CheckCircle2, Database, Users, type LucideIcon } from "lucide-react";

// Where the work is spread today. x and y are % of the drawing, used only from lg up.
const tools: { name: string; x: number; y: number }[] = [
  { name: "Excel", x: 10, y: 7 },
  { name: "Outlook", x: 30, y: 19 },
  { name: "HubSpot", x: 46, y: 31 },
  { name: "Xero", x: 8, y: 43 },
  { name: "SharePoint", x: 28, y: 55 },
  { name: "Slack", x: 47, y: 67 },
  { name: "People\u2019s heads", x: 13, y: 79 },
  { name: "Google Sheets", x: 34, y: 91 },
];

const rows: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Users, title: "Your people", body: "oversight and expertise" },
  { icon: Bot, title: "Your agents", body: "working alongside your team" },
  { icon: Database, title: "Your data", body: "in one place" },
  { icon: CheckCircle2, title: "Approvals", body: "anything high-impact comes to you" },
];

// The point on the panel's left edge each line lands on, spread evenly down it.
const landing = (i: number) => 26 + (i / (tools.length - 1)) * 48;
const panelEdge = 58;

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
});

function Panel() {
  return (
    <div className="rounded-xl border border-cyan/50 bg-void p-6 lg:p-7 shadow-glow-sm">
      <div className="flex items-center gap-2.5 mb-4">
        <svg viewBox="190 220 663 600" fill="currentColor" aria-hidden className="w-5 text-cyan">
          <path d="M487 242H638L367 797H213Z" />
          <path d="M583 592H715L830 797H693Z" />
        </svg>
        <span className="font-heading text-xl font-semibold text-white">Command centre</span>
      </div>
      {rows.map(({ icon: Icon, title, body }) => (
        <div key={title} className="grid grid-cols-[32px_1fr] items-start gap-y-0.5 py-3.5 border-t border-ghost/10">
          <Icon className="w-5 h-5 text-cyan mt-0.5" strokeWidth={1.5} />
          <div>
            <p className="font-sans font-medium text-ghost leading-snug">{title}</p>
            <p className="font-sans text-sm text-ghost-muted leading-snug mt-0.5">{body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Desktop: every tool is joined by a line to the one panel, so it reads as a single picture.
function DesktopDrawing() {
  return (
    <div className="hidden lg:block relative h-[440px]">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        fill="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="core-line" gradientUnits="userSpaceOnUse" x1="5" y1="0" x2={panelEdge} y2="0">
            <stop offset="0" stopColor="#EAEAF0" stopOpacity="0.14" />
            <stop offset="1" stopColor="#00E5FF" stopOpacity="0.85" />
          </linearGradient>
        </defs>
        {tools.map((t, i) => (
          <path
            key={t.name}
            d={`M${t.x} ${t.y}C${panelEdge - 7} ${t.y} ${panelEdge - 7} ${landing(i)} ${panelEdge} ${landing(i)}`}
            stroke="url(#core-line)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      {tools.map((t, i) => (
        <motion.span
          key={t.name}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.05 }}
          style={{ left: `${t.x}%`, top: `${t.y}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-ghost/20 bg-surface px-4 py-2 font-sans text-[15px] text-ghost-muted whitespace-nowrap"
        >
          {t.name}
        </motion.span>
      ))}

      <div className="absolute right-0 inset-y-0 flex items-center" style={{ left: `${panelEdge}%` }}>
        <motion.div {...reveal(0.35)} className="w-full">
          <Panel />
        </motion.div>
      </div>
    </div>
  );
}

// Phone: its own composition. Tools sit in a tight cluster, lines funnel down into the panel.
function PhoneDrawing() {
  return (
    <div className="lg:hidden">
      <ul className="flex flex-wrap justify-center gap-2">
        {tools.map((t) => (
          <li
            key={t.name}
            className="rounded-full border border-ghost/20 bg-surface px-3.5 py-1.5 font-sans text-sm text-ghost-muted whitespace-nowrap"
          >
            {t.name}
          </li>
        ))}
      </ul>
      <svg viewBox="0 0 320 64" className="w-full h-16 my-1" fill="none" aria-hidden preserveAspectRatio="none">
        <defs>
          <linearGradient id="core-funnel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#EAEAF0" stopOpacity="0.14" />
            <stop offset="1" stopColor="#00E5FF" stopOpacity="0.85" />
          </linearGradient>
        </defs>
        {[20, 62, 104, 146, 174, 216, 258, 300].map((x) => (
          <path
            key={x}
            d={`M${x} 0C${x} 34 160 26 160 64`}
            stroke="url(#core-funnel)"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <Panel />
    </div>
  );
}

export default function SystemCore() {
  return (
    <section className="bg-surface section-padding">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[6fr_5fr] gap-5 lg:gap-16 items-end">
          <motion.div {...reveal()}>
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-cyan mb-5 lg:mb-6">{`// the command centre`}</p>
            <h2 className="font-heading text-[2rem] sm:text-[2.5rem] md:text-[3rem] leading-[1.1] text-ghost uppercase font-semibold">
              One home for your people and your agents.
            </h2>
          </motion.div>
          <motion.div {...reveal(0.1)} className="font-sans text-base lg:text-lg leading-[1.7]">
            <p className="text-ghost">
              The bottleneck is rarely the work itself. It&rsquo;s the separate systems the work is spread across.
            </p>
            <p className="text-ghost-muted mt-3 lg:mt-4">
              Your information already lives somewhere: in Excel, Outlook, Xero, HubSpot. We go to it. We connect to the
              tools you already use, learn how the work really gets done, and build every agent
              around your people and your way of doing things.
            </p>
          </motion.div>
        </div>

        <motion.div {...reveal(0.1)} className="mt-9 lg:mt-12">
          <DesktopDrawing />
          <PhoneDrawing />
        </motion.div>

        <motion.div
          {...reveal(0.2)}
          className="mt-9 lg:mt-12 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5"
        >
          <p className="font-heading text-xl lg:text-2xl font-medium leading-snug text-ghost max-w-2xl">
            More operational capacity without more headcount.
          </p>
          <Link
            href="/services/command-centre"
            className="inline-flex items-center gap-2 font-heading text-[13px] font-semibold uppercase tracking-[0.15em] text-cyan transition-colors hover:text-cyan-muted"
          >
            Explore Command Centre
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
