"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { LockKeyhole } from "lucide-react";
import { z } from "zod";

const link = z.object({
  connection_ref: z.string().regex(/^eden-connection-[a-f0-9]{24}$/),
  link_id: z.string().regex(/^connect-[a-f0-9]{24}$/),
});
type Link = z.infer<typeof link>;
type Stage = "opening" | "signin" | "ready" | "checking" | "pending" | "active" | "missing" | "error";
const button = "inline-flex items-center justify-center rounded-lg bg-cyan px-8 py-3 font-heading text-[13px] font-semibold uppercase tracking-[0.15em] text-void transition hover:brightness-110 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan disabled:cursor-wait disabled:opacity-50";
const field = "mt-2 w-full rounded-lg border border-ghost/20 bg-void px-4 py-3 text-ghost outline-none transition focus:border-cyan";

async function call(url: string, data: object): Promise<unknown> {
  const response = await fetch(url, { method: "POST", credentials: "same-origin",
    headers: { "content-type": "application/json" }, body: JSON.stringify(data), cache: "no-store" });
  if (!response.ok) throw new Error("Connection unavailable");
  return response.json() as Promise<unknown>;
}

export function EdenOutlookConnection() {
  const [stage, setStage] = useState<Stage>("opening");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const started = useRef(false);
  const selected = useRef<Link | null>(null);
  const callback = useRef<string | null>(null);

  async function complete() {
    if (!callback.current) return;
    setStage("checking");
    try {
      const result = z.object({ status: z.enum(["active", "pending", "expired", "needs-attention", "disconnected"]) })
        .parse(await call("/api/eden/connections", { action: "complete", session_uri: callback.current }));
      setStage(result.status === "active" ? "active" : result.status === "pending" ? "pending" : "error");
      if (result.status === "active") callback.current = null;
    } catch { setStage("error"); }
  }

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const query = new URLSearchParams(window.location.search);
    window.history.replaceState(null, "", window.location.pathname);
    const uri = query.get("session_uri");
    if (uri && query.getAll("session_uri").length === 1 && [...query.keys()].length === 1 && uri.length >= 16 && uri.length <= 8192) {
      callback.current = uri;
    } else {
      const parsed = link.safeParse({ connection_ref: hash.get("connection"), link_id: hash.get("link") });
      if (!parsed.success || query.size > 0) { setStage("missing"); return; }
      selected.current = parsed.data;
    }
    void call("/api/eden/conversation", { action: "open" }).then(async (raw) => {
      const state = z.object({ authenticated: z.boolean() }).parse(raw);
      if (!state.authenticated) setStage("signin");
      else if (callback.current) await complete();
      else setStage("ready");
    }).catch(() => setStage("error"));
  }, []);

  async function signin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError("");
    try {
      const state = z.object({ authenticated: z.literal(true) }).parse(await call("/api/eden/conversation",
        { action: "signin", email, password }));
      setPassword("");
      if (state.authenticated && callback.current) await complete();
      else setStage("ready");
    } catch { setError("Check your email and password, then try again."); }
    finally { setBusy(false); }
  }

  async function connect() {
    if (!selected.current || busy) return;
    setBusy(true); setError("");
    try {
      const result = z.object({ url: z.string().url() }).parse(await call("/api/eden/connections",
        { action: "start", ...selected.current }));
      const url = new URL(result.url);
      if (url.protocol !== "https:" || url.host !== "connect.composio.dev" || url.username || url.password ||
        !url.pathname.startsWith("/link/")) throw new Error();
      window.location.assign(result.url);
    } catch { setStage("error"); setBusy(false); }
  }

  const title: Record<Stage, string> = {
    opening: "Opening your connection", signin: "Sign in to your Eden account", ready: "Connect Outlook",
    checking: "Checking your connection", pending: "Microsoft sign-in is still processing",
    active: "Outlook is connected", missing: "Open the link from Eden", error: "We couldn’t verify this connection",
  };
  const description: Record<Stage, string> = {
    opening: "We’re checking your account.", signin: "Use the account you created with Ava to continue.",
    ready: "Let Eden read your email and calendar to help with your day. Continue to Microsoft to choose your account and review access.",
    checking: "We’re checking the account and read access before Eden uses this connection.",
    pending: "You can check again in a moment. Eden will use Outlook once the account and access checks have finished.",
    active: "Your email and calendar passed the read-access checks. Return to your Eden chat to continue.",
    missing: "Ask Eden to connect Outlook, then open the personal link in your chat.",
    error: "Return to the Outlook link in your Eden chat and use the Eden account you signed up with. If the problem continues, contact build@aygency.ai.",
  };
  return <section className="mx-auto min-h-[75vh] max-w-5xl px-6 pb-24 pt-36 sm:px-10 sm:pt-44">
    <motion.div className="max-w-2xl" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
      <p className="mb-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-cyan"><LockKeyhole size={16} aria-hidden />Your personal Eden</p>
      <h1 className="mb-6 font-heading text-4xl font-semibold uppercase leading-[1.1] text-ghost sm:text-5xl">{title[stage]}</h1>
      <div aria-live="polite" aria-busy={stage === "opening" || stage === "checking"}>
        <p className="max-w-xl text-base leading-relaxed text-ghost-muted sm:text-lg">{description[stage]}</p>
      </div>
      {stage === "signin" && <form className="mt-8 max-w-md space-y-5" onSubmit={(event) => void signin(event)}>
        <label className="block text-sm text-ghost-muted">Email address<input className={field} type="email" autoComplete="username" required value={email} maxLength={254} onChange={(event) => setEmail(event.target.value)} /></label>
        <label className="block text-sm text-ghost-muted">Password<input className={field} type="password" autoComplete="current-password" required value={password} maxLength={256} onChange={(event) => setPassword(event.target.value)} /></label>
        <button className={button} disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
        {error && <p role="alert" className="text-sm text-error">{error}</p>}
      </form>}
      {stage === "ready" && <button className={`${button} mt-8`} disabled={busy} onClick={() => void connect()}>{busy ? "Opening Microsoft…" : "Continue to Microsoft"}</button>}
      {stage === "pending" && <button className={`${button} mt-8`} onClick={() => void complete()}>Check connection</button>}
      {stage === "error" && <button className={`${button} mt-8`} onClick={() => { setPassword(""); setStage("signin"); }}>Use my Eden account</button>}
    </motion.div>
  </section>;
}
