import { z } from "zod";

/**
 * The AI Growth Audit question set. This file is the single source of truth:
 * the funnel renders from it, the API validates against it, and every stored
 * row carries QUESTION_SET_VERSION so old answers stay readable after edits.
 * Bump the version whenever an option value is added, removed or renamed.
 */
export const QUESTION_SET_VERSION = "growth-audit.v1" as const;

export interface AuditOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

function values<T extends string>(options: ReadonlyArray<AuditOption<T>>) {
  return options.map((option) => option.value) as [T, ...T[]];
}

export const roleOptions = [
  { value: "owner", label: "Owner or director" },
  { value: "manager", label: "Manager" },
  { value: "other", label: "Something else" },
] as const satisfies ReadonlyArray<AuditOption<string>>;

export const teamSizeOptions = [
  { value: "solo", label: "Just me" },
  { value: "2-5", label: "2 to 5 people" },
  { value: "6-15", label: "6 to 15 people" },
  { value: "16-50", label: "16 to 50 people" },
  { value: "50+", label: "More than 50" },
] as const satisfies ReadonlyArray<AuditOption<string>>;

export const directionOptions = [
  { value: "more_customers", label: "More customers", description: "Grow the number of people you serve." },
  { value: "bigger_jobs", label: "Bigger jobs, better prices", description: "Grow what each customer is worth." },
  { value: "new_market", label: "A new service or market", description: "Take the business somewhere new." },
  { value: "run_smoother", label: "Same size, run smoother", description: "Fewer fires, less of it resting on you." },
] as const satisfies ReadonlyArray<AuditOption<string>>;

export const blockerOptions = [
  { value: "slow_replies", label: "We're slow to reply to enquiries" },
  { value: "capacity", label: "We can't take on more without hiring" },
  { value: "admin", label: "Admin buries the team" },
  { value: "no_time_marketing", label: "No time for marketing" },
  { value: "numbers_unclear", label: "We don't know which numbers matter" },
  { value: "owner_dependent", label: "Too much runs through one person" },
] as const satisfies ReadonlyArray<AuditOption<string>>;

export const doubledOptions = [
  { value: "handle", label: "We'd handle it" },
  { value: "overtime", label: "Overtime and late nights" },
  { value: "hire", label: "We'd have to hire" },
  { value: "drop", label: "Some would slip through" },
] as const satisfies ReadonlyArray<AuditOption<string>>;

export const enquiryVolumeOptions = [
  { value: "under_20", label: "Under 20" },
  { value: "20-50", label: "20 to 50" },
  { value: "50-200", label: "50 to 200" },
  { value: "200+", label: "More than 200" },
] as const satisfies ReadonlyArray<AuditOption<string>>;

export const replySpeedOptions = [
  { value: "minutes", label: "Within minutes" },
  { value: "hour", label: "Within the hour" },
  { value: "same_day", label: "Same day" },
  { value: "next_day", label: "Next day or later" },
] as const satisfies ReadonlyArray<AuditOption<string>>;

/** Each area maps to one agent in The Aygency System (see aygency-os docs/menu.md). */
export const areaOptions = [
  { value: "enquiries", label: "Answering enquiries, calls, messages and bookings" },
  { value: "follow_up", label: "Following up enquiries and chasing quotes" },
  { value: "admin", label: "Admin between systems", description: "Copying data, invoices, quotes, scheduling." },
  { value: "reporting", label: "Pulling reports and working out where the numbers stand" },
  { value: "content_planning", label: "Deciding what to post and when" },
  { value: "content_making", label: "Making posts, graphics and newsletters" },
  { value: "internal_chasing", label: "Chasing people internally", description: "Keeping track of who's doing what." },
] as const satisfies ReadonlyArray<AuditOption<string>>;

export const areaAgent: Record<Area, string> = {
  enquiries: "Front Desk",
  follow_up: "Outreach",
  admin: "Operations",
  reporting: "Analyst",
  content_planning: "Strategist",
  content_making: "Producer",
  internal_chasing: "Coordinator",
};

export const peopleOptions = [
  { value: "1", label: "1" },
  { value: "2-3", label: "2–3" },
  { value: "4-10", label: "4–10" },
  { value: "10+", label: "10+" },
] as const satisfies ReadonlyArray<AuditOption<string>>;

export const hoursOptions = [
  { value: "under_2", label: "Under 2" },
  { value: "2-5", label: "2–5" },
  { value: "5-10", label: "5–10" },
  { value: "10-20", label: "10–20" },
  { value: "20+", label: "20+" },
] as const satisfies ReadonlyArray<AuditOption<string>>;

export const doerOptions = [
  { value: "senior", label: "Owner or senior" },
  { value: "manager", label: "A manager" },
  { value: "admin", label: "Admin or junior" },
] as const satisfies ReadonlyArray<AuditOption<string>>;

export const systemOptions = [
  { value: "gmail", label: "Gmail / Google Workspace" },
  { value: "outlook", label: "Outlook / Microsoft 365" },
  { value: "crm", label: "A CRM" },
  { value: "accounts", label: "Xero, QuickBooks or similar" },
  { value: "spreadsheets", label: "Spreadsheets" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "paper", label: "Paper or whiteboards" },
  { value: "other", label: "Something else" },
] as const satisfies ReadonlyArray<AuditOption<string>>;

export type Area = (typeof areaOptions)[number]["value"];

export const areaDetailSchema = z.object({
  people: z.enum(values(peopleOptions)),
  hours: z.enum(values(hoursOptions)),
  doer: z.enum(values(doerOptions)),
});

export const answersSchema = z.object({
  role: z.enum(values(roleOptions)),
  teamSize: z.enum(values(teamSizeOptions)),
  direction: z.enum(values(directionOptions)),
  blockers: z.array(z.enum(values(blockerOptions))).min(1).max(2),
  doubled: z.enum(values(doubledOptions)),
  enquiryVolume: z.enum(values(enquiryVolumeOptions)),
  replySpeed: z.enum(values(replySpeedOptions)),
  areas: z.array(z.enum(values(areaOptions))).min(1).max(areaOptions.length),
  areaDetails: z.partialRecord(z.enum(values(areaOptions)), areaDetailSchema),
  systems: z.array(z.enum(values(systemOptions))).min(1).max(systemOptions.length),
  oneThing: z.string().trim().max(600).optional(),
});

export type AuditAnswers = z.infer<typeof answersSchema>;
export type AreaDetail = z.infer<typeof areaDetailSchema>;

/** Complete answers: every ticked area must have its detail filled in. */
export const completeAnswersSchema = answersSchema.superRefine((answers, ctx) => {
  for (const area of answers.areas) {
    if (!answers.areaDetails[area]) {
      ctx.addIssue({ code: "custom", path: ["areaDetails", area], message: "Missing detail" });
    }
  }
});

/** Drafts are saved on every step, so any subset of answers is valid. */
export const draftAnswersSchema = answersSchema.partial();

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.email().max(320),
  company: z.string().trim().min(1).max(200),
});

export type AuditContact = z.infer<typeof contactSchema>;
