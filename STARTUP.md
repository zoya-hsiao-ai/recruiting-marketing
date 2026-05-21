# STARTUP — Universal Memory Layer
> Paste this at the start of any session. Then tell me which app you're working on.

**AI: ask "Which app today, or a new one?" then load its living docs before doing anything else.**

---

## Session Protocol

1. User pastes this file
2. AI asks: which app, or new one?
3. User names the app
4. AI reads `/projects/{app}/CURRENT.md`, `ISSUES.md`, `LESSONS.md`
5. AI gives a 2-sentence state summary and confirms today's goal
6. Work begins

**At session end:** rewrite the three living docs, bubble key lessons here, commit + push.

---

## App Registry

| App | Status | Living Docs |
|-----|--------|-------------|
| conference-dri-hub | active | `/projects/conference-dri-hub/` |
| candidate-portal | active | `/projects/candidate-portal/` |
| recruiting-library | active | `/projects/recruiting-library/` |
| policy-os | active | `/projects/policy-os/` |
| tailr | shipped | `/projects/tailr/` |

*To add a new app: copy `/projects/_template/`, add a row above, start a sprint file.*

---

## Cross-App Lessons

> Updated each sprint. Patterns and pitfalls that apply everywhere.

- **Check the brand source-of-truth files BEFORE designing — and check more than one.** Color palette lives in `apps-platform-apps/docs/ai/branding.md`; typography, radius, shadow, and imagery rules live in `~/zoyatalkingtoherself/BRAND_RULES.md`. Skipping either means a rebuild. *(policy-os, 2026-05-20)*
- **For internal workspace tools, prefer functional content (live stats, highlights, activity) over decorative imagery in hero positions.** Decoration competes with the work; data earns its space. *(policy-os, 2026-05-20)*

---

## Global Defaults (quick ref)

- Stack: Next.js App Router · Tailwind · TypeScript · Vercel
- Auth: OTP / passwordless only
- Data: local state / JSON / Sheets — no DB unless explicitly needed
- ATS: Ashby API
- Full context: `SECOND_BRAIN.md`
