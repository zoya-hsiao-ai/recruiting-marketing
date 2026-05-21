# CURRENT — policy-os
> Rewrite this file at the end of every sprint. Last updated: 2026-05-20.

## What it is

A unified launcher and eventually-shared shell for Applied Intuition's legal & policy team tools: **Newsroom** (daily media briefings), **First Pass** (regulatory roadmaps + ICTS reviews), and **Canary** (proactive risk detection across Slack/Drive/Jira). Single-page launcher today; on a path to become a real workspace shell with one auth, one Configure, and cross-tool flows.

## Current state

- v0.1.0 single-file static HTML launcher at `~/Documents/legal/Policy-OS/index.html`.
- Lives alongside the three sibling tool repos in `~/Documents/legal/` — clones of `Applied-Shared/Newsroom`, `Applied-Shared/First-Pass`, `Applied-Shared/Canary`.
- Brand-compliant: Applied Sans (Display / Text / Mono, self-hosted variable woff2), Applied Blue `#006CFA` for accents/CTAs only, Tertiary palette for tool category coding (Newsroom = `#2635C8`, First Pass = `#0BC242`, Canary = `#FFBE32`), `#F5F5F7` page bg, max 8px radius, no shadows.
- **240px left sidebar** with Applied symbol + "Policy OS" lockup → Home → Tools (Newsroom / First Pass / Canary / + Add tool placeholder) → Workspace (Configure / Activity placeholders) → org pill footer.
- **Persistent iframes + hash routing**: all three tools mount once on page open as `position: absolute; inset: 0` iframes inside a single tool-view container; navigation toggles which one has `.active` (display: block). Switching tabs is instant and each tool preserves its scroll position and internal state across visits. Sources point directly at `Newsroom.html`, `FirstPass.html`, `Canary.html` — skipping the meta-refresh redirect in each tool repo's `index.html`. Topbar updates with page title + breadcrumb. Back/forward and refresh work.
- **"Highlights" section** above-the-fold: three rich TLDR cards, one per tool, with mocked-but-believable daily/weekly content (top story, in-progress reviews, flagged signals with severity dots). Each card is clickable and routes into its tool.
- **Tools section** below: three richer cards with descriptions, integration chips, and CTAs.
- **Roadmap section** explaining Now / Next / Later trajectory.

## Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | None — single-file vanilla HTML | Will migrate to Next.js (App Router) when Option B lands |
| Styling | Vanilla CSS w/ tokens from BRAND_RULES.md | All Applied palette + Tertiary ramps defined as CSS vars |
| Fonts | Self-hosted Applied Sans variable `.woff2` | In `/fonts/` |
| Auth | None yet | Each underlying tool has its own; consolidate in Option B |
| Data | Mocked Highlights content | Will pull live from each tool's localStorage/API in Option B |
| Hosting | Local `file://` | Internal only; deployment target TBD |

## File map

```
~/Documents/legal/Policy-OS/
├── index.html                        # launcher (sidebar + routing + highlights)
├── BRAND_RULES.md                    # local copy of canonical brand rules
├── README.md
├── fonts/
│   ├── AppliedSansDisplay-Variable.woff2
│   ├── AppliedSansText-Variable.woff2
│   ├── AppliedSansMono-Regular.woff2
│   └── AppliedSansMono-Medium.woff2
└── assets/
    ├── logos/
    │   └── applied-intuition-symbol-black.png
    └── imagery/                      # Air / Land / Sea (unused after Highlights pivot)
        ├── applied-intuition-air.png
        ├── applied-intuition-land.png
        └── applied-intuition-sea.png
```

Sibling tool repos live at `~/Documents/legal/Newsroom/`, `~/Documents/legal/First-Pass/`, `~/Documents/legal/Canary/`.

## Next sprint

- [ ] Option B groundwork — extract shared CSS to `shared/styles.css` and shared JS (Claude client, Google auth, allorigins proxy, localStorage namespace helper) to `shared/lib.js`.
- [ ] Modify each underlying tool (Newsroom, First-Pass, Canary) to read `?embed=1` and hide its internal sidebar when embedded — fixes the cosmetic "double sidebar" issue.
- [ ] Wire the Highlights cards to real data (start by reading each tool's localStorage on a `postMessage` heartbeat).
- [ ] Build an actual `+ Add tool` flow (or commit to the three-tool baseline for v1).
- [ ] Destinations for sidebar's Configure / Activity items (currently dead links).
- [ ] Decide hosting target — likely Apps Platform (`apps-platform deploy`) given the apps-platform-apps convention.

## Blockers

None.
