"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2, RefreshCcw } from "lucide-react";
import AnimatedGrid from "@/components/effects/AnimatedGrid";
import GlowOrb from "@/components/effects/GlowOrb";
import EdenOptionGroup from "@/components/eden/EdenOptionGroup";
import { cn } from "@/lib/utils";
import { growthLever, leverCopy, weeklyHoursRange } from "@/lib/growth-audit/estimate";
import type { InvitePrefill } from "@/lib/growth-audit/ingest";
import {
  QUESTION_SET_VERSION,
  areaOptions,
  blockerOptions,
  contactSchema,
  directionOptions,
  doerOptions,
  doubledOptions,
  enquiryVolumeOptions,
  hoursOptions,
  peopleOptions,
  replySpeedOptions,
  roleOptions,
  systemOptions,
  teamSizeOptions,
  type Area,
  type AreaDetail,
  type AuditAnswers,
  type AuditOption,
} from "@/lib/growth-audit/questions";

type Draft = Partial<AuditAnswers>;
type Phase = "intro" | "questions" | "submitting" | "error" | "done";

interface Contact {
  name: string;
  email: string;
  company: string;
}

interface Step {
  id: string;
  part: "Your business" | "Your team's time" | "About you";
  title: string;
  description: string;
  /** Single-choice steps move on as soon as an answer is picked. */
  autoAdvance?: boolean;
}

interface Stored {
  version: string;
  auditId: string;
  answers: Draft;
  contact: Contact;
  stepId: string | null;
  consent: boolean;
  done: boolean;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const areaLabel = Object.fromEntries(areaOptions.map((o) => [o.value, o.label])) as Record<Area, string>;

function buildSteps(areas: readonly Area[] | undefined): Step[] {
  const business: Step[] = [
    { id: "role", part: "Your business", title: "What's your role?", description: "So we know who we're talking to.", autoAdvance: true },
    { id: "teamSize", part: "Your business", title: "How big is the team?", description: "Everyone who works in the business, you included.", autoAdvance: true },
    { id: "direction", part: "Your business", title: "What does the next 12 months look like?", description: "Pick the one that matters most.", autoAdvance: true },
    { id: "blockers", part: "Your business", title: "What's holding growth back?", description: "Pick up to two." },
    { id: "doubled", part: "Your business", title: "If enquiries doubled next month, what happens?", description: "Be honest. This is the question that tells us the most.", autoAdvance: true },
    { id: "enquiryVolume", part: "Your business", title: "Roughly how many new enquiries a month?", description: "Calls, emails, forms and messages together.", autoAdvance: true },
    { id: "replySpeed", part: "Your business", title: "How quickly does a new enquiry usually get a reply?", description: "On a normal week, not your best one.", autoAdvance: true },
    { id: "areas", part: "Your team's time", title: "Which of these take up your team's week?", description: "Tick everything that eats real time." },
  ];
  const details: Step[] = (areas ?? []).map((area) => ({
    id: `detail:${area}`,
    part: "Your team's time",
    title: areaLabel[area],
    description: "A rough answer is fine. We only need the shape of it.",
  }));
  const rest: Step[] = [
    { id: "systems", part: "Your team's time", title: "Where does your information live?", description: "Tick everything you use day to day." },
    { id: "oneThing", part: "Your team's time", title: "If AI could take one thing off your plate tomorrow, what would it be?", description: "Optional. A sentence is plenty." },
    { id: "contact", part: "About you", title: "Where should we send it?", description: "We'll use your answers to prepare for our conversation." },
  ];
  return [...business, ...details, ...rest];
}

function isStepAnswered(step: Step, answers: Draft, contact: Contact, consent: boolean) {
  if (step.id.startsWith("detail:")) {
    const detail = answers.areaDetails?.[step.id.slice(7) as Area];
    return Boolean(detail?.people && detail?.hours && detail?.doer);
  }
  switch (step.id) {
    case "blockers":
      return (answers.blockers?.length ?? 0) > 0;
    case "areas":
      return (answers.areas?.length ?? 0) > 0;
    case "systems":
      return (answers.systems?.length ?? 0) > 0;
    case "oneThing":
      return true;
    case "contact":
      return contactSchema.safeParse(contact).success && consent;
    default:
      return answers[step.id as keyof Draft] !== undefined;
  }
}

function storageKey(inviteCode: string | null) {
  return `aygency-growth-audit:${inviteCode ?? "public"}`;
}

function readStored(inviteCode: string | null): Stored | null {
  try {
    const raw = window.localStorage.getItem(storageKey(inviteCode));
    if (!raw) return null;
    const stored = JSON.parse(raw) as Stored;
    return stored.version === QUESTION_SET_VERSION ? stored : null;
  } catch {
    return null;
  }
}

function writeStored(inviteCode: string | null, stored: Stored) {
  try {
    window.localStorage.setItem(storageKey(inviteCode), JSON.stringify(stored));
  } catch {
    // Private windows can refuse storage; the audit still works, it just won't resume.
  }
}

function toggle<T extends string>(list: readonly T[] | undefined, value: T, max?: number): T[] {
  const current = [...(list ?? [])];
  if (current.includes(value)) return current.filter((item) => item !== value);
  if (max !== undefined && current.length >= max) return current;
  return [...current, value];
}

interface AuditClientProps {
  auditId: string;
  inviteCode: string | null;
  invite: InvitePrefill | null;
  discoveryUrl: string;
}

export default function AuditClient({ auditId: freshAuditId, inviteCode, invite, discoveryUrl }: AuditClientProps) {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("intro");
  const [auditId, setAuditId] = useState(freshAuditId);
  const [answers, setAnswers] = useState<Draft>({ areaDetails: {} });
  const [contact, setContact] = useState<Contact>({
    name: invite?.contactName ?? "",
    email: invite?.contactEmail ?? "",
    company: invite?.company ?? "",
  });
  const [consent, setConsent] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [resumable, setResumable] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const hydrated = useRef(false);
  const advancing = useRef(false);

  const steps = useMemo(() => buildSteps(answers.areas), [answers.areas]);
  const step = steps[Math.min(stepIndex, steps.length - 1)];

  // Resume an unfinished audit from this browser.
  useEffect(() => {
    const stored = readStored(inviteCode);
    if (stored) {
      setAuditId(stored.auditId);
      setAnswers({ areaDetails: {}, ...stored.answers });
      setContact((current) => ({
        name: stored.contact.name || current.name,
        email: stored.contact.email || current.email,
        company: stored.contact.company || current.company,
      }));
      setConsent(stored.consent);
      if (stored.done) setPhase("done");
      else if (stored.stepId) {
        const index = buildSteps(stored.answers.areas).findIndex((s) => s.id === stored.stepId);
        if (index > 0) {
          setStepIndex(index);
          setResumable(true);
        }
      }
    }
    hydrated.current = true;
  }, [inviteCode]);

  useEffect(() => {
    if (!hydrated.current) return;
    writeStored(inviteCode, {
      version: QUESTION_SET_VERSION,
      auditId,
      answers,
      contact,
      stepId: step?.id ?? null,
      consent,
      done: phase === "done",
    });
  }, [inviteCode, auditId, answers, contact, step?.id, consent, phase]);

  function saveDraft(nextAnswers: Draft, lastStep: string, stepsCompleted: number) {
    // Fire and forget: a failed draft save never blocks the person answering.
    void fetch("/api/audit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "save", auditId, inviteCode, answers: nextAnswers, lastStep, stepsCompleted }),
    }).catch(() => undefined);
  }

  function goNext(nextAnswers: Draft = answers) {
    const currentSteps = buildSteps(nextAnswers.areas);
    const current = currentSteps[stepIndex];
    if (!current) return;
    if (!isStepAnswered(current, nextAnswers, contact, consent)) return;
    if (current.id === "contact") {
      void submit();
      return;
    }
    saveDraft(nextAnswers, current.id, stepIndex + 1);
    setStepIndex(Math.min(stepIndex + 1, currentSteps.length - 1));
  }

  function goBack() {
    if (stepIndex === 0) setPhase("intro");
    else setStepIndex(stepIndex - 1);
  }

  function choose<K extends keyof AuditAnswers>(key: K, value: AuditAnswers[K]) {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    if (step?.autoAdvance && !advancing.current) {
      advancing.current = true;
      window.setTimeout(() => {
        advancing.current = false;
        goNext(next);
      }, prefersReducedMotion ? 0 : 220);
    }
  }

  function setAreas(areas: Area[]) {
    const areaDetails = Object.fromEntries(
      Object.entries(answers.areaDetails ?? {}).filter(([area]) => areas.includes(area as Area))
    ) as Draft["areaDetails"];
    setAnswers({ ...answers, areas, areaDetails });
  }

  function setDetail(area: Area, patch: Partial<AreaDetail>) {
    const existing = answers.areaDetails?.[area] ?? {};
    setAnswers({
      ...answers,
      areaDetails: { ...answers.areaDetails, [area]: { ...existing, ...patch } as AreaDetail },
    });
  }

  async function submit() {
    const parsedContact = contactSchema.safeParse(contact);
    if (!parsedContact.success) {
      setContactError("Add your name, a valid email and your company.");
      return;
    }
    if (!consent) {
      setContactError("Tick the box so we can use your answers.");
      return;
    }
    setContactError(null);
    setPhase("submitting");
    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "complete",
          auditId,
          inviteCode,
          answers: { ...answers, oneThing: answers.oneThing?.trim() || undefined },
          contact: parsedContact.data,
          consent: true,
          lastStep: "contact",
          stepsCompleted: steps.length,
        }),
      });
      if (!response.ok) throw new Error(((await response.json().catch(() => ({}))) as { error?: string }).error);
      setPhase("done");
    } catch (error) {
      setSubmitError(error instanceof Error && error.message ? error.message : "We couldn't save that just now.");
      setPhase("error");
    }
  }

  // Enter continues on multi-select steps.
  useEffect(() => {
    if (phase !== "questions") return;
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Enter" || event.target instanceof HTMLTextAreaElement) return;
      if (event.target instanceof HTMLButtonElement) return;
      event.preventDefault();
      goNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const enter = prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 };
  const transition = { duration: prefersReducedMotion ? 0 : 0.6, ease: EASE };

  function renderStep(): ReactNode {
    if (!step) return null;
    if (step.id.startsWith("detail:")) {
      const area = step.id.slice(7) as Area;
      const detail = answers.areaDetails?.[area];
      return (
        <div className="space-y-8">
          <PillRow legend="How many people do it?" options={peopleOptions} value={detail?.people} onChange={(people) => setDetail(area, { people })} />
          <PillRow legend="Hours each, per week?" options={hoursOptions} value={detail?.hours} onChange={(hours) => setDetail(area, { hours })} />
          <PillRow legend="Who mostly does it?" options={doerOptions} value={detail?.doer} onChange={(doer) => setDetail(area, { doer })} />
        </div>
      );
    }
    switch (step.id) {
      case "role":
        return <EdenOptionGroup name="role" legend={step.title} options={roleOptions} value={answers.role} onChange={(v) => choose("role", v)} columns={1} />;
      case "teamSize":
        return <EdenOptionGroup name="teamSize" legend={step.title} options={teamSizeOptions} value={answers.teamSize} onChange={(v) => choose("teamSize", v)} />;
      case "direction":
        return <EdenOptionGroup name="direction" legend={step.title} options={directionOptions} value={answers.direction} onChange={(v) => choose("direction", v)} />;
      case "blockers":
        return (
          <EdenOptionGroup name="blockers" legend={step.title} options={blockerOptions} value={answers.blockers} multiple maxSelections={2}
            onChange={(v) => setAnswers({ ...answers, blockers: toggle(answers.blockers, v, 2) })} />
        );
      case "doubled":
        return <EdenOptionGroup name="doubled" legend={step.title} options={doubledOptions} value={answers.doubled} onChange={(v) => choose("doubled", v)} />;
      case "enquiryVolume":
        return <EdenOptionGroup name="enquiryVolume" legend={step.title} options={enquiryVolumeOptions} value={answers.enquiryVolume} onChange={(v) => choose("enquiryVolume", v)} />;
      case "replySpeed":
        return <EdenOptionGroup name="replySpeed" legend={step.title} options={replySpeedOptions} value={answers.replySpeed} onChange={(v) => choose("replySpeed", v)} />;
      case "areas":
        return (
          <EdenOptionGroup name="areas" legend={step.title} options={areaOptions} value={answers.areas} multiple
            onChange={(v) => setAreas(toggle(answers.areas, v))} />
        );
      case "systems":
        return (
          <EdenOptionGroup name="systems" legend={step.title} options={systemOptions} value={answers.systems} multiple
            onChange={(v) => setAnswers({ ...answers, systems: toggle(answers.systems, v) })} />
        );
      case "oneThing":
        return (
          <div>
            <label htmlFor="oneThing" className="sr-only">{step.title}</label>
            <textarea id="oneThing" rows={4} maxLength={600} value={answers.oneThing ?? ""}
              onChange={(e) => setAnswers({ ...answers, oneThing: e.target.value })}
              placeholder="Chasing unpaid invoices every Friday afternoon."
              className="w-full rounded-xl border border-ghost/[0.1] bg-surface/80 px-4 py-4 font-sans text-[15px] text-ghost placeholder:text-ghost-dim focus:border-cyan/40 focus:outline-none focus:ring-2 focus:ring-cyan/20" />
            <p className="mt-2 text-right font-mono text-[10px] text-ghost-dim">{(answers.oneThing ?? "").length} / 600</p>
          </div>
        );
      case "contact":
        return (
          <div className="space-y-4">
            <TextField id="name" label="Your name" autoComplete="name" value={contact.name} onChange={(name) => setContact({ ...contact, name })} />
            <TextField id="email" label="Work email" type="email" autoComplete="email" value={contact.email} onChange={(email) => setContact({ ...contact, email })} />
            <TextField id="company" label="Company" autoComplete="organization" value={contact.company} onChange={(company) => setContact({ ...contact, company })} />
            <label className="flex cursor-pointer items-start gap-3 pt-2">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-cyan" />
              <span className="font-sans text-sm leading-relaxed text-ghost-muted">
                Aygency can store these answers and use them to prepare for a conversation with me. See our{" "}
                <a href="/trust" className="text-cyan underline-offset-4 hover:underline">privacy and trust page</a>.
              </span>
            </label>
            {contactError && <p role="alert" className="font-sans text-sm text-error">{contactError}</p>}
          </div>
        );
      default:
        return null;
    }
  }

  const answered = step ? isStepAnswered(step, answers, contact, consent) : false;
  const progress = Math.round(((stepIndex + 1) / steps.length) * 100);

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-void pt-24">
      <AnimatedGrid className="opacity-60" />
      <GlowOrb size={620} opacity={0.08} className="absolute -right-64 top-20" />
      <div className="relative z-10 mx-auto min-h-[calc(100svh-6rem)] max-w-3xl px-6 py-12 md:px-8 md:py-16">
        {phase === "intro" && (
          <motion.div initial={enter} animate={{ opacity: 1, y: 0 }} transition={transition} className="pt-4 md:pt-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan">
              {invite ? `Prepared for ${invite.company}` : "AI Growth Audit"}
            </p>
            <h1 className="mt-5 font-heading text-[34px] font-bold uppercase leading-[0.98] text-white sm:text-[48px] lg:text-[60px]">
              Where can AI take your business next?
            </h1>
            <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-ghost-muted sm:text-lg">
              A few quick questions about where the business is heading and where your team&apos;s week goes.
              We use your answers to arrive with a plan built around your business.
            </p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-ghost-dim">About 3 minutes · mostly taps</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => setPhase("questions")}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-cyan px-8 py-3 font-heading text-[13px] font-semibold uppercase tracking-[0.15em] text-void transition-all duration-200 hover:brightness-110 hover:shadow-glow-sm active:scale-[0.97]">
                {resumable ? "Carry on where you left off" : "Start the audit"} <ArrowRight size={15} aria-hidden="true" />
              </button>
              {resumable && (
                <button type="button" onClick={() => { setStepIndex(0); setResumable(false); setPhase("questions"); }}
                  className="inline-flex min-h-12 items-center justify-center rounded-lg border border-cyan/30 px-8 py-3 font-heading text-[13px] font-semibold uppercase tracking-[0.15em] text-cyan transition-colors hover:bg-cyan/[0.04]">
                  Start from the top
                </button>
              )}
            </div>
          </motion.div>
        )}

        {phase === "questions" && step && (
          <div>
            <div aria-live="polite">
              <div className="mb-3 flex items-end justify-between gap-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan">{step.part}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ghost-dim">{progress}%</p>
              </div>
              <div role="progressbar" aria-label="Audit progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}
                className="h-1 overflow-hidden rounded-full bg-surface-light">
                <div className="h-full rounded-full bg-cyan transition-[width] duration-500 ease-out" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="mt-8 flex min-h-[520px] flex-col rounded-2xl border border-ghost/[0.08] bg-void-light/75 p-5 backdrop-blur-xl sm:p-8 lg:p-10">
              <div className="flex-1">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={step.id} initial={enter} animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -10 }} transition={transition}>
                    <h1 className="max-w-2xl font-heading text-[24px] font-semibold uppercase leading-[1.1] text-ghost sm:text-[32px]">
                      {step.title}
                    </h1>
                    <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-ghost-muted sm:text-base">{step.description}</p>
                    <div className="mt-8">{renderStep()}</div>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="mt-10 flex flex-col-reverse gap-3 border-t border-ghost/[0.07] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <button type="button" onClick={goBack}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-cyan/20 px-5 py-3 font-heading text-xs font-semibold uppercase tracking-[0.13em] text-cyan transition-colors hover:border-cyan/40 hover:bg-cyan/[0.04]">
                  <ArrowLeft size={15} aria-hidden="true" /> Back
                </button>
                {!step.autoAdvance && (
                  <button type="button" onClick={() => goNext()} disabled={!answered}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-cyan px-7 py-3 font-heading text-xs font-semibold uppercase tracking-[0.15em] text-void transition-all duration-200 hover:brightness-110 hover:shadow-glow-sm active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40">
                    {step.id === "contact" ? "Finish" : step.id === "oneThing" && !answers.oneThing?.trim() ? "Skip" : "Continue"}
                    <ArrowRight size={15} aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {phase === "submitting" && (
          <motion.div initial={enter} animate={{ opacity: 1, y: 0 }} transition={transition}
            className="mx-auto max-w-xl rounded-2xl border border-ghost/[0.08] bg-void-light/80 p-10 text-center" aria-live="polite">
            <Loader2 size={24} className="mx-auto animate-spin text-cyan" aria-hidden="true" />
            <h1 className="mt-6 font-heading text-2xl font-semibold uppercase text-ghost">Saving your answers</h1>
          </motion.div>
        )}

        {phase === "error" && (
          <motion.div initial={enter} animate={{ opacity: 1, y: 0 }} transition={transition} role="alert"
            className="mx-auto max-w-xl rounded-2xl border border-error/20 bg-void-light/85 p-10 text-center">
            <RefreshCcw size={22} className="mx-auto text-error" aria-hidden="true" />
            <h1 className="mt-6 font-heading text-2xl font-semibold uppercase text-ghost">That didn&apos;t save</h1>
            <p className="mt-3 font-sans text-sm text-ghost-muted">{submitError} Your answers are still here.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button type="button" onClick={() => void submit()}
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-cyan px-7 py-3 font-heading text-xs font-semibold uppercase tracking-[0.15em] text-void hover:brightness-110">
                Try again
              </button>
              <button type="button" onClick={() => setPhase("questions")}
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-cyan/30 px-7 py-3 font-heading text-xs font-semibold uppercase tracking-[0.15em] text-cyan">
                Review answers
              </button>
            </div>
          </motion.div>
        )}

        {phase === "done" && <Result answers={answers} invited={Boolean(invite)} discoveryUrl={discoveryUrl} enter={enter} transition={transition} />}
      </div>
    </section>
  );
}

function Result({
  answers,
  invited,
  discoveryUrl,
  enter,
  transition,
}: {
  answers: Draft;
  invited: boolean;
  discoveryUrl: string;
  enter: { opacity: number; y: number };
  transition: { duration: number; ease: typeof EASE };
}) {
  const lever =
    answers.blockers && answers.doubled && answers.replySpeed
      ? leverCopy[growthLever({ blockers: answers.blockers, doubled: answers.doubled, replySpeed: answers.replySpeed })]
      : null;
  const range = answers.areas ? weeklyHoursRange({ areas: answers.areas, areaDetails: answers.areaDetails ?? {} }) : null;

  return (
    <motion.div initial={enter} animate={{ opacity: 1, y: 0 }} transition={transition} className="pt-4 md:pt-10">
      <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-cyan">
        <Check size={14} aria-hidden="true" /> Audit received
      </p>
      <h1 className="mt-5 font-heading text-[30px] font-bold uppercase leading-[1] text-white sm:text-[44px]">
        Here&apos;s what stands out
      </h1>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {lever && (
          <div className="rounded-2xl border border-cyan/20 bg-cyan/[0.04] p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-muted">Your biggest lever</p>
            <p className="mt-3 font-heading text-xl font-semibold uppercase leading-tight text-ghost">{lever.headline}</p>
            <p className="mt-3 font-sans text-sm leading-relaxed text-ghost-muted">{lever.body}</p>
          </div>
        )}
        {range && (
          <div className="rounded-2xl border border-ghost/[0.08] bg-surface/70 p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-muted">Your team&apos;s time</p>
            <p className="mt-3 font-heading text-3xl font-bold text-ghost">
              {range.low}–{range.high} <span className="text-base font-semibold uppercase text-ghost-muted">hours a week</span>
            </p>
            <p className="mt-3 font-sans text-sm leading-relaxed text-ghost-muted">
              From your answers, that&apos;s roughly how much of the week goes on work our system can take on.
            </p>
          </div>
        )}
      </div>
      <p className="mt-10 max-w-xl font-sans text-base leading-relaxed text-ghost-muted">
        {invited
          ? "We'll bring the full plan to our meeting: what we'd build, what it takes off your team, and what it's worth to the business."
          : "We'll come back to you with a plan: what we'd build, what it takes off your team, and what it's worth to the business."}
      </p>
      {!invited && (
        <a href={discoveryUrl}
          className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-cyan px-8 py-3 font-heading text-[13px] font-semibold uppercase tracking-[0.15em] text-void transition-all hover:brightness-110 hover:shadow-glow-sm">
          Book a call <ArrowRight size={15} aria-hidden="true" />
        </a>
      )}
    </motion.div>
  );
}

function PillRow<T extends string>({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: ReadonlyArray<AuditOption<T>>;
  value: T | undefined;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-3 font-sans text-sm font-medium text-ghost">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <button key={option.value} type="button" aria-pressed={selected} onClick={() => onChange(option.value)}
              className={cn(
                "min-h-11 rounded-lg border px-4 py-2 font-sans text-sm transition-all duration-200",
                selected
                  ? "border-cyan bg-cyan/[0.16] text-white shadow-[inset_0_0_0_1px_rgba(0,229,255,0.35)]"
                  : "border-ghost/[0.1] bg-surface/80 text-ghost-muted hover:border-cyan/30 hover:text-ghost"
              )}>
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function TextField({
  id,
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-sans text-sm font-medium text-ghost">{label}</label>
      <input id={id} type={type} autoComplete={autoComplete} value={value} maxLength={type === "email" ? 320 : 200}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-ghost/[0.1] bg-surface/80 px-4 py-3 font-sans text-[15px] text-ghost placeholder:text-ghost-dim focus:border-cyan/40 focus:outline-none focus:ring-2 focus:ring-cyan/20" />
    </div>
  );
}
