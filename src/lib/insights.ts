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
      "Everyone calls it “AI automation” now. Most of it is still a script. Here’s the line between automation and an agent system, and why it changes what you should buy.",
    date: "12 June 2026",
    readTime: "4 min read",
    content: [
      {
        paragraphs: [
          "Automation isn’t new. A script that moves a row from one sheet to another, a rule that files an email, a macro that renames a thousand files. Businesses have run on this for decades and it works. But it has a ceiling, and most of what gets sold as “AI automation” today is sitting right under it.",
        ],
      },
      {
        heading: "Automation runs a task",
        paragraphs: [
          "Automation does the same thing the same way, forever. You write the steps once and it follows them. The moment the input changes shape, or something happens you didn’t plan for, it either breaks or it quietly does the wrong thing. It doesn’t notice. It has no memory of last week and no opinion about next week.",
          "That’s fine for a task with hard edges. It’s the wrong tool for an operation.",
        ],
      },
      {
        heading: "An agent system runs an operation",
        paragraphs: [
          "An agent reads a situation, decides what to do, does it, then looks at what happened and adjusts. A system of agents does that across a whole function. One finds the work, one does it, one checks it, and one reads across all of it to decide what should change. They hand off to each other and pull in a person for the things that genuinely need one.",
          "The difference isn’t that agents are “smarter” automation. It’s that they handle the part a script can’t: the judgement, the exceptions, the context that lives in the gaps between the steps.",
        ],
      },
      {
        heading: "Why the distinction changes what you buy",
        paragraphs: [
          "If you’re replacing one repetitive task, buy automation. If you’re trying to run a function without hiring a department for it, automation will frustrate you and an agent system will fit.",
          "It changes the economics, too. A script is finished the day it ships. An agent system is worth running, because it gets better the longer it does. That’s a different kind of purchase, and it’s the one most businesses actually need.",
        ],
      },
    ],
  },
  {
    slug: "built-once-compound-forever",
    title: "Built once, compound forever: why agent systems appreciate",
    excerpt:
      "Almost everything a business spends on loses value over time. Agent systems do the opposite, on their own. Here’s why, and what that actually asks of you.",
    date: "16 June 2026",
    readTime: "5 min read",
    content: [
      {
        paragraphs: [
          "Look at where a business spends its money and you’ll see the same shape almost everywhere. Equipment depreciates. Software sits flat until someone cancels it. Even a great hire gets as good as they’re going to get and then levels off. The thing is worth the most on the day you get it. Agent systems run the other way. They’re worth the least on day one.",
        ],
      },
      {
        heading: "What compounding actually means here",
        paragraphs: [
          "Day one, the system runs the workflow you built it for. By month three it has seen enough of your operation to run that workflow better than a person would, with fewer misses and sharper calls on the edge cases. By month six it’s surfacing things nobody asked it to look for: the segment that’s quietly growing, the cost that’s creeping up, the bottleneck that keeps backing everything else up.",
          "The price you pay stays flat. The value keeps climbing.",
        ],
      },
      {
        heading: "This part is the agent’s own doing",
        paragraphs: [
          "Here’s the bit that gets misunderstood. The system improves itself. It learns from every cycle and compounds on its own, the way a good hire gets better at a job by doing it, except it doesn’t forget and it doesn’t plateau.",
          "That self-improvement is the whole reason an agent system is worth more than a script. It’s the thing you’re actually buying.",
        ],
      },
      {
        heading: "What it asks of you",
        paragraphs: [
          "Left completely alone, even a system that improves itself can wander. It can learn the wrong lesson, or get good at the wrong thing. So our job is to steward it. We keep it safe, point it at the work that matters, and keep tuning it as your business changes.",
          "We don’t make it compound. It does that itself. What we do is make sure it compounds in the right direction and never quietly drifts. That’s why we run every system we build, for as long as you do.",
        ],
      },
      {
        heading: "Built once. Compounding forever.",
        paragraphs: [
          "The build is the on-ramp. The value is in what the system becomes after it. So when you’re weighing one up, the question isn’t only what it does on day one. It’s what it’ll have taught itself by day ninety, and whether someone’s making sure that’s the right thing.",
        ],
      },
    ],
  },
];
