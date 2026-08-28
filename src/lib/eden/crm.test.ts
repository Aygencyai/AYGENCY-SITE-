import { createHmac } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import validGoldenPayload from "../../../tests/fixtures/eden-application-submitted-v1/valid-new.json";
import {
  createEdenCrmEvent,
  deliverEdenApplication,
  EDEN_CRM_EVENT_TYPE,
} from "./crm";
import { createEdenApplicationFixture } from "./test-fixture";

const endpointUrl = "https://crm.example.test/functions/v1/eden-application-ingest";
const signingSecret = "sender-test-signing-secret-with-32-bytes-minimum";
const now = Date.parse("2026-08-24T10:01:00.000Z");
const requestId = "33333333-3333-4333-8333-333333333333";
type MockFetch = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

function receipt(status: 200 | 201, duplicate = status === 200) {
  return new Response(
    JSON.stringify({
      accepted: true,
      duplicate,
      application_id: "22222222-2222-4222-8222-222222222222",
      request_id: requestId,
    }),
    { status, headers: { "Content-Type": "application/json" } },
  );
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("Eden CRM delivery", () => {
  it("constructs the byte-shared EdenApplicationSubmitted.v1 golden", () => {
    const event = createEdenCrmEvent(createEdenApplicationFixture(), {
      occurredAt: "2026-08-24T10:01:00.000Z",
      environment: "test",
    });

    expect(event).toEqual(validGoldenPayload);
    expect(event.event).toBe(EDEN_CRM_EVENT_TYPE);
    expect(event).not.toHaveProperty("startedAt");
    expect(JSON.stringify(event)).not.toContain("website\":\"\"");
  });

  it("maps blank optional values to null and records marketing only when granted", () => {
    const application = createEdenApplicationFixture();
    application.contact.phone = "";
    application.contact.roleTitle = "";
    application.contact.linkedinUrl = "";
    application.organisation.website = "";
    application.organisation.companyNumber = "";
    application.consent.marketing = true;

    const event = createEdenCrmEvent(application);

    expect(event.application.contact).toMatchObject({
      phone: null,
      role_title: null,
      linkedin_url: null,
    });
    expect(event.application.organisation).toMatchObject({
      website: null,
      company_number: null,
    });
    expect(event.application.consents.at(-1)).toMatchObject({
      purpose: "marketing",
      status: "granted",
    });
  });

  it("signs exact bytes with server-only HMAC headers and validates acceptance", async () => {
    const fetchImpl = vi.fn<MockFetch>(async (input, init) => {
      void input;
      void init;
      return receipt(201);
    });
    const application = createEdenApplicationFixture();

    const result = await deliverEdenApplication(application, {
      endpointUrl,
      signingSecret,
      environment: "test",
      fetchImpl,
      now: () => now,
    });

    expect(result).toMatchObject({ outcome: "accepted", requestId });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, init] = fetchImpl.mock.calls[0];
    const headers = new Headers(init?.headers);
    const body = String(init?.body);
    const timestamp = String(Math.floor(now / 1_000));
    const expectedSignature = `v1=${createHmac("sha256", signingSecret)
      .update(`${timestamp}.${body}`, "utf8")
      .digest("hex")}`;

    expect(url).toBe(endpointUrl);
    expect(headers.get("authorization")).toBeNull();
    expect(headers.get("idempotency-key")).toBe(application.eventId);
    expect(headers.get("x-eden-event")).toBe(EDEN_CRM_EVENT_TYPE);
    expect(headers.get("x-eden-event-id")).toBe(application.eventId);
    expect(headers.get("x-eden-timestamp")).toBe(timestamp);
    expect(headers.get("x-eden-signature")).toBe(expectedSignature);
    expect(JSON.parse(body)).toEqual(result.event);
  });

  it("accepts only a typed 200 exact-retry receipt as duplicate", async () => {
    const result = await deliverEdenApplication(createEdenApplicationFixture(), {
      endpointUrl,
      signingSecret,
      fetchImpl: async () => receipt(200),
      now: () => now,
    });

    expect(result.outcome).toBe("duplicate");
  });

  it("does not misreport an idempotency conflict as a duplicate", async () => {
    await expect(
      deliverEdenApplication(createEdenApplicationFixture(), {
        endpointUrl,
        signingSecret,
        fetchImpl: async () =>
          new Response(
            JSON.stringify({
              accepted: false,
              error: "idempotency_conflict",
              request_id: requestId,
            }),
            { status: 409 },
          ),
        now: () => now,
      }),
    ).rejects.toMatchObject({ kind: "conflict", status: 409 });
  });

  it("retries only retryable failures with identical body, key, timestamp, and signature", async () => {
    const responses = [
      new Response(null, { status: 503 }),
      new Response(null, { status: 429, headers: { "Retry-After": "0" } }),
      receipt(201),
    ];
    const fetchImpl = vi.fn<MockFetch>(async (input, init) => {
      void input;
      void init;
      return responses.shift() as Response;
    });
    const sleep = vi.fn(async () => undefined);
    const application = createEdenApplicationFixture();

    await deliverEdenApplication(application, {
      endpointUrl,
      signingSecret,
      fetchImpl,
      sleep,
      random: () => 0,
      now: () => now,
    });

    expect(fetchImpl).toHaveBeenCalledTimes(3);
    expect(sleep).toHaveBeenCalledTimes(2);
    for (const field of [
      "body",
      "idempotency-key",
      "x-eden-timestamp",
      "x-eden-signature",
    ]) {
      const values = fetchImpl.mock.calls.map((call) =>
        field === "body"
          ? call[1]?.body
          : new Headers(call[1]?.headers).get(field),
      );
      expect(new Set(values).size).toBe(1);
    }
  });

  it("rejects malformed success receipts and terminal contract failures", async () => {
    await expect(
      deliverEdenApplication(createEdenApplicationFixture(), {
        endpointUrl,
        signingSecret,
        fetchImpl: async () =>
          new Response(JSON.stringify({ accepted: true }), { status: 201 }),
        now: () => now,
      }),
    ).rejects.toMatchObject({ kind: "rejected", status: 201 });

    const fetchImpl = vi.fn(async () => new Response(null, { status: 400 }));
    await expect(
      deliverEdenApplication(createEdenApplicationFixture(), {
        endpointUrl,
        signingSecret,
        fetchImpl,
        now: () => now,
      }),
    ).rejects.toMatchObject({ kind: "rejected", status: 400 });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("fails closed for insecure remote endpoints or missing/short secrets", async () => {
    await expect(
      deliverEdenApplication(createEdenApplicationFixture(), {
        endpointUrl: "http://crm.example.test/events/eden",
        signingSecret,
      }),
    ).rejects.toMatchObject({ kind: "configuration" });

    await expect(
      deliverEdenApplication(createEdenApplicationFixture(), {
        endpointUrl,
        signingSecret: "short",
      }),
    ).rejects.toMatchObject({ kind: "configuration" });
  });

  it("allows an HTTP loopback endpoint only outside production", async () => {
    vi.stubEnv("NODE_ENV", "development");
    await expect(
      deliverEdenApplication(createEdenApplicationFixture(), {
        endpointUrl: "http://127.0.0.1:54321/functions/v1/eden-application-ingest",
        signingSecret,
        fetchImpl: async () => receipt(201),
        now: () => now,
      }),
    ).resolves.toMatchObject({ outcome: "accepted" });

    vi.stubEnv("NODE_ENV", "production");
    await expect(
      deliverEdenApplication(createEdenApplicationFixture(), {
        endpointUrl: "http://127.0.0.1:54321/functions/v1/eden-application-ingest",
        signingSecret,
      }),
    ).rejects.toMatchObject({ kind: "configuration" });
  });
});
