import { z } from "zod";

export const primaryOutcomeOptions = [
  "protect-time",
  "close-open-loops",
  "improve-follow-through",
  "reduce-inbox-load",
  "improve-meeting-readiness",
  "protect-focus",
  "coordinate-travel",
  "manage-reservations",
  "coordinate-household",
] as const;

export const openLoopVolumeOptions = [
  "low",
  "moderate",
  "high",
  "overwhelming",
] as const;

export const meetingLoadOptions = ["low", "moderate", "high", "extreme"] as const;
export const emailLoadOptions = [
  "low",
  "moderate",
  "high",
  "overwhelming",
] as const;
export const calendarComplexityOptions = ["simple", "moderate", "complex"] as const;
export const travelFrequencyOptions = [
  "rare",
  "monthly",
  "weekly",
  "multiple_weekly",
] as const;
export const currentToolOptions = [
  "microsoft-365",
  "google-workspace",
  "todoist",
  "notion",
  "telegram",
  "slack",
  "other",
] as const;
export const targetStartWindowOptions = [
  "immediately",
  "within_30_days",
  "within_90_days",
  "exploring",
] as const;
export const budgetReadinessOptions = [
  "approved",
  "range_known",
  "needs_business_case",
  "not_set",
] as const;
export const organisationSizeBandOptions = [
  "solo",
  "2-10",
  "11-50",
  "51-200",
  "201-1000",
  "1001+",
] as const;

const UUID_V4_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SAFE_UTM_PATTERN = /^[A-Za-z0-9][A-Za-z0-9 ._~+/-]{0,99}$/;

const uuidV4Schema = z
  .string()
  .uuid("Submission reference must be a UUID.")
  .refine((value) => UUID_V4_PATTERN.test(value), "Submission reference must be UUIDv4.");

const requiredText = (field: string, minimum: number, maximum: number) =>
  z
    .string()
    .max(maximum, `${field} must be ${maximum} characters or fewer.`)
    .refine(
      (value) => value.trim().length >= minimum,
      `${field} must be at least ${minimum} characters.`,
    );

const optionalText = (field: string, maximum: number) =>
  z.string().max(maximum, `${field} must be ${maximum} characters or fewer.`);

const uniqueArray = <T extends string>(values: T[]) =>
  new Set(values).size === values.length;

const optionalHttpUrl = (field: string) =>
  optionalText(field, 2_048).refine((value) => {
    if (!value.trim()) return true;
    try {
      const url = new URL(value);
      return (
        ["http:", "https:"].includes(url.protocol) &&
        Boolean(url.hostname) &&
        !url.username &&
        !url.password
      );
    } catch {
      return false;
    }
  }, `${field} must be a valid HTTP or HTTPS URL.`);

const optionalLinkedInUrl = optionalText("LinkedIn URL", 2_048).refine((value) => {
  if (!value.trim()) return true;
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      (url.hostname === "linkedin.com" || url.hostname.endsWith(".linkedin.com"))
    );
  } catch {
    return false;
  }
}, "LinkedIn URL must be an HTTPS linkedin.com address.");

const answersSchema = z
  .object({
    primaryOutcomes: z
      .array(z.enum(primaryOutcomeOptions))
      .min(1, "Select at least one outcome.")
      .max(9)
      .refine(uniqueArray, "Select each outcome only once."),
    currentFriction: requiredText("Current friction", 20, 1_500),
    hoursLostWeekly: z
      .number({ error: "Enter the hours lost in a typical week." })
      .int("Use a whole number of hours.")
      .min(0)
      .max(168),
    openLoopVolume: z.enum(openLoopVolumeOptions),
    meetingLoad: z.enum(meetingLoadOptions),
    emailLoad: z.enum(emailLoadOptions),
    calendarComplexity: z.enum(calendarComplexityOptions),
    travelFrequency: z.enum(travelFrequencyOptions),
    currentTools: z
      .array(z.enum(currentToolOptions))
      .min(1, "Select at least one current tool.")
      .max(7)
      .refine(uniqueArray, "Select each tool only once."),
    targetStartWindow: z.enum(targetStartWindowOptions),
    budgetReadiness: z.enum(budgetReadinessOptions),
    operatedServiceAck: z.boolean({ error: "Choose how you would like Eden to be managed." }),
    anythingElse: optionalText("Additional context", 1_000),
  })
  .strict();

const contactSchema = z
  .object({
    fullName: requiredText("Name", 2, 120),
    workEmail: z
      .string()
      .max(254, "Email address is too long.")
      .email("Enter a valid work email address."),
    phone: optionalText("Phone number", 16).refine(
      (value) => !value.trim() || /^\+[1-9]\d{6,14}$/.test(value.trim()),
      "Use an international phone number such as +447700900123.",
    ),
    roleTitle: optionalText("Role title", 120),
    linkedinUrl: optionalLinkedInUrl,
  })
  .strict();

const applicationOrganisationSchema = z
  .object({
    name: requiredText("Company name", 2, 200),
    website: optionalHttpUrl("Company website"),
    companyNumber: optionalText("Company number", 32).refine(
      (value) => !value.trim() || /^[A-Za-z0-9][A-Za-z0-9 ./-]*$/.test(value.trim()),
      "Company number contains an unsupported character.",
    ),
    countryCode: z
      .string()
      .regex(/^[A-Z]{2}$/, "Choose a country."),
    sizeBand: z.enum(organisationSizeBandOptions),
  })
  .strict();

const questionnaireOrganisationSchema = z
  .object({
    name: optionalText("Organisation name", 200),
    website: optionalHttpUrl("Organisation website"),
    companyNumber: optionalText("Company number", 32).refine(
      (value) => !value.trim() || /^[A-Za-z0-9][A-Za-z0-9 ./-]*$/.test(value.trim()),
      "Company number contains an unsupported character.",
    ),
    countryCode: z.union([
      z.literal(""),
      z.string().regex(/^[A-Z]{2}$/, "Choose a country."),
    ]),
    sizeBand: z.union([z.literal(""), z.enum(organisationSizeBandOptions)]),
  })
  .strict()
  .superRefine((organisation, context) => {
    const shared = [
      organisation.name,
      organisation.website,
      organisation.companyNumber,
      organisation.countryCode,
      organisation.sizeBand,
    ].some((value) => value.trim().length > 0);
    if (!shared) return;
    if (organisation.name.trim().length < 2) {
      context.addIssue({
        code: "custom",
        path: ["name"],
        message: "Add the organisation name, or leave this optional section blank.",
      });
    }
    if (!organisation.countryCode) {
      context.addIssue({
        code: "custom",
        path: ["countryCode"],
        message: "Choose the organisation country, or leave this section blank.",
      });
    }
    if (!organisation.sizeBand) {
      context.addIssue({
        code: "custom",
        path: ["sizeBand"],
        message: "Choose the organisation size, or leave this section blank.",
      });
    }
  });

const consentSchema = z
  .object({
    inquiry: z
      .boolean()
      .refine((granted) => granted, "Consent is required so we can respond."),
    marketing: z.boolean(),
  })
  .strict();

const optionalAttributionValue = z.string().regex(SAFE_UTM_PATTERN).optional();

const attributionSchema = z
  .object({
    landingPath: z
      .string()
      .min(1)
      .max(300)
      .regex(/^\/(?!\/)[^\s?#]*$/, "Landing path must be an origin-relative path."),
    referrerOrigin: z
      .string()
      .max(300)
      .refine((value) => {
        try {
          const url = new URL(value);
          return ["http:", "https:"].includes(url.protocol) && url.origin === value;
        } catch {
          return false;
        }
      }, "Referrer must contain only an HTTP or HTTPS origin.")
      .optional(),
    utmSource: optionalAttributionValue,
    utmMedium: optionalAttributionValue,
    utmCampaign: optionalAttributionValue,
    utmTerm: optionalAttributionValue,
    utmContent: optionalAttributionValue,
  })
  .strict();

export const edenQuestionnaireSchema = z
  .object({
    answers: answersSchema,
    contact: contactSchema,
    organisation: questionnaireOrganisationSchema,
    consent: consentSchema,
    botToken: z
      .string()
      .min(10, "Complete the security check before submitting.")
      .max(2_048),
    website: z.string().max(200),
  })
  .strict();

export const edenApplicationSchema = z
  .object({
    eventId: uuidV4Schema,
    applicationId: uuidV4Schema,
    startedAt: z.string().datetime({ offset: true }),
    submittedAt: z.string().datetime({ offset: true }),
    answers: answersSchema,
    contact: contactSchema,
    organisation: applicationOrganisationSchema.nullable(),
    consent: consentSchema,
    attribution: attributionSchema,
    botToken: z.string().min(10).max(2_048),
    website: z.string().max(200),
  })
  .strict()
  .superRefine((application, context) => {
    if (Date.parse(application.submittedAt) < Date.parse(application.startedAt)) {
      context.addIssue({
        code: "custom",
        path: ["submittedAt"],
        message: "Submission time cannot be earlier than the start time.",
      });
    }
  });

export type EdenApplication = z.infer<typeof edenApplicationSchema>;
export type EdenQuestionnaireValues = z.infer<typeof edenQuestionnaireSchema>;
export type EdenAnswers = EdenApplication["answers"];
export type EdenContact = EdenApplication["contact"];
export type EdenOrganisation = EdenApplication["organisation"];
export type EdenAttribution = EdenApplication["attribution"];
export type PrimaryOutcome = EdenAnswers["primaryOutcomes"][number];
export type OpenLoopVolume = EdenAnswers["openLoopVolume"];
export type MeetingLoad = EdenAnswers["meetingLoad"];
export type EmailLoad = EdenAnswers["emailLoad"];
export type CalendarComplexity = EdenAnswers["calendarComplexity"];
export type TravelFrequency = EdenAnswers["travelFrequency"];
export type CurrentTool = EdenAnswers["currentTools"][number];
export type TargetStartWindow = EdenAnswers["targetStartWindow"];
export type BudgetReadiness = EdenAnswers["budgetReadiness"];
export type OrganisationSizeBand = (typeof organisationSizeBandOptions)[number];
