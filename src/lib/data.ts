import type { Service, UseCase, ProcessStep, Metric } from "@/types";

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
    slug: "property-cost-reduction",
    title: "Commercial Property Portfolio",
    sector: "Real Estate",
    systemType: "Cost Reduction",
    subtext:
      "A property manager running 12 commercial buildings with manual energy monitoring, tenant communication, and maintenance scheduling.",
    problem:
      "Twelve buildings, each with its own utility accounts, maintenance contractors, and tenant communication channels. Energy costs are the biggest controllable expense but nobody\u2019s monitoring consumption in real time \u2014 bills arrive monthly with no granularity. Maintenance requests come in by email and phone, get triaged manually, and contractors are scheduled by one overwhelmed operations manager. Tenant queries about access, billing, and services are handled by a small team that\u2019s always behind.",
    agents: [
      {
        name: "Energy Agent",
        description:
          "Monitors consumption across all 12 buildings in real time. Flags anomalies within hours \u2014 a unit left heating overnight, a system running inefficiently, usage patterns that don\u2019t match occupancy. Attributes costs by building, floor, and tenant.",
      },
      {
        name: "Maintenance Agent",
        description:
          "Receives requests from any channel (email, portal, phone transcript), categorises by urgency and type, schedules contractors based on availability and proximity, and follows up until completion. Escalates only what needs human judgement.",
      },
      {
        name: "Tenant Communication Agent",
        description:
          "Handles routine queries about access, billing, policies, and services. Responds within minutes, not days. Escalates complex issues with full context attached.",
      },
      {
        name: "CEO Agent",
        description:
          "Looks across all 12 buildings to identify portfolio-wide patterns. Which buildings are most cost-efficient? Where is maintenance spend trending upward? Which tenants are at risk of churn based on complaint patterns? Surfaces strategic recommendations monthly.",
      },
    ],
    estimatedImpact:
      "Measurable energy cost reduction across the portfolio. Maintenance response time from days to hours. Tenant query resolution from days to minutes. System live within weeks.",
    ctaHeading: "Managing multiple properties with manual processes?",
    ctaBody:
      "30 minutes. We\u2019ll look at your portfolio and show you what a system would surface across every building.",
  },
  {
    slug: "professional-services-revenue",
    title: "Consultancy Pipeline Automation",
    sector: "Professional Services",
    systemType: "Revenue Operations",
    subtext:
      "A 40-person consultancy generating leads through manual LinkedIn outreach and referrals. Pipeline unpredictable. Growth bottlenecked by partner capacity.",
    problem:
      "The firm\u2019s pipeline depends on three partners doing their own outreach. When they\u2019re busy on client work, pipeline dries up. When they focus on business development, delivery suffers. They\u2019ve tried hiring BDRs but the sales cycle is too consultative \u2014 junior hires can\u2019t qualify properly. The firm has a clear ICP but no system to find, engage, and qualify prospects consistently.",
    agents: [
      {
        name: "Prospecting Agent",
        description:
          "Identifies ideal clients from market signals, company news, hiring patterns, and LinkedIn activity. Builds a qualified pipeline without human research.",
      },
      {
        name: "Outreach Agent",
        description:
          "Runs personalised multi-channel sequences (email + LinkedIn) tailored to each prospect\u2019s situation. Not templates \u2014 genuinely contextual messaging.",
      },
      {
        name: "Qualification Agent",
        description:
          "Scores inbound and outbound leads based on the firm\u2019s actual conversion patterns. Routes high-intent leads to partners, nurtures the rest automatically.",
      },
      {
        name: "Proposal Agent",
        description:
          "Drafts scoped responses using the firm\u2019s methodology, case studies, and pricing framework. Partners review and refine rather than write from scratch.",
      },
      {
        name: "CEO Agent",
        description:
          "Monitors pipeline health, flags when conversion rates drop, identifies which sectors and service lines are generating the most traction, and recommends where to focus.",
      },
    ],
    estimatedImpact:
      "Consistent pipeline independent of partner availability. Partners freed from manual outreach. System live within weeks.",
    ctaHeading:
      "What would your revenue look like if your pipeline never stopped moving?",
    ctaBody:
      "30 minutes. We\u2019ll audit your current operation and show you exactly where an agent system would outperform what you\u2019re running today.",
  },
  {
    slug: "ecommerce-marketing",
    title: "DTC Brand Marketing Department",
    sector: "E-Commerce",
    systemType: "Full Department",
    subtext:
      "A direct-to-consumer brand spending heavily on an in-house marketing team plus agency fees. Results plateauing.",
    problem:
      "The brand is spending tens of thousands per month on marketing between team salaries and agency fees. Campaign turnaround takes two weeks. Creative testing is slow \u2014 they run a handful of ad variations when they should be running dozens. Reporting is manual and always a week behind. By the time they see what\u2019s working, budget has already been spent on what isn\u2019t. They can\u2019t scale spend because the team can\u2019t move faster.",
    agents: [
      {
        name: "Creative Agent",
        description:
          "Generates ad variations in the brand\u2019s voice and visual style. Produces 20\u201330 variations where the team currently makes 3\u20134. Tests headlines, hooks, formats, and angles automatically.",
      },
      {
        name: "Targeting Agent",
        description:
          "Optimises audience segments across Meta, Google, and TikTok. Identifies which audiences are fatiguing, which new segments are emerging, and reallocates budget in real time.",
      },
      {
        name: "Budget Agent",
        description:
          "Manages spend allocation across channels and campaigns. Shifts budget toward highest-performing combinations daily, not weekly.",
      },
      {
        name: "Reporting Agent",
        description:
          "Produces daily performance summaries with actionable insights. No manual spreadsheet work. Surfaces what changed, why, and what to do about it.",
      },
      {
        name: "CEO Agent",
        description:
          "Connects marketing performance with business metrics. Identifies which products are trending, which customer segments have the highest LTV, which campaigns should be killed early, and where the next growth opportunity sits.",
      },
    ],
    estimatedImpact:
      "Dramatically reduced team and agency costs. Faster creative testing. Real-time optimisation replacing weekly reporting cycles. System live within weeks.",
    ctaHeading: "Spending more on marketing but seeing diminishing returns?",
    ctaBody:
      "30 minutes. We\u2019ll audit your current setup and show you what a full marketing department system would look like.",
  },
  {
    slug: "hospitality-operations",
    title: "Multi-Site Restaurant Operations",
    sector: "Hospitality",
    systemType: "Cost Reduction",
    subtext:
      "A hospitality group losing money on manual inventory, staff scheduling, and energy monitoring across multiple locations.",
    problem:
      "Six locations. Each one managing its own inventory by hand, building staff rotas on spreadsheets, and getting energy bills with no visibility into what\u2019s driving the cost. Head office gets reports weekly \u2014 by which point the waste has already happened. The data to fix all of this exists inside their POS systems, booking platforms, and utility accounts. Nobody\u2019s reading it in real time.",
    agents: [
      {
        name: "Procurement Agent",
        description:
          "Monitors stock levels across all sites, auto-generates purchase orders based on booking forecasts and historical consumption, eliminates over-ordering and waste.",
      },
      {
        name: "Energy Agent",
        description:
          "Reads smart meter data across all 6 locations, flags anomalies within hours (not months), attributes costs by site and time period, surfaces reduction opportunities.",
      },
      {
        name: "Scheduling Agent",
        description:
          "Builds staff rotas from booking data, historical covers, and labour cost targets. Balances demand coverage with budget constraints automatically.",
      },
      {
        name: "CEO Agent",
        description:
          "Sits above all three, identifies which locations are underperforming and why, spots patterns across sites, and surfaces strategic recommendations weekly.",
      },
    ],
    estimatedImpact:
      "Significant annual cost reduction across inventory, scheduling, and energy. System live within weeks.",
    ctaHeading: "Running multiple sites with manual processes?",
    ctaBody:
      "30 minutes. We\u2019ll look at your operation and show you where an agent system would cut costs across every location.",
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
