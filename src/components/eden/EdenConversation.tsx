"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUp, Check, LoaderCircle, Mail, RotateCcw } from "lucide-react";
import { conversationView, topicLabels, type ConversationAction, type ConversationView } from "@/lib/eden/conversation-schema";

async function call(action: ConversationAction): Promise<unknown> {
  const response = await fetch("/api/eden/conversation", {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify(action), cache: "no-store",
  });
  if (!response.ok) throw new Error("unavailable");
  return response.json() as Promise<unknown>;
}
async function chat(action: ConversationAction): Promise<ConversationView> {
  return conversationView.parse(await call(action));
}
const secondary = "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-cyan/30 px-4 py-2 text-sm text-cyan transition hover:bg-cyan/10 active:scale-[0.98] disabled:opacity-50";
const primary = "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-cyan px-6 py-3 font-heading text-xs font-semibold uppercase tracking-[0.12em] text-void transition hover:brightness-110 active:scale-[0.98] disabled:opacity-50";
const field = "w-full rounded-lg border border-ghost/15 bg-void-light px-4 py-3 text-base text-ghost outline-none placeholder:text-ghost-dim focus:border-cyan/70 focus:ring-1 focus:ring-cyan/30 disabled:opacity-50";

export function EdenConversation() {
  const [view, setView] = useState<ConversationView | null>(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [emailOpen, setEmailOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const bootstrap = useRef<Promise<ConversationView> | null>(null);
  const transcript = useRef<HTMLDivElement>(null);
  const hasView = Boolean(view);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    let active = true;
    bootstrap.current ??= chat({ action: "open" });
    void bootstrap.current.then((saved) => { if (active) setView(saved); })
      .catch(() => { if (active) setError("I couldn't open your conversation. Please try again."); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const container = transcript.current;
    if (container) container.scrollTo({ top: container.scrollHeight,
      behavior: reducedMotion ? "instant" : "smooth" });
  }, [view?.messages.length, reducedMotion]);

  useEffect(() => {
    if (!busy || !hasView || codeSent) return;
    let active = true;
    const timer = setInterval(() => {
      void chat({ action: "get" }).then((saved) => {
        if (active) setView((current) => !current || saved.revision >= current.revision ? saved : current);
      }).catch(() => { /* The active request or retry control reports a failure. */ });
    }, 1800);
    return () => { active = false; clearInterval(timer); };
  }, [busy, hasView, codeSent]); // Saved state does not restart the polling clock.

  const perform = useCallback(async (action: ConversationAction) => {
    setBusy(true); setError(""); setNotice("");
    try {
      const saved = await chat(action);
      setView(saved);
      if (saved.retry_available) setNotice("Your message is saved. Try the reply again when you're ready.");
      return saved;
    } catch {
      setError("The connection was interrupted. Check your saved conversation and try again.");
      try { const saved = await chat({ action: "get" }); setView(saved); return saved; } catch { return null; }
    } finally { setBusy(false); }
  }, []);

  async function send() {
    if (!view || busy || view.pending || !text.trim()) return;
    const request = { action: "message" as const, request_id: crypto.randomUUID(),
      revision: view.revision, text: text.trim() };
    setText("");
    const saved = await perform(request);
    if (!saved?.messages.some((message) => message.id === request.request_id)) setText(request.text);
  }

  async function emailAction() {
    setBusy(true); setError(""); setNotice("");
    try {
      if (codeSent) {
        const saved = await chat({ action: "verify", email, code });
        setView(saved); setEmailOpen(false); setCode(""); setCodeSent(false);
        setNotice(saved.resumed ? "You're back in your saved conversation." : "Your progress is now linked to your email.");
      } else { await call({ action: "email", email }); setCodeSent(true); }
    } catch {
      setError(codeSent ? "That code couldn't be verified. Check it or request a new one." :
        "I couldn't send a code just now. Please check your email address and try again shortly.");
    } finally { setBusy(false); }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-32 sm:px-8 sm:pt-40">
      <motion.header initial={reducedMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="mb-8 max-w-3xl">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-cyan">Meet your onboarding agent</p>
        <h1 className="font-heading text-3xl font-semibold uppercase leading-[1.08] text-ghost sm:text-5xl">
          Find out what your Eden can do for you.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ghost-muted">
          Tell Eden Builder about your day, the work that piles up, and what you wish someone would take care of.
          Together, you&apos;ll shape your personal assistant.
        </p>
      </motion.header>

      <section aria-label="Your conversation with Eden Builder" className="overflow-hidden rounded-2xl border border-ghost/10 bg-void-light">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ghost/10 px-4 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan/25 font-heading text-lg text-cyan">E</span>
            <div>
              <p className="font-heading text-base font-medium text-ghost">Eden Builder</p>
              <p role="status" className="mt-0.5 text-xs text-ghost-muted">
                {!view ? "Opening your conversation" : busy ? (view.pending ? "Message saved. Thinking…" : "Saving…") :
                  view.pending ? "Message saved. Reply waiting." : view.confirmed ? "Setup confirmed" :
                    view.email_verified ? "Progress saved to your email" : "Progress saved for this visit"}
              </p>
            </div>
          </div>
          {view && !view.email_verified && <button type="button" onClick={() => setEmailOpen(!emailOpen)}
            className="flex min-h-11 items-center gap-2 text-sm text-cyan transition hover:text-ghost active:opacity-70">
            <Mail size={16} aria-hidden="true" /> Save and return later
          </button>}
        </div>

        {emailOpen && <form onSubmit={(event) => { event.preventDefault(); void emailAction(); }}
          className="border-b border-cyan/20 bg-surface px-4 py-6 sm:px-7">
          <h2 className="font-heading text-lg text-ghost">Pick up wherever you left off.</h2>
          <p className="mt-2 text-sm leading-relaxed">We&apos;ll send a sign-in code to your email. It lets you return to your conversation on any device.</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="flex-1 text-sm text-ghost">Email address
              <input className={`${field} mt-2`} type="email" autoComplete="email" required value={email}
                disabled={busy || codeSent} onChange={(event) => setEmail(event.target.value)} />
            </label>
            {codeSent && <label className="flex-1 text-sm text-ghost">Sign-in code
              <input className={`${field} mt-2`} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6,8}"
                required value={code} onChange={(event) => setCode(event.target.value)} maxLength={8} />
            </label>}
            <button className={primary} disabled={busy} type="submit">{codeSent ? "Verify email" : "Send code"}</button>
          </div>
          {codeSent && <p className="mt-3 text-sm">Check your inbox for your code. <button type="button" className="text-cyan underline underline-offset-4 hover:text-ghost"
            onClick={() => { setCodeSent(false); setCode(""); }} disabled={busy}>Use another email or resend</button></p>}
        </form>}

        <div ref={transcript} role="log" aria-label="Conversation" aria-live="polite"
          className="max-h-[60dvh] min-h-[280px] space-y-7 overflow-y-auto overscroll-contain px-4 py-7 sm:min-h-[330px] sm:px-7">
          {view?.messages.map((message) => (
            <div key={message.id} className={message.role === "user" ? "ml-auto max-w-[90%] sm:max-w-[78%]" : "max-w-[92%] sm:max-w-[85%]"}>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.15em] text-ghost-muted">
                {message.role === "user" ? "You" : "Eden Builder"}
              </p>
              <p className={`whitespace-pre-wrap break-words text-base leading-relaxed ${message.role === "user" ? "rounded-xl bg-surface-light px-4 py-3 text-ghost" : "text-ghost"}`}>{message.text}</p>
            </div>
          ))}
          {!view && !error && <LoaderCircle className="animate-spin text-cyan" aria-label="Opening conversation" size={22} />}
        </div>

        {(error || notice) && <div className="border-t border-ghost/10 px-4 py-4 sm:px-7">
          {error && <p role="alert" className="text-sm text-error">{error}</p>}
          {notice && <p role="status" className="text-sm text-ghost-muted">{notice}</p>}
          {!view && <button className={`${secondary} mt-3`} disabled={busy} onClick={() => void perform({ action: "open" })}>Try again</button>}
        </div>}

        {view?.pending && !busy && <div className="px-4 pb-5 sm:px-7">
          <button className={secondary} type="button" onClick={() => void perform({ action: "retry" })}>
            <RotateCcw size={16} aria-hidden="true" /> Continue with my saved message
          </button>
        </div>}

        {!view?.confirmed && <form className="border-t border-ghost/10 bg-surface p-4 sm:px-7 sm:py-5"
          onSubmit={(event) => { event.preventDefault(); void send(); }}>
          <label htmlFor="eden-message" className="sr-only">Your message to Eden Builder</label>
          <div className="flex items-end gap-3">
            <textarea id="eden-message" className={`${field} min-h-14 resize-none`} rows={2} maxLength={4096}
              placeholder="Tell me a little about your world…" value={text} disabled={!view || busy || view.pending}
              onChange={(event) => setText(event.target.value)} onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); void send(); }
              }} />
            <button type="submit" aria-label="Send message" disabled={!view || busy || view.pending || !text.trim()}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-cyan text-void transition hover:brightness-110 active:scale-95 disabled:opacity-40">
              {busy ? <LoaderCircle size={20} className="animate-spin" /> : <ArrowUp size={22} />}
            </button>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-ghost-muted">Your conversation is saved as you go and used to prepare your Eden. Keep passwords and sign-in codes in secure connection steps.</p>
        </form>}
      </section>

      {view?.ready && <section aria-label="Your Eden setup" className="mt-8 rounded-2xl border border-cyan/25 bg-surface px-5 py-7 sm:p-8">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-cyan">{view.confirmed ? "Ready for the next step" : "Your starting setup"}</p>
        <h2 className="mt-3 font-heading text-2xl font-semibold text-ghost">{view.confirmed ? "Your Eden starts here." : "Here is what we are putting together."}</h2>
        <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed">{view.summary}</p>
        <details className="mt-5 border-y border-ghost/10 py-4">
          <summary className="cursor-pointer text-sm text-cyan hover:text-ghost">Review what Eden has learned</summary>
          <dl className="mt-5 grid gap-5 sm:grid-cols-2">{view.facts.map((fact) => <div key={fact.topic}>
            <dt className="text-sm font-medium text-ghost">{topicLabels[fact.topic] ?? fact.topic}</dt>
            <dd className="mt-1 text-sm leading-relaxed">{fact.text}</dd>
          </div>)}</dl>
        </details>
        {view.confirmed ? <>
          <p className="mt-5 flex items-start gap-2 text-sm leading-relaxed text-ghost"><Check size={18} className="mt-0.5 shrink-0 text-cyan" />
            {view.created ? "Aygency is creating your Eden with this setup." : "Your setup is saved and ready for Aygency to create your Eden. You can return here with your email."}</p>
          {!view.created && <button className={`${secondary} mt-5`} disabled={busy} type="button" onClick={() => void perform({ action: "reopen", revision: view.revision })}>Change my setup</button>}
        </> : <>
          <p className="mt-5 text-sm leading-relaxed">Anything to change? Tell the Builder above. When it feels right, confirm your setup so Aygency can prepare your Eden.</p>
          <button className={`${primary} mt-5`} type="button" disabled={busy || view.pending} onClick={() => {
            if (!view.email_verified) { setEmailOpen(true); setNotice("Verify your email above to finish saving your setup."); }
            else void perform({ action: "confirm", revision: view.revision });
          }}>{view.email_verified ? "Confirm my setup" : "Verify email to finish"}</button>
        </>}
      </section>}
    </div>
  );
}
