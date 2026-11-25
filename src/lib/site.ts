export const SITE_URL = "https://www.aygency.ai";

// Shared social and AI-answer thumbnail. Pages that set their own openGraph
// replace the root one, so they pass this to keep an image.
export const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Aygency: AI agents that clear the way for businesses to scale.",
};

/** Search title for insight and answer pages. Keeps the buyer's question
 *  at the front and drops the brand suffix if the title would run past
 *  60 characters. */
export function insightSearchTitle(pageTitle: string): string {
  const withSuffix = `${pageTitle} | Aygency`;
  return withSuffix.length <= 60 ? withSuffix : pageTitle;
}

// Author credited on every insight and answer page. One stable Person entity
// (@id) shared by the Article bylines, the Organization founder and the /about bio.
export const AUTHOR = {
  id: `${SITE_URL}/about#louis-rosenberg`,
  name: "Louis Rosenberg",
  jobTitle: "Co-founder and CEO",
  url: `${SITE_URL}/about#louis-rosenberg`,
};
