import { NextResponse } from "next/server";
import { edenApplicationSchema, type EdenApplication } from "./application-schema";
import {
  deliverEdenApplication,
  EdenCrmDeliveryError,
  type EdenCrmDelivery,
} from "./crm";
import { sendEdenApplicationNotification } from "./notification";
import {
  consumeEdenApplicationRateLimit,
  type RateLimitDecision,
} from "./rate-limit";

const MAX_BODY_BYTES = 48 * 1_024;
const MIN_COMPLETION_MS = 8_000;
const MAX_CLOCK_SKEW_MS = 5 * 60 * 1_000;
const MAX_RETRY_AGE_MS = 7 * 24 * 60 * 60 * 1_000;

interface HandlerDependencies {
  deliver: (application: EdenApplication) => Promise<EdenCrmDelivery>;
  notify: (application: EdenApplication) => Promise<unknown>;
  consumeRateLimit: (request: Request) => RateLimitDecision;
  now: () => number;
}

const noStoreHeaders = {
  "Cache-Control": "no-store, max-age=0",
};

function jsonResponse(
  body: Record<string, unknown>,
  status: number,
  headers: Record<string, string> = {}
) {
  return NextResponse.json(body, {
    status,
    headers: { ...noStoreHeaders, ...headers },
  });
}

function rateHeaders(decision: RateLimitDecision, now: number) {
  return {
    "X-RateLimit-Limit": String(decision.limit),
    "X-RateLimit-Remaining": String(decision.remaining),
    "X-RateLimit-Reset": String(Math.ceil(decision.resetAt / 1_000)),
    ...(decision.allowed
      ? {}
      : {
          "Retry-After": String(
            Math.max(Math.ceil((decision.resetAt - now) / 1_000), 1)
          ),
        }),
  };
}

function configuredOrigins() {
  return (process.env.EDEN_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
    .flatMap((origin) => {
      try {
        const parsed = new URL(origin);
        return parsed.protocol === "https:" && parsed.origin === origin
          ? [parsed.origin]
          : [];
      } catch {
        return [];
      }
    });
}

export function isTrustedEdenOrigin(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") {
    return false;
  }

  const origin = request.headers.get("origin");
  if (!origin) return process.env.NODE_ENV !== "production";

  try {
    const requestOrigin = new URL(request.url).origin;
    const suppliedOrigin = new URL(origin).origin;
    return [requestOrigin, ...configuredOrigins()].includes(suppliedOrigin);
  } catch {
    return false;
  }
}

function hasValidTiming(application: EdenApplication, now: number) {
  const startedAt = Date.parse(application.startedAt);
  const submittedAt = Date.parse(application.submittedAt);
  const completionTime = submittedAt - startedAt;
  const submissionAge = now - submittedAt;

  return (
    completionTime >= MIN_COMPLETION_MS &&
    submissionAge >= -MAX_CLOCK_SKEW_MS &&
    submissionAge <= MAX_RETRY_AGE_MS
  );
}

async function readJsonBody(request: Request) {
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return { error: "too_large" as const };
  }

  const rawBody = await request.text();
  if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) {
    return { error: "too_large" as const };
  }

  try {
    return { value: JSON.parse(rawBody) as unknown };
  } catch {
    return { error: "invalid_json" as const };
  }
}

export function createEdenApplicationsPostHandler(
  dependencies: Partial<HandlerDependencies> = {}
) {
  const deliver = dependencies.deliver ?? deliverEdenApplication;
  const notify = dependencies.notify ?? sendEdenApplicationNotification;
  const consumeRateLimit =
    dependencies.consumeRateLimit ?? consumeEdenApplicationRateLimit;
  const now = dependencies.now ?? Date.now;

  return async function POST(request: Request) {
    const currentTime = now();

    if (!isTrustedEdenOrigin(request)) {
      return jsonResponse(
        { error: "This submission origin is not allowed.", code: "origin_denied" },
        403
      );
    }

    if (request.headers.get("content-type")?.split(";")[0] !== "application/json") {
      return jsonResponse(
        { error: "Send the application as JSON.", code: "unsupported_media" },
        415
      );
    }

    const rateLimit = consumeRateLimit(request);
    const responseRateHeaders = rateHeaders(rateLimit, currentTime);
    if (!rateLimit.allowed) {
      return jsonResponse(
        {
          error: "Too many attempts. Please wait before trying again.",
          code: "rate_limited",
        },
        429,
        responseRateHeaders
      );
    }

    const body = await readJsonBody(request);
    if (body.error === "too_large") {
      return jsonResponse(
        { error: "The application is too large.", code: "body_too_large" },
        413,
        responseRateHeaders
      );
    }
    if (body.error === "invalid_json") {
      return jsonResponse(
        { error: "The application could not be read.", code: "invalid_json" },
        400,
        responseRateHeaders
      );
    }

    const parsed = edenApplicationSchema.safeParse(body.value);
    if (!parsed.success) {
      return jsonResponse(
        {
          error: "Please review the highlighted answers and try again.",
          code: "invalid_application",
        },
        422,
        responseRateHeaders
      );
    }

    const application = parsed.data;

    if (application.website.trim()) {
      return jsonResponse(
        { success: true, submissionId: application.submissionId },
        202,
        responseRateHeaders
      );
    }

    if (!hasValidTiming(application, currentTime)) {
      return jsonResponse(
        {
          error: "Please review your application before submitting.",
          code: "timing_rejected",
        },
        422,
        responseRateHeaders
      );
    }

    try {
      const delivery = await deliver(application);

      if (delivery.outcome === "accepted") {
        try {
          await notify(application);
        } catch {
          console.error("[eden-applications] notification_failed", {
            submissionId: application.submissionId,
          });
        }
      }

      return jsonResponse(
        {
          success: true,
          submissionId: application.submissionId,
          duplicate: delivery.outcome === "duplicate",
        },
        202,
        responseRateHeaders
      );
    } catch (error) {
      const failure =
        error instanceof EdenCrmDeliveryError ? error.kind : "unexpected";
      console.error("[eden-applications] crm_delivery_failed", {
        submissionId: application.submissionId,
        failure,
      });

      return jsonResponse(
        {
          error:
            "We could not safely record your application. Your answers are still here. Please try again.",
          code: "crm_unavailable",
        },
        503,
        responseRateHeaders
      );
    }
  };
}
