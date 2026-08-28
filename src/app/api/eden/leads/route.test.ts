import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createEdenLeadCaptureEvent,
  EdenLeadCaptureDeliveryError,
} from "@/lib/eden/lead-capture-crm";
import { createEdenLeadCapturePostHandler } from "@/lib/eden/lead-capture-handler";
import { createEdenLeadCaptureFixture } from "@/lib/eden/test-fixture";

const now = Date.parse("2026-08-24T09:57:01.000Z");
const requestId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const allowedRate = {
  allowed: true,
  limit: 8,
  remaining: 7,
  resetAt: now + 60_000,
};

function createRequest(body: unknown, headers: Record<string, string> = {}) {
  return new Request("https://aygency.ai/api/eden/leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://aygency.ai",
      "Sec-Fetch-Site": "same-origin",
      ...headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function createHandler(
  overrides: Parameters<typeof createEdenLeadCapturePostHandler>[0] = {},
) {
  return createEdenLeadCapturePostHandler({
    now: () => now,
    consumeRateLimit: () => allowedRate,
    deliver: async (capture) => ({
      outcome: "accepted",
      event: createEdenLeadCaptureEvent(capture, "test"),
      requestId,
    }),
    ...overrides,
  });
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe("POST /api/eden/leads", () => {
  it("records a validated inquiry before the diagnostic", async () => {
    const capture = createEdenLeadCaptureFixture();
    const deliver = vi.fn(async (value) => ({
      outcome: "accepted" as const,
      event: createEdenLeadCaptureEvent(value, "test"),
      requestId,
    }));
    const response = await createHandler({ deliver })(createRequest(capture));

    expect(response.status).toBe(202);
    expect(await response.json()).toEqual({
      success: true,
      applicationId: capture.applicationId,
      duplicate: false,
      recorded: true,
    });
    expect(deliver).toHaveBeenCalledWith(capture);
  });

  it("continues honestly in an unconfigured local preview", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const response = await createHandler({
      deliver: async () => {
        throw new EdenLeadCaptureDeliveryError("configuration");
      },
    })(createRequest(createEdenLeadCaptureFixture()));

    expect(response.status).toBe(202);
    expect(await response.json()).toMatchObject({
      success: true,
      recorded: false,
      preview: true,
    });
  });

  it("never weakens missing CRM configuration in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const response = await createHandler({
      deliver: async () => {
        throw new EdenLeadCaptureDeliveryError("configuration");
      },
    })(createRequest(createEdenLeadCaptureFixture()));

    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ code: "crm_unavailable" });
  });

  it("rejects cross-origin, stale, and invalid captures", async () => {
    const deliver = vi.fn();
    const crossOrigin = await createHandler({ deliver })(
      createRequest(createEdenLeadCaptureFixture(), {
        Origin: "https://attacker.example",
        "Sec-Fetch-Site": "cross-site",
      }),
    );
    expect(crossOrigin.status).toBe(403);

    const stale = createEdenLeadCaptureFixture();
    stale.capturedAt = "2026-08-24T09:40:00.000Z";
    const staleResponse = await createHandler({ deliver })(createRequest(stale));
    expect(staleResponse.status).toBe(422);
    expect(await staleResponse.json()).toMatchObject({ code: "timing_rejected" });

    const invalid = createEdenLeadCaptureFixture() as unknown as Record<string, unknown>;
    invalid.inquiryConsent = false;
    const invalidResponse = await createHandler({ deliver })(createRequest(invalid));
    expect(invalidResponse.status).toBe(422);
    expect(await invalidResponse.json()).toMatchObject({ code: "invalid_capture" });
    expect(deliver).not.toHaveBeenCalled();
  });

  it("neutralizes the honeypot and rate-limits before CRM delivery", async () => {
    const deliver = vi.fn();
    const bot = createEdenLeadCaptureFixture();
    bot.website = "filled-by-bot";
    const botResponse = await createHandler({ deliver })(createRequest(bot));
    expect(botResponse.status).toBe(202);
    expect(await botResponse.json()).toMatchObject({ recorded: false });

    const limitedResponse = await createHandler({
      deliver,
      consumeRateLimit: () => ({
        allowed: false,
        limit: 8,
        remaining: 0,
        resetAt: now + 30_000,
      }),
    })(createRequest(createEdenLeadCaptureFixture()));
    expect(limitedResponse.status).toBe(429);
    expect(limitedResponse.headers.get("retry-after")).toBe("30");
    expect(deliver).not.toHaveBeenCalled();
  });
});
