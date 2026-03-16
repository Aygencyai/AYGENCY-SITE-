import { services, useCases } from "@/lib/data";

const BASE_URL = "https://aygency.ai";

export default function sitemap() {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date() },
    { url: `${BASE_URL}/services`, lastModified: new Date() },
    { url: `${BASE_URL}/use-cases`, lastModified: new Date() },
    { url: `${BASE_URL}/contact`, lastModified: new Date() },
  ];

  const servicePages = services.map((s) => ({
    url: `${BASE_URL}/services/${s.slug}`,
    lastModified: new Date(),
  }));

  const useCasePages = useCases.map((uc) => ({
    url: `${BASE_URL}/use-cases/${uc.slug}`,
    lastModified: new Date(),
  }));

  return [...staticPages, ...servicePages, ...useCasePages];
}
