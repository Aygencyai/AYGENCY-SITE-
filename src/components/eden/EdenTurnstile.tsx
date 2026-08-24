"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

const TURNSTILE_SCRIPT =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

interface TurnstileApi {
  render(
    container: HTMLElement,
    options: {
      sitekey: string;
      action: "eden_application_submit";
      appearance: "interaction-only";
      execution: "render";
      size: "flexible";
      theme: "dark";
      "response-field": false;
      callback(token: string): void;
      "expired-callback"(): void;
      "error-callback"(): void;
      "timeout-callback"(): void;
    },
  ): string;
  remove(widgetId: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

interface EdenTurnstileProps {
  siteKey: string;
  error?: string;
  onToken(token: string): void;
}

export default function EdenTurnstile({
  siteKey,
  error,
  onToken,
}: EdenTurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  const [scriptReady, setScriptReady] = useState(false);
  const [widgetError, setWidgetError] = useState("");

  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  const renderWidget = useCallback(() => {
    if (
      !siteKey ||
      !containerRef.current ||
      !window.turnstile ||
      widgetIdRef.current
    ) {
      return;
    }

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      action: "eden_application_submit",
      appearance: "interaction-only",
      execution: "render",
      size: "flexible",
      theme: "dark",
      "response-field": false,
      callback: (token) => {
        setWidgetError("");
        onTokenRef.current(token);
      },
      "expired-callback": () => {
        onTokenRef.current("");
        setWidgetError("The security check expired. Please complete it again.");
      },
      "error-callback": () => {
        onTokenRef.current("");
        setWidgetError("The security check could not load. Please try again.");
      },
      "timeout-callback": () => {
        onTokenRef.current("");
        setWidgetError("The security check timed out. Please complete it again.");
      },
    });
  }, [siteKey]);

  useEffect(() => {
    if (scriptReady) renderWidget();
  }, [renderWidget, scriptReady]);

  useEffect(
    () => () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = null;
    },
    [],
  );

  const message = error ?? widgetError;

  return (
    <div>
      <Script
        id="eden-turnstile-script"
        src={TURNSTILE_SCRIPT}
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
        onReady={() => setScriptReady(true)}
        onError={() =>
          setWidgetError("The security check could not load. Please refresh and try again.")
        }
      />
      <div
        ref={containerRef}
        className="min-h-[65px] w-full max-w-md"
        aria-label="Security verification"
      />
      {!siteKey && (
        <p role="alert" className="mt-3 font-sans text-sm text-error">
          Security verification is not configured for this environment.
        </p>
      )}
      {message && (
        <p role="alert" className="mt-3 font-sans text-sm text-error">
          {message}
        </p>
      )}
    </div>
  );
}
