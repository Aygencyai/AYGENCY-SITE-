import { Resend } from "resend";
import type { EdenApplication } from "./application-schema";
import { budgetReadinessLabels, primaryOutcomeLabels } from "./questionnaire";

interface EmailSender {
  emails: {
    send: (
      payload: {
        from: string;
        to: string;
        replyTo: string;
        subject: string;
        text: string;
      },
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

export type NotificationOutcome = "sent" | "skipped";

function singleLine(value: string) {
  return value.replace(/[\r\n\t]+/g, " ").trim();
}

export async function sendEdenApplicationNotification(
  application: EdenApplication,
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
  const { error } = await client.emails.send(
    {
      from: sender,
      to: recipient,
      replyTo: application.contact.workEmail,
      subject: "New Eden application",
      text: [
        "An Eden application is now recorded in the CRM.",
        "",
        `Reference: ${application.applicationId}`,
        `Applicant: ${singleLine(application.contact.fullName)}`,
        `Company: ${singleLine(application.organisation.name)}`,
        `Primary outcomes: ${application.answers.primaryOutcomes
          .map((outcome) => primaryOutcomeLabels[outcome])
          .join(", ")}`,
        `Budget readiness: ${budgetReadinessLabels[application.answers.budgetReadiness]}`,
        `Marketing consent: ${application.consent.marketing ? "granted" : "not granted"}`,
        "",
        "Open the CRM record for the complete, authoritative application.",
      ].join("\n"),
    },
    { idempotencyKey: `eden-application-${application.eventId}` }
  );

  if (error) throw new Error("Eden application notification failed.");
  return "sent";
}
