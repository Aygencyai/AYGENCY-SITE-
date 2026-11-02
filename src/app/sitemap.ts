import type { MetadataRoute } from "next";
import { services, useCases } from "@/lib/data";
import { insightPosts } from "@/lib/insights";
import { SITE_URL } from "@/lib/site";

// Public pages only. Internal pages (/audit, /eden/*, /test-letter) stay out.
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/system",
    "/brain",
    "/services",
    ...services.map((s) => `/services/${s.slug}`),
    "/use-cases",
    ...useCases.map((uc) => `/use-cases/${uc.slug}`),
    "/insights",
    ...insightPosts.map((p) => `/insights/${p.slug}`),
    "/design-your-eden",
    "/about",
    "/trust",
    "/contact",
  ];

  return paths.map((path) => ({ url: `${SITE_URL}${path}`, lastModified: new Date() }));
}
