import {
  BookOpen,
  Bot,
  CalendarCheck,
  CheckCircle2,
  Clock,
  CreditCard,
  Database,
  FileText,
  Globe,
  Inbox,
  Lock,
  MessageSquare,
  PenTool,
  RefreshCw,
  Search,
  Send,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { services } from "@/lib/data";
import {
  AgentFeedCard,
  ApprovalCard,
  AskCard,
  BackOfficeScreen,
  BrainAnswerCard,
  BrainScreen,
  BrainTimelineCard,
  BrainUpdatesCard,
  BuiltToBeFoundCard,
  CalendarWeekCard,
  ChaseCard,
  CommandCentreScreen,
  ConversationCard,
  FeedCard,
  HandoverCard,
  InvoiceMatchCard,
  InvoiceQueueCard,
  MonthEndCard,
  MorningBrief,
  NumbersCard,
  OneIntoManyCard,
  PhoneFrame,
  ServiceScreen,
} from "./ProductScreens";
import type { ServiceTourContent } from "./ServiceTourPage";

const existingFaqs = (slug: string) => services.find((service) => service.slug === slug)?.faqs ?? [];

const phoneHero = (card: React.ReactNode) => <PhoneFrame className="mx-auto max-w-[320px]">{card}</PhoneFrame>;

// Sample conversations and cards reused between a page's opening and its tour.
const nightBooking = (
  <ConversationCard
    title="Chat, 2:04am"
    customer="Hi, can I move my booking to Friday?"
    agent="Done. You’re now booked in for Friday at 10:00, and I’ve sent your confirmation."
    steps={["Checked Friday’s availability", "Changed the booking", "Sent the confirmation and logged it"]}
  />
);
const supportHandover = (
  <HandoverCard
    flag="Passed to your team"
    who="Front-Desk agent"
    title="Sarah, this one needs you"
    points={["Delivery on order 2291 is six days late", "The customer has asked for a refund", "Full conversation and order history attached"]}
    action="Open the conversation"
  />
);
const renewals = (
  <NumbersCard
    title="Renewals, this month"
    rows={[
      ["Due", "214"],
      ["Renewed", "168"],
      ["Being followed up", "31"],
      ["Need a person", "15"],
    ]}
    note="Reminders go out on time, without anyone having to remember."
  />
);
const failedPayment = (
  <HandoverCard
    flag="Picked up today"
    who="Operations agent"
    title="Payment failed: J. Patel, Gold"
    points={["Card expired this month", "Sent a friendly note with a link to update it", "Comes to your team if it’s still open on Friday"]}
    action="See the note"
  />
);
const prospect = (
  <HandoverCard
    flag="New prospect"
    who="Lead Gen agent"
    title="Priya Shah, Kestrel Logistics"
    points={["Hiring three operations roles this month", "Just opened a second site in Leeds", "Looks like your best customers"]}
    action="See her first message"
  />
);
const warmReply = (
  <ConversationCard
    title="Warm reply, 9:14am"
    customer="Thanks for this. We’re looking at exactly that. Could we talk next week?"
    agent="Passed to Tom, with the background and three times that suit him."
    steps={["Read the reply and spotted the interest", "Pulled together who they are and what was said", "Added it to your pipeline in HubSpot"]}
  />
);
const draftPost = (
  <HandoverCard
    flag="Ready for you"
    who="Content Production agent"
    title="“Three things we’d do differently”"
    points={["Written in your voice, from how you already write", "Based on what your market is talking about this week", "Goes out Thursday, once you’ve approved it"]}
    action="Approve the post"
  />
);
const contentMonth = (
  <FeedCard
    title="This month’s rhythm"
    rows={[
      { time: "Now", who: "Research", what: "Reading what’s moving in your market" },
      { time: "Mon", who: "LinkedIn", what: "Post published, after your approval" },
      { time: "Wed", who: "Article", what: "Draft ready for your review" },
      { time: "Fri", who: "Newsletter", what: "Client update on schedule" },
    ]}
  />
);
const siteChat = (
  <ConversationCard
    title="On your website, 10:12pm"
    customer="Do you cover Yorkshire, and how quickly could you start?"
    agent="We do. Most projects start within a few weeks. Could I take your details so the team can confirm?"
    steps={["Answered from your own website and information", "Took the visitor’s details", "Sent the enquiry to the right person"]}
  />
);
const enquiry = (
  <HandoverCard
    flag="New enquiry"
    who="Front-Desk agent"
    title="Office fit-out, Leeds"
    points={["Asked at 10:12pm, answered straight away", "Wants to start within a few weeks", "Full conversation attached"]}
    action="Open the enquiry"
  />
);

// Service pages rebuilt in the tour shape, by slug. Name real tools people recognise, and make
// every section say something the others don't. See docs/service-pages-plan.md.
export const serviceTourPages: Record<string, ServiceTourContent> = {
  "command-centre": {
    eyebrow: "command centre",
    promise: ["See everything.", "Approve what matters.", "From anywhere."],
    intro:
      "Your own app, on your phone and at your desk, where AI agents run the work and your people stay in charge. Your team only has to check it.",
    heroDesktop: (
      <div className="relative">
        <div className="xl:mr-36">
          <CommandCentreScreen />
        </div>
        <PhoneFrame className="hidden xl:block absolute -bottom-10 right-0 w-[218px]">
          <MorningBrief />
        </PhoneFrame>
      </div>
    ),
    heroPhone: (
      <PhoneFrame className="mx-auto max-w-[300px]">
        <MorningBrief />
      </PhoneFrame>
    ),
    toolsHeading: "Your tools don’t talk to each other. So your people do.",
    drawing: {
      tools: ["Excel", "Outlook", "Xero", "HubSpot", "Google Sheets", "Sage", "SharePoint", "Slack", "Salesforce", "Gmail", "QuickBooks", "Microsoft Teams"],
      beforeLabel: "Before: your people connect it all",
      nowLabel: "Now: one home, and a clear head",
      panelTitle: "Command centre",
      panelRows: [
        { icon: Users, title: "One home", text: "for your people and your agents" },
        { icon: Database, title: "All your data", text: "centralised, and always live" },
        { icon: Bot, title: "Your agents", text: "running the work, in plain view" },
        { icon: Search, title: "Ask it anything", text: "and see the working behind it" },
        { icon: CheckCircle2, title: "Approve in one click", text: "anything high-impact comes to you" },
      ],
    },
    tour: [
      {
        eyebrow: "Ask",
        title: "Ask it anything, and see how it knows.",
        text: "Type or speak a question. Your CEO Agent goes to your tools, does the sums and answers with the working behind it.",
        steps: [
          "Reads Xero, Outlook and SharePoint, right where they already are",
          "Works it out the way your business does, from your Brain",
          "Shows you the documents behind the answer",
        ],
        picture: <AskCard />,
      },
      {
        eyebrow: "Approve",
        title: "The work arrives done. You only have to approve it.",
        text: "Agents prepare the work and bring you anything high-impact, with the reason attached, on your phone or at your desk. Each of your team sees and approves only what their role allows.",
        steps: [
          "Checks it against your orders and your past prices",
          "Asks a person when it isn’t sure",
          "Records every action, with the reason why",
        ],
        picture: <ApprovalCard />,
      },
      {
        eyebrow: "See",
        title: "Every agent, in plain view.",
        text: "Your whole business on one screen, and every agent’s work beside it: what’s finished, what’s running and what’s waiting for you.",
        steps: [
          "Works through the jobs you’ve given it, around the clock",
          "Flags anything that looks off the day it happens",
          "Learns from every correction your team makes",
        ],
        picture: <AgentFeedCard />,
      },
    ],
    getBackLine: ["More work.", "Same team."],
    getBackText:
      "Admin stops being the ceiling, so how far you scale is set by the work you win, not the people you can hire.",
    getBack: [
      { title: "Time", text: "Your best people back on the work only they can do." },
      { title: "Speed", text: "Agents that never sleep, so things get done the day they land." },
      { title: "Control", text: "Live numbers every day, with every figure traceable to the document behind it." },
      { title: "An asset", text: "Your data and your Brain are yours, and a business that runs this way carries value." },
    ],
    closing: "See what your command centre would look like.",
    faqs: [
      {
        q: "What is a command centre?",
        a: "Your own app, on your phone and at your desk, where your people and your AI agents work together. You see the business, ask it questions and approve the work, all in one place.",
      },
      {
        q: "What does the AI actually do?",
        a: "Agents read your tools, do the work the way your business does it and check it against your own history. They bring your team the result to approve, with the working shown, and they ask a person when they aren’t sure.",
      },
      {
        q: "Does it replace our existing tools?",
        a: "Your tools stay. The agents connect to what you already use and bring it together, so your team keeps working the way it does today.",
      },
      {
        q: "Who stays in control?",
        a: "Your team. High-impact actions come to a person for approval first, and each person sees and approves only what their role allows.",
      },
      {
        q: "What happens if an agent gets something wrong?",
        a: "Your team sees the working behind every result, so a mistake is easy to spot and correct. Each correction is remembered, so the agent gets it right next time.",
      },
      {
        q: "Who owns our data?",
        a: "You do. Your data and your Brain are yours to keep, and we handle them to GDPR-aligned standards.",
      },
    ],
  },

  "back-office-agents": {
    eyebrow: "back-office agents",
    promise: ["Your team", "checks the work.", "Agents do it."],
    intro:
      "The invoices, the data entry, the reconciliations, the reports and the chasing, prepared by AI agents every day, in your systems and to your formats.",
    heroDesktop: <BackOfficeScreen />,
    heroPhone: phoneHero(
      <>
        <p className="font-heading text-lg leading-tight font-semibold text-white mb-3 px-1">41 invoices read overnight. One needs you.</p>
        <InvoiceQueueCard />
      </>,
    ),
    toolsHeading: "Your tools don’t talk to each other. So your team types it all twice.",
    drawing: {
      tools: ["Xero", "Excel", "Outlook", "Sage", "QuickBooks", "Google Sheets", "Dext", "SharePoint", "Stripe", "Gmail", "Dropbox", "Microsoft Teams"],
      beforeLabel: "Before: your team keys it all in",
      nowLabel: "Now: agents do it, and a clear head",
      panelTitle: "Your back-office agents",
      panelRows: [
        { icon: FileText, title: "Invoices", text: "read, matched and ready to post" },
        { icon: RefreshCw, title: "Reconciliation", text: "bank, card and supplier statements" },
        { icon: Database, title: "Reports", text: "built from live data, every figure traceable" },
        { icon: Send, title: "Chasing", text: "followed up on time, every time" },
        { icon: CheckCircle2, title: "Your team checks", text: "only what needs a person" },
      ],
    },
    tour: [
      {
        eyebrow: "Invoices",
        title: "Every invoice read, matched and ready to post.",
        text: "Your team only has to look at what doesn’t match. Anything over its order gets stopped before it’s paid.",
        steps: [
          "Reads each invoice as it lands in Outlook",
          "Matches it to the order and the delivery note",
          "Holds anything that’s off, and shows you why",
        ],
        picture: <InvoiceMatchCard />,
      },
      {
        eyebrow: "Month end",
        title: "Checked, not built.",
        text: "The draft is waiting with the working behind each figure, so your finance lead reviews it instead of rebuilding it.",
        steps: [
          "Pulls every figure from Xero and your spreadsheets",
          "Reconciles bank, card and supplier statements line by line",
          "Remembers each correction, so next month is sharper",
        ],
        picture: <MonthEndCard />,
      },
      {
        eyebrow: "Chasing",
        title: "The chasing gets done, on time, every time.",
        text: "Missing documents, late payments and overdue approvals get followed up without anyone having to remember.",
        steps: [
          "Spots what’s missing the day it’s due",
          "Asks the right person, in your tone",
          "Reads the reply, files it and closes the chase",
        ],
        picture: <ChaseCard />,
      },
    ],
    getBackLine: ["More work.", "Same team."],
    getBackText: "Admin stops growing with the work, so the next customer doesn’t have to bring the next hire.",
    getBack: [
      { title: "Time", text: "Up to 100 hours a month from each agent, back with your people." },
      { title: "Speed", text: "Invoices posted the day they arrive, so cash comes in sooner and suppliers get paid on time." },
      { title: "Money", text: "Any invoice that doesn’t match its order gets stopped before it’s paid." },
      { title: "Control", text: "A slip in margin seen the week it happens, not at month end." },
    ],
    closing: "See how many hours your back office could get back.",
    faqs: existingFaqs("back-office-agents"),
  },

  "business-brain": {
    eyebrow: "business brain",
    promise: ["Everything", "your business knows,", "one question away."],
    intro:
      "Your private AI knowledge layer. Every process, policy, decision and quirk of how your business runs, held in one place your team can ask in plain language. It comes with every system we build, and it’s yours to keep.",
    heroDesktop: <BrainScreen />,
    heroPhone: phoneHero(<BrainAnswerCard />),
    toolsHeading: "What your business knows is scattered everywhere. So your people carry it.",
    drawing: {
      tools: ["SharePoint", "Outlook", "Google Drive", "Excel", "Notion", "Gmail", "OneDrive", "Slack", "Confluence", "Dropbox", "Word", "Microsoft Teams"],
      beforeLabel: "Before: it all lives in people’s heads",
      nowLabel: "Now: just ask, and a clear head",
      panelTitle: "Your Brain",
      panelRows: [
        { icon: BookOpen, title: "Everything you know", text: "processes, policies, decisions, history" },
        { icon: Search, title: "Ask in plain language", text: "and see where the answer came from" },
        { icon: RefreshCw, title: "Always current", text: "kept up to date by us and your agents" },
        { icon: Lock, title: "Private to you", text: "access follows each person’s role" },
        { icon: CheckCircle2, title: "Yours to keep", text: "wherever the business goes next" },
      ],
    },
    tour: [
      {
        eyebrow: "Ask",
        title: "Ask it anything, and get it right.",
        text: "Your team asks in plain language and gets the answer in seconds, with where it came from. Your best people stop being the help desk.",
        steps: [
          "Searches your documents, data and history",
          "Finds the current answer, not last year’s version",
          "Shows the source, so nobody has to take it on trust",
        ],
        picture: <BrainAnswerCard />,
      },
      {
        eyebrow: "Current",
        title: "It keeps itself up to date.",
        text: "We keep it current, and so do your agents. Every system you run writes back what it learns, so it reflects how the business works today.",
        steps: [
          "Every agent writes back what it learns on the job",
          "Each correction from your team goes straight in",
          "Access follows each person’s role",
        ],
        picture: <BrainUpdatesCard />,
      },
      {
        eyebrow: "Yours",
        title: "It’s yours, and it travels.",
        text: "A handy reference this year, irreplaceable in five. Wherever the business goes next, you hold a brain that took years to build.",
        steps: [
          "Captures how the work really gets done, as it happens",
          "Gives every new hire the answers from day one",
          "Makes every agent you add sharper from its first job",
        ],
        picture: <BrainTimelineCard />,
      },
    ],
    getBackLine: ["Your knowledge.", "Yours to keep."],
    getBackText: "A business that stops depending on any one person. What your people know stays in the business as it grows.",
    getBack: [
      { title: "Time", text: "Your best people stop answering the same questions." },
      { title: "Speed", text: "New starters get up to speed with every answer a question away." },
      { title: "Better agents", text: "Every agent works from how your business really runs." },
      { title: "An asset", text: "It compounds for years, and it stays with you." },
    ],
    closing: "See what your Brain would hold.",
    faqs: [
      ...existingFaqs("business-brain"),
      {
        q: "What goes into it?",
        a: "Your documents, data and history, wherever they live today, plus what your people know and what your agents learn as they work.",
      },
      {
        q: "Who can see what?",
        a: "Access follows each person’s role, so people see what they should and nothing else.",
      },
      {
        q: "What happens to it if we stop working with you?",
        a: "You keep it. Your Brain is your asset, built around your business, and it’s yours to take.",
      },
    ],
  },

  "customer-support": {
    eyebrow: "customer support",
    promise: ["Every customer", "answered in seconds,", "at any hour."],
    intro:
      "AI agents on chat, email or voice that answer, book and update, in your tone and from your own information. Anything that needs a person reaches the right one with the full story attached.",
    heroDesktop: <ServiceScreen title="Overnight: 38 answered. One needs your team." left={nightBooking} right={supportHandover} />,
    heroPhone: phoneHero(nightBooking),
    toolsHeading: "Your inboxes don’t answer themselves. So your team does.",
    drawing: {
      tools: ["Zendesk", "Intercom", "Gmail", "Outlook", "WhatsApp", "Freshdesk", "HubSpot", "Shopify", "Calendly", "Salesforce", "Slack", "Excel"],
      beforeLabel: "Before: your team answers every one",
      nowLabel: "Now: answered, and a clear head",
      panelTitle: "Your support agents",
      panelRows: [
        { icon: Zap, title: "Instant answers", text: "on chat, email and voice" },
        { icon: CalendarCheck, title: "Real requests, done", text: "bookings, changes and status checks" },
        { icon: Users, title: "The right person", text: "with the full story attached" },
        { icon: Clock, title: "Round the clock", text: "the same standard on your busiest day" },
        { icon: Inbox, title: "Everything logged", text: "in the systems you already use" },
      ],
    },
    tour: [
      {
        eyebrow: "Answer",
        title: "A question at 2am gets an answer at 2am.",
        text: "Routine questions get answered and real requests get done, while the customer is still on the page.",
        steps: [
          "Reads the question and finds the answer in your own information",
          "Checks your booking system or order history",
          "Makes the change and confirms it",
        ],
        picture: nightBooking,
      },
      {
        eyebrow: "Hand over",
        title: "The tricky ones reach your team, with the whole story.",
        text: "Your team opens to the conversations that need a person, and the customer never has to explain it all again.",
        steps: [
          "Knows when a person should take over",
          "Finds the right person on your team",
          "Writes up what’s happened, with the order history attached",
        ],
        picture: supportHandover,
      },
      {
        eyebrow: "Improve",
        title: "It resolves more every month.",
        text: "Every conversation teaches it more about your customers and how you like them handled.",
        steps: [
          "Learns from every conversation and every correction",
          "Spots the questions customers keep asking",
          "Logs everything in the tools you already use",
        ],
        picture: (
          <NumbersCard
            title="Support, this week"
            rows={[
              ["Conversations", "412"],
              ["Answered by agents", "381"],
              ["Bookings changed", "96"],
              ["Passed to your team", "31"],
            ]}
            note="Every conversation is logged where your team can see it."
          />
        ),
      },
    ],
    getBackLine: ["More customers.", "Same team."],
    getBackText: "Your support no longer has to grow every time your business does.",
    getBack: [
      { title: "Time", text: "Your team spends its day on the customers who need a person." },
      { title: "Speed", text: "An answer in seconds, at any hour." },
      { title: "Revenue", text: "Enquiries answered while people are still interested." },
      { title: "Control", text: "One standard on every reply, and anything tricky goes to your team." },
    ],
    closing: "See where agents would help your customers most.",
    faqs: [
      ...existingFaqs("customer-support"),
      {
        q: "Will it sound like us?",
        a: "Yes. The agents answer in your tone and from your own information, and your team can correct them at any point.",
      },
      {
        q: "Can it work with the tools we already use?",
        a: "Yes. The agents connect to your inbox, chat and booking tools, so your team keeps working the way it does today.",
      },
    ],
  },

  "membership-management": {
    eyebrow: "membership management",
    promise: ["More members.", "The same team.", "Far less admin."],
    intro:
      "AI agents that keep your records clean, send your renewals, answer your members and welcome new ones, across thousands of members.",
    heroDesktop: <ServiceScreen title="Renewals are on track. 15 members need a person." left={renewals} right={failedPayment} />,
    heroPhone: phoneHero(renewals),
    toolsHeading: "Your tools don’t talk to each other. So your team chases every renewal.",
    drawing: {
      tools: ["Stripe", "GoCardless", "Mailchimp", "Salesforce", "HubSpot", "Excel", "Outlook", "Gmail", "Eventbrite", "Xero", "Google Sheets", "Wild Apricot"],
      beforeLabel: "Before: your team remembers it all",
      nowLabel: "Now: on time, and a clear head",
      panelTitle: "Your membership agents",
      panelRows: [
        { icon: Database, title: "Records kept right", text: "up to date across your tools" },
        { icon: RefreshCw, title: "Renewals on time", text: "reminders and follow-ups, handled" },
        { icon: CreditCard, title: "Failed payments", text: "picked up the same day" },
        { icon: MessageSquare, title: "Member questions", text: "answered instantly, at any hour" },
        { icon: Users, title: "New members", text: "welcomed and set up straight away" },
      ],
    },
    tour: [
      {
        eyebrow: "Renewals",
        title: "Every renewal goes out on time.",
        text: "Reminders and follow-ups happen without anyone having to remember, and you can see how things stand whenever you look.",
        steps: [
          "Reads who’s due from your membership records",
          "Sends the right reminder at the right time",
          "Follows up until it’s done, then updates the record",
        ],
        picture: renewals,
      },
      {
        eyebrow: "Payments",
        title: "A failed payment gets noticed the same day.",
        text: "It’s followed up politely and on time, so fewer members lapse because nobody spotted it.",
        steps: [
          "Spots the failed payment in Stripe or GoCardless",
          "Works out the likely reason",
          "Sends a friendly note, and passes it on if it needs a person",
        ],
        picture: failedPayment,
      },
      {
        eyebrow: "Members",
        title: "Every member gets an answer in seconds.",
        text: "Bookings, questions and new joiners get handled at any hour, so your team can spend its time on the part members remember.",
        steps: [
          "Answers from your own rules and each member’s record",
          "Completes the booking or the change",
          "Welcomes new members and sets them up from day one",
        ],
        picture: (
          <ConversationCard
            title="Member chat, 7:41pm"
            customer="Can I bring a guest on Saturday, and is my membership still active?"
            agent="You’re all set until March, and Saturday’s guest pass is booked. I’ve sent the details."
            steps={["Checked the member’s record", "Booked the guest pass", "Sent the confirmation and logged it"]}
          />
        ),
      },
    ],
    getBackLine: ["More members.", "Same team."],
    getBackText: "Your membership grows and your admin doesn’t, so the next thousand members don’t have to bring the next hire.",
    getBack: [
      { title: "Time", text: "Your team back on the member experience and on growth." },
      { title: "Revenue", text: "Renewals on time, and fewer payments lost to nobody noticing." },
      { title: "Experience", text: "Fast, consistent answers for every member." },
      { title: "Control", text: "Clean records and live numbers, whenever you look." },
    ],
    closing: "See where agents would take the load off your membership.",
    faqs: [
      ...existingFaqs("membership-management"),
      {
        q: "What happens with a member who needs a real conversation?",
        a: "It goes to the right person on your team, with the member’s record and the full conversation attached.",
      },
    ],
  },

  "lead-generation": {
    eyebrow: "lead generation",
    promise: ["Meetings", "in your calendar,", "without the prospecting."],
    intro:
      "AI agents that find the right prospects, research them, reach out in your voice and follow up until they reply. Your team opens warm conversations and spends its time closing.",
    heroDesktop: <ServiceScreen title="Three warm replies this morning." left={warmReply} right={<CalendarWeekCard />} />,
    heroPhone: phoneHero(<CalendarWeekCard />),
    toolsHeading: "Your pipeline is spread across a dozen tools. So prospecting waits until someone’s free.",
    drawing: {
      tools: ["LinkedIn", "HubSpot", "Salesforce", "Outlook", "Gmail", "Apollo", "Excel", "Google Sheets", "Pipedrive", "Calendly", "Zoom", "Slack"],
      beforeLabel: "Before: it waits for a free afternoon",
      nowLabel: "Now: booked, and a clear head",
      panelTitle: "Your lead generation agents",
      panelRows: [
        { icon: Target, title: "The right prospects", text: "found from market signals" },
        { icon: Search, title: "Every one researched", text: "so each message is about them" },
        { icon: Send, title: "Outreach in your voice", text: "on a steady rhythm" },
        { icon: Inbox, title: "Warm replies", text: "read and passed to your team" },
        { icon: CalendarCheck, title: "Pipeline kept moving", text: "in the tools you already use" },
      ],
    },
    tour: [
      {
        eyebrow: "Find",
        title: "New, researched prospects, every day.",
        text: "Your agents watch your market for the signals that matter and look for the companies that resemble your best customers.",
        steps: [
          "Reads market signals and LinkedIn for the right moments",
          "Compares each company with the customers you already win",
          "Scores them, and adds the best to your pipeline",
        ],
        picture: prospect,
      },
      {
        eyebrow: "Reach out",
        title: "Every message written for one person, in your voice.",
        text: "Each one is about them, and the follow-ups go out on time, every time. Your team opens warm conversations instead of a blank list.",
        steps: [
          "Writes a first message from what it found",
          "Follows up across email and LinkedIn",
          "Reads every reply, and passes on the warm ones",
        ],
        picture: warmReply,
      },
      {
        eyebrow: "Book",
        title: "A calendar that starts to fill.",
        text: "Your salespeople spend their time on conversations and deals, with the background already written.",
        steps: [
          "Keeps deals moving in HubSpot or Salesforce",
          "Flags a deal that’s gone quiet the week it happens",
          "Learns what’s landing, and sharpens the targeting each month",
        ],
        picture: <CalendarWeekCard />,
      },
    ],
    getBackLine: ["A full pipeline.", "However busy you are."],
    getBackText: "Growth stops depending on who has a free afternoon.",
    getBack: [
      { title: "Time", text: "Your salespeople on conversations and deals, not lists and follow-ups." },
      { title: "Revenue", text: "More conversations started, and fewer good leads gone cold." },
      { title: "Insight", text: "Your agents learn what’s landing and sharpen the targeting every month." },
      { title: "Control", text: "Everything goes out in your voice, to the standard you set." },
    ],
    closing: "See what a pipeline that keeps moving could win you.",
    faqs: existingFaqs("lead-generation"),
  },

  content: {
    eyebrow: "content",
    promise: ["Show up every week", "without writing", "every week."],
    intro:
      "AI agents that research, draft and publish in your voice on a steady rhythm: posts, articles, newsletters and client updates. You approve it, and your business stays visible while your people focus on clients.",
    heroDesktop: <ServiceScreen title="This week’s content is ready for you." left={draftPost} right={contentMonth} />,
    heroPhone: phoneHero(draftPost),
    toolsHeading: "Your best ideas never make it out. So your channels go quiet.",
    drawing: {
      tools: ["LinkedIn", "WordPress", "Instagram", "Mailchimp", "Google Docs", "Notion", "Canva", "YouTube", "HubSpot", "Buffer", "Word", "Slack"],
      beforeLabel: "Before: it waits for your busiest people",
      nowLabel: "Now: a rhythm, and a clear head",
      panelTitle: "Your content agents",
      panelRows: [
        { icon: Search, title: "Research", text: "what matters in your market" },
        { icon: PenTool, title: "Written in your voice", text: "learned from how you already write" },
        { icon: RefreshCw, title: "One piece goes further", text: "posts, newsletters and client updates" },
        { icon: CheckCircle2, title: "You approve it", text: "then it publishes on a rhythm" },
        { icon: Target, title: "Learns what lands", text: "and sharpens every month" },
      ],
    },
    tour: [
      {
        eyebrow: "Write",
        title: "A draft in your voice, waiting for your approval.",
        text: "Your experts stay on clients. You change a line, approve the rest and get on with your day.",
        steps: [
          "Learns your voice from how you already write",
          "Reads what’s moving in your market this week",
          "Drafts it, and brings it to you to approve",
        ],
        picture: draftPost,
      },
      {
        eyebrow: "Repurpose",
        title: "One article becomes a month of content.",
        text: "Every good idea gets used across every channel, not once on one.",
        steps: [
          "Pulls the strongest points out of each piece",
          "Rewrites them for each channel",
          "Lines them up across your month",
        ],
        picture: <OneIntoManyCard />,
      },
      {
        eyebrow: "Publish",
        title: "The same steady rhythm, every week of the year.",
        text: "When the team gets busy, your channels stay exactly as active as they were.",
        steps: [
          "Publishes on schedule, once you’ve approved it",
          "Keeps your newsletter and client updates on time",
          "Learns what lands, and sharpens the next piece",
        ],
        picture: contentMonth,
      },
    ],
    getBackLine: ["Always visible.", "However busy you get."],
    getBackText: "Your business keeps showing up, and your people keep their time for clients.",
    getBack: [
      { title: "Time", text: "Your experts on clients, not on blank pages." },
      { title: "Consistency", text: "The same steady rhythm every week of the year." },
      { title: "Reach", text: "One idea working across every channel." },
      { title: "Control", text: "Nothing goes out without your approval, unless you choose otherwise." },
    ],
    closing: "See the content system that would keep you visible.",
    faqs: [
      ...existingFaqs("content"),
      {
        q: "Do we still approve what goes out?",
        a: "Yes. Everything comes to you for approval unless you choose otherwise, and each change you make teaches the agents your voice.",
      },
    ],
  },

  "website-overhaul": {
    eyebrow: "website overhaul",
    promise: ["A website", "that sells,", "and answers back."],
    intro:
      "Your site rebuilt around how you sell today, fast and clear, with AI agents built in to answer questions, capture every enquiry and send it to the right person.",
    heroDesktop: <ServiceScreen title="A question came in at 10:12pm. It’s already handled." left={siteChat} right={enquiry} />,
    heroPhone: phoneHero(siteChat),
    toolsHeading: "Your website sits apart from your business. So enquiries wait in an inbox.",
    drawing: {
      tools: ["WordPress", "Wix", "Squarespace", "Webflow", "Shopify", "Google Analytics", "HubSpot", "Mailchimp", "Typeform", "Calendly", "Outlook", "Gmail"],
      beforeLabel: "Before: enquiries wait in an inbox",
      nowLabel: "Now: answered, and a clear head",
      panelTitle: "Your new website",
      panelRows: [
        { icon: Globe, title: "Says what you do", text: "clearly, in the first few seconds" },
        { icon: Zap, title: "Fast, modern pages", text: "built to turn visitors into enquiries" },
        { icon: MessageSquare, title: "Agents built in", text: "answering questions at any hour" },
        { icon: Send, title: "Every enquiry routed", text: "with the full conversation attached" },
        { icon: Search, title: "Built to be found", text: "by search engines and AI assistants" },
      ],
    },
    tour: [
      {
        eyebrow: "Answer",
        title: "A visitor at 10pm gets an answer at 10pm.",
        text: "Your site answers questions from your own information while the person is still interested.",
        steps: [
          "Reads the question and answers from your own information",
          "Takes the visitor’s details",
          "Hands over anything that needs a person",
        ],
        picture: siteChat,
      },
      {
        eyebrow: "Route",
        title: "Every enquiry reaches the right person by morning.",
        text: "Nothing sits in a shared inbox, and your team starts with the whole conversation in front of them.",
        steps: [
          "Works out what the visitor needs",
          "Sends it to the right person on your team",
          "Adds it to HubSpot or your CRM",
        ],
        picture: enquiry,
      },
      {
        eyebrow: "Be found",
        title: "Written so search engines and AI assistants understand you.",
        text: "When someone asks an AI assistant about your sector, your site gives it something clear to find and cite.",
        steps: [
          "Structures your content so it’s easy to read and cite",
          "Keeps your pages current as your business changes",
          "Answers the questions your buyers really ask",
        ],
        picture: <BuiltToBeFoundCard />,
      },
    ],
    getBackLine: ["More enquiries.", "From the same visitors."],
    getBackText: "More of the people who find you become conversations with your team.",
    getBack: [
      { title: "Revenue", text: "Fewer enquiries lost after hours or in an inbox." },
      { title: "Credibility", text: "A site that matches the size of your business." },
      { title: "Speed", text: "Every visitor gets an answer straight away." },
      { title: "Visibility", text: "Found by search engines and AI assistants." },
    ],
    closing: "See what your website could be doing for you.",
    faqs: existingFaqs("website-overhaul"),
  },
};
