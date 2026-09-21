import { describe, expect, it, vi } from "vitest";
import { sendEdenOnboardingLeadNotification } from "./onboarding-lead-notification";

const lead = {
  email: "nadia@studio.example",
  revision: 7,
  summary: "Eden will chase supplier lead times and draft client proposals.",
};

type SendPayload = { from: string; to: string; replyTo: string; subject: string; text: string };
type SendOptions = { idempotencyKey: string };

function sender(error: unknown = null) {
  return {
    emails: {
      send: vi.fn<(payload: SendPayload, options: SendOptions) => Promise<{ data: unknown; error: unknown }>>(
        async () => ({ data: {}, error })
      ),
    },
  };
}

describe("onboarding lead notification", () => {
  it("tells the founders who is waiting and what they asked for", async () => {
    const client = sender();
    const outcome = await sendEdenOnboardingLeadNotification(lead, {
      apiKey: "test-key", recipient: "founders@aygency.ai", client,
    });
    expect(outcome).toBe("sent");
    const [payload] = client.emails.send.mock.calls[0];
    expect(payload.to).toBe("founders@aygency.ai");
    expect(payload.replyTo).toBe("nadia@studio.example");
    expect(payload.text).toContain("nadia@studio.example");
    expect(payload.text).toContain("chase supplier lead times");
  });

  it("cannot alert twice for the same confirmed revision", async () => {
    const client = sender();
    await sendEdenOnboardingLeadNotification(lead, {
      apiKey: "test-key", recipient: "founders@aygency.ai", client,
    });
    const [, options] = client.emails.send.mock.calls[0];
    const first = options.idempotencyKey;

    const again = sender();
    await sendEdenOnboardingLeadNotification(lead, {
      apiKey: "test-key", recipient: "founders@aygency.ai", client: again,
    });
    expect(again.emails.send.mock.calls[0][1].idempotencyKey).toBe(first);
  });

  it("alerts again when the customer confirms a changed setup", async () => {
    const client = sender();
    await sendEdenOnboardingLeadNotification(lead, {
      apiKey: "test-key", recipient: "founders@aygency.ai", client,
    });
    const changed = sender();
    await sendEdenOnboardingLeadNotification({ ...lead, revision: 9 }, {
      apiKey: "test-key", recipient: "founders@aygency.ai", client: changed,
    });
    expect(changed.emails.send.mock.calls[0][1].idempotencyKey)
      .not.toBe(client.emails.send.mock.calls[0][1].idempotencyKey);
  });

  it("keeps the customer's address out of the idempotency key", async () => {
    const client = sender();
    await sendEdenOnboardingLeadNotification(lead, {
      apiKey: "test-key", recipient: "founders@aygency.ai", client,
    });
    expect(client.emails.send.mock.calls[0][1].idempotencyKey).not.toContain("nadia");
  });

  it("skips quietly when notification is not configured", async () => {
    const client = sender();
    const outcome = await sendEdenOnboardingLeadNotification(lead, { client });
    expect(outcome).toBe("skipped");
    expect(client.emails.send).not.toHaveBeenCalled();
  });
});
