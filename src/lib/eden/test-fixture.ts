import type { EdenApplication } from "./application-schema";
import type { EdenLeadCapture } from "./lead-capture-schema";

export function createEdenLeadCaptureFixture(): EdenLeadCapture {
  return {
    eventId: "44444444-4444-4444-8444-444444444444",
    applicationId: "22222222-2222-4222-8222-222222222222",
    capturedAt: "2026-08-24T09:57:00.000Z",
    workEmail: "Applicant@Synthetic.Example",
    inquiryConsent: true,
    attribution: {
      landingPath: "/design-your-eden",
      referrerOrigin: "https://search.synthetic.example",
      utmSource: "synthetic",
      utmMedium: "test",
      utmCampaign: "eden-capture",
    },
    botToken: "turnstile-response-placeholder",
    website: "",
  };
}

export function createEdenApplicationFixture(): EdenApplication {
  return {
    eventId: "11111111-1111-4111-8111-111111111111",
    applicationId: "22222222-2222-4222-8222-222222222222",
    startedAt: "2026-08-24T09:58:00.000Z",
    submittedAt: "2026-08-24T10:00:00.000Z",
    answers: {
      primaryOutcomes: [
        "protect-time",
        "keep-tasks-moving",
        "reduce-inbox-load",
        "improve-meeting-readiness",
        "coordinate-travel",
      ],
      normalWeekSupport:
        "Keep track of replies, prepare meetings, and make sure agreed actions happen without me rebuilding the context.",
      desiredWeeklyResult:
        "I start each day clear on what matters and finish the week with important follow-ups completed.",
      currentFriction:
        "Follow-ups, meeting preparation, and travel changes compete for attention, so client commitments are revisited too late.",
      weeklyWorkloadVolume: "26-50",
      hoursLostWeekly: 14,
      meetingLoad: "high",
      emailLoad: "high",
      calendarComplexity: "complex",
      travelFrequency: "monthly",
      currentTools: ["microsoft-365", "todoist", "notion", "telegram"],
      contextReadiness: "scattered",
      dayOneContext:
        "Client work and company leadership compete for time, and mornings should remain protected for focused work.",
      supportScope: "small-team",
      startingAuthority: "prepare-for-approval",
      decisionBoundaries:
        "Bring back client commitments, spending, important date changes, and anything sent in my name.",
      briefingPreferences:
        "A short morning plan, meeting briefs, and one end-of-day list of anything waiting on me.",
      successMeasure:
        "I recover focused time, arrive prepared, and people no longer need to chase me for important follow-ups.",
      operatedServiceAck: true,
      targetStartWindow: "within_30_days",
      buyingPriority: "best-outcome",
      anythingElse:
        "A measured first release should focus on follow-through before expanding scope.",
    },
    contact: {
      fullName: "Alex Morgan",
      workEmail: "Alex.Morgan@example.com",
      phone: "+447700900123",
      roleTitle: "Founder",
      linkedinUrl: "https://www.linkedin.com/in/example-applicant",
    },
    organisation: {
      name: "Northstar Advisory",
      website: "https://northstar.example.com",
      companyNumber: "01234567",
      countryCode: "GB",
      sizeBand: "11-50",
    },
    consent: {
      inquiry: true,
      marketing: false,
    },
    attribution: {
      landingPath: "/eden/apply",
      referrerOrigin: "https://www.google.com",
      utmSource: "google",
      utmMedium: "cpc",
      utmCampaign: "eden-launch",
    },
    botToken: "turnstile-response-placeholder",
    website: "",
  };
}
