import { describe, expect, it, vi } from "vitest";
import {
  createEdenCrmEvent,
  deliverEdenApplication,
  EDEN_CRM_EVENT_TYPE,
} from "./crm";
import { createEdenApplicationFixture } from "./test-fixture";

const endpointUrl = "https://crm.example.test/events/eden";
const apiToken = "write-only-test-token";

describe("Eden CRM delivery", () => {
  it("maps the immutable application to EdenApplicationSubmitted.v1", () => {
    const application = createEdenApplicationFixture();

    const event = createEdenCrmEvent(application);

    expect(event).toMatchObject({
      eventType: EDEN_CRM_EVENT_TYPE,
      eventId: application.submissionId,
      occurredAt: application.submittedAt,
      source: "aygency.ai/design-your-eden",
    });
    expect(event.data.answers).toEqual(application.answers);
    expect(event.data.contact).toEqual(application.contact);
    expect(event.data.consent.inquiry).toEqual({
      granted: true,
      noticeVersion: "eden-inquiry-v1",
    });
    expect(event.data.consent.marketing.granted).toBe(false);
  });

  it("sends the event and privileged credential only from the adapter", async () => {
    const application = createEdenApplicationFixture();
    const fetchImpl = vi.fn(
      async (input: string | URL | Request, init?: RequestInit) => {
        void input;
        void init;
        return new Response(null, { status: 202 });
      }
    );

    const result = await deliverEdenApplication(application, {
      endpointUrl,
      apiToken,
      fetchImpl,
    });

    expect(result.outcome).toBe("accepted");
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, init] = fetchImpl.mock.calls[0];
    const headers = new Headers(init?.headers);
    expect(url).toBe(endpointUrl);
    expect(headers.get("authorization")).toBe(`Bearer ${apiToken}`);
    expect(headers.get("idempotency-key")).toBe(application.submissionId);
    expect(headers.get("x-aygency-event-type")).toBe(EDEN_CRM_EVENT_TYPE);
    expect(JSON.parse(String(init?.body))).toEqual(
      createEdenCrmEvent(application)
    );
  });

  it("treats the approved endpoint's 409 as an idempotent replay", async () => {
    const fetchImpl = vi.fn(
      async (input: string | URL | Request, init?: RequestInit) => {
        void input;
        void init;
        return new Response(null, { status: 409 });
      }
    );

    const result = await deliverEdenApplication(createEdenApplicationFixture(), {
      endpointUrl,
      apiToken,
      fetchImpl,
    });

    expect(result.outcome).toBe("duplicate");
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("retries only retryable failures with an identical body and key", async () => {
    const responses = [
      new Response(null, { status: 503 }),
      new Response(null, {
        status: 429,
        headers: { "Retry-After": "0" },
      }),
      new Response(null, { status: 202 }),
    ];
    const fetchImpl = vi.fn(
      async (input: string | URL | Request, init?: RequestInit) => {
        void input;
        void init;
        return responses.shift() as Response;
      }
    );
    const sleep = vi.fn(async () => undefined);
    const application = createEdenApplicationFixture();

    const result = await deliverEdenApplication(application, {
      endpointUrl,
      apiToken,
      fetchImpl,
      sleep,
      random: () => 0,
    });

    expect(result.outcome).toBe("accepted");
    expect(fetchImpl).toHaveBeenCalledTimes(3);
    expect(sleep).toHaveBeenCalledTimes(2);

    const bodies = fetchImpl.mock.calls.map((call) => call[1]?.body);
    const keys = fetchImpl.mock.calls.map((call) =>
      new Headers(call[1]?.headers).get("idempotency-key")
    );
    expect(new Set(bodies).size).toBe(1);
    expect(new Set(keys)).toEqual(new Set([application.submissionId]));
  });

  it("does not retry a terminal CRM contract rejection", async () => {
    const fetchImpl = vi.fn(
      async (input: string | URL | Request, init?: RequestInit) => {
        void input;
        void init;
        return new Response(null, { status: 400 });
      }
    );

    await expect(
      deliverEdenApplication(createEdenApplicationFixture(), {
        endpointUrl,
        apiToken,
        fetchImpl,
      })
    ).rejects.toMatchObject({ kind: "rejected", status: 400 });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("fails closed for insecure endpoints or missing credentials", async () => {
    await expect(
      deliverEdenApplication(createEdenApplicationFixture(), {
        endpointUrl: "http://crm.example.test/events/eden",
        apiToken,
      })
    ).rejects.toMatchObject({ kind: "configuration" });

    await expect(
      deliverEdenApplication(createEdenApplicationFixture(), {
        endpointUrl,
        apiToken: "",
      })
    ).rejects.toMatchObject({ kind: "configuration" });
  });
});
