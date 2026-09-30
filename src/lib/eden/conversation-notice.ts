import type { ConversationView } from "./conversation-schema";

// An exhausted plan or a failed provider sign-in will not clear on the customer's
// next click, so we never invite a retry that is certain to fail again.
const OUTAGE_REASONS = new Set(["usage_limit", "provider_auth", "rate_limit"]);

function waitingOnASavedMessage(view: ConversationView): boolean {
  return Boolean(view.pending && view.retry_available);
}

export function retryIsWorthOffering(view: ConversationView): boolean {
  return !OUTAGE_REASONS.has(view.unavailable_reason ?? "unavailable");
}

export function savedMessageNotice(view: ConversationView): string {
  if (!waitingOnASavedMessage(view)) return "";
  if (view.unavailable_reason === "rate_limit") {
    return "Your message is saved. Ava has reached her conversation limit for now. Please come back later to continue.";
  }
  if (!retryIsWorthOffering(view)) {
    return "Ava can't reply just now. Your message is saved, and your conversation will be waiting when you come back.";
  }
  return "Your message is saved. Try the reply again when you're ready.";
}

// What happens after a customer confirms. The funnel is lead capture: a person
// reads the setup and speaks to the customer before any Eden is built, so the
// confirmed state has to set that expectation rather than imply an automatic
// handover. Once the build has actually been started, stop promising contact.
export function confirmedStateMessage(view: ConversationView): string {
  if (view.created) {
    return "We're building your Eden with this setup.";
  }
  return "Your setup is saved. We'll be in touch by email to talk it through, and your Eden gets built once the plan is right. You can come back to this page any time with your email.";
}
