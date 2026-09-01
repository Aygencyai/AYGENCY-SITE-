import { NextResponse } from "next/server";
import { checkBotId } from "botid/server";
import { isTrustedEdenOrigin } from "./application-handler";
import {
  deliverEdenLeadCapture,
  EdenLeadCaptureDeliveryError,
  type EdenLeadCaptureDelivery,
} from "./lead-capture-crm";
import {
  edenLeadCaptureSchema,
  type EdenLeadCapture,
} from "./lead-capture-schema";
import {
  consumeEdenLeadCaptureRateLimit,
  type RateLimitDecision,
} from "./rate-limit";

const MAX_BODY_BYTES = 6 * 1_024;
const MAX_CLOCK_SKEW_MS = 5 * 60 * 1_000;

interface HandlerDependencies {
  deliver: (capture: EdenLeadCapture) => Promise<EdenLeadCaptureDelivery>;
  consumeRateLimit: (request: Request) => RateLimitDecision;
  verifyBrowser: () => Promise<boolean>;
  now: () => number;
}

const noStoreHeaders = {
  "Cache-Control": "no-store, max-age=0",
};

function jsonResponse(
  body: Record<string, unknown>,
  status: number,
  headers: Record<string, string> = {},
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
            Math.max(Math.ceil((decision.resetAt - now) / 1_000), 1),
          ),
        }),
  };
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

function isCaptureCurrent(capture: EdenLeadCapture, now: number) {
  return Math.abs(now - Date.parse(capture.capturedAt)) <= MAX_CLOCK_SKEW_MS;
}

export function createEdenLeadCapturePostHandler(
  dependencies: Partial<HandlerDependencies> = {},
) {
  const deliver = dependencies.deliver ?? deliverEdenLeadCapture;
  const consumeRateLimit =
    dependencies.consumeRateLimit ?? consumeEdenLeadCaptureRateLimit;
  const verifyBrowser = dependencies.verifyBrowser ?? (async () => {
    const result = await checkBotId();
    return !result.isBot;
  });
  const now = dependencies.now ?? Date.now;

  return async function POST(request: Request) {
    const currentTime = now();

    if (!(await verifyBrowser())) {
      return jsonResponse(
        { error: "We could not verify this request.", code: "bot_denied" },
        403,
      );
    }

    if (!isTrustedEdenOrigin(request)) {
      return jsonResponse(
        { error: "This capture origin is not allowed.", code: "origin_denied" },
        403,
      );
    }

    if (request.headers.get("content-type")?.split(";")[0] !== "application/json") {
      return jsonResponse(
        { error: "Send the inquiry as JSON.", code: "unsupported_media" },
        415,
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
        responseRateHeaders,
      );
    }

    const body = await readJsonBody(request);
    if (body.error === "too_large") {
      return jsonResponse(
        { error: "The inquiry is too large.", code: "body_too_large" },
        413,
        responseRateHeaders,
      );
    }
    if (body.error === "invalid_json") {
      return jsonResponse(
        { error: "The inquiry could not be read.", code: "invalid_json" },
        400,
        responseRateHeaders,
      );
    }

    const parsed = edenLeadCaptureSchema.safeParse(body.value);
    if (!parsed.success) {
      return jsonResponse(
        {
          error: "Please check your email and permission, then try again.",
          code: "invalid_capture",
        },
        422,
        responseRateHeaders,
      );
    }

    const capture = parsed.data;
    if (capture.website.trim()) {
      return jsonResponse(
        {
          success: true,
          applicationId: capture.applicationId,
          recorded: false,
        },
        202,
        responseRateHeaders,
      );
    }

    if (!isCaptureCurrent(capture, currentTime)) {
      return jsonResponse(
        {
          error: "This capture attempt has expired. Please refresh and try again.",
          code: "timing_rejected",
        },
        422,
        responseRateHeaders,
      );
    }

    try {
      const delivery = await deliver(capture);
      return jsonResponse(
        {
          success: true,
          applicationId: capture.applicationId,
          duplicate: delivery.outcome === "duplicate",
          recorded: true,
        },
        202,
        responseRateHeaders,
      );
    } catch (error) {
      const failure =
        error instanceof EdenLeadCaptureDeliveryError
          ? error.kind
          : "unexpected";
      const localConfigurationMissing =
        failure === "configuration" && process.env.NODE_ENV !== "production";

      console.error("[eden-lead-capture] crm_delivery_failed", {
        eventId: capture.eventId,
        failure,
      });

      if (localConfigurationMissing) {
        return jsonResponse(
          {
            success: true,
            applicationId: capture.applicationId,
            duplicate: false,
            recorded: false,
            preview: true,
          },
          202,
          responseRateHeaders,
        );
      }

      if (failure === "conflict") {
        return jsonResponse(
          {
            error:
              "We could not confirm this retry safely. Refresh to begin a new Blueprint.",
            code: "crm_conflict",
          },
          409,
          responseRateHeaders,
        );
      }

      return jsonResponse(
        {
          error:
            "We could not record your inquiry right now. Please try again before continuing.",
          code: "crm_unavailable",
        },
        503,
        responseRateHeaders,
      );
    }
  };
}
