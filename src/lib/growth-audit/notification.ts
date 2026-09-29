import { Resend } from "resend";
import { growthLever, leverCopy, weeklyHoursRange } from "./estimate";
import {
  areaAgent,
  areaOptions,
  blockerOptions,
  directionOptions,
  doerOptions,
  doubledOptions,
  enquiryVolumeOptions,
  hoursOptions,
  peopleOptions,
  replySpeedOptions,
  roleOptions,
  systemOptions,
  teamSizeOptions,
  type AuditAnswers,
  type AuditContact,
  type AuditOption,
} from "./questions";

function label<T extends string>(options: ReadonlyArray<AuditOption<T>>, value: T) {
  return options.find((option) => option.value === value)?.label ?? value;
}

function singleLine(value: string) {
  return value.replace(/[\r\n\t]+/g, " ").trim();
}

export function formatAuditSummary(answers: AuditAnswers, contact: AuditContact, auditId: string) {
  const range = weeklyHoursRange(answers);
  const lever = leverCopy[growthLever(answers)].headline;

  const areaLines = answers.areas.map((area) => {
    const detail = answers.areaDetails[area];
    const what = `${label(areaOptions, area)} [${areaAgent[area]}]`;
    if (!detail) return `  - ${what}: no detail`;
    return `  - ${what}: ${label(peopleOptions, detail.people)} people × ${label(
      hoursOptions,
      detail.hours
    )} hrs/week, mostly ${label(doerOptions, detail.doer).toLowerCase()}`;
  });

  return [
    `${singleLine(contact.company)} completed the AI Growth Audit.`,
    "",
    `Contact: ${singleLine(contact.name)} <${contact.email}>`,
    `Role: ${label(roleOptions, answers.role)} · Team: ${label(teamSizeOptions, answers.teamSize)}`,
    "",
    "GROWTH",
    `Next 12 months: ${label(directionOptions, answers.direction)}`,
    `Holding them back: ${answers.blockers.map((b) => label(blockerOptions, b)).join("; ")}`,
    `If enquiries doubled: ${label(doubledOptions, answers.doubled)}`,
    `Enquiries a month: ${label(enquiryVolumeOptions, answers.enquiryVolume)}`,
    `Reply speed: ${label(replySpeedOptions, answers.replySpeed)}`,
    "",
    "TIME",
    ...areaLines,
    range ? `Estimated team time: ${range.low}–${range.high} hours a week` : "Estimated team time: none given",
    "",
    `Systems: ${answers.systems.map((s) => label(systemOptions, s)).join(", ")}`,
    answers.oneThing ? `One thing to take off their plate: ${singleLine(answers.oneThing)}` : null,
    "",
    `Lead lever shown to them: ${lever}`,
    `Record: crm.growth_audits id ${auditId}`,
  ]
    .filter((line) => line !== null)
    .join("\n");
}

export async function sendAuditNotification(
  answers: AuditAnswers,
  contact: AuditContact,
  auditId: string
): Promise<"sent" | "skipped"> {
  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.GROWTH_AUDIT_NOTIFICATION_EMAIL ?? process.env.CONTACT_EMAIL;
  if (!apiKey || !recipient) return "skipped";

  const { error } = await new Resend(apiKey).emails.send(
    {
      from: process.env.GROWTH_AUDIT_NOTIFICATION_FROM ?? "Aygency Audit <audit@aygency.ai>",
      to: recipient,
      replyTo: contact.email,
      subject: `AI Growth Audit: ${singleLine(contact.company)}`,
      text: formatAuditSummary(answers, contact, auditId),
    },
    { idempotencyKey: `growth-audit-${auditId}` }
  );
  if (error) throw new Error(`Growth audit notification failed: ${error.name}: ${error.message}`);
  return "sent";
}
