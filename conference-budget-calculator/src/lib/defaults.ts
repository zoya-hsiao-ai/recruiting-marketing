import type {
  Conference,
  ActionItem,
  BudgetLineItem,
  BudgetSummaryItem,
  TeamSpendItem,
  BoothMaterial,
  Booth,
  PrivateEvent,
  Budget,
  Strategy,
} from "./types";

let _counter = 0;
export function genId(prefix = "id") {
  return `${prefix}-${Date.now()}-${++_counter}`;
}

function actionItem(task: string, notes = "", estimatedTime = ""): ActionItem {
  return {
    id: genId("ai"),
    status: "not_started",
    dueDate: "",
    dri: "",
    task,
    notes,
    estimatedTime,
  };
}

export const DEFAULT_ACTION_ITEMS: Record<string, ActionItem[]> = {
  "Pre-Conference Setup": [
    actionItem("Draft conference proposal"),
    actionItem("Put together conference budget estimate"),
    actionItem("Work with Finance to get conference ramp card"),
    actionItem("Work with Finance to get onboarded onto expense platform", "e.g. Coupa"),
    actionItem("Reserve all hotel blocks"),
    actionItem("Share T&C legal updates with legal team"),
    actionItem("Send T&C updates to Legal"),
    actionItem("Register conference attendees", "Check early bird pricing deadline"),
    actionItem("Confirm booth space with conference"),
  ],
  "Content & Outreach Prep": [
    actionItem("Identify relevant papers and research to reference in outreach", "Steps: verify keywords with research team, feed ~2500 papers into ChatGPT/Claude/Cursor to identify papers, then prompt engineering to double check and prevent errors"),
    actionItem("Create event RSVP form (Gem/Google Form)", "", "1 hour"),
    actionItem("Prioritize papers and authors for pre-conference outreach", "Split between team members for review"),
    actionItem("Create/edit pre-conference outreach Gem sequences", "Two kinds: breakfast invite + booth awareness"),
    actionItem("Finalize flyer copy and hand off to Design", "", "Recruiting: 2 hours"),
    actionItem("Complete booth build design and hand off to Design"),
    actionItem("Create a social media strategy with Marketing", "", "Recruiting/Marketing: 2 hours"),
    actionItem("Create a script to cross-reference authors with attendee list to find contact info", "", "Recruiting/Eng: 1-2 hours"),
  ],
  "Logistics & Coordination": [
    actionItem("Get attendee list from conference organizer", "As a sponsor, we get a list of names and emails of attendees"),
    actionItem("Schedule pre-conference trainings for attendees"),
    actionItem("Block off all calendars with relevant details, links, talking points", "", "Recruiting: 1 hour"),
    actionItem("Get service account from vendor for conference email", "e.g. iccv2025@applied.co"),
    actionItem("Finalize Gem/Google form for private event RSVP", "", "Lauren = 2 hours"),
    actionItem("Upload candidate list to Gem and categorize by project", "", "Lauren = 30 mins"),
    actionItem("Send breakfast interest sequence"),
    actionItem("Create and post job board requisitions on conference careers site", "", "Lauren = 1 hour"),
    actionItem("Get scanning app set up for lead capture at booth"),
    actionItem("Collaborate with Design on private event invitation graphic", "", "Recruiting: 1 hour"),
    actionItem("Budget time to respond to email responses", "For P0 candidates, setting them up for on-prem chats", "6-8 hours"),
  ],
  "Event Week": [
    actionItem("Confirm freight delivery and booth materials arrived"),
    actionItem("Booth setup and walkthrough"),
    actionItem("Distribute booth staff schedule and shift reminders"),
    actionItem("Private event setup and vendor check-in"),
    actionItem("Run daily attendee debrief and lead capture sync"),
    actionItem("Capture photos and content for social / employer brand"),
    actionItem("Execute sourcing conversations on the floor"),
    actionItem("Monitor RSVP list and manage walk-ins at private event"),
  ],
  "Post-Conference": [
    actionItem("Send mass outreach sequence to all booth leads"),
    actionItem("Manually manage breakfast interest form responses", "Stop sequences for RSVPs"),
    actionItem("Upload all leads to Ashby with conference source tag", "e.g. 'Conference - CVPR' or 'Conference - ICCV'"),
    actionItem("Send follow-up emails to all captured leads within 48 hours"),
    actionItem("Debrief with team — what worked, what didn't"),
    actionItem("Post event recap on internal Slack (wins, metrics, photos)"),
    actionItem("Reconcile actuals vs. budget"),
    actionItem("Publish social content / blog post if applicable"),
    actionItem("Track pipeline conversion at 30/60/90 days"),
    actionItem("Conference Job Board opens (if applicable)"),
  ],
};

export const DEFAULT_BUDGET_LINE_ITEMS: BudgetLineItem[] = [
  { dateOfSpend: "", item: "Hotel Room for 1 person/night", source: "Ramp Card", costPerUnit: 300, quantity: 0, totalCost: 0, actualSpend: 0, notes: "Quantity is # of people x # of nights; Respective attendee's team is cost center" },
  { dateOfSpend: "", item: "Flight for 1 person roundtrip", source: "Navan", costPerUnit: 450, quantity: 0, totalCost: 0, actualSpend: 0, notes: "Respective attendee's team is cost center" },
  { dateOfSpend: "", item: "Local Transportation roundtrip", source: "Ramp Reimbursement", costPerUnit: 80, quantity: 0, totalCost: 0, actualSpend: 0, notes: "Respective attendee's team is cost center" },
  { dateOfSpend: "", item: "Meals and Incidentals per person", source: "Ramp Reimbursement", costPerUnit: 300, quantity: 0, totalCost: 0, actualSpend: 0, notes: "$60/person/day; Respective attendee's team is cost center" },
  { dateOfSpend: "", item: "Conference Booth Space Registration", source: "Ramp Card", costPerUnit: 0, quantity: 1, totalCost: 0, actualSpend: 0, notes: "$/sq ft; 50/50 split between Recruiting/Marketing" },
  { dateOfSpend: "", item: "Conference Sponsorship", source: "Ramp Card", costPerUnit: 0, quantity: 1, totalCost: 0, actualSpend: 0, notes: "Research pays (if Silver/Gold level)" },
  { dateOfSpend: "", item: "Conference Registration (Full/Passport)", source: "Ramp Card", costPerUnit: 750, quantity: 0, totalCost: 0, actualSpend: 0, notes: "Respective attendee's team is cost center" },
  { dateOfSpend: "", item: "10x10 Booth Build", source: "Freeman", costPerUnit: 0, quantity: 1, totalCost: 0, actualSpend: 0, notes: "50/50 split between Recruiting/Marketing" },
  { dateOfSpend: "", item: "10x10 Booth Build A/V", source: "Freeman", costPerUnit: 0, quantity: 1, totalCost: 0, actualSpend: 0, notes: "" },
  { dateOfSpend: "", item: "Booth Exhibit Staff Registration", source: "Ramp Card", costPerUnit: 75, quantity: 0, totalCost: 0, actualSpend: 0, notes: "50/50 split between Recruiting/Marketing" },
  { dateOfSpend: "", item: "Booth Badge Scanners", source: "Freeman", costPerUnit: 0, quantity: 0, totalCost: 0, actualSpend: 0, notes: "50/50 split between Recruiting/Marketing" },
  { dateOfSpend: "", item: "Booth Fliers", source: "Ramp Card", costPerUnit: 0, quantity: 1000, totalCost: 0, actualSpend: 0, notes: "50/50 split between Recruiting/Marketing" },
  { dateOfSpend: "", item: "Breakfast Event Invitations", source: "Ramp Card", costPerUnit: 0, quantity: 300, totalCost: 0, actualSpend: 0, notes: "Recruiting pays" },
  { dateOfSpend: "", item: "Breakfast Event Venue", source: "Hotel Venue", costPerUnit: 680, quantity: 2, totalCost: 0, actualSpend: 0, notes: "Recruiting pays; Quantity is for 2 half-days" },
  { dateOfSpend: "", item: "Breakfast Event Food Order", source: "Hotel Venue", costPerUnit: 70, quantity: 80, totalCost: 0, actualSpend: 0, notes: "Recruiting pays; 40 people for 2 breakfast events" },
  { dateOfSpend: "", item: "Swag: TBD", source: "Ramp Card", costPerUnit: 0, quantity: 600, totalCost: 0, actualSpend: 0, notes: "50/50 split between Recruiting/Marketing" },
  { dateOfSpend: "", item: "Swag: Applied stickers", source: "Ramp Card", costPerUnit: 0.27, quantity: 1000, totalCost: 0, actualSpend: 0, notes: "50/50 split between Recruiting/Marketing" },
  { dateOfSpend: "", item: "General incidentals, taxes, fees, shipping costs", source: "", costPerUnit: 10000, quantity: 1, totalCost: 10000, actualSpend: 0, notes: "Buffer" },
];

export const DEFAULT_BUDGET_SUMMARY: BudgetSummaryItem[] = [
  { category: "Cost per person", projectedCost: 0, actualSpend: 0, notes: "Hotel, flights, transportation, meals/incidentals, conference registration. Paid for by respective cost center." },
  { category: "Conference Sponsorship", projectedCost: 0, actualSpend: 0, notes: "Research pays" },
  { category: "Breakfast Event", projectedCost: 0, actualSpend: 0, notes: "Recruiting pays" },
  { category: "Swag", projectedCost: 0, actualSpend: 0, notes: "50/50 split between Recruiting/Marketing" },
  { category: "Booth", projectedCost: 0, actualSpend: 0, notes: "50/50 split between Recruiting/Marketing" },
  { category: "Buffer Placeholder", projectedCost: 10000, actualSpend: 0, notes: "" },
];

export const DEFAULT_TEAM_SPEND: TeamSpendItem[] = [
  { owner: "", label: "Total Research Spend", projectedCost: 0, actualSpend: 0, notes: "Conference Sponsorship" },
  { owner: "", label: "Total Eng Spend", projectedCost: 0, actualSpend: 0, notes: "Cost to send each attendee" },
  { owner: "", label: "Total Recruiting Spend", projectedCost: 0, actualSpend: 0, notes: "Breakfast event, 50/50 split with Marketing on booth and swag" },
  { owner: "", label: "Total Marketing Spend", projectedCost: 0, actualSpend: 0, notes: "50/50 split with Recruiting on booth and swag" },
  { owner: "", label: "Buffer Placeholder", projectedCost: 10000, actualSpend: 0, notes: "" },
];

export const DEFAULT_BOOTH_MATERIALS: BoothMaterial[] = [
  { item: "Demo laptop(s)", packed: false },
  { item: "Booth banner / backdrop", packed: false },
  { item: "Tablecloth with branding", packed: false },
  { item: "Booth flyers", packed: false },
  { item: "Breakfast invite cards / printables", packed: false },
  { item: "Swag items (t-shirts, totes, etc.)", packed: false },
  { item: "Business cards", packed: false },
  { item: "Lead capture device / tablet", packed: false },
  { item: "Scanning app device", packed: false },
  { item: "Extension cords / power strips", packed: false },
  { item: "Signage / wayfinding", packed: false },
  { item: "Banners", packed: false },
];

export function createDefaultBooth(): Booth {
  return {
    size: "10x10",
    design: { status: "not_started", deadline: "", notes: "" },
    materials: DEFAULT_BOOTH_MATERIALS.map((m) => ({ ...m })),
    shipping: { status: "not_started", deadline: "", carrier: "Freeman", tracking: "" },
    shifts: [],
  };
}

export function createDefaultPrivateEvent(): PrivateEvent {
  return {
    venue: "",
    capacity: "",
    catering: "",
    invitesSent: false,
    inviteDeadline: "",
    rsvpCount: 0,
    notes: "",
  };
}

export function createDefaultBudget(): Budget {
  return {
    headcount: { recruiting: 0, research: 0, engineering: 0, marketing: 0, total: 0 },
    lineItems: DEFAULT_BUDGET_LINE_ITEMS.map((li) => ({ ...li })),
    summary: DEFAULT_BUDGET_SUMMARY.map((s) => ({ ...s })),
    teamSpend: DEFAULT_TEAM_SPEND.map((ts) => ({ ...ts })),
  };
}

export function createDefaultStrategy(): Strategy {
  return { goals: "", targetProfiles: "", keyMessages: "", successMetrics: "" };
}

export function createDefaultConference(name: string, id?: string): Conference {
  const slug = id || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const actionItems: Record<string, ActionItem[]> = {};
  for (const [phase, items] of Object.entries(DEFAULT_ACTION_ITEMS)) {
    actionItems[phase] = items.map((ai) => ({ ...ai, id: genId("ai") }));
  }
  return {
    id: slug,
    name,
    location: "",
    dates: "",
    niche: "",
    status: "planning",
    hasBooth: false,
    hasPrivateEvent: false,
    privateEventName: "",
    strategy: createDefaultStrategy(),
    attendees: [],
    booth: createDefaultBooth(),
    privateEvent: createDefaultPrivateEvent(),
    candidates: [],
    budget: createDefaultBudget(),
    actionItems,
  };
}
