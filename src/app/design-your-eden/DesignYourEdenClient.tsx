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
import {
  edenApplicationSchema,
  edenQuestionnaireSchema,
  type EdenApplication,
  type EdenAttribution,
  type EdenQuestionnaireValues,
} from "@/lib/eden/application-schema";
import { captureEdenAttribution } from "@/lib/eden/attribution";
import { countryOptionList } from "@/lib/eden/countries";
import {
  edenLeadCaptureSchema,
  type EdenLeadCapture,
} from "@/lib/eden/lead-capture-schema";
import {
  buyingPriorityOptionList,
  calendarComplexityOptionList,
  contextReadinessOptionList,
  currentToolOptionList,
  decisionStyleOptionList,
  edenSteps,
  emailLoadOptionList,
  meetingLoadOptionList,
  organisationSizeBandOptionList,
  primaryOutcomeOptionList,
  serviceModelOptionList,
  startingAuthorityOptionList,
  targetStartWindowOptionList,
  travelFrequencyOptionList,
  weeklyWorkloadVolumeOptionList,
} from "@/lib/eden/questionnaire";

interface DesignYourEdenClientProps {
  applicationId: string;
  captureEventId: string;
  discoveryUrl: string;
  eventId: string;
  localPreview: boolean;
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
      return "This security check has expired. Refresh the page to create a fresh attempt.";
    case "invalid_capture":
      return "Check your email, contact permission, and security check before continuing.";
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

interface SubmissionReceipt {
  recorded: boolean;
}

async function fetchWithTimeout(endpoint: string, body: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);
  try {
    return await fetch(endpoint, {
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
      response = await fetchWithTimeout("/api/eden/applications", frozenBody);
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
      recorded?: boolean;
    } | null;

    if (response.ok && result?.success) {
      return { recorded: result.recorded !== false } satisfies SubmissionReceipt;
    }
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

async function submitFrozenLeadCapture(capture: EdenLeadCapture) {
  const frozenBody = JSON.stringify(capture);
  let finalMessage = "We could not record your inquiry. Please try again.";
  let finalCode = "capture_unavailable";

  for (let attempt = 0; attempt < 2; attempt += 1) {
    let response: Response;
    try {
      response = await fetchWithTimeout("/api/eden/leads", frozenBody);
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
      recorded?: boolean;
    } | null;

    if (response.ok && result?.success) {
      return { recorded: result.recorded !== false } satisfies SubmissionReceipt;
    }

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
  captureEventId,
  discoveryUrl,
  eventId,
  localPreview,
}: DesignYourEdenClientProps) {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<FunnelPhase>("intro");
  const [stepIndex, setStepIndex] = useState(0);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [submissionSnapshot, setSubmissionSnapshot] = useState<EdenApplication | null>(null);
  const [completedApplication, setCompletedApplication] = useState<EdenApplication | null>(null);
  const [submissionRecorded, setSubmissionRecorded] = useState(false);
  const [captureCompleted, setCaptureCompleted] = useState(false);
  const [captureRecorded, setCaptureRecorded] = useState(false);
  const [captureError, setCaptureError] = useState("");
  const startTimeRef = useRef<string | null>(null);
  const attributionRef = useRef<EdenAttribution>({ landingPath: "/design-your-eden" });
  const captureSnapshotRef = useRef<EdenLeadCapture | null>(null);
  const captureInFlightRef = useRef(false);
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
    formState: { errors },
  } = useForm<EdenQuestionnaireValues>({
    resolver: zodResolver(edenQuestionnaireSchema),
    mode: "onTouched",
    shouldUnregister: false,
    defaultValues: {
      answers: {
        primaryOutcomes: [],
        normalWeekSupport: "",
        desiredWeeklyResult: "",
        currentFriction: "",
        currentTools: [],
        dayOneContext: "",
        decisionBoundaries: "",
        briefingPreferences: "",
        successMeasure: "",
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
        sizeBand: "",
      },
      consent: { inquiry: false, marketing: false },
      website: "",
    },
  });

  const openTextValues = {
    normalWeekSupport: watch("answers.normalWeekSupport") ?? "",
    desiredWeeklyResult: watch("answers.desiredWeeklyResult") ?? "",
    currentFriction: watch("answers.currentFriction") ?? "",
    dayOneContext: watch("answers.dayOneContext") ?? "",
    decisionBoundaries: watch("answers.decisionBoundaries") ?? "",
    briefingPreferences: watch("answers.briefingPreferences") ?? "",
    successMeasure: watch("answers.successMeasure") ?? "",
  };
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
      const receipt = await submitFrozenApplication(application);
      setCompletedApplication(application);
      setSubmissionRecorded(receipt.recorded);
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

  const createLeadCaptureSnapshot = () => {
    if (captureSnapshotRef.current) return captureSnapshotRef.current;

    const parsed = edenLeadCaptureSchema.safeParse({
      eventId: captureEventId,
      applicationId,
      capturedAt: new Date().toISOString(),
      workEmail: getValues("contact.workEmail"),
      inquiryConsent: getValues("consent.inquiry"),
      attribution: attributionRef.current,
      website: getValues("website"),
    });
    if (!parsed.success) {
      throw new EdenSubmissionError(
        parsed.error.issues[0]?.message ??
          "Check your email and permission before continuing.",
        "invalid_capture",
      );
    }

    captureSnapshotRef.current = parsed.data;
    return parsed.data;
  };

  const captureInquiry = async () => {
    if (captureCompleted) return true;
    if (captureInFlightRef.current) return false;

    captureInFlightRef.current = true;
    setCaptureError("");
    try {
      const receipt = await submitFrozenLeadCapture(createLeadCaptureSnapshot());
      setCaptureRecorded(receipt.recorded);
      setCaptureCompleted(true);
      return true;
    } catch (error) {
      setCaptureError(
        error instanceof Error
          ? error.message
          : "We could not record your inquiry. Please try again.",
      );
      return false;
    } finally {
      captureInFlightRef.current = false;
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
      organisation: questionnaire.organisation.name.trim()
        ? questionnaire.organisation
        : null,
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
      if (currentStep.id === "workEmail" && !(await captureInquiry())) return;
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
      | "answers.weeklyWorkloadVolume"
      | "answers.meetingLoad"
      | "answers.emailLoad"
      | "answers.calendarComplexity"
      | "answers.travelFrequency"
      | "answers.contextReadiness"
      | "answers.decisionStyle"
      | "answers.startingAuthority"
      | "answers.targetStartWindow"
      | "answers.buyingPriority",
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
            title="First, where should we send your Eden summary?"
            description="Enter your work email so we can keep your answers together and send you what Eden could do for you."
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="workEmail" className="mb-2 block font-sans text-xs text-ghost-muted">
                  Work email <span className="text-cyan">*</span>
                </label>
                <input
                  id="workEmail"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  maxLength={254}
                  placeholder="you@company.com"
                  readOnly={Boolean(captureSnapshotRef.current)}
                  aria-invalid={Boolean(errors.contact?.workEmail)}
                  aria-describedby="eden-question-description workEmail-error"
                  className={`${inputClasses} read-only:cursor-not-allowed read-only:opacity-70`}
                  {...register("contact.workEmail")}
                />
                <ErrorMessage id="workEmail-error" message={errors.contact?.workEmail?.message} />
              </div>

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
                      disabled={Boolean(captureSnapshotRef.current)}
                      onBlur={field.onBlur}
                      onChange={(event) => {
                        const granted = event.target.checked;
                        field.onChange(granted);
                        if (granted) clearErrors("consent.inquiry");
                      }}
                      className="mt-0.5 h-5 w-5 flex-none rounded border-ghost/20 bg-void-light accent-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/40 disabled:opacity-60"
                      aria-invalid={Boolean(errors.consent?.inquiry)}
                      aria-describedby="inquiry-consent-copy inquiry-consent-error"
                    />
                    <span>
                      <span className="block font-sans text-sm font-medium text-ghost">
                        Send my Eden summary and respond to my inquiry <span className="text-cyan">*</span>
                      </span>
                      <span id="inquiry-consent-copy" className="mt-1 block font-sans text-xs leading-relaxed text-ghost-muted">
                        I agree that Aygency may store my email and use my answers to prepare this Eden recommendation and contact me about it.
                      </span>
                    </span>
                  </label>
                )}
              />
              <ErrorMessage id="inquiry-consent-error" message={errors.consent?.inquiry?.message} />

              {localPreview && !captureCompleted && (
                <p className="rounded-xl border border-cyan/15 bg-cyan/[0.04] p-4 font-sans text-xs leading-relaxed text-ghost-muted">
                  Local preview mode: you can inspect the complete experience, but this email and your answers will not be recorded.
                </p>
              )}

              {captureCompleted && (
                <p className="rounded-xl border border-cyan/20 bg-cyan/[0.05] p-4 font-sans text-sm leading-relaxed text-ghost">
                  {captureRecorded
                    ? "Inquiry recorded. Continue to see what Eden could do for you."
                    : "Local preview ready. Continue to see what Eden could do for you."}
                </p>
              )}

              {captureError && (
                <div role="alert" className="rounded-xl border border-error/20 bg-error/[0.04] p-4">
                  <p className="font-sans text-sm leading-relaxed text-error">{captureError}</p>
                  {captureSnapshotRef.current && (
                    <p className="mt-2 font-sans text-xs leading-relaxed text-ghost-muted">
                      Continue retries the exact same frozen capture. Refresh the page to use a different email.
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="pointer-events-none absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor="website-capture">Leave this field empty</label>
              <input id="website-capture" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
            </div>
          </QuestionFrame>
        );

      case "primaryOutcomes":
        return (
          <QuestionFrame
            number={questionNumber}
            title="What should Eden take off your plate first?"
            description="Choose the areas where having a reliable personal assistant would make the biggest difference."
          >
            <Controller
              name="answers.primaryOutcomes"
              control={control}
              render={({ field, fieldState }) => (
                <EdenOptionGroup
                  name={field.name}
                  legend="What should Eden take off your plate first?"
                  options={primaryOutcomeOptionList}
                  value={field.value}
                  multiple
                  maxSelections={8}
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

      case "normalWeekSupport":
        return (
          <QuestionFrame
            number={questionNumber}
            title="In a normal week, what do you most wish someone else would handle for you?"
            description="Describe the real work in your own words. Think about the things that repeatedly take time or mental energy."
          >
            <label htmlFor="normalWeekSupport" className="sr-only">Weekly support</label>
            <textarea
              id="normalWeekSupport"
              rows={6}
              maxLength={1500}
              placeholder="For example: Keep track of the people I need to reply to, prepare me for meetings, and make sure agreed actions actually happen."
              aria-describedby="eden-question-description normalWeekSupport-error"
              aria-invalid={Boolean(errors.answers?.normalWeekSupport)}
              className={`${inputClasses} min-h-[180px] resize-y`}
              {...register("answers.normalWeekSupport")}
            />
            <CharacterCount current={openTextValues.normalWeekSupport.length} maximum={1500} />
            <ErrorMessage id="normalWeekSupport-error" message={errors.answers?.normalWeekSupport?.message} />
          </QuestionFrame>
        );

      case "desiredWeeklyResult":
        return (
          <QuestionFrame
            number={questionNumber}
            title="What would you like Eden to make reliably happen every week?"
            description="Tell us what a noticeably better week would look like once Eden is helping."
          >
            <label htmlFor="desiredWeeklyResult" className="sr-only">Desired weekly result</label>
            <textarea
              id="desiredWeeklyResult"
              rows={6}
              maxLength={1500}
              placeholder="For example: I start each day knowing what matters, important follow-ups are prepared, and meetings never catch me without context."
              aria-describedby="eden-question-description desiredWeeklyResult-error"
              aria-invalid={Boolean(errors.answers?.desiredWeeklyResult)}
              className={`${inputClasses} min-h-[180px] resize-y`}
              {...register("answers.desiredWeeklyResult")}
            />
            <CharacterCount current={openTextValues.desiredWeeklyResult.length} maximum={1500} />
            <ErrorMessage id="desiredWeeklyResult-error" message={errors.answers?.desiredWeeklyResult?.message} />
          </QuestionFrame>
        );

      case "currentFriction":
        return (
          <QuestionFrame
            number={questionNumber}
            title="What gets missed or delayed when you are busy, and what happens when it slips?"
            description="This helps us understand both the problem and why fixing it would matter."
          >
            <label htmlFor="currentFriction" className="sr-only">Current friction</label>
            <textarea
              id="currentFriction"
              rows={6}
              maxLength={1500}
              placeholder="For example: Follow-ups are delayed because they sit across email and meeting notes. People have to chase me, decisions slow down, and I lose time rebuilding the context."
              aria-describedby="eden-question-description currentFriction-hint currentFriction-error"
              aria-invalid={Boolean(errors.answers?.currentFriction)}
              className={`${inputClasses} min-h-[180px] resize-y`}
              {...register("answers.currentFriction")}
            />
            <div className="flex items-start justify-between gap-4">
              <p id="currentFriction-hint" className="mt-2 max-w-lg font-sans text-xs leading-relaxed text-ghost-dim">
                Do not include passwords, credentials, messages, transcripts, or private operational data.
              </p>
              <CharacterCount current={openTextValues.currentFriction.length} maximum={1500} />
            </div>
            <ErrorMessage id="currentFriction-error" message={errors.answers?.currentFriction?.message} />
          </QuestionFrame>
        );

      case "hoursLostWeekly":
        return (
          <QuestionFrame
            number={questionNumber}
            title="How many hours does that work take from you in a typical week?"
            description="A rough whole-number estimate is enough. Include the time spent remembering, preparing, chasing, and checking."
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

      case "weeklyWorkloadVolume":
        return (
          <QuestionFrame
            number={questionNumber}
            title="Roughly how many tasks, requests, or follow-ups compete for your attention each week?"
            description="Choose the closest range. There is no need to count them exactly."
          >
            {renderSingleChoice(
              "answers.weeklyWorkloadVolume",
              "Weekly tasks, requests, and follow-ups",
              weeklyWorkloadVolumeOptionList,
            )}
          </QuestionFrame>
        );
      case "meetingLoad":
        return (
          <QuestionFrame number={questionNumber} title="How meeting-heavy is a normal week?" description="Include the preparation and follow-up around meetings, not only the time spent in them.">
            {renderSingleChoice("answers.meetingLoad", "Meeting load", meetingLoadOptionList)}
          </QuestionFrame>
        );
      case "emailLoad":
        return (
          <QuestionFrame number={questionNumber} title="How demanding is your inbox in a normal week?" description="Think about reading, replying, introducing people, and remembering what needs a follow-up.">
            {renderSingleChoice("answers.emailLoad", "Email load", emailLoadOptionList)}
          </QuestionFrame>
        );
      case "calendarComplexity":
        return (
          <QuestionFrame number={questionNumber} title="How much coordination does your calendar need?" description="Think about changes, attendees, time zones, travel, and protecting time for important work.">
            {renderSingleChoice("answers.calendarComplexity", "Calendar complexity", calendarComplexityOptionList)}
          </QuestionFrame>
        );
      case "travelFrequency":
        return (
          <QuestionFrame number={questionNumber} title="How often does work travel create extra planning or follow-up?" description="Choose how often travel affects your calendar, preparation, or unfinished work.">
            {renderSingleChoice("answers.travelFrequency", "Travel frequency", travelFrequencyOptionList)}
          </QuestionFrame>
        );

      case "currentTools":
        return (
          <QuestionFrame number={questionNumber} title="Where would Eden need to work with you?" description="Choose the tools that currently hold your messages, calendar, notes, or tasks.">
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

      case "contextReadiness":
        return (
          <QuestionFrame
            number={questionNumber}
            title="How ready is the information Eden would need?"
            description="Think about your preferences, responsibilities, contacts, projects, and usual ways of working."
          >
            {renderSingleChoice(
              "answers.contextReadiness",
              "Information readiness",
              contextReadinessOptionList,
            )}
          </QuestionFrame>
        );

      case "dayOneContext":
        return (
          <QuestionFrame
            number={questionNumber}
            title="What should Eden understand about you or your work from day one?"
            description="Share the useful background that would help a personal assistant support you well. Keep it high level and do not include private records or credentials."
          >
            <label htmlFor="dayOneContext" className="sr-only">Day-one context</label>
            <textarea
              id="dayOneContext"
              rows={6}
              maxLength={1500}
              placeholder="For example: I split my time between client work and running the company. Mornings are for focused work, and I want important decisions grouped rather than sent one at a time."
              aria-describedby="eden-question-description dayOneContext-error"
              aria-invalid={Boolean(errors.answers?.dayOneContext)}
              className={`${inputClasses} min-h-[180px] resize-y`}
              {...register("answers.dayOneContext")}
            />
            <CharacterCount current={openTextValues.dayOneContext.length} maximum={1500} />
            <ErrorMessage id="dayOneContext-error" message={errors.answers?.dayOneContext?.message} />
          </QuestionFrame>
        );

      case "decisionStyle":
        return (
          <QuestionFrame
            number={questionNumber}
            title="When Eden needs your decision, how should she present it?"
            description="Your Eden supports you alone. This tells her how to bring choices back in the way you find easiest to act on."
          >
            {renderSingleChoice(
              "answers.decisionStyle",
              "Decision presentation style",
              decisionStyleOptionList,
            )}
          </QuestionFrame>
        );

      case "startingAuthority":
        return (
          <QuestionFrame
            number={questionNumber}
            title="How should Eden begin helping?"
            description="This sets the starting point for how much Eden prepares or handles before coming back to you."
          >
            {renderSingleChoice(
              "answers.startingAuthority",
              "Starting level of help",
              startingAuthorityOptionList,
            )}
          </QuestionFrame>
        );

      case "decisionBoundaries":
        return (
          <QuestionFrame
            number={questionNumber}
            title="Which decisions should Eden always bring back to you?"
            description="Describe the choices where you always want the final say."
          >
            <label htmlFor="decisionBoundaries" className="sr-only">Decision boundaries</label>
            <textarea
              id="decisionBoundaries"
              rows={6}
              maxLength={1500}
              placeholder="For example: Anything involving money, commitments to a client, changes to important dates, or messages sent in my name."
              aria-describedby="eden-question-description decisionBoundaries-error"
              aria-invalid={Boolean(errors.answers?.decisionBoundaries)}
              className={`${inputClasses} min-h-[180px] resize-y`}
              {...register("answers.decisionBoundaries")}
            />
            <CharacterCount current={openTextValues.decisionBoundaries.length} maximum={1500} />
            <ErrorMessage id="decisionBoundaries-error" message={errors.answers?.decisionBoundaries?.message} />
          </QuestionFrame>
        );

      case "briefingPreferences":
        return (
          <QuestionFrame
            number={questionNumber}
            title="What would you like Eden to brief you on, and how often?"
            description="Optional. Tell us what you would want to hear each morning, before meetings, at the end of the day, or only when something needs you."
          >
            <label htmlFor="briefingPreferences" className="sr-only">Briefing preferences</label>
            <textarea
              id="briefingPreferences"
              rows={5}
              maxLength={1000}
              placeholder="For example: A short morning plan, a five-minute meeting brief, and one end-of-day list of anything still waiting on me."
              aria-describedby="eden-question-description briefingPreferences-error"
              className={`${inputClasses} min-h-[160px] resize-y`}
              {...register("answers.briefingPreferences")}
            />
            <CharacterCount current={openTextValues.briefingPreferences.length} maximum={1000} />
            <ErrorMessage id="briefingPreferences-error" message={errors.answers?.briefingPreferences?.message} />
          </QuestionFrame>
        );

      case "successMeasure":
        return (
          <QuestionFrame
            number={questionNumber}
            title="How would you know Eden is earning her place?"
            description="Describe the result that would make Eden feel clearly worthwhile to you."
          >
            <label htmlFor="successMeasure" className="sr-only">Success measure</label>
            <textarea
              id="successMeasure"
              rows={5}
              maxLength={1000}
              placeholder="For example: I recover five focused hours a week, fewer people have to chase me, and I arrive at important meetings already prepared."
              aria-describedby="eden-question-description successMeasure-error"
              aria-invalid={Boolean(errors.answers?.successMeasure)}
              className={`${inputClasses} min-h-[160px] resize-y`}
              {...register("answers.successMeasure")}
            />
            <CharacterCount current={openTextValues.successMeasure.length} maximum={1000} />
            <ErrorMessage id="successMeasure-error" message={errors.answers?.successMeasure?.message} />
          </QuestionFrame>
        );

      case "targetStartWindow":
        return (
          <QuestionFrame number={questionNumber} title="When would you like Eden to start?" description="Choose the window that reflects your current readiness.">
            {renderSingleChoice("answers.targetStartWindow", "Target start window", targetStartWindowOptionList)}
          </QuestionFrame>
        );
      case "buyingPriority":
        return (
          <QuestionFrame
            number={questionNumber}
            title="What matters more when choosing your Eden?"
            description="Choose the statement that most honestly reflects how you would make the decision."
          >
            {renderSingleChoice(
              "answers.buyingPriority",
              "Outcome or price priority",
              buyingPriorityOptionList,
            )}
          </QuestionFrame>
        );

      case "serviceModel":
        return (
          <QuestionFrame
            number={questionNumber}
            title="Who should look after Eden once she is set up?"
            description="Tell us whether you want Aygency to keep Eden running and improving with you, or whether you want to maintain her yourself."
          >
            <Controller
              name="answers.operatedServiceAck"
              control={control}
              render={({ field, fieldState }) => (
                <EdenOptionGroup
                  name={field.name}
                  legend="Eden service model"
                  options={serviceModelOptionList}
                  value={
                    field.value === undefined
                      ? undefined
                      : field.value
                        ? "managed"
                        : "self_maintained"
                  }
                  onChange={(value) => field.onChange(value === "managed")}
                  onBlur={field.onBlur}
                  error={fieldState.error?.message}
                  columns={1}
                />
              )}
            />
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
          <QuestionFrame
            number={questionNumber}
            title="If you want to share, which organisation would Eden support?"
            description="Optional. If you share a website, we can use public information about the organisation to make Eden more relevant. Leave every field blank to continue without sharing organisation details."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="organisationName" className="mb-2 block font-sans text-xs text-ghost-muted">Organisation name</label>
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
                <label htmlFor="countryCode" className="mb-2 block font-sans text-xs text-ghost-muted">Country</label>
                <select
                  id="countryCode"
                  autoComplete="country"
                  className={inputClasses}
                  {...register("organisation.countryCode")}
                >
                  <option value="">Choose a country</option>
                  {countryOptionList.map((country) => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </select>
                <ErrorMessage id="countryCode-error" message={errors.organisation?.countryCode?.message} />
              </div>
              <div>
                <p className="mb-2 font-sans text-xs text-ghost-muted">Organisation size</p>
                <Controller
                  name="organisation.sizeBand"
                  control={control}
                  render={({ field, fieldState }) => (
                    <EdenOptionGroup name={field.name} legend="Organisation size" options={organisationSizeBandOptionList} value={field.value || undefined} onChange={field.onChange} onBlur={field.onBlur} error={fieldState.error?.message} columns={1} />
                  )}
                />
              </div>
            </div>
          </QuestionFrame>
        );

      case "anythingElse":
        return (
          <QuestionFrame
            number={questionNumber}
            title="Is there anything else Eden should understand?"
            description="Optional. Add anything that would help us understand the personal assistant you want. You can also choose whether to receive occasional Eden updates."
          >
            <label htmlFor="anythingElse" className="sr-only">Additional discovery context</label>
            <textarea
              id="anythingElse"
              rows={4}
              maxLength={1000}
              placeholder="For example: I prefer one clear summary rather than lots of notifications, and I want Eden to start with work before helping with household logistics."
              className={`${inputClasses} min-h-[140px] resize-y`}
              {...register("answers.anythingElse")}
            />
            <CharacterCount current={anythingElse.length} maximum={1000} />
            <ErrorMessage id="anythingElse-error" message={errors.answers?.anythingElse?.message} />
            <fieldset>
              <legend className="sr-only">Optional marketing permission</legend>
              <div className="mt-6 space-y-3">
                <div className="rounded-xl border border-cyan/15 bg-cyan/[0.04] p-5">
                  <p className="font-sans text-sm font-medium text-ghost">Your Eden inquiry permission is already recorded</p>
                  <p className="mt-1 font-sans text-xs leading-relaxed text-ghost-muted">
                    This lets us prepare your result and contact you about this inquiry. It does not subscribe you to marketing.
                  </p>
                </div>
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
                        <span className="block font-sans text-sm font-medium text-ghost">Send me useful Eden updates too</span>
                        <span className="mt-1 block font-sans text-xs leading-relaxed text-ghost-muted">Optional and off by default. This includes practical ideas and occasional product updates.</span>
                      </span>
                    </label>
                  )}
                />
              </div>
            </fieldset>
            {localPreview && (
              <p className="mt-6 rounded-xl border border-cyan/15 bg-cyan/[0.04] p-4 font-sans text-xs leading-relaxed text-ghost-muted">
                Local preview mode: production security verification and CRM recording are intentionally inactive.
              </p>
            )}
            <div className="pointer-events-none absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor="website">Leave this field empty</label>
              <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
            </div>
          </QuestionFrame>
        );
    }
  };

  const textStepIds = [
    "normalWeekSupport",
    "desiredWeeklyResult",
    "currentFriction",
    "dayOneContext",
    "decisionBoundaries",
    "briefingPreferences",
    "successMeasure",
    "anythingElse",
  ];
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
                <p className="mt-4 font-heading text-lg font-semibold uppercase leading-tight text-ghost">Your week → your Eden → your result</p>
                <p className="mt-4 font-sans text-xs leading-relaxed text-ghost-dim">Every answer stays connected to the practical example and the Eden we could prepare for you.</p>
                <div className="mt-8 space-y-3">
                  {["Start", "Your week", "How Eden helps", "Fit", "About you"].map((label, index) => {
                    const boundary = [0, 2, 12, 19, 22][index];
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
