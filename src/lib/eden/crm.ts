import type { EdenApplication } from "./application-schema";

export const EDEN_CRM_EVENT_TYPE = "EdenApplicationSubmitted.v1" as const;
const EDEN_CRM_SOURCE = "aygency.ai/design-your-eden" as const;
const MAX_ATTEMPTS = 3;
const REQUEST_TIMEOUT_MS = 6_000;
const RETRYABLE_STATUSES = new Set([408, 425, 429]);

export interface EdenApplicationSubmittedEvent {
  eventType: typeof EDEN_CRM_EVENT_TYPE;
  eventId: string;
  occurredAt: string;
  source: typeof EDEN_CRM_SOURCE;
  data: {
    answers: EdenApplication["answers"];
    contact: EdenApplication["contact"];
    consent: {
      inquiry: {
        granted: true;
        noticeVersion: "eden-inquiry-v1";
      };
      marketing: {
        granted: boolean;
        noticeVersion: "eden-marketing-v1";
      };
    };
    attribution: EdenApplication["attribution"];
    funnel: {
      startedAt: string;
    };
  };
}

export interface EdenCrmDelivery {
  outcome: "accepted" | "duplicate";
  event: EdenApplicationSubmittedEvent;
}

type EdenCrmErrorKind =
  | "configuration"
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
  init?: RequestInit
) => Promise<Response>;

interface DeliveryDependencies {
  endpointUrl?: string;
  apiToken?: string;
  fetchImpl?: FetchLike;
  sleep?: (milliseconds: number) => Promise<void>;
  random?: () => number;
}

export function createEdenCrmEvent(
  application: EdenApplication
): EdenApplicationSubmittedEvent {
  return {
    eventType: EDEN_CRM_EVENT_TYPE,
    eventId: application.submissionId,
    occurredAt: application.submittedAt,
    source: EDEN_CRM_SOURCE,
    data: {
      answers: application.answers,
      contact: application.contact,
      consent: {
        inquiry: {
          granted: true,
          noticeVersion: "eden-inquiry-v1",
        },
        marketing: {
          granted: application.consent.marketing,
          noticeVersion: "eden-marketing-v1",
        },
      },
      attribution: application.attribution,
      funnel: {
        startedAt: application.startedAt,
      },
    },
  };
}

function resolveEndpoint(value: string | undefined) {
  if (!value) {
    throw new EdenCrmDeliveryError("configuration");
  }

  try {
    const endpoint = new URL(value);
    if (
      endpoint.protocol !== "https:" ||
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

function parseRetryAfter(value: string | null, now = Date.now()) {
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
  random: () => number
) {
  const retryAfter = parseRetryAfter(response?.headers.get("retry-after") ?? null);
  if (retryAfter !== null) return retryAfter;
  return Math.round(150 * 2 ** attempt + random() * 100);
}

function isRetryableStatus(status: number) {
  return RETRYABLE_STATUSES.has(status) || status >= 500;
}

export async function deliverEdenApplication(
  application: EdenApplication,
  dependencies: DeliveryDependencies = {}
): Promise<EdenCrmDelivery> {
  const endpoint = resolveEndpoint(
    dependencies.endpointUrl ?? process.env.EDEN_CRM_ENDPOINT_URL
  );
  const apiToken = (
    dependencies.apiToken ?? process.env.EDEN_CRM_API_TOKEN ?? ""
  ).trim();

  if (!apiToken) {
    throw new EdenCrmDeliveryError("configuration");
  }

  const fetchImpl = dependencies.fetchImpl ?? fetch;
  const sleep =
    dependencies.sleep ??
    ((milliseconds: number) =>
      new Promise<void>((resolve) => setTimeout(resolve, milliseconds)));
  const random = dependencies.random ?? Math.random;
  const event = createEdenCrmEvent(application);
  const body = JSON.stringify(event);

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    let response: Response | null = null;

    try {
      response = await fetchImpl(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
          "Idempotency-Key": application.submissionId,
          "X-Aygency-Event-Type": EDEN_CRM_EVENT_TYPE,
        },
        body,
        cache: "no-store",
        redirect: "error",
        signal: controller.signal,
      });

      if (response.ok) {
        return { outcome: "accepted", event };
      }

      if (response.status === 409) {
        return { outcome: "duplicate", event };
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

    await sleep(retryDelay(attempt, response, random));
  }

  throw new EdenCrmDeliveryError("unavailable");
}
