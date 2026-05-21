# Applied Intuition — Brand & Build Rules
**Version:** Brand Guideline V1  
**Applies to:** All internal tools and frontend builds  
**Owner:** Zoya Gillani, Recruiting Program Manager  
**Last updated:** April 2026

Drop this file in the root of any project folder.
It is the single source of truth for brand compliance across all AI-assisted builds.

---

## Quick reference — the 6 rules that matter most

1. **Fonts:** Applied Sans Display (headings) · Applied Sans Text (UI/body) · Applied Mono (metadata only). Self-hosted from the font package. Never Inter.
2. **Blue is an accent:** #006CFA only on buttons, links, and active states. Not on backgrounds.
3. **Page background:** #F5F5F7 (Off White). Card surfaces: #FFFFFF.
4. **No shadows. No large radii.** Max border-radius is 8px. No box-shadow on cards or panels.
5. **Logo from files only.** Use the PNG files in /public/logos/. Never recreate in code. Min 36px.
6. **Imagery for empty states only.** Air/Land/Sea PNGs at opacity 0.15–0.25. Not behind interactive UI.

---

## Color tokens

Three tiers: **Primary** (Applied Blue + neutrals) for the dominant brand, **Secondary** (greys) for structure, **Tertiary** ramps for category coding only.

```css
/* Primary palette */
--ai-black:      #000000;
--ai-white:      #FFFFFF;
--ai-blue:       #006CFA;   /* Applied Blue — accents, CTAs, links, active states only */
--ai-off-white:  #F5F5F7;   /* page background */

/* Secondary palette — grey scale */
--ai-deep-grey:  #282B31;
--ai-dark-grey:  #5B616E;
--ai-mid-grey:   #8A919E;
--ai-grey:       #BDC1CA;
--ai-light-grey: #E3E5ED;

/* Tertiary palette — category coding only (multi-tool grids, severity scales, chart series).
   Never use as a primary surface. Pick one tier per use; do not mix tiers within a component. */
--ai-purple-dark:  #432689;   --ai-purple-mid:  #7C45FF;   --ai-purple-light: #D5C1FE;
--ai-blue-dark:    #2635C8;                                --ai-blue-light:   #B8DDFF;
--ai-green-dark:   #006F01;   --ai-green-mid:   #0BC242;   --ai-green-light:  #C4EDC8;
--ai-yellow-dark:  #DD8710;   --ai-yellow-mid:  #FFBE32;   --ai-yellow-light: #FFF29D;
--ai-orange-dark:  #C2191F;   --ai-orange-mid:  #FF443A;   --ai-orange-light: #FFCFCE;

/* Semantic (state indicators only — derived from tertiary) */
--color-success: #16A34A;   --color-success-bg: #DCFCE7;
--color-warning: #D97706;   --color-warning-bg: #FEF3C7;
--color-danger:  #DC2626;   --color-danger-bg:  #FEE2E2;
```

### Tertiary tier guidance

| Tier  | When to use                                                                 |
|-------|------------------------------------------------------------------------------|
| Dark  | Text labels, icons, badges on white where contrast matters (AA legibility).  |
| Mid   | Solid swatches, status dots, chart fills, hover accents.                     |
| Light | Tinted callout backgrounds, chip surfaces, subtle row highlights.            |

**Rule of thumb:** if you need three distinct category colors on the same screen, use one *Mid* from each color family (e.g. blue / green / yellow). Don't mix Dark + Mid + Light from different families in the same view.

**The colors not in the tertiary palette are not approved.** No invented blues, greens, or yellows — pull from this ramp only.

---

## Font setup

```css
/* In /app/globals.css */
@font-face {
  font-family: 'Applied Sans Display';
  src: url('/fonts/AppliedSansDisplay-Variable.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
}
@font-face {
  font-family: 'Applied Sans Text';
  src: url('/fonts/AppliedSansText-Variable.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
}
@font-face {
  font-family: 'Applied Sans Mono';
  src: url('/fonts/AppliedSansMono-Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}

:root {
  --font-display: 'Applied Sans Display', system-ui, sans-serif;
  --font-text:    'Applied Sans Text', system-ui, sans-serif;
  --font-mono:    'Applied Sans Mono', 'Courier New', monospace;
}

body {
  font-family: var(--font-text);
  font-size: 16px;
  line-height: 1.6;
  color: var(--ai-black);
  background: var(--ai-off-white);
  -webkit-font-smoothing: antialiased;
}
```

Font files location: `/public/fonts/`  
Source: `Applied_Sans_Font_Package.zip` (variable woff2 files recommended for web)

---

## Typography scale

| Token        | Size  | Family         | Weight | Use                        |
|--------------|-------|----------------|--------|----------------------------|
| --text-xl    | 30px  | Display        | 500    | Large display (rare)       |
| --text-lg    | 22px  | Display        | 500    | Page / panel titles        |
| --text-md    | 18px  | Display        | 500    | Section headings           |
| --text-base  | 15px  | Text           | 400    | Body copy                  |
| --text-sm    | 13px  | Text           | 500    | UI labels, table content   |
| --text-xs    | 11px  | Mono           | 400    | Timestamps, metadata       |

Sizes must differ by ≥35% per brand formula: next size = (n × 0.35) + n

---

## Spacing

```
4px · 8px · 12px · 16px · 20px · 24px · 32px · 48px
```

---

## Border radius

| Token       | Value | Use                    |
|-------------|-------|------------------------|
| --radius-sm | 4px   | Badges, tags, pills    |
| --radius-md | 6px   | Buttons, inputs        |
| --radius-lg | 8px   | Cards, panels, modals  |

**Maximum is 8px.** No pill buttons (border-radius: 9999px is a brand violation).

---

## Logo files

Location: `/public/logos/`

| File                                              | Use when                          |
|---------------------------------------------------|-----------------------------------|
| Applied_Intuition_Logo_Horizontal_-_Main.png      | Default — light backgrounds       |
| Applied_Intuition_Logo_Horizontal_-_Black.png     | All-black treatment on light bg   |
| Applied_Intuition_Logo_Horizontal_-_White.png     | Dark/black backgrounds            |
| Applied_Intuition_Logo_Horizontal_-_Blue.png      | High-visibility, all-blue         |
| Applied_Intuition_Logo_Symbol_-_Blue.png          | Favicon, app icon, tight spaces   |
| Applied_Intuition_Logo_Symbol_-_Black.png         | Symbol only on light bg           |
| Applied_Intuition_Logo_Symbol_-_White.png         | Symbol only on dark bg            |
| Applied_Intuition_Logo_Stacked-_Main.png          | Vertically constrained layouts    |

Minimum rendered height: **36px** (full lockup) · **25px** (symbol only)  
Clearspace: half the symbol height on all sides  

---

## Imagery files

Location: `/public/imagery/`

| File                          | Best use                              |
|-------------------------------|---------------------------------------|
| Applied_Intuition_Sea.png     | Graph/list empty states               |
| Applied_Intuition_Land.png    | Auth / login splash panel             |
| Applied_Intuition_Air.png     | Loading states, secondary splash      |

Always: `background-size: cover; background-position: center; opacity: 0.15–0.25`  
Never: behind interactive elements, tiled, filtered, or with text directly on top

---

## What never to do

| ✗ Violation                            | ✓ Correct alternative                     |
|----------------------------------------|-------------------------------------------|
| font-family: Inter                     | font-family: var(--font-text)             |
| border-radius: 12px or higher          | border-radius: var(--radius-lg) = 8px     |
| box-shadow on cards/panels             | 1px border using --ai-light-grey          |
| Blue background on sidebar/card        | White surface, blue for CTAs only         |
| Gradient on a button                   | Flat fill — #006CFA solid                 |
| Logo in CSS/HTML text                  | <Image src="/logos/...Main.png" />        |
| Applied Mono for labels or body        | Applied Sans Text for all UI copy         |
| Color not in the defined palette       | Use the grey scale or semantic tokens     |

---

## Asset inventory checklist

Before starting a Cursor or Claude Code session, confirm these files are in place:

```
/public/
  fonts/
    AppliedSansDisplay-Variable.woff2   ✓
    AppliedSansText-Variable.woff2      ✓
    AppliedSansMono-Regular.woff2       ✓
    AppliedSansMono-Medium.woff2        ✓
  logos/
    Applied_Intuition_Logo_Horizontal_-_Main.png    ✓
    Applied_Intuition_Logo_Horizontal_-_Black.png   ✓
    Applied_Intuition_Logo_Horizontal_-_White.png   ✓
    Applied_Intuition_Logo_Symbol_-_Blue.png        ✓
  imagery/
    Applied_Intuition_Sea.png    ✓
    Applied_Intuition_Land.png   ✓
    Applied_Intuition_Air.png    ✓
```
