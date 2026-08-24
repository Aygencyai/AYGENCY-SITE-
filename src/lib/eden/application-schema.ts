import { z } from "zod";

export const primaryGoals = [
  "revenue",
  "customer_experience",
  "operations",
  "finance_admin",
  "knowledge_people",
  "leadership_visibility",
  "other",
] as const;

export const workflowVolumes = [
  "under_25_weekly",
  "25_100_weekly",
  "101_500_weekly",
  "over_500_weekly",
  "irregular",
  "unknown",
] as const;

export const teamSizes = [
  "just_me",
  "2_5",
  "6_20",
  "21_50",
  "51_plus",
  "unknown",
] as const;

export const systemOptions = [
  "crm",
  "email_support",
  "spreadsheets",
  "project_operations",
  "finance_erp",
  "knowledge_documents",
  "data_warehouse",
  "custom_internal",
  "other",
  "not_sure",
] as const;

export const dataReadinessOptions = [
  "structured",
  "fragmented",
  "mostly_manual",
  "starting_fresh",
  "unknown",
] as const;

export const autonomyPreferences = [
  "insights_only",
  "draft_and_review",
  "approval_gates",
  "bounded_autonomy",
  "need_guidance",
] as const;

export const successMeasureOptions = [
  "time_saved",
  "faster_response",
  "quality_consistency",
  "revenue_growth",
  "cost_reduction",
  "operational_visibility",
  "customer_experience",
  "capacity_to_scale",
] as const;

export const timelineOptions = [
  "within_30_days",
  "this_quarter",
  "next_6_months",
  "this_year",
  "exploring",
] as const;

export const investmentRanges = [
  "under_500_monthly",
  "500_1k_monthly",
  "1k_2k_monthly",
  "2k_plus_monthly",
  "need_guidance",
] as const;

const requiredText = (field: string, minimum: number, maximum: number) =>
  z
    .string()
    .max(maximum, `${field} must be ${maximum} characters or fewer.`)
    .refine(
      (value) => value.trim().length >= minimum,
      `${field} must be at least ${minimum} characters.`
    );

const uniqueArray = <T extends string>(values: T[]) =>
  new Set(values).size === values.length;

const answersSchema = z
  .object({
    primaryGoal: z.enum(primaryGoals),
    desiredOutcome: requiredText("Desired outcome", 20, 800),
    currentChallenge: requiredText("Current challenge", 20, 1_200),
    workflowVolume: z.enum(workflowVolumes),
    teamSize: z.enum(teamSizes),
    systems: z
      .array(z.enum(systemOptions))
      .min(1, "Select at least one tool category.")
      .max(6, "Select no more than six tool categories.")
      .refine(uniqueArray, "Select each tool category only once.")
      .refine(
        (values) => !values.includes("not_sure") || values.length === 1,
        '“Not sure yet” cannot be combined with another tool category.'
      ),
    dataReadiness: z.enum(dataReadinessOptions),
    autonomyPreference: z.enum(autonomyPreferences),
    successMeasures: z
      .array(z.enum(successMeasureOptions))
      .min(1, "Select at least one measure of success.")
      .max(4, "Select no more than four measures of success.")
      .refine(uniqueArray, "Select each success measure only once."),
    timeline: z.enum(timelineOptions),
    investmentRange: z.enum(investmentRanges),
  })
  .strict();

const contactSchema = z
  .object({
    fullName: requiredText("Name", 2, 100),
    workEmail: z
      .string()
      .max(254, "Email address is too long.")
      .email("Enter a valid work email address."),
    companyName: requiredText("Company name", 2, 160),
  })
  .strict();

const consentSchema = z
  .object({
    inquiry: z
      .boolean()
      .refine(
        (granted) => granted,
        "Consent is required so we can respond to your inquiry."
      ),
    marketing: z.boolean(),
  })
  .strict();

const optionalAttributionValue = z.string().max(200).optional();

const attributionSchema = z
  .object({
    utmSource: optionalAttributionValue,
    utmMedium: optionalAttributionValue,
    utmCampaign: optionalAttributionValue,
    utmTerm: optionalAttributionValue,
    utmContent: optionalAttributionValue,
    gclid: optionalAttributionValue,
    fbclid: optionalAttributionValue,
    msclkid: optionalAttributionValue,
    landingPath: z
      .string()
      .max(500)
      .regex(/^\/(?!\/)/, "Landing path must be a relative site path."),
    referrer: z
      .string()
      .max(500)
      .url("Referrer must be a valid URL.")
      .refine((value) => {
        const protocol = new URL(value).protocol;
        return protocol === "https:" || protocol === "http:";
      }, "Referrer must use HTTP or HTTPS.")
      .optional(),
  })
  .strict();

export const edenQuestionnaireSchema = z
  .object({
    answers: answersSchema,
    contact: contactSchema,
    consent: consentSchema,
    website: z.string().max(200),
  })
  .strict();

export const edenApplicationSchema = z
  .object({
    submissionId: z.string().uuid("Submission ID must be a UUID."),
    startedAt: z.string().datetime({ offset: true }),
    submittedAt: z.string().datetime({ offset: true }),
    answers: answersSchema,
    contact: contactSchema,
    consent: consentSchema,
    attribution: attributionSchema,
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
export type EdenAttribution = EdenApplication["attribution"];
export type PrimaryGoal = EdenAnswers["primaryGoal"];
export type WorkflowVolume = EdenAnswers["workflowVolume"];
export type TeamSize = EdenAnswers["teamSize"];
export type SystemOption = EdenAnswers["systems"][number];
export type DataReadiness = EdenAnswers["dataReadiness"];
export type AutonomyPreference = EdenAnswers["autonomyPreference"];
export type SuccessMeasure = EdenAnswers["successMeasures"][number];
export type Timeline = EdenAnswers["timeline"];
export type InvestmentRange = EdenAnswers["investmentRange"];
