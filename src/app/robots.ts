import { SITE_URL } from "@/lib/site";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/test-letter", "/eden/connect"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
