import type { ConversationView } from "./conversation-schema";

// An exhausted plan or a failed provider sign-in will not clear on the customer's
// next click, so we never invite a retry that is certain to fail again.
const OUTAGE_REASONS = new Set(["usage_limit", "provider_auth"]);

function waitingOnASavedMessage(view: ConversationView): boolean {
  return Boolean(view.pending && view.retry_available);
}

export function retryIsWorthOffering(view: ConversationView): boolean {
  return !OUTAGE_REASONS.has(view.unavailable_reason ?? "unavailable");
}

export function savedMessageNotice(view: ConversationView): string {
  if (!waitingOnASavedMessage(view)) return "";
  if (!retryIsWorthOffering(view)) {
    return "Ava can't reply just now. Your message is saved, and your conversation will be waiting when you come back.";
  }
  return "Your message is saved. Try the reply again when you're ready.";
}
