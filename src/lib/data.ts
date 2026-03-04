import type { Service, CaseStudy, ProcessStep, Metric } from "@/types";

export const services: Service[] = [
  {
    slug: "agent-design",
    title: "AI Agent Design & Deployment",
    shortTitle: "Agent Design",
    description: "Custom-built AI agents tailored to your workflows, data, and business logic.",
    longDescription: "",
    icon: "agent",
    useCases: [],
    problem: "",
    approach: [],
    ctaHeading: "Ready to build your AI agent?",
  },
  {
    slug: "ai-marketing",
    title: "AI-Powered Marketing",
    shortTitle: "AI Marketing",
    description: "Intelligent ad management, content generation, and pipeline automation.",
    longDescription: "",
    icon: "marketing",
    useCases: [],
    problem: "",
    approach: [],
    ctaHeading: "Ready to supercharge your marketing?",
  },
  {
    slug: "automation",
    title: "Process Automation",
    shortTitle: "Automation",
    description: "From lead conversion to inventory management — AI that runs your operations.",
    longDescription: "",
    icon: "automation",
    useCases: [],
    problem: "",
    approach: [],
    ctaHeading: "Ready to automate your workflows?",
  },
  {
    slug: "consulting",
    title: "Strategic AI Consulting",
    shortTitle: "AI Consulting",
    description: "We audit your business and identify exactly where AI delivers the highest ROI.",
    longDescription: "",
    icon: "consulting",
    useCases: [],
    problem: "",
    approach: [],
    ctaHeading: "Ready for expert AI guidance?",
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
      "8 AI agents replacing traditional agency headcount",
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
    title: "Discovery",
    description:
      "You tell us the pain point. We diagnose the opportunity, map your workflows, and identify where AI will have the biggest impact.",
  },
  {
    number: 2,
    title: "Architecture",
    description:
      "We design the agent system — models, data flows, integrations, and deployment strategy. You approve before we write a line of code.",
  },
  {
    number: 3,
    title: "Build & Deploy",
    description:
      "We build it, test it, and deploy it into your environment. Live agents, working with your real data, in your real workflows.",
  },
  {
    number: 4,
    title: "Measure & Iterate",
    description:
      "We track ROI, gather feedback, and refine. Every agent gets smarter over time. You see the numbers move.",
  },
];

export const metrics: Metric[] = [
  { value: "12+", label: "Agents Deployed", numericValue: 12 },
  { value: "3", label: "Avg. Deployment Time", suffix: "wk", numericValue: 3 },
  {
    value: "40%+",
    label: "Average Client ROI Increase",
    numericValue: 40,
  },
  { value: "5+", label: "Industries Served", numericValue: 5 },
];
