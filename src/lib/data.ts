import type { Service, CaseStudy, ProcessStep, Metric } from "@/types";

export const services: Service[] = [
  {
    slug: "agent-design",
    title: "AI Agent Design & Deployment",
    shortTitle: "Agent Design",
    description:
      "Custom agents designed for your specific workflows, data, and decision-making.",
    longDescription:
      "We build autonomous systems that sit inside your business and handle real work \u2014 routing decisions, processing data, coordinating across platforms. Not prototypes. Production systems that go live in weeks and keep improving the longer they run.",
    icon: "agent",
    useCases: [
      "Agents that process your data, make decisions, and act without manual oversight",
      "Multi-agent systems that coordinate across departments",
      "Always-on monitoring agents that flag issues before your team notices",
      "Deep integration with your existing stack \u2014 Slack, CRM, ERP, email, databases",
    ],
    problem:
      "Your operation runs on manual processes, tribal knowledge, and siloed data. You\u2019ve seen what AI can do but every conversation you\u2019ve had ends with a proposal and a timeline measured in quarters. You don\u2019t need another strategy deck. You need a system that\u2019s live and working.",
    approach: [
      {
        title: "Diagnose",
        desc: "We map your workflows, data sources, and decision points to find exactly where agents will have the biggest impact.",
      },
      {
        title: "Design",
        desc: "We architect the system \u2014 which agents, what each one handles, how they talk to each other, and what data they need.",
      },
      {
        title: "Build & Deploy",
        desc: "We build the agents, connect them to your platforms, and put them live in your environment with full monitoring.",
      },
      {
        title: "Improve",
        desc: "The system learns from every cycle. We tune, expand, and optimise as it surfaces patterns you didn\u2019t know to look for.",
      },
    ],
    relatedCaseStudy: "stockpilot",
    ctaHeading: "Let\u2019s scope your first agent system",
  },
  {
    slug: "ai-marketing",
    title: "AI-Powered Marketing",
    shortTitle: "AI Marketing",
    description:
      "Full-stack marketing operations run by coordinated AI agents.",
    longDescription:
      "Ad creation, audience targeting, campaign management, performance reporting \u2014 all handled by a system of specialised agents. They run your campaigns around the clock and optimise based on real performance data.",
    icon: "marketing",
    useCases: [
      "Ad creatives and copy generated to match your brand voice and audience",
      "Automated audience targeting and budget optimisation across platforms",
      "Content scheduling and calendar management on autopilot",
      "Real-time performance dashboards with automated reporting",
    ],
    problem:
      "Marketing at scale requires strategists, copywriters, designers, media buyers, and analysts. Even with a full team, campaign turnaround takes weeks. Reporting is manual. Optimisation is reactive. The model is expensive and slow.",
    approach: [
      {
        title: "Audit",
        desc: "We analyse your current marketing stack, spend, and performance to find where automation will move the needle fastest.",
      },
      {
        title: "Design",
        desc: "We architect the agent system \u2014 creative generation, targeting, buying, reporting \u2014 each agent specialised for its role.",
      },
      {
        title: "Build & Deploy",
        desc: "We connect to your ad platforms (Meta, Google, TikTok, LinkedIn), build the agents, and put the system live.",
      },
      {
        title: "Optimise",
        desc: "The agents refine targeting, creative, and spend allocation continuously. Performance improves week over week.",
      },
    ],
    relatedCaseStudy: "smma-pipeline",
    ctaHeading: "Ready to put your marketing on autopilot?",
  },
  {
    slug: "automation",
    title: "Process Automation",
    shortTitle: "Automation",
    description:
      "Inventory, lead routing, energy, documents \u2014 the operational work that bleeds time and money.",
    longDescription:
      "We take the processes your team spends hours on \u2014 inventory checks, lead follow-ups, energy monitoring, document processing \u2014 and build agent systems that handle them faster, cheaper, and around the clock.",
    icon: "automation",
    useCases: [
      "Lead scoring and conversion automation for sales teams",
      "Inventory and supply chain optimisation for retail and hospitality",
      "Energy monitoring and cost reduction for property portfolios",
      "Document processing and data extraction from unstructured sources",
    ],
    problem:
      "Inventory, lead routing, energy management, document handling \u2014 these processes are still run on spreadsheets, gut feel, and manual checks. Errors stack up. Revenue leaks out. The data to fix it exists, but nobody\u2019s reading it in real time.",
    approach: [
      {
        title: "Map",
        desc: "We document every step \u2014 inputs, decisions, outputs, exceptions \u2014 to understand exactly what needs to be automated.",
      },
      {
        title: "Connect",
        desc: "We build the data layer \u2014 APIs, webhooks, scrapers \u2014 so agents can read and act on live information.",
      },
      {
        title: "Build & Deploy",
        desc: "We deploy agents that monitor your data, make decisions based on your rules, and take action automatically.",
      },
      {
        title: "Expand",
        desc: "We track performance, handle edge cases, and expand the system as it proves itself on your operation.",
      },
    ],
    relatedCaseStudy: "energy-management",
    ctaHeading: "Let\u2019s automate what\u2019s costing you",
  },
  {
    slug: "consulting",
    title: "Strategic AI Consulting",
    shortTitle: "AI Consulting",
    description:
      "A clear-eyed audit of where AI fits in your business \u2014 and where it doesn\u2019t.",
    longDescription:
      "We look at your actual workflows and tell you honestly which ones are worth automating. No vendor bias. No generic playbook. Just a ranked list of your highest-value opportunities with a roadmap to build them.",
    icon: "consulting",
    useCases: [
      "Full audit of your operation \u2014 which processes cost the most and where agents would hit hardest",
      "Build vs buy analysis for agent systems and platforms",
      "A prioritised roadmap: what to build first, what to skip, and what it costs",
      "Team training and upskilling for AI adoption",
    ],
    problem:
      "Most businesses know AI matters but don\u2019t know where to start. They\u2019ve sat through vendor pitches for products that solve problems they don\u2019t have. What they actually need is someone who\u2019ll look at their real workflows and give them a straight answer.",
    approach: [
      {
        title: "Immerse",
        desc: "We spend time with your teams understanding how work actually gets done \u2014 the processes, the bottlenecks, the data.",
      },
      {
        title: "Rank",
        desc: "We identify every potential AI application, score each one by impact and feasibility, and rank them.",
      },
      {
        title: "Roadmap",
        desc: "We hand you a clear plan \u2014 what to build first, what to wait on, what to skip \u2014 with timelines and costs.",
      },
      {
        title: "Execute",
        desc: "If you want us to build it, we build it. If you want to build in-house, we help you hire and structure the team.",
      },
    ],
    ctaHeading: "Not sure where to start? We\u2019ll map it out.",
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
