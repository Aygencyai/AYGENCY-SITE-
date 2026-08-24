"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Loader2,
  RefreshCcw,
  Sparkles,
} from "lucide-react";
import AnimatedGrid from "@/components/effects/AnimatedGrid";
import GlowOrb from "@/components/effects/GlowOrb";
import EdenBlueprint from "@/components/eden/EdenBlueprint";
import EdenIntroduction from "@/components/eden/EdenIntroduction";
import EdenOptionGroup from "@/components/eden/EdenOptionGroup";
import EdenProgress from "@/components/eden/EdenProgress";
import {
  edenApplicationSchema,
  edenQuestionnaireSchema,
  type EdenApplication,
  type EdenAttribution,
  type EdenQuestionnaireValues,
} from "@/lib/eden/application-schema";
import { captureEdenAttribution } from "@/lib/eden/attribution";
import {
  autonomyOptionList,
  dataReadinessOptionList,
  edenSteps,
  getVolumeQuestion,
  investmentOptionList,
  primaryGoalOptions,
  successMeasureOptionList,
  systemOptionList,
  teamSizeOptions,
  timelineOptionList,
} from "@/lib/eden/questionnaire";

interface DesignYourEdenClientProps {
  discoveryUrl: string;
}

type FunnelPhase =
  | "intro"
  | "questions"
  | "submitting"
  | "error"
  | "complete";

interface QuestionFrameProps {
  number: number;
  title: string;
  description: string;
  children: ReactNode;
}

const inputClasses =
  "w-full rounded-xl border border-ghost/[0.1] bg-surface px-4 py-4 font-sans text-base text-ghost placeholder:text-ghost-dim/70 transition-colors duration-200 focus:border-cyan/50 focus:outline-none focus:ring-2 focus:ring-cyan/20";
const retryableBrowserStatuses = new Set([408, 425, 500, 502, 503, 504]);

function QuestionFrame({
  number,
  title,
  description,
  children,
}: QuestionFrameProps) {
  return (
    <div className="relative">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-2 -top-12 hidden font-heading text-[132px] font-bold leading-none text-ghost/[0.025] md:block"
      >
        {String(number).padStart(2, "0")}
      </span>
      <div className="relative">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-muted">
          Personalise Eden
        </p>
        <h1
          id="eden-phase-heading"
          tabIndex={-1}
          className="max-w-3xl font-heading text-[28px] font-semibold uppercase leading-[1.08] text-ghost outline-none sm:text-[36px] lg:text-[44px]"
        >
          {title}
        </h1>
        <p
          id="eden-question-description"
          className="mt-4 max-w-2xl font-sans text-sm leading-relaxed text-ghost-muted sm:text-base"
        >
          {description}
        </p>
        <div className="mt-8 sm:mt-10">{children}</div>
      </div>
    </div>
  );
}

function CharacterCount({ current, maximum }: { current: number; maximum: number }) {
  return (
    <p className="mt-2 text-right font-mono text-[10px] tracking-[0.08em] text-ghost-dim">
      {current} / {maximum}
    </p>
  );
}

function ErrorMessage({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-3 font-sans text-sm text-error">
      {message}
    </p>
  );
}

function wait(milliseconds: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, milliseconds));
}

async function fetchWithTimeout(body: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);

  try {
    return await fetch("/api/eden/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      cache: "no-store",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function submitFrozenApplication(application: EdenApplication) {
  const frozenBody = JSON.stringify(application);
  let finalMessage =
    "We could not safely record your application. Your answers are still here. Please try again.";

  for (let attempt = 0; attempt < 2; attempt += 1) {
    let response: Response;

    try {
      response = await fetchWithTimeout(frozenBody);
    } catch {
      if (attempt === 0) {
        await wait(450);
        continue;
      }
      throw new Error(finalMessage);
    }

    const result = (await response.json().catch(() => null)) as {
      success?: boolean;
      error?: string;
    } | null;

    if (response.ok && result?.success) return;
    if (result?.error) finalMessage = result.error;

    if (attempt === 0 && retryableBrowserStatuses.has(response.status)) {
      const retryAfter = Number(response.headers.get("retry-after"));
      const delay = Number.isFinite(retryAfter)
        ? Math.min(Math.max(retryAfter * 1_000, 300), 1_500)
        : 450;
      await wait(delay);
      continue;
    }

    throw new Error(finalMessage);
  }

  throw new Error(finalMessage);
}

export default function DesignYourEdenClient({
  discoveryUrl,
}: DesignYourEdenClientProps) {
  const [phase, setPhase] = useState<FunnelPhase>("intro");
  const [stepIndex, setStepIndex] = useState(0);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [submissionSnapshot, setSubmissionSnapshot] =
    useState<EdenApplication | null>(null);
  const [completedApplication, setCompletedApplication] =
    useState<EdenApplication | null>(null);
  const startTimeRef = useRef<string | null>(null);
  const attributionRef = useRef<EdenAttribution>({
    landingPath: "/design-your-eden",
  });
  const submissionInFlightRef = useRef(false);
  const questionPanelRef = useRef<HTMLFormElement>(null);
  const handleNextRef = useRef<() => Promise<void>>(async () => undefined);

  const {
    control,
    register,
    watch,
    trigger,
    getValues,
    getFieldState,
    formState: { errors },
  } = useForm<EdenQuestionnaireValues>({
    resolver: zodResolver(edenQuestionnaireSchema),
    mode: "onTouched",
    shouldUnregister: false,
    defaultValues: {
      answers: {
        desiredOutcome: "",
        currentChallenge: "",
        systems: [],
        successMeasures: [],
      },
      contact: {
        fullName: "",
        workEmail: "",
        companyName: "",
      },
      consent: {
        inquiry: false,
        marketing: false,
      },
      website: "",
    },
  });

  const primaryGoal = watch("answers.primaryGoal");
  const desiredOutcome = watch("answers.desiredOutcome") ?? "";
  const currentChallenge = watch("answers.currentChallenge") ?? "";
  const currentStep = edenSteps[stepIndex];
  const volumeQuestion = getVolumeQuestion(primaryGoal);

  useEffect(() => {
    attributionRef.current = captureEdenAttribution();
  }, []);

  useEffect(() => {
    if (phase === "intro") return;
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
      document.getElementById("eden-phase-heading")?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [phase, stepIndex]);

  const beginQuestionnaire = () => {
    if (!startTimeRef.current) startTimeRef.current = new Date().toISOString();
    setPhase("questions");
  };

  const sendApplication = async (application: EdenApplication) => {
    if (submissionInFlightRef.current) return;
    submissionInFlightRef.current = true;
    setSubmissionError("");
    setPhase("submitting");

    try {
      await submitFrozenApplication(application);
      setCompletedApplication(application);
      setPhase("complete");
    } catch (error) {
      setSubmissionError(
        error instanceof Error
          ? error.message
          : "We could not safely record your application. Please try again."
      );
      setPhase("error");
    } finally {
      submissionInFlightRef.current = false;
    }
  };

  const createApplicationSnapshot = () => {
    const questionnaire = edenQuestionnaireSchema.parse(getValues());
    const submittedAt = new Date().toISOString();
    const startedAt =
      startTimeRef.current ?? new Date(Date.now() - 60_000).toISOString();
    const application = edenApplicationSchema.parse({
      submissionId: crypto.randomUUID(),
      startedAt,
      submittedAt,
      ...questionnaire,
      attribution: attributionRef.current,
    });
    setSubmissionSnapshot(application);
    return application;
  };

  const handleNext = async () => {
    if (isAdvancing || !currentStep) return;
    setIsAdvancing(true);

    try {
      const currentValid = await trigger([...currentStep.fields], {
        shouldFocus: true,
      });
      if (!currentValid) return;

      if (stepIndex < edenSteps.length - 1) {
        setStepIndex((index) => index + 1);
        return;
      }

      const allValid = await trigger(undefined, { shouldFocus: true });
      if (!allValid) {
        const firstInvalidStep = edenSteps.findIndex((step) =>
          step.fields.some((field) => getFieldState(field).invalid)
        );
        if (firstInvalidStep >= 0) setStepIndex(firstInvalidStep);
        return;
      }

      const application = createApplicationSnapshot();
      await sendApplication(application);
    } finally {
      setIsAdvancing(false);
    }
  };

  handleNextRef.current = handleNext;

  useEffect(() => {
    if (phase !== "questions") return;

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const input = target instanceof HTMLInputElement ? target : null;
      const isEditable =
        target instanceof HTMLTextAreaElement ||
        (input && ["text", "email", "url", "search", "tel"].includes(input.type));

      if (
        /^[1-9]$/.test(event.key) &&
        !isEditable &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey
      ) {
        const optionIndex = Number(event.key) - 1;
        const option = questionPanelRef.current?.querySelector<HTMLInputElement>(
          `input[data-option-index="${optionIndex}"]`
        );
        if (option && !option.disabled) {
          event.preventDefault();
          option.click();
          option.focus();
        }
        return;
      }

      if (event.key !== "Enter" || event.shiftKey) return;
      if (
        target instanceof HTMLButtonElement ||
        target instanceof HTMLAnchorElement
      ) {
        return;
      }
      if (
        target instanceof HTMLTextAreaElement &&
        !event.metaKey &&
        !event.ctrlKey
      ) {
        return;
      }

      event.preventDefault();
      void handleNextRef.current();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase]);

  const handleBack = () => {
    if (stepIndex === 0) {
      setPhase("intro");
      return;
    }
    setStepIndex((index) => index - 1);
  };

  const handleReviewAnswers = () => {
    setSubmissionSnapshot(null);
    setSubmissionError("");
    setStepIndex(edenSteps.length - 1);
    setPhase("questions");
  };

  const renderQuestion = () => {
    const questionNumber = stepIndex + 1;

    switch (currentStep.id) {
      case "primaryGoal":
        return (
          <QuestionFrame
            number={questionNumber}
            title="Where should your Eden create leverage first?"
            description="Choose the part of the operation where better speed, consistency, or visibility would matter most."
          >
            <Controller
              name="answers.primaryGoal"
              control={control}
              render={({ field, fieldState }) => (
                <EdenOptionGroup
                  name={field.name}
                  legend="Where should your Eden create leverage first?"
                  options={primaryGoalOptions}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />
          </QuestionFrame>
        );

      case "desiredOutcome":
        return (
          <QuestionFrame
            number={questionNumber}
            title="What should be reliably true when this is working?"
            description="Describe the better operating reality. Focus on the result you want to create."
          >
            <label htmlFor="desiredOutcome" className="sr-only">
              Desired outcome
            </label>
            <textarea
              id="desiredOutcome"
              rows={5}
              maxLength={800}
              placeholder="For example: Every qualified enquiry gets a useful response within ten minutes, with the right context ready for our team."
              aria-describedby="eden-question-description desiredOutcome-hint desiredOutcome-error"
              aria-invalid={Boolean(errors.answers?.desiredOutcome)}
              className={`${inputClasses} min-h-[160px] resize-y`}
              {...register("answers.desiredOutcome")}
            />
            <div className="flex items-start justify-between gap-4">
              <p
                id="desiredOutcome-hint"
                className="mt-2 max-w-lg font-sans text-xs leading-relaxed text-ghost-dim"
              >
                Describe the result in your own words. A clear outcome makes
                the first recommendation more useful.
              </p>
              <CharacterCount current={desiredOutcome.length} maximum={800} />
            </div>
            <ErrorMessage
              id="desiredOutcome-error"
              message={errors.answers?.desiredOutcome?.message}
            />
          </QuestionFrame>
        );

      case "currentChallenge":
        return (
          <QuestionFrame
            number={questionNumber}
            title="Where does the current workflow lose momentum?"
            description="Tell us where work waits, repeats, gets missed, or depends too heavily on one person."
          >
            <label htmlFor="currentChallenge" className="sr-only">
              Current workflow challenge
            </label>
            <textarea
              id="currentChallenge"
              rows={6}
              maxLength={1200}
              placeholder="For example: Requests arrive in three inboxes, someone copies them into a tracker, and handoffs are easy to miss when volume rises."
              aria-describedby="eden-question-description currentChallenge-hint currentChallenge-error"
              aria-invalid={Boolean(errors.answers?.currentChallenge)}
              className={`${inputClasses} min-h-[180px] resize-y`}
              {...register("answers.currentChallenge")}
            />
            <div className="flex items-start justify-between gap-4">
              <p
                id="currentChallenge-hint"
                className="mt-2 max-w-lg font-sans text-xs leading-relaxed text-ghost-dim"
              >
                The more specific you are about what happens, who handles it,
                and where it slows down, the sharper your Eden Blueprint will be.
              </p>
              <CharacterCount current={currentChallenge.length} maximum={1200} />
            </div>
            <ErrorMessage
              id="currentChallenge-error"
              message={errors.answers?.currentChallenge?.message}
            />
          </QuestionFrame>
        );

      case "workflowVolume":
        return (
          <QuestionFrame
            number={questionNumber}
            title={volumeQuestion.title}
            description={volumeQuestion.description}
          >
            <Controller
              name="answers.workflowVolume"
              control={control}
              render={({ field, fieldState }) => (
                <EdenOptionGroup
                  name={field.name}
                  legend={volumeQuestion.title}
                  options={volumeQuestion.options}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />
          </QuestionFrame>
        );

      case "teamSize":
        return (
          <QuestionFrame
            number={questionNumber}
            title="How many people feel this workflow today?"
            description="Count the people doing the work, waiting on it, managing it, or depending on its output."
          >
            <Controller
              name="answers.teamSize"
              control={control}
              render={({ field, fieldState }) => (
                <EdenOptionGroup
                  name={field.name}
                  legend="How many people feel this workflow today?"
                  options={teamSizeOptions}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                />
              )}
            />
          </QuestionFrame>
        );

      case "systems":
        return (
          <QuestionFrame
            number={questionNumber}
            title="Which kinds of systems are already in the workflow?"
            description="Select up to six categories so Eden can be shaped around the tools your team already uses."
          >
            <Controller
              name="answers.systems"
              control={control}
              render={({ field, fieldState }) => (
                <EdenOptionGroup
                  name={field.name}
                  legend="Which kinds of systems are already in the workflow?"
                  options={systemOptionList}
                  value={field.value}
                  multiple
                  maxSelections={6}
                  onBlur={field.onBlur}
                  onChange={(option) => {
                    const current = field.value ?? [];
                    if (option === "not_sure") {
                      field.onChange(
                        current.includes("not_sure") ? [] : ["not_sure"]
                      );
                      return;
                    }
                    const withoutUnknown = current.filter(
                      (value) => value !== "not_sure"
                    );
                    field.onChange(
                      withoutUnknown.includes(option)
                        ? withoutUnknown.filter((value) => value !== option)
                        : [...withoutUnknown, option]
                    );
                  }}
                  error={fieldState.error?.message}
                />
              )}
            />
          </QuestionFrame>
        );

      case "dataReadiness":
        return (
          <QuestionFrame
            number={questionNumber}
            title="How ready is the information this workflow depends on?"
            description="This sets the safest first phase. Fragmented or manual data is common, and it helps us choose where to begin."
          >
            <Controller
              name="answers.dataReadiness"
              control={control}
              render={({ field, fieldState }) => (
                <EdenOptionGroup
                  name={field.name}
                  legend="How ready is the information this workflow depends on?"
                  options={dataReadinessOptionList}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                  columns={1}
                />
              )}
            />
          </QuestionFrame>
        );

      case "autonomyPreference":
        return (
          <QuestionFrame
            number={questionNumber}
            title="How much authority should Eden earn first?"
            description="Start with the level that fits the risk. Authority can expand only after the workflow proves it deserves it."
          >
            <Controller
              name="answers.autonomyPreference"
              control={control}
              render={({ field, fieldState }) => (
                <EdenOptionGroup
                  name={field.name}
                  legend="How much authority should Eden earn first?"
                  options={autonomyOptionList}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                  columns={1}
                />
              )}
            />
          </QuestionFrame>
        );

      case "successMeasures":
        return (
          <QuestionFrame
            number={questionNumber}
            title="What evidence would make this worth building?"
            description="Choose up to four measures. The first release should have a small number of outcomes that can actually be observed."
          >
            <Controller
              name="answers.successMeasures"
              control={control}
              render={({ field, fieldState }) => (
                <EdenOptionGroup
                  name={field.name}
                  legend="What evidence would make this worth building?"
                  options={successMeasureOptionList}
                  value={field.value}
                  multiple
                  maxSelections={4}
                  onBlur={field.onBlur}
                  onChange={(option) => {
                    const current = field.value ?? [];
                    field.onChange(
                      current.includes(option)
                        ? current.filter((value) => value !== option)
                        : [...current, option]
                    );
                  }}
                  error={fieldState.error?.message}
                />
              )}
            />
          </QuestionFrame>
        );

      case "timeline":
        return (
          <QuestionFrame
            number={questionNumber}
            title="When would meaningful progress matter?"
            description="Choose the honest horizon. We use this to shape a realistic first release around your priorities."
          >
            <Controller
              name="answers.timeline"
              control={control}
              render={({ field, fieldState }) => (
                <EdenOptionGroup
                  name={field.name}
                  legend="When would meaningful progress matter?"
                  options={timelineOptionList}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                  columns={1}
                />
              )}
            />
          </QuestionFrame>
        );

      case "investmentRange":
        return (
          <QuestionFrame
            number={questionNumber}
            title="What level of build investment are you prepared to explore?"
            description="A range helps us recommend a proportionate first system. We will confirm scope and pricing together during discovery."
          >
            <Controller
              name="answers.investmentRange"
              control={control}
              render={({ field, fieldState }) => (
                <EdenOptionGroup
                  name={field.name}
                  legend="What level of build investment are you prepared to explore?"
                  options={investmentOptionList}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                  columns={1}
                />
              )}
            />
          </QuestionFrame>
        );

      case "fullName":
        return (
          <QuestionFrame
            number={questionNumber}
            title="Who are we designing this with?"
            description="Your name lets us address the Blueprint and follow up on this inquiry."
          >
            <label htmlFor="fullName" className="sr-only">
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              maxLength={100}
              placeholder="Your full name"
              aria-describedby="eden-question-description fullName-error"
              aria-invalid={Boolean(errors.contact?.fullName)}
              className={inputClasses}
              {...register("contact.fullName")}
            />
            <ErrorMessage
              id="fullName-error"
              message={errors.contact?.fullName?.message}
            />
          </QuestionFrame>
        );

      case "workEmail":
        return (
          <QuestionFrame
            number={questionNumber}
            title="Where should we send the follow-up?"
            description="Use the work email you want us to reply to. Inquiry replies and marketing preferences are handled separately."
          >
            <label htmlFor="workEmail" className="sr-only">
              Work email
            </label>
            <input
              id="workEmail"
              type="email"
              inputMode="email"
              autoComplete="email"
              maxLength={254}
              placeholder="you@company.com"
              aria-describedby="eden-question-description workEmail-error"
              aria-invalid={Boolean(errors.contact?.workEmail)}
              className={inputClasses}
              {...register("contact.workEmail")}
            />
            <ErrorMessage
              id="workEmail-error"
              message={errors.contact?.workEmail?.message}
            />
          </QuestionFrame>
        );

      case "companyName":
        return (
          <QuestionFrame
            number={questionNumber}
            title="Which company would this Eden work for?"
            description="Share the company name so we can frame your Eden Blueprint around the right operation."
          >
            <label htmlFor="companyName" className="sr-only">
              Company name
            </label>
            <input
              id="companyName"
              type="text"
              autoComplete="organization"
              maxLength={160}
              placeholder="Your company"
              aria-describedby="eden-question-description companyName-error"
              aria-invalid={Boolean(errors.contact?.companyName)}
              className={inputClasses}
              {...register("contact.companyName")}
            />
            <ErrorMessage
              id="companyName-error"
              message={errors.contact?.companyName?.message}
            />
          </QuestionFrame>
        );

      case "consents":
        return (
          <QuestionFrame
            number={questionNumber}
            title="How may we use what you have shared?"
            description="Inquiry processing and marketing are separate choices. Marketing remains optional and off by default."
          >
            <fieldset>
              <legend className="sr-only">Contact permissions</legend>
              <div className="space-y-3">
                <label className="flex cursor-pointer items-start gap-4 rounded-xl border border-ghost/[0.1] bg-surface p-5 transition-colors hover:border-cyan/30">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-5 w-5 flex-none rounded border-ghost/20 bg-void-light accent-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/40"
                    aria-invalid={Boolean(errors.consent?.inquiry)}
                    aria-describedby="inquiry-consent-copy inquiry-consent-error"
                    {...register("consent.inquiry")}
                  />
                  <span>
                    <span className="block font-sans text-sm font-medium text-ghost">
                      Respond to this inquiry <span className="text-cyan">*</span>
                    </span>
                    <span
                      id="inquiry-consent-copy"
                      className="mt-1 block font-sans text-xs leading-relaxed text-ghost-muted"
                    >
                      I agree that Aygency may use my answers and contact details
                      to assess and respond to my Eden inquiry.
                    </span>
                  </span>
                </label>
                <label className="flex cursor-pointer items-start gap-4 rounded-xl border border-ghost/[0.1] bg-surface p-5 transition-colors hover:border-cyan/30">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-5 w-5 flex-none rounded border-ghost/20 bg-void-light accent-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/40"
                    {...register("consent.marketing")}
                  />
                  <span>
                    <span className="block font-sans text-sm font-medium text-ghost">
                      Occasional practical AI systems insights
                    </span>
                    <span className="mt-1 block font-sans text-xs leading-relaxed text-ghost-muted">
                      Optional. Send me occasional Aygency insights. I can
                      unsubscribe at any time.
                    </span>
                  </span>
                </label>
              </div>
              <ErrorMessage
                id="inquiry-consent-error"
                message={errors.consent?.inquiry?.message}
              />
            </fieldset>
            <div className="pointer-events-none absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor="website">Leave this field empty</label>
              <input
                id="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                {...register("website")}
              />
            </div>
          </QuestionFrame>
        );
    }
  };

  const keyboardHint =
    currentStep.id === "desiredOutcome" || currentStep.id === "currentChallenge"
      ? "⌘ / Ctrl + Enter to continue"
      : ["fullName", "workEmail", "companyName"].includes(currentStep.id)
        ? "Enter to continue"
        : "1–9 to choose · Enter to continue";

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-void pt-24">
      <AnimatedGrid className="opacity-70" />
      <GlowOrb
        size={620}
        opacity={0.08}
        className="absolute -right-64 top-20"
      />
      <div className="pointer-events-none absolute inset-x-0 top-24 h-px bg-gradient-to-r from-transparent via-cyan/15 to-transparent" />

      <div className="relative z-10 mx-auto min-h-[calc(100svh-6rem)] max-w-7xl px-6 py-12 md:px-8 md:py-16 lg:px-12">
        {phase === "intro" && (
          <EdenIntroduction
            isReturning={Boolean(startTimeRef.current)}
            onStart={beginQuestionnaire}
          />
        )}

        {phase === "questions" && (
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
            <aside className="hidden lg:block">
              <div className="sticky top-32 border-l border-ghost/[0.08] pl-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-muted">
                  Personalisation logic
                </p>
                <p className="mt-4 font-heading text-lg font-semibold uppercase leading-tight text-ghost">
                  Intent → workflow → authority → proof
                </p>
                <p className="mt-4 font-sans text-xs leading-relaxed text-ghost-dim">
                  Every answer shows where Eden can help first. Your original
                  wording stays intact alongside the recommendation.
                </p>
                <div className="mt-8 space-y-3">
                  {["Opportunity", "Constraints", "First release", "Contact"].map(
                    (label, index) => {
                      const boundary = [0, 4, 8, 11][index];
                      const active = stepIndex >= boundary;
                      return (
                        <div key={label} className="flex items-center gap-3">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              active ? "bg-cyan" : "bg-ghost-dim/40"
                            }`}
                          />
                          <span
                            className={`font-mono text-[10px] uppercase tracking-[0.12em] ${
                              active ? "text-ghost-muted" : "text-ghost-dim/60"
                            }`}
                          >
                            {label}
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </aside>

            <div className="min-w-0">
              <EdenProgress current={stepIndex + 1} total={edenSteps.length} />
              <form
                ref={questionPanelRef}
                className="mt-9 flex min-h-[560px] flex-col rounded-2xl border border-ghost/[0.08] bg-void-light/75 p-5 backdrop-blur-xl sm:p-8 lg:p-10"
                onSubmit={(event) => event.preventDefault()}
                noValidate
              >
                <div className="flex-1">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={currentStep.id}
                      initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  onAnimationComplete={() => {
                    document
                      .getElementById("eden-phase-heading")
                      ?.focus({ preventScroll: true })
                  }}
                >
                      {renderQuestion()}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="mt-10 flex flex-col-reverse gap-4 border-t border-ghost/[0.07] pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={isAdvancing}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-cyan/20 px-5 py-3 font-heading text-xs font-semibold uppercase tracking-[0.13em] text-cyan transition-colors hover:border-cyan/40 hover:bg-cyan/[0.04] disabled:opacity-50"
                  >
                    <ArrowLeft size={15} aria-hidden="true" />
                    Back
                  </button>
                  <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center">
                    <p className="hidden font-mono text-[9px] uppercase tracking-[0.12em] text-ghost-dim xl:block">
                      {keyboardHint}
                    </p>
                    <button
                      type="button"
                      onClick={() => void handleNext()}
                      disabled={isAdvancing}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-cyan px-7 py-3 font-heading text-xs font-semibold uppercase tracking-[0.15em] text-void transition-all duration-200 hover:brightness-110 hover:shadow-glow-sm active:scale-[0.97] disabled:cursor-wait disabled:opacity-60"
                    >
                      {isAdvancing ? (
                        <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                      ) : stepIndex === edenSteps.length - 1 ? (
                        <Sparkles size={15} aria-hidden="true" />
                      ) : null}
                      {stepIndex === edenSteps.length - 1
                        ? "Show me my Eden Blueprint"
                        : "Continue"}
                      {!isAdvancing && stepIndex < edenSteps.length - 1 && (
                        <ArrowRight size={15} aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {phase === "submitting" && (
          <div className="flex min-h-[calc(100svh-13rem)] items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-xl rounded-2xl border border-ghost/[0.08] bg-void-light/80 p-8 text-center backdrop-blur-xl sm:p-12"
              aria-live="polite"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan/20 bg-cyan/[0.06] text-cyan">
                <Loader2 size={24} className="animate-spin" aria-hidden="true" />
              </div>
              <h1
                id="eden-phase-heading"
                tabIndex={-1}
                className="mt-6 font-heading text-2xl font-semibold uppercase text-white outline-none sm:text-3xl"
              >
                Recording your application
              </h1>
              <p className="mt-4 font-sans text-sm leading-relaxed text-ghost-muted">
                We&rsquo;re safely handing your original answers to the CRM,
                then shaping the Blueprint you&rsquo;ll see next.
              </p>
            </motion.div>
          </div>
        )}

        {phase === "error" && (
          <div className="flex min-h-[calc(100svh-13rem)] items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-2xl rounded-2xl border border-error/20 bg-void-light/85 p-7 text-center backdrop-blur-xl sm:p-12"
              role="alert"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-error/20 bg-error/[0.06] text-error">
                <RefreshCcw size={23} aria-hidden="true" />
              </div>
              <h1
                id="eden-phase-heading"
                tabIndex={-1}
                className="mt-6 font-heading text-2xl font-semibold uppercase text-white outline-none sm:text-3xl"
              >
                Your answers are still here
              </h1>
              <p className="mx-auto mt-4 max-w-xl font-sans text-sm leading-relaxed text-ghost-muted">
                {submissionError}
              </p>
              <p className="mx-auto mt-3 max-w-xl font-sans text-xs leading-relaxed text-ghost-dim">
                Retry sends the exact same frozen application and submission ID.
                Reviewing answers creates a fresh submission only when you submit again.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    if (submissionSnapshot) void sendApplication(submissionSnapshot);
                  }}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-cyan px-8 py-3 font-heading text-[13px] font-semibold uppercase tracking-[0.15em] text-void transition-all hover:brightness-110 hover:shadow-glow-sm"
                >
                  <RefreshCcw size={15} aria-hidden="true" />
                  Retry safely
                </button>
                <button
                  type="button"
                  onClick={handleReviewAnswers}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-cyan/30 px-8 py-3 font-heading text-[13px] font-semibold uppercase tracking-[0.15em] text-cyan transition-colors hover:bg-cyan/[0.05]"
                >
                  <FileText size={15} aria-hidden="true" />
                  Review answers
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {phase === "complete" && completedApplication && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <EdenBlueprint
              application={completedApplication}
              discoveryUrl={discoveryUrl}
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}
