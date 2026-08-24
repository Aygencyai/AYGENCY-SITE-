import { afterEach, describe, expect, it, vi } from "vitest";
import { EdenCrmDeliveryError, createEdenCrmEvent } from "@/lib/eden/crm";
import { createEdenApplicationFixture } from "@/lib/eden/test-fixture";
import { createEdenApplicationsPostHandler } from "@/lib/eden/application-handler";

const now = Date.parse("2026-08-24T10:02:01.000Z");
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

function createHandler(overrides: Parameters<typeof createEdenApplicationsPostHandler>[0] = {}) {
  return createEdenApplicationsPostHandler({
    now: () => now,
    consumeRateLimit: () => allowedRate,
    deliver: async (value) => ({
      outcome: "accepted",
      event: createEdenCrmEvent(value),
    }),
    notify: async () => undefined,
    ...overrides,
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("POST /api/eden/applications", () => {
  it("accepts a validated application, then notifies after CRM delivery", async () => {
    const application = createEdenApplicationFixture();
    const order: string[] = [];
    const deliver = vi.fn(async (value) => {
      order.push("crm");
      return { outcome: "accepted" as const, event: createEdenCrmEvent(value) };
    });
    const notify = vi.fn(async () => {
      order.push("notification");
    });
    const response = await createHandler({ deliver, notify })(
      createRequest(application)
    );

    expect(response.status).toBe(202);
    expect(await response.json()).toEqual({
      success: true,
      submissionId: application.submissionId,
      duplicate: false,
    });
    expect(deliver).toHaveBeenCalledWith(application);
    expect(notify).toHaveBeenCalledWith(application);
    expect(order).toEqual(["crm", "notification"]);
  });

  it("suppresses notification for a duplicate CRM receipt", async () => {
    const application = createEdenApplicationFixture();
    const notify = vi.fn(async () => undefined);
    const response = await createHandler({
      deliver: async (value) => ({
        outcome: "duplicate",
        event: createEdenCrmEvent(value),
      }),
      notify,
    })(createRequest(application));

    expect(response.status).toBe(202);
    expect(notify).not.toHaveBeenCalled();
    expect(await response.json()).toMatchObject({ duplicate: true });
  });

  it("keeps CRM success when the notification fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const response = await createHandler({
      notify: async () => {
        throw new Error("notification unavailable");
      },
    })(createRequest(createEdenApplicationFixture()));

    expect(response.status).toBe(202);
    expect(console.error).toHaveBeenCalledWith(
      "[eden-applications] notification_failed",
      expect.objectContaining({ submissionId: expect.any(String) })
    );
  });

  it("fails the submission when the CRM does not record it", async () => {
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

  it("rejects cross-origin requests before processing a body", async () => {
    const deliver = vi.fn();
    const response = await createHandler({ deliver })(
      createRequest(createEdenApplicationFixture(), {
        Origin: "https://attacker.example",
        "Sec-Fetch-Site": "cross-site",
      })
    );

    expect(response.status).toBe(403);
    expect(deliver).not.toHaveBeenCalled();
  });

  it("rejects an oversized body before JSON parsing", async () => {
    const response = await createHandler()(
      createRequest("{}", { "Content-Length": String(48 * 1_024 + 1) })
    );

    expect(response.status).toBe(413);
  });

  it("neutralizes a honeypot submission without calling the CRM", async () => {
    const application = createEdenApplicationFixture();
    application.website = "https://spam.example";
    const deliver = vi.fn();
    const response = await createHandler({ deliver })(createRequest(application));

    expect(response.status).toBe(202);
    expect(await response.json()).toMatchObject({ success: true });
    expect(deliver).not.toHaveBeenCalled();
  });

  it("rejects implausibly fast completion", async () => {
    const application = createEdenApplicationFixture();
    application.startedAt = "2026-08-24T10:01:59.000Z";
    const deliver = vi.fn();
    const response = await createHandler({ deliver })(createRequest(application));

    expect(response.status).toBe(422);
    expect(await response.json()).toMatchObject({ code: "timing_rejected" });
    expect(deliver).not.toHaveBeenCalled();
  });

  it("returns Retry-After when the application rate limit is exhausted", async () => {
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
