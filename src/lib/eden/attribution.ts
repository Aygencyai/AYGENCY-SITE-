import type { EdenAttribution } from "./application-schema";

const ATTRIBUTION_KEYS = {
  utm_source: "utmSource",
  utm_medium: "utmMedium",
  utm_campaign: "utmCampaign",
  utm_term: "utmTerm",
  utm_content: "utmContent",
  gclid: "gclid",
  fbclid: "fbclid",
  msclkid: "msclkid",
} as const;

interface AttributionSource {
  location: URL;
  referrer?: string;
}

function boundedValue(value: string | null) {
  if (!value) return undefined;
  const bounded = value.trim().slice(0, 200);
  return bounded || undefined;
}

function safeReferrer(value: string | undefined) {
  if (!value) return undefined;

  try {
    const referrer = new URL(value);
    if (referrer.protocol !== "https:" && referrer.protocol !== "http:") {
      return undefined;
    }
    referrer.search = "";
    referrer.hash = "";
    const safeValue = referrer.toString();
    return safeValue.length <= 500 ? safeValue : undefined;
  } catch {
    return undefined;
  }
}

export function captureEdenAttribution(
  source?: AttributionSource
): EdenAttribution {
  const location =
    source?.location ??
    (typeof window === "undefined"
      ? new URL("https://aygency.ai/design-your-eden")
      : new URL(window.location.href));
  const attribution: EdenAttribution = {
    landingPath: location.pathname.slice(0, 500) || "/design-your-eden",
  };

  for (const [queryKey, property] of Object.entries(ATTRIBUTION_KEYS)) {
    const value = boundedValue(location.searchParams.get(queryKey));
    if (value) attribution[property] = value;
  }

  const referrer = safeReferrer(
    source?.referrer ??
      (typeof document === "undefined" ? undefined : document.referrer)
  );
  if (referrer) attribution.referrer = referrer;

  return attribution;
}
