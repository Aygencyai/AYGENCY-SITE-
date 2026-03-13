import type { Service, CaseStudy, ProcessStep, Metric } from "@/types";

export const services: Service[] = [
  {
    slug: "agent-design",
    title: "AI Agent Design & Deployment",
    shortTitle: "Agent Design",
    description:
      "Purpose-built agent systems that sit inside your operation, make decisions, and act \u2014 without waiting for a human in the loop.",
    longDescription:
      "We build production AI systems that operate inside your business \u2014 routing decisions, processing data, coordinating across departments, and learning as they go. Not proof-of-concepts. Not chatbots. Real systems, live in weeks, getting smarter every cycle.",
    icon: "agent",
    useCases: [
      "Agents that read your data, make decisions, and execute \u2014 no manual oversight needed",
      "Multi-agent systems where each agent owns a specific function and they coordinate with each other",
      "Monitoring agents that catch problems before your team even knows to look",
      "Plugs directly into what you already use \u2014 Slack, CRM, ERP, email, databases, spreadsheets",
    ],
    problem:
      "Your operation still runs on manual handoffs, tribal knowledge, and data sitting in silos that no one reads in real time. You\u2019ve had the AI conversations. You\u2019ve seen the demos. But every engagement you\u2019ve explored ends with a proposal, a six-month timeline, and a price that makes you question everything. You don\u2019t need another strategy deck. You need a system that works \u2014 running, learning, delivering value within weeks.",
    approach: [
      {
        title: "Map",
        desc: "We sit inside your operation and document the real workflows \u2014 not the org chart version. Data sources, decision points, handoffs, bottlenecks. We find exactly where agents will have the sharpest impact.",
      },
      {
        title: "Architect",
        desc: "We design the full agent system \u2014 which agents, what each one owns, how they communicate, what data they need, and what happens when something unexpected hits.",
      },
      {
        title: "Build & Ship",
        desc: "We build every agent, connect them to your live platforms, and deploy into your environment with full monitoring and alerting from day one.",
      },
      {
        title: "Compound",
        desc: "The system improves itself. We tune performance, expand coverage to adjacent workflows, and optimise as it surfaces patterns your team didn\u2019t know to look for.",
      },
    ],
    relatedCaseStudy: "stockpilot",
    ctaHeading: "Let\u2019s scope your first system",
  },
  {
    slug: "ai-marketing",
    title: "AI-Powered Marketing",
    shortTitle: "AI Marketing",
    description:
      "An entire marketing operation \u2014 creative, targeting, buying, reporting \u2014 run by a coordinated team of AI agents.",
    longDescription:
      "Ad creative, audience targeting, media buying, campaign management, performance reporting \u2014 all run by a coordinated system of specialised agents. They don\u2019t clock out. They optimise based on real performance data, not guesswork, and they get better with every campaign cycle.",
    icon: "marketing",
    useCases: [
      "Ad creatives and copy generated in your brand voice, tested and iterated automatically",
      "Audience targeting and budget allocation that optimises itself across Meta, Google, TikTok, LinkedIn",
      "Content scheduling, posting, and calendar management \u2014 fully autonomous",
      "Live performance dashboards that update in real time with zero manual reporting",
    ],
    problem:
      "Scaling marketing the traditional way means hiring strategists, copywriters, designers, media buyers, and analysts. Even fully staffed, campaign turnaround takes weeks. Reporting is manual. Optimisation is reactive \u2014 by the time you\u2019ve read the numbers, the spend is already gone. The model is expensive, slow, and breaks the moment you try to add more clients or more channels.",
    approach: [
      {
        title: "Audit",
        desc: "We break down your current stack, spend, creative process, and performance data to find the exact points where agents will move the needle fastest.",
      },
      {
        title: "Architect",
        desc: "We design the agent system \u2014 one agent for creative generation, one for targeting, one for buying, one for reporting, and so on. Each one specialised. All of them coordinated.",
      },
      {
        title: "Build & Ship",
        desc: "We plug into your ad platforms \u2014 Meta, Google, TikTok, LinkedIn \u2014 build every agent, and put the full system live in your environment.",
      },
      {
        title: "Compound",
        desc: "The agents refine targeting, rotate creative, reallocate budget, and learn from every campaign. Performance improves week over week \u2014 without anyone telling them to.",
      },
    ],
    relatedCaseStudy: "smma-pipeline",
    ctaHeading: "What would your marketing look like if it never stopped optimising?",
  },
  {
    slug: "automation",
    title: "Process Automation",
    shortTitle: "Automation",
    description:
      "The operational work your team shouldn\u2019t still be doing manually \u2014 inventory, lead routing, energy management, document processing \u2014 handled by agents that never drop a step.",
    longDescription:
      "The tasks your team spends hours on every week \u2014 inventory management, lead follow-up, energy monitoring, document processing, data entry \u2014 handled by agent systems that run faster, cost less, and never miss a step.",
    icon: "automation",
    useCases: [
      "Lead scoring, follow-up sequencing, and conversion tracking that runs without your sales team touching it",
      "Inventory and procurement agents that eliminate waste, over-ordering, and stockouts",
      "Energy monitoring across sites \u2014 anomalies flagged, costs attributed, savings surfaced automatically",
      "Document intake, data extraction, and routing from unstructured sources at any volume",
    ],
    problem:
      "These processes still run on spreadsheets, gut calls, and manual checks done by people who have better things to do. Errors compound. Revenue leaks. The data you need to fix it already exists inside your systems \u2014 but nobody\u2019s reading it in real time, and nobody has the bandwidth to act on it fast enough.",
    approach: [
      {
        title: "Map",
        desc: "We document every step of the process as it actually happens \u2014 inputs, decisions, handoffs, outputs, exceptions, and the workarounds nobody talks about.",
      },
      {
        title: "Connect",
        desc: "We build the data layer \u2014 APIs, webhooks, scrapers, database connections \u2014 so agents can read live information and act on it in real time.",
      },
      {
        title: "Build & Ship",
        desc: "We deploy agents that monitor your live data, make decisions based on your rules and thresholds, and take action automatically \u2014 flagging, routing, ordering, alerting, reporting.",
      },
      {
        title: "Expand",
        desc: "As the system proves itself, we expand. New workflows, new edge cases handled, new integrations. The system grows with your operation.",
      },
    ],
    relatedCaseStudy: "energy-management",
    ctaHeading: "Every manual process is a cost you\u2019ve just stopped noticing",
  },
  {
    slug: "consulting",
    title: "Strategic AI Consulting",
    shortTitle: "AI Consulting",
    description:
      "A no-nonsense audit of your operation. We tell you exactly where agents will hit hardest, what to build first, and what isn\u2019t worth automating.",
    longDescription:
      "We audit your real workflows and give you a straight answer on which ones are worth automating, which ones aren\u2019t, and what it would cost to build. No vendor bias. No generic playbook. Just a ranked list of your highest-value opportunities and a clear roadmap to execute.",
    icon: "consulting",
    useCases: [
      "Complete audit \u2014 which processes cost you the most, where agents would deliver the highest ROI",
      "Build vs buy analysis so you know when custom agents beat off-the-shelf tools",
      "A ranked roadmap: what to build now, what to revisit later, what to skip entirely \u2014 with costs attached",
      "Internal training so your team understands the systems and can work alongside them",
    ],
    problem:
      "Most businesses know AI matters. Most also have no idea where to start. They\u2019ve sat through vendor pitches for products that solve problems they don\u2019t have, sat through demos that look nothing like their actual operation, and walked away more confused than when they started. What they need is someone who\u2019ll look at the real workflows, ignore the noise, and give them a straight answer.",
    approach: [
      {
        title: "Immerse",
        desc: "We spend time with your teams \u2014 not just leadership. We watch how work actually gets done on the ground. The processes, the bottlenecks, the manual steps nobody\u2019s questioned.",
      },
      {
        title: "Rank",
        desc: "We identify every opportunity for automation, score each one by financial impact and implementation feasibility, and rank them. You\u2019ll see exactly where the money is.",
      },
      {
        title: "Roadmap",
        desc: "You get a clear, prioritised plan \u2014 what to build first, what to phase in later, what to skip entirely \u2014 with realistic timelines and honest costs.",
      },
      {
        title: "Execute",
        desc: "If you want us to build it, we\u2019ll build it. If you want to build in-house, we\u2019ll help you hire and structure the right team. Either way, you leave with a plan that actually works.",
      },
    ],
    ctaHeading: "The most expensive AI mistake is building the wrong thing first",
  },
];
export const caseStudies: CaseStudy[] = [
  {
    slug: "stockpilot",
    title: "StockPilot",
    client: "Premium London Restaurant & Members Club",
    industry: "Hospitality",
    service: "Process Automation & Operational AI",
    challenge:
      "Manual inventory management across a high-volume, multi-outlet venue was creating waste, over-ordering, and stockouts during peak service. Staff were spending 10+ hours per week on procurement tasks that could be systematised.",
    solution:
      "Aygency designed and deployed StockPilot — a two-agent AI system. Agent 1 monitors real-time inventory levels, consumption patterns, and waste data. Agent 2 handles automated procurement recommendations, supplier communication, and reorder triggers. The system integrates directly with the venue's existing POS and supplier platforms.",
    results: [
      "Procurement time reduced by 80%",
      "Food waste reduced by 25% in first month",
      "Stockout incidents reduced to near-zero",
      "System live within 3 weeks of engagement",
    ],
    quote:
      "We went from guessing to knowing. The system paid for itself in the first month.",
    quoteAttribution: "Operations Director",
    tech: [
      "Custom AI agents",
      "POS integration",
      "Supplier API connections",
      "Real-time monitoring dashboard",
    ],
    keyMetric: { value: "80%", label: "Reduction in procurement time" },
  },
  {
    slug: "energy-management",
    title: "Energy & Utilities Agent",
    client: "Multi-Site UK Property Operator",
    industry: "Real Estate",
    service: "Process Automation & Operational AI",
    challenge:
      "A property operator managing multiple sites across the UK had no centralised visibility into energy consumption. Utility costs were rising with no clear attribution to specific buildings, systems, or usage patterns.",
    solution:
      "Aygency built an AI-powered energy monitoring agent that aggregates consumption data across all sites, identifies anomalies and waste patterns, benchmarks buildings against each other, and generates actionable recommendations for cost reduction.",
    results: [
      "Full energy visibility across all sites within 2 weeks",
      "Identified 15-20% potential cost savings in first audit",
      "Anomaly detection flagged faulty HVAC systems within days",
      "Automated reporting eliminated 8+ hours of manual work per month",
    ],
    quote:
      "For the first time, we could see exactly where every pound was going — and where it was being wasted.",
    quoteAttribution: "Head of Operations",
    tech: [
      "Energy data aggregation",
      "Anomaly detection AI",
      "Automated reporting",
      "Multi-site benchmarking",
    ],
    keyMetric: { value: "15-20%", label: "Potential cost savings identified" },
  },
  {
    slug: "smma-pipeline",
    title: "AI-Native SMMA Pipeline",
    client: "Internal Capability / White-Label",
    industry: "Digital Marketing",
    service: "AI-Powered Marketing & Ads",
    challenge:
      "Traditional social media marketing agencies run on headcount — account managers, creatives, media buyers, analysts. This model doesn't scale and margins compress as client rosters grow.",
    solution:
      "Aygency architected an eight-agent AI system that replaces the core functions of a traditional SMMA. Agents handle ad creative generation, audience targeting, media buying optimisation, performance analytics, client communication, content scheduling, A/B testing orchestration, and pipeline management.",
    results: [
      "8 specialised agents operating across the full marketing pipeline",
      "Ad creative turnaround reduced from days to minutes",
      "Real-time performance optimisation with no manual intervention",
      "Scalable to 20+ concurrent client accounts",
    ],
    quote:
      "This isn't an agency with AI tools. It's an AI system that happens to be an agency.",
    quoteAttribution: "Founder",
    tech: [
      "Multi-agent orchestration",
      "Ad platform API integration",
      "Generative AI for creatives",
      "Automated reporting pipelines",
    ],
    keyMetric: { value: "8", label: "AI agents deployed" },
  },
];

export const processSteps: ProcessStep[] = [
  {
    number: 1,
    title: "Diagnose",
    description:
      "We learn your operation inside out \u2014 the workflows, the bottlenecks, the data. We need to understand the problem before we propose anything.",
  },
  {
    number: 2,
    title: "Design",
    description:
      "We architect the system: which agents, what each one handles, how they coordinate, and what integrations they need. You approve the blueprint before we start building.",
  },
  {
    number: 3,
    title: "Build",
    description:
      "We develop the agents, connect them to your platforms, and test everything against your real data and edge cases.",
  },
  {
    number: 4,
    title: "Go Live",
    description:
      "The system starts operating in your environment. We monitor closely, catch issues early, and tune performance in the first weeks.",
  },
  {
    number: 5,
    title: "Get Smarter",
    description:
      "This is what sets agent systems apart. They learn from every cycle. By month three, the system is outperforming the original spec.",
  },
];

export const metrics: Metric[] = [
  { value: "12+", label: "Agents Deployed", numericValue: 12 },
  { value: "3", label: "Avg. Deployment Time", suffix: "wk", numericValue: 3 },
  {
    value: "80%",
    label: "Reduction in procurement time",
    numericValue: 80,
  },
  { value: "5+", label: "Industries Served", numericValue: 5 },
];
