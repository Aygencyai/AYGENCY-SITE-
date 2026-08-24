"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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
import EdenTurnstile from "@/components/eden/EdenTurnstile";
import {
  edenApplicationSchema,
  edenQuestionnaireSchema,
  type EdenApplication,
  type EdenAttribution,
  type EdenQuestionnaireValues,
} from "@/lib/eden/application-schema";
import { captureEdenAttribution } from "@/lib/eden/attribution";
import {
  acknowledgementOptionList,
  budgetReadinessOptionList,
  calendarComplexityOptionList,
  currentToolOptionList,
  decisionAuthorityOptionList,
  edenSteps,
  emailLoadOptionList,
  meetingLoadOptionList,
  openLoopVolumeOptionList,
  organisationSizeBandOptionList,
  primaryOutcomeOptionList,
  targetStartWindowOptionList,
  travelFrequencyOptionList,
} from "@/lib/eden/questionnaire";

interface DesignYourEdenClientProps {
  applicationId: string;
  discoveryUrl: string;
  eventId: string;
  turnstileSiteKey: string;
}

type FunnelPhase = "intro" | "questions" | "submitting" | "error" | "complete";

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
    case "crm_conflict":
      return "We could not confirm this retry safely. Please contact Aygency with your Blueprint reference.";
    case "crm_unavailable":
      return "The CRM is temporarily unavailable. Your Eden Blueprint is ready to preview.";
    case "crm_not_configured":
      return "CRM storage is pending for this local preview. Your Eden Blueprint is ready below.";
    case "rate_limited":
      return "This browser has made several recent attempts. Please wait a moment before trying again.";
    case "timing_rejected":
      return "This security check has expired. Review your answers to create a fresh submission attempt.";
    case "invalid_application":
      return "Please review your answers, then submit them again.";
    default:
      return fallback ?? "Your application is ready for another submission attempt.";
  }
}

function QuestionFrame({ number, title, description, children }: QuestionFrameProps) {
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
  let finalMessage = "We could not safely record your application. Please try again.";
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
  applicationId,
  discoveryUrl,
  eventId,
  turnstileSiteKey,
}: DesignYourEdenClientProps) {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<FunnelPhase>("intro");
  const [stepIndex, setStepIndex] = useState(0);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [submissionSnapshot, setSubmissionSnapshot] = useState<EdenApplication | null>(null);
  const [completedApplication, setCompletedApplication] = useState<EdenApplication | null>(null);
  const [submissionRecorded, setSubmissionRecorded] = useState(false);
  const startTimeRef = useRef<string | null>(null);
  const attributionRef = useRef<EdenAttribution>({ landingPath: "/design-your-eden" });
  const submissionInFlightRef = useRef(false);
  const questionPanelRef = useRef<HTMLFormElement>(null);
  const handleNextRef = useRef<() => Promise<void>>(async () => undefined);

  const {
    control,
    register,
    watch,
    trigger,
    clearErrors,
    getValues,
    getFieldState,
    setValue,
    formState: { errors },
  } = useForm<EdenQuestionnaireValues>({
    resolver: zodResolver(edenQuestionnaireSchema),
    mode: "onTouched",
    shouldUnregister: false,
    defaultValues: {
      answers: {
        primaryOutcomes: [],
        currentFriction: "",
        currentTools: [],
        anythingElse: "",
      },
      contact: {
        fullName: "",
        workEmail: "",
        phone: "",
        roleTitle: "",
        linkedinUrl: "",
      },
      organisation: {
        name: "",
        website: "",
        companyNumber: "",
        countryCode: "",
      },
      consent: { inquiry: false, marketing: false },
      botToken: "",
      website: "",
    },
  });

  const currentFriction = watch("answers.currentFriction") ?? "";
  const anythingElse = watch("answers.anythingElse") ?? "";
  const currentStep = edenSteps[stepIndex];

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
          : "We could not safely record your application. Please try again.",
      );
      setPhase("error");
    } finally {
      submissionInFlightRef.current = false;
    }
  };

  const createApplicationSnapshot = () => {
    const questionnaire = edenQuestionnaireSchema.parse(getValues());
    const submittedAt = new Date().toISOString();
    const startedAt = startTimeRef.current ?? new Date(Date.now() - 60_000).toISOString();
    const parsed = edenApplicationSchema.safeParse({
      eventId,
      applicationId,
      startedAt,
      submittedAt,
      ...questionnaire,
      attribution: attributionRef.current,
    });
    if (!parsed.success) {
      console.error("[eden-application] snapshot_invalid", {
        paths: parsed.error.issues.map((issue) => issue.path.join(".")),
      });
      throw new EdenSubmissionError(
        "Please review your application before submitting.",
        "invalid_application",
      );
    }
    const application = parsed.data;
    setSubmissionSnapshot(application);
    return application;
  };

  const handleNext = async () => {
    if (isAdvancing || !currentStep) return;
    setIsAdvancing(true);
    try {
      const currentValid = await trigger([...currentStep.fields], { shouldFocus: true });
      if (!currentValid) return;
      if (stepIndex < edenSteps.length - 1) {
        setStepIndex((index) => index + 1);
        return;
      }
      const allValid = await trigger(undefined, { shouldFocus: true });
      if (!allValid) {
        const firstInvalidStep = edenSteps.findIndex((step) =>
          step.fields.some((field) => getFieldState(field).invalid),
        );
        if (firstInvalidStep >= 0) setStepIndex(firstInvalidStep);
        return;
      }
      await sendApplication(createApplicationSnapshot());
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
        (input && ["text", "email", "url", "search", "tel", "number"].includes(input.type));

      if (
        /^[1-9]$/.test(event.key) &&
        !isEditable &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey
      ) {
        const optionIndex = Number(event.key) - 1;
        const option = questionPanelRef.current?.querySelector<HTMLInputElement>(
          `input[data-option-index="${optionIndex}"]`,
        );
        if (option && !option.disabled) {
          event.preventDefault();
          option.click();
          option.focus();
        }
        return;
      }

      if (event.key !== "Enter" || event.shiftKey) return;
      if (target instanceof HTMLButtonElement || target instanceof HTMLAnchorElement) return;
      if (target instanceof HTMLTextAreaElement && !event.metaKey && !event.ctrlKey) return;
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
    setValue("botToken", "", { shouldDirty: true, shouldValidate: false });
    clearErrors("botToken");
    setStepIndex(edenSteps.length - 1);
    setPhase("questions");
  };

  const handlePreviewBlueprint = () => {
    if (!submissionSnapshot) return;
    setCompletedApplication(submissionSnapshot);
    setSubmissionRecorded(false);
    setPhase("complete");
  };

  const renderSingleChoice = <T extends string>(
    name:
      | "answers.openLoopVolume"
      | "answers.meetingLoad"
      | "answers.emailLoad"
      | "answers.calendarComplexity"
      | "answers.travelFrequency"
      | "answers.decisionAuthority"
      | "answers.targetStartWindow"
      | "answers.budgetReadiness",
    legend: string,
    options: ReadonlyArray<{ value: T; label: string; description?: string }>,
  ) => (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <EdenOptionGroup
          name={field.name}
          legend={legend}
          options={options}
          value={field.value as T | undefined}
          onChange={field.onChange}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  );

  const renderQuestion = () => {
    const questionNumber = stepIndex + 1;
    switch (currentStep.id) {
      case "workEmail":
        return (
          <QuestionFrame
            number={questionNumber}
            title="Where should we send your Eden Blueprint?"
            description="Start with your work email. It remains in this browser until you submit the complete application."
          >
            <label htmlFor="workEmail" className="sr-only">Work email</label>
            <input
              id="workEmail"
              type="email"
              inputMode="email"
              autoComplete="email"
              maxLength={254}
              placeholder="you@company.com"
              aria-invalid={Boolean(errors.contact?.workEmail)}
              aria-describedby="eden-question-description workEmail-error"
              className={inputClasses}
              {...register("contact.workEmail")}
            />
            <ErrorMessage id="workEmail-error" message={errors.contact?.workEmail?.message} />
          </QuestionFrame>
        );

      case "primaryOutcomes":
        return (
          <QuestionFrame
            number={questionNumber}
            title="What should Eden improve first?"
            description="Choose every outcome that belongs in the first discovery conversation."
          >
            <Controller
              name="answers.primaryOutcomes"
              control={control}
              render={({ field, fieldState }) => (
                <EdenOptionGroup
                  name={field.name}
                  legend="What should Eden improve first?"
                  options={primaryOutcomeOptionList}
                  value={field.value}
                  multiple
                  maxSelections={9}
                  onBlur={field.onBlur}
                  onChange={(option) => {
                    const current = field.value ?? [];
                    field.onChange(
                      current.includes(option)
                        ? current.filter((value) => value !== option)
                        : [...current, option],
                    );
                  }}
                  error={fieldState.error?.message}
                />
              )}
            />
          </QuestionFrame>
        );

      case "currentFriction":
        return (
          <QuestionFrame
            number={questionNumber}
            title="What currently takes your attention or gets missed?"
            description="Describe the commitments, preparation, and follow-through that create the most friction."
          >
            <label htmlFor="currentFriction" className="sr-only">Current friction</label>
            <textarea
              id="currentFriction"
              rows={6}
              maxLength={1500}
              placeholder="For example: Follow-ups sit across email, meeting notes, and our task board. I spend too much time rebuilding context and remembering who needs a response."
              aria-describedby="eden-question-description currentFriction-hint currentFriction-error"
              aria-invalid={Boolean(errors.answers?.currentFriction)}
              className={`${inputClasses} min-h-[180px] resize-y`}
              {...register("answers.currentFriction")}
            />
            <div className="flex items-start justify-between gap-4">
              <p id="currentFriction-hint" className="mt-2 max-w-lg font-sans text-xs leading-relaxed text-ghost-dim">
                Do not include passwords, credentials, messages, transcripts, or private operational data.
              </p>
              <CharacterCount current={currentFriction.length} maximum={1500} />
            </div>
            <ErrorMessage id="currentFriction-error" message={errors.answers?.currentFriction?.message} />
          </QuestionFrame>
        );

      case "hoursLostWeekly":
        return (
          <QuestionFrame
            number={questionNumber}
            title="How many hours does this cost in a typical week?"
            description="Use a whole-number estimate from 0 to 168. A measured estimate is more useful than a polished one."
          >
            <label htmlFor="hoursLostWeekly" className="sr-only">Hours lost weekly</label>
            <input
              id="hoursLostWeekly"
              type="number"
              inputMode="numeric"
              min={0}
              max={168}
              step={1}
              placeholder="14"
              aria-invalid={Boolean(errors.answers?.hoursLostWeekly)}
              aria-describedby="eden-question-description hoursLostWeekly-error"
              className={inputClasses}
              {...register("answers.hoursLostWeekly", { valueAsNumber: true })}
            />
            <ErrorMessage id="hoursLostWeekly-error" message={errors.answers?.hoursLostWeekly?.message} />
          </QuestionFrame>
        );

      case "openLoopVolume":
        return (
          <QuestionFrame number={questionNumber} title="How many open loops compete at once?" description="Think about unresolved replies, promises, actions, and decisions that still need follow-through.">
            {renderSingleChoice("answers.openLoopVolume", "Open-loop volume", openLoopVolumeOptionList)}
          </QuestionFrame>
        );
      case "meetingLoad":
        return (
          <QuestionFrame number={questionNumber} title="How heavy is your meeting load?" description="Include the preparation and follow-up around meetings, not only time spent in the room.">
            {renderSingleChoice("answers.meetingLoad", "Meeting load", meetingLoadOptionList)}
          </QuestionFrame>
        );
      case "emailLoad":
        return (
          <QuestionFrame number={questionNumber} title="How heavy is your email load?" description="Choose the level that best reflects triage, replies, introductions, and follow-ups.">
            {renderSingleChoice("answers.emailLoad", "Email load", emailLoadOptionList)}
          </QuestionFrame>
        );
      case "calendarComplexity":
        return (
          <QuestionFrame number={questionNumber} title="How complex is your calendar?" description="Consider attendees, changes, time zones, travel, and preparation dependencies.">
            {renderSingleChoice("answers.calendarComplexity", "Calendar complexity", calendarComplexityOptionList)}
          </QuestionFrame>
        );
      case "travelFrequency":
        return (
          <QuestionFrame number={questionNumber} title="How often do you travel for work?" description="This determines whether mobility coordination belongs in Eden's first capability plan.">
            {renderSingleChoice("answers.travelFrequency", "Travel frequency", travelFrequencyOptionList)}
          </QuestionFrame>
        );

      case "currentTools":
        return (
          <QuestionFrame number={questionNumber} title="Which tools hold the context Eden would need?" description="Choose the named providers you use today. Slack and other providers are confirmed during discovery.">
            <Controller
              name="answers.currentTools"
              control={control}
              render={({ field, fieldState }) => (
                <EdenOptionGroup
                  name={field.name}
                  legend="Current tools"
                  options={currentToolOptionList}
                  value={field.value}
                  multiple
                  maxSelections={7}
                  onBlur={field.onBlur}
                  onChange={(option) => {
                    const current = field.value ?? [];
                    field.onChange(
                      current.includes(option)
                        ? current.filter((value) => value !== option)
                        : [...current, option],
                    );
                  }}
                  error={fieldState.error?.message}
                />
              )}
            />
          </QuestionFrame>
        );

      case "decisionAuthority":
        return (
          <QuestionFrame number={questionNumber} title="What is your role in the decision?" description="This records the buying path without treating an email address as identity or authority.">
            {renderSingleChoice("answers.decisionAuthority", "Decision authority", decisionAuthorityOptionList)}
          </QuestionFrame>
        );
      case "targetStartWindow":
        return (
          <QuestionFrame number={questionNumber} title="When would you like Eden to start?" description="Choose the window that reflects your current readiness.">
            {renderSingleChoice("answers.targetStartWindow", "Target start window", targetStartWindowOptionList)}
          </QuestionFrame>
        );
      case "budgetReadiness":
        return (
          <QuestionFrame number={questionNumber} title="How ready is the budget decision?" description="We ask about readiness, not a guessed amount. Pricing and scope are worked through during discovery.">
            {renderSingleChoice("answers.budgetReadiness", "Budget readiness", budgetReadinessOptionList)}
          </QuestionFrame>
        );

      case "acknowledgements":
        return (
          <QuestionFrame number={questionNumber} title="Confirm Eden's operating boundaries" description="Both answers are recorded exactly. A ‘not yet’ answer is valid and becomes a visible discovery question.">
            <div className="space-y-8">
              <div>
                <p className="mb-3 font-sans text-sm font-medium text-ghost">Do you understand that Aygency operates Eden after launch?</p>
                <Controller
                  name="answers.operatedServiceAck"
                  control={control}
                  render={({ field, fieldState }) => (
                    <EdenOptionGroup
                      name={field.name}
                      legend="Aygency-operated service acknowledgement"
                      options={acknowledgementOptionList}
                      value={field.value === undefined ? undefined : field.value ? "yes" : "no"}
                      onChange={(value) => field.onChange(value === "yes")}
                      onBlur={field.onBlur}
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </div>
              <div>
                <p className="mb-3 font-sans text-sm font-medium text-ghost">Do you agree that this application contains sales context only, with no credentials, private Eden memory, conversations, or customer operational data?</p>
                <Controller
                  name="answers.dataBoundaryAck"
                  control={control}
                  render={({ field, fieldState }) => (
                    <EdenOptionGroup
                      name={field.name}
                      legend="Safe application-data boundary acknowledgement"
                      options={acknowledgementOptionList}
                      value={field.value === undefined ? undefined : field.value ? "yes" : "no"}
                      onChange={(value) => field.onChange(value === "yes")}
                      onBlur={field.onBlur}
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </div>
            </div>
          </QuestionFrame>
        );

      case "contactDetails":
        return (
          <QuestionFrame number={questionNumber} title="Who are we designing this with?" description="Your name is required. Phone, role, and LinkedIn are optional and stay within the application record.">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="fullName" className="mb-2 block font-sans text-xs text-ghost-muted">Full name <span className="text-cyan">*</span></label>
                <input id="fullName" type="text" autoComplete="name" maxLength={120} className={inputClasses} aria-invalid={Boolean(errors.contact?.fullName)} {...register("contact.fullName")} />
                <ErrorMessage id="fullName-error" message={errors.contact?.fullName?.message} />
              </div>
              <div>
                <label htmlFor="roleTitle" className="mb-2 block font-sans text-xs text-ghost-muted">Role title</label>
                <input id="roleTitle" type="text" autoComplete="organization-title" maxLength={120} className={inputClasses} {...register("contact.roleTitle")} />
                <ErrorMessage id="roleTitle-error" message={errors.contact?.roleTitle?.message} />
              </div>
              <div>
                <label htmlFor="phone" className="mb-2 block font-sans text-xs text-ghost-muted">Phone (international format)</label>
                <input id="phone" type="tel" autoComplete="tel" maxLength={16} placeholder="+447700900123" className={inputClasses} {...register("contact.phone")} />
                <ErrorMessage id="phone-error" message={errors.contact?.phone?.message} />
              </div>
              <div>
                <label htmlFor="linkedinUrl" className="mb-2 block font-sans text-xs text-ghost-muted">LinkedIn URL</label>
                <input id="linkedinUrl" type="url" autoComplete="url" maxLength={2048} placeholder="https://www.linkedin.com/in/your-profile" className={inputClasses} {...register("contact.linkedinUrl")} />
                <ErrorMessage id="linkedinUrl-error" message={errors.contact?.linkedinUrl?.message} />
              </div>
            </div>
          </QuestionFrame>
        );

      case "organisation":
        return (
          <QuestionFrame number={questionNumber} title="Which organisation would Eden support?" description="These matching attributes help the CRM find possible records without making email the primary identity.">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="organisationName" className="mb-2 block font-sans text-xs text-ghost-muted">Organisation name <span className="text-cyan">*</span></label>
                <input id="organisationName" type="text" autoComplete="organization" maxLength={200} className={inputClasses} {...register("organisation.name")} />
                <ErrorMessage id="organisationName-error" message={errors.organisation?.name?.message} />
              </div>
              <div>
                <label htmlFor="organisationWebsite" className="mb-2 block font-sans text-xs text-ghost-muted">Website</label>
                <input id="organisationWebsite" type="url" inputMode="url" autoComplete="url" maxLength={2048} placeholder="https://example.com" className={inputClasses} {...register("organisation.website")} />
                <ErrorMessage id="organisationWebsite-error" message={errors.organisation?.website?.message} />
              </div>
              <div>
                <label htmlFor="companyNumber" className="mb-2 block font-sans text-xs text-ghost-muted">Company number</label>
                <input id="companyNumber" type="text" maxLength={32} className={inputClasses} {...register("organisation.companyNumber")} />
                <ErrorMessage id="companyNumber-error" message={errors.organisation?.companyNumber?.message} />
              </div>
              <div>
                <label htmlFor="countryCode" className="mb-2 block font-sans text-xs text-ghost-muted">Two-letter country code <span className="text-cyan">*</span></label>
                <input id="countryCode" type="text" autoComplete="country" minLength={2} maxLength={2} placeholder="GB" className={`${inputClasses} uppercase`} {...register("organisation.countryCode", { setValueAs: (value) => String(value).trim().toUpperCase() })} />
                <ErrorMessage id="countryCode-error" message={errors.organisation?.countryCode?.message} />
              </div>
              <div>
                <p className="mb-2 font-sans text-xs text-ghost-muted">Organisation size <span className="text-cyan">*</span></p>
                <Controller
                  name="organisation.sizeBand"
                  control={control}
                  render={({ field, fieldState }) => (
                    <EdenOptionGroup name={field.name} legend="Organisation size" options={organisationSizeBandOptionList} value={field.value} onChange={field.onChange} onBlur={field.onBlur} error={fieldState.error?.message} columns={1} />
                  )}
                />
              </div>
            </div>
          </QuestionFrame>
        );

      case "anythingElse":
        return (
          <QuestionFrame number={questionNumber} title="Anything else for the discovery call?" description="Optional. Add bounded sales context only; do not paste messages, transcripts, credentials, or private operational data.">
            <label htmlFor="anythingElse" className="sr-only">Additional discovery context</label>
            <textarea id="anythingElse" rows={5} maxLength={1000} placeholder="For example: Start with follow-through before expanding into travel coordination." className={`${inputClasses} min-h-[160px] resize-y`} {...register("answers.anythingElse")} />
            <CharacterCount current={anythingElse.length} maximum={1000} />
            <ErrorMessage id="anythingElse-error" message={errors.answers?.anythingElse?.message} />
          </QuestionFrame>
        );

      case "consents":
        return (
          <QuestionFrame number={questionNumber} title="How may we use what you shared?" description="Application processing and follow-up are required to respond. Marketing remains optional and off by default.">
            <fieldset>
              <legend className="sr-only">Contact permissions</legend>
              <div className="space-y-3">
                <Controller
                  name="consent.inquiry"
                  control={control}
                  render={({ field }) => (
                    <label className="flex cursor-pointer items-start gap-4 rounded-xl border border-ghost/[0.1] bg-surface p-5 transition-colors hover:border-cyan/30">
                      <input
                        ref={field.ref}
                        name={field.name}
                        type="checkbox"
                        checked={field.value}
                        onBlur={field.onBlur}
                        onChange={(event) => {
                          const granted = event.target.checked;
                          field.onChange(granted);
                          if (granted) {
                            clearErrors("consent.inquiry");
                          }
                        }}
                        className="mt-0.5 h-5 w-5 flex-none rounded border-ghost/20 bg-void-light accent-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/40"
                        aria-invalid={Boolean(errors.consent?.inquiry)}
                        aria-describedby="inquiry-consent-copy inquiry-consent-error"
                      />
                      <span>
                        <span className="block font-sans text-sm font-medium text-ghost">Process and follow up on this application <span className="text-cyan">*</span></span>
                        <span id="inquiry-consent-copy" className="mt-1 block font-sans text-xs leading-relaxed text-ghost-muted">I agree that Aygency may use these answers and contact details to assess and respond to my Eden application.</span>
                      </span>
                    </label>
                  )}
                />
                <Controller
                  name="consent.marketing"
                  control={control}
                  render={({ field }) => (
                    <label className="flex cursor-pointer items-start gap-4 rounded-xl border border-ghost/[0.1] bg-surface p-5 transition-colors hover:border-cyan/30">
                      <input
                        ref={field.ref}
                        name={field.name}
                        type="checkbox"
                        checked={field.value}
                        onBlur={field.onBlur}
                        onChange={(event) => field.onChange(event.target.checked)}
                        className="mt-0.5 h-5 w-5 flex-none rounded border-ghost/20 bg-void-light accent-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/40"
                      />
                      <span>
                        <span className="block font-sans text-sm font-medium text-ghost">Aygency newsletter and Eden updates</span>
                        <span className="mt-1 block font-sans text-xs leading-relaxed text-ghost-muted">Optional. Send me practical AI ideas and occasional Eden updates.</span>
                      </span>
                    </label>
                  )}
                />
              </div>
              <ErrorMessage id="inquiry-consent-error" message={errors.consent?.inquiry?.message} />
            </fieldset>
            <div className="mt-6 rounded-xl border border-ghost/[0.08] bg-surface/60 p-4">
              <input type="hidden" {...register("botToken")} />
              <EdenTurnstile
                siteKey={turnstileSiteKey}
                error={errors.botToken?.message}
                onToken={(token) => setValue("botToken", token, { shouldDirty: true, shouldValidate: true })}
              />
            </div>
            <div className="pointer-events-none absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor="website">Leave this field empty</label>
              <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
            </div>
          </QuestionFrame>
        );
    }
  };

  const textStepIds = ["currentFriction", "anythingElse"];
  const inputStepIds = ["workEmail", "hoursLostWeekly", "contactDetails", "organisation"];
  const keyboardHint = textStepIds.includes(currentStep.id)
    ? "⌘ / Ctrl + Enter to continue"
    : inputStepIds.includes(currentStep.id)
      ? "Enter to continue"
      : "1–9 to choose · Enter to continue";

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-void pt-24">
      <AnimatedGrid className="opacity-70" />
      <GlowOrb size={620} opacity={0.08} className="absolute -right-64 top-20" />
      <div className="pointer-events-none absolute inset-x-0 top-24 h-px bg-gradient-to-r from-transparent via-cyan/15 to-transparent" />
      <div className="relative z-10 mx-auto min-h-[calc(100svh-6rem)] max-w-7xl px-6 py-12 md:px-8 md:py-16 lg:px-12">
        {phase === "intro" && <EdenIntroduction isReturning={Boolean(startTimeRef.current)} onStart={beginQuestionnaire} />}

        {phase === "questions" && (
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
            <aside className="hidden lg:block">
              <div className="sticky top-32 border-l border-ghost/[0.08] pl-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-muted">Personalisation logic</p>
                <p className="mt-4 font-heading text-lg font-semibold uppercase leading-tight text-ghost">Pain → workload → fit → readiness</p>
                <p className="mt-4 font-sans text-xs leading-relaxed text-ghost-dim">Every answer remains versioned alongside Eden&rsquo;s deterministic score and Blueprint.</p>
                <div className="mt-8 space-y-3">
                  {["Start", "Pain", "Workload", "Readiness", "Identity"].map((label, index) => {
                    const boundary = [0, 1, 4, 10, 14][index];
                    const active = stepIndex >= boundary;
                    return (
                      <div key={label} className="flex items-center gap-3">
                        <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-cyan" : "bg-ghost-dim/40"}`} />
                        <span className={`font-mono text-[10px] uppercase tracking-[0.12em] ${active ? "text-ghost-muted" : "text-ghost-dim/60"}`}>{label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </aside>

            <div className="min-w-0">
              <EdenProgress current={stepIndex + 1} total={edenSteps.length} />
              <form ref={questionPanelRef} className="mt-9 flex min-h-[560px] flex-col rounded-2xl border border-ghost/[0.08] bg-void-light/75 p-5 backdrop-blur-xl sm:p-8 lg:p-10" onSubmit={(event) => event.preventDefault()} noValidate>
                <div className="flex-1">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={currentStep.id}
                      initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
                      onAnimationComplete={() => document.getElementById("eden-phase-heading")?.focus({ preventScroll: true })}
                    >
                      {renderQuestion()}
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="mt-10 flex flex-col-reverse gap-4 border-t border-ghost/[0.07] pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <button type="button" onClick={handleBack} disabled={isAdvancing} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-cyan/20 px-5 py-3 font-heading text-xs font-semibold uppercase tracking-[0.13em] text-cyan transition-colors hover:border-cyan/40 hover:bg-cyan/[0.04] disabled:opacity-50">
                    <ArrowLeft size={15} aria-hidden="true" /> Back
                  </button>
                  <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center">
                    <p className="hidden font-mono text-[9px] uppercase tracking-[0.12em] text-ghost-dim xl:block">{keyboardHint}</p>
                    <button type="button" onClick={() => void handleNext()} disabled={isAdvancing} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-cyan px-7 py-3 font-heading text-xs font-semibold uppercase tracking-[0.15em] text-void transition-all duration-200 hover:brightness-110 hover:shadow-glow-sm active:scale-[0.97] disabled:cursor-wait disabled:opacity-60">
                      {isAdvancing ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : stepIndex === edenSteps.length - 1 ? <Sparkles size={15} aria-hidden="true" /> : null}
                      {stepIndex === edenSteps.length - 1 ? "Show me my Eden Blueprint" : "Continue"}
                      {!isAdvancing && stepIndex < edenSteps.length - 1 && <ArrowRight size={15} aria-hidden="true" />}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {phase === "submitting" && (
          <div className="flex min-h-[calc(100svh-13rem)] items-center justify-center">
            <motion.div initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: prefersReducedMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }} className="w-full max-w-xl rounded-2xl border border-ghost/[0.08] bg-void-light/80 p-8 text-center backdrop-blur-xl sm:p-12" aria-live="polite">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan/20 bg-cyan/[0.06] text-cyan"><Loader2 size={24} className="animate-spin" aria-hidden="true" /></div>
              <h1 id="eden-phase-heading" tabIndex={-1} className="mt-6 font-heading text-2xl font-semibold uppercase text-ghost outline-none sm:text-3xl">Recording your Eden application</h1>
              <p className="mt-4 font-sans text-sm leading-relaxed text-ghost-muted">We&rsquo;re handing the exact validated application to the CRM before preparing the Blueprint you see next.</p>
            </motion.div>
          </div>
        )}

        {phase === "error" && (
          <div className="flex min-h-[calc(100svh-13rem)] items-center justify-center">
            <motion.div initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: prefersReducedMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }} className="w-full max-w-2xl rounded-2xl border border-error/20 bg-void-light/85 p-7 text-center backdrop-blur-xl sm:p-12" role="alert">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-error/20 bg-error/[0.06] text-error"><RefreshCcw size={23} aria-hidden="true" /></div>
              <h1 id="eden-phase-heading" tabIndex={-1} className="mt-6 font-heading text-2xl font-semibold uppercase text-ghost outline-none sm:text-3xl">CRM storage needs another attempt</h1>
              <p className="mx-auto mt-4 max-w-xl font-sans text-sm leading-relaxed text-ghost-muted">{submissionError}</p>
              <p className="mx-auto mt-3 max-w-xl font-sans text-xs leading-relaxed text-ghost-dim">Your answers remain in this browser. Retry preserves the exact snapshot; review creates a fresh timestamp and security proof.</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={() => { if (submissionSnapshot) void sendApplication(submissionSnapshot); }} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-cyan px-8 py-3 font-heading text-[13px] font-semibold uppercase tracking-[0.15em] text-void transition-all hover:brightness-110 hover:shadow-glow-sm"><RefreshCcw size={15} aria-hidden="true" />Retry safely</button>
                <button type="button" onClick={handlePreviewBlueprint} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-cyan/30 px-8 py-3 font-heading text-[13px] font-semibold uppercase tracking-[0.15em] text-cyan transition-colors hover:bg-cyan/[0.05]"><Eye size={15} aria-hidden="true" />Preview my Blueprint</button>
              </div>
              <div className="mt-5 flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-6">
                <button type="button" onClick={handleReviewAnswers} className="inline-flex min-h-11 items-center justify-center gap-2 font-sans text-sm text-ghost-muted underline decoration-ghost-dim underline-offset-4 transition-colors hover:text-cyan"><FileText size={14} aria-hidden="true" />Review answers</button>
                <a href="mailto:build@aygency.ai?subject=Eden%20AI%20Personal%20Assistant%20enquiry" className="inline-flex min-h-11 items-center justify-center gap-2 font-sans text-sm text-ghost-muted underline decoration-ghost-dim underline-offset-4 transition-colors hover:text-cyan"><Mail size={14} aria-hidden="true" />Email build@aygency.ai</a>
              </div>
            </motion.div>
          </div>
        )}

        {phase === "complete" && completedApplication && (
          <motion.div initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: prefersReducedMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}>
            <EdenBlueprint application={completedApplication} discoveryUrl={discoveryUrl} recorded={submissionRecorded} />
          </motion.div>
        )}
      </div>
    </section>
  );
}
