export interface InsightSection {
  heading?: string;
  paragraphs: string[];
}

export interface InsightPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  content: InsightSection[];
}

export const insightPosts: InsightPost[] = [
  {
    slug: "automation-vs-agent-systems",
    title: "Automation runs a task. Agent systems run an operation.",
    excerpt:
      "Everyone says “AI automation” now. Most of it is still a script. Here’s the line between automation and an agent system — and why it changes what you should buy.",
    date: "12 June 2026",
    readTime: "4 min read",
    content: [
      {
        paragraphs: [
          "Automation isn’t new. A script that moves a row from one sheet to another, a rule that files an email, a macro that renames a thousand files — businesses have run on this for decades. It works, and it’s worth doing. But it has a ceiling, and most of what gets sold as “AI automation” today is sitting right under it.",
        ],
      },
      {
        heading: "Automation runs a task",
        paragraphs: [
          "Automation does the same thing, the same way, forever. You define the steps up front. It follows them. When the input changes shape, or an edge case appears that you didn’t anticipate, it breaks or it does the wrong thing quietly. It doesn’t notice. It doesn’t adapt. It has no memory of last week and no opinion about next week.",
          "That’s fine for a task with hard edges. It’s the wrong tool for an operation.",
        ],
      },
      {
        heading: "An agent system runs an operation",
        paragraphs: [
          "An agent reads a situation, decides what to do, and acts — then reads the result and adjusts. A system of agents does that across a whole function: one finds the work, one does it, one checks it, one reads across all of it and decides what to change. They coordinate, they hand off, and they escalate the things that genuinely need a person.",
          "The difference isn’t that agents are “smarter” automation. It’s that they handle the parts a script can’t: the judgment, the exceptions, the context that lives between the steps.",
        ],
      },
      {
        heading: "Why the distinction is the whole point",
        paragraphs: [
          "If you’re replacing a single repetitive task, buy automation. If you’re trying to run a function — marketing, operations, support, acquisition — without hiring a department for it, automation will frustrate you and an agent system will fit.",
          "It also changes the economics. A script is done the day it ships. An agent system is worth operating, because it gets better the longer it runs. That’s a different kind of purchase, and it’s the one most businesses actually need.",
        ],
      },
    ],
  },
  {
    slug: "built-once-compound-forever",
    title: "Built once, compound forever: why agent systems appreciate",
    excerpt:
      "Almost everything a business spends on loses value over time. Agent systems do the opposite — but only if someone operates them. Here’s the mechanism.",
    date: "16 June 2026",
    readTime: "4 min read",
    content: [
      {
        paragraphs: [
          "Look at where a business spends money and you’ll see the same curve almost everywhere. Equipment depreciates. Software licences stay flat and then get cancelled. Even great hires plateau — they get as good as they’re going to get, and then you’re paying to hold the line. The asset is worth the most on day one.",
          "Agent systems run the other way. The asset is worth the least on day one.",
        ],
      },
      {
        heading: "What “compounding” actually means here",
        paragraphs: [
          "Day one, the system runs the workflow you built it for. By month three, it has seen enough of your operation to run that workflow better than a person would — fewer misses, faster handling, sharper judgment on the edge cases. By month six, it’s surfacing things nobody briefed it to look for: the segment that’s quietly growing, the cost that’s creeping, the bottleneck that ripples.",
          "The cost stays flat. The value climbs. That’s the whole pitch, and it’s real — under one condition.",
        ],
      },
      {
        heading: "The condition: someone has to operate it",
        paragraphs: [
          "Compounding isn’t automatic. An agent system that nobody tends doesn’t improve — it drifts. Patterns go stale, edge cases pile up, and the thing slowly decays into expensive automation. The improvement comes from active stewardship: watching what it gets wrong, tuning it, feeding back what it learns, expanding its coverage.",
          "This is why we operate every system we build. Not as an upsell — as the mechanism. A build that gets handed over plateaus. A build that gets operated appreciates. The difference between those two outcomes is the entire reason agent systems are worth it.",
        ],
      },
      {
        heading: "Built once. Compounding forever.",
        paragraphs: [
          "Build is the on-ramp. Operating is where the value lives. If you’re evaluating an agent system, the question isn’t just “what will it do on day one” — it’s “who’s making it better on day ninety.”",
        ],
      },
    ],
  },
];
