import { createHmac } from "node:crypto";
import type { EdenLeadCapture } from "./lead-capture-schema";

export const EDEN_LEAD_CAPTURE_EVENT_TYPE = "EdenLeadCaptured.v1" as const;
export const EDEN_LEAD_CAPTURE_FORM_VERSION = "eden-lead-capture.v1" as const;
export const EDEN_LEAD_CAPTURE_ACTION = "eden_lead_capture" as const;

const MAX_BODY_BYTES = 8_192;
const MAX_ATTEMPTS = 3;
const REQUEST_TIMEOUT_MS = 6_000;
const RETRYABLE_STATUSES = new Set([408, 425, 429]);
const UUID_V4_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type SourceEnvironment = "production" | "preview" | "development" | "test";

export interface EdenLeadCapturedEvent {
  event: typeof EDEN_LEAD_CAPTURE_EVENT_TYPE;
  event_id: string;
  occurred_at: string;
  source: {
    system: "aygency-site";
    environment: SourceEnvironment;
    form_version: typeof EDEN_LEAD_CAPTURE_FORM_VERSION;
  };
  lead: {
    application_id: string;
    email: string;
    consent: {
      purpose: "sales_follow_up";
      status: "granted";
      policy_version: "eden-lead-capture-privacy.v1";
      captured_at: string;
    };
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
    action: typeof EDEN_LEAD_CAPTURE_ACTION;
  };
}

export interface EdenLeadCaptureDelivery {
  outcome: "accepted" | "duplicate";
  event: EdenLeadCapturedEvent;
  requestId: string;
}

export type EdenLeadCaptureErrorKind =
  | "configuration"
  | "conflict"
  | "rejected"
  | "timeout"
  | "unavailable";

export class EdenLeadCaptureDeliveryError extends Error {
  readonly kind: EdenLeadCaptureErrorKind;
  readonly status?: number;

  constructor(kind: EdenLeadCaptureErrorKind, status?: number) {
    super(`Eden lead capture delivery failed: ${kind}`);
    this.name = "EdenLeadCaptureDeliveryError";
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

function sourceEnvironment(): SourceEnvironment {
  if (process.env.NODE_ENV === "test") return "test";
  if (process.env.VERCEL_ENV === "production") return "production";
  if (process.env.VERCEL_ENV === "preview") return "preview";
  return process.env.NODE_ENV === "production" ? "production" : "development";
}

export function createEdenLeadCaptureEvent(
  capture: EdenLeadCapture,
  environment: SourceEnvironment = sourceEnvironment(),
): EdenLeadCapturedEvent {
  return {
    event: EDEN_LEAD_CAPTURE_EVENT_TYPE,
    event_id: capture.eventId,
    occurred_at: capture.capturedAt,
    source: {
      system: "aygency-site",
      environment,
      form_version: EDEN_LEAD_CAPTURE_FORM_VERSION,
    },
    lead: {
      application_id: capture.applicationId,
      email: capture.workEmail,
      consent: {
        purpose: "sales_follow_up",
        status: "granted",
        policy_version: "eden-lead-capture-privacy.v1",
        captured_at: capture.capturedAt,
      },
      attribution: {
        landing_path: capture.attribution.landingPath,
        referrer_origin: capture.attribution.referrerOrigin ?? null,
        utm_source: capture.attribution.utmSource ?? null,
        utm_medium: capture.attribution.utmMedium ?? null,
        utm_campaign: capture.attribution.utmCampaign ?? null,
        utm_content: capture.attribution.utmContent ?? null,
        utm_term: capture.attribution.utmTerm ?? null,
      },
    },
    bot_protection: {
      provider: "cloudflare-turnstile",
      token: capture.botToken,
      action: EDEN_LEAD_CAPTURE_ACTION,
    },
  };
}

function isLoopback(hostname: string): boolean {
  return ["127.0.0.1", "localhost", "[::1]"].includes(hostname);
}

function resolveEndpoint(value: string | undefined): string {
  if (!value) throw new EdenLeadCaptureDeliveryError("configuration");
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
      throw new EdenLeadCaptureDeliveryError("configuration");
    }
    return endpoint.toString();
  } catch (error) {
    if (error instanceof EdenLeadCaptureDeliveryError) throw error;
    throw new EdenLeadCaptureDeliveryError("configuration");
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
  return `v1=${createHmac("sha256", secret)
    .update(`${timestamp}.${body}`, "utf8")
    .digest("hex")}`;
}

export async function deliverEdenLeadCapture(
  capture: EdenLeadCapture,
  dependencies: DeliveryDependencies = {},
): Promise<EdenLeadCaptureDelivery> {
  const endpoint = resolveEndpoint(
    dependencies.endpointUrl ?? process.env.EDEN_LEAD_CAPTURE_INGEST_URL,
  );
  const signingSecret = (
    dependencies.signingSecret ?? process.env.EDEN_LEAD_CAPTURE_SIGNING_SECRET ?? ""
  ).trim();
  if (signingSecret.length < 32) {
    throw new EdenLeadCaptureDeliveryError("configuration");
  }

  const fetchImpl = dependencies.fetchImpl ?? fetch;
  const sleep =
    dependencies.sleep ??
    ((milliseconds: number) =>
      new Promise<void>((resolve) => setTimeout(resolve, milliseconds)));
  const random = dependencies.random ?? Math.random;
  const now = dependencies.now ?? Date.now;
  const frozenNow = now();
  const event = createEdenLeadCaptureEvent(capture, dependencies.environment);
  const body = JSON.stringify(event);
  if (Buffer.byteLength(body, "utf8") > MAX_BODY_BYTES) {
    throw new EdenLeadCaptureDeliveryError("rejected", 413);
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
          "Idempotency-Key": capture.eventId,
          "X-Eden-Event": EDEN_LEAD_CAPTURE_EVENT_TYPE,
          "X-Eden-Event-Id": capture.eventId,
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
          capture.applicationId,
          duplicate,
        );
        if (!receipt) {
          throw new EdenLeadCaptureDeliveryError("rejected", response.status);
        }
        return {
          outcome: duplicate ? "duplicate" : "accepted",
          event,
          requestId: receipt.requestId,
        };
      }

      if (response.status === 409) {
        throw new EdenLeadCaptureDeliveryError("conflict", 409);
      }
      if (!isRetryableStatus(response.status)) {
        throw new EdenLeadCaptureDeliveryError("rejected", response.status);
      }
      if (attempt === MAX_ATTEMPTS - 1) {
        throw new EdenLeadCaptureDeliveryError("unavailable", response.status);
      }
    } catch (error) {
      if (error instanceof EdenLeadCaptureDeliveryError) throw error;
      if (attempt === MAX_ATTEMPTS - 1) {
        const timedOut =
          controller.signal.aborted ||
          (error instanceof Error && error.name === "AbortError");
        throw new EdenLeadCaptureDeliveryError(
          timedOut ? "timeout" : "unavailable",
        );
      }
    } finally {
      clearTimeout(timeout);
    }

    await sleep(retryDelay(attempt, response, random, now()));
  }

  throw new EdenLeadCaptureDeliveryError("unavailable");
}
