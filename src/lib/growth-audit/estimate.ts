import { packs, type AuditAnswers, type Pack, type TaskDetail } from "./questions";

/**
 * Internal estimate for Aygency only: pricing and sales conversations. It is
 * never shown to the prospect. Figures come from band midpoints of what they
 * told us, so they are a starting point to check in the meeting, not a quote.
 */

const peopleMidpoint: Record<TaskDetail["people"], number> = { "1": 1, "2-3": 2.5, "4-10": 6, "10+": 12 };

const durationHours: Record<TaskDetail["duration"], number> = {
  under_30m: 0.25,
  "30m-2h": 1,
  "2-4h": 3,
  day: 7,
  days: 20,
};

/** Occurrences per week. "Once per job" has no weekly rate without job throughput. */
const perWeek: Record<Exclude<TaskDetail["frequency"], "per_job">, number> = {
  daily: 5,
  weekly: 1,
  monthly: 12 / 52,
};

/** ONS ASHE April 2025 full-time median hourly pay × 1.17 employer on-costs (NI + pension). */
export const LOADED_HOURLY_RATE = 19.67 * 1.17;
export const WORKING_WEEKS = 46;

export interface TaskEstimate {
  task: string;
  label: string;
  agent: string;
  /** Team hours a week, or null for once-per-job work. */
  weeklyHours: number | null;
  /** Team hours each time it happens (useful for once-per-job work). */
  hoursEachTime: number;
  detail: TaskDetail;
}

export function estimateTasks(pack: Pack, answers: Pick<AuditAnswers, "tasks" | "taskDetails">): TaskEstimate[] {
  const byValue = new Map(packs[pack].tasks.map((t) => [t.value, t]));
  return answers.tasks
    .map((task) => {
      const option = byValue.get(task);
      const detail = answers.taskDetails[task];
      if (!option || !detail) return null;
      const hoursEachTime = peopleMidpoint[detail.people] * durationHours[detail.duration];
      const weeklyHours = detail.frequency === "per_job" ? null : hoursEachTime * perWeek[detail.frequency];
      return { task, label: option.label, agent: option.agent, weeklyHours, hoursEachTime, detail };
    })
    .filter((e): e is TaskEstimate => e !== null)
    .sort((a, b) => (b.weeklyHours ?? -1) - (a.weeklyHours ?? -1));
}

export function weeklyTotal(estimates: TaskEstimate[]) {
  return estimates.reduce((sum, e) => sum + (e.weeklyHours ?? 0), 0);
}

/**
 * A basic diagnosis: which agents fit, ranked by the weekly hours of the work
 * they would take on. The task they want gone tomorrow always makes the cut.
 * The Coordinator is included in every system.
 */
export function suggestAgents(estimates: TaskEstimate[], goneTomorrow?: string, max = 4) {
  const hoursByAgent = new Map<string, number>();
  for (const e of estimates) {
    hoursByAgent.set(e.agent, (hoursByAgent.get(e.agent) ?? 0) + (e.weeklyHours ?? e.hoursEachTime / 4));
  }
  const ranked = [...hoursByAgent.entries()].sort((a, b) => b[1] - a[1]).map(([agent]) => agent);
  const must = estimates.find((e) => e.task === goneTomorrow)?.agent;
  const specialists = ranked.filter((a) => a !== "Coordinator");
  const chosen = specialists.slice(0, max);
  if (must && must !== "Coordinator" && !chosen.includes(must)) {
    if (chosen.length < max) chosen.push(must);
    else chosen[chosen.length - 1] = must;
  }
  return ["Coordinator", ...chosen];
}
