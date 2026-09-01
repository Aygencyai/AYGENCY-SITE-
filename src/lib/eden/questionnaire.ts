import type { FieldPath } from "react-hook-form";
import type {
  BuyingPriority,
  CalendarComplexity,
  ContextReadiness,
  CurrentTool,
  DecisionStyle,
  EdenAnswers,
  EdenQuestionnaireValues,
  EmailLoad,
  MeetingLoad,
  OrganisationSizeBand,
  PrimaryOutcome,
  StartingAuthority,
  TargetStartWindow,
  TravelFrequency,
  WeeklyWorkloadVolume,
} from "./application-schema";

export interface EdenOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

export const edenSteps = [
  { id: "workEmail", fields: ["contact.workEmail", "consent.inquiry"] },
  { id: "primaryOutcomes", fields: ["answers.primaryOutcomes"] },
  { id: "normalWeekSupport", fields: ["answers.normalWeekSupport"] },
  { id: "desiredWeeklyResult", fields: ["answers.desiredWeeklyResult"] },
  { id: "currentFriction", fields: ["answers.currentFriction"] },
  { id: "weeklyWorkloadVolume", fields: ["answers.weeklyWorkloadVolume"] },
  { id: "hoursLostWeekly", fields: ["answers.hoursLostWeekly"] },
  { id: "meetingLoad", fields: ["answers.meetingLoad"] },
  { id: "emailLoad", fields: ["answers.emailLoad"] },
  { id: "calendarComplexity", fields: ["answers.calendarComplexity"] },
  { id: "travelFrequency", fields: ["answers.travelFrequency"] },
  { id: "currentTools", fields: ["answers.currentTools"] },
  { id: "contextReadiness", fields: ["answers.contextReadiness"] },
  { id: "dayOneContext", fields: ["answers.dayOneContext"] },
  { id: "decisionStyle", fields: ["answers.decisionStyle"] },
  { id: "startingAuthority", fields: ["answers.startingAuthority"] },
  { id: "decisionBoundaries", fields: ["answers.decisionBoundaries"] },
  { id: "briefingPreferences", fields: ["answers.briefingPreferences"] },
  { id: "successMeasure", fields: ["answers.successMeasure"] },
  { id: "serviceModel", fields: ["answers.operatedServiceAck"] },
  { id: "targetStartWindow", fields: ["answers.targetStartWindow"] },
  { id: "buyingPriority", fields: ["answers.buyingPriority"] },
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
  {
    id: "anythingElse",
    fields: ["answers.anythingElse", "consent.marketing"],
  },
] as const satisfies ReadonlyArray<{
  id: string;
  fields: ReadonlyArray<FieldPath<EdenQuestionnaireValues>>;
}>;

export type EdenStepId = (typeof edenSteps)[number]["id"];

export const primaryOutcomeOptionList: ReadonlyArray<EdenOption<PrimaryOutcome>> = [
  { value: "protect-time", label: "Protect my time" },
  { value: "keep-tasks-moving", label: "Keep tasks and requests moving" },
  { value: "improve-follow-through", label: "Make sure follow-ups happen" },
  { value: "reduce-inbox-load", label: "Reduce the work in my inbox" },
  { value: "improve-meeting-readiness", label: "Prepare me better for meetings" },
  { value: "protect-focus", label: "Protect time for important work" },
  { value: "coordinate-travel", label: "Coordinate work travel" },
  { value: "coordinate-household", label: "Coordinate household logistics" },
];

export const weeklyWorkloadVolumeOptionList: ReadonlyArray<
  EdenOption<WeeklyWorkloadVolume>
> = [
  { value: "under-10", label: "Fewer than 10" },
  { value: "10-25", label: "About 10 to 25" },
  { value: "26-50", label: "About 26 to 50" },
  { value: "more-than-50", label: "More than 50" },
  { value: "hard-to-tell", label: "It is hard to keep count" },
];

export const meetingLoadOptionList: ReadonlyArray<EdenOption<MeetingLoad>> = [
  { value: "low", label: "A few meetings" },
  { value: "moderate", label: "Meetings take up part of most days" },
  { value: "high", label: "Meetings take up most days" },
  { value: "extreme", label: "My calendar is dominated by meetings" },
];

export const emailLoadOptionList: ReadonlyArray<EdenOption<EmailLoad>> = [
  { value: "low", label: "Easy to stay on top of" },
  { value: "moderate", label: "Needs attention every day" },
  { value: "high", label: "Important messages are easy to miss" },
  { value: "overwhelming", label: "The inbox regularly controls my day" },
];

export const calendarComplexityOptionList: ReadonlyArray<
  EdenOption<CalendarComplexity>
> = [
  { value: "simple", label: "Mostly straightforward" },
  { value: "moderate", label: "Regular changes or competing priorities" },
  { value: "complex", label: "Many people, time zones, or dependencies" },
];

export const travelFrequencyOptionList: ReadonlyArray<
  EdenOption<TravelFrequency>
> = [
  { value: "rare", label: "Rarely" },
  { value: "monthly", label: "About once a month" },
  { value: "weekly", label: "Most weeks" },
  { value: "multiple_weekly", label: "Several times a week" },
];

export const currentToolOptionList: ReadonlyArray<EdenOption<CurrentTool>> = [
  { value: "microsoft-365", label: "Microsoft 365" },
  { value: "google-workspace", label: "Google Workspace" },
  { value: "todoist", label: "Todoist" },
  { value: "notion", label: "Notion" },
  { value: "telegram", label: "Telegram" },
  { value: "slack", label: "Slack" },
  { value: "other", label: "Another tool" },
];

export const contextReadinessOptionList: ReadonlyArray<
  EdenOption<ContextReadiness>
> = [
  { value: "organised", label: "It is organised and easy to find" },
  { value: "partly-organised", label: "Some is organised and some is not" },
  { value: "scattered", label: "It is spread across different places" },
  { value: "mostly-in-my-head", label: "Most of it is still in my head" },
];

export const decisionStyleOptionList: ReadonlyArray<EdenOption<DecisionStyle>> = [
  { value: "clear-recommendation", label: "Give me one clear recommendation" },
  {
    value: "short-options",
    label: "Give me a short list of options and trade-offs",
  },
  { value: "full-context", label: "Give me the full context before I decide" },
  { value: "questions-first", label: "Ask me a few questions first" },
];

export const startingAuthorityOptionList: ReadonlyArray<
  EdenOption<StartingAuthority>
> = [
  {
    value: "suggest-only",
    label: "Suggest what I should do",
    description: "Eden organises the work and brings recommendations to you.",
  },
  {
    value: "prepare-for-approval",
    label: "Prepare work for my approval",
    description: "Eden prepares drafts and next steps, then waits for you.",
  },
  {
    value: "handle-agreed-routine-work",
    label: "Handle agreed routine work",
    description: "Eden completes clearly agreed routine tasks and brings exceptions to you.",
  },
];

export const targetStartWindowOptionList: ReadonlyArray<
  EdenOption<TargetStartWindow>
> = [
  { value: "immediately", label: "As soon as possible" },
  { value: "within_30_days", label: "Within 30 days" },
  { value: "within_90_days", label: "Within 90 days" },
  { value: "exploring", label: "I am exploring for now" },
];

export const buyingPriorityOptionList: ReadonlyArray<EdenOption<BuyingPriority>> = [
  {
    value: "best-outcome",
    label: "Getting the strongest outcome, even if it costs more",
  },
  {
    value: "balance-outcome-and-cost",
    label: "Getting the right balance of outcome and cost",
  },
  {
    value: "lowest-price",
    label: "Paying the lowest possible price",
  },
];

export const serviceModelOptionList: ReadonlyArray<
  EdenOption<"managed" | "self_maintained">
> = [
  {
    value: "managed",
    label: "Aygency looks after and improves Eden with me",
  },
  {
    value: "self_maintained",
    label: "I want to buy Eden and maintain her myself",
  },
];

export const organisationSizeBandOptionList: ReadonlyArray<
  EdenOption<OrganisationSizeBand>
> = [
  { value: "solo", label: "Just me" },
  { value: "2-10", label: "2 to 10 people" },
  { value: "11-50", label: "11 to 50 people" },
  { value: "51-200", label: "51 to 200 people" },
  { value: "201-1000", label: "201 to 1,000 people" },
  { value: "1001+", label: "More than 1,000 people" },
];

function labelsFrom<T extends string>(options: ReadonlyArray<EdenOption<T>>) {
  return Object.fromEntries(options.map((option) => [option.value, option.label])) as Record<
    T,
    string
  >;
}

export const primaryOutcomeLabels = labelsFrom(primaryOutcomeOptionList);
export const weeklyWorkloadVolumeLabels = labelsFrom(weeklyWorkloadVolumeOptionList);
export const meetingLoadLabels = labelsFrom(meetingLoadOptionList);
export const emailLoadLabels = labelsFrom(emailLoadOptionList);
export const calendarComplexityLabels = labelsFrom(calendarComplexityOptionList);
export const travelFrequencyLabels = labelsFrom(travelFrequencyOptionList);
export const currentToolLabels = labelsFrom(currentToolOptionList);
export const contextReadinessLabels = labelsFrom(contextReadinessOptionList);
export const decisionStyleLabels = labelsFrom(decisionStyleOptionList);
export const startingAuthorityLabels = labelsFrom(startingAuthorityOptionList);
export const targetStartWindowLabels = labelsFrom(targetStartWindowOptionList);
export const buyingPriorityLabels = labelsFrom(buyingPriorityOptionList);
export const organisationSizeBandLabels = labelsFrom(organisationSizeBandOptionList);

interface EdenBlueprintRecommendation {
  title: string;
  thesis: string;
  firstCapability: string;
}

export type EdenCapabilityId =
  | "follow-through"
  | "inbox"
  | "meetings"
  | "calendar"
  | "travel"
  | "personal-logistics";

export interface EdenCapabilityRecommendation {
  id: EdenCapabilityId;
  title: string;
  description: string;
  signal: string;
}

interface EdenExampleScenario {
  arrivalTitle: string;
  arrivalDescription: string;
  coordinationTitle: string;
  coordinationDescription: string;
}

function capabilityFor(
  id: EdenCapabilityId,
  answers: EdenAnswers,
): EdenCapabilityRecommendation {
  switch (id) {
    case "inbox":
      return {
        id,
        title: "Keep your inbox under control",
        description:
          "Eden can sort approved inbox activity, prepare replies, highlight what needs you, and remember the follow-up.",
        signal: emailLoadLabels[answers.emailLoad],
      };
    case "meetings":
      return {
        id,
        title: "Prepare meetings and remember what comes next",
        description:
          "Eden can prepare the useful context before a meeting and keep the agreed actions moving afterwards.",
        signal: meetingLoadLabels[answers.meetingLoad],
      };
    case "calendar":
      return {
        id,
        title: "Protect your time as plans change",
        description:
          "Eden can help coordinate changes, protect important work, and bring genuine conflicts back to you.",
        signal: calendarComplexityLabels[answers.calendarComplexity],
      };
    case "travel":
      return {
        id,
        title: "Keep work travel organised",
        description:
          "Eden can keep plans, preparation, calendar changes, and follow-up together when travel affects your week.",
        signal: travelFrequencyLabels[answers.travelFrequency],
      };
    case "personal-logistics":
      return {
        id,
        title: "Coordinate household logistics",
        description:
          "Eden can remember recurring household needs, prepare the next step, and keep the people involved up to date.",
        signal: "Household coordination selected",
      };
    case "follow-through":
      return {
        id,
        title: "Keep tasks, requests, and promises moving",
        description:
          "Eden can remember what needs to happen, prepare the next step, follow up at the right time, and bring blockers to you.",
        signal: weeklyWorkloadVolumeLabels[answers.weeklyWorkloadVolume],
      };
  }
}

export function getEdenCapabilityPlan(
  answers: EdenAnswers,
): EdenCapabilityRecommendation[] {
  const requested = answers.primaryOutcomes.flatMap<EdenCapabilityId>((outcome) => {
    switch (outcome) {
      case "reduce-inbox-load":
        return ["inbox"];
      case "improve-meeting-readiness":
        return ["meetings"];
      case "protect-focus":
        return ["calendar"];
      case "coordinate-travel":
        return ["travel"];
      case "coordinate-household":
        return ["personal-logistics"];
      default:
        return ["follow-through"];
    }
  });

  const workload: EdenCapabilityId[] = [
    ...(["26-50", "more-than-50", "hard-to-tell"].includes(
      answers.weeklyWorkloadVolume,
    )
      ? (["follow-through"] as const)
      : []),
    ...(["high", "overwhelming"].includes(answers.emailLoad)
      ? (["inbox"] as const)
      : []),
    ...(["high", "extreme"].includes(answers.meetingLoad)
      ? (["meetings"] as const)
      : []),
    ...(answers.calendarComplexity === "complex" ? (["calendar"] as const) : []),
    ...(answers.travelFrequency !== "rare" ? (["travel"] as const) : []),
  ];

  const unique = [...new Set<EdenCapabilityId>([...requested, ...workload, "follow-through"])];
  return unique.slice(0, 3).map((id) => capabilityFor(id, answers));
}

export function getEdenBlueprintRecommendation(
  outcomes: ReadonlyArray<PrimaryOutcome>,
): EdenBlueprintRecommendation {
  if (outcomes.includes("coordinate-household")) {
    return {
      title: "Personal and household coordination assistant",
      thesis:
        "Eden can keep personal responsibilities visible and coordinate the next step before they become last-minute problems.",
      firstCapability:
        "Start with the recurring personal and household responsibilities that consume the most attention.",
    };
  }
  if (outcomes.includes("coordinate-travel")) {
    return {
      title: "Personal assistant for work and travel",
      thesis:
        "Eden can keep preparation, plans, changes, and follow-up connected across a busy week.",
      firstCapability:
        "Start with one calendar, one inbox, and the travel changes that create the most extra work.",
    };
  }
  if (
    outcomes.some((outcome) =>
      ["reduce-inbox-load", "improve-meeting-readiness", "protect-focus"].includes(
        outcome,
      ),
    )
  ) {
    return {
      title: "Personal assistant for a busy working week",
      thesis:
        "Eden can bring your inbox, meetings, calendar, and follow-ups into one clear working rhythm.",
      firstCapability:
        "Start with the part of your week that creates the most repeated preparation and follow-up.",
    };
  }
  return {
    title: "Personal follow-through assistant",
    thesis:
      "Eden can remember what matters, prepare the next step, and keep important work from quietly slipping.",
    firstCapability:
      "Start with one repeated area of responsibility and give every item a clear next action.",
  };
}

export function getEdenOperatingMode(answers: EdenAnswers) {
  if (!answers.operatedServiceAck) {
    return {
      title: "Set up for you to maintain",
      description:
        "Aygency can prepare your starting Eden and agree what you will maintain afterwards.",
    };
  }
  return {
    title: "Looked after with you",
    description:
      "Aygency sets up, operates, and improves Eden with you as your needs change.",
  };
}

export function getEdenExample(
  answers: EdenAnswers,
  sizeBand: OrganisationSizeBand | null,
) {
  const firstCapability = getEdenCapabilityPlan(answers)[0];
  const scenarios: Record<EdenCapabilityId, EdenExampleScenario> = {
    "follow-through": {
      arrivalTitle: "Something important needs a next step",
      arrivalDescription:
        "A request, promise, or task reaches the point where someone needs to act.",
      coordinationTitle: "Eden prepares what happens next",
      coordinationDescription:
        "Eden brings together the useful context, prepares the next action, and remembers when to follow up.",
    },
    inbox: {
      arrivalTitle: "An important message arrives",
      arrivalDescription:
        "A message affects live work or needs a thoughtful response among routine inbox traffic.",
      coordinationTitle: "Eden turns the message into progress",
      coordinationDescription:
        "Eden prepares the reply and the follow-up, then brings you anything that needs your judgment.",
    },
    meetings: {
      arrivalTitle: "A meeting is approaching",
      arrivalDescription:
        "The useful background and unfinished actions sit across different places.",
      coordinationTitle: "Eden gets you ready",
      coordinationDescription:
        "Eden prepares a short brief and keeps the decisions and actions moving after the meeting.",
    },
    calendar: {
      arrivalTitle: "Your plans change",
      arrivalDescription:
        "A new request or conflict puts important work or preparation at risk.",
      coordinationTitle: "Eden protects what matters",
      coordinationDescription:
        "Eden prepares a sensible resolution and asks you only when a real trade-off needs your decision.",
    },
    travel: {
      arrivalTitle: "A travel plan changes",
      arrivalDescription:
        "A journey, meeting, or preparation detail moves and creates more work around it.",
      coordinationTitle: "Eden keeps the week aligned",
      coordinationDescription:
        "Eden organises the changes, preparation, and follow-up, then shows you what still needs a decision.",
    },
    "personal-logistics": {
      arrivalTitle: "A household responsibility needs attention",
      arrivalDescription:
        "A recurring task, date, or request needs someone to remember and coordinate the next step.",
      coordinationTitle: "Eden keeps it moving",
      coordinationDescription:
        "Eden prepares what is needed, keeps the right people updated, and brings choices back to you.",
    },
  };
  const scenario = scenarios[firstCapability.id];
  return {
    title: firstCapability.title,
    ...scenario,
    context: {
      volume: weeklyWorkloadVolumeLabels[answers.weeklyWorkloadVolume],
      decisionStyle: decisionStyleLabels[answers.decisionStyle],
      organisation: sizeBand ? organisationSizeBandLabels[sizeBand] : "Not shared",
      systems: answers.currentTools.map((tool) => currentToolLabels[tool]).join(", "),
    },
    controlTitle: "You decide where Eden should stop and ask",
    controlDescription:
      answers.startingAuthority === "handle-agreed-routine-work"
        ? "Eden handles the routine work you agree and brings exceptions or important decisions back to you."
        : answers.startingAuthority === "prepare-for-approval"
          ? "Eden prepares the work and waits for your approval before it moves."
          : "Eden organises the situation and recommends the next step for you to decide.",
  };
}
