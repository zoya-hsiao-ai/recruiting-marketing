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

- `src/app/layout.tsx` — root layout with Geist font setup and global metadata
- `src/app/page.tsx` — main page (currently a scaffold placeholder; the conference budget calculator UI goes here)
- `src/app/globals.css` — global styles with Tailwind imports

The app is in early scaffolding state — `page.tsx` is still the default Next.js starter template. The conference budget calculator feature has not been implemented yet.
