import { createEdenApplicationsPostHandler } from "@/lib/eden/application-handler";

export const runtime = "nodejs";
export const POST = createEdenApplicationsPostHandler();
