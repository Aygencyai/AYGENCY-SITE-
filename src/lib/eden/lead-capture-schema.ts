import { z } from "zod";
import type { EdenAttribution } from "./application-schema";

const UUID_V4_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SAFE_UTM_PATTERN = /^[A-Za-z0-9][A-Za-z0-9 ._~+/-]{0,99}$/;

const uuidV4Schema = z
  .string()
  .uuid("Capture reference must be a UUID.")
  .refine((value) => UUID_V4_PATTERN.test(value), "Capture reference must be UUIDv4.");

const optionalAttributionValue = z.string().regex(SAFE_UTM_PATTERN).optional();

const attributionSchema: z.ZodType<EdenAttribution> = z
  .object({
    landingPath: z
      .string()
      .min(1)
      .max(300)
      .regex(/^\/(?!\/)[^\s?#]*$/, "Landing path must be an origin-relative path."),
    referrerOrigin: z
      .string()
      .max(300)
      .refine((value) => {
        try {
          const url = new URL(value);
          return ["http:", "https:"].includes(url.protocol) && url.origin === value;
        } catch {
          return false;
        }
      }, "Referrer must contain only an HTTP or HTTPS origin.")
      .optional(),
    utmSource: optionalAttributionValue,
    utmMedium: optionalAttributionValue,
    utmCampaign: optionalAttributionValue,
    utmTerm: optionalAttributionValue,
    utmContent: optionalAttributionValue,
  })
  .strict();

export const edenLeadCaptureSchema = z
  .object({
    eventId: uuidV4Schema,
    applicationId: uuidV4Schema,
    capturedAt: z
      .string()
      .datetime({ offset: true })
      .refine((value) => value.endsWith("Z"), "Capture time must be UTC."),
    workEmail: z
      .string()
      .max(254, "Email address is too long.")
      .email("Enter a valid work email address."),
    inquiryConsent: z.literal(true, {
      error: "Consent is required so we can send the Blueprint and respond.",
    }),
    attribution: attributionSchema,
    website: z.string().max(200),
  })
  .strict();

export type EdenLeadCapture = z.infer<typeof edenLeadCaptureSchema>;
