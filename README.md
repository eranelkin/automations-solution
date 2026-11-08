# FlowPilot — marketing site

A bilingual (Hebrew/English) one-page marketing site for FlowPilot, a
business-automation and AI-agents company. Built with Next.js App Router,
TypeScript, Tailwind CSS 4, next-intl, next-themes, Motion, and Radix UI.

Full product spec: `PROMPT.md`. Operational conventions: `CLAUDE.md`.
Decisions made autonomously during the build, with rationale: `docs/DECISIONS.md`.

## Running locally

```bash
npm install
cp .env.example .env.local   # fill in WEBHOOK_URL to test real form submission
npm run dev
```
Test
Open http://localhost:3000 — it redirects to `/he` (default locale; `/en`
is the other).

## Environment variables

See `.env.example`. The important one is `WEBHOOK_URL` — without it, the
contact form shows a clear error and a WhatsApp fallback instead of a fake
success (see `app/api/contact/route.ts`).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run test` | Unit tests (Vitest) — `lib/savings.ts` formulas |
| `npm run test:e2e` | Playwright e2e + axe-core accessibility scan (builds + starts the app automatically) |
| `npm run format` | Prettier |

## Deploying to Vercel

1. Push this repo to GitHub/GitLab/Bitbucket and import it in Vercel, or run
   `vercel` from the project root.
2. Set the environment variables from `.env.example` in the Vercel project
   settings (`WEBHOOK_URL`, `NEXT_PUBLIC_SITE_URL` — set this to the real
   production domain, it drives canonical URLs, OG images, and the sitemap,
   `NEXT_PUBLIC_ANALYTICS_ENABLED` once a real analytics provider is wired
   into `components/layout/analytics.tsx`).
3. Deploy. No other configuration is required — there's no database, no
   build-time secrets beyond the env vars above, and no external services
   besides whatever `WEBHOOK_URL` points to.

## Swapping the basics later

- **Company name, phone, email, social links, webhook:** `config/site.ts` —
  the single source of truth, referenced everywhere else.
- **Logo:** `components/ui/logo.tsx` (and regenerate `app/icon.tsx` /
  `app/apple-icon.tsx` / `app/[locale]/opengraph-image.tsx` to match).
- **Colors:** the token block at the top of `app/globals.css`.
- **Hero animation pacing:** `components/hero-flow/hero-flow.config.ts`.
- **Savings calculator rate:** `SAVINGS_RATE` in `config/site.ts` — the
  disclaimer copy on the calculator interpolates it automatically.
- **All copy:** `messages/he.json` and `messages/en.json`. Nothing is
  hardcoded in components.

## Regenerating the visual QA screenshot matrix

The `qa/` folder (git-ignored) holds full-page screenshots across
locales/themes/widths plus each Hero step individually, used during
development. To regenerate: build + `npm run start`, then drive Playwright
against `http://localhost:3000` the same way `tests/e2e/` does — see the
Playwright config (`playwright.config.ts`) for the base URL and browser setup.
