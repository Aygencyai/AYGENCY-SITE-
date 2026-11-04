import type { InsightPost } from "@/lib/insights";

// Answer pages: one clear page per buyer question. They live under /insights
// and flow into the sitemap and llms.txt automatically. The excerpt is the
// direct answer shown under the title. Never add prices or client numbers.

const date = "2 November 2026";

const nextStep = (heading: string, text: string, href: string, label: string) => ({
  heading,
  paragraphs: [text],
  links: [
    { href, label },
    { href: "/contact", label: "Talk to Aygency" },
  ],
});

export const answerPosts: InsightPost[] = [
  {
    slug: "what-is-an-ai-agent-system",
    title: "What is an AI agent system, and how is it different from a chatbot?",
    excerpt:
      "An AI agent system is a team of AI agents that does real work inside your business, not just answers questions. A chatbot replies to whoever is typing. An agent system notices what needs doing across your tools, does it, hands off to the next agent, and asks you before anything high-impact goes ahead.",
    date,
    readTime: "4 min read",
    content: [
      {
        heading: "How it works",
        paragraphs: [
          "Each agent owns one role, the way an employee would. An Operations agent processes documents, invoices and data entry. A Lead Gen agent finds the right prospects. An Outreach agent writes to them in your voice. A Front-Desk agent answers enquiries on any channel. They pass work between them and pull in a person when something needs one.",
          "Above them sits a CEO Agent. It reads across the whole operation and tells you what is working, what is breaking, and what to do next. Underneath sits the Brain, a private knowledge layer that holds how your business actually runs, so every agent works from the same picture.",
        ],
      },
      {
        heading: "Why a chatbot is not the same thing",
        paragraphs: [
          "A chatbot waits for someone to type. It answers, then forgets. It cannot chase an unpaid invoice, update your CRM, or notice that a supplier has changed its prices. It helps one person in one conversation.",
          "An agent system is triggered by what happens in your business: a new enquiry, a document landing in an inbox, a deadline coming up. It works inside the software you already use, remembers what it has done, and keeps the whole process moving. That is the difference between a helpful tool and extra capacity.",
        ],
      },
      {
        heading: "What it looks like in practice",
        paragraphs: [
          "A supplier invoice arrives by email. The Operations agent reads it, matches it to the order, spots that one line does not agree, and drafts a query to the supplier. The payment waits in your command centre for approval. You open one screen, check it, and approve. Nobody retyped anything.",
        ],
      },
      {
        heading: "Where people stay in the loop",
        paragraphs: [
          "Agents are excellent at structured, repeatable work and at following your rules. Where a judgement call or a high-impact action is involved, we build the approval in from day one, so the system asks rather than guesses.",
        ],
      },
      nextStep(
        "Next step",
        "Aygency designs agent systems around your real workflows and keeps improving them for as long as they run. See how the pieces fit together, or talk to us about your business.",
        "/system",
        "See the system",
      ),
    ],
    faqs: [
      {
        q: "Is an AI agent system just a more advanced chatbot?",
        a: "No. A chatbot answers questions in a conversation. An agent system does the work itself across your tools, coordinates several specialist agents, and asks for approval before high-impact actions.",
      },
      {
        q: "Do I need to understand AI to use one?",
        a: "No. Aygency designs, builds and runs the system. You see what the agents are doing in one command centre and approve the actions that matter.",
      },
      {
        q: "What is the CEO Agent?",
        a: "The agent that sits above every other agent, reads across the whole operation, and tells you what is working, what is breaking, and what to do next. It is included in every system Aygency builds.",
      },
    ],
  },
  {
    slug: "back-office-tasks-ai-agents-can-take-over",
    title: "Which back-office tasks can AI agents take over in a small business?",
    excerpt:
      "AI agents can take over most of the repetitive back-office work that slows a small business down: data entry, invoices, reconciliation, chasing documents, onboarding, reporting and scheduling. If someone does the same task the same way every week, an agent can usually do it faster and more consistently. That is where Aygency starts, because clearing the back office is what frees a business to scale.",
    date,
    readTime: "4 min read",
    content: [
      {
        heading: "The tasks agents handle best",
        paragraphs: [
          "Document processing and data entry: reading invoices, receipts, forms and contracts, and putting the right details into the right system. Invoice processing and reconciliation: matching payments to invoices, flagging mismatches, and chasing what is overdue. Document chasing and client onboarding: requesting what is missing, following up politely, and filing it when it arrives.",
          "Reporting: pulling numbers from several tools into the weekly or monthly report someone used to build by hand. Scheduling: booking, rebooking and reminding. Inbox triage: sorting what comes in, answering the routine and routing the rest.",
        ],
      },
      {
        heading: "How Aygency decides where to start",
        paragraphs: [
          "We map how the work actually runs, including the handoffs and workarounds nobody writes down. That shows where time really goes and which bottleneck is holding the business back most. We build agents for that first, then add more as the business grows.",
          "Each agent is designed around your existing workflow and connects to the software you already use, so your team keeps working the way it does today. The admin simply stops landing on their desks.",
        ],
      },
      {
        heading: "What it looks like in practice",
        paragraphs: [
          "A new client signs. The onboarding agent sends the welcome pack, requests the documents you need, chases them until they arrive, checks they are complete and files them. Your team sees a finished file rather than a to-do list. Anything unusual is flagged in the command centre for a person to look at.",
        ],
      },
      {
        heading: "Where a person still decides",
        paragraphs: [
          "Payments, refunds and anything that commits the business are high-impact, so we build owner approval into those steps. The agent prepares everything; you approve in one click. Strategy and relationships stay with your people, who now have the time for them.",
        ],
      },
      nextStep(
        "Next step",
        "Aygency's cost reduction systems are built to clear the back office first. Find out what that would take off your team's plate.",
        "/services/cost-reduction",
        "Cost reduction systems",
      ),
    ],
    faqs: [
      {
        q: "Is my business too small for back-office agents?",
        a: "Fit depends on how much repetitive work your team does, not headcount. If the same tasks eat hours every week, there is usually a strong case to start.",
      },
      {
        q: "Will I need new software?",
        a: "No. Agents connect to the systems you already use, so there is nothing new for your team to learn.",
      },
      {
        q: "Can we add more agents later?",
        a: "Yes. We start with the biggest bottleneck, then add agents as the business grows and new work comes into view.",
      },
    ],
  },
  {
    slug: "do-ai-agents-change-how-your-team-works",
    title: "Do AI agents mean changing how my team works?",
    excerpt:
      "No. Aygency designs agents around the way your business already runs, so your team keeps the tools and routines they know. The difference is that the repetitive work stops landing on their desks. Day to day, it feels like gaining a very fast colleague, not learning a new system.",
    date,
    readTime: "4 min read",
    content: [
      {
        heading: "Why most technology projects disrupt teams",
        paragraphs: [
          "Most software asks the business to change to fit the product. New screens, new processes, new habits, and weeks of retraining before anything gets better. That friction is why so many tools end up half used.",
          "Aygency works the other way round. We fit the agents to the business, not the business to the agents.",
        ],
      },
      {
        heading: "How it works",
        paragraphs: [
          "We start by learning your real workflows: who does what, which tools they use, where work gets handed over, and where it gets stuck. Then we design agents that slot into those exact steps. They read the same inbox, update the same CRM and spreadsheets, and follow the same rules your team already follows.",
          "Your people keep working where they work today. The only new thing is the command centre, one place where you can see what the agents have done and approve anything high-impact.",
        ],
      },
      {
        heading: "What it looks like in practice",
        paragraphs: [
          "A team member used to spend each morning sorting enquiries and copying details into the CRM. Now the enquiries arrive already sorted, logged and answered where the answer is routine. Anything that needs a person is waiting for them with the context attached. They do the part of the job that needs them, and skip the rest.",
        ],
      },
      {
        heading: "What does change, for the better",
        paragraphs: [
          "There is a short period at the start where we ask questions and watch how work flows. After that, the main change is time: hours back each week for the work that grows the business. We include training and ongoing support, so the team is confident from the first week.",
        ],
      },
      nextStep(
        "Next step",
        "See how an Aygency system fits around an existing operation, then talk to us about yours.",
        "/system",
        "See the system",
      ),
    ],
    faqs: [
      {
        q: "Will my team need to learn new software?",
        a: "No. Agents work inside the tools you already use. The only addition is a simple command centre for seeing what agents did and approving high-impact actions.",
      },
      {
        q: "Will AI agents replace my staff?",
        a: "Agents take the repetitive work so your people can focus on clients, decisions and growth. Many businesses use them to grow without adding the next admin hire.",
      },
      {
        q: "How much of our time does setup take?",
        a: "We need time with the people who know the workflows at the start. After that, your main input is approving high-impact actions and telling us what to improve.",
      },
    ],
  },
  {
    slug: "how-ai-agents-help-businesses-scale",
    title: "How do AI agents help a business scale without hiring?",
    excerpt:
      "AI agents remove the bottlenecks that normally force a business to hire before it can grow. They take on the admin that grows with every new client, then the work of bringing new clients in. With Aygency, growth stops being limited by headcount and starts being limited only by ambition.",
    date,
    readTime: "4 min read",
    content: [
      {
        heading: "Why businesses hit a ceiling",
        paragraphs: [
          "Every new client brings more invoices, more documents, more follow-ups and more questions. At some point the team is full, and growth waits until the next hire is found, trained and up to speed. The business is capped by how much admin its people can carry.",
        ],
      },
      {
        heading: "How agents lift the ceiling",
        paragraphs: [
          "Agents do the repeatable work at any volume, around the clock, to the same standard on the busiest day as the quietest. When the work doubles, the agents absorb it. Your people stay on the parts of the job that need a person.",
          "Aygency starts with the back office, because that is where most bottlenecks live. Once that is clear, we put agents to work on growth: finding prospects, reaching out in your voice, and making sure no enquiry goes unanswered. A CEO Agent reads across everything and points to the next constraint before it bites.",
        ],
      },
      {
        heading: "What it looks like in practice",
        paragraphs: [
          "A growing firm takes on more clients. Onboarding, document chasing and invoicing scale with it, handled by agents, while the team spends its time on the clients themselves. Meanwhile the Lead Gen and Outreach agents keep the pipeline moving, so growth does not depend on someone finding a free afternoon.",
        ],
      },
      {
        heading: "Keeping growth under control",
        paragraphs: [
          "Scaling fast should not mean losing control. Every Aygency system runs through a command centre where high-impact actions wait for your approval. As the business grows we add agents and keep tuning the system, so it gets better as it gets bigger.",
        ],
      },
      nextStep(
        "Next step",
        "A full department system gives you the capacity of a team without building one. Talk to us about where your business is capped today.",
        "/services/full-department",
        "Full department systems",
      ),
    ],
    faqs: [
      {
        q: "Can AI agents really replace the need to hire?",
        a: "They replace the need to hire for repetitive work. Many businesses use agents to defer or avoid the next admin hire and put their people where they matter most.",
      },
      {
        q: "Should we start with lead generation or the back office?",
        a: "Usually the back office. Clearing it first means new business can be handled without new strain, then lead generation agents add growth on top.",
      },
      {
        q: "What happens as we keep growing?",
        a: "We add agents as new bottlenecks appear and keep improving the ones already running, so the system grows with the business.",
      },
    ],
  },
  {
    slug: "ai-agents-vs-zapier-make-n8n",
    title: "AI agents vs Zapier, Make or n8n: which does my business need?",
    excerpt:
      "If you need one fixed task moved from A to B, Zapier, Make or n8n will do it. If you want the work itself handled, including the judgement, the exceptions and the follow-up, you need AI agents. For a business trying to scale, an agent system built and run by Aygency goes much further than a set of automations.",
    date,
    readTime: "4 min read",
    content: [
      {
        heading: "What automation tools do well",
        paragraphs: [
          "Zapier, Make and n8n connect apps with fixed rules. When a form is submitted, add a row. When a deal closes, send a message. They are reliable for simple, predictable steps, and they are worth using for exactly that.",
        ],
      },
      {
        heading: "Where automation runs out",
        paragraphs: [
          "Real work is rarely that tidy. An invoice arrives in an odd format. A client replies with a question instead of the document. A supplier changes a price. A fixed rule either breaks or quietly does the wrong thing, and someone on your team picks up the pieces. Every exception becomes another rule to build and maintain, usually by whoever on the team knows the tool.",
        ],
      },
      {
        heading: "What AI agents add",
        paragraphs: [
          "Agents read the situation, decide what to do, do it, and check the result. They handle the messy inputs and the exceptions, follow your policies, and escalate to a person only when something genuinely needs one. A team of agents can run a whole process end to end, with a CEO Agent watching across all of it.",
          "With Aygency, you also get people who design it around your workflows, run it, and keep improving it. You are not left maintaining a web of automations yourself.",
        ],
      },
      {
        heading: "A fair comparison",
        paragraphs: [
          "Choose an automation tool for a single, fixed hand-off. Choose an agent system when the work involves reading, deciding and following up, or when you want a function to run without adding headcount. Agents can still use simple automations where that is the best tool for a step, so you get the best of both.",
        ],
      },
      nextStep(
        "Next step",
        "Read more on the difference between automation and agent systems, then talk to us about which parts of your business need which.",
        "/insights/automation-vs-agent-systems",
        "Automation vs agent systems",
      ),
    ],
    faqs: [
      {
        q: "Can AI agents work alongside our existing Zapier or Make automations?",
        a: "Yes. We can keep the automations that work and put agents on the steps that need judgement, so nothing you have built goes to waste.",
      },
      {
        q: "Is n8n with an AI step the same as an agent system?",
        a: "Not quite. Adding an AI step to a fixed flow helps with one task. An agent system coordinates specialist agents across a whole process, remembers context, escalates edge cases, and is run and improved by Aygency.",
      },
      {
        q: "Who maintains it when something changes?",
        a: "We do. Aygency operates the system, monitors it, and updates it as your business changes.",
      },
    ],
  },
  {
    slug: "admin-assistant-vs-ai-agents",
    title: "Should I hire an admin assistant or use AI agents?",
    excerpt:
      "For repetitive admin, AI agents are the stronger choice: they work around the clock, never fall behind on a busy week, and scale as the business grows without another hire. Keep people for the work that needs a human touch. Aygency builds agents that take the admin off your team so the people you do hire spend their time where it matters.",
    date,
    readTime: "4 min read",
    content: [
      {
        heading: "What an admin hire really involves",
        paragraphs: [
          "Hiring takes time: recruiting, onboarding, training and management. A good assistant then has a fixed number of hours in the day, holidays, sick days, and eventually moves on, taking their knowledge with them. When the workload grows again, so does the hiring.",
        ],
      },
      {
        heading: "What AI agents offer instead",
        paragraphs: [
          "Agents handle data entry, inbox triage, scheduling, invoicing, document chasing and reporting at any hour and any volume. They follow your process the same way every time. What they learn about your business stays in your Brain, so knowledge builds up instead of walking out of the door.",
          "Aygency designs each agent around how your business already runs, and keeps improving it. You stay in control through the command centre, approving anything high-impact.",
        ],
      },
      {
        heading: "What it looks like in practice",
        paragraphs: [
          "Instead of hiring someone to manage the inbox and calendar, agents sort and answer routine messages, book and confirm appointments, and prepare the weekly report. Anything sensitive or unusual is flagged for you. Your existing team stops drowning in admin, and the next hire can be someone who wins or serves clients.",
        ],
      },
      {
        heading: "When a person is the right answer",
        paragraphs: [
          "Roles built on relationships, judgement and presence, like greeting clients or handling a difficult conversation, are best done by people. Agents support them, and where a decision needs a human we build that approval into the workflow.",
        ],
      },
      nextStep(
        "Next step",
        "See how Aygency's cost reduction systems take on the admin, then talk to us before you post the job advert.",
        "/services/cost-reduction",
        "Cost reduction systems",
      ),
    ],
    faqs: [
      {
        q: "Can AI agents work alongside an existing assistant?",
        a: "Yes. Agents take the repetitive work so your assistant can focus on the parts of the role that need a person.",
      },
      {
        q: "What happens when an agent is unsure?",
        a: "It escalates to the right person with the context attached, rather than guessing. High-impact actions always wait for approval.",
      },
      {
        q: "Do agents need managing like an employee?",
        a: "No. Aygency runs, monitors and improves the system for you. Your role is to approve high-impact actions and tell us what to improve.",
      },
    ],
  },
  {
    slug: "how-to-stay-in-control-of-ai-agents",
    title: "How do I stay in control of what AI agents do?",
    excerpt:
      "You stay in control through a command centre: one place where you see what every agent has done and approve anything high-impact before it happens. Aygency decides with you which actions need sign-off, and every system can be paused or rolled back. The agents do the work; you keep the final say.",
    date,
    readTime: "4 min read",
    content: [
      {
        heading: "How the command centre works",
        paragraphs: [
          "Every Aygency system runs from one command centre: a single home for your people and your agents. It is the easiest way to centralise your data and have in-house autonomous agents complete complex workflows, while your team keeps oversight and brings its expertise. You can see what each agent did, why, and what it is waiting on. Routine work runs on its own. Anything you mark as high-impact, such as a payment, a refund, or a message to an important client, is prepared by the agent and waits for your approval.",
          "The CEO Agent sits above the specialists and gives you a plain read on the whole operation: what is working, what needs attention, and what to do next.",
        ],
      },
      {
        heading: "You set the rules",
        paragraphs: [
          "Before anything goes live, we agree with you what agents can do alone, what needs approval, and who approves it. Those rules live in the system, not in someone's memory. As trust builds, you can hand more over, or keep the approvals exactly where they are.",
          "Every system has a kill-switch and can be rolled back to a known-good state, so you can stop or undo at any time.",
        ],
      },
      {
        heading: "What it looks like in practice",
        paragraphs: [
          "An Outreach agent drafts follow-ups to a list of warm leads. The routine ones go out under the rules you agreed. The note to your largest prospect waits in the command centre. You read it, tweak a line, and approve. Five minutes of your time instead of an afternoon.",
        ],
      },
      {
        heading: "Built for confidence",
        paragraphs: [
          "Agents are designed to escalate rather than guess. Where a situation is new or unclear, they bring it to a person with the context attached. We monitor every system and tune it every month, so it keeps getting more reliable.",
        ],
      },
      nextStep(
        "Next step",
        "Read how Aygency keeps every system safe and in your hands, then talk to us about the controls your business needs.",
        "/trust",
        "How we keep you in control",
      ),
    ],
    faqs: [
      {
        q: "Will AI agents send emails or payments without my approval?",
        a: "Only if you have agreed they can. You choose which actions need sign-off, and high-impact actions always come to a person first.",
      },
      {
        q: "Can I switch an agent off?",
        a: "Yes. Every system has a kill-switch and can be rolled back to a known-good state.",
      },
      {
        q: "How do I know what the agents have done?",
        a: "The command centre shows every action, and the CEO Agent gives you a clear summary of what is working and what needs attention.",
      },
    ],
  },
  {
    slug: "are-ai-agents-safe-with-business-data",
    title: "Is it safe to give AI agents access to my business data?",
    excerpt:
      "Yes, when the system is built privacy-first. Your data never trains external models, data handling is GDPR-aligned, and a data processing agreement (DPA) is available. Agents only get the access their job needs, and high-impact actions wait for a person.",
    date,
    readTime: "4 min read",
    content: [
      {
        heading: "How Aygency protects your data",
        paragraphs: [
          "Your system is kept separate from every other client. Your data is used only to run your system and is never used to train external AI models.",
          "Agents connect to your tools through official, permissioned connections. Each agent gets only the access its role needs, and access can be revoked at any time. Data handling is GDPR-aligned, with a data processing agreement (DPA) available.",
          "We never ask for your passwords. Credentials are kept in an encrypted vault, and any connection can be switched off from your side whenever you choose.",
        ],
      },
      {
        heading: "Control as a safety layer",
        paragraphs: [
          "Security is also about what agents are allowed to do. High-impact actions route to a person before they happen, every system has a kill-switch, and any change can be rolled back to a known-good state. You see everything in one command centre.",
        ],
      },
      {
        heading: "What it looks like in practice",
        paragraphs: [
          "Say an accountancy firm wants agents to chase client documents. The agent can read the shared inbox and the document folder, and send requests from an approved template. It cannot see payroll or send money. When a client replies with something unusual, it goes to a person.",
        ],
      },
      {
        heading: "Your part in it",
        paragraphs: [
          "Good security is shared. We work with you on who should approve what and which systems agents should touch, and we document it. If your sector has specific rules, we design around them from the start rather than bolting them on later.",
          "Privacy-first is not a feature we add at the end. It shapes how every Aygency system is designed, which is why businesses can hand real work to agents with confidence.",
        ],
      },
      nextStep(
        "Next step",
        "Read how Aygency keeps systems safe, then talk to us about your data and your requirements.",
        "/trust",
        "Trust and security",
      ),
    ],
    faqs: [
      {
        q: "Will my data be used to train AI models?",
        a: "No. Your data is never used to train external models.",
      },
      {
        q: "Who owns the data and the Brain?",
        a: "You do. Your data stays yours, and the Brain, the knowledge layer of how your business runs, is yours to keep.",
      },
      {
        q: "How do AI agents handle GDPR?",
        a: "Aygency follows GDPR-aligned data handling, offers a data processing agreement (DPA), and designs each system with the right access and approvals. We work with you on your own responsibilities as data controller.",
      },
    ],
  },
  {
    slug: "how-long-to-deploy-ai-agents",
    title: "How long does it take to get AI agents live in a business?",
    excerpt:
      "With Aygency, the first agents are live within weeks, not months. We start with the bottleneck that matters most, get it working on real data, then add more agents in phases. From then on the system keeps improving every month.",
    date,
    readTime: "4 min read",
    content: [
      {
        heading: "How the timeline works",
        paragraphs: [
          "First we learn the business: the real workflows, the tools, and where time is lost. Then we design the system and show you the plan before anything is built. We build and connect the first agents to the tools you already use, test them on real work, and switch them on with approvals in place.",
          "Because we build in phases, you do not wait for everything to be finished before seeing results. The first workflow goes live, proves itself, and the next one follows.",
        ],
      },
      {
        heading: "What affects the timeline",
        paragraphs: [
          "The number of workflows, how many systems need connecting, and how quickly the right people can share how things work today. Clear access to tools and a decision-maker who can approve the plan are what keep things moving fastest.",
          "What does not slow it down is your software. Agents work with the tools you already have, so there is no migration project to finish before they can start.",
        ],
      },
      {
        heading: "What it looks like in practice",
        paragraphs: [
          "In the first stage, one high-value workflow such as invoice processing or client onboarding goes live in the command centre, with high-impact steps waiting for approval. Over the following months, more agents join and the CEO Agent starts reading across all of them.",
        ],
      },
      {
        heading: "Live is the starting line",
        paragraphs: [
          "Going live is where the value starts, not where our work ends. We monitor every system, tune it, and handle new edge cases as they appear, so it gets better the longer it runs.",
        ],
      },
      nextStep(
        "Next step",
        "See how an Aygency system is designed and rolled out, then talk to us about your first workflow.",
        "/system",
        "See the system",
      ),
    ],
    faqs: [
      {
        q: "Do we have to build everything at once?",
        a: "No. We build in phases, starting with the biggest bottleneck, and add agents as each one proves itself.",
      },
      {
        q: "What do you need from us to get started?",
        a: "Time with the people who know the workflows, access to the tools involved, and someone who can approve the plan and high-impact actions.",
      },
      {
        q: "What happens after go-live?",
        a: "We keep operating the system: monitoring, tuning, and improving it every month as it learns more about your business.",
      },
    ],
  },
  {
    slug: "whats-included-in-an-ai-agent-system",
    title: "What's included in an AI agent system from Aygency?",
    excerpt:
      "Everything your business needs for agents to take real work off your team and keep getting better at it. That means discovery of your workflows, a system design you approve, specialist agents, the CEO Agent, your private Brain, a command centre with human approval, connections to the tools you already use, team training, and ongoing running and improvement. You get extra capacity built around how you already work, not another piece of software to manage.",
    date,
    updated: "3 November 2026",
    readTime: "4 min read",
    content: [
      {
        heading: "Before anything is built",
        paragraphs: [
          "Discovery: we learn how your business really runs, including the handoffs and workarounds nobody writes down, and find the bottlenecks worth removing first. For most businesses that is the back office. Design: you see a clear plan of which agents we will build, what each one does, and where approvals sit, before any work starts.",
        ],
      },
      {
        heading: "The system itself",
        paragraphs: [
          "Specialist agents, each built around one role in your workflow, the way you would brief a new employee. The CEO Agent, included in every system, reading across the operation and telling you what is working, what needs attention and what to do next. Your Brain, a private knowledge layer of how your business runs, which is yours to keep.",
          "A command centre where you see everything the agents have done and approve high-impact actions before they happen. Connections to the tools you already use, so agents slot into existing workflows and nobody has to change how they work.",
        ],
      },
      {
        heading: "Once it is live",
        paragraphs: [
          "We run the system for you. That covers monitoring, fixing anything that breaks, handling new edge cases, updating workflows as your business changes, and regular tuning so the agents keep getting better. Your team gets training and a direct line to us for support, and new agents can be added whenever the next bottleneck appears.",
        ],
      },
      {
        heading: "What it looks like in practice",
        paragraphs: [
          "A business starts with one back-office workflow, such as client onboarding. The onboarding agent goes live in the command centre, with anything unusual flagged for a person. Once it has proved itself, the next agent follows, perhaps invoicing or reporting, and the CEO Agent begins reading across both. The system grows one bottleneck at a time, always under your approval.",
        ],
      },
      {
        heading: "What shapes the scope",
        paragraphs: [
          "Every system is built for one business, so scope depends on how many workflows you want handled, how complex they are, and how many tools need connecting. Your own software subscriptions stay with you. We agree all of it with you on a call, clearly and up front.",
        ],
      },
      {
        heading: "Why it is built this way",
        paragraphs: [
          "A script is finished the day it ships. An agent system becomes more valuable the longer it runs, because it keeps learning how your business works. That is why running and improving it is part of what you get, not an optional extra.",
        ],
      },
      nextStep(
        "Next step",
        "See how the pieces fit together, then talk to us about what your system would include.",
        "/system",
        "See the system",
      ),
    ],
    faqs: [
      {
        q: "Is the CEO Agent an extra?",
        a: "No. The CEO Agent is included in every system Aygency builds, reading across all of your agents and telling you what to do next.",
      },
      {
        q: "Will my team need to learn new software?",
        a: "No. Agents connect to the tools you already use. The only addition is the command centre, where you see what agents have done and approve high-impact actions.",
      },
      {
        q: "Can we add more agents as we grow?",
        a: "Yes. We start with the biggest bottleneck, usually in the back office, then add agents as the business grows and new work comes into view.",
      },
    ],
  },
];
