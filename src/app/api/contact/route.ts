import { NextResponse } from "next/server";
import { Resend } from "resend";

// An enquiry must never be lost.
//
// The previous version's only durable act was the Resend call: if that failed
// for any reason the enquiry vanished, the visitor saw a generic error, and
// nobody ever knew a lead had arrived. Two of its failure modes were live —
// `RESEND_API_KEY` unset, and a `from` of `onboarding@resend.dev`, Resend's
// sandbox sender, which only delivers to the account owner's own verified
// address.
//
// Order is now: capture durably, then notify. Notification is best-effort on
// top of a stored record, and the visitor is only told it failed when NOTHING
// worked — and is then given an address they can use themselves.

const FALLBACK_ADDRESS = "build@aygency.ai";

type Enquiry = {
  name: string;
  email: string;
  company?: string;
  message: string;
  receivedAt: string;
  userAgent: string | null;
};

/**
 * Store the enquiry in Supabase over its REST API.
 *
 * Deliberately plain `fetch` rather than a client library: this route needs no
 * other Supabase surface, and a dependency here would have to be maintained by
 * whoever next touches the marketing site.
 *
 * Returns true only on a confirmed write. Absent configuration returns false
 * rather than throwing, so the site keeps working before the key is issued.
 */
async function storeEnquiry(enquiry: Enquiry): Promise<boolean> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const table = process.env.CONTACT_ENQUIRY_TABLE ?? "site_enquiries";
  if (!url || !key) return false;

  try {
    const response = await fetch(`${url}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: key,
        authorization: `Bearer ${key}`,
        prefer: "return=minimal",
      },
      body: JSON.stringify({
        name: enquiry.name,
        email: enquiry.email,
        company: enquiry.company ?? null,
        message: enquiry.message,
        received_at: enquiry.receivedAt,
        user_agent: enquiry.userAgent,
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function notify(enquiry: Enquiry): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  // The sender's domain must be verified in Resend. Defaulting to the sandbox
  // address is what made every notification undeliverable to anyone but the
  // account owner, so an unset value is treated as unconfigured, not as a
  // usable default.
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_EMAIL ?? FALLBACK_ADDRESS;
  if (!apiKey || !from) return false;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: enquiry.email,
      subject: `New enquiry from ${enquiry.name}${
        enquiry.company ? ` (${enquiry.company})` : ""
      }`,
      text: [
        `Name: ${enquiry.name}`,
        `Email: ${enquiry.email}`,
        enquiry.company ? `Company: ${enquiry.company}` : null,
        `Received: ${enquiry.receivedAt}`,
        ``,
        `Message:`,
        enquiry.message,
      ]
        .filter(Boolean)
        .join("\n"),
    });
    return !error;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  let enquiry: Enquiry;
  try {
    const { name, email, company, message } = await request.json();
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }
    enquiry = {
      name,
      email,
      company,
      message,
      receivedAt: new Date().toISOString(),
      userAgent: request.headers.get("user-agent"),
    };
  } catch {
    return NextResponse.json(
      { error: "That request could not be read. Please try again." },
      { status: 400 }
    );
  }

  // Always emit the complete enquiry to the platform log before anything that
  // can fail. Logs are not a database, but they are retained, and this is the
  // difference between a recoverable lead and a lost one.
  console.log(
    "contact_enquiry",
    JSON.stringify({ ...enquiry, message: enquiry.message.slice(0, 2000) })
  );

  const [stored, notified] = await Promise.all([
    storeEnquiry(enquiry),
    notify(enquiry),
  ]);

  if (stored || notified) {
    return NextResponse.json({ success: true });
  }

  // Nothing durable happened beyond the log line. Say so honestly and give the
  // visitor a route that does not depend on us.
  console.error("contact_enquiry_undelivered", {
    email: enquiry.email,
    stored,
    notified,
  });
  return NextResponse.json(
    {
      error: `We could not record your message. Please email ${
        process.env.CONTACT_EMAIL ?? FALLBACK_ADDRESS
      } directly and we will pick it up.`,
    },
    { status: 500 }
  );
}
