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
  {
    value: "approved",
    label: "Best fit and outcome; budget is approved",
  },
  {
    value: "range_known",
    label: "Best fit within a known workable range",
  },
  {
    value: "needs_business_case",
    label: "Strongest outcome; I need the business case",
  },
  {
    value: "not_set",
    label: "Right solution first; budget follows",
  },
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
        title: "Run your inbox before it runs you",
        description:
          "Eden can triage approved inbox signals, prepare replies, surface the messages that need your judgment, and turn promised follow-ups into visible actions.",
        signal: `${emailLoadLabels[answers.emailLoad]} email load`,
      };
    case "meetings":
      return {
        id,
        title: "Prepare every meeting and close the loop",
        description:
          "Eden can assemble the brief before a meeting, carry decisions into the right actions, and keep owners and due dates visible afterwards.",
        signal: `${meetingLoadLabels[answers.meetingLoad]} meeting load`,
      };
    case "calendar":
      return {
        id,
        title: "Protect focus as the calendar moves",
        description:
          "Eden can coordinate scheduling constraints, protect priority time, prepare the context around changes, and escalate only the conflicts that need you.",
        signal: `${calendarComplexityLabels[answers.calendarComplexity]} calendar`,
      };
    case "travel":
      return {
        id,
        title: "Coordinate the moving parts around travel",
        description:
          "Eden can keep itinerary, calendar, preparation, and follow-up in one working thread so a change does not create a chain of missed commitments.",
        signal: `${travelFrequencyLabels[answers.travelFrequency]} work travel`,
      };
    case "personal-logistics":
      return {
        id,
        title: "Bring personal logistics into one thread",
        description:
          "Eden can coordinate supported reservations and recurring logistics through agreed providers, with permissions and exceptions scoped during discovery.",
        signal: "Personal coordination selected",
      };
    case "follow-through":
      return {
        id,
        title: "Keep every commitment moving",
        description:
          "Eden can capture the next action, prepare what is needed, remind the right owner, and bring you a concise exception when progress needs your decision.",
        signal: `${openLoopVolumeLabels[answers.openLoopVolume]} open-loop volume · ${answers.hoursLostWeekly} hrs/week`,
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
      case "manage-reservations":
      case "coordinate-household":
        return ["personal-logistics"];
      default:
        return ["follow-through"];
    }
  });

  const workload: EdenCapabilityId[] = [
    ...(["high", "overwhelming"].includes(answers.openLoopVolume)
      ? (["follow-through"] as const)
      : []),
    ...(["high", "overwhelming"].includes(answers.emailLoad)
      ? (["inbox"] as const)
      : []),
    ...(["high", "extreme"].includes(answers.meetingLoad)
      ? (["meetings"] as const)
      : []),
    ...(answers.calendarComplexity === "complex"
      ? (["calendar"] as const)
      : []),
    ...(answers.travelFrequency !== "rare" ? (["travel"] as const) : []),
  ];

  const unique = [...new Set<EdenCapabilityId>([
    ...requested,
    ...workload,
    "follow-through",
  ])];
  return unique.slice(0, 3).map((id) => capabilityFor(id, answers));
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
  const firstCapability = getEdenCapabilityPlan(answers)[0];
  const scenarios: Record<EdenCapabilityId, EdenExampleScenario> = {
    "follow-through": {
      arrivalTitle: "A commitment needs attention",
      arrivalDescription:
        "A promised reply, decision, or next action becomes due across one of the approved tools.",
      coordinationTitle: "Eden prepares the next move",
      coordinationDescription:
        "Eden gathers approved context, prepares the action, records the commitment, and keeps its owner visible.",
    },
    inbox: {
      arrivalTitle: "A priority message reaches the inbox",
      arrivalDescription:
        "Eden separates routine traffic from a message that affects a live commitment or needs your decision.",
      coordinationTitle: "Eden turns the message into progress",
      coordinationDescription:
        "Eden prepares the reply, links the relevant context, and creates the follow-up before bringing you the decision point.",
    },
    meetings: {
      arrivalTitle: "A meeting is approaching",
      arrivalDescription:
        "The agenda, recent commitments, and unresolved decisions sit across approved tools and calendars.",
      coordinationTitle: "Eden prepares the room and the follow-through",
      coordinationDescription:
        "Eden assembles a concise brief, then carries agreed actions, owners, and dates into the working system afterwards.",
    },
    calendar: {
      arrivalTitle: "The calendar changes around a priority",
      arrivalDescription:
        "A new request, conflict, or attendee change puts focus time or preparation at risk.",
      coordinationTitle: "Eden protects the important work",
      coordinationDescription:
        "Eden checks the agreed constraints, prepares a resolution, and escalates only when the trade-off needs your judgment.",
    },
    travel: {
      arrivalTitle: "A travel plan changes",
      arrivalDescription:
        "An itinerary, meeting, or preparation dependency moves and creates follow-on work across the week.",
      coordinationTitle: "Eden keeps the whole thread aligned",
      coordinationDescription:
        "Eden prepares the approved changes across itinerary, calendar, briefings, and follow-ups, then surfaces exceptions for review.",
    },
    "personal-logistics": {
      arrivalTitle: "A recurring personal task needs coordination",
      arrivalDescription:
        "A supported booking or logistics request arrives through the agreed channel and provider boundary.",
      coordinationTitle: "Eden prepares the supported action",
      coordinationDescription:
        "Eden gathers the approved preferences, prepares the next step, and asks for review wherever the agreed authority requires it.",
    },
  };
  const scenario = scenarios[firstCapability.id];
  return {
    title: firstCapability.title,
    ...scenario,
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
