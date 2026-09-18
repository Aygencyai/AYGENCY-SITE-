import { z } from "zod";

export const conversationView = z.object({
  revision: z.number().int().positive(),
  messages: z.array(z.object({
    id: z.string().uuid(), role: z.enum(["user", "assistant"]),
    text: z.string().min(1).max(4096), created_at: z.string(),
  }).strict()).max(97),
  facts: z.array(z.object({ topic: z.string().max(40), text: z.string().max(320) }).strict()).max(19),
  summary: z.string().max(1800), ready: z.boolean(), email_verified: z.literal(true),
  email: z.string().email().max(254),
  pending: z.boolean(), confirmed: z.boolean(), created: z.boolean(), updated_at: z.string(),
  resumed: z.boolean().optional(), retry_available: z.boolean().optional(),
  // Fixed vocabulary from the Builder. Never provider prose.
  unavailable_reason: z.enum(["unavailable", "usage_limit", "provider_auth"]).optional(),
}).strict();

export const conversationState = z.union([
  conversationView,
  z.object({ email_verified: z.literal(false) }).strict(),
]);
export type ConversationState = z.infer<typeof conversationState>;

export const conversationAction = z.discriminatedUnion("action", [
  z.object({ action: z.enum(["open", "get", "retry", "logout"]) }).strict(),
  z.object({ action: z.literal("message"), request_id: z.string().uuid(),
    revision: z.number().int().positive(), text: z.string().trim().min(1).max(4096) }).strict(),
  z.object({ action: z.literal("email"), email: z.string().trim().email().max(254) }).strict(),
  z.object({ action: z.literal("verify"), email: z.string().trim().email().max(254),
    code: z.string().regex(/^[0-9]{6,8}$/) }).strict(),
  z.object({ action: z.enum(["confirm", "reopen"]), revision: z.number().int().positive() }).strict(),
]);

export type ConversationView = z.infer<typeof conversationView>;
export type ConversationAction = z.infer<typeof conversationAction>;

export const topicLabels: Record<string, string> = {
  about: "About you", businesses: "Your responsibilities", operations: "How work moves",
  people: "People", systems: "Tools and information", locations: "Where you work",
  "location-constraints": "Hours and timezone", assistance: "Where Eden helps",
  "recurring-jobs": "Routines", "contact-urgency": "Updates and urgent items",
  communication: "How you like updates", voice: "Your style", "hard-limits": "Your boundaries",
  escalation: "When something is unclear", goal: "Your first useful result",
  "money-authority": "Spending preferences", "sending-authority": "Sending preferences",
  "diary-authority": "Calendar preferences", "contact-authority": "Contact preferences",
};
