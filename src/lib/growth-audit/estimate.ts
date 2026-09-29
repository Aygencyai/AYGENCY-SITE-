import type { AreaDetail, AuditAnswers } from "./questions";

/** Band midpoints. "10+" and "20+" use a conservative figure, not the open end. */
const peopleMidpoint: Record<AreaDetail["people"], number> = {
  "1": 1,
  "2-3": 2.5,
  "4-10": 6,
  "10+": 12,
};

const hoursMidpoint: Record<AreaDetail["hours"], number> = {
  under_2: 1,
  "2-5": 3.5,
  "5-10": 7.5,
  "10-20": 15,
  "20+": 25,
};

/** Team hours a week across every ticked area, from band midpoints. */
export function weeklyTeamHours(answers: Pick<AuditAnswers, "areas" | "areaDetails">) {
  return answers.areas.reduce((total, area) => {
    const detail = answers.areaDetails[area];
    if (!detail) return total;
    return total + peopleMidpoint[detail.people] * hoursMidpoint[detail.hours];
  }, 0);
}

/**
 * The range shown on the result screen: midpoint total ±25%, rounded to 5.
 * Self-reported hours run high on work people dislike, so this is a
 * conversation opener, not a quote. The £ figures stay out of the funnel.
 */
export function weeklyHoursRange(answers: Pick<AuditAnswers, "areas" | "areaDetails">) {
  const hours = weeklyTeamHours(answers);
  if (hours === 0) return null;
  const roundTo5 = (value: number) => Math.max(5, Math.round(value / 5) * 5);
  const low = roundTo5(hours * 0.75);
  const high = Math.max(low + 5, roundTo5(hours * 1.25));
  return { low, high };
}

export type GrowthLever = "replies" | "capacity" | "admin" | "marketing" | "visibility" | "owner";

/** The single strongest growth lever the answers point at, for the read-back. */
export function growthLever(answers: Pick<AuditAnswers, "blockers" | "doubled" | "replySpeed">): GrowthLever {
  const slowReplies = answers.replySpeed === "same_day" || answers.replySpeed === "next_day";
  if (answers.blockers.includes("slow_replies") || (slowReplies && answers.doubled === "drop")) {
    return "replies";
  }
  if (answers.blockers.includes("capacity") || answers.doubled === "hire" || answers.doubled === "drop") {
    return "capacity";
  }
  const [first] = answers.blockers;
  const byBlocker: Record<AuditAnswers["blockers"][number], GrowthLever> = {
    slow_replies: "replies",
    capacity: "capacity",
    admin: "admin",
    no_time_marketing: "marketing",
    numbers_unclear: "visibility",
    owner_dependent: "owner",
  };
  return first ? byBlocker[first] : "admin";
}

export const leverCopy: Record<GrowthLever, { headline: string; body: string }> = {
  replies: {
    headline: "Faster replies to enquiries",
    body: "Enquiries that wait go elsewhere. Answering in minutes, around the clock, is usually the quickest win we see.",
  },
  capacity: {
    headline: "Room to grow without hiring first",
    body: "Your team is near its ceiling. Taking the repeat work off them is what lets the business take on more.",
  },
  admin: {
    headline: "Getting admin off your team's plate",
    body: "The time spent between systems, copying, chasing and re-typing, is where AI takes work off people fastest.",
  },
  marketing: {
    headline: "Marketing that happens without you",
    body: "Consistent content, planned and made for you, so it stops being the thing that slips.",
  },
  visibility: {
    headline: "Knowing where the business stands",
    body: "The numbers that matter, pulled together and explained, without anyone building a spreadsheet.",
  },
  owner: {
    headline: "Less of it running through you",
    body: "Taking the routine decisions and follow-ups off one person, so the business keeps moving when they step away.",
  },
};
