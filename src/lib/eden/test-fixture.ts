import type { EdenApplication } from "./application-schema";

export function createEdenApplicationFixture(): EdenApplication {
  return {
    submissionId: "550e8400-e29b-41d4-a716-446655440000",
    startedAt: "2026-08-24T10:00:00.000Z",
    submittedAt: "2026-08-24T10:02:00.000Z",
    answers: {
      primaryGoal: "operations",
      desiredOutcome:
        "A reliable operation where routine work moves without manual chasing.",
      currentChallenge:
        "Requests arrive through several channels and ownership is often unclear.",
      workflowVolume: "101_500_weekly",
      teamSize: "6_20",
      systems: ["email_support", "spreadsheets", "project_operations"],
      dataReadiness: "fragmented",
      autonomyPreference: "approval_gates",
      successMeasures: [
        "time_saved",
        "quality_consistency",
        "operational_visibility",
      ],
      timeline: "this_quarter",
      investmentRange: "1k_2k_monthly",
    },
    contact: {
      fullName: "Alex Morgan",
      workEmail: "alex@example.com",
      companyName: "Northstar Operations",
    },
    consent: {
      inquiry: true,
      marketing: false,
    },
    attribution: {
      utmSource: "linkedin",
      utmMedium: "paid-social",
      utmCampaign: "eden-launch",
      landingPath: "/design-your-eden",
      referrer: "https://www.linkedin.com/feed/",
    },
    website: "",
  };
}
