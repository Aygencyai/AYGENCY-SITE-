import { afterEach, describe, expect, it, vi } from "vitest";
import { EdenCrmDeliveryError, createEdenCrmEvent } from "@/lib/eden/crm";
import { createEdenApplicationFixture } from "@/lib/eden/test-fixture";
import {
  createEdenApplicationsPostHandler,
  isTrustedEdenOrigin,
} from "@/lib/eden/application-handler";

const now = Date.parse("2026-08-24T10:02:01.000Z");
const requestId = "33333333-3333-4333-8333-333333333333";
const allowedRate = {
  allowed: true,
  limit: 5,
  remaining: 4,
  resetAt: now + 60_000,
};

function createRequest(body: unknown, headers: Record<string, string> = {}) {
  return new Request("https://aygency.ai/api/eden/applications", {
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
  overrides: Parameters<typeof createEdenApplicationsPostHandler>[0] = {},
) {
  return createEdenApplicationsPostHandler({
    now: () => now,
    verifyBrowser: async () => true,
    consumeRateLimit: () => allowedRate,
    deliver: async (value) => ({
      outcome: "accepted",
      event: createEdenCrmEvent(value),
      requestId,
    }),
    notify: async () => undefined,
    ...overrides,
  });
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe("POST /api/eden/applications", () => {
  it("accepts a validated application, then notifies after CRM delivery", async () => {
    const application = createEdenApplicationFixture();
    const order: string[] = [];
    const deliver = vi.fn(async (value) => {
      order.push("crm");
      return {
        outcome: "accepted" as const,
        event: createEdenCrmEvent(value),
        requestId,
      };
    });
    const notify = vi.fn(async () => {
      order.push("notification");
    });
    const response = await createHandler({ deliver, notify })(
      createRequest(application),
    );

    expect(response.status).toBe(202);
    expect(await response.json()).toEqual({
      success: true,
      applicationId: application.applicationId,
      duplicate: false,
      recorded: true,
    });
    expect(deliver).toHaveBeenCalledWith(application);
    expect(notify).toHaveBeenCalledWith(application);
    expect(order).toEqual(["crm", "notification"]);
  });

  it("blocks a classified bot before parsing or delivery", async () => {
    const deliver = vi.fn();
    const response = await createHandler({
      deliver,
      verifyBrowser: async () => false,
    })(createRequest(createEdenApplicationFixture()));

    expect(response.status).toBe(403);
    expect(await response.json()).toMatchObject({ code: "bot_denied" });
    expect(deliver).not.toHaveBeenCalled();
  });

  it("suppresses notification for a validated exact-retry receipt", async () => {
    const application = createEdenApplicationFixture();
    const notify = vi.fn(async () => undefined);
    const response = await createHandler({
      deliver: async (value) => ({
        outcome: "duplicate",
        event: createEdenCrmEvent(value),
        requestId,
      }),
      notify,
    })(createRequest(application));

    expect(response.status).toBe(202);
    expect(notify).not.toHaveBeenCalled();
    expect(await response.json()).toMatchObject({ duplicate: true });
  });

  it("keeps CRM success when the best-effort notification fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const application = createEdenApplicationFixture();
    const response = await createHandler({
      notify: async () => {
        throw new Error("notification unavailable");
      },
    })(createRequest(application));

    expect(response.status).toBe(202);
    expect(console.error).toHaveBeenCalledWith(
      "[eden-applications] notification_failed",
      { eventId: application.eventId },
    );
  });

  it("fails honestly when the CRM does not record the application", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const notify = vi.fn(async () => undefined);
    const response = await createHandler({
      deliver: async () => {
        throw new EdenCrmDeliveryError("unavailable", 503);
      },
      notify,
    })(createRequest(createEdenApplicationFixture()));

    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ code: "crm_unavailable" });
    expect(notify).not.toHaveBeenCalled();
  });

  it("does not call a changed-body conflict a duplicate success", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const response = await createHandler({
      deliver: async () => {
        throw new EdenCrmDeliveryError("conflict", 409);
      },
    })(createRequest(createEdenApplicationFixture()));

    expect(response.status).toBe(409);
    expect(await response.json()).toMatchObject({ code: "crm_conflict" });
  });

  it("continues honestly when local CRM configuration is unavailable", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const response = await createHandler({
      deliver: async () => {
        throw new EdenCrmDeliveryError("configuration");
      },
    })(createRequest(createEdenApplicationFixture()));

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
        throw new EdenCrmDeliveryError("configuration");
      },
    })(createRequest(createEdenApplicationFixture()));

    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ code: "crm_unavailable" });
  });

  it("rejects cross-origin requests before processing a body", async () => {
    const deliver = vi.fn();
    const response = await createHandler({ deliver })(
      createRequest(createEdenApplicationFixture(), {
        Origin: "https://attacker.example",
        "Sec-Fetch-Site": "cross-site",
      }),
    );

    expect(response.status).toBe(403);
    expect(deliver).not.toHaveBeenCalled();
  });

  it("accepts an HTTP localhost browser origin only outside production", () => {
    vi.stubEnv("NODE_ENV", "development");
    const request = new Request("http://0.0.0.0:3000/api/eden/applications", {
      method: "POST",
      headers: {
        Origin: "http://localhost:3000",
        "Sec-Fetch-Site": "same-origin",
      },
    });
    expect(isTrustedEdenOrigin(request)).toBe(true);

    vi.stubEnv("NODE_ENV", "production");
    expect(isTrustedEdenOrigin(request)).toBe(false);
  });

  it("rejects an oversized body before JSON parsing", async () => {
    const response = await createHandler()(
      createRequest("{}", { "Content-Length": String(48 * 1_024 + 1) }),
    );
    expect(response.status).toBe(413);
  });

  it("neutralizes a honeypot submission without calling the CRM", async () => {
    const application = createEdenApplicationFixture();
    application.website = "spam-value";
    const deliver = vi.fn();
    const response = await createHandler({ deliver })(createRequest(application));

    expect(response.status).toBe(202);
    expect(await response.json()).toMatchObject({ success: true });
    expect(deliver).not.toHaveBeenCalled();
  });

  it("rejects implausibly fast or expired completion", async () => {
    const tooFast = createEdenApplicationFixture();
    tooFast.submittedAt = "2026-08-24T10:02:00.000Z";
    tooFast.startedAt = "2026-08-24T10:01:59.000Z";
    const expired = createEdenApplicationFixture();
    expired.submittedAt = "2026-08-24T09:56:59.000Z";
    expired.startedAt = "2026-08-24T09:54:00.000Z";
    const deliver = vi.fn();

    for (const application of [tooFast, expired]) {
      const response = await createHandler({ deliver })(createRequest(application));
      expect(response.status).toBe(422);
      expect(await response.json()).toMatchObject({ code: "timing_rejected" });
    }
    expect(deliver).not.toHaveBeenCalled();
  });

  it("returns Retry-After when the same-origin defense rate limit is exhausted", async () => {
    const deliver = vi.fn();
    const response = await createHandler({
      consumeRateLimit: () => ({
        allowed: false,
        limit: 5,
        remaining: 0,
        resetAt: now + 30_000,
      }),
      deliver,
    })(createRequest(createEdenApplicationFixture()));

    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("30");
    expect(deliver).not.toHaveBeenCalled();
  });
});
