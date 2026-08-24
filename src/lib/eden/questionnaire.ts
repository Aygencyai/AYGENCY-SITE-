import type { FieldPath } from "react-hook-form";
import type {
  AutonomyPreference,
  DataReadiness,
  EdenQuestionnaireValues,
  InvestmentRange,
  PrimaryGoal,
  SuccessMeasure,
  SystemOption,
  TeamSize,
  Timeline,
  WorkflowVolume,
} from "./application-schema";

export interface EdenOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

export const edenSteps = [
  { id: "primaryGoal", fields: ["answers.primaryGoal"] },
  { id: "desiredOutcome", fields: ["answers.desiredOutcome"] },
  { id: "currentChallenge", fields: ["answers.currentChallenge"] },
  { id: "workflowVolume", fields: ["answers.workflowVolume"] },
  { id: "teamSize", fields: ["answers.teamSize"] },
  { id: "systems", fields: ["answers.systems"] },
  { id: "dataReadiness", fields: ["answers.dataReadiness"] },
  { id: "autonomyPreference", fields: ["answers.autonomyPreference"] },
  { id: "successMeasures", fields: ["answers.successMeasures"] },
  { id: "timeline", fields: ["answers.timeline"] },
  { id: "investmentRange", fields: ["answers.investmentRange"] },
  { id: "fullName", fields: ["contact.fullName"] },
  { id: "workEmail", fields: ["contact.workEmail"] },
  { id: "companyName", fields: ["contact.companyName"] },
  { id: "consents", fields: ["consent.inquiry", "consent.marketing"] },
] as const satisfies ReadonlyArray<{
  id: string;
  fields: ReadonlyArray<FieldPath<EdenQuestionnaireValues>>;
}>;

export type EdenStepId = (typeof edenSteps)[number]["id"];

export const primaryGoalOptions: ReadonlyArray<EdenOption<PrimaryGoal>> = [
  {
    value: "revenue",
    label: "Revenue that moves without chasing",
    description: "Prospecting, qualification, follow-up, pipeline, or expansion.",
  },
  {
    value: "customer_experience",
    label: "A faster customer experience",
    description: "Support, onboarding, service delivery, or account care.",
  },
  {
    value: "operations",
    label: "Operations that run themselves",
    description: "Coordination, handoffs, fulfilment, QA, or recurring workflows.",
  },
  {
    value: "finance_admin",
    label: "Less finance and admin drag",
    description: "Reconciliation, documents, reporting, or routine back-office work.",
  },
  {
    value: "knowledge_people",
    label: "Knowledge people can actually use",
    description: "Internal answers, training, recruitment, or team enablement.",
  },
  {
    value: "leadership_visibility",
    label: "Sharper leadership visibility",
    description: "Signals, forecasts, decisions, risks, and cross-business insight.",
  },
  {
    value: "other",
    label: "Another workflow",
    description: "You know there is leverage here, even if it needs mapping first.",
  },
];

const volumeContext: Record<
  PrimaryGoal,
  { title: string; description: string; noun: string }
> = {
  revenue: {
    title: "How much revenue activity moves through this workflow?",
    description:
      "A directional weekly estimate is enough—think leads, follow-ups, opportunities, or account touches.",
    noun: "revenue touches",
  },
  customer_experience: {
    title: "How many customer conversations move through this workflow?",
    description:
      "Estimate a typical week across support, onboarding, service, and account care.",
    noun: "customer conversations",
  },
  operations: {
    title: "How often does this workflow run?",
    description:
      "Estimate the weekly number of requests, handoffs, cases, or operational cycles.",
    noun: "workflow runs",
  },
  finance_admin: {
    title: "How much finance or admin work passes through it?",
    description:
      "Estimate a typical week of invoices, records, documents, checks, or reporting items.",
    noun: "items",
  },
  knowledge_people: {
    title: "How often does the team need this knowledge workflow?",
    description:
      "Estimate weekly questions, searches, people requests, or learning moments.",
    noun: "requests",
  },
  leadership_visibility: {
    title: "How many signals feed the decisions you want to improve?",
    description:
      "Estimate recurring updates, reports, exceptions, or decisions reviewed in a week.",
    noun: "signals or decisions",
  },
  other: {
    title: "How often does this work repeat?",
    description:
      "A directional weekly estimate is enough. We will map the detail together later.",
    noun: "workflow items",
  },
};

export function getVolumeQuestion(goal: PrimaryGoal | undefined) {
  const context = volumeContext[goal ?? "other"];
  const options: ReadonlyArray<EdenOption<WorkflowVolume>> = [
    { value: "under_25_weekly", label: `Under 25 ${context.noun} / week` },
    { value: "25_100_weekly", label: `25–100 ${context.noun} / week` },
    { value: "101_500_weekly", label: `101–500 ${context.noun} / week` },
    { value: "over_500_weekly", label: `More than 500 ${context.noun} / week` },
    { value: "irregular", label: "It is irregular or seasonal" },
    { value: "unknown", label: "I do not know yet" },
  ];

  return { ...context, options };
}

export const teamSizeOptions: ReadonlyArray<EdenOption<TeamSize>> = [
  { value: "just_me", label: "Just me" },
  { value: "2_5", label: "2–5 people" },
  { value: "6_20", label: "6–20 people" },
  { value: "21_50", label: "21–50 people" },
  { value: "51_plus", label: "51+ people" },
  { value: "unknown", label: "It crosses teams / not sure" },
];

export const systemOptionList: ReadonlyArray<EdenOption<SystemOption>> = [
  { value: "crm", label: "CRM or sales platform" },
  { value: "email_support", label: "Email, inbox, or support desk" },
  { value: "spreadsheets", label: "Spreadsheets or shared trackers" },
  { value: "project_operations", label: "Project or operations tools" },
  { value: "finance_erp", label: "Finance, accounting, or ERP" },
  { value: "knowledge_documents", label: "Knowledge base or documents" },
  { value: "data_warehouse", label: "Database, BI, or data warehouse" },
  { value: "custom_internal", label: "Custom internal software" },
  { value: "other", label: "Another tool category" },
  { value: "not_sure", label: "Not sure yet" },
];

export const dataReadinessOptionList: ReadonlyArray<
  EdenOption<DataReadiness>
> = [
  {
    value: "structured",
    label: "Mostly structured and accessible",
    description: "The useful information already lives in dependable systems.",
  },
  {
    value: "fragmented",
    label: "Useful, but fragmented",
    description: "It exists across tools, documents, inboxes, or teams.",
  },
  {
    value: "mostly_manual",
    label: "Mostly manual or in people's heads",
    description: "The workflow works through habit more than system design.",
  },
  {
    value: "starting_fresh",
    label: "We would be starting fresh",
    description: "The process or data foundation still needs designing.",
  },
  {
    value: "unknown",
    label: "I need help assessing this",
  },
];

export const autonomyOptionList: ReadonlyArray<
  EdenOption<AutonomyPreference>
> = [
  {
    value: "insights_only",
    label: "Surface insights only",
    description: "Eden finds patterns and recommends what a person should do.",
  },
  {
    value: "draft_and_review",
    label: "Prepare the work for review",
    description: "Eden researches, drafts, and organises; a person completes it.",
  },
  {
    value: "approval_gates",
    label: "Act after clear approval",
    description: "Eden prepares actions and waits at explicit decision gates.",
  },
  {
    value: "bounded_autonomy",
    label: "Run routine work within guardrails",
    description: "Eden acts independently only inside agreed limits and escalation rules.",
  },
  {
    value: "need_guidance",
    label: "Recommend the right level",
    description: "We will choose authority based on risk, reversibility, and evidence.",
  },
];

export const successMeasureOptionList: ReadonlyArray<
  EdenOption<SuccessMeasure>
> = [
  { value: "time_saved", label: "Time returned to the team" },
  { value: "faster_response", label: "Faster response or cycle time" },
  { value: "quality_consistency", label: "More consistent quality" },
  { value: "revenue_growth", label: "Revenue created or protected" },
  { value: "cost_reduction", label: "Lower operating cost" },
  { value: "operational_visibility", label: "Clearer operational visibility" },
  { value: "customer_experience", label: "A better customer experience" },
  { value: "capacity_to_scale", label: "Capacity to scale without matching headcount" },
];

export const timelineOptionList: ReadonlyArray<EdenOption<Timeline>> = [
  { value: "within_30_days", label: "We need movement in the next 30 days" },
  { value: "this_quarter", label: "This quarter" },
  { value: "next_6_months", label: "Within six months" },
  { value: "this_year", label: "This year" },
  { value: "exploring", label: "We are exploring the opportunity" },
];

export const investmentOptionList: ReadonlyArray<
  EdenOption<InvestmentRange>
> = [
  { value: "under_10k", label: "Under £10k" },
  { value: "10k_25k", label: "£10k–£25k" },
  { value: "25k_50k", label: "£25k–£50k" },
  { value: "50k_plus", label: "£50k+ for the right system" },
  { value: "need_guidance", label: "I need guidance on scope and investment" },
];

export const primaryGoalLabels: Record<PrimaryGoal, string> = {
  revenue: "Revenue operations",
  customer_experience: "Customer experience",
  operations: "Core operations",
  finance_admin: "Finance and administration",
  knowledge_people: "Knowledge and people",
  leadership_visibility: "Leadership intelligence",
  other: "A mapped priority workflow",
};

export const workflowVolumeLabels: Record<WorkflowVolume, string> = {
  under_25_weekly: "Under 25 per week",
  "25_100_weekly": "25–100 per week",
  "101_500_weekly": "101–500 per week",
  over_500_weekly: "More than 500 per week",
  irregular: "Irregular or seasonal",
  unknown: "Not known yet",
};

export const teamSizeLabels: Record<TeamSize, string> = {
  just_me: "Just me",
  "2_5": "2–5 people",
  "6_20": "6–20 people",
  "21_50": "21–50 people",
  "51_plus": "51+ people",
  unknown: "Cross-team / not known yet",
};

export const systemLabels = Object.fromEntries(
  systemOptionList.map((option) => [option.value, option.label])
) as Record<SystemOption, string>;

export const dataReadinessLabels = Object.fromEntries(
  dataReadinessOptionList.map((option) => [option.value, option.label])
) as Record<DataReadiness, string>;

export const autonomyLabels = Object.fromEntries(
  autonomyOptionList.map((option) => [option.value, option.label])
) as Record<AutonomyPreference, string>;

export const successMeasureLabels = Object.fromEntries(
  successMeasureOptionList.map((option) => [option.value, option.label])
) as Record<SuccessMeasure, string>;

export const timelineLabels = Object.fromEntries(
  timelineOptionList.map((option) => [option.value, option.label])
) as Record<Timeline, string>;

export const investmentLabels = Object.fromEntries(
  investmentOptionList.map((option) => [option.value, option.label])
) as Record<InvestmentRange, string>;

export const blueprintByGoal: Record<
  PrimaryGoal,
  { title: string; thesis: string; firstCapability: string }
> = {
  revenue: {
    title: "Revenue orchestration system",
    thesis:
      "An agent layer that keeps commercial signals moving, prepares the next best action, and prevents valuable opportunities from going quiet.",
    firstCapability: "Map one revenue motion end to end and close its follow-up gaps.",
  },
  customer_experience: {
    title: "Customer experience system",
    thesis:
      "A coordinated service layer that understands context, accelerates routine responses, and escalates the moments that need a person.",
    firstCapability: "Start with one high-volume customer journey and its escalation rules.",
  },
  operations: {
    title: "Operational command system",
    thesis:
      "An agent system that coordinates recurring work, keeps ownership visible, and moves exceptions to the right person before they become bottlenecks.",
    firstCapability: "Instrument one recurring workflow with clear inputs, owners, and exceptions.",
  },
  finance_admin: {
    title: "Finance and admin operations system",
    thesis:
      "A controlled agent layer for repetitive records, checks, preparation, and reporting—with human approval wherever financial authority begins.",
    firstCapability: "Choose one document-heavy process with a measurable error or delay cost.",
  },
  knowledge_people: {
    title: "Organisational knowledge system",
    thesis:
      "A dependable knowledge layer that finds grounded answers, prepares people workflows, and makes institutional context available at the moment of need.",
    firstCapability: "Unify one high-value knowledge domain and its source-of-truth rules.",
  },
  leadership_visibility: {
    title: "Leadership intelligence system",
    thesis:
      "A signal layer that connects operational data, surfaces changes and risks, and prepares evidence-backed decisions without inventing certainty.",
    firstCapability: "Define the first decision cadence and the signals it genuinely needs.",
  },
  other: {
    title: "Priority workflow system",
    thesis:
      "A focused agent system designed around the highest-leverage recurring work, with scope set by evidence rather than a generic automation template.",
    firstCapability: "Map the workflow, quantify the friction, and select the narrowest valuable first release.",
  },
};

export function getBlueprintOperatingMode(
  dataReadiness: DataReadiness,
  autonomy: AutonomyPreference
) {
  if (
    dataReadiness === "mostly_manual" ||
    dataReadiness === "starting_fresh"
  ) {
    return {
      title: "Foundation-first pilot",
      description:
        "Structure the workflow and its evidence trail first, then add agent capability without automating ambiguity.",
    };
  }

  if (dataReadiness === "unknown") {
    return {
      title: "Discovery-led pilot",
      description:
        "Audit the workflow and data surface before fixing autonomy or integration scope.",
    };
  }

  if (autonomy === "bounded_autonomy") {
    return {
      title: "Guardrailed execution pilot",
      description:
        "Begin with reversible routine actions, explicit limits, evidence logs, and a clear escalation path.",
    };
  }

  if (autonomy === "insights_only") {
    return {
      title: "Decision-support pilot",
      description:
        "Start by surfacing grounded signals and recommendations while your team retains every action.",
    };
  }

  return {
    title: "Human-in-the-loop pilot",
    description:
      "Let Eden prepare and coordinate the work while named people approve consequential actions.",
  };
}
