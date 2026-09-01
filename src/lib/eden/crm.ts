import { createHmac } from "node:crypto";
import type { EdenApplication, OrganisationSizeBand } from "./application-schema";

export const EDEN_CRM_EVENT_TYPE = "EdenApplicationSubmitted.v1" as const;
export const EDEN_CRM_FORM_VERSION = "eden-application.v3" as const;
export const EDEN_CRM_ACTION = "eden_application_submit" as const;
const MAX_BODY_BYTES = 65_536;
const MAX_ATTEMPTS = 3;
const REQUEST_TIMEOUT_MS = 6_000;
const RETRYABLE_STATUSES = new Set([408, 425, 429]);
const UUID_V4_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type SourceEnvironment = "production" | "preview" | "development" | "test";
type AnswerKind = "text" | "integer" | "boolean" | "single_select" | "multi_select";
type AnswerValue = string | number | boolean | string[];

interface EdenContractAnswer {
  question_id: string;
  question_version: 1;
  kind: AnswerKind;
  value: AnswerValue;
}

export interface EdenApplicationSubmittedEvent {
  event: typeof EDEN_CRM_EVENT_TYPE;
  event_id: string;
  occurred_at: string;
  source: {
    system: "aygency-site";
    environment: SourceEnvironment;
    form_version: typeof EDEN_CRM_FORM_VERSION;
  };
  application: {
    application_id: string;
    application_version: 1;
    submitted_at: string;
    contact: {
      full_name: string;
      email: string;
      phone: string | null;
      role_title: string | null;
      linkedin_url: string | null;
    };
    organisation: {
      name: string;
      website: string | null;
      company_number: string | null;
      country_code: string;
      size_band: OrganisationSizeBand;
    } | null;
    answers: EdenContractAnswer[];
    consents: Array<{
      purpose: "application_processing" | "sales_follow_up" | "marketing";
      status: "granted" | "denied";
      policy_version: "eden-application-privacy.v1";
      captured_at: string;
    }>;
    attribution: {
      landing_path: string;
      referrer_origin: string | null;
      utm_source: string | null;
      utm_medium: string | null;
      utm_campaign: string | null;
      utm_content: string | null;
      utm_term: string | null;
    };
  };
  bot_protection: {
    provider: "cloudflare-turnstile";
    token: string;
    action: typeof EDEN_CRM_ACTION;
  };
}

export interface EdenCrmDelivery {
  outcome: "accepted" | "duplicate";
  event: EdenApplicationSubmittedEvent;
  requestId: string;
}

export type EdenCrmErrorKind =
  | "configuration"
  | "conflict"
  | "rejected"
  | "timeout"
  | "unavailable";

export class EdenCrmDeliveryError extends Error {
  readonly kind: EdenCrmErrorKind;
  readonly status?: number;

  constructor(kind: EdenCrmErrorKind, status?: number) {
    super(`Eden CRM delivery failed: ${kind}`);
    this.name = "EdenCrmDeliveryError";
    this.kind = kind;
    this.status = status;
  }
}

type FetchLike = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

interface DeliveryDependencies {
  endpointUrl?: string;
  signingSecret?: string;
  environment?: SourceEnvironment;
  fetchImpl?: FetchLike;
  sleep?: (milliseconds: number) => Promise<void>;
  random?: () => number;
  now?: () => number;
}

function nullableTrimmed(value: string): string | null {
  const trimmed = value.trim();
  return trimmed || null;
}

function answer(
  questionId: string,
  kind: AnswerKind,
  value: AnswerValue,
): EdenContractAnswer {
  return {
    question_id: questionId,
    question_version: 1,
    kind,
    value,
  };
}

function sourceEnvironment(): SourceEnvironment {
  if (process.env.NODE_ENV === "test") return "test";
  if (process.env.VERCEL_ENV === "production") return "production";
  if (process.env.VERCEL_ENV === "preview") return "preview";
  return process.env.NODE_ENV === "production" ? "production" : "development";
}

export function createEdenCrmEvent(
  application: EdenApplication,
  options: { occurredAt?: string; environment?: SourceEnvironment } = {},
): EdenApplicationSubmittedEvent {
  const answers: EdenContractAnswer[] = [
    answer("eden-primary-outcomes", "multi_select", [...application.answers.primaryOutcomes]),
    answer("eden-normal-week-support", "text", application.answers.normalWeekSupport),
    answer("eden-desired-weekly-result", "text", application.answers.desiredWeeklyResult),
    answer("eden-current-friction", "text", application.answers.currentFriction),
    answer(
      "eden-weekly-workload-volume",
      "single_select",
      application.answers.weeklyWorkloadVolume,
    ),
    answer("eden-hours-lost-weekly", "integer", application.answers.hoursLostWeekly),
    answer("eden-meeting-load", "single_select", application.answers.meetingLoad),
    answer("eden-email-load", "single_select", application.answers.emailLoad),
    answer(
      "eden-calendar-complexity",
      "single_select",
      application.answers.calendarComplexity,
    ),
    answer("eden-travel-frequency", "single_select", application.answers.travelFrequency),
    answer("eden-current-tools", "multi_select", [...application.answers.currentTools]),
    answer("eden-context-readiness", "single_select", application.answers.contextReadiness),
    answer("eden-day-one-context", "text", application.answers.dayOneContext),
    answer("eden-decision-style", "single_select", application.answers.decisionStyle),
    answer("eden-starting-authority", "single_select", application.answers.startingAuthority),
    answer("eden-decision-boundaries", "text", application.answers.decisionBoundaries),
    ...(application.answers.briefingPreferences.trim()
      ? [
          answer(
            "eden-briefing-preferences",
            "text",
            application.answers.briefingPreferences,
          ),
        ]
      : []),
    answer("eden-success-measure", "text", application.answers.successMeasure),
    answer("eden-operated-service-ack", "boolean", application.answers.operatedServiceAck),
    answer(
      "eden-target-start-window",
      "single_select",
      application.answers.targetStartWindow,
    ),
    answer("eden-buying-priority", "single_select", application.answers.buyingPriority),
  ];
  if (application.answers.anythingElse.trim()) {
    answers.push(
      answer("eden-anything-else", "text", application.answers.anythingElse),
    );
  }

  const capturedAt = application.submittedAt;
  const consents: EdenApplicationSubmittedEvent["application"]["consents"] = [
    {
      purpose: "application_processing",
      status: "granted",
      policy_version: "eden-application-privacy.v1",
      captured_at: capturedAt,
    },
    {
      purpose: "sales_follow_up",
      status: "granted",
      policy_version: "eden-application-privacy.v1",
      captured_at: capturedAt,
    },
  ];
  consents.push({
    purpose: "marketing",
    status: application.consent.marketing ? "granted" : "denied",
    policy_version: "eden-application-privacy.v1",
    captured_at: capturedAt,
  });

  return {
    event: EDEN_CRM_EVENT_TYPE,
    event_id: application.eventId,
    occurred_at: options.occurredAt ?? application.submittedAt,
    source: {
      system: "aygency-site",
      environment: options.environment ?? sourceEnvironment(),
      form_version: EDEN_CRM_FORM_VERSION,
    },
    application: {
      application_id: application.applicationId,
      application_version: 1,
      submitted_at: application.submittedAt,
      contact: {
        full_name: application.contact.fullName,
        email: application.contact.workEmail,
        phone: nullableTrimmed(application.contact.phone),
        role_title: nullableTrimmed(application.contact.roleTitle),
        linkedin_url: nullableTrimmed(application.contact.linkedinUrl),
      },
      organisation: application.organisation
        ? {
          name: application.organisation.name,
          website: nullableTrimmed(application.organisation.website),
          company_number: nullableTrimmed(application.organisation.companyNumber),
          country_code: application.organisation.countryCode,
          size_band: application.organisation.sizeBand,
        }
        : null,
      answers,
      consents,
      attribution: {
        landing_path: application.attribution.landingPath,
        referrer_origin: application.attribution.referrerOrigin ?? null,
        utm_source: application.attribution.utmSource ?? null,
        utm_medium: application.attribution.utmMedium ?? null,
        utm_campaign: application.attribution.utmCampaign ?? null,
        utm_content: application.attribution.utmContent ?? null,
        utm_term: application.attribution.utmTerm ?? null,
      },
    },
    bot_protection: {
      provider: "cloudflare-turnstile",
      token: application.botToken,
      action: EDEN_CRM_ACTION,
    },
  };
}

function isLoopback(hostname: string): boolean {
  return ["127.0.0.1", "localhost", "[::1]"].includes(hostname);
}

function resolveEndpoint(value: string | undefined): string {
  if (!value) throw new EdenCrmDeliveryError("configuration");
  try {
    const endpoint = new URL(value);
    const secure = endpoint.protocol === "https:";
    const disposableLocal =
      process.env.NODE_ENV !== "production" &&
      endpoint.protocol === "http:" &&
      isLoopback(endpoint.hostname);
    if (
      (!secure && !disposableLocal) ||
      endpoint.username ||
      endpoint.password ||
      endpoint.hash
    ) {
      throw new EdenCrmDeliveryError("configuration");
    }
    return endpoint.toString();
  } catch (error) {
    if (error instanceof EdenCrmDeliveryError) throw error;
    throw new EdenCrmDeliveryError("configuration");
  }
}

function parseRetryAfter(value: string | null, now: number): number | null {
  if (!value) return null;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) {
    return Math.min(seconds * 1_000, 2_000);
  }
  const date = Date.parse(value);
  if (Number.isNaN(date)) return null;
  return Math.min(Math.max(date - now, 0), 2_000);
}

function retryDelay(
  attempt: number,
  response: Response | null,
  random: () => number,
  now: number,
): number {
  const retryAfter = parseRetryAfter(response?.headers.get("retry-after") ?? null, now);
  if (retryAfter !== null) return retryAfter;
  return Math.round(150 * 2 ** attempt + random() * 100);
}

function isRetryableStatus(status: number): boolean {
  return RETRYABLE_STATUSES.has(status) || status >= 500;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

async function readJson(response: Response): Promise<unknown> {
  const raw = await response.text();
  if (Buffer.byteLength(raw, "utf8") > 8_192) return null;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

function acceptedReceipt(
  value: unknown,
  applicationId: string,
  expectedDuplicate: boolean,
): { requestId: string } | null {
  if (!isRecord(value)) return null;
  if (
    value.accepted !== true ||
    value.duplicate !== expectedDuplicate ||
    value.application_id !== applicationId ||
    typeof value.request_id !== "string" ||
    !UUID_V4_PATTERN.test(value.request_id) ||
    Object.keys(value).some(
      (key) => !["accepted", "duplicate", "application_id", "request_id"].includes(key),
    )
  ) {
    return null;
  }
  return { requestId: value.request_id };
}

function signRequest(secret: string, timestamp: string, body: string): string {
  return `v1=${createHmac("sha256", secret).update(`${timestamp}.${body}`, "utf8").digest("hex")}`;
}

export async function deliverEdenApplication(
  application: EdenApplication,
  dependencies: DeliveryDependencies = {},
): Promise<EdenCrmDelivery> {
  const endpoint = resolveEndpoint(
    dependencies.endpointUrl ?? process.env.EDEN_APPLICATION_INGEST_URL,
  );
  const signingSecret = (
    dependencies.signingSecret ?? process.env.EDEN_APPLICATION_SIGNING_SECRET ?? ""
  ).trim();
  if (signingSecret.length < 32) {
    throw new EdenCrmDeliveryError("configuration");
  }

  const fetchImpl = dependencies.fetchImpl ?? fetch;
  const sleep =
    dependencies.sleep ??
    ((milliseconds: number) =>
      new Promise<void>((resolve) => setTimeout(resolve, milliseconds)));
  const random = dependencies.random ?? Math.random;
  const now = dependencies.now ?? Date.now;
  const frozenNow = now();
  const occurredAt = new Date(
    Math.max(frozenNow, Date.parse(application.submittedAt)),
  ).toISOString();
  const event = createEdenCrmEvent(application, {
    occurredAt,
    environment: dependencies.environment,
  });
  const body = JSON.stringify(event);
  if (Buffer.byteLength(body, "utf8") > MAX_BODY_BYTES) {
    throw new EdenCrmDeliveryError("rejected", 413);
  }
  const timestamp = String(Math.floor(frozenNow / 1_000));
  const signature = signRequest(signingSecret, timestamp, body);

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    let response: Response | null = null;

    try {
      response = await fetchImpl(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Idempotency-Key": application.eventId,
          "X-Eden-Event": EDEN_CRM_EVENT_TYPE,
          "X-Eden-Event-Id": application.eventId,
          "X-Eden-Timestamp": timestamp,
          "X-Eden-Signature": signature,
        },
        body,
        cache: "no-store",
        redirect: "error",
        signal: controller.signal,
      });

      if (response.status === 200 || response.status === 201) {
        const duplicate = response.status === 200;
        const receipt = acceptedReceipt(
          await readJson(response),
          application.applicationId,
          duplicate,
        );
        if (!receipt) throw new EdenCrmDeliveryError("rejected", response.status);
        return {
          outcome: duplicate ? "duplicate" : "accepted",
          event,
          requestId: receipt.requestId,
        };
      }

      if (response.status === 409) {
        throw new EdenCrmDeliveryError("conflict", 409);
      }
      if (!isRetryableStatus(response.status)) {
        throw new EdenCrmDeliveryError("rejected", response.status);
      }
      if (attempt === MAX_ATTEMPTS - 1) {
        throw new EdenCrmDeliveryError("unavailable", response.status);
      }
    } catch (error) {
      if (error instanceof EdenCrmDeliveryError) throw error;
      if (attempt === MAX_ATTEMPTS - 1) {
        const timedOut =
          controller.signal.aborted ||
          (error instanceof Error && error.name === "AbortError");
        throw new EdenCrmDeliveryError(timedOut ? "timeout" : "unavailable");
      }
    } finally {
      clearTimeout(timeout);
    }

    await sleep(retryDelay(attempt, response, random, now()));
  }

  throw new EdenCrmDeliveryError("unavailable");
}
