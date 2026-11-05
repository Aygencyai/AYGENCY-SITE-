"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronDown,
  LineChart,
  MessageSquare,
  Network,
  PenTool,
  Radar,
  Send,
  TrendingUp,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { agents } from "@/lib/data";

const icons: Record<string, LucideIcon> = {
  ceo: Network,
  operations: Workflow,
  analyst: LineChart,
  scout: Radar,
  outreach: Send,
  strategist: TrendingUp,
  producer: PenTool,
  frontdesk: MessageSquare,
};

type Job = { time: string; job: string; status: "running" | "waiting" | "done" };

// Sample jobs for the illustrative screen. Four per agent so the panel keeps its height.
const jobs: Record<string, Job[]> = {
  "CEO Agent": [
    { time: "Now", job: "Reading across today's work from every agent", status: "running" },
    { time: "09:30", job: "Flagged a slow handoff between sales and operations", status: "done" },
    { time: "08:00", job: "Sent you this morning's brief", status: "done" },
    { time: "07:15", job: "Spotted renewals slipping in one region", status: "done" },
  ],
  Operations: [
    { time: "Now", job: "Chasing 14 outstanding client documents", status: "running" },
    { time: "09:41", job: "Supplier payment ready for your approval", status: "waiting" },
    { time: "09:02", job: "Onboarded a new client", status: "done" },
    { time: "08:31", job: "Synced new client details across your tools", status: "done" },
  ],
  Analyst: [
    { time: "Now", job: "Reading this week's sales figures", status: "running" },
    { time: "09:12", job: "Weekly margin report ready", status: "done" },
    { time: "08:40", job: "Flagged an invoice that looks off", status: "waiting" },
    { time: "07:00", job: "Reconciled yesterday's transactions", status: "done" },
  ],
  "Lead Gen": [
    { time: "Now", job: "Scanning for companies about to hire", status: "running" },
    { time: "08:50", job: "Added 22 scored prospects to the pipeline", status: "done" },
    { time: "08:15", job: "Enriched yesterday's new leads", status: "done" },
    { time: "07:30", job: "Removed duplicates from the pipeline", status: "done" },
  ],
  Outreach: [
    { time: "Now", job: "Reading this morning's replies", status: "running" },
    { time: "09:20", job: "Warm reply ready for your team", status: "waiting" },
    { time: "08:45", job: "Sent 40 personalised first messages", status: "done" },
    { time: "08:00", job: "Followed up with last week's prospects", status: "done" },
  ],
  Strategist: [
    { time: "Now", job: "Comparing this week's outbound results", status: "running" },
    { time: "09:05", job: "New message angle ready to review", status: "waiting" },
    { time: "08:20", job: "Read what's moving in your market", status: "done" },
    { time: "07:45", job: "Ranked last month's best openers", status: "done" },
  ],
  "Content Production": [
    { time: "Now", job: "Drafting the monthly client briefing", status: "running" },
    { time: "09:15", job: "Three posts ready for your review", status: "waiting" },
    { time: "08:17", job: "Published this week's article", status: "done" },
    { time: "07:50", job: "Turned the article into social posts", status: "done" },
  ],
  "Front-Desk": [
    { time: "Now", job: "Answering a customer on chat", status: "running" },
    { time: "09:33", job: "Booked a new appointment", status: "done" },
    { time: "09:10", job: "Passed a billing query to your team", status: "done" },
    { time: "08:55", job: "Resolved a delivery question by email", status: "done" },
  ],
};

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
});

function Status({ status }: { status: Job["status"] }) {
  if (status === "running") {
    return (
      <span className="inline-flex items-center gap-2 font-sans text-xs text-cyan whitespace-nowrap">
        <motion.span
          aria-hidden
          className="w-1.5 h-1.5 rounded-full bg-cyan"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
        Running
      </span>
    );
  }
  if (status === "waiting") {
    return (
      <span className="inline-flex font-sans text-xs text-cyan border border-cyan/40 rounded-full px-2 py-0.5 whitespace-nowrap">
        Waiting for you
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 font-sans text-xs text-ghost-muted whitespace-nowrap">
      <Check className="w-3.5 h-3.5" strokeWidth={2} />
      Done
    </span>
  );
}

export default function SystemTeaser() {
  const [activeName, setActiveName] = useState("Operations");
  const [openName, setOpenName] = useState<string | null>("Operations");
  const active = agents.find((a) => a.name === activeName) ?? agents[0];
  const rows = jobs[active.name] ?? [];

  return (
    <section className="blend-void section-padding">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <motion.div {...reveal()} className="max-w-3xl">
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-cyan mb-3 lg:mb-6">{`// the agents we build`}</p>
          <h2 className="font-heading text-[1.75rem] sm:text-[2.5rem] md:text-[3rem] leading-[1.1] text-ghost uppercase font-semibold">
            If it&rsquo;s a role in your business, we can build the agent for it.
          </h2>
          <p className="lg:hidden font-sans text-[15px] sm:text-base leading-[1.55] text-ghost-muted mt-3">
            Each one does a real job like your number one employee, coordinated by a CEO Agent.
          </p>
          <p className="hidden lg:block font-sans text-lg leading-[1.7] text-ghost-muted mt-6">
            Every agent is built around one real job and does it like your number one employee.
            Together they work as a team of specialists, coordinated by a CEO Agent and backed
            by one shared Brain that knows how your business runs.
          </p>
        </motion.div>

        {/* Phone: every agent in one list. Tap one to open its day. */}
        <motion.ul {...reveal(0.1)} className="lg:hidden mt-6 border-b border-ghost/10">
          {agents.map((agent) => {
            const Icon = icons[agent.icon] ?? Network;
            const isOpen = agent.name === openName;
            return (
              <li key={agent.name} className="border-t border-ghost/10">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenName(isOpen ? null : agent.name)}
                  className="flex w-full items-center gap-3 py-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan"
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isOpen ? "text-cyan" : "text-ghost-muted"}`} strokeWidth={1.5} />
                  <span className={`font-heading text-xl font-semibold ${isOpen ? "text-white" : "text-ghost"}`}>{agent.name}</span>
                  <ChevronDown
                    className={`ml-auto w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-180 text-cyan" : "text-ghost-muted"}`}
                    strokeWidth={1.5}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden pl-8"
                    >
                      {(jobs[agent.name] ?? []).slice(0, 3).map((row) => (
                        <li key={row.job} className="py-2 last:pb-4">
                          <p className="font-sans text-[15px] leading-snug text-ghost">{row.job}</p>
                          <div className="flex items-center gap-2.5 mt-1">
                            <span className="font-mono text-xs text-ghost-muted">{row.time}</span>
                            <Status status={row.status} />
                          </div>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </motion.ul>
        <p className="lg:hidden font-sans text-xs text-ghost-muted mt-3">Illustrative. Sample data.</p>

        {/* Desktop: a list down the side, with the chosen agent's day beside it. */}
        <motion.div {...reveal(0.1)} className="hidden lg:grid mt-14 grid-cols-[300px_1fr] gap-12 items-start">
          <ul>
            {agents.map((agent) => {
              const Icon = icons[agent.icon] ?? Network;
              const isActive = agent.name === active.name;
              return (
                <li key={agent.name}>
                  <button
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveName(agent.name)}
                    className={`flex items-center gap-3 w-full whitespace-nowrap text-left font-heading text-base font-medium px-4 py-3 border-l-2 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan ${
                      isActive
                        ? "border-cyan text-white bg-cyan/[0.08]"
                        : "border-ghost/10 text-ghost-muted hover:text-ghost hover:border-ghost/30"
                    }`}
                  >
                    <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? "text-cyan" : ""}`} strokeWidth={1.5} />
                    {agent.name}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="border border-ghost/10 rounded-xl bg-void-light p-9 min-h-[515px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3 className="font-heading text-3xl font-semibold text-white">{active.name}</h3>
                <p className="font-mono text-xs uppercase tracking-[0.15em] text-cyan mt-2">
                  {active.role}
                </p>
                <p className="font-sans text-base leading-relaxed text-ghost-muted mt-4 max-w-2xl">
                  {active.description}
                </p>

                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ghost-muted mt-7 mb-1">
                  Today
                </p>
                <ul>
                  {rows.map((row) => (
                    <li
                      key={row.job}
                      className="grid grid-cols-[56px_1fr_auto] gap-x-3 items-center py-3.5 border-t border-ghost/10"
                    >
                      <span className="font-mono text-xs text-ghost-muted">{row.time}</span>
                      <span className="font-sans text-[15px] leading-snug text-ghost">{row.job}</span>
                      <span>
                        <Status status={row.status} />
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="font-sans text-xs text-ghost-muted mt-3">Illustrative screen. Sample data.</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div {...reveal(0.2)} className="mt-6 lg:mt-10">
          <Link
            href="/system"
            className="inline-flex items-center gap-2 font-heading text-[13px] font-semibold uppercase tracking-[0.15em] text-cyan transition-colors hover:text-cyan-muted"
          >
            See how the team fits together
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
