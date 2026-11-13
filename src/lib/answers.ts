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
    metaDescription:
      "An AI agent system is a team of AI agents doing real work in your business. Unlike a chatbot, it acts across your tools and asks before high-impact steps.",
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
    metaDescription:
      "AI agents can take over repetitive back-office work in a small business: data entry, invoices, reconciliation, document chasing, reporting and scheduling.",
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
        "Aygency's back-office agents take on the operations and admin first. Find out what they would take off your team's plate.",
        "/services/back-office-agents",
        "Back-office agents",
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
    metaDescription:
      "No. Aygency designs AI agents around how your business already runs, so your team keeps its tools and routines while the repetitive work leaves their desks.",
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
    metaDescription:
      "AI agents remove the bottlenecks that force a business to hire before it can grow. They take on the admin first, then the work of bringing new clients in.",
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
        "Back-office agents give you the capacity of a team without building one. Talk to us about where your business is capped today.",
        "/services/back-office-agents",
        "Back-office agents",
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
      "Use Zapier, Make or n8n when a task follows the same fixed steps every time. Use AI agents when the work needs reading, judgement and follow-up, such as messy invoices, client replies or exceptions. Most growing businesses get the best result from both, and an Aygency agent system puts each tool where it fits, then runs and improves the whole thing for you.",
    metaDescription:
      "Zapier, Make or n8n suit one fixed task. If you want the judgement, exceptions and follow-up handled too, your business needs AI agents. Here is how to choose.",
    date,
    updated: "10 November 2026",
    readTime: "5 min read",
    content: [
      {
        heading: "The short answer",
        paragraphs: [
          "Zapier, Make and n8n move data between apps when something happens. AI agents do the work in between: they read what arrived, decide what it needs, act, and check the result. The question is not which one wins. It is which steps of your process need a rule and which need a capable pair of hands.",
        ],
      },
      {
        heading: "What Zapier, Make and n8n do well",
        paragraphs: [
          "They connect apps with fixed rules. When a form is submitted, add a row. When a deal closes, post a message. For simple, predictable hand-offs they are fast to set up and dependable, and we use n8n ourselves for exactly that kind of step.",
        ],
      },
      {
        heading: "Where fixed rules run out",
        paragraphs: [
          "Real work is rarely that tidy. An invoice arrives in an odd format. A client replies with a question instead of the document you asked for. A supplier changes a price. A rule either stops or quietly does the wrong thing, and someone on your team picks it up. Each exception becomes another rule to build and maintain.",
        ],
      },
      {
        heading: "What AI agents add",
        paragraphs: [
          "Agents handle the messy inputs and the exceptions, follow your policies, and keep a process moving end to end. Each one owns a role, like an employee, and a CEO Agent watches across all of them. Anything high-impact, such as a payment or a message to a customer, waits in your command centre for a person to approve.",
        ],
      },
      {
        heading: "How to decide, step by step",
        paragraphs: [
          "Use an automation tool when: the input always looks the same, the steps never change, and nobody needs to read or judge anything. Examples are copying form entries into a CRM, posting a sale to a team channel, or saving attachments to a folder.",
          "Use an AI agent when: the input varies, the right action depends on what it says, or the task needs a follow-up. Examples are processing supplier invoices, chasing missing documents, triaging an inbox, onboarding a new client, or preparing a weekly report from several tools.",
          "Use both when: a process has simple hand-offs and judgement steps mixed together, which is most of them. The automation moves the data and the agent does the thinking.",
        ],
      },
      {
        heading: "Why most businesses end up with both",
        paragraphs: [
          "Keep the automations that already work. Put agents on the steps your team still does by hand because a rule could not cope. That is how the bottlenecks clear without ripping anything out, and it is how Aygency designs every system: around your real workflows and the tools you already use.",
          "The other difference is who looks after it. With Aygency you are not maintaining a web of flows yourself. We operate the system, watch how it performs, and keep improving it as your business changes.",
        ],
      },
      nextStep(
        "Next step",
        "Read how automation and agent systems differ in more depth, then talk to us about which parts of your business need which.",
        "/insights/automation-vs-agent-systems",
        "Automation vs agent systems",
      ),
    ],
    faqs: [
      {
        q: "Can AI agents work alongside our existing Zapier, Make or n8n automations?",
        a: "Yes. We keep the automations that work and put agents on the steps that need judgement, so nothing you have built goes to waste.",
      },
      {
        q: "Is n8n or Zapier with an AI step the same as an AI agent?",
        a: "Not quite. An AI step inside a fixed flow helps with one task. An agent system coordinates specialist agents across a whole process, remembers context, asks for approval on high-impact actions, and is run and improved by Aygency.",
      },
      {
        q: "When is Zapier, Make or n8n enough on its own?",
        a: "When every input looks the same and the steps never change. If your team still fixes exceptions by hand or follows up manually, that is the point where an agent adds real capacity.",
      },
    ],
  },
  {
    slug: "admin-assistant-vs-ai-agents",
    title: "Should I hire an admin assistant or use AI agents?",
    excerpt:
      "For repetitive admin, AI agents are the stronger choice: they work around the clock, never fall behind on a busy week, and scale as the business grows without another hire. Keep people for the work that needs a human touch. Aygency builds agents that take the admin off your team so the people you do hire spend their time where it matters.",
    metaDescription:
      "For repetitive admin, AI agents work around the clock and scale as you grow, without another hire. Keep your people for the work that needs a human touch.",
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
        "See how Aygency's back-office agents take on the admin, then talk to us before you post the job advert.",
        "/services/back-office-agents",
        "Back-office agents",
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
    metaDescription:
      "Stay in control of AI agents through a command centre: see what every agent has done, approve anything high-impact first, and pause or roll back any time.",
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
    metaDescription:
      "Yes, when built privacy-first. Your data never trains external models, data handling is GDPR-aligned, and a DPA is available. Agents get only the access needed.",
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
    metaDescription:
      "With Aygency, the first AI agents are live within weeks, not months. We start with the biggest bottleneck, get it working on real data, then add more in phases.",
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
    metaDescription:
      "An Aygency AI agent system includes discovery, design, specialist agents, the CEO Agent, your Brain, a command centre with approvals, and ongoing improvement.",
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
  {
    slug: "which-department-to-automate-first",
    title: "Which part of my business should I hand to AI agents first?",
    excerpt:
      "Start with the back office. The repetitive admin, finance and operations work is where most businesses lose the most time, and it is the work that caps how fast you can grow. Clear that bottleneck first and the next one, usually lead generation, gets far easier to take on.",
    metaDescription:
      "Start with the back office. Repetitive admin, finance and operations work is where most businesses lose the most time, so clear it before lead generation.",
    date: "5 November 2026",
    readTime: "4 min read",
    content: [
      {
        heading: "Why the back office comes first",
        paragraphs: [
          "In most growing businesses the back office sets the pace. Every new customer brings more data to key in, more invoices to process, more documents to chase and more reports to pull together. That work grows in step with the business, so growth quietly turns into hiring just to keep up.",
          "It is also the work agents handle best. It is repeatable, it follows rules, and it lives in the tools you already use. That makes it the fastest place to see a return, and the safest place to build trust in the system before agents take on anything customer-facing.",
        ],
      },
      {
        heading: "How to find your biggest bottleneck",
        paragraphs: [
          "The right first step is rarely a whole department. It is the one workflow that costs the most time or holds everything else up. A few questions usually find it:",
          "Where do people do the same task the same way every week? Where does work wait for someone to have a spare hour? Which job would you need to hire for next if the business doubled? Where do small mistakes cost the most to fix? The workflow that appears in more than one answer is usually the place to start.",
        ],
      },
      {
        heading: "Then lead generation",
        paragraphs: [
          "Once the back office runs itself, lead generation is the natural next step. Agents find the right prospects, write to them in your voice and hand warm conversations to your team. Doing it in this order matters: new demand lands on an operation that can absorb it, instead of piling more work onto the people who were already stretched.",
        ],
      },
      {
        heading: "What it looks like in practice",
        paragraphs: [
          "A professional services firm maps how its week really runs and finds that client onboarding is the bottleneck. Forms, document chasing and setting clients up in three systems take up hours that should go on client work. An onboarding agent goes live first, with anything unusual flagged in the command centre for a person to approve. Once it has proved itself, invoicing follows, then reporting, and the CEO Agent starts reading across all three. The system grows one bottleneck at a time.",
        ],
      },
      {
        heading: "Worth knowing",
        paragraphs: [
          "Starting small is a strength, not a compromise. One well-built agent around a real workflow does more for a business than a broad rollout that nobody trusts yet. Your team keeps working the way it does today, and each new agent builds on what the system has already learned.",
        ],
      },
      nextStep(
        "Next step",
        "Aygency maps how your business actually runs, starts with the agents that remove the biggest bottleneck, then adds more as you grow. See what back-office agents take on, or talk to us about where your time goes.",
        "/services/back-office-agents",
        "See back-office agents",
      ),
    ],
    faqs: [
      {
        q: "Should I start with sales or the back office?",
        a: "Usually the back office. It is where repetitive work piles up fastest and it is what limits growth. Once it runs itself, adding lead generation means new customers land on an operation that can handle them.",
      },
      {
        q: "Do I need to hand over a whole department at once?",
        a: "No. Aygency starts with the single workflow that removes the biggest bottleneck, proves it, then adds agents one step at a time as the business grows.",
      },
      {
        q: "How do I know which workflow to start with?",
        a: "Look for work your team repeats every week, work that waits for someone to be free, and the role you would hire for next. Aygency maps your real workflows on the first call to find it with you.",
      },
    ],
  },
  {
    slug: "ai-agent-permissions-for-small-business",
    title: "What should an AI agent be allowed to do without asking in a small business?",
    excerpt:
      "An AI agent should handle routine, reversible work on its own, prepare anything high-impact for a person to approve, and only have access to the tools its job needs. In practice that means agents read, sort, draft and update freely, while anything that reaches a customer, moves money or deletes data waits for sign-off. Aygency agrees those rules with you before anything goes live, and you can widen them as trust builds.",
    metaDescription:
      "Let AI agents read, sort, draft and update on their own. Anything that reaches a customer, moves money or deletes data should wait for a person to approve.",
    date: "9 November 2026",
    readTime: "4 min read",
    content: [
      {
        heading: "Three levels of permission",
        paragraphs: [
          "The simplest way to set permissions is to sort every action an agent takes into one of three groups.",
          "Does on its own: reading and sorting incoming email, logging data into your CRM or spreadsheets, matching invoices to orders, drafting replies, preparing reports and chasing internal tasks. This is repeatable work that is easy to check and easy to undo.",
          "Asks first: sending a message to a customer or an important contact, approving a payment or refund, changing a price or a contract, and anything outside the usual pattern. The agent prepares the work in full, with its reasoning attached, so approving takes seconds.",
          "Stays with your team: decisions that rest on judgement, relationships or policy, such as hiring, pricing strategy or a sensitive complaint. Agents bring you the context and you make the call.",
        ],
      },
      {
        heading: "Give each agent only the access its job needs",
        paragraphs: [
          "Agents are built like employees with a clear role, and access follows the role. An Operations agent that processes invoices needs your accounts inbox and accounting tool, not your sales pipeline. A Front-Desk agent that answers enquiries needs your FAQs and booking calendar, not your bank. Separating read, draft and act access keeps every agent focused and every action easy to trace.",
        ],
      },
      {
        heading: "How it works in the command centre",
        paragraphs: [
          "Every Aygency system runs from one command centre, a single home for your people and your agents. Routine work flows through on its own. Anything in the asks-first group lands there for the right person to approve, edit or decline, and every action is recorded, so you can see what each agent did and why.",
          "When an agent meets something new or unclear, it escalates rather than guesses, and that decision becomes part of how it handles the next one.",
        ],
      },
      {
        heading: "What it looks like in practice",
        paragraphs: [
          "An agent reads a supplier invoice, matches it to the purchase order and records it in your accounts. That runs on its own. The same invoice has a line that does not match, so the agent drafts a query to the supplier and holds the payment. Both wait in the command centre. Your finance lead checks them, approves the query, and the payment goes once the corrected invoice arrives.",
        ],
      },
      {
        heading: "Start careful, then hand over more",
        paragraphs: [
          "The best systems start with tighter approvals and loosen them where the agent has proved itself on low-risk, reversible work. You decide the pace. High-impact actions can stay with a person for good, and every system can be paused or rolled back whenever you choose.",
        ],
      },
      nextStep(
        "Next step",
        "See how Aygency keeps every system safe and in your hands, then talk to us about the rules that fit how your business runs.",
        "/trust",
        "How we keep you in control",
      ),
    ],
    faqs: [
      {
        q: "Will an AI agent send emails to my customers without approval?",
        a: "Only if you have agreed it can. Messages to customers sit in the asks-first group by default, so the agent drafts them and a person approves them in the command centre.",
      },
      {
        q: "Should an AI agent have access to all my business systems?",
        a: "No. Each agent gets only the access its role needs, the same way you would set up a new employee. That keeps every action focused, traceable and easy to review.",
      },
      {
        q: "Can I give agents more freedom later?",
        a: "Yes. Most businesses start with tighter approvals and widen them for low-risk, reversible work once the agent has proved itself. High-impact actions can stay with a person for as long as you like.",
      },
    ],
  },
  {
    slug: "what-happens-after-ai-agents-go-live",
    title: "What happens after an AI agent goes live?",
    excerpt:
      "Going live is where the real value starts. Aygency operates every agent for you, monitors and tunes it, remembers each correction your team makes, and finds the next bottleneck to clear, so the system gets better the longer it runs. Your team keeps working as normal and approves anything high-impact from the command centre.",
    metaDescription:
      "After go-live, Aygency operates and tunes every agent, remembers each correction and finds the next bottleneck, so the system improves the longer it runs.",
    date: "12 November 2026",
    readTime: "4 min read",
    content: [
      {
        heading: "Built once, then it compounds",
        paragraphs: [
          "Most software is at its best on launch day and slowly drifts out of step with the business. An Aygency system works the other way round. It is built once around your real workflows, then it compounds: every week it handles more of the work, sees more of the edge cases and learns more about how your business runs.",
          "That only happens because someone keeps running it. We stay on as your AI growth partner and operate the system for as long as you use it.",
        ],
      },
      {
        heading: "What we do every month",
        paragraphs: [
          "Monitor: we watch every agent, check the quality of its work and catch anything unusual before it becomes a problem.",
          "Tune: as your processes, tools and customers change, we adjust the agents to match, so they never fall behind the way the business actually works.",
          "Remember: when your team corrects or edits something in the command centre, that decision is kept in the Brain and shapes how the agent handles the next one.",
          "Expand: the CEO Agent reads across the whole operation and shows where time is still being lost. We use that to find the next bottleneck and add the agent that clears it.",
        ],
      },
      {
        heading: "What your team does",
        paragraphs: [
          "Very little changes day to day. Agents slot into the tools you already use, routine work flows through on its own, and anything high-impact waits in the command centre for the right person to approve, edit or decline. Your people spend less time on repetitive admin and more on the work that needs their judgement.",
        ],
      },
      {
        heading: "What it looks like in practice",
        paragraphs: [
          "An invoicing agent goes live in a growing services business. In the first weeks the finance lead approves most of its work and corrects a handful of unusual supplier formats. Each correction is remembered, so approvals get quicker and exceptions get rarer. Meanwhile the CEO Agent shows that client onboarding is now the slowest part of the week, so an onboarding agent is designed next, building on everything the system already knows.",
        ],
      },
      {
        heading: "Worth knowing",
        paragraphs: [
          "The early weeks after launch are the most hands-on, because that is when the agent meets the full variety of your real work. That is a good thing. Every question it asks and every edit your team makes turns into a sharper system, and you can widen what an agent does on its own as it proves itself.",
        ],
      },
      nextStep(
        "Next step",
        "See how the full Aygency system fits together, from specialist agents to the CEO Agent, the Brain and the command centre, or talk to us about where your time goes today.",
        "/system",
        "See how the system works",
      ),
    ],
    faqs: [
      {
        q: "Do I have to manage my AI agents myself once they are live?",
        a: "No. Aygency operates every agent for you: monitoring, tuning, handling edge cases and adding agents as the business grows. Your team approves high-impact actions from the command centre and carries on working as normal.",
      },
      {
        q: "Do AI agents get better after launch?",
        a: "Yes. Every correction your team makes is remembered in the Brain, and we tune the agents as your business changes, so the system handles more of the work, more accurately, the longer it runs.",
      },
      {
        q: "What happens when the business changes or grows?",
        a: "The system grows with it. We adjust agents when your processes or tools change, and the CEO Agent highlights the next bottleneck so we can add the agent that clears it.",
      },
    ],
  },
];
