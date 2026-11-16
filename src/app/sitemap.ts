import type { MetadataRoute } from "next";
import { services, useCases } from "@/lib/data";
import { insightPosts } from "@/lib/insights";
import { SITE_URL } from "@/lib/site";

// Real last-changed dates only. Google uses lastmod only when it is
// consistently accurate, so pages without a tracked date carry none rather
// than the build time.
const postDate = (p: { date: string; updated?: string }) => new Date(`${p.updated ?? p.date} UTC`);

// Public pages only. Internal pages (/audit, /eden/*, /test-letter) stay out.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/system",
    "/services",
    ...services.map((s) => `/services/${s.slug}`),
    "/use-cases",
    ...useCases.map((uc) => `/use-cases/${uc.slug}`),
  ];
  const trailingPaths = ["/design-your-eden", "/about", "/trust", "/contact"];
  const newestPost = new Date(Math.max(...insightPosts.map((p) => postDate(p).getTime())));

  return [
    ...staticPaths.map((path) => ({ url: `${SITE_URL}${path}` })),
    { url: `${SITE_URL}/insights`, lastModified: newestPost },
    ...insightPosts.map((p) => ({ url: `${SITE_URL}/insights/${p.slug}`, lastModified: postDate(p) })),
    ...trailingPaths.map((path) => ({ url: `${SITE_URL}${path}` })),
  ];
}
