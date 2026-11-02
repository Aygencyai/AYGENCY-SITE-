import type { Service, UseCase, ProcessStep, Metric, Agent, Tier } from "@/types";

export const services: Service[] = [
  {
    slug: "cost-reduction",
    title: "Cost Reduction Systems",
    shortTitle: "Cost Reduction",
    description:
      "Agent systems that take over the expensive manual work draining your operation. The cost is fixed. The savings keep stacking up.",
    longDescription:
      "Every business has work that costs too much because it depends on people doing the same repetitive thing over and over. We build agent systems that take those workflows off your plate for good, at a fraction of the cost, running around the clock.",
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
      "You already know which jobs are expensive. The stock counted by hand, the report stitched together from five spreadsheets, the same figures keyed into two systems that don’t talk, the invoices worked through one by one. You’ve lived with the cost because the alternative, building software or hiring more people, felt worse. It isn’t anymore.",
    approach: [
      {
        title: "Map",
        desc: "We document the process the way it actually runs. Every input, decision, handoff, and the workarounds nobody mentions. That’s how we find where the cost really lives.",
      },
      {
        title: "Architect",
        desc: "We design the system. Which agents own which steps, what data they need, how they hand off, and what happens at the edges.",
      },
      {
        title: "Build & Ship",
        desc: "We build every agent, connect them to your live systems, and put it into your environment with full monitoring from day one.",
      },
      {
        title: "Compound",
        desc: "It gets more efficient on its own. It learns your patterns, catches the exceptions faster, and turns up savings you didn’t know were there.",
      },
    ],
    ctaHeading: "Every manual process is a cost you’ve stopped noticing",
    ctaBody:
      "30 minutes. We’ll find the work that’s quietly bleeding time and money, and show you what a system would do about it.",
    faqs: [
      {
        q: "What back-office work can AI agents take over?",
        a: "The repetitive admin that slows a business down and stops it scaling: document processing and data entry, invoice processing and reconciliation, inventory monitoring, reporting, and scheduling. If people do the same thing over and over, it is usually a good candidate.",
      },
      {
        q: "How is this different from a simple automation tool?",
        a: "Automation follows fixed steps and breaks or quietly goes wrong when the input changes. An agent system reads the situation, handles the exceptions, and pulls in a person when something genuinely needs one.",
      },
      {
        q: "Do we have to change how we work?",
        a: "No. We design the agents around the way your business already runs and connect them to the systems you already use, so your team keeps working the way it does today.",
      },
      {
        q: "How do the agents know how our business works?",
        a: "We start by learning your real workflows and pain points, then design each agent to do its part the way an employee would, but faster and to a better standard.",
      },
      {
        q: "How do you find where the savings are?",
        a: "We start by mapping the process the way it actually runs, including the handoffs and workarounds nobody mentions. That shows where the cost really lives and which agents to build first.",
      },
    ],
  },
  {
    slug: "revenue-operations",
    title: "Revenue Operations Systems",
    shortTitle: "Revenue Ops",
    description:
      "Agent systems that don’t just save money, they go and find it. Pipeline, outreach, qualification, conversion, run by agents that never clock off.",
    longDescription:
      "Agent systems that find, qualify, and convert revenue across your business. They run the outreach, manage the pipeline, tune the pricing, and scale campaigns without you adding headcount.",
    icon: "revenue-operations",
    useCases: [
      "Lead prospecting and enrichment from market signals, social data, and intent data",
      "Multi-channel outreach across email, LinkedIn, and calls, personalised and sequenced automatically",
      "Lead qualification and scoring based on your actual conversion patterns",
      "Sales pipeline management, follow-up automation, and deal tracking",
      "Dynamic pricing systems that adjust to demand, competition, and margin targets",
      "Marketing campaigns across Meta, Google, TikTok, and LinkedIn, from creative to targeting to budget and reporting",
    ],
    problem:
      "Your revenue engine runs on people, and people take holidays, miss follow-ups, forget to update the CRM, and only have so many hours. Your competitors are scaling their outreach and their conversion with systems instead of headcount. The businesses growing fastest right now aren’t hiring more salespeople. They’re deploying agents.",
    approach: [
      {
        title: "Audit",
        desc: "We break down how revenue works for you today. Where leads come from, how they get qualified, what converts, and where deals quietly die.",
      },
      {
        title: "Architect",
        desc: "We design the system. One agent prospects, one runs outreach, one qualifies, one keeps the pipeline moving. Each one specialised, all of them coordinated.",
      },
      {
        title: "Build & Ship",
        desc: "We plug into your platforms, build every agent, and deploy the full system into your environment.",
      },
      {
        title: "Compound",
        desc: "The agents learn from every campaign, every deal, every reply. They sharpen the targeting, rotate the messaging, and move spend to what’s working, on their own.",
      },
    ],
    ctaHeading:
      "What would your revenue look like if your pipeline never stopped moving?",
    ctaBody:
      "30 minutes. We’ll look at how you sell today and show you where an agent system would outwork it.",
    faqs: [
      {
        q: "What does a revenue operations system do?",
        a: "It runs the work that brings revenue in: prospecting and enrichment, outreach across email, LinkedIn, and calls, lead qualification, pipeline management and follow-up, and campaign management.",
      },
      {
        q: "Will the outreach sound like us?",
        a: "Yes. Outreach agents write in your voice, read the replies, and pass your team the warm conversations.",
      },
      {
        q: "Do we still need salespeople?",
        a: "Your people stay on the conversations and deals that matter. The agents take on the prospecting, follow-ups, and pipeline admin that usually slip when the team is busy.",
      },
      {
        q: "Do we have to change how our sales team works?",
        a: "No. The agents plug into the platforms you already use and fit around how your team sells today.",
      },
    ],
  },
  {
    slug: "intelligence",
    title: "Intelligence & Oversight Systems",
    shortTitle: "Intelligence",
    description:
      "A system that sits above the whole operation, sees every number, and finds the openings nobody has time to look for. This is where the CEO Agent lives.",
    longDescription:
      "Most businesses already have the data to make better decisions. The problem isn’t getting at it. It’s that nobody has the time to read all of it, join the dots, and act before the moment’s gone. This is the system that does.",
    icon: "intelligence",
    useCases: [
      "Cross-department data aggregation and pattern detection",
      "Revenue opportunity identification from operational data",
      "Anomaly detection across financial, operational, and customer data",
      "Competitive intelligence monitoring and market signal tracking",
      "Automated strategic reporting with actionable recommendations",
      "The CEO Agent, a dedicated agent that thinks at the business level and tells you what’s working, what’s breaking, and what to do next",
    ],
    problem:
      "Your data sits in silos. Sales knows its numbers, marketing knows its metrics, operations knows its costs, and nobody sees all of it at once. Nobody’s joining the spike in complaints to the supplier you switched last month to the margin drop this quarter. That isn’t a people problem. There’s simply too much moving too fast for anyone to track by hand. A system built for oversight watches all of it, in real time, and tells you what matters.",
    approach: [
      {
        title: "Immerse",
        desc: "We get to know the whole operation, not one department but all of them. How the data flows, where it gets stuck, and which decisions hang on it.",
      },
      {
        title: "Architect",
        desc: "We design the intelligence layer. Which sources feed in, what patterns to watch, what trips an alert, and how the insight reaches the right person.",
      },
      {
        title: "Build & Ship",
        desc: "We build the system, connect every data source, and deploy with real-time dashboards and alerting.",
      },
      {
        title: "Compound",
        desc: "The system learns what matters to you. It stops flagging noise and starts surfacing the signals that move the needle. By month six it’s seeing things month one couldn’t.",
      },
    ],
    ctaHeading:
      "What would you do if you could see your entire operation in real time?",
    ctaBody:
      "30 minutes. We’ll look at your data and show you what an intelligence system would surface.",
    faqs: [
      {
        q: "What is the CEO Agent?",
        a: "A dedicated agent that sits above every other agent, reads across the whole operation, and tells you what is working, what is breaking, and what to do next. It is included in every system we build.",
      },
      {
        q: "What data does an intelligence system use?",
        a: "The data you already have across sales, marketing, operations, and finance. We connect those sources so the system can spot patterns and anomalies no single team can see.",
      },
      {
        q: "Is this just another dashboard?",
        a: "No. It includes real-time dashboards and alerts, but the point is recommendations. Over time it learns what matters to you, flags less noise, and surfaces the signals that move the needle.",
      },
      {
        q: "Where does our data go?",
        a: "It stays in your environment. Your data never trains external models and is handled to UK GDPR standards.",
      },
    ],
  },
  {
    slug: "full-department",
    title: "Full Department Systems",
    shortTitle: "Full Departments",
    description:
      "A whole function, marketing, operations, or support, run by a coordinated team of agents, with people in the loop only where it counts.",
    longDescription:
      "For businesses that don’t want to automate one workflow. They want a whole department’s worth of manual work handled by a system that runs on its own, scales without hiring, and gets better the longer it operates.",
    icon: "full-department",
    useCases: [
      "Full marketing departments, from creative to targeting to buying to reporting",
      "Operations departments: procurement, scheduling, monitoring, compliance",
      "Customer support: triage, response, escalation, knowledge management",
      "Back-office functions: finance processing, HR admin, regulatory compliance",
      "Any function that currently depends on a team doing repeatable, structured work",
    ],
    problem:
      "Building a department is slow and expensive. Six months or more to recruit, £150K and up per senior hire, another three months to onboard, then the running cost of managing, tooling, and turnover. Even fully staffed it’s capped by headcount, so it can’t grow without you hiring again. A full department system runs the same work with a coordinated team of agents. Each one owns a role. They talk to each other, hand off work, escalate the edge cases, and improve as they go. People where it matters, agents everywhere else.",
    approach: [
      {
        title: "Diagnose",
        desc: "We audit the whole function. Every role, process, handoff, and tool. Then we work out what agents can own and what genuinely needs a person.",
      },
      {
        title: "Architect",
        desc: "We design the full team. Who does what, how they coordinate, where work escalates, and where a person plugs in.",
      },
      {
        title: "Build & Ship",
        desc: "We build and deploy in phases. Core agents first, then more as the system proves itself on live work.",
      },
      {
        title: "Compound",
        desc: "The department gets better every month. The agents learn from every cycle, take on adjacent work, and the CEO Agent watches the whole thing from above.",
      },
    ],
    ctaHeading: "You know that department you’ve been meaning to build?",
    ctaBody:
      "30 minutes. We’ll look at the function you’re trying to scale and show you what a system to run it would look like.",
    faqs: [
      {
        q: "Which departments can be run by agents?",
        a: "Marketing, operations, customer support, and back-office work such as finance processing, HR admin, and compliance. Any function that depends on a team doing repeatable, structured work is a candidate.",
      },
      {
        q: "Who stays in control?",
        a: "You do. Agents do the work, edge cases escalate, and high-impact actions come to a person for approval before they happen, so you stay in control from one place.",
      },
      {
        q: "Is there a limit on how many agents we can have?",
        a: "No. We start with the agents that remove your biggest bottlenecks, then add more as the system proves itself.",
      },
      {
        q: "Do you build the whole department at once?",
        a: "No. We build and deploy in phases: core agents first, then more as the system proves itself on live work.",
      },
      {
        q: "What happens after it goes live?",
        a: "We keep operating it. We monitor, tune, and catch edge cases every month, and the system takes on more of the work as it learns.",
      },
    ],
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
      "The desk fills when someone does outbound, and the people who do it well are the same people billing. When they’re heads-down on placements the pipeline dries up. When they chase pipeline, delivery slips. Junior BDRs haven’t fixed it, because the approach is too consultative to hand to someone who doesn’t know the market. Meanwhile the signals that a company is about to hire are all public: a funding round, a new office, a director posting that they’re drowning. Nobody just has the time to watch for them.",
    agents: [
      {
        name: "Lead Gen",
        description:
          "Watches for the signals a company is about to hire, like funding, a new office, fresh role posts, or a director posting that they’re drowning. It works across LinkedIn and the open web, finds the decision-maker, and hands over a scored pipeline every day.",
      },
      {
        name: "Outreach",
        description:
          "Approaches each prospect in the partners’ voice across email and LinkedIn, reads what comes back, and passes the team only the warm conversations. No list to work through.",
      },
      {
        name: "Strategist",
        description:
          "Reads which messages, sectors, and triggers are converting, and turns that into what to say next week. The engine sharpens instead of going stale.",
      },
      {
        name: "Content Production",
        description:
          "Keeps a steady flow of sector content and thought-leadership going out, so the firm is already warm in the market before the first message lands.",
      },
      {
        name: "CEO Agent",
        description:
          "Sits above the engine. Tells the founders which roles, sectors, and signals are actually turning into placements, and where to point it next.",
      },
    ],
    estimatedImpact:
      "A pipeline that keeps moving whether or not the partners have a free afternoon, outbound running every day in the firm’s voice, and the founders back on billing instead of prospecting. Live within weeks, sharper every month.",
    ctaHeading: "Pipeline only when someone finds the time?",
    ctaBody:
      "Tell us about your desk and we’ll map the outbound engine that would keep it full. You keep the plan whether you build it with us or not.",
    faqs: [
      {
        q: "Can AI agents run outbound for a recruitment agency?",
        a: "Yes. A Lead Gen agent watches for signals that a company is about to hire and finds the decision-maker, and an Outreach agent approaches them in the partners' voice across email and LinkedIn.",
      },
      {
        q: "Will it replace our consultants?",
        a: "No. It keeps the pipeline moving so the partners can stay on billing. The team gets the warm conversations, not a list to work through.",
      },
      {
        q: "How quickly can it be running?",
        a: "Live within weeks, and sharper every month as it learns which messages, sectors, and triggers convert.",
      },
    ],
  },
  {
    slug: "estate-agency-growth",
    title: "Estate Agency Growth Engine",
    sector: "Estate Agency",
    systemType: "Revenue Operations",
    subtext:
      "A high-street sales agency that grows only when it wins more instructions, and quietly loses the buyers it already attracts.",
    problem:
      "The agency earns on what it lists, and instructions are the bottleneck. You can’t sell a home you were never asked to sell. The sellers worth winning are out there: a house that came off the market unsold with another agent, an owner trying to sell privately, a landlord getting out. Nobody has time to watch for them and be first to the valuation. And the buyer enquiries that do come in off the portals go cold, because a lead that isn’t called back within minutes is usually gone before anyone books the viewing.",
    agents: [
      {
        name: "Lead Gen",
        description:
          "Finds both sides of the market. On supply, the seller signals worth being first to: homes withdrawn or expired with another agent, owners trying to sell privately, landlords getting out. On demand, the active buyers in your patch. It hands over a matched, ready-to-approach pipeline.",
      },
      {
        name: "Outreach",
        description:
          "Approaches sellers in the agency’s voice and nurtures the long decision to sell, so you’re the name they call when they’re ready. It reaches active buyers too, about the homes that actually fit them.",
      },
      {
        name: "Analyst",
        description:
          "Reads the local market and the pipeline. Which areas and sources produce instructions, what’s selling, and where to point the effort next.",
      },
      {
        name: "Content Production",
        description:
          "Keeps the agency visible as the local expert, with area guides, valuation content, and just-listed and just-sold posts, so sellers choose you before you’ve even spoken.",
      },
      {
        name: "CEO Agent",
        description:
          "Sits above it. Tells the principal which areas, signals, and price brackets are turning into instructions and completions, and where the next bit of growth is.",
      },
    ],
    estimatedImpact:
      "More of the right instructions won earlier, fewer portal buyers lost to a slow callback, and a clear read on where your next listings come from. Add Front-Desk and every inbound enquiry gets answered and booked the moment it lands. Live within weeks, sharper every month.",
    ctaHeading: "Growing only as fast as you win instructions?",
    ctaBody:
      "Tell us your patch and we’ll map the engine that wins you more sellers and stops the buyers leaking. You keep the plan whether you build it with us or not.",
    faqs: [
      {
        q: "How can AI agents help an estate agency win more instructions?",
        a: "By watching for seller signals, such as homes withdrawn or expired with another agent, owners selling privately, and landlords getting out, then nurturing those sellers in the agency's voice.",
      },
      {
        q: "Can it answer buyer enquiries quickly?",
        a: "Yes, with Front-Desk added. Every inbound enquiry gets answered and booked the moment it lands, so portal buyers are not lost to a slow callback.",
      },
      {
        q: "Do we keep the plan if we do not go ahead?",
        a: "Yes. We map the engine for your patch, and you keep the plan whether you build it with us or not.",
      },
    ],
  },
  {
    slug: "membership-operations",
    title: "Membership & Community Operations",
    sector: "Membership & Community",
    systemType: "Full Department",
    subtext:
      "A growing membership community whose admin scales faster than the small team running it.",
    problem:
      "The community is the product, and the work of running it grows with every member you add. Answering people across every channel, handling renewals, organising events, managing the waitlist, onboarding new joiners. It lives across email, WhatsApp, an app, and a few people’s heads. Members wait hours for answers that should take seconds, renewals slip because nobody chased them, and the founder ends up buried in operational detail instead of growing the thing.",
    agents: [
      {
        name: "Front-Desk",
        description:
          "Answers members on whatever channel they use, about access, billing, events, the things they ask every day. It replies instantly, around the clock, and only escalates what genuinely needs a person.",
      },
      {
        name: "Operations",
        description:
          "Runs renewals, event logistics, the waitlist, and new-member onboarding end to end, so nothing depends on someone remembering to do it.",
      },
      {
        name: "Outreach",
        description:
          "Runs new-member and partner acquisition in the brand’s voice, so growth doesn’t stall every time the team is busy operating.",
      },
      {
        name: "Analyst",
        description:
          "Tracks engagement, churn risk, and what members actually use, and flags who’s about to lapse while there’s still time to act.",
      },
      {
        name: "CEO Agent",
        description:
          "Sits above the whole operation and tells the founder what’s working, what’s slipping, and where the next bit of growth is hiding.",
      },
    ],
    estimatedImpact:
      "Members answered in seconds, renewals that chase themselves, events and onboarding that run without the founder in the loop, and an early warning on who’s about to lapse. Live within weeks, more capable every month.",
    ctaHeading: "Admin growing faster than the team?",
    ctaBody:
      "Tell us how your community runs today and we’ll map the system that would operate it. You keep the plan whether you build it with us or not.",
    faqs: [
      {
        q: "What can agents handle for a membership community?",
        a: "Member questions on any channel, renewals, event logistics, the waitlist, and new-member onboarding, end to end.",
      },
      {
        q: "What happens with questions that need a person?",
        a: "Front-Desk answers the everyday questions instantly and only escalates what genuinely needs someone on the team.",
      },
      {
        q: "Can it spot members who are about to leave?",
        a: "Yes. An Analyst agent tracks engagement and churn risk and flags who is about to lapse while there is still time to act.",
      },
    ],
  },
  {
    slug: "professional-services-backoffice",
    title: "A Back Office That Runs Itself",
    sector: "Professional Services",
    systemType: "Cost Reduction",
    subtext:
      "An accountancy and advisory firm carrying a back office that grows with every client but adds nothing to the top line.",
    problem:
      "Every new client adds admin. Onboarding, chasing documents, keying data across systems that don’t talk to each other, following up invoices, answering the same questions again and again. It’s necessary work that wins no new business, and it’s either eating the team’s billable hours or forcing another back-office hire that’s pure cost. Most of what’s needed to handle it already lives in the firm’s systems. Nobody has the time to move it around.",
    agents: [
      {
        name: "Operations",
        description:
          "Runs onboarding, document chasing, approvals, data syncing between tools, and invoice follow-up end to end. The admin that happens between people and systems.",
      },
      {
        name: "Analyst",
        description:
          "Reconciles the numbers, flags what’s overdue or off, and produces the reports the partners used to put together by hand.",
      },
      {
        name: "Front-Desk",
        description:
          "Answers the routine client questions about status, documents, and billing instantly, and routes everything else to the right person with the full context attached.",
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
      "Tell us where the manual work piles up and we’ll map the system that would absorb it, and what it would save you. You keep the plan whether you build it with us or not.",
    faqs: [
      {
        q: "What back-office work can agents take on at an accountancy or advisory firm?",
        a: "Client onboarding, document chasing, approvals, syncing data between tools, invoice follow-up, reconciliation, and the reports partners used to build by hand.",
      },
      {
        q: "Is client data safe?",
        a: "Every system runs inside your own infrastructure. Your data never trains external models, it is handled to UK GDPR standards, and high-impact actions route to a person first.",
      },
      {
        q: "Do we need to hire someone to manage it?",
        a: "No. We operate the system for you, and it is designed to absorb the admin so the next back-office hire can be deferred or avoided.",
      },
    ],
  },
];

export const processSteps: ProcessStep[] = [
  {
    number: 1,
    title: "Prescribe",
    description:
      "We learn how your operation actually runs and prescribe the agents that fit it.",
  },
  {
    number: 2,
    title: "Tailor",
    description:
      "We tailor each specialist to how you work, shaping its skills to the exact jobs you need it doing.",
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
      "We operate it from here. It learns from every cycle on its own, we keep tuning it, and it gets more valuable the longer it runs.",
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
    name: "Lead Gen",
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
    name: "Content Production",
    role: "The maker",
    description:
      "Generates the content the operation runs on: copy, posts, reports, briefings. In your voice, on cadence.",
    group: "core",
    icon: "producer",
  },
  {
    name: "Front-Desk",
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
      "The whole operation running as one coordinated system. Add Front-Desk when you want customer-facing front of house.",
  },
];
