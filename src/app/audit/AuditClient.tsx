"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2, RefreshCcw } from "lucide-react";
import AnimatedGrid from "@/components/effects/AnimatedGrid";
import GlowOrb from "@/components/effects/GlowOrb";
import EdenOptionGroup from "@/components/eden/EdenOptionGroup";
import { cn } from "@/lib/utils";
import type { InvitePrefill } from "@/lib/growth-audit/ingest";
import {
  QUESTION_SET_VERSION,
  aiUseOptions,
  channelOptions,
  contactSchema,
  crmOptions,
  durationOptions,
  frequencyOptions,
  limitOptions,
  packs,
  peopleOptions,
  picksOther,
  type AuditAnswers,
  type OtherKey,
  type AuditOption,
  type Pack,
  type TaskDetail,
} from "@/lib/growth-audit/questions";

type Draft = Omit<Partial<AuditAnswers>, "taskDetails"> & { taskDetails?: Record<string, Partial<TaskDetail>> };
type Phase = "intro" | "questions" | "submitting" | "error" | "done";
type MultiKey = "retyping" | "channels" | "tools" | "aiWhere" | "limits";

interface Contact {
  name: string;
  email: string;
  company: string;
}

interface Step {
  id: string;
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

function buildSteps(pack: Pack, answers: Draft): Step[] {
  const p = packs[pack];
  const taskLabel = new Map(p.tasks.map((t) => [t.value, t.label]));
  return [
    { id: "scaleLive", title: p.scaleLive.title, description: "A rough answer is fine.", autoAdvance: true },
    { id: "scaleSize", title: p.scaleSize.title, description: p.scaleSize.description, autoAdvance: true },
    {
      id: "tasks",
      title: "Which of these does your team do by hand, again and again?",
      description: "Tick everything that's repetitive and done manually.",
    },
    ...(answers.tasks ?? []).map((task) => ({
      id: `detail:${task}`,
      title: task === "other" && answers.otherText?.tasks ? answers.otherText.tasks : taskLabel.get(task) ?? task,
      description: "Who does it, how often, and how long it takes. Roughly is fine.",
    })),
    { id: "retyping", title: "Where does your team type the same information twice?", description: "Tick all that apply." },
    { id: "channels", title: "Where do decisions and updates actually happen?", description: "Tick all that apply." },
    { id: "crm", title: "Do you use a CRM to keep track of clients and new work?", description: "Pick the closest.", autoAdvance: true },
    { id: "tools", title: "Which of these do you use day to day?", description: "Tick all that apply." },
    { id: "aiUse", title: "Are you using AI in the business today?", description: "Pick the closest.", autoAdvance: true },
    ...(answers.aiUse && answers.aiUse !== "none"
      ? [{ id: "aiWhere", title: "Where are you using it?", description: "Tick all that apply." }]
      : []),
    {
      id: "limits",
      title: "How would you want AI to start out in your business?",
      description: "Pick any that apply. Most businesses start small and give it more as it proves itself.",
    },
    {
      id: "oneThing",
      title: "Off the top of your head, if we could take one thing off your team's plate, what would it be?",
      description: "In your own words. A sentence or two is plenty.",
    },
    {
      id: "wastesTime",
      title: "What's costing your business the most time right now?",
      description: "Optional. Anything we haven't asked about.",
    },
    { id: "contact", title: "Last thing: who are we talking to?", description: "So we can prepare for our conversation." },
  ];
}

const OTHER_KEYS: readonly string[] = ["tasks", "tools", "crm", "aiWhere"];

function isStepAnswered(step: Step, answers: Draft, contact: Contact, consent: boolean) {
  if (OTHER_KEYS.includes(step.id) && picksOther(answers, step.id as OtherKey) && !answers.otherText?.[step.id as OtherKey]?.trim()) {
    return false;
  }
  if (step.id.startsWith("detail:")) {
    const d = answers.taskDetails?.[step.id.slice(7)];
    return Boolean(d?.people && d?.who && d?.frequency && d?.duration);
  }
  switch (step.id) {
    case "tasks":
    case "retyping":
    case "channels":
    case "tools":
    case "aiWhere":
    case "limits":
      return ((answers[step.id] as string[] | undefined)?.length ?? 0) > 0;
    case "wastesTime":
      return true;
    case "oneThing":
      return Boolean(answers.oneThing?.trim());
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

/** Toggle a value in a multi-select. "none" clears the rest, and anything else clears "none". */
function toggle(list: readonly string[] | undefined, value: string): string[] {
  const current = [...(list ?? [])];
  if (current.includes(value)) return current.filter((item) => item !== value);
  if (value === "none") return ["none"];
  return [...current.filter((item) => item !== "none"), value];
}

interface AuditClientProps {
  auditId: string;
  inviteCode: string | null;
  invite: InvitePrefill | null;
  discoveryUrl: string;
}

export default function AuditClient({ auditId: freshAuditId, inviteCode, invite, discoveryUrl }: AuditClientProps) {
  const pack: Pack = invite?.pack ?? "general";
  const p = packs[pack];
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("intro");
  const [auditId, setAuditId] = useState(freshAuditId);
  const [answers, setAnswers] = useState<Draft>({ taskDetails: {} });
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

  const steps = useMemo(() => buildSteps(pack, answers), [pack, answers]);
  const step = steps[Math.min(stepIndex, steps.length - 1)];

  // Resume an unfinished audit from this browser.
  useEffect(() => {
    const stored = readStored(inviteCode);
    if (stored) {
      setAuditId(stored.auditId);
      setAnswers({ taskDetails: {}, ...stored.answers });
      setContact((current) => ({
        name: stored.contact.name || current.name,
        email: stored.contact.email || current.email,
        company: stored.contact.company || current.company,
      }));
      setConsent(stored.consent);
      if (stored.done) setPhase("done");
      else if (stored.stepId) {
        const index = buildSteps(pack, stored.answers).findIndex((s) => s.id === stored.stepId);
        if (index > 0) {
          setStepIndex(index);
          setResumable(true);
        }
      }
    }
    hydrated.current = true;
  }, [inviteCode, pack]);

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
    const currentSteps = buildSteps(pack, nextAnswers);
    const current = currentSteps[stepIndex];
    if (!current || !isStepAnswered(current, nextAnswers, contact, consent)) return;
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

  function choose(key: keyof Draft, value: string) {
    const next = { ...answers, [key]: value } as Draft;
    if (key === "aiUse" && value === "none") delete next.aiWhere;
    setAnswers(next);
    // "Another CRM" opens a text box, so it waits for Continue.
    if (step?.autoAdvance && value !== "other" && !advancing.current) {
      advancing.current = true;
      window.setTimeout(() => {
        advancing.current = false;
        goNext(next);
      }, prefersReducedMotion ? 0 : 220);
    }
  }

  function toggleIn(key: MultiKey, value: string) {
    setAnswers({ ...answers, [key]: toggle(answers[key], value) });
  }

  function setTasks(tasks: string[]) {
    const taskDetails = Object.fromEntries(Object.entries(answers.taskDetails ?? {}).filter(([t]) => tasks.includes(t)));
    setAnswers({
      ...answers,
      tasks,
      taskDetails,
      aiWhere: answers.aiWhere?.filter((t) => t === "other" || tasks.includes(t)),
    });
  }

  function setOtherText(key: OtherKey, text: string) {
    setAnswers({ ...answers, otherText: { ...answers.otherText, [key]: text } });
  }

  function otherField(key: OtherKey, label: string) {
    if (!picksOther(answers, key)) return null;
    return (
      <div className="mt-5">
        <label htmlFor={`other-${key}`} className="mb-2 block font-sans text-sm font-medium text-ghost">{label}</label>
        <input id={`other-${key}`} type="text" maxLength={300} autoFocus value={answers.otherText?.[key] ?? ""}
          onChange={(e) => setOtherText(key, e.target.value)}
          className="w-full rounded-xl border border-cyan/30 bg-surface/80 px-4 py-3 font-sans text-[15px] text-ghost placeholder:text-ghost-dim focus:border-cyan/50 focus:outline-none focus:ring-2 focus:ring-cyan/20" />
      </div>
    );
  }

  function setDetail(task: string, patch: Partial<TaskDetail>) {
    setAnswers({
      ...answers,
      taskDetails: { ...answers.taskDetails, [task]: { ...answers.taskDetails?.[task], ...patch } },
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
          answers: { ...answers, oneThing: answers.oneThing?.trim(), wastesTime: answers.wastesTime?.trim() || undefined },
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

  // Enter continues on steps with a Continue button.
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
  const chosenTasks = p.tasks.filter((t) => answers.tasks?.includes(t.value));

  function multi(name: MultiKey, options: ReadonlyArray<AuditOption<string>>, legend: string) {
    return (
      <EdenOptionGroup name={name} legend={legend} options={options} value={answers[name]} multiple
        onChange={(v) => toggleIn(name, v)} />
    );
  }

  function renderStep(): ReactNode {
    if (!step) return null;
    if (step.id.startsWith("detail:")) {
      const task = step.id.slice(7);
      const d = answers.taskDetails?.[task];
      return (
        <div className="space-y-7">
          <PillRow legend="Who mostly does it?" options={p.roles} value={d?.who} onChange={(who) => setDetail(task, { who })} />
          <PillRow legend="How many people?" options={peopleOptions} value={d?.people} onChange={(people) => setDetail(task, { people })} />
          <PillRow legend="How often?" options={frequencyOptions} value={d?.frequency} onChange={(frequency) => setDetail(task, { frequency })} />
          <PillRow legend="How long each time?" options={durationOptions} value={d?.duration} onChange={(duration) => setDetail(task, { duration })} />
        </div>
      );
    }
    switch (step.id) {
      case "scaleLive":
        return <EdenOptionGroup name="scaleLive" legend={step.title} options={p.scaleLive.options} value={answers.scaleLive} onChange={(v) => choose("scaleLive", v)} />;
      case "scaleSize":
        return <EdenOptionGroup name="scaleSize" legend={step.title} options={p.scaleSize.options} value={answers.scaleSize} onChange={(v) => choose("scaleSize", v)} />;
      case "tasks":
        return (
          <>
            <EdenOptionGroup name="tasks" legend={step.title} options={p.tasks} value={answers.tasks} multiple
              onChange={(v) => setTasks(toggle(answers.tasks, v))} />
            {otherField("tasks", "What else does your team do by hand?")}
          </>
        );
      case "retyping":
        return multi("retyping", p.retyping, step.title);
      case "channels":
        return multi("channels", channelOptions, step.title);
      case "crm":
        return (
          <>
            <EdenOptionGroup name="crm" legend={step.title} options={crmOptions} value={answers.crm} onChange={(v) => choose("crm", v)} />
            {otherField("crm", "Which CRM?")}
          </>
        );
      case "tools":
        return (
          <>
            {multi("tools", p.tools, step.title)}
            {otherField("tools", "What else do you use?")}
          </>
        );
      case "aiUse":
        return <EdenOptionGroup name="aiUse" legend={step.title} options={aiUseOptions} value={answers.aiUse} onChange={(v) => choose("aiUse", v)} />;
      case "aiWhere":
        return (
          <>
            {multi("aiWhere", [...chosenTasks.filter((t) => t.value !== "other"), { value: "other", label: "Somewhere else" }], step.title)}
            {otherField("aiWhere", "Where else are you using it?")}
          </>
        );
      case "limits":
        return multi("limits", limitOptions, step.title);
      case "oneThing":
        return (
          <TextArea id="oneThing" label={step.title} value={answers.oneThing ?? ""}
            onChange={(oneThing) => setAnswers({ ...answers, oneThing })}
            placeholder={pack === "construction" ? "Pulling together the weekly client report for every project." : "Chasing the same information from three different people every week."} />
        );
      case "wastesTime":
        return (
          <TextArea id="wastesTime" label={step.title} value={answers.wastesTime ?? ""}
            onChange={(wastesTime) => setAnswers({ ...answers, wastesTime })}
            placeholder={pack === "construction" ? "Information living in WhatsApp, email and spreadsheets, and no one place to see where a job stands." : "Information spread across too many places to find quickly."} />
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
              Where does your team&apos;s time go?
            </h1>
            <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-ghost-muted sm:text-lg">
              A few quick questions about the repetitive work in your week: what it is, who does it and how often.
              We use your answers to come to our conversation with a plan for your business.
            </p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-ghost-dim">About 5 minutes · mostly taps</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => setPhase("questions")}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-cyan px-8 py-3 font-heading text-[13px] font-semibold uppercase tracking-[0.15em] text-void transition-all duration-200 hover:brightness-110 hover:shadow-glow-sm active:scale-[0.97]">
                {resumable ? "Carry on where you left off" : "Start"} <ArrowRight size={15} aria-hidden="true" />
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
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan">
                  {invite ? invite.company : "AI Growth Audit"}
                </p>
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
                {(!step.autoAdvance || (step.id === "crm" && answers.crm === "other")) && (
                  <button type="button" onClick={() => goNext()} disabled={!answered}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-cyan px-7 py-3 font-heading text-xs font-semibold uppercase tracking-[0.15em] text-void transition-all duration-200 hover:brightness-110 hover:shadow-glow-sm active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40">
                    {step.id === "contact" ? "Finish" : step.id === "wastesTime" && !answers.wastesTime?.trim() ? "Skip" : "Continue"}
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

        {phase === "done" && (
          <motion.div initial={enter} animate={{ opacity: 1, y: 0 }} transition={transition} className="pt-4 md:pt-10">
            <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-cyan">
              <Check size={14} aria-hidden="true" /> Received
            </p>
            <h1 className="mt-5 font-heading text-[30px] font-bold uppercase leading-[1] text-white sm:text-[44px]">
              Thank you.
            </h1>
            <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-ghost-muted sm:text-lg">
              {invite
                ? "We'll go through your answers and come to our meeting with a plan built around your business."
                : "We'll go through your answers and come back to you with a plan built around your business."}
            </p>
            {!invite && (
              <a href={discoveryUrl}
                className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-cyan px-8 py-3 font-heading text-[13px] font-semibold uppercase tracking-[0.15em] text-void transition-all hover:brightness-110 hover:shadow-glow-sm">
                Book a call <ArrowRight size={15} aria-hidden="true" />
              </a>
            )}
          </motion.div>
        )}
      </div>
    </section>
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
  value: string | undefined;
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

function TextArea({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="sr-only">{label}</label>
      <textarea id={id} rows={4} maxLength={600} value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-ghost/[0.1] bg-surface/80 px-4 py-4 font-sans text-[15px] text-ghost placeholder:text-ghost-dim focus:border-cyan/40 focus:outline-none focus:ring-2 focus:ring-cyan/20" />
      <p className="mt-2 text-right font-mono text-[10px] text-ghost-dim">{value.length} / 600</p>
    </div>
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
