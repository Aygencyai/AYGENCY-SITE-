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
    "> Aygency (AYGENCY LTD, Borehamwood, UK) designs, builds, deploys, and operates custom AI agent systems that remove bottlenecks so businesses can scale. We start with the back office, then lead generation, outreach, inbound questions, and content. Agents are designed around each business's real workflows and fit into the way people already work. A CEO Agent and a Brain coordinate them, and the owner stays in control from one place, approving high-impact actions. We keep operating the system rather than handing it off, and systems run in the client's environment.",
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
