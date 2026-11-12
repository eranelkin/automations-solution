# Deploying the site

The site is hosted on **Vercel** and served on the domain registered at
**Namecheap** (`workflowpilot.net`, served at `https://www.workflowpilot.net/he`). The domain stays at Namecheap; only its DNS records point at
Vercel. Vercel builds and deploys straight from GitHub
(`eranelkin/automations-solution`, branch `main`).

## Before you start

- The code must build: `npm run build` (plus `npm run typecheck`,
  `npm run lint`, `npm run test`). Vercel runs the same build.
- Everything you want live must be committed and pushed to `main`.
- Plan: Vercel's free **Hobby** tier is for non-commercial use only. A
  business site should be on **Pro** (~$20/month).

## Environment variables

Set these in Vercel → Project → **Settings → Environment Variables**.
testing
| Variable | Required | Value |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://www.workflowpilot.net` (no `/he`; the locale is added automatically). Used for page metadata, share images and structured data (read in `config/site.ts`). |
| `EMAILJS_SERVICE_ID` | For the contact form | EmailJS → Email Services → your service's ID. |
| `EMAILJS_TEMPLATE_ID` | For the contact form | EmailJS → Email Templates → your template's ID. |
| `EMAILJS_PUBLIC_KEY` | For the contact form | EmailJS → Account → General → Public Key. |
| `EMAILJS_PRIVATE_KEY` | For the contact form | EmailJS → Account → Security → Private Key. Secret: never commit it. |
| `WEBHOOK_URL` | Optional | Used only when the four EmailJS values aren't all set. With neither configured, the form shows a clear "not configured" error instead of faking success. |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | No | Turns analytics on. |

### Contact form email (EmailJS)

Submissions are emailed from the server (`app/api/contact/route.ts`) through
EmailJS's REST API, so the private key never reaches the browser and no
EmailJS script is loaded on the page. One-time setup in EmailJS:

1. **Email Services → Add New Service**: connect the mailbox that sends.
2. **Email Templates → Create New Template**: set *To Email* to where leads
   should arrive, *Reply To* to `{{email}}`, and use these variables in the
   subject/body: `{{fullName}}`, `{{phone}}`, `{{email}}`, `{{description}}`,
   `{{submittedAt}}` (empty email/description arrive as `-`).
3. **Account → Security**: create a Private Key and enable
   **"Allow EmailJS API for non-browser applications"**. Without it, EmailJS
   rejects server sends with a 403.
4. Put the four `EMAILJS_*` values in `.env.local` for local work and in
   Vercel's Environment Variables for production.

After changing a variable, redeploy (Deployments → ⋯ → **Redeploy**) for it
to take effect.

## 1. Create the Vercel project (one time)

1. Go to [vercel.com](https://vercel.com) and choose **Continue with GitHub**.
2. **Add New → Project** and import `eranelkin/automations-solution`.
   Vercel detects Next.js; leave the build settings at their defaults.
3. Add the environment variables above.
4. Click **Deploy**. You get a `https://<project>.vercel.app` URL. Check
   the site there before connecting the domain.

## 2. Connect the domain in Vercel (one time)

1. In the project, open **Settings → Domains**.
2. Add `www.workflowpilot.net` and `workflowpilot.net`.
3. Make `www.workflowpilot.net` the primary domain and set `workflowpilot.net`
   to **redirect** to it.
4. Vercel lists the DNS records it expects. Use those exact values in the
   next step if they differ from the ones below.

## 3. Point Namecheap DNS at Vercel (one time)

1. Namecheap → **Domain List** → **Manage** next to `workflowpilot.net`.
2. Under **Nameservers**, keep **Namecheap BasicDNS**.
3. Open **Advanced DNS** and **delete** the default parking records:
   - `CNAME Record` `www` → `parkingpage.namecheap.com`
   - any `URL Redirect Record` on `@`
4. **Add** these records:

   | Type | Host | Value | TTL |
   |---|---|---|---|
   | A Record | `@` | `76.76.21.21` | Automatic |
   | CNAME Record | `www` | `cname.vercel-dns.com` | Automatic |

5. Save. DNS usually updates within minutes, sometimes a few hours. When
   Vercel's Domains page shows the domain as valid, it issues the HTTPS
   certificate automatically.

## Deploying changes (every time)

Push to `main`; Vercel builds and deploys automatically:

```bash
npm run build && npm run test   # optional local check
git push origin main
```

Every pull request also gets its own preview URL from Vercel, so changes can
be reviewed before they are merged.

To roll back, open Vercel → **Deployments**, pick an earlier deployment and
choose **Promote to Production**.

## Checking the live site

- `https://www.workflowpilot.net` opens the Hebrew site at
  `https://www.workflowpilot.net/he`.
- `https://workflowpilot.net` and `http://www.workflowpilot.net` redirect to
  `https://www.workflowpilot.net`.
- `curl -I https://www.workflowpilot.net/he` shows the security headers from
  `next.config.ts` (`Content-Security-Policy`, `X-Frame-Options`, ...).
- Page titles and share previews use the real domain (confirms
  `NEXT_PUBLIC_SITE_URL`).
- The accessibility, privacy and terms pages load.
- The contact form sends a test message and it arrives in the EmailJS template's inbox.

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Vercel says "Invalid Configuration" for the domain | DNS not updated yet, or a parking record is still there. Recheck step 3 and wait. |
| Domain still shows the Namecheap parking page | The default `www` CNAME / `@` URL Redirect records were not deleted. |
| Share previews or metadata show the wrong domain | `NEXT_PUBLIC_SITE_URL` is missing or wrong; set it to `https://www.workflowpilot.net` and redeploy. |
| Contact form says it isn't configured | The `EMAILJS_*` values (or `WEBHOOK_URL`) are missing; set them and redeploy. |
| Contact form shows "something went wrong" | EmailJS rejected the send. Check the server log for `[contact] EmailJS delivery failed`; a 403 usually means "Allow EmailJS API for non-browser applications" is off, a 400 a wrong ID or key. |
| Build fails on Vercel | Run `npm run build` locally, fix the error, push again. |
