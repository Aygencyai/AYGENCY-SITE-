import { randomUUID } from "node:crypto";

import { describe, expect, it } from "vitest";

import {
  deliverEdenApplication,
  EdenCrmDeliveryError,
} from "./crm";
import { createEdenApplicationFixture } from "./test-fixture";

const integrationEnabled = process.env.EDEN_LOCAL_INTEGRATION === "true";
const endpointUrl = process.env.EDEN_LOCAL_INGEST_URL;
const signingSecret = process.env.EDEN_LOCAL_SIGNING_SECRET;
const disabledExpected = process.env.EDEN_LOCAL_EXPECT_DISABLED === "true";

describe.skipIf(!integrationEnabled)("Eden disposable sender-to-ingress chain", () => {
  it("proves new, exact retry, collision, bot failure, and signature failure", async () => {
    if (!endpointUrl || !signingSecret) {
      throw new Error("Disposable integration environment is incomplete");
    }

    const frozenNow = Date.now();
    const application = createEdenApplicationFixture();
    application.eventId = randomUUID();
    application.applicationId = randomUUID();
    application.startedAt = new Date(frozenNow - 60_000).toISOString();
    application.submittedAt = new Date(frozenNow - 1_000).toISOString();

    const dependencies = {
      endpointUrl,
      signingSecret,
      environment: "test" as const,
      now: () => frozenNow,
    };

    if (disabledExpected) {
      await expect(deliverEdenApplication(application, dependencies)).rejects.toMatchObject({
        kind: "unavailable",
        status: 503,
      } satisfies Partial<EdenCrmDeliveryError>);
      return;
    }

    await expect(deliverEdenApplication(application, dependencies)).resolves.toMatchObject({
      outcome: "accepted",
      event: {
        event_id: application.eventId,
        application: { application_id: application.applicationId },
      },
    });
    await expect(deliverEdenApplication(application, dependencies)).resolves.toMatchObject({
      outcome: "duplicate",
    });

    const collision = structuredClone(application);
    collision.answers.currentFriction =
      "A deliberately changed synthetic answer must not reuse this event identifier.";
    await expect(deliverEdenApplication(collision, dependencies)).rejects.toMatchObject({
      kind: "conflict",
      status: 409,
    } satisfies Partial<EdenCrmDeliveryError>);

    const botFailure = structuredClone(application);
    botFailure.eventId = randomUUID();
    botFailure.applicationId = randomUUID();
    botFailure.botToken = "force-bot-failure";
    await expect(deliverEdenApplication(botFailure, dependencies)).rejects.toMatchObject({
      kind: "rejected",
      status: 400,
    } satisfies Partial<EdenCrmDeliveryError>);

    const signatureFailure = structuredClone(application);
    signatureFailure.eventId = randomUUID();
    signatureFailure.applicationId = randomUUID();
    await expect(
      deliverEdenApplication(signatureFailure, {
        ...dependencies,
        signingSecret:
          process.env.EDEN_LOCAL_RETIRED_SIGNING_SECRET ??
          "incorrect-local-signing-secret-0000001",
      }),
    ).rejects.toMatchObject({
      kind: "rejected",
      status: 401,
    } satisfies Partial<EdenCrmDeliveryError>);

    const racingApplication = createEdenApplicationFixture();
    racingApplication.eventId = randomUUID();
    racingApplication.applicationId = randomUUID();
    racingApplication.startedAt = application.startedAt;
    racingApplication.submittedAt = application.submittedAt;
    const competingBody = structuredClone(racingApplication);
    competingBody.answers.currentFriction =
      "A concurrent changed body must lose the event identity race atomically.";

    const race = await Promise.allSettled([
      deliverEdenApplication(racingApplication, dependencies),
      deliverEdenApplication(competingBody, dependencies),
    ]);
    const fulfilled = race.filter(
      (result): result is PromiseFulfilledResult<Awaited<ReturnType<typeof deliverEdenApplication>>> =>
        result.status === "fulfilled",
    );
    const rejected = race.filter(
      (result): result is PromiseRejectedResult => result.status === "rejected",
    );

    expect(fulfilled).toHaveLength(1);
    expect(fulfilled[0]?.value.outcome).toBe("accepted");
    expect(rejected).toHaveLength(1);
    expect(rejected[0]?.reason).toMatchObject({ kind: "conflict", status: 409 });
  });
});
