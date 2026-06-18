import type { Service, UseCase, ProcessStep, Metric, Agent, Tier } from "@/types";

export const services: Service[] = [
  {
    slug: "cost-reduction",
    title: "Cost Reduction Systems",
    shortTitle: "Cost Reduction",
    description:
      "Agent systems that replace the expensive manual processes bleeding your operation. The cost is fixed. The savings compound.",
    longDescription:
      "Every business has processes that cost too much because they depend on people doing repetitive, manual work. We build agent systems that take over those workflows \u2014 permanently, at a fraction of the cost, running around the clock.",
    icon: "cost-reduction",
    useCases: [
      "Document processing, data extraction, and routing at any volume",
      "Inventory monitoring, procurement automation, and waste elimination",
      "Energy monitoring across sites with anomaly detection and cost attribution",
      "Reporting and analytics generated automatically from live data",
      "Scheduling and resource allocation based on real demand signals",
      "Invoice processing, reconciliation, and financial data entry",
    ],
    problem:
      "You already know which processes are expensive. Inventory checks done by hand. Reports compiled from spreadsheets. Data entered twice because systems don\u2019t talk to each other. Invoices processed manually. Schedules built on gut feel. You\u2019ve accepted these costs because the alternative \u2014 building software or hiring more people \u2014 felt even more expensive. It isn\u2019t anymore.",
    approach: [
      {
        title: "Map",
        desc: "We document the process as it actually runs. Every input, decision, handoff, exception, and workaround. We find exactly where the cost lives.",
      },
      {
        title: "Architect",
        desc: "We design the agent system \u2014 which agents own which steps, what data they need, how they coordinate, and what happens at the edges.",
      },
      {
        title: "Build & Ship",
        desc: "We build every agent, connect them to your live systems, and deploy into your environment with full monitoring from day one.",
      },
      {
        title: "Compound",
        desc: "The system gets more efficient over time. It learns your patterns, catches exceptions faster, and surfaces cost reductions you didn\u2019t know existed.",
      },
    ],
    ctaHeading: "Every manual process is a cost you\u2019ve stopped noticing",
    ctaBody:
      "30 minutes. We\u2019ll find the workflows bleeding time and money and tell you exactly what a system would look like.",
  },
  {
    slug: "revenue-operations",
    title: "Revenue Operations Systems",
    shortTitle: "Revenue Ops",
    description:
      "Agent systems that don\u2019t just save money \u2014 they actively find and generate revenue. Pipeline, outreach, qualification, conversion \u2014 handled by agents that never stop.",
    longDescription:
      "Agent systems that identify, qualify, and convert revenue opportunities across your business \u2014 running outreach, managing pipeline, optimising pricing, and scaling campaigns without adding headcount.",
    icon: "revenue-operations",
    useCases: [
      "Lead prospecting and enrichment from market signals, social data, and intent data",
      "Multi-channel outreach \u2014 email, LinkedIn, calls \u2014 personalised and sequenced automatically",
      "Lead qualification and scoring based on your actual conversion patterns",
      "Sales pipeline management, follow-up automation, and deal tracking",
      "Dynamic pricing systems that adjust to demand, competition, and margin targets",
      "Marketing campaign execution across Meta, Google, TikTok, LinkedIn \u2014 creative, targeting, budget allocation, and reporting",
    ],
    problem:
      "Your revenue engine depends on people. People who take holidays, miss follow-ups, forget to update the CRM, and can only work so many hours. Meanwhile your competitors are scaling their outreach, their qualification, their conversion \u2014 and they\u2019re doing it with systems, not headcount. The businesses growing fastest right now aren\u2019t hiring more salespeople. They\u2019re deploying agents.",
    approach: [
      {
        title: "Audit",
        desc: "We break down your current revenue operation \u2014 where leads come from, how they\u2019re qualified, what converts, and where deals die.",
      },
      {
        title: "Architect",
        desc: "We design the agent system \u2014 one agent for prospecting, one for outreach, one for qualification, one for pipeline management, and so on. Each one specialised. All coordinated.",
      },
      {
        title: "Build & Ship",
        desc: "We plug into your platforms, build every agent, and deploy the full system into your environment.",
      },
      {
        title: "Compound",
        desc: "The agents learn from every campaign, every deal, every conversion. They refine targeting, rotate messaging, and reallocate resources to what\u2019s working \u2014 automatically.",
      },
    ],
    ctaHeading:
      "What would your revenue look like if your pipeline never stopped moving?",
    ctaBody:
      "30 minutes. We\u2019ll audit your current operation and show you exactly where an agent system would outperform what you\u2019re running today.",
  },
  {
    slug: "intelligence",
    title: "Intelligence & Oversight Systems",
    shortTitle: "Intelligence",
    description:
      "A system that sits above your entire operation, sees every data point, and finds the opportunities nobody\u2019s looking for. This is where the CEO Agent lives.",
    longDescription:
      "Most businesses have the data to make better decisions. The problem isn\u2019t access \u2014 it\u2019s that nobody has time to look at all of it, connect the dots, and act fast enough. These systems do exactly that.",
    icon: "intelligence",
    useCases: [
      "Cross-department data aggregation and pattern detection",
      "Revenue opportunity identification from operational data",
      "Anomaly detection across financial, operational, and customer data",
      "Competitive intelligence monitoring and market signal tracking",
      "Automated strategic reporting with actionable recommendations",
      "The CEO Agent \u2014 a dedicated agent that thinks at the business level, identifies what\u2019s working, what\u2019s breaking, and what to do next",
    ],
    problem:
      "Your data sits in silos. Sales knows their numbers. Marketing knows their metrics. Operations knows their costs. But nobody sees all of it at once. Nobody\u2019s connecting the spike in customer complaints with the supplier change last month and the margin drop this quarter. That\u2019s not a people problem \u2014 there\u2019s too much data moving too fast for any human to track. An agent system built for oversight sees everything, in real time, and surfaces what matters.",
    approach: [
      {
        title: "Immerse",
        desc: "We spend time understanding your full operation \u2014 not one department, all of them. How data flows, where it gets stuck, and what decisions depend on it.",
      },
      {
        title: "Architect",
        desc: "We design the intelligence layer \u2014 which data sources feed in, what patterns to monitor, what thresholds trigger alerts, and how insights get surfaced to the right people.",
      },
      {
        title: "Build & Ship",
        desc: "We build the system, connect every data source, and deploy with real-time dashboards and alerting.",
      },
      {
        title: "Compound",
        desc: "The system learns what matters to your business. It stops flagging noise and starts surfacing the signals that actually move the needle. Month six sees things month one couldn\u2019t.",
      },
    ],
    ctaHeading:
      "What would you do if you could see your entire operation in real time?",
    ctaBody:
      "30 minutes. We\u2019ll look at your data landscape and show you what an intelligence system would surface.",
  },
  {
    slug: "full-department",
    title: "Full Department Systems",
    shortTitle: "Full Departments",
    description:
      "A complete function \u2014 marketing, operations, support \u2014 run by a coordinated team of AI agents with human oversight only where it matters.",
    longDescription:
      "For businesses that don\u2019t want to automate one workflow. They want an entire department\u2019s manual work replaced by a system that runs autonomously, scales infinitely, and improves the longer it operates.",
    icon: "full-department",
    useCases: [
      "Full marketing departments \u2014 creative, targeting, buying, reporting, optimisation",
      "Operations departments \u2014 procurement, scheduling, monitoring, compliance",
      "Customer support \u2014 triage, response, escalation, knowledge management",
      "Back-office functions \u2014 finance processing, HR admin, regulatory compliance",
      "Any function that currently depends on a team doing repeatable, structured work",
    ],
    problem:
      "Building a department is slow and expensive. You\u2019re looking at 6+ months to recruit, \u00a3150K+ per head for senior hires, another 3 months for onboarding, and then the ongoing cost of management, tools, and turnover. And even fully staffed, the department is limited by headcount \u2014 it doesn\u2019t scale without more hiring. A full department system runs the same functions with a coordinated team of agents. Each agent owns a specific role. They communicate, hand off work, escalate edge cases, and improve without being told to. Human oversight where it matters. Autonomous execution everywhere else.",
    approach: [
      {
        title: "Diagnose",
        desc: "We audit the entire function. Every role, every process, every handoff, every tool. We identify which parts can be handled by agents and which genuinely need humans.",
      },
      {
        title: "Architect",
        desc: "We design the full agent team \u2014 who does what, how they coordinate, what the escalation paths are, and where human oversight plugs in.",
      },
      {
        title: "Build & Ship",
        desc: "We build and deploy the complete system in phases. Core agents first, expanding as the system proves itself on live operations.",
      },
      {
        title: "Compound",
        desc: "The department gets better every month. Agents learn from every cycle, coverage expands to adjacent processes, and the CEO Agent monitors the whole thing from above.",
      },
    ],
    ctaHeading: "You know that department you\u2019ve been meaning to build?",
    ctaBody:
      "30 minutes. We\u2019ll look at the function you\u2019re trying to scale and tell you exactly what a system would look like to run it.",
  },
];
export const useCases: UseCase[] = [
  {
    slug: "recruitment-outbound",
    title: "Recruitment Outbound Lead Engine",
    sector: "Recruitment",
    systemType: "Revenue Operations",
    subtext:
      "A founder-led recruitment agency whose pipeline only fills when the partners find time to do outbound themselves.",
    problem:
      "The desk fills when someone does outbound, and the people who do it well are the same people billing. Heads-down on placements, the pipeline dries up; chasing pipeline, delivery slips. Junior BDRs haven\u2019t worked \u2014 the approach is too consultative to hand to someone who doesn\u2019t know the market. And the signals that a company is about to hire \u2014 a funding round, a new office, a director posting that they\u2019re drowning \u2014 are all public, but nobody has the time to watch for them.",
    agents: [
      {
        name: "Scout",
        description:
          "Watches for the signals a company is about to hire \u2014 funding, expansion, role posts, hiring-pain posts \u2014 across LinkedIn and the web, identifies the decision-maker, and hands over a scored, ready-to-approach pipeline every day.",
      },
      {
        name: "Outreach",
        description:
          "Runs personalised, signal-tied approaches in the partners\u2019 voice across email and LinkedIn, reads the replies, and passes the team only the warm conversations \u2014 never a list to work through.",
      },
      {
        name: "Strategist",
        description:
          "Reads which messages, sectors, and triggers are converting and turns that into what to say next week, so the engine sharpens instead of going stale.",
      },
      {
        name: "Producer",
        description:
          "Keeps a steady flow of sector content and thought-leadership going out, so the firm is already warm in the market before the first message lands.",
      },
      {
        name: "CEO Agent",
        description:
          "Sits above the engine and tells the founders which roles, sectors, and signals are actually turning into placements \u2014 and where to point it next.",
      },
    ],
    estimatedImpact:
      "A pipeline that keeps moving whether or not the partners have a free afternoon, outbound running every day in the firm\u2019s voice, and the founders back on billing instead of prospecting. Live within weeks, sharper every month.",
    ctaHeading: "Pipeline only when someone finds the time?",
    ctaBody:
      "Tell us about your desk and we\u2019ll map the outbound engine that would keep it full \u2014 a plan you can keep whether you build it with us or not.",
  },
  {
    slug: "property-acquisition",
    title: "Property Acquisition Intelligence",
    sector: "Property Development",
    systemType: "Intelligence",
    subtext:
      "A small-site developer competing for land where the best deals are gone before they\u2019re ever listed.",
    problem:
      "Finding the right sites is a full-time job nobody has the time to do full-time. The good opportunities move through broker networks and relationships before they hit the portals, and by the time a listing appears the margin is gone. Every promising plot still needs hours of work \u2014 comparables, build-cost assumptions, planning history, whether the local authority would even entertain the scheme \u2014 before it\u2019s worth a viewing. So plots get missed, assessed too slowly, or chased when the numbers were never there.",
    agents: [
      {
        name: "Scout",
        description:
          "Watches broker feeds, listing portals, and off-market sources for sites that match the buy-box, and surfaces them the day they appear instead of weeks later.",
      },
      {
        name: "Analyst",
        description:
          "Models each plot \u2014 comparables, build cost, margin, planning precedent, local-authority appetite \u2014 and tells you which ones are worth your time before you spend any.",
      },
      {
        name: "Operations",
        description:
          "Chases the agent, books the viewings, and keeps every live opportunity moving so nothing slips between finding it and acting on it.",
      },
      {
        name: "CEO Agent",
        description:
          "Sits above the pipeline and spots which areas, deal types, and sources are actually producing margin \u2014 and where to point the search next.",
      },
    ],
    estimatedImpact:
      "More of the right sites seen earlier, fewer hours lost on plots that were never going to work, and a clear read on where the margin actually is. Live within weeks, with a sharper buy-box every month.",
    ctaHeading: "Losing the good sites before they\u2019re listed?",
    ctaBody:
      "Tell us your buy-box and we\u2019ll map the acquisition system that would surface and score sites for you \u2014 whether you build it with us or not.",
  },
  {
    slug: "membership-operations",
    title: "Membership & Community Operations",
    sector: "Membership & Community",
    systemType: "Full Department",
    subtext:
      "A growing membership community whose admin scales faster than the small team running it.",
    problem:
      "The community is the product, and the work of running it grows with every member added \u2014 answering people across every channel, handling renewals, organising events, managing the waitlist, onboarding new joiners. It\u2019s spread across email, WhatsApp, an app, and a few people\u2019s heads. Members wait hours for answers that should take seconds, renewals slip because nobody chased them, and the founder gets pulled into operational detail instead of growing the thing.",
    agents: [
      {
        name: "Front Desk",
        description:
          "Answers members on whatever channel they use \u2014 access, billing, events, the questions they ask every day \u2014 instantly and around the clock, and only escalates what genuinely needs a person.",
      },
      {
        name: "Operations",
        description:
          "Runs renewals, event logistics, the waitlist, and new-member onboarding end to end, so nothing depends on someone remembering to do it.",
      },
      {
        name: "Outreach",
        description:
          "Runs new-member and partner acquisition in the brand\u2019s voice, so growth doesn\u2019t stall every time the team is busy operating.",
      },
      {
        name: "Analyst",
        description:
          "Tracks engagement, churn risk, and what members actually use, and flags who\u2019s about to lapse while there\u2019s still time to act.",
      },
      {
        name: "CEO Agent",
        description:
          "Sits above the whole operation and tells the founder what\u2019s working, what\u2019s slipping, and where the next bit of growth is hiding.",
      },
    ],
    estimatedImpact:
      "Members answered in seconds, renewals that chase themselves, events and onboarding that run without the founder in the loop, and an early read on who\u2019s about to lapse. Live within weeks, more capable every month.",
    ctaHeading: "Admin growing faster than the team?",
    ctaBody:
      "Tell us how your community runs today and we\u2019ll map the system that would operate it \u2014 whether you build it with us or not.",
  },
  {
    slug: "professional-services-backoffice",
    title: "A Back Office That Runs Itself",
    sector: "Professional Services",
    systemType: "Cost Reduction",
    subtext:
      "An accountancy and advisory firm carrying a back office that grows with every client but adds nothing to the top line.",
    problem:
      "Every new client adds admin \u2014 onboarding, chasing documents, entering data across systems that don\u2019t talk to each other, following up invoices, answering the same client questions again and again. It\u2019s necessary work that wins no new business, and it\u2019s either eating the team\u2019s billable hours or forcing another back-office hire that\u2019s pure cost. Most of the information needed to handle it already lives in the firm\u2019s systems; nobody has the time to move it around.",
    agents: [
      {
        name: "Operations",
        description:
          "Runs onboarding, document chasing, approvals, data syncing between tools, and invoice follow-up end to end \u2014 the admin that happens between people and systems.",
      },
      {
        name: "Analyst",
        description:
          "Reconciles the numbers, flags what\u2019s overdue or off, and produces the reports the partners used to assemble by hand.",
      },
      {
        name: "Front Desk",
        description:
          "Answers the routine client questions \u2014 status, documents, billing \u2014 instantly, and routes everything else to the right person with full context attached.",
      },
      {
        name: "CEO Agent",
        description:
          "Sits above it and shows the partners where time and margin are actually going, and which processes are quietly costing the most.",
      },
    ],
    estimatedImpact:
      "The repetitive back office handled around the clock, billable hours handed back to the fee-earners, and the next admin hire deferred or avoided. Live within weeks, with more of the work absorbed every month.",
    ctaHeading: "Paying fee-earners to do admin?",
    ctaBody:
      "Tell us where the manual work piles up and we\u2019ll map the system that would absorb it \u2014 and what it would save you, whether you build it with us or not.",
  },
];

export const processSteps: ProcessStep[] = [
  {
    number: 1,
    title: "Prescribe",
    description:
      "We show you what a business like yours runs and prescribe the agents that fit. No blank page, no menu to self-architect.",
  },
  {
    number: 2,
    title: "Tailor",
    description:
      "We configure what each agent does inside your operation: what it reads, what it writes, what it decides. You see the whole system before we build.",
  },
  {
    number: 3,
    title: "Build",
    description:
      "We build every agent and connect it to your live tools and data. You watch it come together.",
  },
  {
    number: 4,
    title: "Deploy",
    description:
      "The system goes live in your environment, on real data, making real decisions. Results in the first weeks.",
  },
  {
    number: 5,
    title: "Compound",
    description:
      "We operate it from here. It learns every cycle, we tune it, and it gets more valuable the longer it runs.",
  },
];

export const metrics: Metric[] = [
  { value: "24/7", label: "Operated around the clock", numericValue: 24 },
  { value: "100%", label: "Runs in your environment", numericValue: 100 },
  { value: "Weeks", label: "From build to live", numericValue: 0 },
  { value: "Every month", label: "It gets more valuable", numericValue: 0 },
];

export const agents: Agent[] = [
  {
    name: "CEO Agent",
    role: "The synthesis layer",
    description:
      "Sits above every agent. Reads across the whole operation, spots the cross-department patterns no single team can see, and answers the questions you’d put to a great operator. Always included.",
    group: "ceo",
    icon: "ceo",
  },
  {
    name: "Operations",
    role: "The doer",
    description:
      "Runs the multi-step work across your tools: approvals, onboarding, data syncing, chasing, reminders. The admin between humans and systems.",
    group: "core",
    icon: "operations",
  },
  {
    name: "Analyst",
    role: "The intelligence layer",
    description:
      "Reads across your data to find patterns, run reports, and flag what’s off. On schedule or on demand.",
    group: "core",
    icon: "analyst",
  },
  {
    name: "Scout",
    role: "The finder",
    description:
      "Scours where your prospects, candidates, or opportunities show up, enriches and scores them, and hands over a clean pipeline.",
    group: "core",
    icon: "scout",
  },
  {
    name: "Outreach",
    role: "The opener",
    description:
      "Personalised outbound at scale across email, DM, and SMS. Reads the replies, tailors every touch.",
    group: "core",
    icon: "outreach",
  },
  {
    name: "Strategist",
    role: "The signal-reader",
    description:
      "Spots what’s working in your market and your outbound, and turns it into what to say next.",
    group: "core",
    icon: "strategist",
  },
  {
    name: "Producer",
    role: "The maker",
    description:
      "Generates the content the operation runs on: copy, posts, reports, briefings. In your voice, on cadence.",
    group: "core",
    icon: "producer",
  },
  {
    name: "Front Desk",
    role: "The front of house",
    description:
      "Handles inbound conversations on any channel, chat or voice, and actually completes things: books, answers, resolves. Runs on its own, so it stands alone or bolts onto any system.",
    group: "frontdesk",
    icon: "frontdesk",
  },
];

export const tiers: Tier[] = [
  {
    name: "Start",
    composition: "CEO Agent + 2 specialists",
    blurb:
      "The few agents that move the needle first, with the CEO Agent reading across them from day one.",
  },
  {
    name: "Grow",
    composition: "CEO Agent + 4 specialists",
    blurb:
      "More of the operation handed over to the system as it proves itself.",
  },
  {
    name: "Full operation",
    composition: "CEO Agent + the full specialist core",
    blurb:
      "The whole operation running as one coordinated system. Add Front Desk when you want customer-facing front of house.",
  },
];
