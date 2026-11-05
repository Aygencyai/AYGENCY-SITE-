import type { ReactNode } from "react";
import {
  Bot,
  Check,
  CheckCircle2,
  Database,
  FileText,
  LayoutGrid,
  Mic,
  Search,
  Users,
  type LucideIcon,
} from "lucide-react";

// Illustrative product screens with sample data. They are built from text and CSS, not images, so
// they stay sharp and add almost nothing to the page weight. Keep names and figures in step with the film.

const label = "font-mono text-[11px] uppercase tracking-[0.18em]";

export function SampleNote({ className = "" }: { className?: string }) {
  return <p className={`font-sans text-xs text-ghost-dim ${className}`}>Illustrative screen. Sample data.</p>;
}

export function AskCard() {
  return (
    <div className="rounded-xl border border-ghost/15 bg-void p-4 lg:p-5">
      <div className="ml-auto w-fit max-w-[90%] rounded-2xl rounded-br-sm bg-surface-light px-3.5 py-2 font-sans text-sm text-ghost">
        What did we spend with Harlow &amp; Co this quarter?
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan/15 text-cyan">
          <Bot className="w-3.5 h-3.5" strokeWidth={1.75} />
        </span>
        <span className="font-sans text-[13px] font-medium text-ghost">CEO Agent</span>
      </div>
      <ul className="mt-3 space-y-1.5 border-l border-cyan/30 pl-3 font-sans text-[13px] text-ghost-muted">
        <li>Read Xero and Outlook</li>
        <li>Matched 14 invoices to their orders</li>
        <li>Checked last quarter for comparison</li>
      </ul>
      <p className="mt-3 font-heading text-2xl font-semibold text-white">£18,400</p>
      <p className="font-sans text-sm leading-snug text-ghost-muted mt-1">
        Up 12% on last quarter. One invoice is <span className="text-cyan">£640 over its order</span>. Want me to query it?
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {["Xero", "Outlook", "Invoice 1042"].map((source) => (
          <span
            key={source}
            className="inline-flex items-center gap-1 rounded-full border border-ghost/15 px-2 py-0.5 font-sans text-[11px] text-ghost-muted"
          >
            <FileText className="w-3 h-3" strokeWidth={1.5} />
            {source}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ApprovalCard() {
  return (
    <div className="rounded-xl border border-cyan/40 bg-void p-4 lg:p-5 shadow-glow-sm">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <p className={`${label} text-cyan whitespace-nowrap`}>Waiting for you</p>
        <p className="font-sans text-xs text-ghost-muted whitespace-nowrap">Operations agent</p>
      </div>
      <p className="font-heading text-lg font-semibold text-white mt-3">Pay Harlow &amp; Co £8,400</p>
      <ul className="mt-2.5 space-y-1.5 font-sans text-[13px] text-ghost-muted">
        {["Matches the order and the delivery note", "Same price as the last three orders", "Due Friday"].map((why) => (
          <li key={why} className="grid grid-cols-[16px_1fr] gap-2">
            <Check className="w-3.5 h-3.5 text-cyan mt-0.5" strokeWidth={2} />
            {why}
          </li>
        ))}
      </ul>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <span className="rounded-lg bg-cyan py-2 text-center font-heading text-xs font-semibold uppercase tracking-[0.12em] text-void">
          Approve
        </span>
        <span className="rounded-lg border border-ghost/20 py-2 text-center font-heading text-xs font-semibold uppercase tracking-[0.12em] text-ghost">
          See working
        </span>
      </div>
    </div>
  );
}

const feed = [
  { time: "Now", who: "Analyst", what: "Reading this week’s sales figures" },
  { time: "09:41", who: "Operations", what: "Chased 3 missing documents" },
  { time: "09:12", who: "Analyst", what: "Flagged an invoice that looks off" },
  { time: "08:00", who: "CEO Agent", what: "Sent you this morning’s brief" },
];

export function AgentFeedCard() {
  return (
    <div className="rounded-xl border border-ghost/15 bg-void p-4 lg:p-5">
      <p className={`${label} text-ghost-muted mb-2`}>Your agents, today</p>
      <ul>
        {feed.map(({ time, who, what }) => (
          <li key={what} className="grid grid-cols-[44px_1fr] gap-2 py-2.5 border-t border-ghost/10">
            <span className={`font-mono text-xs pt-0.5 ${time === "Now" ? "text-cyan" : "text-ghost-dim"}`}>{time}</span>
            <span>
              <span className="block font-sans text-[11px] text-ghost-muted">{who}</span>
              <span className="block font-sans text-sm leading-snug text-ghost">{what}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const sidebar: { icon: LucideIcon; name: string; count?: string }[] = [
  { icon: LayoutGrid, name: "Overview" },
  { icon: CheckCircle2, name: "Approvals", count: "3" },
  { icon: Bot, name: "Agents" },
  { icon: Database, name: "Your data" },
  { icon: Users, name: "Your team" },
];

function AppShell({ active, title, children }: { active: string; title: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[190px_1fr] rounded-2xl border border-ghost/15 bg-void-light overflow-hidden shadow-[0_30px_80px_-30px_rgba(0,229,255,0.25)]">
      <aside className="border-r border-ghost/10 p-4">
        <div className="flex items-center gap-2 px-2 pb-5">
          <svg viewBox="190 220 663 600" fill="currentColor" aria-hidden className="w-4 text-cyan">
            <path d="M487 242H638L367 797H213Z" />
            <path d="M583 592H715L830 797H693Z" />
          </svg>
          <span className="font-heading text-sm font-semibold text-white">Command centre</span>
        </div>
        {sidebar.map(({ icon: Icon, name, count }) => (
          <div
            key={name}
            className={`flex items-center gap-2.5 rounded-lg px-2 py-2 font-sans text-[13px] ${name === active ? "bg-cyan/10 text-white" : "text-ghost-muted"}`}
          >
            <Icon className={`w-4 h-4 ${name === active ? "text-cyan" : ""}`} strokeWidth={1.5} />
            {name}
            {count && <span className="ml-auto rounded-full bg-cyan px-1.5 font-sans text-[11px] font-medium text-void">{count}</span>}
          </div>
        ))}
      </aside>
      <div className="p-5">
        <p className="font-heading text-xl font-semibold text-white">{title}</p>
        {children}
      </div>
    </div>
  );
}

// The whole app, for desktop only. On a phone people see PhoneFrame instead, never this shrunk.
export function CommandCentreScreen() {
  return (
    <AppShell active="Overview" title="Good morning. Three things need you.">
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          ["Cash in", "£84,200"],
          ["Costs", "£51,600"],
          ["Profit", "£32,600"],
        ].map(([name, value]) => (
          <div key={name} className="rounded-lg border border-ghost/10 bg-surface/60 p-3">
            <p className="font-sans text-[11px] text-ghost-muted">{name}</p>
            <p className="font-heading text-xl font-semibold text-white mt-0.5">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 items-start">
        <ApprovalCard />
        <AgentFeedCard />
      </div>
      <div className="mt-3 flex items-center gap-3 rounded-full border border-ghost/15 bg-void px-4 py-2.5">
        <Search className="w-4 h-4 text-ghost-muted" strokeWidth={1.5} />
        <span className="font-sans text-sm text-ghost-muted">Ask anything about the business</span>
        <Mic className="ml-auto w-4 h-4 text-cyan" strokeWidth={1.75} />
      </div>
    </AppShell>
  );
}

const invoices = [
  { who: "Bright & Sons", amount: "£2,150", state: "Matched" },
  { who: "March Lane Ltd", amount: "£6,720", state: "Matched" },
  { who: "Harlow & Co", amount: "£9,040", state: "Needs you" },
  { who: "Oak Street Supplies", amount: "£1,305", state: "Matched" },
  { who: "Fenwick Hire", amount: "£3,480", state: "Matched" },
];

export function InvoiceQueueCard() {
  return (
    <div className="rounded-xl border border-ghost/15 bg-void p-4 lg:p-5">
      <p className={`${label} text-ghost-muted mb-2`}>Invoices, today</p>
      <ul>
        {invoices.map(({ who, amount, state }) => (
          <li key={who} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 py-2.5 border-t border-ghost/10 font-sans text-sm">
            <span className="text-ghost truncate">{who}</span>
            <span className="text-ghost-muted">{amount}</span>
            {state === "Matched" ? (
              <span className="inline-flex items-center gap-1 text-xs text-ghost-muted">
                <Check className="w-3.5 h-3.5" strokeWidth={2} />
                Matched
              </span>
            ) : (
              <span className="rounded-full border border-cyan/40 px-2 py-0.5 text-xs text-cyan whitespace-nowrap">Needs you</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BackOfficeScreen() {
  return (
    <AppShell active="Agents" title="41 invoices read overnight. One needs you.">
      <div className="mt-4 grid grid-cols-2 gap-3 items-start">
        <InvoiceQueueCard />
        <InvoiceMatchCard />
      </div>
    </AppShell>
  );
}

export function InvoiceMatchCard() {
  return (
    <div className="rounded-xl border border-cyan/40 bg-void p-4 lg:p-5 shadow-glow-sm">
      <p className={`${label} text-cyan`}>Held for you</p>
      <p className="font-heading text-lg font-semibold text-white mt-3">Harlow &amp; Co, invoice 1042</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-ghost/10 bg-surface/60 p-3">
          <p className="font-sans text-[11px] text-ghost-muted">The order</p>
          <p className="font-heading text-lg font-semibold text-white">£8,400</p>
        </div>
        <div className="rounded-lg border border-cyan/30 bg-cyan/[0.06] p-3">
          <p className="font-sans text-[11px] text-ghost-muted">The invoice</p>
          <p className="font-heading text-lg font-semibold text-cyan">£9,040</p>
        </div>
      </div>
      <p className="font-sans text-sm leading-snug text-ghost-muted mt-3">
        £640 over the order. The delivery note matches the order, so I’ve held it and drafted a query to Harlow &amp; Co.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <span className="rounded-lg bg-cyan py-2 text-center font-heading text-xs font-semibold uppercase tracking-[0.12em] text-void">Send query</span>
        <span className="rounded-lg border border-ghost/20 py-2 text-center font-heading text-xs font-semibold uppercase tracking-[0.12em] text-ghost">See working</span>
      </div>
    </div>
  );
}

export function MonthEndCard() {
  const lines: [string, string, boolean][] = [
    ["Revenue", "£312,400", false],
    ["Costs", "£198,700", false],
    ["Stock movement", "£14,200", true],
    ["Margin", "31.8%", false],
  ];
  return (
    <div className="rounded-xl border border-ghost/15 bg-void p-4 lg:p-5">
      <p className={`${label} text-ghost-muted`}>Month-end report, draft</p>
      <ul className="mt-3">
        {lines.map(([name, value, query]) => (
          <li key={name} className="flex items-center justify-between gap-3 py-2.5 border-t border-ghost/10 font-sans text-sm">
            <span className="text-ghost-muted">{name}</span>
            <span className="flex items-center gap-2 text-ghost">
              {query && <span className="rounded-full border border-cyan/40 px-2 py-0.5 text-[11px] text-cyan whitespace-nowrap">Check this</span>}
              {value}
            </span>
          </li>
        ))}
      </ul>
      <p className="font-sans text-[13px] text-ghost-muted mt-3">Every figure links to the document behind it.</p>
    </div>
  );
}

export function ChaseCard() {
  return (
    <div className="rounded-xl border border-ghost/15 bg-void p-4 lg:p-5">
      <p className={`${label} text-ghost-muted`}>Missing receipt, card ending 4417</p>
      <div className="mt-4 w-fit max-w-[92%] rounded-2xl rounded-bl-sm bg-surface-light px-3.5 py-2 font-sans text-sm leading-snug text-ghost">
        Hi Tom, I’m missing the receipt for £212 at Harlow &amp; Co on the 14th. Could you send it over?
      </div>
      <div className="mt-2 ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-sm bg-cyan/15 px-3.5 py-2 font-sans text-sm text-ghost">
        Here you go, sorry!
      </div>
      <ul className="mt-4 space-y-1.5 border-l border-cyan/30 pl-3 font-sans text-[13px] text-ghost-muted">
        <li>Read the receipt and checked the amount</li>
        <li>Matched it to the card line</li>
        <li>Filed it, and closed the chase</li>
      </ul>
    </div>
  );
}

export function BrainAnswerCard() {
  return (
    <div className="rounded-xl border border-ghost/15 bg-void p-4 lg:p-5">
      <div className="ml-auto w-fit max-w-[90%] rounded-2xl rounded-br-sm bg-surface-light px-3.5 py-2 font-sans text-sm text-ghost">
        How do we price a rush job?
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan/15 text-cyan">
          <Bot className="w-3.5 h-3.5" strokeWidth={1.75} />
        </span>
        <span className="font-sans text-[13px] font-medium text-ghost">Your Brain</span>
      </div>
      <p className="font-sans text-[15px] leading-relaxed text-ghost mt-3">
        Add 15% to the standard rate for anything under five working days. Over £10,000, it needs sign-off from Sarah first.
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {["Pricing policy, SharePoint", "Sarah’s email, March", "Job 208"].map((source) => (
          <span
            key={source}
            className="inline-flex items-center gap-1 rounded-full border border-ghost/15 px-2 py-0.5 font-sans text-[11px] text-ghost-muted"
          >
            <FileText className="w-3 h-3" strokeWidth={1.5} />
            {source}
          </span>
        ))}
      </div>
    </div>
  );
}

const brainHolds = [
  ["Processes", "148"],
  ["Policies", "36"],
  ["Past jobs", "2,310"],
  ["Decisions", "512"],
];

export function BrainScreen() {
  return (
    <AppShell active="Your data" title="Your Brain">
      <div className="mt-4 grid grid-cols-[1fr_1.5fr] gap-3 items-start">
        <div className="rounded-xl border border-ghost/15 bg-void p-4 lg:p-5">
          <p className={`${label} text-ghost-muted mb-2`}>What it holds</p>
          <ul>
            {brainHolds.map(([name, count]) => (
              <li key={name} className="flex justify-between gap-3 py-2.5 border-t border-ghost/10 font-sans text-sm">
                <span className="text-ghost-muted">{name}</span>
                <span className="text-ghost">{count}</span>
              </li>
            ))}
          </ul>
        </div>
        <BrainAnswerCard />
      </div>
    </AppShell>
  );
}

const brainUpdates = [
  { time: "Today", who: "Operations", what: "Added new payment terms for Harlow & Co" },
  { time: "Today", who: "Your team", what: "Corrected how a rush job is priced" },
  { time: "Mon", who: "Analyst", what: "Noted a change to the month-end process" },
  { time: "Mon", who: "Aygency", what: "Filed the new starter handbook" },
];

export function BrainUpdatesCard() {
  return (
    <div className="rounded-xl border border-ghost/15 bg-void p-4 lg:p-5">
      <p className={`${label} text-ghost-muted mb-2`}>Added to your Brain</p>
      <ul>
        {brainUpdates.map(({ time, who, what }) => (
          <li key={what} className="grid grid-cols-[44px_1fr] gap-2 py-2.5 border-t border-ghost/10">
            <span className="font-mono text-xs pt-0.5 text-ghost-dim">{time}</span>
            <span>
              <span className="block font-sans text-[11px] text-ghost-muted">{who}</span>
              <span className="block font-sans text-sm leading-snug text-ghost">{what}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BrainTimelineCard() {
  const beats = [
    ["Day one", "Every process and decision, captured and searchable."],
    ["Year one", "The answer to almost anything about how you operate."],
    ["Year ten", "The memory of how the whole business was built."],
  ];
  return (
    <ol>
      {beats.map(([when, what], i) => (
        <li key={when} className="relative grid grid-cols-[28px_1fr] gap-4 pb-8 last:pb-0">
          <span
            aria-hidden
            className={`absolute left-[13.5px] top-4 bottom-0 w-px ${i < beats.length - 1 ? "bg-cyan/50" : "bg-gradient-to-b from-cyan/50 to-transparent"}`}
          />
          <span className="flex justify-center pt-1.5">
            <span className="block rounded-full bg-cyan" style={{ width: 9 + i * 5, height: 9 + i * 5 }} />
          </span>
          <div>
            <p className="font-heading text-2xl font-semibold text-white">{when}</p>
            <p className="font-sans text-base leading-relaxed text-ghost-muted mt-1">{what}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function ConversationCard({
  title,
  customer,
  agent,
  steps,
}: {
  title: string;
  customer: string;
  agent: string;
  steps: string[];
}) {
  return (
    <div className="rounded-xl border border-ghost/15 bg-void p-4 lg:p-5">
      <p className={`${label} text-ghost-muted`}>{title}</p>
      <div className="mt-4 w-fit max-w-[88%] rounded-2xl rounded-bl-sm bg-surface-light px-3.5 py-2 font-sans text-sm leading-snug text-ghost">
        {customer}
      </div>
      <div className="mt-2 ml-auto w-fit max-w-[88%] rounded-2xl rounded-br-sm bg-cyan/15 px-3.5 py-2 font-sans text-sm leading-snug text-ghost">
        {agent}
      </div>
      <ul className="mt-4 space-y-1.5 border-l border-cyan/30 pl-3 font-sans text-[13px] text-ghost-muted">
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ul>
    </div>
  );
}

export function HandoverCard({
  flag,
  who,
  title,
  points,
  action,
}: {
  flag: string;
  who: string;
  title: string;
  points: string[];
  action: string;
}) {
  return (
    <div className="rounded-xl border border-cyan/40 bg-void p-4 lg:p-5 shadow-glow-sm">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <p className={`${label} text-cyan whitespace-nowrap`}>{flag}</p>
        <p className="font-sans text-xs text-ghost-muted whitespace-nowrap">{who}</p>
      </div>
      <p className="font-heading text-lg font-semibold text-white mt-3">{title}</p>
      <ul className="mt-2.5 space-y-1.5 font-sans text-[13px] text-ghost-muted">
        {points.map((point) => (
          <li key={point} className="grid grid-cols-[16px_1fr] gap-2">
            <Check className="w-3.5 h-3.5 text-cyan mt-0.5" strokeWidth={2} />
            {point}
          </li>
        ))}
      </ul>
      <div className="mt-4 rounded-lg bg-cyan py-2 text-center font-heading text-xs font-semibold uppercase tracking-[0.12em] text-void">
        {action}
      </div>
    </div>
  );
}

export function NumbersCard({ title, rows, note }: { title: string; rows: [string, string][]; note?: string }) {
  return (
    <div className="rounded-xl border border-ghost/15 bg-void p-4 lg:p-5">
      <p className={`${label} text-ghost-muted mb-2`}>{title}</p>
      <ul>
        {rows.map(([name, value]) => (
          <li key={name} className="flex items-center justify-between gap-3 py-2.5 border-t border-ghost/10 font-sans text-sm">
            <span className="text-ghost-muted">{name}</span>
            <span className="text-ghost">{value}</span>
          </li>
        ))}
      </ul>
      {note && <p className="font-sans text-[13px] text-ghost-muted mt-3">{note}</p>}
    </div>
  );
}

export function FeedCard({ title, rows }: { title: string; rows: { time: string; who: string; what: string }[] }) {
  return (
    <div className="rounded-xl border border-ghost/15 bg-void p-4 lg:p-5">
      <p className={`${label} text-ghost-muted mb-2`}>{title}</p>
      <ul>
        {rows.map(({ time, who, what }) => (
          <li key={what} className="grid grid-cols-[44px_1fr] gap-2 py-2.5 border-t border-ghost/10">
            <span className={`font-mono text-xs pt-0.5 ${time === "Now" ? "text-cyan" : "text-ghost-dim"}`}>{time}</span>
            <span>
              <span className="block font-sans text-[11px] text-ghost-muted">{who}</span>
              <span className="block font-sans text-sm leading-snug text-ghost">{what}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ServiceScreen({ title, left, right }: { title: string; left: ReactNode; right: ReactNode }) {
  return (
    <AppShell active="Agents" title={title}>
      <div className="mt-4 grid grid-cols-2 gap-3 items-start">
        {left}
        {right}
      </div>
    </AppShell>
  );
}

export function CalendarWeekCard() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const meetings: Record<string, string[]> = {
    Mon: ["Kestrel Logistics"],
    Tue: [],
    Wed: ["Marlow Foods", "Ashby Group"],
    Thu: [],
    Fri: ["Northgate Homes"],
  };
  return (
    <div className="rounded-xl border border-ghost/15 bg-void p-4 lg:p-5">
      <p className={`${label} text-ghost-muted mb-3`}>Your calendar, next week</p>
      <div className="grid grid-cols-5 gap-1.5">
        {days.map((day) => (
          <div key={day} className="min-h-[150px] rounded-lg border border-ghost/10 bg-surface/50 p-1.5">
            <p className="font-sans text-[11px] text-ghost-muted mb-1.5">{day}</p>
            {meetings[day].map((meeting) => (
              <p key={meeting} className="mb-1.5 rounded bg-cyan/15 border-l-2 border-cyan px-1.5 py-1 font-sans text-[10px] sm:text-[11px] leading-tight text-ghost">
                {meeting}
              </p>
            ))}
          </div>
        ))}
      </div>
      <p className="font-sans text-[13px] text-ghost-muted mt-3">Four meetings, each with the background already written.</p>
    </div>
  );
}

export function OneIntoManyCard() {
  const outputs = ["LinkedIn post, Monday", "LinkedIn post, Thursday", "Newsletter, end of month", "Client update", "Short video script", "Instagram carousel"];
  return (
    <div className="rounded-xl border border-ghost/15 bg-void p-4 lg:p-5">
      <p className={`${label} text-ghost-muted`}>One article</p>
      <p className="font-heading text-lg font-semibold text-white mt-2">“What the new rules mean for you”</p>
      <span aria-hidden className="block h-6 w-px bg-cyan/50 ml-3 mt-2" />
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {outputs.map((output) => (
          <li key={output} className="rounded-lg border border-cyan/30 bg-cyan/[0.05] px-3 py-2 font-sans text-[13px] leading-snug text-ghost">
            {output}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BuiltToBeFoundCard() {
  return (
    <div className="rounded-xl border border-ghost/15 bg-void p-4 lg:p-5">
      <div className="ml-auto w-fit max-w-[90%] rounded-2xl rounded-br-sm bg-surface-light px-3.5 py-2 font-sans text-sm text-ghost">
        Who does commercial fit-outs near Leeds?
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan/15 text-cyan">
          <Search className="w-3.5 h-3.5" strokeWidth={1.75} />
        </span>
        <span className="font-sans text-[13px] font-medium text-ghost">An AI assistant</span>
      </div>
      <p className="font-sans text-[15px] leading-relaxed text-ghost mt-3">
        Northgate Fit-Out covers Leeds and Yorkshire, and specialises in offices and retail units.
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {["Your services page", "Your projects page"].map((source) => (
          <span
            key={source}
            className="inline-flex items-center gap-1 rounded-full border border-ghost/15 px-2 py-0.5 font-sans text-[11px] text-ghost-muted"
          >
            <FileText className="w-3 h-3" strokeWidth={1.5} />
            {source}
          </span>
        ))}
      </div>
    </div>
  );
}

export function PhoneFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[34px] border border-ghost/25 bg-void p-3 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)] ${className}`}>
      <div className="mx-auto mb-3 h-1 w-14 rounded-full bg-ghost/20" />
      {children}
    </div>
  );
}

export function MorningBrief() {
  return (
    <div className="space-y-2.5">
      <p className={`${label} text-cyan`}>Monday, 8:00</p>
      <p className="font-heading text-lg leading-tight font-semibold text-white">Your morning brief</p>
      <div className="rounded-lg border border-ghost/10 bg-surface/60 p-3">
        <p className="font-sans text-[11px] text-ghost-muted">Cash in last week</p>
        <p className="font-heading text-xl font-semibold text-white">£84,200</p>
      </div>
      <ul className="space-y-2 font-sans text-[13px] leading-snug text-ghost">
        {["Late payment chased", "Margin slip on one job, flagged"].map((item) => (
          <li key={item} className="grid grid-cols-[14px_1fr] gap-2">
            <Check className="w-3.5 h-3.5 text-cyan mt-0.5" strokeWidth={2} />
            {item}
          </li>
        ))}
      </ul>
      <div className="rounded-lg bg-cyan py-2 text-center font-heading text-[11px] font-semibold uppercase tracking-[0.12em] text-void">
        3 to approve
      </div>
    </div>
  );
}
