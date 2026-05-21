# Second Brain — Zoya Naqvi / Applied Intuition
> One file. Paste the relevant sections at the start of any AI session.
>
> **Canonical file:** `/Users/zoyahsiao/Documents/apps-platform-apps/SECOND_BRAIN.md` — edit there first, then copy into this repo when you want them in sync.

---

# SECTION 1: AI WORKING STYLE
> Paste this at the start of any new project or session to calibrate how Claude/Cursor should work with you.

## Who I am & what I build
I'm a Recruiting Program Manager at Applied Intuition (autonomous vehicle / physical AI). I build internal tools, recruiting ops infrastructure, and employer brand assets — not production engineering systems. My projects are typically:
- Internal-use apps (recruiting tools, conference ops dashboards, data trackers)
- Single-user or small-team tools, not public-facing at scale
- Vibe-coded with AI assistance — I am not a professional developer
- Built in Cursor, Claude Code, or as Claude.ai artifacts

**The bar is: works well, looks clean, is maintainable by me.**

## My default stack
| Layer | Default | Notes |
|-------|---------|-------|
| Framework | Next.js (App Router) | For anything beyond single-file |
| Styling | Tailwind CSS | Always |
| Language | TypeScript | Preferred, not required for MVPs |
| Auth | OTP / passwordless | No username/password flows |
| Data | Local state / JSON / Google Sheets | No DB unless explicitly needed |
| ATS | Ashby API | Primary recruiting data source |
| Hosting | Vercel | Default deployment target |
| Single-file | Vanilla HTML/CSS/JS | For artifacts and quick tools |

## How I like to work with AI
- **Plan before building** — show me a file structure or approach before writing code. I'll confirm direction first.
- **Small steps** — one change at a time, especially when debugging
- **Ask, don't assume** — especially on data structure, auth, integrations
- **Explain the why** — one-line comment on non-obvious decisions
- **Don't over-engineer** — no abstraction layers or patterns I don't need yet
- **On errors** — tell me what caused it before proposing a fix. Minimal fix first, not a full rewrite.

## My writing / comms preferences
- Direct and confident — no corporate filler
- Applied Intuition voice: precise, technically credible, human
- Short over long — I'll ask for more if needed
- No excessive headers or bullet nesting in Slack/email drafts
- Candidate-facing copy: warm but specific, never generic

## Org context
- **Company:** Applied Intuition — autonomous vehicle software and physical AI
- **My role:** Recruiting Program Manager (conference ops, talent brand, recruiting tooling)
- **Key stakeholders:** Eitan Sheer (Head of Recruiting), Qasar Younis (CEO), Wei Zhan, Karl Heiselman, Lauren Joyce
- **Tools I use:** Ashby, Gem, Webflow, Slack, Google Drive, Notion, LinkedIn

## What I don't want
- Firebase, MongoDB, or complex DBs for simple tools
- Boilerplate comments that just repeat the code
- "Would you like me to proceed?" after every step — use judgment
- Purple gradient UI defaults
- Over-apologizing when something breaks — just fix it

---

# SECTION 2: PROJECT INDEX
> Running registry of everything being built. Update when you start or complete a project.

## 🟢 Active
| Project | What it is | Stack | Status |
|---------|-----------|-------|--------|
| Conference DRI Hub | Next.js app for conference ops — attendees, booth, budget, candidate tracking | Next.js, Tailwind | In spec / Claude Code build |
| Candidate Portal | Stage-gated candidate web app integrating with Ashby ATS (M1–M3 MVP) | Next.js, Ashby API, OTP auth | Resumed with Kai Ang |
| Recruiting Library | Internal recruiter enablement resource tool | Cursor build | Active |
| Policy OS | Unified launcher (eventually shared shell) for legal/policy tools — Newsroom, First Pass, Canary | Vanilla HTML/CSS/JS, Applied Sans, BRAND_RULES.md tokens (Next.js for Option B) | v0.1.0 launcher committed |
| Tailr | AI-powered personalized recruiter outreach generator (with Jason) | — | Launched |
| Meet the Makers | Internal speaker series with survey infrastructure | Google Forms, Drive | Survey done, video processing |
| Employer Brand — Embedded SWE | Talent funnel strategy vs NVIDIA/Apple/OpenAI robotics | — | In progress |

## 🟡 Paused / Backlog
| Project | What it is | Notes |
|---------|-----------|-------|
| Cars & Coffee | Private recruiting event for SDS team (garage tour + panel) | Paused — digital brand first |
| Candidate IPS Brief | Phone screen prep tool for recruiters | In scoping |
| NotebookLM Recruiting KB | Team knowledge base via Drive + NotebookLM | Architecture defined |

## ✅ Shipped
| Project | What it was |
|---------|------------|
| Ashby Email Templates | ~93 candidate-facing templates rebuilt across 14 global offices |
| Company Rebrand Assets | Updated Tailr, Ashby, Webflow, LinkedIn, Glassdoor, Handshake |
| B2BI Brand Survey | External employer brand study on Physical AI awareness |
| CVPR 2026 Framework | Reusable conference planning framework + budget calculator |
| Princeton AI Tiger Trek | University recruiting event |
| Recruiting Trainee Program | LinkedIn + Slack launch posts |

---

# SECTION 3: PROMPT LIBRARY
> Reusable prompts. Add new ones at the top of each category. Note the date and what state the project was in.

## 🏗️ Scaffolding & Setup

### New app — Next.js
```
Build a Next.js app with the following spec:
[PASTE PRD OR BULLET POINTS]

Stack: Next.js 14+ App Router, Tailwind CSS, TypeScript.
No external DB unless specified — use local state or JSON for MVP.

Start by showing me the folder structure and a brief plan. Ask me to confirm before writing any code.
```

### New app — single file (HTML/CSS/JS)
```
Build a single-file HTML app for [PURPOSE].

Requirements:
[LIST KEY FEATURES]

Self-contained. No build steps. Vanilla JS. Clean, minimal aesthetic. Show me the full file when done.
```

### Resume an existing project
```
I'm resuming work on [PROJECT NAME]. Here's the current context:

[PASTE CONTEXT FROM SECTION 4]

Today's goal: [ONE SENTENCE]

Before writing any code: summarize what you understand about the current state and confirm the goal with me.
```

## 🐛 Debugging

### General debug
```
This is broken. Here's the error:
[PASTE ERROR]

Here's the relevant code:
[PASTE CODE]

Don't rewrite everything. First explain what you think is causing this. Then propose the minimal fix. Ask before touching anything beyond the immediate issue.
```

### Reset after a spiral
```
We got into a bad state. Stop. Don't generate more code.

Tell me:
1. What you think the current state of the file/component is
2. What the last working state was
3. What change introduced the problem

I'll confirm and then we fix it together.
```

## 🎨 UI & Frontend

### Polish an existing component
```
This works but looks rough. Make it more polished without changing functionality. Focus on:
- Typography hierarchy
- Spacing and padding consistency
- Subtle hover states
- Obvious visual inconsistencies

[PASTE COMPONENT]
```

## ✍️ Recruiting & Comms

### Personalized outreach
```
Write a personalized recruiting outreach message for:
- Role: [ROLE]
- Candidate background: [2-3 SENTENCES FROM LINKEDIN]
- Hook: [WHAT'S INTERESTING ABOUT THIS PERSON FOR THIS ROLE]
- Tone: Direct, warm, human — not corporate
- Length: 4-6 sentences max
```

### Internal Slack announcement
```
Write an internal Slack announcement for [TOPIC].
Audience: [TEAM/ORG]
Key info: [BULLET POINTS]
Tone: Clear, concise, no fluff. Applied Intuition voice — direct and confident.
End with a clear next step or ask.
```

### Executive summary / stakeholder update
```
Turn these notes into a clean executive summary:
[PASTE NOTES]

Format:
- 2-sentence situation summary
- 3 bullet decisions/updates
- 1 clear ask or next step

Audience: [EITAN / QASAR / CROSS-FUNCTIONAL LEADS]
```

## 🔄 Prompt Version Log
| Prompt | Last updated | Notes |
|--------|-------------|-------|
| New app — Next.js | — | — |
| Resume existing project | — | — |
| Personalized outreach | — | — |

---

# SECTION 4: PROJECT CONTEXTS
> Living docs are now maintained per-app in `/projects/{app-name}/`. Each app has CURRENT.md, ISSUES.md, and LESSONS.md that get rewritten every sprint.
>
> **To load context for a session:** paste `STARTUP.md` and tell the AI which app you're working on. It will read the three living docs automatically.

## Active app index

| App | Living Docs | Sprint Files |
|-----|-------------|--------------|
| Conference DRI Hub | `/projects/conference-dri-hub/` | `/sprints/conference-dri-hub/` |
| Candidate Portal | `/projects/candidate-portal/` | `/sprints/candidate-portal/` |
| Recruiting Library | `/projects/recruiting-library/` | `/sprints/recruiting-library/` |
| Policy OS | `/projects/policy-os/` | `/sprints/policy-os/` |
| Tailr | `/projects/tailr/` | `/sprints/tailr/` |

## Other active projects (non-app)

### Meet the Makers
**What it is:** Internal speaker series (Cabin Intelligence, Defense, SensorSim, SDS Core). Survey + video component.
**Status:** Survey complete (Google Forms with branching logic). Video stuck in Drive processing.
**Next:** Resolve video processing issue. Review survey results.

---

# SECTION 5: DECISIONS & REJECTED APPROACHES
> Log once. Reference forever. Prevents re-litigating the same choices with the AI.

## Global defaults — why
- **No Firebase/MongoDB for simple tools** — internal tools don't need the complexity. JSON or local state is enough until proven otherwise.
- **OTP over username/password** — simpler, no account management overhead, works well for single-user internal tools.
- **Vercel for hosting** — zero-config Next.js deployment. Don't overthink it.
- **Tailwind always** — consistency across projects, faster iteration, no context-switching on styling approach.

## Project-specific decisions
*Add entries here as you make meaningful decisions per project. Format:*
**[Project] — [Decision] — [Date]**
Chose: / Rejected: / Why:

**Policy OS — Sidebar over top-bar tabs — 2026-05-20**
Chose: 240px left sidebar with Home + Tools + Workspace sections.
Rejected: Horizontal tabs in the topbar.
Why: Top-bar tabs visually break down past 5–7 items; sidebar scales to 15+, matches the underlying tools' own internal sidebars, and reads as a real workspace (Slack/Linear/VS Code) rather than a settings page.

**Policy OS — Mocked Highlights TLDR over hero imagery — 2026-05-20**
Chose: Three rich TLDR cards (top story, in-progress review, flagged signals) per tool above-the-fold.
Rejected: Full-width Air/Land/Sea iridescent imagery as a hero header.
Why: For an internal workspace tool, every hero element should earn its space; decorative imagery read as marketing-site. The brand rules themselves cap imagery at 0.15–0.25 opacity for empty states — using them at full opacity was off-pattern. Mocked-but-believable activity content sells the platform vision and becomes the most valuable real estate once tools are wired up.

**Policy OS — Persistent iframes (not swap-the-src) for v0.1.0 — 2026-05-20**
Chose: All three tools mount once as separate iframes inside one tool-view container; navigation toggles which one has `.active` (display: block). Hash routing (`#newsroom`, etc.) controls active frame. Sources point directly at `Newsroom.html` / `FirstPass.html` / `Canary.html`.
Rejected: A single iframe whose `src` changes on navigation; or linking out to each tool as a separate page.
Why: Persistent frames make tab-switching instant and preserve per-tool scroll position and internal state across visits. Demonstrates the shared-shell pattern without touching any of the three underlying tools yet. The cosmetic "double sidebar" (Policy OS + tool's own) is fixed later in Option B by sending `?embed=1` and having each tool hide its sidebar. Direct paths bypass each tool's meta-refresh redirect in its own `index.html`.

---

# SESSION LOG
> 3 bullets per session. Most recent at top.

## Format
**[Date] — [Project]**
- ✅ Built:
- 🔴 Broke / blocked:
- ➡️ Next:

---

**2026-05-20 — Policy OS**
- ✅ Built: v0.1.0 launcher at `~/Documents/legal/Policy-OS/` — 240px sidebar shell, persistent iframes (all 3 tools mounted once, toggle visibility on nav so tab-switching is instant and state survives) pointing directly at `Newsroom.html`/`FirstPass.html`/`Canary.html`, "Highlights" TLDR strip with mocked daily/weekly content per tool, Roadmap section explaining Now/Next/Later trajectory. All brand-compliant: Applied Sans (Display/Text/Mono), Applied Blue #006CFA accents, Tertiary palette for tool category coding, light-mode #F5F5F7 surfaces, max 8px radius, no shadows. Three sibling repos (Newsroom, First-Pass, Canary) cloned to `~/Documents/legal/`. Living docs scaffolded at `/projects/policy-os/`. Tertiary palette added to `BRAND_RULES.md` (was missing). First commit on `main` (no remote yet).
- 🔴 Broke / blocked: One cosmetic double-sidebar issue when tools load in the iframe (Policy OS sidebar + tool's own). Fixed in Option B by sending `?embed=1`. Iframe + Google OAuth may also have issues — unverified.
- ➡️ Next: Option B groundwork — extract `shared/styles.css` and `shared/lib.js` (Claude client, Google auth, allorigins proxy, namespaced localStorage), modify each tool to honor `?embed=1`, wire Highlights cards to real data, decide hosting target (likely Apps Platform).

---

# SECTION 6: SPRINT + STARTUP METHODOLOGY

> The development loop this second brain is built around.

## How it works

Every non-trivial change follows a **plan-then-execute loop** anchored by a sprint file and three living docs per app.

### Session start

1. Paste `STARTUP.md` — the AI reads it and asks which app you're working on.
2. Name the app — the AI loads `/projects/{app}/CURRENT.md`, `ISSUES.md`, `LESSONS.md`.
3. AI gives a 2-sentence state summary and confirms the session goal.
4. Work begins.

### During a sprint

- Create a sprint file: copy `/sprints/_template.md` → `/sprints/{app}/YYYY-MM-DD-sprint-NN.md`
- Fill in Spec first (brainstorm → acceptance criteria)
- Get plan confirmation before executing
- Log decisions and issues in the Execution Log as you go

### Session end

1. Rewrite the three living docs (CURRENT, ISSUES, LESSONS) for the app — full rewrite, not append.
2. Bubble key cross-app lessons up to `STARTUP.md`.
3. Commit and push: living docs + sprint file together.
4. Optional: open the next sprint file so the next session can start immediately.

## File map

```
STARTUP.md                          ← lean session entry point (~60 lines)
projects/
  _template/                        ← copy for new apps
    CURRENT.md
    ISSUES.md
    LESSONS.md
  {app-name}/
    CURRENT.md                      ← current state, stack, file map, next tasks
    ISSUES.md                       ← active bugs, tech debt, blockers
    LESSONS.md                      ← what worked, what didn't, pitfalls
sprints/
  _template.md                      ← sprint file template
  {app-name}/
    YYYY-MM-DD-sprint-NN.md         ← spec + plan + execution log
```

## Design principles

- **Living docs replace session context pasting** — no more copy-pasting Section 4 into every chat.
- **Parallelism-safe** — each app is fully scoped; multiple Claude/Cursor sessions can run concurrently.
- **Cross-app learning** — lessons bubble up from LESSONS.md → STARTUP.md, so every app benefits from what went wrong in others.
- **Token-efficient** — STARTUP.md stays lean; the AI only loads the three living docs for the app in focus.
- **Branch hygiene** — one branch per sprint (`{name}/{app}-{description}`), never commit directly to main.
