# CLAUDE.md

Conventions for working in this repo. Full product spec lives in `PROMPT.md` —
read that first for content/behavior; this file is the quick operational
reference. Decisions and their rationale: `docs/DECISIONS.md`.

## Stack

Next.js (App Router) + TypeScript strict + Tailwind CSS 4 (CSS-first, tokens
in `app/globals.css`, no `tailwind.config.ts`) + next-themes + next-intl +
Motion (Framer Motion) + Radix UI primitives + lucide-react + React Hook Form
+ Zod + Vitest (unit) + Playwright + axe-core (e2e/a11y/visual).

## i18n / RTL — non-negotiable rules

- Routes are `/he` (default) and `/en`, via `i18n/routing.ts` + `proxy.ts`.
  `/` redirects to `/he`.
- **Never hardcode text in components.** Everything comes from
  `messages/he.json` / `messages/en.json` via `useTranslations`/`getTranslations`.
- **Never use `left`/`right` in code.** Use logical properties/utilities only:
  `ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`, `text-start`, etc. Tailwind's
  logical-property utilities handle this; directional icons/animations must
  flip based on `dir`.
- `html lang`/`dir` are set per-locale in `app/[locale]/layout.tsx`.

## Design tokens

CSS variables in `app/globals.css` (`--background`, `--surface`, `--card`,
`--border`, `--text-primary`, `--text-secondary`, `--accent`, `--accent-2`,
`--success`, `--warning`), re-exposed to Tailwind via `@theme inline`. Light
and dark are **separate designs** (`.dark` class, toggled by `next-themes`),
not a simple invert — dark uses layered surfaces + soft borders/glow instead
of shadows. One accent color for actions/emphasis only, never decoration.

8px spacing grid. Section vertical rhythm: 96–160px desktop / 64–96px mobile
(`components/ui/section.tsx`). Content max-width 1280px
(`components/ui/container.tsx`). Numbers (calculator, hero counters) always
`tabular-nums`.

## Motion

150–250ms micro-interactions, 400–700ms entrances, easing
`cubic-bezier(0.22, 1, 0.36, 1)`. Animate `transform`/`opacity` only. Respect
`prefers-reduced-motion` (see `app/globals.css`) and the in-app
"stop animations" a11y toggle (`data-a11y-motion="reduce"` on `<html>`) —
both must produce a fully static, polished fallback, never a half-animated one.

## Content rules

- No stock photography, no generic illustrations, no emoji in the UI.
- No invented customers, logos, testimonials, case studies, or stats. Example
  scenarios are always labeled as examples.
- Missing real content (email, socials, webhook) uses the `[להשלמה: ...]`
  placeholder convention — see `config/site.ts`.
- Third-party systems (§10) are named in text only — never their logos.

## Structure

```
app/[locale]/        layout, page, accessibility, privacy, terms
app/api/contact/      form submission route handler
components/sections/  one component per landing-page section
components/hero-flow/ Hero process animation (state machine + per-step components)
components/calculator/
components/ui/        shared primitives (Button, Card, Badge, Section...)
config/site.ts         company name, phone, links, constants — the only place to edit these
lib/                   savings.ts, whatsapp.ts, utils.ts, fonts.ts
i18n/                  next-intl routing/request/navigation config
messages/he.json, en.json
docs/DECISIONS.md
tests/unit, tests/e2e
```

## Commands

`npm run dev` / `npm run build` / `npm run typecheck` / `npm run lint` /
`npm run test` (Vitest unit) / `npm run test:e2e` (Playwright).

## Swapping the basics later

Company name/logo/phone/links: `config/site.ts` + `components/ui/logo.tsx`.
Colors: the token block at the top of `app/globals.css`. Hero animation
pacing: `components/hero-flow/hero-flow.config.ts`. Savings calculator rate:
`SAVINGS_RATE` in `config/site.ts` (the disclaimer copy interpolates it, so it
stays in sync automatically).
