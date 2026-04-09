# Conference DRI Hub — Product Specification

## Context

This tool is used internally at Applied Intuition by the Recruiting Program Manager (DRI) who owns end-to-end conference execution. Applied Intuition is an autonomous vehicle and physical AI company. Conferences are a critical recruiting channel — the company attends AI/ML research conferences (CVPR, NeurIPS, ICRA, ICCV), autonomy/robotics trade shows, and niche industry events to build employer brand and source senior technical talent.

The DRI manages all logistics across travel, booth, private events (e.g. hosted breakfasts), budget, and recruiting strategy. Cross-functional stakeholders include Recruiting leadership (Eitan), Marketing/Design, Engineering, and Research. Budget is split across these four departments with per-line-item allocation percentages.

This app replaces scattered Google Sheets trackers (attendees sheet, booth shifts sheet, breakfast attendees sheet, master candidate tracker, event tracker, action items tracker, budget estimator) with a single source of truth.

---

## Product Overview

A local Next.js/React web application that serves as the go-to operational hub for conference planning and tracking. Each conference is a self-contained unit with seven workstreams: action items tracker, attendee logistics, booth operations (including shift scheduling), private event management, candidate/lead tracking, budget, and recruiting strategy.

---

## Core Data Model

See `conference_schema.json` for the complete JSON schema and sample data.

---

## Functional Requirements

### 1. Conference Dashboard (Home)

- Display all conferences as cards
- Each card shows: name, location, dates, niche, status badge (planning/active/completed), overall action item progress bar, tags for booth/private event/attendee count
- Sort by status (active first), then by date proximity
- "New Conference" action that creates a blank conference from the default template
- Ability to archive/delete conferences

### 2. Conference Detail View

Tabbed interface with the following sections:

---

#### 2.1 Overview Tab

- Summary stats: action item completion %, attendee count, booth (yes/no), private event (yes/no), candidate leads count
- Quick toggles for hasBooth and hasPrivateEvent
- Strategy snapshot (goals + target profiles)
- Phase-by-phase progress bars for action item completion

---

#### 2.2 Action Items Tracker Tab (replaces "Checklist")

This is the most critical feature. It mirrors the real ICCV 2025 Event Tracker structure — a detailed operational task list with status tracking, ownership, time estimates, and rich notes.

**Columns per action item:**
- Status: dropdown with options "Not started", "In Progress", "Completed" (color-coded: red/not started, yellow/in progress, green/completed)
- Due Date: date picker
- DRI: text field — the person responsible (e.g. "Zoya Hsiao", "Lauren Joyce", "Vickram Rajendran")
- Action Item: text field — description of the task
- Notes: text field — detailed context, dependencies, instructions, handoff info
- Estimated Time to Completion: text field (e.g. "Lauren = 6 hours", "Recruiting: 2 hours", "30 minutes with Arturo")

**Action items are grouped into phases.** Default phases for a new conference:

Phase: "Pre-Conference Setup"
- Draft conference proposal
- Put together conference budget estimate
- Work with Finance to get conference ramp card
- Work with Finance to get onboarded onto expense platform (e.g. Coupa)
- Reserve all hotel blocks
- Share T&C legal updates with legal team
- Send T&C updates to Legal
- Register conference attendees
- Confirm booth space with conference

Phase: "Content & Outreach Prep"
- Identify relevant papers and research to reference in outreach
- Create event RSVP form (Gem/Google Form)
- Prioritize papers and authors for pre-conference outreach
- Create/edit pre-conference outreach sequences (Gem sequences — two kinds: breakfast invite + booth awareness)
- Finalize flyer copy and hand off to Design
- Complete booth build design and hand off to Design
- Create a social media strategy with Marketing
- Create a script to cross-reference authors with the attendee list to find contact info

Phase: "Logistics & Coordination"
- Get attendee list from conference organizer (as sponsor, we receive names and emails)
- Schedule pre-conference trainings for attendees
- Block off all calendars with relevant details, links, and talking points
- Get service account from vendor for conference email (e.g. iccv2025@applied.co)
- Finalize event form for private event (e.g. breakfast interest form)
- Upload candidate list to Gem and categorize by project/research area
- Send breakfast interest sequence
- Create and post job board requisitions on conference careers site
- Get scanning app set up for lead capture at booth
- Collaborate with Design on private event invitation graphic
- Budget time to respond to email responses (for P0 candidates, setting up on-prem chats)

Phase: "Event Week"
- Confirm freight delivery and booth materials arrived
- Booth setup and walkthrough
- Distribute booth staff schedule and shift reminders
- Private event setup and vendor check-in
- Run daily attendee debrief and lead capture sync
- Capture photos and content for social / employer brand
- Execute sourcing conversations on the floor
- Monitor RSVP list and manage walk-ins at private event

Phase: "Post-Conference"
- Send mass outreach sequence to all booth leads
- Manually manage breakfast interest form responses (stop sequences for RSVPs)
- Upload all leads to Ashby with conference source tag (e.g. "Conference - CVPR", "Conference - ICCV")
- Send follow-up emails to all captured leads within 48 hours
- Debrief with team — what worked, what didn't
- Post event recap on internal Slack (wins, metrics, photos)
- Reconcile actuals vs. budget
- Publish social content / blog post if applicable
- Track pipeline conversion at 30/60/90 days
- Conference Job Board opens (if applicable)

**Features:**
- Users can add custom action items to any phase
- Users can add entirely new phases
- Action items can be reordered within a phase via drag-and-drop
- Phase progress shown as fraction and percentage (completed / total)
- Filtering by status (show only "Not started", only "In Progress", etc.)
- Filtering by DRI (show only one person's tasks)

---

#### 2.3 Attendees Tab (replaces "Travel")

This mirrors the real attendee logistics tracker from the CVPR/ICCV sheets. Each attendee is a row with comprehensive logistics fields.

**Columns per attendee:**
- Name: text
- Team: text (e.g. "Onroad/Perception", "AI Research", "AI Research/E2E", "Offroad", "Recruiting Program Management")
- Dates: text (travel dates)
- # of Hotel Nights: number
- Confirmed?: dropdown — "Checking", "Confirmed to go" (color-coded: yellow/checking, green/confirmed)
- IEEE Member #: text (relevant for IEEE conferences like CVPR, ICCV)
- T-Shirt Size: dropdown — S, M, L, XL, XXL
- Food Preference: text (e.g. "N/A", "Vegetarian", "Vegan")
- Conference Registered: boolean checkbox (includes note about early bird pricing deadline)
- Conference Confirmation #: text
- Hotel Booked: boolean checkbox (includes date range note, e.g. "3 nights; June 4 - June 7th")
- Hotel Confirmation #: text
- Hotel Total Cost: currency
- Flights Booked: boolean checkbox
- Flight Total Cost: currency
- Flight Information — Outbound: text (e.g. "SJC/SFO → DEN")
- Flight Information — Return: text (e.g. "DEN → HNL")
- Notes: text

**Features:**
- Add/remove attendees
- Summary row showing totals: total hotel cost, total flight cost, total headcount
- Quick status view: how many confirmed vs. still checking
- Sort by team

---

#### 2.4 Booth Tab

Only shown when hasBooth is true. Otherwise show empty state with "Add Booth" action.

**Booth Details section:**
- Booth size (free text, e.g. "10x10")
- Design pipeline: Not Started → In Progress → In Review → Approved → Submitted to Vendor
- Design deadline (date)
- Design notes (free text)

**Shipping & Freight section:**
- Status: Not Started / Packed / Shipped / Delivered
- Carrier name (e.g. "Freeman")
- Tracking number
- Deadline

**Materials checklist:**
- Array of items with checkbox (packed/not packed): Demo laptop(s), Booth banner/backdrop, Tablecloth with branding, Flyers, Swag items, Business cards, Lead capture device/tablet, Extension cords/power strips, Signage/wayfinding, Scanning app device

**Booth Shifts Schedule section:**
This is a critical sub-feature. It mirrors the real booth shifts grid from the ICCV tracker.

- A grid/table organized by day
- Each day has multiple time slots (e.g. "11:30 AM - 1:00 PM", "1:00 PM - 3:00 PM", "3:00 PM - 5:00 PM")
- Each time slot has 3-4 "Boother" slots where you assign attendee names
- Special rows can be marked for private events (e.g. "BREAKFAST" row highlighted differently)
- The schedule should be easy to edit — click a cell and type/select a name

Example structure:
```
Tuesday, October 21st
  11:30 AM - 1:00 PM  | Lauren  | Yihan   | Shubh   | Vickram
  1:00 PM - 3:00 PM   | Lauren  | Stephen | Yihan   | Sean R
  3:00 PM - 5:00 PM   | Vickram | Wei     | Stephen | Bradley

Wednesday, October 22nd
  BREAKFAST 9:00 AM - 11:00 AM | Wei | Yihan | Stephen | Shubh   [highlighted row]
  10:45 AM - 12:30 PM | Vickram | SeanR   | Bradley
  12:30 PM - 2:30 PM  | Lauren  | Wei     | Bradley
  2:30 PM - 4:30 PM   | Lauren  | SeanR   | Wei     | Vickram
```

**Features:**
- Add/remove days
- Add/remove time slots per day
- Mark a time slot as a special event (breakfast, workshop, etc.)
- 3-4 boother columns per slot
- Names should ideally be selectable from the attendee list

---

#### 2.5 Private Event Tab

Only shown when hasPrivateEvent is true. Otherwise show empty state with "Add Private Event" action.

- Event name (e.g. "Breakfast Events Day 1 & Day 2")
- Venue name
- Capacity
- Catering status (free text)
- Invite deadline (date)
- Invites sent (boolean toggle)
- RSVP count (number)
- Notes (free text — for schedule, format, run-of-show details)

---

#### 2.6 Candidate Tracker Tab (NEW — previously not in spec)

This is the post-event pipeline tracker that mirrors the "Breakfast Attendees" and "MASTER CANDIDATE TRACKER" sheets from the real ICCV tracker. It tracks every person the team interacted with at the conference.

**Columns per candidate:**
- First Name: text
- Last Name: text
- Email: text
- LinkedIn: URL
- Invite to Interview?: dropdown — "Yes" (green), "No" (red), "TBD" (yellow)
- Notes: text — screening rationale, conversation notes, fit assessment (e.g. "strong, but O-1", "not a fit", "at startup, if we had headcount could consider", "declined our offer in June 2025 but maintaining a close relationship w Applied")
- Company: text (current employer)
- School: text (university affiliation)
- Reason: text (why they were flagged — research area, referral, etc.)
- Phone Number: text
- Location: text
- Greenhouse/Ashby Link: URL (link to ATS profile if created)
- Added to ATS: boolean
- Source: text (e.g. "Booth conversation", "Breakfast attendee", "Pre-conference outreach", "Paper author")
- Added to Project By: text (who logged this candidate)
- Date Added: datetime

**Features:**
- Add/remove candidates
- Filter by "Invite to Interview?" status
- Filter by source
- Search by name, company, or school
- Summary stats: total leads, % marked "Yes" for interview, % "TBD" still to review
- Bulk actions: mark multiple as "Added to ATS"

---

#### 2.7 Budget Tab

The budget tab mirrors the actual CVPR 2026 Estimated Budget sheet. It has three sections: a detailed line item table, a category summary rollup, and a team spend breakdown.

**Headcount Inputs (top of tab):**
- Number of Recruiting attendees
- Number of Researchers
- Number of Eng
- Number of Marketing (sometimes 0)
- Total (auto-summed)
- These drive per-person cost calculations in the line items

**Line Items Table — columns:**
- Date of Spend: date (when cost is incurred or was paid)
- Item: text description of the expense
- Source: text — payment method or vendor (e.g. "Ramp Card", "Freeman", "Navan", "Hotel Venue", "Ramp Reimbursement")
- Cost/Person/Item: currency
- Quantity: number (people, nights, items, etc.)
- Total Cost: currency (auto-calculated as cost × quantity, or manual override)
- Actual Spend: currency (filled in post-event for reconciliation)
- Notes: text — critical context about cost allocation, vendor details, split rules

**Summary Section — rolled-up category totals:**
- Rows: Cost per person, Conference Sponsorship, Breakfast Event, Swag, Booth, Buffer Placeholder
- Columns: Category, Projected Cost, Actual Spend, Notes
- Notes explain who pays (e.g. "Research pays", "Recruiting pays", "50/50 split between Recruiting/Marketing", "Paid for by respective cost center of each attendee")

**Team Spend Breakdown — per-department owner totals:**
- Each row has: Owner name, Label (e.g. "Total Research Spend"), Projected Cost, Actual Spend, Notes
- Example rows: Wei Zhan / Total Research Spend / $18,120, Vickram Rajendran / Total Eng Spend / $5,560, Eitan Sheer / Total Recruiting Spend / $30,838.24, Karl Heiselman / Total Marketing Spend / $21,028.24
- Grand total row at bottom

**Features:**
- Add/remove line items
- Auto-sum total of all line items
- Actual Spend column is editable post-event for budget reconciliation
- Projected vs. Actual variance highlighting (green if under, red if over)

---

#### 2.8 Strategy Tab

- Goals & Objectives (free text)
- Target Candidate Profiles (free text)
- Key Messages / Talking Points (free text)
- Success Metrics (free text)
- Edit/view toggle

---

## Sheet Tabs Reference

For context, here are the actual Google Sheets tabs used in real conference trackers. This app consolidates all of them:

| Google Sheets Tab | Maps to App Tab |
|---|---|
| Event Tracker | Action Items Tracker |
| Attendees | Attendees |
| Booth Shifts Schedule | Booth (sub-section) |
| Breakfast Attendees | Candidate Tracker |
| MASTER CANDIDATE TRACKER (Scanner) | Candidate Tracker |
| Mass Booth Follow-Up | Candidate Tracker (notes/status) |
| [RAW] Master Candidate Tracker | Candidate Tracker (raw import) |
| Action Items Tracker | Action Items Tracker |
| Workshops | Strategy (notes field) |
| Estimated Budget | Budget |
| Actual Spend | Budget (actuals column — v2 feature) |

---

## Data Persistence

- All data stored locally via JSON file or localStorage
- No backend/database required for v1
- Data should be exportable as JSON for backup
- Import from JSON to restore state

---

## Design Requirements

- Clean, utilitarian UI — this is an internal ops tool, not a marketing site
- Monochrome palette with color used sparingly for status indicators
- Status colors: Completed = green (#4CAF50), In Progress = amber/yellow (#FFC107), Not Started = red (#F44336), Checking = yellow, Confirmed = green, TBD = yellow, Yes = green, No = red
- Color-coded confirmation badges should match the Google Sheets conventions the team already uses
- Responsive — usable on laptop screens (primary) and tablet
- Fast — no unnecessary animations or transitions
- Typography: clean sans-serif, high readability at small sizes for dense tables
- Tables should support horizontal scrolling for wide data (attendees table has 17+ columns)

---

## Technical Requirements

- Next.js 14+ with App Router
- React with hooks (no class components)
- Tailwind CSS for styling
- Data stored in a local JSON file (e.g. `data/conferences.json`) read/written via API routes, OR localStorage for simpler v1
- TypeScript preferred
- No external database or auth required for v1

---

## Non-Requirements (explicitly out of scope for v1)

- Multi-user / collaboration features
- Google Sheets API integration (trackers live separately during transition)
- Calendar sync
- Slack notifications
- Email integration
- PDF export
- Gem/Greenhouse/Ashby API integration
- Actual vs. estimated budget comparison (v2)

---

## File Structure Recommendation

```
conference-dri-hub/
├── app/
│   ├── page.tsx                    # Dashboard — all conferences
│   ├── conference/[id]/
│   │   ├── page.tsx                # Conference detail with tabs
│   │   └── layout.tsx
│   └── api/
│       └── conferences/
│           └── route.ts            # CRUD for conference data
├── components/
│   ├── ConferenceCard.tsx
│   ├── ActionItemsTracker.tsx      # The core task tracker (was Checklist)
│   ├── AttendeesTable.tsx          # Full attendee logistics table
│   ├── BoothPanel.tsx
│   ├── BoothShiftsGrid.tsx         # Shift scheduling grid
│   ├── PrivateEventPanel.tsx
│   ├── CandidateTracker.tsx        # Lead/candidate pipeline tracker
│   ├── BudgetTable.tsx
│   ├── StrategyPanel.tsx
│   └── ProgressBar.tsx
├── lib/
│   ├── types.ts                    # TypeScript interfaces
│   ├── defaults.ts                 # Default action items, budget items, attendee fields
│   └── storage.ts                  # Read/write JSON data
├── data/
│   └── conferences.json            # Persisted conference data
├── public/
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

---

## Sample Workflow

1. DRI creates a new conference ("ICCV 2025" or "NeurIPS 2026")
2. Default action items, budget categories, and empty sections are auto-populated
3. DRI fills in strategy tab — goals, target profiles, key messages
4. DRI adds attendees with full logistics details (team, hotel, flights, IEEE #, food prefs)
5. If boothing, DRI fills in booth details, materials checklist, and builds the shift schedule
6. If hosting a private event, DRI fills in venue/catering/invite details
7. DRI works through action items tracker, assigning DRIs, due dates, and time estimates
8. Pre-conference: DRI uses candidate tracker to log target attendees from paper authors and outreach responses
9. During event week, DRI uses action items as a real-time runsheet and booth shifts as the staffing guide
10. Post-event: DRI logs all leads from booth scanner and breakfast into candidate tracker
11. DRI reviews candidates, marks interview decisions (Yes/No/TBD), and uploads to Ashby
12. DRI checks off post-event action items: follow-ups sent, budget reconciled, debrief posted
13. Conference status moved to "completed"
