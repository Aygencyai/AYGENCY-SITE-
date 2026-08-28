import type { FieldPath } from "react-hook-form";
import type {
  BudgetReadiness,
  CalendarComplexity,
  CurrentTool,
  DecisionAuthority,
  EdenAnswers,
  EdenQuestionnaireValues,
  EmailLoad,
  MeetingLoad,
  OpenLoopVolume,
  OrganisationSizeBand,
  PrimaryOutcome,
  TargetStartWindow,
  TravelFrequency,
} from "./application-schema";

export interface EdenOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

export const edenSteps = [
  { id: "workEmail", fields: ["contact.workEmail", "consent.inquiry"] },
  { id: "primaryOutcomes", fields: ["answers.primaryOutcomes"] },
  { id: "currentFriction", fields: ["answers.currentFriction"] },
  { id: "hoursLostWeekly", fields: ["answers.hoursLostWeekly"] },
  { id: "openLoopVolume", fields: ["answers.openLoopVolume"] },
  { id: "meetingLoad", fields: ["answers.meetingLoad"] },
  { id: "emailLoad", fields: ["answers.emailLoad"] },
  { id: "calendarComplexity", fields: ["answers.calendarComplexity"] },
  { id: "travelFrequency", fields: ["answers.travelFrequency"] },
  { id: "currentTools", fields: ["answers.currentTools"] },
  { id: "decisionAuthority", fields: ["answers.decisionAuthority"] },
  { id: "targetStartWindow", fields: ["answers.targetStartWindow"] },
  { id: "budgetReadiness", fields: ["answers.budgetReadiness"] },
  {
    id: "acknowledgements",
    fields: ["answers.operatedServiceAck", "answers.dataBoundaryAck"],
  },
  {
    id: "contactDetails",
    fields: [
      "contact.fullName",
      "contact.phone",
      "contact.roleTitle",
      "contact.linkedinUrl",
    ],
  },
  {
    id: "organisation",
    fields: [
      "organisation.name",
      "organisation.website",
      "organisation.companyNumber",
      "organisation.countryCode",
      "organisation.sizeBand",
    ],
  },
  { id: "anythingElse", fields: ["answers.anythingElse"] },
  {
    id: "consents",
    fields: ["consent.marketing", "botToken"],
  },
] as const satisfies ReadonlyArray<{
  id: string;
  fields: ReadonlyArray<FieldPath<EdenQuestionnaireValues>>;
}>;

export type EdenStepId = (typeof edenSteps)[number]["id"];

export const primaryOutcomeOptionList: ReadonlyArray<EdenOption<PrimaryOutcome>> = [
  { value: "protect-time", label: "Protect my time" },
  { value: "close-open-loops", label: "Close open loops" },
  { value: "improve-follow-through", label: "Improve follow-through" },
  { value: "reduce-inbox-load", label: "Reduce inbox load" },
  { value: "improve-meeting-readiness", label: "Improve meeting readiness" },
  { value: "protect-focus", label: "Protect focus" },
  { value: "coordinate-travel", label: "Coordinate travel" },
  {
    value: "manage-reservations",
    label: "Manage reservations",
    description: "Recorded as discovery interest while this capability remains parked.",
  },
  {
    value: "coordinate-household",
    label: "Coordinate household logistics",
    description: "Recorded as discovery interest while this capability remains parked.",
  },
];

export const openLoopVolumeOptionList: ReadonlyArray<EdenOption<OpenLoopVolume>> = [
  { value: "low", label: "Low", description: "A small number stay open at once." },
  { value: "moderate", label: "Moderate", description: "Several need active follow-through." },
  { value: "high", label: "High", description: "Open commitments regularly compete." },
  { value: "overwhelming", label: "Overwhelming", description: "Important commitments are routinely at risk." },
];

export const meetingLoadOptionList: ReadonlyArray<EdenOption<MeetingLoad>> = [
  { value: "low", label: "Low" },
  { value: "moderate", label: "Moderate" },
  { value: "high", label: "High" },
  { value: "extreme", label: "Extreme" },
];

export const emailLoadOptionList: ReadonlyArray<EdenOption<EmailLoad>> = [
  { value: "low", label: "Low" },
  { value: "moderate", label: "Moderate" },
  { value: "high", label: "High" },
  { value: "overwhelming", label: "Overwhelming" },
];

export const calendarComplexityOptionList: ReadonlyArray<
  EdenOption<CalendarComplexity>
> = [
  { value: "simple", label: "Simple", description: "Few moving calendars or constraints." },
  { value: "moderate", label: "Moderate", description: "Regular changes, attendees, or priorities." },
  { value: "complex", label: "Complex", description: "Many stakeholders, time zones, or dependencies." },
];

export const travelFrequencyOptionList: ReadonlyArray<
  EdenOption<TravelFrequency>
> = [
  { value: "rare", label: "Rarely" },
  { value: "monthly", label: "About monthly" },
  { value: "weekly", label: "About weekly" },
  { value: "multiple_weekly", label: "Several times a week" },
];

export const currentToolOptionList: ReadonlyArray<EdenOption<CurrentTool>> = [
  { value: "microsoft-365", label: "Microsoft 365" },
  { value: "google-workspace", label: "Google Workspace" },
  { value: "todoist", label: "Todoist" },
  { value: "notion", label: "Notion" },
  { value: "telegram", label: "Telegram" },
  { value: "slack", label: "Slack", description: "Requires confirmation during discovery." },
  { value: "other", label: "Another tool", description: "We will confirm the provider during discovery." },
];

export const decisionAuthorityOptionList: ReadonlyArray<
  EdenOption<DecisionAuthority>
> = [
  { value: "sole_decision_maker", label: "I can decide" },
  { value: "shared_decision", label: "The decision is shared" },
  { value: "recommender", label: "I am recommending Eden" },
];

export const targetStartWindowOptionList: ReadonlyArray<
  EdenOption<TargetStartWindow>
> = [
  { value: "immediately", label: "As soon as possible" },
  { value: "within_30_days", label: "Within 30 days" },
  { value: "within_90_days", label: "Within 90 days" },
  { value: "exploring", label: "I am exploring" },
];

export const budgetReadinessOptionList: ReadonlyArray<
  EdenOption<BudgetReadiness>
> = [
  { value: "approved", label: "Budget is approved" },
  { value: "range_known", label: "We know the workable range" },
  { value: "needs_business_case", label: "We need a business case" },
  { value: "not_set", label: "Budget is not set" },
];

export const acknowledgementOptionList: ReadonlyArray<EdenOption<"yes" | "no">> = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "Not yet" },
];

export const organisationSizeBandOptionList: ReadonlyArray<
  EdenOption<OrganisationSizeBand>
> = [
  { value: "solo", label: "Just me" },
  { value: "2-10", label: "2–10 people" },
  { value: "11-50", label: "11–50 people" },
  { value: "51-200", label: "51–200 people" },
  { value: "201-1000", label: "201–1,000 people" },
  { value: "1001+", label: "1,001+ people" },
];

function labelsFrom<T extends string>(options: ReadonlyArray<EdenOption<T>>) {
  return Object.fromEntries(options.map((option) => [option.value, option.label])) as Record<T, string>;
}

export const primaryOutcomeLabels = labelsFrom(primaryOutcomeOptionList);
export const openLoopVolumeLabels = labelsFrom(openLoopVolumeOptionList);
export const meetingLoadLabels = labelsFrom(meetingLoadOptionList);
export const emailLoadLabels = labelsFrom(emailLoadOptionList);
export const calendarComplexityLabels = labelsFrom(calendarComplexityOptionList);
export const travelFrequencyLabels = labelsFrom(travelFrequencyOptionList);
export const currentToolLabels = labelsFrom(currentToolOptionList);
export const decisionAuthorityLabels = labelsFrom(decisionAuthorityOptionList);
export const targetStartWindowLabels = labelsFrom(targetStartWindowOptionList);
export const budgetReadinessLabels = labelsFrom(budgetReadinessOptionList);
export const organisationSizeBandLabels = labelsFrom(organisationSizeBandOptionList);

interface EdenBlueprintRecommendation {
  title: string;
  thesis: string;
  firstCapability: string;
}

export function getEdenBlueprintRecommendation(
  outcomes: ReadonlyArray<PrimaryOutcome>,
): EdenBlueprintRecommendation {
  if (outcomes.includes("coordinate-travel")) {
    return {
      title: "Executive and travel coordination assistant",
      thesis: "Eden protects the working thread across commitments, preparation, and changing travel plans.",
      firstCapability: "Start with one calendar, one inbox, and the travel changes that most often create follow-up work.",
    };
  }
  if (
    outcomes.some((outcome) =>
      ["reduce-inbox-load", "improve-meeting-readiness", "protect-focus"].includes(outcome),
    )
  ) {
    return {
      title: "Executive coordination assistant",
      thesis: "Eden organises inbox, meeting, calendar, and commitment context into prepared next actions.",
      firstCapability: "Connect the first approved workspace and build a daily preparation and follow-through rhythm.",
    };
  }
  if (
    outcomes.some((outcome) =>
      ["manage-reservations", "coordinate-household"].includes(outcome),
    )
  ) {
    return {
      title: "Personal coordination assistant",
      thesis: "Eden begins with supported coordination work while parked interests are clarified during discovery.",
      firstCapability: "Start with a supported follow-through responsibility and define the next capability gate together.",
    };
  }
  return {
    title: "Follow-through assistant",
    thesis: "Eden keeps commitments visible, prepares the next move, and helps close the open loops that consume attention.",
    firstCapability: "Choose one recurring commitment flow and give every item a prepared, visible next action.",
  };
}

export function getEdenOperatingMode(answers: EdenAnswers) {
  if (!answers.operatedServiceAck || !answers.dataBoundaryAck) {
    return {
      title: "Boundary discovery first",
      description:
        "Before onboarding, we will resolve the operated-service and safe-data boundaries that are not yet accepted.",
    };
  }
  return {
    title: "Aygency-operated, review-first",
    description:
      "Aygency operates Eden after launch. We begin with bounded access, visible activity, and explicit escalation points.",
  };
}

export function getEdenExample(
  answers: EdenAnswers,
  sizeBand: OrganisationSizeBand,
) {
  const recommendation = getEdenBlueprintRecommendation(answers.primaryOutcomes);
  return {
    title: recommendation.firstCapability,
    arrivalTitle: "A commitment needs attention",
    arrivalDescription:
      "A reply, meeting change, promised follow-up, or calendar signal creates a new open loop.",
    coordinationTitle: "Eden prepares the next move",
    coordinationDescription:
      "Eden gathers approved context, prepares the action, records the commitment, and keeps its owner visible.",
    context: {
      volume: openLoopVolumeLabels[answers.openLoopVolume],
      people: organisationSizeBandLabels[sizeBand],
      systems: answers.currentTools.map((tool) => currentToolLabels[tool]).join(", "),
      authority: decisionAuthorityLabels[answers.decisionAuthority],
    },
    authorityDescription:
      answers.decisionAuthority === "sole_decision_maker"
        ? "You set the initial authority and approval gates during discovery."
        : "The discovery call identifies the decision owner and records the approval path before onboarding.",
  };
}
