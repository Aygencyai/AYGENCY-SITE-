import { describe, expect, it } from "vitest";
import { formatAuditSummary } from "./notification";
import type { AuditAnswers } from "./questions";

const answers: AuditAnswers = {
  scaleLive: "4-6",
  scaleSize: "1-5m",
  tasks: ["quote_levelling", "site_reports", "handover"],
  taskDetails: {
    quote_levelling: { who: "qs", people: "2-3", frequency: "daily", duration: "30m-2h" },
    site_reports: { who: "site_manager", people: "4-10", frequency: "weekly", duration: "2-4h" },
    handover: { who: "office", people: "1", frequency: "per_job", duration: "days" },
  },
  retyping: ["whatsapp_to_diary"],
  channels: ["whatsapp", "email"],
  crm: "none",
  tools: ["excel", "microsoft"],
  aiUse: "individuals",
  aiWhere: ["site_reports"],
  limits: ["no_client_contact"],
  oneThing: "The Friday client report.",
  wastesTime: "Friday reports rebuilt from WhatsApp photos.",
};

describe("formatAuditSummary", () => {
  it("leads with the diagnosis and lists every task with its maths", () => {
    const text = formatAuditSummary("construction", answers, { name: "Sam", email: "sam@example.com", company: "Test Co" }, "id-1");
    if (process.env.PRINT_SUMMARY) console.log(text);
    expect(text).toContain("Suggested system: Coordinator + ");
    expect(text).toContain('One thing to take off their plate: "The Friday client report."');
    expect(text).toContain("~20 team hrs each project");
    expect(text).toContain("CRM: No, it's in email and our heads");
  });
});
