import { describe, expect, it } from "vitest";
import { estimateTasks, suggestAgents, weeklyTotal } from "./estimate";
import { completeAnswersSchema, type AuditAnswers } from "./questions";

const answers: AuditAnswers = {
  scaleLive: "4-6",
  scaleSize: "1-5m",
  tasks: ["site_reports", "quote_levelling", "handover"],
  taskDetails: {
    site_reports: { people: "4-10", who: "site_manager", frequency: "weekly", duration: "2-4h" },
    quote_levelling: { people: "2-3", who: "qs", frequency: "daily", duration: "30m-2h" },
    handover: { people: "1", who: "office", frequency: "per_job", duration: "days" },
  },
  retyping: ["whatsapp_to_diary"],
  channels: ["whatsapp", "email"],
  crm: "none",
  tools: ["excel", "microsoft"],
  aiUse: "individuals",
  aiWhere: ["site_reports"],
  limits: ["no_client_contact"],
  oneThing: "The Friday client report.",
};

describe("estimateTasks", () => {
  it("multiplies people, hours each time and frequency, and ranks by weekly hours", () => {
    const estimates = estimateTasks("construction", answers);
    expect(estimates.map((e) => e.task)).toEqual(["site_reports", "quote_levelling", "handover"]);
    expect(estimates[0].weeklyHours).toBe(6 * 3 * 1);
    expect(estimates[1].weeklyHours).toBe(2.5 * 1 * 5);
  });

  it("keeps once-per-job work out of the weekly total but records hours each time", () => {
    const estimates = estimateTasks("construction", answers);
    const handover = estimates.find((e) => e.task === "handover");
    expect(handover?.weeklyHours).toBeNull();
    expect(handover?.hoursEachTime).toBe(20);
    expect(weeklyTotal(estimates)).toBe(18 + 12.5);
  });
});

describe("suggestAgents", () => {
  it("leads with the Coordinator, then the agents with the most team hours", () => {
    expect(suggestAgents(estimateTasks("construction", answers), 1)).toEqual(["Coordinator", "Operations"]);
  });

  it("leaves 'something else' work out of the suggestion and labels it with their words", () => {
    const withOther: AuditAnswers = {
      ...answers,
      tasks: ["other"],
      taskDetails: { other: { people: "1", who: "office", frequency: "daily", duration: "2-4h" } },
      otherText: { tasks: "Planning applications" },
    };
    const estimates = estimateTasks("construction", withOther);
    expect(estimates[0].label).toBe("Something else: Planning applications");
    expect(suggestAgents(estimates)).toEqual(["Coordinator"]);
  });
});

describe("completeAnswersSchema", () => {
  it("accepts a full construction audit", () => {
    expect(completeAnswersSchema("construction").safeParse(answers).success).toBe(true);
  });

  it("rejects options from the wrong pack", () => {
    expect(completeAnswersSchema("general").safeParse(answers).success).toBe(false);
  });

  it("requires the text box when they pick 'Something else'", () => {
    const withOther = { ...answers, tools: ["other"] };
    expect(completeAnswersSchema("construction").safeParse(withOther).success).toBe(false);
    expect(
      completeAnswersSchema("construction").safeParse({ ...withOther, otherText: { tools: "Buildertrend" } }).success
    ).toBe(true);
  });

  it("rejects a ticked task with no detail", () => {
    const missing = { ...answers, taskDetails: { site_reports: answers.taskDetails.site_reports } };
    expect(completeAnswersSchema("construction").safeParse(missing).success).toBe(false);
  });
});
