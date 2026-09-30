import { z } from "zod";

/**
 * The AI Growth Audit question set. This file is the single source of truth:
 * the funnel renders from it, the API validates against it, and every stored
 * row carries QUESTION_SET_VERSION so old answers stay readable after edits.
 * Bump the version whenever an option value is added, removed or renamed.
 *
 * Every business gets the same questions. A "pack" swaps the wording and the
 * task/role/tool lists so a construction firm and a clinic each see their own
 * world. The pack is set on the invite; public visitors get "general".
 */
export const QUESTION_SET_VERSION = "growth-audit.v2" as const;

export interface AuditOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

export const PACKS = ["general", "construction"] as const;
export type Pack = (typeof PACKS)[number];

/** A repetitive task, and the agent in The Aygency System that would take it on. */
export interface TaskOption extends AuditOption<string> {
  agent: string;
}

interface PackDefinition {
  jobWord: string;
  scaleLive: { title: string; options: ReadonlyArray<AuditOption<string>> };
  scaleSize: { title: string; description: string; options: ReadonlyArray<AuditOption<string>> };
  tasks: ReadonlyArray<TaskOption>;
  roles: ReadonlyArray<AuditOption<string>>;
  retyping: ReadonlyArray<AuditOption<string>>;
  tools: ReadonlyArray<AuditOption<string>>;
}

const commonTools = [
  { value: "google", label: "Gmail / Google Workspace" },
  { value: "microsoft", label: "Outlook / Microsoft 365" },
  { value: "excel", label: "Excel or Google Sheets" },
  { value: "xero", label: "Xero" },
  { value: "sage", label: "Sage" },
  { value: "quickbooks", label: "QuickBooks" },
  { value: "whatsapp", label: "WhatsApp groups" },
  { value: "files", label: "Dropbox, SharePoint or Google Drive" },
] as const;

export const packs: Record<Pack, PackDefinition> = {
  general: {
    jobWord: "job",
    scaleLive: {
      title: "How many customers or jobs does the business handle in a typical week?",
      options: [
        { value: "under_10", label: "Under 10" },
        { value: "10-50", label: "10 to 50" },
        { value: "50-200", label: "50 to 200" },
        { value: "200+", label: "More than 200" },
      ],
    },
    scaleSize: {
      title: "How big is the team?",
      description: "Everyone who works in the business, you included.",
      options: [
        { value: "1-5", label: "1 to 5 people" },
        { value: "6-15", label: "6 to 15 people" },
        { value: "16-50", label: "16 to 50 people" },
        { value: "50+", label: "More than 50" },
      ],
    },
    tasks: [
      { value: "enquiries", label: "Answering enquiries, calls and messages", agent: "Front Desk" },
      { value: "bookings", label: "Booking, rescheduling and reminders", agent: "Front Desk" },
      { value: "quotes", label: "Writing quotes and proposals", agent: "Operations" },
      { value: "follow_up", label: "Following up quotes and enquiries", agent: "Outreach" },
      { value: "data_entry", label: "Copying information between systems", agent: "Operations" },
      { value: "invoicing", label: "Invoicing and chasing payments", agent: "Operations" },
      { value: "reporting", label: "Pulling together reports and numbers", agent: "Analyst" },
      { value: "customer_updates", label: "Keeping customers updated", agent: "Front Desk" },
      { value: "scheduling_staff", label: "Rotas and scheduling the team", agent: "Coordinator" },
      { value: "content", label: "Social posts, newsletters and marketing", agent: "Producer" },
      { value: "internal_chasing", label: "Chasing people internally", agent: "Coordinator" },
    ],
    roles: [
      { value: "owner", label: "Owner or director" },
      { value: "manager", label: "A manager" },
      { value: "admin", label: "Admin or office" },
      { value: "customer_facing", label: "Sales or customer-facing" },
      { value: "specialist", label: "Specialist or technical staff" },
    ],
    retyping: [
      { value: "enquiry_to_system", label: "Enquiries into our system or diary" },
      { value: "quote_to_invoice", label: "Quotes into invoices" },
      { value: "invoice_to_accounts", label: "Invoices into accounts" },
      { value: "notes_to_reports", label: "Notes into reports" },
      { value: "spreadsheet_to_spreadsheet", label: "Between spreadsheets" },
      { value: "email_to_system", label: "Emails into a system" },
      { value: "none", label: "None of these" },
    ],
    tools: [...commonTools, { value: "industry", label: "Software made for our industry" }, { value: "other", label: "Something else" }],
  },
  construction: {
    jobWord: "project",
    scaleLive: {
      title: "How many projects do you have live at once?",
      options: [
        { value: "1-3", label: "1 to 3" },
        { value: "4-6", label: "4 to 6" },
        { value: "7-10", label: "7 to 10" },
        { value: "10+", label: "More than 10" },
      ],
    },
    scaleSize: {
      title: "What's a typical project worth?",
      description: "Contract value, roughly.",
      options: [
        { value: "under_1m", label: "Under £1m" },
        { value: "1-5m", label: "£1m to £5m" },
        { value: "5-10m", label: "£5m to £10m" },
        { value: "10m+", label: "More than £10m" },
      ],
    },
    tasks: [
      { value: "tender_pricing", label: "Pricing tenders from drawings and specs", agent: "Analyst" },
      { value: "quote_levelling", label: "Getting and levelling trade quotes", agent: "Operations" },
      { value: "procurement", label: "Chasing suppliers and lead times", agent: "Operations" },
      { value: "site_reports", label: "Site diaries and weekly client reports", agent: "Coordinator" },
      { value: "drawings_rfis", label: "Drawing revisions and RFIs", agent: "Coordinator" },
      { value: "variations", label: "Capturing and pricing variations", agent: "Analyst" },
      { value: "valuations", label: "Valuations and subcontractor payments", agent: "Analyst" },
      { value: "compliance", label: "RAMS, insurances and site paperwork", agent: "Operations" },
      { value: "handover", label: "O&M manuals and handover packs", agent: "Operations" },
      { value: "aftercare", label: "Aftercare and client requests", agent: "Front Desk" },
      { value: "timesheets_invoices", label: "Timesheets and matching invoices", agent: "Operations" },
    ],
    roles: [
      { value: "director", label: "A director" },
      { value: "qs", label: "QS or estimator" },
      { value: "pm", label: "Project manager" },
      { value: "site_manager", label: "Site manager" },
      { value: "office", label: "Office or admin" },
    ],
    retyping: [
      { value: "quotes_to_cost_plan", label: "Quotes into the cost plan" },
      { value: "whatsapp_to_diary", label: "WhatsApp into site diaries" },
      { value: "diaries_to_reports", label: "Diaries into client reports" },
      { value: "variations_to_excel", label: "Variations into the spreadsheet" },
      { value: "cost_plan_to_valuations", label: "Cost plan into valuations" },
      { value: "invoices_to_accounts", label: "Invoices into accounts" },
      { value: "none", label: "None of these" },
    ],
    tools: [
      ...commonTools,
      { value: "estimating", label: "Estimating software" },
      { value: "project_software", label: "Project software (Procore or similar)" },
      { value: "architect_platform", label: "The architect's platform (e.g. Asite)" },
      { value: "other", label: "Something else" },
    ],
  },
};

export const peopleOptions = [
  { value: "1", label: "1" },
  { value: "2-3", label: "2–3" },
  { value: "4-10", label: "4–10" },
  { value: "10+", label: "10+" },
] as const satisfies ReadonlyArray<AuditOption<string>>;

export const frequencyOptions = [
  { value: "daily", label: "Every day" },
  { value: "weekly", label: "Every week" },
  { value: "monthly", label: "Every month" },
  { value: "per_job", label: "Once per job" },
] as const satisfies ReadonlyArray<AuditOption<string>>;

export const durationOptions = [
  { value: "under_30m", label: "Under 30 min" },
  { value: "30m-2h", label: "30 min – 2 hrs" },
  { value: "2-4h", label: "2–4 hrs" },
  { value: "day", label: "About a day" },
  { value: "days", label: "Several days" },
] as const satisfies ReadonlyArray<AuditOption<string>>;

export const channelOptions = [
  { value: "email", label: "Email" },
  { value: "whatsapp", label: "WhatsApp or text" },
  { value: "phone", label: "Phone calls" },
  { value: "meetings", label: "Meetings or site walks" },
  { value: "app", label: "An app or software" },
  { value: "paper", label: "Paper" },
] as const satisfies ReadonlyArray<AuditOption<string>>;

export const crmOptions = [
  { value: "none", label: "No, it's in email and our heads" },
  { value: "spreadsheet", label: "A spreadsheet" },
  { value: "hubspot", label: "HubSpot" },
  { value: "salesforce", label: "Salesforce" },
  { value: "pipedrive", label: "Pipedrive" },
  { value: "other", label: "Another CRM" },
] as const satisfies ReadonlyArray<AuditOption<string>>;

export const aiUseOptions = [
  { value: "none", label: "Not yet" },
  { value: "individuals", label: "A few people use ChatGPT or similar" },
  { value: "automations", label: "We've built some automations" },
  { value: "embedded", label: "It's part of how we work" },
] as const satisfies ReadonlyArray<AuditOption<string>>;

export const limitOptions = [
  { value: "no_client_contact", label: "Never talks to our clients" },
  { value: "no_money", label: "Never touches costs or payments" },
  { value: "human_approves", label: "A person approves before anything goes out" },
  { value: "data_in_uk", label: "Our data stays in the UK" },
  { value: "none", label: "No hard limits" },
] as const satisfies ReadonlyArray<AuditOption<string>>;

function enumOf<T extends string>(options: ReadonlyArray<AuditOption<T>>) {
  return z.enum(options.map((o) => o.value) as [T, ...T[]]);
}

const optionKey = z.string().regex(/^[a-z0-9_+-]{1,40}$/);

export const taskDetailSchema = z.object({
  people: enumOf(peopleOptions),
  who: optionKey,
  frequency: enumOf(frequencyOptions),
  duration: enumOf(durationOptions),
});

export const answersSchema = z.object({
  scaleLive: optionKey,
  scaleSize: optionKey,
  tasks: z.array(optionKey).min(1).max(20),
  taskDetails: z.record(optionKey, taskDetailSchema),
  retyping: z.array(optionKey).min(1).max(20),
  channels: z.array(enumOf(channelOptions)).min(1),
  crm: enumOf(crmOptions),
  tools: z.array(optionKey).min(1).max(20),
  aiUse: enumOf(aiUseOptions),
  aiWhere: z.array(optionKey).max(20).optional(),
  limits: z.array(enumOf(limitOptions)).min(1),
  goneTomorrow: optionKey,
  wastesTime: z.string().trim().max(600).optional(),
});

export type AuditAnswers = z.infer<typeof answersSchema>;
export type TaskDetail = z.infer<typeof taskDetailSchema>;

function values(options: ReadonlyArray<AuditOption<string>>) {
  return new Set(options.map((o) => o.value));
}

/** Complete answers: every pack-specific value is in its pack, every ticked task has detail. */
export function completeAnswersSchema(pack: Pack) {
  const p = packs[pack];
  const tasks = values(p.tasks);
  return answersSchema.superRefine((a, ctx) => {
    const bad = (path: (string | number)[]) => ctx.addIssue({ code: "custom", path, message: "Invalid option" });
    if (!values(p.scaleLive.options).has(a.scaleLive)) bad(["scaleLive"]);
    if (!values(p.scaleSize.options).has(a.scaleSize)) bad(["scaleSize"]);
    a.tasks.forEach((t, i) => !tasks.has(t) && bad(["tasks", i]));
    a.retyping.forEach((r, i) => !values(p.retyping).has(r) && bad(["retyping", i]));
    a.tools.forEach((t, i) => !values(p.tools).has(t) && bad(["tools", i]));
    (a.aiWhere ?? []).forEach((t, i) => !tasks.has(t) && t !== "other" && bad(["aiWhere", i]));
    if (!a.tasks.includes(a.goneTomorrow)) bad(["goneTomorrow"]);
    for (const task of a.tasks) {
      const detail = a.taskDetails[task];
      if (!detail) bad(["taskDetails", task]);
      else if (!values(p.roles).has(detail.who)) bad(["taskDetails", task, "who"]);
    }
  });
}

/** Drafts are saved on every step, so any subset of answers is valid. */
export const draftAnswersSchema = answersSchema.partial().extend({
  taskDetails: z.record(optionKey, taskDetailSchema.partial()).optional(),
});

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.email().max(320),
  company: z.string().trim().min(1).max(200),
});

export type AuditContact = z.infer<typeof contactSchema>;
