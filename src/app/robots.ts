import { SITE_URL } from "@/lib/site";

const disallow = ["/test-letter", "/eden/connect"];

// AI search and assistant crawlers we explicitly welcome.
const aiBots = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "ClaudeBot",
  "Google-Extended",
  "Applebot-Extended",
];

export default function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      { userAgent: aiBots, allow: "/", disallow },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
