import { createAccountHandler } from "@/lib/eden/account-handler";

export const runtime = "nodejs";
export const POST = createAccountHandler("verify");
