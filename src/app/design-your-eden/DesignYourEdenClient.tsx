"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  FileText,
  Loader2,
  Mail,
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
  buyingPriorityOptionList,
  dataReadinessOptionList,
  edenSteps,
  getVolumeQuestion,
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

class EdenSubmissionError extends Error {
  readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = "EdenSubmissionError";
    this.code = code;
  }
}

function getSubmissionErrorMessage(code: string | undefined, fallback?: string) {
  switch (code) {
    case "origin_denied":
      return "Please refresh this page so we can verify the submission source.";
    case "crm_unavailable":
      return "The CRM is temporarily unavailable. Your Eden Blueprint is ready to preview.";
    case "crm_not_configured":
      return "CRM storage is pending for this local preview. Your Eden Blueprint is ready below.";
    case "rate_limited":
      return "This browser has made several recent attempts. Please wait a moment before trying again.";
    case "timing_rejected":
    case "invalid_application":
      return "Please review your answers, then submit them again.";
    default:
      return (
        fallback ??
        "Your application is ready for another submission attempt."
      );
  }
}

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
    "We could not safely record your application. Please try again.";
  let finalCode = "submission_unavailable";

  for (let attempt = 0; attempt < 2; attempt += 1) {
    let response: Response;

    try {
      response = await fetchWithTimeout(frozenBody);
    } catch {
      if (attempt === 0) {
        await wait(450);
        continue;
      }
      throw new EdenSubmissionError(finalMessage, finalCode);
    }

    const result = (await response.json().catch(() => null)) as {
      success?: boolean;
      error?: string;
      code?: string;
    } | null;

    if (response.ok && result?.success) return;
    finalCode = result?.code ?? `http_${response.status}`;
    finalMessage = getSubmissionErrorMessage(finalCode, result?.error);

    if (attempt === 0 && retryableBrowserStatuses.has(response.status)) {
      const retryAfter = Number(response.headers.get("retry-after"));
      const delay = Number.isFinite(retryAfter)
        ? Math.min(Math.max(retryAfter * 1_000, 300), 1_500)
        : 450;
      await wait(delay);
      continue;
    }

    throw new EdenSubmissionError(finalMessage, finalCode);
  }

  throw new EdenSubmissionError(finalMessage, finalCode);
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
  const [submissionRecorded, setSubmissionRecorded] = useState(false);
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
      setSubmissionRecorded(true);
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
    setSubmissionRecorded(false);
    setStepIndex(edenSteps.length - 1);
    setPhase("questions");
  };

  const handlePreviewBlueprint = () => {
    if (!submissionSnapshot) return;
    setCompletedApplication(submissionSnapshot);
    setSubmissionRecorded(false);
    setPhase("complete");
  };

  const renderQuestion = () => {
    const questionNumber = stepIndex + 1;

    switch (currentStep.id) {
      case "primaryGoal":
        return (
          <QuestionFrame
            number={questionNumber}
            title="What should Eden take off your plate first?"
            description="Choose the responsibility that would make the clearest difference to your working week."
          >
            <Controller
              name="answers.primaryGoal"
              control={control}
              render={({ field, fieldState }) => (
                <EdenOptionGroup
                  name={field.name}
                  legend="What should Eden take off your plate first?"
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
            title="What should Eden make reliably true each week?"
            description="Describe the result in practical terms. Tell us what better looks like, who notices, and what no longer depends on you."
          >
            <label htmlFor="desiredOutcome" className="sr-only">
              Desired outcome
            </label>
            <textarea
              id="desiredOutcome"
              rows={5}
              maxLength={800}
              placeholder="For example: I start each day with priorities already organised, important follow-ups prepared, and a clear view of what needs my decision."
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
                A specific outcome gives us a useful first acceptance test for
                your Eden.
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
            title="What gets in the way today, and what happens when it slips?"
            description="Tell us what you repeatedly chase, remember, prepare, or copy between tools, then describe the consequence when it slows down or gets missed."
          >
            <label htmlFor="currentChallenge" className="sr-only">
              Current working challenge
            </label>
            <textarea
              id="currentChallenge"
              rows={6}
              maxLength={1200}
              placeholder="For example: Follow-ups sit across email, meeting notes, and our task board. I spend too much time rebuilding context and remembering who needs a response."
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
                Include the people and recurring moments involved. We will ask
                about the tools separately.
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
            title="Who should Eden support first?"
            description="Start with the people whose priorities, communication, or recurring work Eden would help coordinate."
          >
            <Controller
              name="answers.teamSize"
              control={control}
              render={({ field, fieldState }) => (
                <EdenOptionGroup
                  name={field.name}
                  legend="Who should Eden support first?"
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
            title="Where does the work Eden needs to understand live?"
            description="Select up to six tool categories so we can understand where Eden's working context lives."
          >
            <Controller
              name="answers.systems"
              control={control}
              render={({ field, fieldState }) => (
                <EdenOptionGroup
                  name={field.name}
                  legend="Where does the work Eden needs to understand live?"
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
            title="How ready is the context Eden would need?"
            description="Think about the emails, documents, task history, and working routines that would teach Eden how you operate."
          >
            <Controller
              name="answers.dataReadiness"
              control={control}
              render={({ field, fieldState }) => (
                <EdenOptionGroup
                  name={field.name}
                  legend="How ready is the context Eden would need?"
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
            title="What should Eden be allowed to do at first?"
            description="Choose the starting level that feels comfortable. Eden can earn more responsibility as you see the quality of her work."
          >
            <Controller
              name="answers.autonomyPreference"
              control={control}
              render={({ field, fieldState }) => (
                <EdenOptionGroup
                  name={field.name}
                  legend="What should Eden be allowed to do at first?"
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
            title="How would you know Eden is earning her place?"
            description="Choose up to four outcomes you would genuinely measure or notice in your work or your team's experience."
          >
            <Controller
              name="answers.successMeasures"
              control={control}
              render={({ field, fieldState }) => (
                <EdenOptionGroup
                  name={field.name}
                  legend="How would you know Eden is earning her place?"
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
            title="How ready are you to put Eden to work?"
            description="Choose the timing that best reflects when you would be ready to begin discovery and onboarding."
          >
            <Controller
              name="answers.timeline"
              control={control}
              render={({ field, fieldState }) => (
                <EdenOptionGroup
                  name={field.name}
                  legend="How ready are you to put Eden to work?"
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

      case "buyingPriority":
        return (
          <QuestionFrame
            number={questionNumber}
            title="What matters most when choosing your Eden?"
            description="Choose the trade-off that should lead our recommendation. Pricing is scoped after we understand the Eden you need."
          >
            <Controller
              name="answers.buyingPriority"
              control={control}
              render={({ field, fieldState }) => (
                <EdenOptionGroup
                  name={field.name}
                  legend="What matters most when choosing your Eden?"
                  options={buyingPriorityOptionList}
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
            title="Where should we send your Eden Blueprint?"
            description="Start with your work email. We will use it to respond when you submit your Eden inquiry."
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
            title="Which company would Eden be supporting?"
            description="Share the company name so we can frame your Eden Blueprint around the right working context."
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
                      Aygency newsletter and Eden updates
                    </span>
                    <span className="mt-1 block font-sans text-xs leading-relaxed text-ghost-muted">
                      Optional. Send me practical AI ideas, Eden updates, and
                      occasional Aygency news. I can unsubscribe at any time.
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
                  Role → workload → authority → value
                </p>
                <p className="mt-4 font-sans text-xs leading-relaxed text-ghost-dim">
                  Every answer shapes Eden&rsquo;s first responsibility. Your
                  original wording stays intact alongside the recommendation.
                </p>
                <div className="mt-8 space-y-3">
                  {["Start", "Opportunity", "Constraints", "First release", "Contact"].map(
                    (label, index) => {
                      const boundary = [0, 1, 5, 9, 12][index];
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
                Recording your Eden inquiry
              </h1>
              <p className="mt-4 font-sans text-sm leading-relaxed text-ghost-muted">
                We&rsquo;re safely handing your original answers to the CRM,
                then preparing the Eden example you&rsquo;ll see next.
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
                CRM storage needs another attempt
              </h1>
              <p className="mx-auto mt-4 max-w-xl font-sans text-sm leading-relaxed text-ghost-muted">
                {submissionError}
              </p>
              <p className="mx-auto mt-3 max-w-xl font-sans text-xs leading-relaxed text-ghost-dim">
                Your answers remain available in this browser. You can retry,
                review them, or preview your Blueprint before contacting us.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
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
                  onClick={handlePreviewBlueprint}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-cyan/30 px-8 py-3 font-heading text-[13px] font-semibold uppercase tracking-[0.15em] text-cyan transition-colors hover:bg-cyan/[0.05]"
                >
                  <Eye size={15} aria-hidden="true" />
                  Preview my Blueprint
                </button>
              </div>
              <div className="mt-5 flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-6">
                <button
                  type="button"
                  onClick={handleReviewAnswers}
                  className="inline-flex min-h-11 items-center justify-center gap-2 font-sans text-sm text-ghost-muted underline decoration-ghost-dim underline-offset-4 transition-colors hover:text-cyan"
                >
                  <FileText size={14} aria-hidden="true" />
                  Review answers
                </button>
                <a
                  href="mailto:build@aygency.ai?subject=Eden%20AI%20Personal%20Assistant%20enquiry"
                  className="inline-flex min-h-11 items-center justify-center gap-2 font-sans text-sm text-ghost-muted underline decoration-ghost-dim underline-offset-4 transition-colors hover:text-cyan"
                >
                  <Mail size={14} aria-hidden="true" />
                  Email build@aygency.ai
                </a>
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
              recorded={submissionRecorded}
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}
