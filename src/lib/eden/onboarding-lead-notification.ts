import { createHash } from "node:crypto";
import { Resend } from "resend";

interface EmailSender {
  emails: {
    send: (
      payload: { from: string; to: string; replyTo: string; subject: string; text: string },
      options: { idempotencyKey: string }
    ) => Promise<{ data: unknown; error: unknown }>;
  };
}

interface NotificationDependencies {
  apiKey?: string;
  recipient?: string;
  sender?: string;
  client?: EmailSender;
}

export interface OnboardingLead {
  email: string;
  revision: number;
  summary: string;
}

export type NotificationOutcome = "sent" | "skipped";

function singleLine(value: string) {
  return value.replace(/[\r\n\t]+/g, " ").trim();
}

export async function sendEdenOnboardingLeadNotification(
  lead: OnboardingLead,
  dependencies: NotificationDependencies = {}
): Promise<NotificationOutcome> {
  const apiKey = dependencies.apiKey ?? process.env.RESEND_API_KEY;
  const recipient =
    dependencies.recipient ??
    process.env.EDEN_NOTIFICATION_EMAIL ??
    process.env.CONTACT_EMAIL;

  if (!apiKey || !recipient) return "skipped";

  const client = dependencies.client ?? new Resend(apiKey);
  const sender =
    dependencies.sender ??
    process.env.EDEN_NOTIFICATION_FROM ??
    "Aygency Eden <onboarding@resend.dev>";
  // Keyed on the confirmed revision so a repeat confirmation of the same setup
  // cannot alert twice, while a customer who changes and re-confirms does reach
  // the founders again. The address is hashed rather than carried to the provider
  // as part of the key.
  const identity = createHash("sha256").update(lead.email.toLowerCase()).digest("hex").slice(0, 32);
  const { error } = await client.emails.send(
    {
      from: sender,
      to: recipient,
      replyTo: lead.email,
      subject: "Eden onboarding completed",
      text: [
        "Someone finished their Eden onboarding on the website and is waiting to hear from you.",
        "",
        `Customer: ${lead.email}`,
        `Confirmed setup version: ${lead.revision}`,
        "",
        "What they asked Eden to take on:",
        singleLine(lead.summary),
        "",
        "Open the agency dashboard to read the full conversation and press Create Eden",
        "once you have spoken to them.",
      ].join("\n"),
    },
    { idempotencyKey: `eden-onboarding-${identity}-${lead.revision}` }
  );

  if (error) throw new Error("Eden onboarding lead notification failed.");
  return "sent";
}
