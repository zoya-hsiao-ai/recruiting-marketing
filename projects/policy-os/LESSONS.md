# LESSONS — policy-os
> Rewrite this file at the end of every sprint. Last updated: 2026-05-20.
> Bubble anything broadly applicable up to STARTUP.md cross-app lessons.

## What worked

- **Persistent iframes** beat swap-the-src: mount all three tools once, toggle visibility with a class. Tab switching becomes instant and each tool keeps its scroll position and in-memory state. Cost: ~3x the initial page-load weight, which is negligible for an internal tool. Worth it.
- **Iframe-based routing in general** is the cheapest way to demo a shared-shell pattern without rewriting any of the underlying tools. Each tool keeps its own implementation; Policy OS just frames them.
- **Bypassing the per-tool `index.html` meta-refresh redirects** — pointing directly at `Newsroom.html` / `FirstPass.html` / `Canary.html` removes a wasted redirect on every tab switch.
- **Mocked-but-believable Highlights content** (top story, in-progress review, flagged signals with severity) sells the platform vision better than empty placeholders or generic counter stats.
- **Sidebar > top-bar tabs** for a workspace that's expected to grow. Top-bar tabs broke down conceptually as soon as we imagined 5+ tools.
- **Side-by-side mockups** beat trying to describe two layouts in words. Built both, let the user click between them, decision was instant.
- **Reading the brand source-of-truth file BEFORE designing** (twice — palette + fonts are separate sources). Caught off-brand work in two rounds; saved a third revision.
- **Reading the existing underlying tools' CSS** revealed the real palette in use (and exposed a brand-vs-implementation gap).

## What didn't

- **Iridescent Air/Land/Sea imagery as a hero header at full opacity** looked like a marketing site, not a workspace. The brand rules even said imagery is for empty states at 0.15–0.25 opacity — should have followed that on the first pass.
- **Dark mode as a default instinct** was wrong. Applied brand is light mode (`#F5F5F7` / `#FFFFFF`). Took a full rebuild to align.
- **DM Sans because the underlying tools used it** — Applied has its own corporate typeface (Applied Sans Display / Text / Mono). The tools were also off-brand; copying them propagated the mistake.
- **Using `background-size: cover` on a short header band** — caused heavy zoom of brand images. Either `contain` or a taller band would have worked; better still, no imagery there at all.

## Pitfalls

- **Browser `file://` URLs cache aggressively** — `⌘⇧R` often isn't enough. Incognito / private window is the reliable nuke.
- **BRAND_RULES.md was missing the Tertiary palette** (purples / dark-blue / green-mid / yellow / orange ramps). Without it, doing three-tool category color coding on-brand is impossible. Added it.
- **Brand rules are not all in one file.** Color palette lives in `apps-platform-apps/docs/ai/branding.md`; broader build rules (fonts, radius, shadows, imagery) live in `zoyatalkingtoherself/BRAND_RULES.md`. Need to check both.
- **The image opacity rule (0.15–0.25)** was written to protect text legibility, not to mute every use of imagery. Intent vs. literal reading matters.
