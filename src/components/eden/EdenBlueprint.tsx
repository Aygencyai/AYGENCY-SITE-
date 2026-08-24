"use client";

import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Compass,
  Layers3,
  ShieldCheck,
  Target,
} from "lucide-react";
import type { EdenApplication } from "@/lib/eden/application-schema";
import {
  autonomyLabels,
  blueprintByGoal,
  dataReadinessLabels,
  getBlueprintOperatingMode,
  investmentLabels,
  primaryGoalLabels,
  successMeasureLabels,
  systemLabels,
  teamSizeLabels,
  timelineLabels,
  workflowVolumeLabels,
} from "@/lib/eden/questionnaire";

interface EdenBlueprintProps {
  application: EdenApplication;
  discoveryUrl: string;
}

interface AnswerRowProps {
  label: string;
  value: string;
  preserveWhitespace?: boolean;
}

function AnswerRow({ label, value, preserveWhitespace }: AnswerRowProps) {
  return (
    <div className="grid gap-2 border-b border-ghost/[0.06] py-4 last:border-0 md:grid-cols-[180px_1fr] md:gap-6">
      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ghost-muted">
        {label}
      </dt>
      <dd
        className={`min-w-0 break-words font-sans text-sm leading-relaxed text-ghost ${
          preserveWhitespace ? "whitespace-pre-wrap" : ""
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

export default function EdenBlueprint({
  application,
  discoveryUrl,
}: EdenBlueprintProps) {
  const blueprint = blueprintByGoal[application.answers.primaryGoal];
  const operatingMode = getBlueprintOperatingMode(
    application.answers.dataReadiness,
    application.answers.autonomyPreference
  );
  const externalDiscoveryUrl = /^https:\/\//.test(discoveryUrl);

  return (
    <div className="mx-auto w-full max-w-5xl" aria-live="polite">
      <div className="mb-8 flex flex-col gap-5 border-b border-ghost/[0.08] pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan/25 bg-cyan/[0.06] text-cyan">
              <CheckCircle2 size={17} aria-hidden="true" />
            </span>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan">
              Application recorded // Blueprint 01
            </p>
          </div>
          <h1
            id="eden-phase-heading"
            tabIndex={-1}
            className="max-w-3xl font-heading text-[32px] font-semibold uppercase leading-[1.02] text-white outline-none sm:text-[42px] lg:text-[52px]"
          >
            Your Eden Blueprint
          </h1>
          <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-ghost-muted sm:text-lg">
            A directional first architecture based on what you told us. It gives
            us a useful starting point for technical discovery.
          </p>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ghost-muted">
          Ref {application.submissionId.slice(0, 8)}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <article className="relative overflow-hidden rounded-2xl border border-cyan/20 bg-surface p-6 shadow-glow-sm sm:p-8 lg:col-span-7">
          <div className="absolute right-0 top-0 h-40 w-40 translate-x-1/3 -translate-y-1/3 rounded-full bg-cyan/10 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 text-cyan">
              <Compass size={16} aria-hidden="true" />
              <p className="font-mono text-[10px] uppercase tracking-[0.18em]">
                Recommended system
              </p>
            </div>
            <h2 className="mt-6 font-heading text-2xl font-semibold uppercase leading-tight text-white sm:text-3xl">
              {blueprint.title}
            </h2>
            <p className="mt-4 max-w-xl font-sans text-base leading-relaxed text-ghost-muted">
              {blueprint.thesis}
            </p>
            <div className="mt-8 border-t border-ghost/[0.08] pt-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ghost-muted">
                North star
              </p>
              <p className="mt-2 font-sans text-lg font-medium text-ghost">
                {primaryGoalLabels[application.answers.primaryGoal]}
              </p>
              <p className="mt-3 whitespace-pre-wrap break-words border-l border-cyan/30 pl-4 font-sans text-sm italic leading-relaxed text-ghost-muted">
                “{application.answers.desiredOutcome}”
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-ghost/[0.08] bg-void-light/80 p-6 sm:p-8 lg:col-span-5">
          <div className="flex items-center gap-2 text-cyan-muted">
            <ShieldCheck size={16} aria-hidden="true" />
            <p className="font-mono text-[10px] uppercase tracking-[0.18em]">
              First operating mode
            </p>
          </div>
          <h2 className="mt-6 font-heading text-xl font-semibold uppercase text-ghost">
            {operatingMode.title}
          </h2>
          <p className="mt-3 font-sans text-sm leading-relaxed text-ghost-muted">
            {operatingMode.description}
          </p>
          <div className="mt-7 rounded-xl border border-ghost/[0.06] bg-surface/70 p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ghost-muted">
              First capability
            </p>
            <p className="mt-2 font-sans text-sm leading-relaxed text-ghost">
              {blueprint.firstCapability}
            </p>
          </div>
        </article>

        <article className="rounded-2xl border border-ghost/[0.08] bg-surface/70 p-6 sm:p-8 lg:col-span-7">
          <div className="flex items-center gap-2 text-cyan-muted">
            <Target size={16} aria-hidden="true" />
            <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-muted">
              Proof it is working
            </h2>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {application.answers.successMeasures.map((measure) => (
              <span
                key={measure}
                className="rounded-full border border-cyan/15 bg-cyan/[0.04] px-3 py-2 font-sans text-xs text-ghost"
              >
                {successMeasureLabels[measure]}
              </span>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-ghost/[0.08] bg-surface/70 p-6 sm:p-8 lg:col-span-5">
          <div className="flex items-center gap-2 text-cyan-muted">
            <CalendarDays size={16} aria-hidden="true" />
            <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-muted">
              Target horizon
            </h2>
          </div>
          <p className="mt-5 font-heading text-xl font-medium text-ghost">
            {timelineLabels[application.answers.timeline]}
          </p>
        </article>
      </div>

      <details className="group mt-6 rounded-2xl border border-ghost/[0.08] bg-void-light/70">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-5 font-heading text-sm font-semibold uppercase tracking-[0.1em] text-ghost transition-colors hover:text-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/40 sm:px-7">
          <span className="flex items-center gap-3">
            <Layers3 size={17} className="text-cyan" aria-hidden="true" />
            Your original answers
          </span>
          <ChevronDown
            size={18}
            className="text-ghost-dim transition-transform duration-200 group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <dl className="border-t border-ghost/[0.08] px-5 pb-2 sm:px-7">
          <AnswerRow
            label="Priority"
            value={primaryGoalLabels[application.answers.primaryGoal]}
          />
          <AnswerRow
            label="Desired outcome"
            value={application.answers.desiredOutcome}
            preserveWhitespace
          />
          <AnswerRow
            label="Current challenge"
            value={application.answers.currentChallenge}
            preserveWhitespace
          />
          <AnswerRow
            label="Weekly volume"
            value={workflowVolumeLabels[application.answers.workflowVolume]}
          />
          <AnswerRow
            label="People affected"
            value={teamSizeLabels[application.answers.teamSize]}
          />
          <AnswerRow
            label="Systems"
            value={application.answers.systems
              .map((system) => systemLabels[system])
              .join(", ")}
          />
          <AnswerRow
            label="Data readiness"
            value={dataReadinessLabels[application.answers.dataReadiness]}
          />
          <AnswerRow
            label="Preferred autonomy"
            value={autonomyLabels[application.answers.autonomyPreference]}
          />
          <AnswerRow
            label="Success measures"
            value={application.answers.successMeasures
              .map((measure) => successMeasureLabels[measure])
              .join(", ")}
          />
          <AnswerRow
            label="Timeline"
            value={timelineLabels[application.answers.timeline]}
          />
          <AnswerRow
            label="Investment range"
            value={investmentLabels[application.answers.investmentRange]}
          />
        </dl>
      </details>

      <section className="relative mt-8 overflow-hidden rounded-2xl border border-cyan/20 bg-cyan px-6 py-8 text-void sm:px-8 sm:py-10">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-white/20 to-transparent opacity-30" />
        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-void/60">
              The useful next step
            </p>
            <h2 className="mt-3 font-heading text-2xl font-semibold uppercase leading-tight text-void sm:text-3xl">
              Turn this direction into a buildable first system.
            </h2>
            <p className="mt-3 font-sans text-sm leading-relaxed text-void/70">
              In a discovery call, we&rsquo;ll test the assumptions, map the
              workflow, and decide whether there is a valuable first release.
            </p>
          </div>
          <a
            href={discoveryUrl}
            target={externalDiscoveryUrl ? "_blank" : undefined}
            rel={externalDiscoveryUrl ? "noreferrer" : undefined}
            className="inline-flex min-h-12 flex-none items-center justify-center gap-2 rounded-lg bg-void px-7 py-3 font-heading text-[13px] font-semibold uppercase tracking-[0.13em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-void/30"
          >
            Book your discovery call
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </section>
    </div>
  );
}
