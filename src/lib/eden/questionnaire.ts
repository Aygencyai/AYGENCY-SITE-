import type { FieldPath } from "react-hook-form";
import type {
  AutonomyPreference,
  BuyingPriority,
  DataReadiness,
  EdenQuestionnaireValues,
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
  { id: "workEmail", fields: ["contact.workEmail"] },
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
  { id: "buyingPriority", fields: ["answers.buyingPriority"] },
  { id: "fullName", fields: ["contact.fullName"] },
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
    label: "Keep communication and follow-ups moving",
    description:
      "Inbox replies, introductions, sales follow-ups, and relationship nudges.",
  },
  {
    value: "customer_experience",
    label: "Stay ahead of clients and customers",
    description:
      "Requests, onboarding, check-ins, service updates, and account care.",
  },
  {
    value: "operations",
    label: "Coordinate projects and recurring work",
    description: "Tasks, owners, hand-offs, deadlines, and recurring routines.",
  },
  {
    value: "finance_admin",
    label: "Handle admin and reporting",
    description: "Documents, records, expenses, reports, and routine checks.",
  },
  {
    value: "knowledge_people",
    label: "Prepare research, briefs, and first drafts",
    description:
      "Research, meeting preparation, summaries, documents, and team answers.",
  },
  {
    value: "leadership_visibility",
    label: "Protect my focus and priorities",
    description:
      "Calendar, daily briefings, decisions, risks, and what needs attention.",
  },
  {
    value: "other",
    label: "Give Eden another responsibility",
    description: "Describe the recurring responsibility you want her to own.",
  },
];

const volumeContext: Record<
  PrimaryGoal,
  { title: string; description: string; noun: string }
> = {
  revenue: {
    title: "How many conversations or follow-ups could Eden help move each week?",
    description:
      "Count inbox replies, introductions, opportunities, and relationship follow-ups in a typical week.",
    noun: "conversations or follow-ups",
  },
  customer_experience: {
    title: "How many client or customer requests could Eden support each week?",
    description:
      "Include support, onboarding, check-ins, service updates, and account requests.",
    noun: "client or customer requests",
  },
  operations: {
    title: "How many tasks or hand-offs could Eden coordinate each week?",
    description:
      "Count recurring tasks, project updates, requests, approvals, and follow-ups in a typical week.",
    noun: "tasks or hand-offs",
  },
  finance_admin: {
    title: "How many admin or reporting items could Eden prepare each week?",
    description:
      "Count documents, expenses, records, routine checks, and reports in a typical week.",
    noun: "admin or reporting items",
  },
  knowledge_people: {
    title: "How many research or preparation requests could Eden handle each week?",
    description:
      "Include meeting briefs, research questions, summaries, drafts, and requests for internal context.",
    noun: "research or preparation requests",
  },
  leadership_visibility: {
    title: "How many updates, meetings, or priorities could Eden organise each week?",
    description:
      "Count the inputs that compete for your attention across a normal week.",
    noun: "updates, meetings, or priorities",
  },
  other: {
    title: "How often would Eden need to step in?",
    description:
      "A directional weekly estimate is enough. We can shape the exact responsibility together.",
    noun: "requests or actions",
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
  { value: "2_5", label: "Me and up to four others" },
  { value: "6_20", label: "A team of 6–20" },
  { value: "21_50", label: "A team of 21–50" },
  { value: "51_plus", label: "More than 50 people" },
  { value: "unknown", label: "Several teams or still deciding" },
];

export const systemOptionList: ReadonlyArray<EdenOption<SystemOption>> = [
  { value: "email_support", label: "Email, calendar, or support inbox" },
  { value: "crm", label: "CRM or sales platform" },
  { value: "project_operations", label: "Project or task management" },
  { value: "knowledge_documents", label: "Documents or knowledge base" },
  { value: "spreadsheets", label: "Spreadsheets or shared trackers" },
  { value: "finance_erp", label: "Finance, accounting, or ERP" },
  { value: "data_warehouse", label: "Reporting, BI, or database" },
  { value: "custom_internal", label: "Custom internal software" },
  { value: "other", label: "Another work tool" },
  { value: "not_sure", label: "Not sure yet" },
];

export const dataReadinessOptionList: ReadonlyArray<
  EdenOption<DataReadiness>
> = [
  {
    value: "structured",
    label: "Ready for Eden to use",
    description:
      "The useful context already lives in dependable tools and documents.",
  },
  {
    value: "fragmented",
    label: "Useful, spread across a few places",
    description:
      "Eden would bring together context from tools, documents, and inboxes.",
  },
  {
    value: "mostly_manual",
    label: "Mostly in routines or people's heads",
    description:
      "We would first teach Eden the way the work currently gets done.",
  },
  {
    value: "starting_fresh",
    label: "A fresh responsibility for Eden",
    description: "We would design the working rhythm and context together.",
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
  { value: "time_saved", label: "Hours back each week" },
  { value: "faster_response", label: "Faster replies and follow-ups" },
  { value: "quality_consistency", label: "More reliable execution" },
  { value: "revenue_growth", label: "More opportunities followed through" },
  { value: "cost_reduction", label: "Admin effort returned to useful work" },
  { value: "operational_visibility", label: "Clearer priorities and open actions" },
  { value: "customer_experience", label: "Clients feel better looked after" },
  { value: "capacity_to_scale", label: "More capacity for valuable work" },
];

export const timelineOptionList: ReadonlyArray<EdenOption<Timeline>> = [
  { value: "within_30_days", label: "Within the next 30 days" },
  { value: "this_quarter", label: "During the next three months" },
  { value: "next_6_months", label: "Within six months" },
  { value: "this_year", label: "Later this year" },
  { value: "exploring", label: "I am exploring what Eden could do" },
];

export const buyingPriorityOptionList: ReadonlyArray<
  EdenOption<BuyingPriority>
> = [
  {
    value: "best_result",
    label: "Getting the strongest fit and result",
    description:
      "Quality, reliability, and the right capability for my work come first.",
  },
  {
    value: "balanced_value",
    label: "Balancing capability and value",
    description:
      "I want the right result supported by a clear commercial case.",
  },
  {
    value: "lowest_price",
    label: "Keeping the monthly price as low as possible",
    description: "Price will lead my decision when I compare the options.",
  },
];

export const primaryGoalLabels: Record<PrimaryGoal, string> = {
  revenue: "Communication and follow-ups",
  customer_experience: "Client and customer care",
  operations: "Projects and recurring work",
  finance_admin: "Admin and reporting",
  knowledge_people: "Research, briefs, and drafts",
  leadership_visibility: "Focus and priorities",
  other: "Another responsibility for Eden",
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
  "2_5": "Me and up to four others",
  "6_20": "A team of 6–20",
  "21_50": "A team of 21–50",
  "51_plus": "More than 50 people",
  unknown: "Several teams or still deciding",
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

export const buyingPriorityLabels = Object.fromEntries(
  buyingPriorityOptionList.map((option) => [option.value, option.label])
) as Record<BuyingPriority, string>;

interface EdenExamplePattern {
  title: string;
  arrivalTitle: string;
  arrivalDescription: string;
  coordinationTitle: string;
  coordinationDescription: string;
}

const edenExampleByGoal: Record<PrimaryGoal, EdenExamplePattern> = {
  revenue: {
    title: "A reply lands and Eden keeps the conversation moving.",
    arrivalTitle: "A conversation needs a next step",
    arrivalDescription:
      "A lead replies, a contact makes an introduction, or an active opportunity needs a timely follow-up.",
    coordinationTitle: "Eden prepares the follow-up",
    coordinationDescription:
      "Eden checks the conversation and CRM context, drafts the response, records the commitment, and keeps the next action visible.",
  },
  customer_experience: {
    title: "A client request gets a prepared, informed response.",
    arrivalTitle: "A client needs an update or answer",
    arrivalDescription:
      "A support question, onboarding task, account request, or promised check-in appears in a connected channel.",
    coordinationTitle: "Eden brings the client context together",
    coordinationDescription:
      "Eden gathers the account history and open commitments, prepares the response, and routes any specialist work to the right place.",
  },
  operations: {
    title: "A project update becomes a clear next action.",
    arrivalTitle: "Work changes or a deadline approaches",
    arrivalDescription:
      "A task changes, a hand-off is due, a recurring routine begins, or an approval needs attention.",
    coordinationTitle: "Eden coordinates the moving pieces",
    coordinationDescription:
      "Eden carries the context between the connected tools, prepares updates, confirms ownership, and tracks the next commitment.",
  },
  finance_admin: {
    title: "A routine admin item arrives prepared for review.",
    arrivalTitle: "A document, record, or report is due",
    arrivalDescription:
      "An expense, document, record, routine check, or reporting request enters the agreed working rhythm.",
    coordinationTitle: "Eden assembles the supporting detail",
    coordinationDescription:
      "Eden gathers the relevant records, completes the preparation steps, and presents the item with its source context for review.",
  },
  knowledge_people: {
    title: "A meeting starts with the research already prepared.",
    arrivalTitle: "A brief, draft, or answer is needed",
    arrivalDescription:
      "A meeting appears on the calendar, a document needs a first draft, or someone asks for grounded context.",
    coordinationTitle: "Eden prepares the useful material",
    coordinationDescription:
      "Eden researches against the approved sources, organises the evidence, and prepares the brief or draft in the requested format.",
  },
  leadership_visibility: {
    title: "The day starts with a focused brief and clear priorities.",
    arrivalTitle: "Your calendar and work produce new signals",
    arrivalDescription:
      "Meetings move, commitments change, updates arrive, and decisions compete for attention.",
    coordinationTitle: "Eden prepares your priority view",
    coordinationDescription:
      "Eden brings together the relevant updates, open commitments, and decision context into a concise briefing for your day.",
  },
  other: {
    title: "A recurring responsibility moves into Eden's working rhythm.",
    arrivalTitle: "The agreed trigger appears",
    arrivalDescription:
      "A repeatable request, deadline, update, or signal appears in the connected tools.",
    coordinationTitle: "Eden takes the agreed next steps",
    coordinationDescription:
      "Eden gathers the context, coordinates any specialist work, records progress, and prepares the next action within the agreed bounds.",
  },
};

const authorityExampleByPreference: Record<AutonomyPreference, string> = {
  insights_only:
    "Eden surfaces the pattern and recommended response. Your team chooses and completes the action.",
  draft_and_review:
    "Eden prepares the work and supporting context for review. A named person completes the action.",
  approval_gates:
    "Eden prepares the action and pauses at an explicit approval gate before execution.",
  bounded_autonomy:
    "Eden completes agreed routine actions inside set limits, records the result, and brings exceptions to a named person.",
  need_guidance:
    "Aygency uses discovery to set the first decision boundary around risk, reversibility, and evidence.",
};

function summariseSystems(systems: ReadonlyArray<SystemOption>) {
  const knownSystems = systems
    .filter((system) => system !== "not_sure")
    .map((system) => systemLabels[system]);

  if (knownSystems.length === 0) return "Tool mix shaped during discovery";
  if (knownSystems.length === 1) return knownSystems[0];
  if (knownSystems.length === 2) {
    return `${knownSystems[0]} and ${knownSystems[1]}`;
  }

  const remaining = knownSystems.length - 2;
  return `${knownSystems[0]}, ${knownSystems[1]}, and ${remaining} more`;
}

export function getEdenExample(
  primaryGoal: PrimaryGoal,
  workflowVolume: WorkflowVolume,
  systems: ReadonlyArray<SystemOption>,
  teamSize: TeamSize,
  autonomyPreference: AutonomyPreference
) {
  const pattern = edenExampleByGoal[primaryGoal];
  const volume =
    getVolumeQuestion(primaryGoal).options.find(
      (option) => option.value === workflowVolume
    )?.label ?? workflowVolumeLabels[workflowVolume];

  return {
    ...pattern,
    context: {
      volume,
      people: teamSizeLabels[teamSize],
      systems: summariseSystems(systems),
      authority: autonomyLabels[autonomyPreference],
    },
    authorityDescription: authorityExampleByPreference[autonomyPreference],
  };
}

export const blueprintByGoal: Record<
  PrimaryGoal,
  { title: string; thesis: string; firstCapability: string }
> = {
  revenue: {
    title: "Follow-up and communications assistant",
    thesis:
      "Eden watches active conversations, prepares relevant responses, records commitments, and keeps each next action visible.",
    firstCapability:
      "Connect one inbox or CRM motion and give every active conversation a clear next step.",
  },
  customer_experience: {
    title: "Client care assistant",
    thesis:
      "Eden keeps client context close, prepares timely updates, and coordinates the people needed to move each request forward.",
    firstCapability:
      "Start with one recurring client journey and the check-ins, context, and decisions it needs.",
  },
  operations: {
    title: "Project coordination assistant",
    thesis:
      "Eden keeps tasks, owners, deadlines, and hand-offs connected so the next useful action is always clear.",
    firstCapability:
      "Give Eden one live project or recurring routine with clear owners and decision points.",
  },
  finance_admin: {
    title: "Admin and reporting assistant",
    thesis:
      "Eden prepares recurring records, documents, checks, and reports while keeping financial decisions with the right person.",
    firstCapability:
      "Choose one repeatable admin responsibility and teach Eden its sources, timing, and approval point.",
  },
  knowledge_people: {
    title: "Research and briefing assistant",
    thesis:
      "Eden turns approved sources into useful research, meeting briefs, summaries, and first drafts prepared around your working style.",
    firstCapability:
      "Connect the first trusted knowledge sources and define one brief or draft Eden should prepare repeatedly.",
  },
  leadership_visibility: {
    title: "Executive focus assistant",
    thesis:
      "Eden organises the calendar, commitments, updates, and decision context into a clear view of what deserves attention.",
    firstCapability:
      "Build a daily or weekly priority brief from the tools and updates you already rely on.",
  },
  other: {
    title: "Tailored personal assistant",
    thesis:
      "Eden takes on a defined recurring responsibility, learns its context, and coordinates the next action within clear permissions.",
    firstCapability:
      "Define the trigger, context, output, and decision boundary for Eden's first responsibility.",
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
      title: "Guided context setup",
      description:
        "Teach Eden the working rhythm and source context first, then add responsibility as the pattern becomes clear and dependable.",
    };
  }

  if (dataReadiness === "unknown") {
    return {
      title: "Context discovery",
      description:
        "Map the tools, context, and working rhythm before setting Eden's first permissions and connections.",
    };
  }

  if (autonomy === "bounded_autonomy") {
    return {
      title: "Guardrailed action",
      description:
        "Eden begins with reversible routine actions, explicit limits, a visible activity record, and a clear escalation path.",
    };
  }

  if (autonomy === "insights_only") {
    return {
      title: "Briefing and recommendations",
      description:
        "Eden starts by organising grounded context and recommending the next move while you retain every action.",
    };
  }

  return {
    title: "Review-first assistance",
    description:
      "Eden prepares and coordinates the work while named people approve consequential actions.",
  };
}
