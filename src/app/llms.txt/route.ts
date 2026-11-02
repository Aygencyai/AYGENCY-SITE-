import { services, useCases } from "@/lib/data";
import { insightPosts } from "@/lib/insights";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

// Plain-text guide for AI assistants. Built from the same data as the site.
export function GET() {
  const link = (title: string, path: string) => `- [${title}](${SITE_URL}${path})`;

  const body = [
    "# Aygency",
    "",
    "> Aygency (AYGENCY LTD, Borehamwood, UK) designs, builds, deploys, and operates custom AI agent systems for businesses. Specialist agents (lead gen, outreach, operations and admin, inbound questions, content) are coordinated by a CEO Agent and a Brain. We start with the agents that matter most, expand from there, and keep operating the system rather than handing it off. Systems run in the client's environment, with a human approving high-impact actions.",
    "",
    "Contact: build@aygency.ai",
    "",
    "## Key pages",
    link("Home", "/"),
    link("The System", "/system"),
    link("The Brain", "/brain"),
    link("About", "/about"),
    link("Trust", "/trust"),
    link("Contact", "/contact"),
    link("Eden, AI personal assistant", "/design-your-eden"),
    "",
    "## Services",
    link("Services", "/services"),
    ...services.map((s) => link(s.title, `/services/${s.slug}`)),
    "",
    "## Use cases",
    link("Use cases", "/use-cases"),
    ...useCases.map((uc) => link(uc.title, `/use-cases/${uc.slug}`)),
    "",
    "## Insights",
    link("Insights", "/insights"),
    ...insightPosts.map((p) => link(p.title, `/insights/${p.slug}`)),
    "",
  ].join("\n");

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
