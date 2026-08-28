"use client";

import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Compass,
  Layers3,
  Mail,
  ShieldCheck,
  Target,
  Workflow,
} from "lucide-react";
import type { EdenApplication } from "@/lib/eden/application-schema";
import { countryName } from "@/lib/eden/countries";
import {
  budgetReadinessLabels,
  calendarComplexityLabels,
  currentToolLabels,
  emailLoadLabels,
  getEdenCapabilityPlan,
  getEdenExample,
  getEdenBlueprintRecommendation,
  getEdenOperatingMode,
  meetingLoadLabels,
  openLoopVolumeLabels,
  organisationSizeBandLabels,
  primaryOutcomeLabels,
  targetStartWindowLabels,
  travelFrequencyLabels,
} from "@/lib/eden/questionnaire";

interface EdenBlueprintProps {
  application: EdenApplication;
  discoveryUrl: string;
  recorded: boolean;
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
  recorded,
}: EdenBlueprintProps) {
  const blueprint = getEdenBlueprintRecommendation(
    application.answers.primaryOutcomes,
  );
  const operatingMode = getEdenOperatingMode(application.answers);
  const capabilityPlan = getEdenCapabilityPlan(application.answers);
  const example = getEdenExample(
    application.answers,
    application.organisation?.sizeBand ?? null,
  );
  const externalDiscoveryUrl = /^https:\/\//.test(discoveryUrl);

  return (
    <div className="mx-auto w-full max-w-5xl" aria-live="polite">
      <div className="mb-8 flex flex-col gap-5 border-b border-ghost/[0.08] pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-5 flex items-center gap-3">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                recorded
                  ? "border-cyan/25 bg-cyan/[0.06] text-cyan"
                  : "border-ghost/15 bg-ghost/[0.04] text-ghost-muted"
              }`}
            >
              {recorded ? (
                <CheckCircle2 size={17} aria-hidden="true" />
              ) : (
                <CircleAlert size={17} aria-hidden="true" />
              )}
            </span>
            <p
              className={`font-mono text-[11px] uppercase tracking-[0.2em] ${
                recorded ? "text-cyan" : "text-ghost-muted"
              }`}
            >
              {recorded
                ? "Diagnostic recorded // Blueprint 01"
                : "Blueprint preview // Submission pending"}
            </p>
          </div>
          <h1
            id="eden-phase-heading"
            tabIndex={-1}
            className="max-w-3xl font-heading text-[32px] font-semibold uppercase leading-[1.02] text-white outline-none sm:text-[42px] lg:text-[52px]"
          >
            This is how your Eden can help
          </h1>
          <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-ghost-muted sm:text-lg">
            {recorded
              ? "Your answers point to a clear first role for Eden, the responsibilities she could take on, and the review points that keep you in control."
              : "This working preview is based on answers held in this browser. It shows the shape of your Eden, but CRM storage is still pending."}
          </p>
        </div>
        {recorded && (
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ghost-muted">
            Ref {application.applicationId.slice(0, 8)}
          </p>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <article className="relative overflow-hidden rounded-2xl border border-cyan/20 bg-surface p-6 shadow-glow-sm sm:p-8 lg:col-span-7">
          <div className="absolute right-0 top-0 h-40 w-40 translate-x-1/3 -translate-y-1/3 rounded-full bg-cyan/10 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 text-cyan">
              <Compass size={16} aria-hidden="true" />
              <p className="font-mono text-[10px] uppercase tracking-[0.18em]">
                Recommended Eden role
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
                Priorities to design around
              </p>
              <p className="mt-2 font-sans text-lg font-medium text-ghost">
                {application.answers.primaryOutcomes
                  .map((outcome) => primaryOutcomeLabels[outcome])
                  .join(", ")}
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-ghost/[0.08] bg-void-light/80 p-6 sm:p-8 lg:col-span-5">
          <div className="flex items-center gap-2 text-cyan-muted">
            <ShieldCheck size={16} aria-hidden="true" />
            <p className="font-mono text-[10px] uppercase tracking-[0.18em]">
              How Eden starts
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
              What makes Eden valuable
            </h2>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {application.answers.primaryOutcomes.map((outcome) => (
              <span
                key={outcome}
                className="rounded-full border border-cyan/15 bg-cyan/[0.04] px-3 py-2 font-sans text-xs text-ghost"
              >
                {primaryOutcomeLabels[outcome]}
              </span>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-ghost/[0.08] bg-surface/70 p-6 sm:p-8 lg:col-span-5">
          <div className="flex items-center gap-2 text-cyan-muted">
            <CalendarDays size={16} aria-hidden="true" />
            <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-muted">
              Preferred start
            </h2>
          </div>
          <p className="mt-5 font-heading text-xl font-medium text-ghost">
            {targetStartWindowLabels[application.answers.targetStartWindow]}
          </p>
        </article>
      </div>

      <section
        aria-labelledby="eden-capability-plan-heading"
        className="mt-6 rounded-2xl border border-cyan/15 bg-void-light/80 p-6 sm:p-8"
      >
        <div className="max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan">
            Your first Eden responsibilities
          </p>
          <h2
            id="eden-capability-plan-heading"
            className="mt-4 font-heading text-2xl font-semibold uppercase leading-tight text-white sm:text-3xl"
          >
            What Eden can take off your plate
          </h2>
          <p className="mt-3 font-sans text-sm leading-relaxed text-ghost-muted sm:text-base">
            These recommendations come from the structured workload, priorities,
            and control preferences you selected. They give the discovery call a
            practical starting scope rather than a blank page.
          </p>
        </div>

        <ol className="mt-8 grid gap-4 lg:grid-cols-3">
          {capabilityPlan.map((capability, index) => (
            <li
              key={capability.id}
              className="min-w-0 rounded-xl border border-ghost/[0.08] bg-surface/80 p-5 sm:p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-muted">
                  Responsibility {String(index + 1).padStart(2, "0")}
                </span>
                <span className="max-w-[58%] break-words rounded-full border border-cyan/15 bg-cyan/[0.04] px-2.5 py-1 text-right font-mono text-[9px] uppercase leading-relaxed tracking-[0.1em] text-ghost-muted">
                  {capability.signal}
                </span>
              </div>
              <h3 className="mt-5 font-heading text-lg font-semibold uppercase leading-tight text-ghost">
                {capability.title}
              </h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-ghost-muted">
                {capability.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="eden-example-heading"
        className="mt-6 overflow-hidden rounded-2xl border border-cyan/15 bg-void-light/80"
      >
        <div className="border-b border-ghost/[0.08] p-6 sm:p-8">
          <div className="flex items-center gap-2 text-cyan">
            <Workflow size={17} aria-hidden="true" />
            <p className="font-mono text-[10px] uppercase tracking-[0.18em]">
              Your Eden at work
            </p>
          </div>
          <h2
            id="eden-example-heading"
            className="mt-5 max-w-3xl font-heading text-2xl font-semibold uppercase leading-tight text-white sm:text-3xl"
          >
            See your Eden handle a real working moment
          </h2>
          <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-ghost-muted sm:text-base">
            Based on the operating shape you described, this is how one of those
            responsibilities could move from incoming signal to a controlled
            next action.
          </p>
          <p className="mt-6 max-w-3xl font-heading text-xl font-medium text-ghost sm:text-2xl">
            {example.title}
          </p>
        </div>

        <dl className="grid border-b border-ghost/[0.08] sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Weekly rhythm", example.context.volume],
            ["People involved", example.context.people],
            ["Tool context", example.context.systems],
            ["Service model", example.context.serviceModel],
          ].map(([label, value]) => (
            <div
              key={label}
              className="border-b border-ghost/[0.08] p-5 last:border-b-0 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0"
            >
              <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-ghost-muted">
                {label}
              </dt>
              <dd className="mt-2 break-words font-sans text-sm leading-relaxed text-ghost">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <ol className="grid gap-px bg-ghost/[0.08] lg:grid-cols-3">
          {[
            {
              label: "01 // Work arrives",
              title: example.arrivalTitle,
              description: example.arrivalDescription,
            },
            {
              label: "02 // Eden coordinates",
              title: example.coordinationTitle,
              description: example.coordinationDescription,
            },
            {
              label: "03 // You stay in control",
              title: example.controlTitle,
              description: example.controlDescription,
            },
          ].map((step) => (
            <li key={step.label} className="bg-surface/90 p-6 sm:p-7">
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-cyan-muted">
                {step.label}
              </p>
              <h3 className="mt-4 font-heading text-lg font-semibold uppercase leading-tight text-ghost">
                {step.title}
              </h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-ghost-muted">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

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
            label="Primary outcomes"
            value={application.answers.primaryOutcomes
              .map((outcome) => primaryOutcomeLabels[outcome])
              .join(", ")}
          />
          <AnswerRow
            label="Current friction"
            value={application.answers.currentFriction}
            preserveWhitespace
          />
          <AnswerRow
            label="Hours lost weekly"
            value={String(application.answers.hoursLostWeekly)}
          />
          <AnswerRow
            label="Open-loop volume"
            value={openLoopVolumeLabels[application.answers.openLoopVolume]}
          />
          <AnswerRow
            label="Meeting load"
            value={meetingLoadLabels[application.answers.meetingLoad]}
          />
          <AnswerRow
            label="Email load"
            value={emailLoadLabels[application.answers.emailLoad]}
          />
          <AnswerRow
            label="Calendar complexity"
            value={calendarComplexityLabels[application.answers.calendarComplexity]}
          />
          <AnswerRow
            label="Travel frequency"
            value={travelFrequencyLabels[application.answers.travelFrequency]}
          />
          <AnswerRow
            label="Current tools"
            value={application.answers.currentTools
              .map((tool) => currentToolLabels[tool])
              .join(", ")}
          />
          <AnswerRow
            label="Target start"
            value={targetStartWindowLabels[application.answers.targetStartWindow]}
          />
          <AnswerRow
            label="What matters most"
            value={budgetReadinessLabels[application.answers.budgetReadiness]}
          />
          <AnswerRow
            label="Service model"
            value={application.answers.operatedServiceAck
              ? "Aygency configures, operates and improves Eden with me"
              : "I want to buy Eden and maintain her myself"}
          />
          <AnswerRow label="Name" value={application.contact.fullName} />
          <AnswerRow label="Work email" value={application.contact.workEmail} />
          {application.contact.roleTitle.trim() && (
            <AnswerRow label="Role" value={application.contact.roleTitle} />
          )}
          {application.contact.phone.trim() && (
            <AnswerRow label="Phone" value={application.contact.phone} />
          )}
          {application.contact.linkedinUrl.trim() && (
            <AnswerRow label="LinkedIn" value={application.contact.linkedinUrl} />
          )}
          {application.organisation ? (
            <>
              <AnswerRow label="Organisation" value={application.organisation.name} />
              <AnswerRow
                label="Organisation size"
                value={organisationSizeBandLabels[application.organisation.sizeBand]}
              />
              {application.organisation.website.trim() && (
                <AnswerRow label="Organisation website" value={application.organisation.website} />
              )}
              {application.organisation.companyNumber.trim() && (
                <AnswerRow label="Company number" value={application.organisation.companyNumber} />
              )}
              <AnswerRow
                label="Country"
                value={countryName(application.organisation.countryCode)}
              />
            </>
          ) : (
            <AnswerRow label="Organisation" value="Not shared" />
          )}
          <AnswerRow
            label="Marketing updates"
            value={application.consent.marketing ? "Granted" : "Not granted"}
          />
          {application.answers.anythingElse.trim() && (
            <AnswerRow
              label="Additional context"
              value={application.answers.anythingElse}
              preserveWhitespace
            />
          )}
        </dl>
      </details>

      <section className="relative mt-8 overflow-hidden rounded-2xl border border-cyan/20 bg-cyan px-6 py-8 text-void sm:px-8 sm:py-10">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-white/20 to-transparent opacity-30" />
        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-void/60">
              Contact us
            </p>
            <h2 className="mt-3 font-heading text-2xl font-semibold uppercase leading-tight text-void sm:text-3xl">
              Want more information or a quote?
            </h2>
            <p className="mt-3 font-sans text-sm leading-relaxed text-void/70">
              Email build@aygency.ai and we&rsquo;ll turn this example into a
              scoped recommendation for your Eden, including onboarding,
              ongoing service, timing, and pricing.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 lg:w-auto lg:min-w-[290px]">
            <a
              href="mailto:build@aygency.ai?subject=Eden%20AI%20Personal%20Assistant%20enquiry"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-void px-7 py-3 text-center font-heading text-[13px] font-semibold uppercase tracking-[0.11em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-void/30"
            >
              Email build@aygency.ai
              <Mail size={16} aria-hidden="true" />
            </a>
            <a
              href={discoveryUrl}
              target={externalDiscoveryUrl ? "_blank" : undefined}
              rel={externalDiscoveryUrl ? "noreferrer" : undefined}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-void/25 px-7 py-3 text-center font-heading text-[13px] font-semibold uppercase tracking-[0.11em] text-void transition-all duration-200 hover:bg-void/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-void/30"
            >
              Book a discovery call
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
