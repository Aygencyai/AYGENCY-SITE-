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
        "close-open-loops",
        "reduce-inbox-load",
        "improve-meeting-readiness",
        "coordinate-travel",
      ],
      currentFriction:
        "Follow-ups, meeting preparation, and travel changes compete for attention, so client commitments are revisited too late.",
      hoursLostWeekly: 14,
      openLoopVolume: "high",
      meetingLoad: "high",
      emailLoad: "high",
      calendarComplexity: "complex",
      travelFrequency: "monthly",
      currentTools: ["microsoft-365", "todoist", "notion", "telegram"],
      targetStartWindow: "within_30_days",
      budgetReadiness: "approved",
      operatedServiceAck: true,
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
