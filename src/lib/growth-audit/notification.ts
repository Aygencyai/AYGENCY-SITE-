import { Resend } from "resend";
import { LOADED_HOURLY_RATE, WORKING_WEEKS, estimateTasks, suggestAgents, weeklyTotal } from "./estimate";
import {
  aiUseOptions,
  channelOptions,
  crmOptions,
  durationOptions,
  frequencyOptions,
  limitOptions,
  packs,
  peopleOptions,
  type AuditAnswers,
  type AuditContact,
  type AuditOption,
  type Pack,
} from "./questions";

function label(options: ReadonlyArray<AuditOption<string>>, value: string) {
  return options.find((option) => option.value === value)?.label ?? value;
}

function list(options: ReadonlyArray<AuditOption<string>>, values: readonly string[] | undefined) {
  return values?.length ? values.map((v) => label(options, v)).join(", ") : "none";
}

function singleLine(value: string) {
  return value.replace(/[\r\n\t]+/g, " ").trim();
}

const gbp = (value: number) => `£${Math.round(value / 100) * 100}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

/** The internal summary: their answers, plus our basic diagnosis and hours estimate. */
export function formatAuditSummary(pack: Pack, answers: AuditAnswers, contact: AuditContact, auditId: string) {
  const p = packs[pack];
  const estimates = estimateTasks(pack, answers);
  const weekly = weeklyTotal(estimates);
  const agents = suggestAgents(estimates);
  const other = (key: "tools" | "crm" | "aiWhere") =>
    answers.otherText?.[key] ? ` (other: ${singleLine(answers.otherText[key])})` : "";

  const taskLines = estimates.map((e) => {
    const d = e.detail;
    const hours =
      e.weeklyHours === null ? `~${e.hoursEachTime.toFixed(0)} team hrs each ${p.jobWord}` : `~${e.weeklyHours.toFixed(1)} team hrs/week`;
    return `  - ${e.label} [${e.agent}]: ${label(p.roles, d.who)} · ${d.people === "1" ? "1 person" : `${label(peopleOptions, d.people)} people`} · ${label(
      frequencyOptions,
      d.frequency
    ).toLowerCase()} · ${label(durationOptions, d.duration).toLowerCase()} each time → ${hours}`;
  });

  return [
    `${singleLine(contact.company)} completed the AI Growth Audit (${pack} pack).`,
    `Contact: ${singleLine(contact.name)} <${contact.email}>`,
    "",
    "DIAGNOSIS (internal)",
    `Suggested system: ${agents.join(" + ")}`,
    `One thing to take off their plate: "${singleLine(answers.oneThing)}"`,
    `Recurring team time on these tasks: ~${weekly.toFixed(0)} hrs/week`,
    `At UK median loaded pay (£${LOADED_HOURLY_RATE.toFixed(2)}/hr × ${WORKING_WEEKS} wks): ~${gbp(
      weekly * LOADED_HOURLY_RATE * WORKING_WEEKS
    )}/yr. Senior roles cost more; check in the room.`,
    "",
    "THE WORK",
    `${p.scaleLive.title} ${label(p.scaleLive.options, answers.scaleLive)}`,
    `${p.scaleSize.title} ${label(p.scaleSize.options, answers.scaleSize)}`,
    ...taskLines,
    `Typed twice: ${list(p.retyping, answers.retyping)}`,
    `Where decisions and updates happen: ${list(channelOptions, answers.channels)}`,
    "",
    "SYSTEMS",
    `CRM: ${label(crmOptions, answers.crm)}${other("crm")}`,
    `Tools: ${list(p.tools, answers.tools)}${other("tools")}`,
    `AI today: ${label(aiUseOptions, answers.aiUse)}${
      answers.aiWhere?.length ? ` (${list(p.tasks, answers.aiWhere)})${other("aiWhere")}` : ""
    }`,
    `Hard limits: ${list(limitOptions, answers.limits)}`,
    answers.wastesTime ? `\nWhat's costing them the most time: "${singleLine(answers.wastesTime)}"` : null,
    "",
    `Record: crm.growth_audits id ${auditId}`,
  ]
    .filter((line) => line !== null)
    .join("\n");
}

export async function sendAuditNotification(
  pack: Pack,
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
      text: formatAuditSummary(pack, answers, contact, auditId),
    },
    { idempotencyKey: `growth-audit-${auditId}` }
  );
  if (error) throw new Error(`Growth audit notification failed: ${error.name}: ${error.message}`);
  return "sent";
}
