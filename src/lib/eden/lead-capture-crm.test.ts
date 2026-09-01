import { createHmac } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import {
  createEdenLeadCaptureEvent,
  deliverEdenLeadCapture,
  EdenLeadCaptureDeliveryError,
} from "./lead-capture-crm";
import { createEdenLeadCaptureFixture } from "./test-fixture";

const endpoint = "https://crm.synthetic.example/functions/v1/eden-lead-capture-ingest";
const secret = "s".repeat(32);
const requestId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const now = Date.parse("2026-08-24T09:57:01.000Z");

function receipt(status = 201, overrides: Record<string, unknown> = {}) {
  return new Response(
    JSON.stringify({
      accepted: true,
      duplicate: status === 200,
      application_id: createEdenLeadCaptureFixture().applicationId,
      request_id: requestId,
      ...overrides,
    }),
    { status, headers: { "Content-Type": "application/json" } },
  );
}

describe("Eden lead-capture CRM sender", () => {
  it("maps the browser capture to the approved event without bot proof in the lead", () => {
    const capture = createEdenLeadCaptureFixture();
    const event = createEdenLeadCaptureEvent(capture, "test");

    expect(event).toMatchObject({
      event: "EdenLeadCaptured.v1",
      event_id: capture.eventId,
      occurred_at: capture.capturedAt,
      source: { form_version: "eden-lead-capture.v1" },
      lead: {
        application_id: capture.applicationId,
        email: capture.workEmail,
        consent: {
          purpose: "sales_follow_up",
          status: "granted",
          captured_at: capture.capturedAt,
        },
      },
      bot_protection: {
        provider: "aygency-server-controls",
        action: "eden_lead_capture",
        token: "verified-by-aygency-site",
      },
    });
    expect(event.lead).not.toHaveProperty("bot_protection");
  });

  it("signs the exact frozen body and supplies idempotency headers", async () => {
    const capture = createEdenLeadCaptureFixture();
    const fetchImpl = vi.fn(async (_input: string | URL | Request, init?: RequestInit) => {
      const body = String(init?.body);
      const headers = new Headers(init?.headers);
      const timestamp = headers.get("x-eden-timestamp") ?? "";
      const expected = `v1=${createHmac("sha256", secret)
        .update(`${timestamp}.${body}`, "utf8")
        .digest("hex")}`;

      expect(headers.get("x-eden-signature")).toBe(expected);
      expect(headers.get("idempotency-key")).toBe(capture.eventId);
      expect(headers.get("x-eden-event")).toBe("EdenLeadCaptured.v1");
      return receipt();
    });

    await expect(
      deliverEdenLeadCapture(capture, {
        endpointUrl: endpoint,
        signingSecret: secret,
        environment: "test",
        fetchImpl,
        now: () => now,
      }),
    ).resolves.toMatchObject({ outcome: "accepted", requestId });
    expect(fetchImpl).toHaveBeenCalledOnce();
  });

  it("retries a retryable response with the exact same body and signature", async () => {
    const requests: Array<{ body: BodyInit | null | undefined; signature: string | null }> = [];
    const fetchImpl = vi.fn(async (_input: string | URL | Request, init?: RequestInit) => {
      requests.push({
        body: init?.body,
        signature: new Headers(init?.headers).get("x-eden-signature"),
      });
      return requests.length === 1 ? new Response("{}", { status: 503 }) : receipt();
    });

    await deliverEdenLeadCapture(createEdenLeadCaptureFixture(), {
      endpointUrl: endpoint,
      signingSecret: secret,
      environment: "test",
      fetchImpl,
      sleep: async () => undefined,
      random: () => 0,
      now: () => now,
    });

    expect(requests).toHaveLength(2);
    expect(requests[1]).toEqual(requests[0]);
  });

  it("rejects conflicts, malformed receipts, and missing configuration", async () => {
    const capture = createEdenLeadCaptureFixture();
    await expect(
      deliverEdenLeadCapture(capture, {
        endpointUrl: endpoint,
        signingSecret: secret,
        fetchImpl: async () => new Response("{}", { status: 409 }),
        now: () => now,
      }),
    ).rejects.toMatchObject({ kind: "conflict" });

    await expect(
      deliverEdenLeadCapture(capture, {
        endpointUrl: endpoint,
        signingSecret: secret,
        fetchImpl: async () => receipt(201, { extra: true }),
        now: () => now,
      }),
    ).rejects.toMatchObject({ kind: "rejected" });

    await expect(
      deliverEdenLeadCapture(capture, {
        endpointUrl: endpoint,
        signingSecret: "short",
      }),
    ).rejects.toBeInstanceOf(EdenLeadCaptureDeliveryError);
  });
});
