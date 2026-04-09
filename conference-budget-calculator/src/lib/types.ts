export type ConferenceStatus = "planning" | "active" | "completed";
export type ActionItemStatus = "not_started" | "in_progress" | "completed";
export type AttendeeConfirmed = "checking" | "confirmed";
export type TShirtSize = "S" | "M" | "L" | "XL" | "XXL" | "";
export type DesignStatus = "not_started" | "in_progress" | "review" | "approved" | "submitted";
export type ShippingStatus = "not_started" | "packed" | "shipped" | "delivered";
export type InviteToInterview = "yes" | "no" | "tbd";
export type CandidateSource =
  | "booth_conversation"
  | "breakfast_attendee"
  | "pre_conference_outreach"
  | "paper_author"
  | "scanner"
  | "referral"
  | "other";

export interface Strategy {
  goals: string;
  targetProfiles: string;
  keyMessages: string;
  successMetrics: string;
}

export interface Attendee {
  id: string;
  name: string;
  team: string;
  dates: string;
  hotelNights: number;
  confirmed: AttendeeConfirmed;
  ieeeMemberNumber: string;
  tshirtSize: TShirtSize;
  foodPreference: string;
  conferenceRegistered: boolean;
  conferenceConfirmationNumber: string;
  hotelBooked: boolean;
  hotelBookingNote: string;
  hotelConfirmationNumber: string;
  hotelTotalCost: number;
  flightsBooked: boolean;
  flightTotalCost: number;
  flightInfoOutbound: string;
  flightInfoReturn: string;
  notes: string;
}

export interface BoothMaterial {
  item: string;
  packed: boolean;
}

export interface BoothShiftSlot {
  time: string;
  isSpecialEvent: boolean;
  specialEventLabel: string;
  boothers: string[];
}

export interface BoothShiftDay {
  date: string;
  slots: BoothShiftSlot[];
}

export interface Booth {
  size: string;
  design: {
    status: DesignStatus;
    deadline: string;
    notes: string;
  };
  materials: BoothMaterial[];
  shipping: {
    status: ShippingStatus;
    deadline: string;
    carrier: string;
    tracking: string;
  };
  shifts: BoothShiftDay[];
}

export interface PrivateEvent {
  venue: string;
  capacity: string;
  catering: string;
  invitesSent: boolean;
  inviteDeadline: string;
  rsvpCount: number;
  notes: string;
}

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  linkedin: string;
  inviteToInterview: InviteToInterview;
  notes: string;
  company: string;
  school: string;
  reason: string;
  phoneNumber: string;
  location: string;
  atsLink: string;
  addedToAts: boolean;
  source: CandidateSource;
  addedBy: string;
  dateAdded: string;
}

export interface BudgetHeadcount {
  recruiting: number;
  research: number;
  engineering: number;
  marketing: number;
  total: number;
}

export interface BudgetLineItem {
  dateOfSpend: string;
  item: string;
  source: string;
  costPerUnit: number;
  quantity: number;
  totalCost: number;
  actualSpend: number;
  notes: string;
}

export interface BudgetSummaryItem {
  category: string;
  projectedCost: number;
  actualSpend: number;
  notes: string;
}

export interface TeamSpendItem {
  owner: string;
  label: string;
  projectedCost: number;
  actualSpend: number;
  notes: string;
}

export interface Budget {
  headcount: BudgetHeadcount;
  lineItems: BudgetLineItem[];
  summary: BudgetSummaryItem[];
  teamSpend: TeamSpendItem[];
}

export interface ActionItem {
  id: string;
  status: ActionItemStatus;
  dueDate: string;
  dri: string;
  task: string;
  notes: string;
  estimatedTime: string;
}

export interface Conference {
  id: string;
  name: string;
  location: string;
  dates: string;
  niche: string;
  status: ConferenceStatus;
  hasBooth: boolean;
  hasPrivateEvent: boolean;
  privateEventName: string;
  strategy: Strategy;
  attendees: Attendee[];
  booth: Booth;
  privateEvent: PrivateEvent;
  candidates: Candidate[];
  budget: Budget;
  actionItems: Record<string, ActionItem[]>;
}
