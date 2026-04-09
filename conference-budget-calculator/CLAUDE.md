# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint
```

No test framework is configured yet.

## Architecture

This is a Next.js 16 app using the App Router, React 19, TypeScript, and Tailwind CSS v4.

### Conference DRI Hub

A local web application that serves as the operational hub for conference planning and tracking. Each conference is a self-contained unit with seven workstreams: action items tracker, attendee logistics, booth operations (including shift scheduling), private event management, candidate/lead tracking, budget, and recruiting strategy.

**Key files:**
- `src/app/page.tsx` — Dashboard showing all conferences as cards
- `src/app/conference/[id]/page.tsx` — Conference detail view with tabbed interface
- `src/lib/types.ts` — TypeScript interfaces for all data models
- `src/lib/defaults.ts` — Default templates for action items, budget, booth materials
- `src/lib/storage.ts` — localStorage-based persistence (read/write JSON)
- `src/lib/ConferenceContext.tsx` — React context provider for conference state management
- `src/components/` — Tab components: OverviewTab, ActionItemsTab, AttendeesTab, BoothTab, PrivateEventTab, CandidateTrackerTab, BudgetTab, StrategyTab

**Data persistence:** All data stored in localStorage. Export/import JSON for backup.

**Anaheim API integration:**
- `src/app/api/people/search/route.ts` — Proxy to Anaheim V1 API (`https://anaheim.applied.co/applied/api/v1`)
- Auth: `Authorization: ApiKey <key>` header. Key created at Anaheim Admin with `user:read` scope.
- GET `/api/people/search?q=<query>` — email lookup or name-to-email guess
- POST `/api/people/search` — filter by team/title/manager (passes body to Anaheim POST `/user`)
- `src/components/PeopleSearch.tsx` — Modal search UI used in AttendeesTab

**Deployment:**
- `project.toml` — Applied apps platform config (Cloud Run via `apps-platform app deploy`)
- `Dockerfile` — Multi-stage Node 20 Alpine build, standalone output, port 8080
- Requires `ANAHEIM_API_KEY` env var set in `.env.local` (dev) or apps platform secrets (prod)

**Design:** Monochrome palette with Applied Intuition design tokens. Status colors: green (#4CAF50) for completed/confirmed, amber (#FFC107) for in-progress/checking, red (#F44336) for not started.

**Reference docs:**
- `CONFERENCE_DRI_HUB_SPEC.md` — Full product specification
- `conference_schema.json` — Complete JSON schema with sample data
