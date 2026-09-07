"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";

type Stage =
  | "opening"
  | "email"
  | "telegram"
  | "connected"
  | "missing"
  | "error";
type Attempt = {
  action: "open" | "verify";
  connection_ref: string;
  request_id: string;
  token: string;
};
const connectionPattern = /^eden-connection-[a-f0-9]{24}$/;
const button =
  "inline-flex items-center justify-center gap-3 rounded-lg bg-cyan px-8 py-3 font-heading text-[13px] font-semibold uppercase tracking-[0.15em] text-void transition hover:brightness-110 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan";

export function EdenConnection() {
  const [stage, setStage] = useState<Stage>("opening");
  const [telegram, setTelegram] = useState("");
  const started = useRef(false);
  const pending = useRef<Attempt | null>(null);
  const running = useRef(false);

  async function submit(attempt: Attempt) {
    if (running.current) return;
    running.current = true;
    setStage("opening");
    try {
      const response = await fetch(`/api/eden/account/${attempt.action}`, {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          connection_ref: attempt.connection_ref,
          request_id: attempt.request_id,
          [attempt.action === "open" ? "opaque_state" : "access_token"]:
            attempt.token,
        }),
        signal: AbortSignal.timeout(20_000),
      });
      if (!response.ok) throw new Error();
      const result: unknown = await response.json();
      if (!result || typeof result !== "object" || !("status" in result)) {
        throw new Error();
      }
      if (result.status === "email_verification_required") setStage("email");
      else if (result.status === "connected") setStage("connected");
      else if (
        result.status === "connect_telegram" && "deep_link" in result &&
        typeof result.deep_link === "string" &&
        /^https:\/\/t\.me\/[A-Za-z][A-Za-z0-9_]{1,28}[Bb][Oo][Tt]\?start=[A-Za-z0-9_-]{43,64}$/
          .test(result.deep_link)
      ) {
        setTelegram(result.deep_link);
        setStage("telegram");
      } else throw new Error();
      pending.current = null;
    } catch {
      setStage("error");
    } finally {
      running.current = false;
    }
  }

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const query = new URLSearchParams(window.location.search);
    // Remove access/refresh tokens before rendering links or performing requests.
    window.history.replaceState(null, "", window.location.pathname);
    try {
      const supplied = fragment.get("connection") ?? query.get("connection");
      const connection = supplied ??
        sessionStorage.getItem("eden-connection-ref");
      if (!connection || !connectionPattern.test(connection)) {
        setStage("missing");
        return;
      }
      sessionStorage.setItem("eden-connection-ref", connection);
      const access = fragment.get("access_token");
      const state = fragment.get("state");
      if (fragment.has("error") || fragment.has("error_code")) {
        setStage("error");
        return;
      }
      if (!access && !state) {
        setStage("email");
        return;
      }
      const token = access ?? state ?? "";
      if (
        (access && (access.length < 32 || access.length > 8192)) ||
        (!access && !/^[A-Za-z0-9_-]{43,64}$/.test(token))
      ) {
        setStage("error");
        return;
      }
      const action = access ? "verify" : "open";
      // Stable for this exact link/token, including reopening after a lost response.
      // Neither bearer tokens nor provider sessions are written to browser storage.
      void crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(`${connection}:${action}:${token}`),
      )
        .then((digest) => {
          const requestId = Array.from(
            new Uint8Array(digest),
            (byte) => byte.toString(16).padStart(2, "0"),
          ).join("").slice(0, 32);
          const attempt: Attempt = {
            action,
            connection_ref: connection,
            request_id: requestId,
            token,
          };
          pending.current = attempt;
          return submit(attempt);
        }).catch(() => setStage("error"));
    } catch {
      setStage("error");
    }
  }, []);

  const title = {
    opening: "Connecting your Eden",
    email: "Check your email",
    telegram: "Meet your Builder",
    connected: "Your private chat is connected",
    missing: "Your Eden starts here",
    error: "Let’s reconnect",
  }[stage];
  const description = {
    opening: "We’re checking your private connection.",
    email:
      "Open the invitation from Aygency and follow the email verification link. Then we’ll connect your private Builder chat.",
    telegram:
      "The Builder will get to know you, learn what you want help with, and tailor Eden around your day.",
    connected:
      "Return to your private Telegram chat. Your onboarding continues there once your connection is prepared.",
    missing:
      "Open the personal connection link shared with you by Aygency to begin.",
    error:
      "We couldn’t finish this connection. Try again, or reopen your personal connection link. If you opened the email first, open your Aygency connection link before returning here.",
  }[stage];

  return (
    <section className="mx-auto min-h-[75vh] max-w-5xl px-6 pb-24 pt-36 sm:px-10 sm:pt-44">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl"
      >
        <p className="mb-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-cyan">
          <LockKeyhole size={16} aria-hidden />Your personal Eden
        </p>
        <h1 className="mb-6 font-heading text-4xl font-semibold uppercase leading-[1.1] text-ghost sm:text-5xl">
          {title}
        </h1>
        <div aria-live="polite" aria-busy={stage === "opening"}>
          <p className="max-w-xl text-base leading-relaxed text-ghost-muted sm:text-lg">
            {description}
          </p>
          {stage === "email" && (
            <div className="mt-8 flex items-center gap-3 text-ghost">
              <Mail size={20} className="text-cyan" aria-hidden />Use the email
              address your Eden was created for.
            </div>
          )}
          {stage === "telegram" && (
            <a className={`${button} mt-8`} href={telegram} rel="noreferrer">
              Open your Builder chat <ArrowUpRight size={18} aria-hidden />
            </a>
          )}
          {stage === "connected" && (
            <p className="mt-8 flex items-center gap-3 text-ghost">
              <Check className="text-cyan" size={20} aria-hidden />Email and
              private chat verified
            </p>
          )}
          {stage === "error" && pending.current && (
            <button
              type="button"
              className={`${button} mt-8`}
              onClick={() => {
                if (pending.current) void submit(pending.current);
              }}
            >
              Try again
            </button>
          )}
        </div>
        <div className="mt-16 border-t border-ghost-dim/30 pt-6 text-sm leading-relaxed">
          <p>
            Need a hand?{" "}
            <Link
              href="/contact"
              className="text-cyan underline-offset-4 hover:underline focus-visible:underline"
            >
              Contact Aygency
            </Link>.
          </p>
          <p className="mt-2">
            Your Builder conversation and personal assistant share the same
            private chat.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
