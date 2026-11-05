"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Check,
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
  const railRef = useRef<HTMLUListElement>(null);
  const active = agents.find((a) => a.name === activeName) ?? agents[0];
  const rows = jobs[active.name] ?? [];

  const choose = (name: string, target: HTMLElement) => {
    setActiveName(name);
    // On a phone the agents are a sideways rail: bring the chosen one to the middle.
    const rail = railRef.current;
    if (rail && rail.scrollWidth > rail.clientWidth) {
      rail.scrollTo({ left: target.offsetLeft - rail.clientWidth / 2 + target.offsetWidth / 2, behavior: "smooth" });
    }
  };

  return (
    <section className="blend-void section-padding">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <motion.div {...reveal()} className="max-w-3xl">
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-cyan mb-5 lg:mb-6">{`// the agents we build`}</p>
          <h2 className="font-heading text-[2rem] sm:text-[2.5rem] md:text-[3rem] leading-[1.1] text-ghost uppercase font-semibold">
            If it&rsquo;s a role in your business, we can build the agent for it.
          </h2>
          <p className="font-sans text-base lg:text-lg leading-[1.7] text-ghost-muted mt-5 lg:mt-6">
            Every agent is built around one real job and does it like your number one employee.
            Together they work as a team of specialists, coordinated by a CEO Agent and backed
            by one shared Brain that knows how your business runs.
          </p>
        </motion.div>

        <motion.div
          {...reveal(0.1)}
          className="mt-9 lg:mt-14 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 lg:gap-12 items-start"
        >
          {/* Phone: a sideways rail of pills you swipe. Desktop: a list down the side. */}
          <ul
            ref={railRef}
            className="relative flex lg:block gap-2 -mx-6 md:-mx-8 lg:mx-0 px-6 md:px-8 lg:px-0 overflow-x-auto lg:overflow-visible scrollbar-hide snap-x"
          >
            {agents.map((agent) => {
              const Icon = icons[agent.icon] ?? Network;
              const isActive = agent.name === active.name;
              return (
                <li key={agent.name} className="snap-center flex-shrink-0">
                  <button
                    type="button"
                    aria-pressed={isActive}
                    onClick={(e) => choose(agent.name, e.currentTarget.parentElement as HTMLElement)}
                    className={`flex items-center gap-2.5 lg:gap-3 w-full whitespace-nowrap text-left font-heading text-[15px] lg:text-base font-medium px-4 py-2.5 lg:py-3 rounded-full lg:rounded-none border lg:border-0 lg:border-l-2 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan ${
                      isActive
                        ? "border-cyan text-white bg-cyan/[0.08]"
                        : "border-ghost/15 lg:border-ghost/10 text-ghost-muted hover:text-ghost hover:border-ghost/30"
                    }`}
                  >
                    <Icon
                      className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? "text-cyan" : ""}`}
                      strokeWidth={1.5}
                    />
                    {agent.name}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Phone: runs edge to edge like an app screen. Desktop: a framed panel. */}
          <div className="-mx-6 md:mx-0 border-y md:border border-ghost/10 md:rounded-xl bg-void-light px-6 py-7 md:p-9 sm:min-h-[515px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3 className="font-heading text-2xl md:text-3xl font-semibold text-white">{active.name}</h3>
                <p className="font-mono text-[11px] md:text-xs uppercase tracking-[0.15em] text-cyan mt-1.5 md:mt-2">
                  {active.role}
                </p>
                <p className="font-sans text-[15px] md:text-base leading-relaxed text-ghost-muted mt-3 md:mt-4 max-w-2xl">
                  {active.description}
                </p>

                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ghost-muted mt-6 md:mt-7 mb-1">
                  Today
                </p>
                <ul>
                  {rows.map((row) => (
                    <li
                      key={row.job}
                      className="grid grid-cols-[48px_1fr] md:grid-cols-[56px_1fr_auto] gap-x-3 gap-y-1.5 items-start md:items-center py-3.5 border-t border-ghost/10"
                    >
                      <span className="font-mono text-xs text-ghost-muted pt-0.5 md:pt-0">{row.time}</span>
                      <span className="font-sans text-[15px] leading-snug text-ghost">{row.job}</span>
                      <span className="col-start-2 md:col-start-auto">
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

        <motion.div {...reveal(0.2)} className="mt-8 lg:mt-10">
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
