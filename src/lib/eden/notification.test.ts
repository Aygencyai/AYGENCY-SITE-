import { describe, expect, it, vi } from "vitest";
import { sendEdenApplicationNotification } from "./notification";
import { createEdenApplicationFixture } from "./test-fixture";

describe("Eden application notification", () => {
  it("uses Resend as an idempotent summary notification, not the record", async () => {
    const application = createEdenApplicationFixture();
    const send = vi.fn(
      async (
        payload: {
          from: string;
          to: string;
          replyTo: string;
          subject: string;
          text: string;
        },
        options: { idempotencyKey: string }
      ) => {
        void payload;
        void options;
        return { data: { id: "email-id" }, error: null };
      }
    );

    const result = await sendEdenApplicationNotification(application, {
      apiKey: "resend-test-key",
      recipient: "build@example.com",
      sender: "Aygency <updates@example.com>",
      client: { emails: { send } },
    });

    expect(result).toBe("sent");
    const [payload, options] = send.mock.calls[0];
    expect(options.idempotencyKey).toBe(
      `eden-application-${application.submissionId}`
    );
    expect(payload.text).toContain("authoritative application");
    expect(payload.text).toContain(
      "Decision priority: Getting the strongest fit and result"
    );
    expect(payload.text).not.toContain(application.answers.currentChallenge);
    expect(payload.text).not.toContain(application.answers.desiredOutcome);
  });

  it("skips cleanly when notification configuration is absent", async () => {
    const result = await sendEdenApplicationNotification(
      createEdenApplicationFixture(),
      { apiKey: "", recipient: "" }
    );

    expect(result).toBe("skipped");
  });
});
