import { createConversationHandler } from "@/lib/eden/conversation-handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
export const POST = createConversationHandler();
