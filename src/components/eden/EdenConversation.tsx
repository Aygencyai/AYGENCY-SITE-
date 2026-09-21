"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUp, Check, LoaderCircle, LogOut, RotateCcw } from "lucide-react";
import { conversationState, topicLabels, type ConversationAction, type ConversationState, type ConversationView } from "@/lib/eden/conversation-schema";
import { confirmedStateMessage, retryIsWorthOffering, savedMessageNotice } from "@/lib/eden/conversation-notice";

class SignInRequired extends Error {}

async function call(action: ConversationAction): Promise<unknown> {
  const response = await fetch("/api/eden/conversation", {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify(action), cache: "no-store",
  });
  if (response.status === 401) throw new SignInRequired();
  if (!response.ok) throw new Error("unavailable");
  return response.json() as Promise<unknown>;
}
async function chat(action: ConversationAction): Promise<ConversationState> {
  return conversationState.parse(await call(action));
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
  const [loaded, setLoaded] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const bootstrap = useRef<Promise<ConversationState> | null>(null);
  const epoch = useRef(0);
  const account = useRef<string | null>(null);
  const transcript = useRef<HTMLDivElement>(null);
  const emailForm = useRef<HTMLFormElement>(null);
  const emailInput = useRef<HTMLInputElement>(null);
  const codeInput = useRef<HTMLInputElement>(null);
  const hasView = Boolean(view);
  const accountEmail = view?.email;
  const waitingForReply = Boolean(view?.pending && !view.retry_available);
  const reducedMotion = useReducedMotion();
  const accept = useCallback((saved: ConversationState) => {
    const owner = saved.email_verified ? saved.email : null;
    if (account.current !== owner) {
      ++epoch.current;
      account.current = owner;
      setText(""); setBusy(false);
    }
    setLoaded(true);
    setView((current) => {
      if (!saved.email_verified) return null;
      if (current?.email === saved.email && (saved.revision < current.revision ||
        (saved.revision === current.revision && saved.updated_at < current.updated_at))) return current;
      // Polling has no provider/admission result. Keep the known outage for this
      // exact pending turn until a new attempt, a completed reply or a fresh visit.
      if (current?.email === saved.email && current.pending && saved.pending &&
        current.revision === saved.revision && current.unavailable_reason &&
        !saved.unavailable_reason) {
        return { ...saved, unavailable_reason: current.unavailable_reason };
      }
      return saved;
    });
  }, []);

  const signInAgain = useCallback(async () => {
    const generation = ++epoch.current;
    setView(null); setText(""); setCode(""); setCodeSent(false); setEmail("");
    setLoaded(false); setBusy(false); setError(""); setNotice("Please sign in to return to your saved conversation.");
    try {
      const saved = await chat({ action: "open" });
      if (epoch.current === generation) accept(saved);
    } catch { if (epoch.current === generation) setError("I couldn't open sign-in. Please try again."); }
  }, [accept]);

  useEffect(() => {
    let active = true;
    bootstrap.current ??= chat({ action: "open" });
    void bootstrap.current.then((saved) => { if (active) accept(saved); })
      .catch((failure: unknown) => {
        if (!active) return;
        if (failure instanceof SignInRequired) void signInAgain();
        else setError("I couldn't open sign-in. Please try again.");
      });
    return () => { active = false; };
  }, [accept, signInAgain]);

  useEffect(() => {
    if (loaded && !hasView) {
      (codeSent ? codeInput : emailInput).current?.focus({ preventScroll: true });
      if (codeSent) emailForm.current?.scrollIntoView({ block: "center", behavior: reducedMotion ? "instant" : "smooth" });
    }
  }, [loaded, hasView, codeSent, reducedMotion]);

  useEffect(() => {
    const container = transcript.current;
    if (container) container.scrollTo({ top: container.scrollHeight,
      behavior: reducedMotion ? "instant" : "smooth" });
  }, [view?.messages.length, reducedMotion]);

  useEffect(() => {
    if (!hasView) return;
    let active = true;
    const generation = epoch.current;
    let reading = false;
    const refresh = async () => {
      if (reading || document.visibilityState === "hidden") return;
      reading = true;
      try {
        const saved = await chat({ action: "get" });
        if (active && epoch.current === generation) accept(saved);
      } catch (failure) {
        if (active && epoch.current === generation && failure instanceof SignInRequired) void signInAgain();
      } finally { reading = false; }
    };
    // Both devices follow the same saved history, including confirmation elsewhere.
    const timer = setInterval(() => void refresh(), busy || waitingForReply ? 1800 : 5000);
    window.addEventListener("focus", refresh);
    window.addEventListener("pageshow", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      active = false; clearInterval(timer);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("pageshow", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [busy, waitingForReply, hasView, accountEmail, accept, signInAgain]);

  const perform = useCallback(async (action: ConversationAction) => {
    const generation = epoch.current;
    setBusy(true); setError(""); setNotice("");
    try {
      const saved = await chat(action);
      if (generation !== epoch.current) return null;
      accept(saved);
      if (saved.email_verified) setNotice(savedMessageNotice(saved));
      return saved.email_verified ? saved : null;
    } catch (failure) {
      if (generation !== epoch.current) return null;
      if (failure instanceof SignInRequired) { await signInAgain(); return null; }
      setError("The connection was interrupted. Check your saved conversation and try again.");
      try {
        const saved = await chat({ action: "get" });
        if (generation === epoch.current) { accept(saved); return saved.email_verified ? saved : null; }
      } catch { /* The saved-message retry remains available after a connection failure. */ }
      return null;
    } finally { if (generation === epoch.current) setBusy(false); }
  }, [accept, signInAgain]);

  async function signOut() {
    const generation = ++epoch.current;
    setView(null); setText(""); setCode(""); setEmail(""); setCodeSent(false);
    setLoaded(false); setSigningOut(true); setBusy(true); setError(""); setNotice("");
    try {
      try { await chat({ action: "logout" }); }
      catch (failure) { if (!(failure instanceof SignInRequired)) throw failure; }
      const saved = await chat({ action: "open" });
      if (generation === epoch.current) { accept(saved); setSigningOut(false); setNotice("You're signed out. Your progress is saved to your email."); }
    } catch { if (generation === epoch.current) setError("Sign-out couldn't be completed. Please try again."); }
    finally { if (generation === epoch.current) setBusy(false); }
  }

  async function send() {
    if (!view || busy || view.pending || !text.trim()) return;
    const request = { action: "message" as const, request_id: crypto.randomUUID(),
      revision: view.revision, text: text.trim() };
    setText("");
    const generation = epoch.current;
    const saved = await perform(request);
    if (generation !== epoch.current) return;
    if (!saved?.messages.some((message) => message.id === request.request_id)) setText(request.text);
  }

  async function emailAction() {
    const generation = epoch.current;
    setBusy(true); setError(""); setNotice("");
    try {
      if (codeSent) {
        const saved = await chat({ action: "verify", email, code });
        if (generation !== epoch.current || !saved.email_verified) return;
        accept(saved); setCode(""); setCodeSent(false);
        setNotice(saved.resumed ? "You're back in your saved conversation." : "You’re signed in. Your conversation will be saved as you go.");
      } else { await call({ action: "email", email }); if (generation === epoch.current) setCodeSent(true); }
    } catch (failure) {
      if (generation !== epoch.current) return;
      if (failure instanceof SignInRequired) { await signInAgain(); setBusy(false); return; }
      setError(codeSent ? "That code couldn't be verified. Check it or request a new one." :
        "I couldn't send a code just now. Please check your email address and try again shortly.");
    } finally { if (generation === epoch.current) setBusy(false); }
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
          Tell Ava about your day, the work that piles up, and what you wish someone would take care of.
          Together, you&apos;ll shape your personal assistant.
        </p>
      </motion.header>

      <section aria-label="Your conversation with Ava" className="overflow-hidden rounded-2xl border border-ghost/10 bg-void-light">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ghost/10 px-4 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan/25 font-heading text-lg text-cyan">A</span>
            <div>
              <p className="font-heading text-base font-medium text-ghost">Ava</p>
              <p role="status" className="mt-0.5 text-xs text-ghost-muted">
                {!view ? (loaded ? "Your personal onboarding conversation" : "Opening sign-in") : busy ? (view.pending ? "Message saved. Thinking…" : "Saving…") :
                  view.pending ? (waitingForReply ? "Message saved. Thinking…" : "Message saved. Reply waiting.") : view.confirmed ? "Setup confirmed" :
                    "Progress saved to your email"}
              </p>
            </div>
          </div>
          {view && <div className="flex min-w-0 max-w-full flex-wrap items-center gap-3">
            <p className="break-all text-xs text-ghost-muted">Signed in as {view.email}</p>
            <button type="button" onClick={() => void signOut()} className="flex min-h-11 items-center gap-2 text-sm text-cyan transition hover:text-ghost active:opacity-70">
              <LogOut size={16} aria-hidden="true" /> Sign out
            </button>
          </div>}
        </div>

        {!view && loaded && <form ref={emailForm} onSubmit={(event) => { event.preventDefault(); void emailAction(); }}
          className="bg-surface px-4 py-7 sm:px-7">
          <h2 className="font-heading text-xl text-ghost">Sign in to meet Ava.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ghost-muted">Use your email to start your own conversation. If you&apos;ve been here before, we&apos;ll pick up where you left off, on any device.</p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end">
            <label className="min-w-0 flex-1 text-sm text-ghost">Email address
              <input ref={emailInput} className={`${field} mt-2`} type="email" autoComplete="email" required value={email}
                disabled={busy || codeSent} onChange={(event) => setEmail(event.target.value)} />
            </label>
            {codeSent && <label className="min-w-0 flex-1 text-sm text-ghost">Sign-in code
              <input ref={codeInput} className={`${field} mt-2`} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6,8}"
                required value={code} onChange={(event) => setCode(event.target.value)} maxLength={8} disabled={busy} />
            </label>}
            <button className={`${primary} shrink-0`} disabled={busy} type="submit">{codeSent ? "Verify email" : "Send code"}</button>
          </div>
          {codeSent && <p className="mt-4 text-sm">Check your inbox for your code. <button type="button" className="text-cyan underline underline-offset-4 hover:text-ghost"
            onClick={() => { setCodeSent(false); setCode(""); }} disabled={busy}>Use another email or resend</button></p>}
          <p className="mt-5 text-xs leading-relaxed text-ghost-muted">Your answers are saved to your account and used by Aygency to prepare your Eden.</p>
        </form>}
        {!view && !loaded && !error && <div className="p-7"><LoaderCircle className="animate-spin text-cyan" aria-label="Opening sign-in" size={22} /></div>}

        {view && <div ref={transcript} role="log" aria-label="Conversation" aria-live="polite"
          className="max-h-[60dvh] min-h-[280px] space-y-7 overflow-y-auto overscroll-contain px-4 py-7 sm:min-h-[330px] sm:px-7">
          {view?.messages.map((message) => (
            <div key={message.id} className={message.role === "user" ? "ml-auto max-w-[90%] sm:max-w-[78%]" : "max-w-[92%] sm:max-w-[85%]"}>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.15em] text-ghost-muted">
                {message.role === "user" ? "You" : "Ava"}
              </p>
              <p className={`whitespace-pre-wrap break-words text-base leading-relaxed ${message.role === "user" ? "rounded-xl bg-surface-light px-4 py-3 text-ghost" : "text-ghost"}`}>{message.text}</p>
            </div>
          ))}
        </div>}

        {(error || notice) && <div className="border-t border-ghost/10 px-4 py-4 sm:px-7">
          {error && <p role="alert" className="text-sm text-error">{error}</p>}
          {notice && <p role="status" className="text-sm text-ghost-muted">{notice}</p>}
          {!view && error && <button className={`${secondary} mt-3`} disabled={busy} onClick={() => void (signingOut ? signOut() : signInAgain())}>Try again</button>}
        </div>}

        {view?.pending && !busy && retryIsWorthOffering(view) && <div className="px-4 pb-5 sm:px-7">
          <button className={secondary} type="button" onClick={() => void perform({ action: "retry" })}>
            <RotateCcw size={16} aria-hidden="true" /> Continue with my saved message
          </button>
        </div>}

        {view && !view.confirmed && <form className="border-t border-ghost/10 bg-surface p-4 sm:px-7 sm:py-5"
          onSubmit={(event) => { event.preventDefault(); void send(); }}>
          <label htmlFor="eden-message" className="sr-only">Your message to Ava</label>
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
            {confirmedStateMessage(view)}</p>
          {!view.created && <button className={`${secondary} mt-5`} disabled={busy} type="button" onClick={() => void perform({ action: "reopen", revision: view.revision })}>Change my setup</button>}
        </> : <>
          <p className="mt-5 text-sm leading-relaxed">Anything to change? Tell Ava above. When it feels right, confirm your setup so Aygency can prepare your Eden.</p>
          <button className={`${primary} mt-5`} type="button" disabled={busy || view.pending} onClick={() => {
            void perform({ action: "confirm", revision: view.revision });
          }}>Confirm my setup</button>
        </>}
      </section>}
    </div>
  );
}
