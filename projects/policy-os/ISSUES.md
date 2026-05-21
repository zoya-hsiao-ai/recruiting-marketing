# ISSUES — policy-os
> Rewrite this file at the end of every sprint. Last updated: 2026-05-20.

## Active bugs

| Bug | Severity | Notes |
|-----|----------|-------|
| Double sidebar when a tool loads in the iframe | low | Cosmetic only — Policy-OS sidebar + the tool's own internal sidebar both render. Fix in Option B by sending `?embed=1` and having each tool hide its sidebar. |
| Google OAuth flows in tools may fail when iframed | unknown | Not encountered yet because tools haven't been used in this shell. Third-party cookie restrictions can block GSI in iframes. May need to open OAuth in a popup, not the iframe. |

## Tech debt

- Highlights content is hardcoded mocked data — needs to be replaced with live data per tool.
- Tool color-coding (Newsroom blue / First Pass green / Canary yellow) is defined in Policy-OS CSS variables, then re-implemented per tool. Consolidate into a shared design token file when Option B lands.
- `BRAND_RULES.md` is duplicated between `~/zoyatalkingtoherself/` (canonical) and `~/Documents/legal/Policy-OS/` (project copy). Drift risk over time. Could symlink or sync programmatically.
- The three Air / Land / Sea PNGs ship in `assets/imagery/` but aren't currently used after the imagery → Highlights pivot. Either delete or repurpose (e.g., subtle empty-state decoration per the brand rules).
- No build system / no minification — fine for v0.1.0 file:// usage, would need a build step before deploying.

## Blocked by

- None.
