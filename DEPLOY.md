# Deploying the site

The site is hosted on **Vercel** and served on the domain registered at
**Namecheap**. The domain stays at Namecheap; only its DNS records point at
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
| `NEXT_PUBLIC_SITE_URL` | Yes | `https://your-domain.com`. Used for page metadata, share images and structured data (read in `config/site.ts`). |
| `WEBHOOK_URL` | For the contact form | Where contact-form submissions are sent. Without it, the form shows a clear "not configured" error instead of faking success. |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | No | Turns analytics on. |

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
2. Add `your-domain.com` and `www.your-domain.com`.
3. Set `www` to **redirect** to `your-domain.com`.
4. Vercel lists the DNS records it expects. Use those exact values in the
   next step if they differ from the ones below.

## 3. Point Namecheap DNS at Vercel (one time)

1. Namecheap → **Domain List** → **Manage** next to the domain.
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

- `https://your-domain.com` opens the Hebrew site (`/he`).
- `https://www.your-domain.com` and `http://your-domain.com` redirect to
  `https://your-domain.com`.
- `curl -I https://your-domain.com/he` shows the security headers from
  `next.config.ts` (`Content-Security-Policy`, `X-Frame-Options`, ...).
- Page titles and share previews use the real domain (confirms
  `NEXT_PUBLIC_SITE_URL`).
- The accessibility, privacy and terms pages load.
- The contact form sends a test message (if `WEBHOOK_URL` is set).

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Vercel says "Invalid Configuration" for the domain | DNS not updated yet, or a parking record is still there. Recheck step 3 and wait. |
| Domain still shows the Namecheap parking page | The default `www` CNAME / `@` URL Redirect records were not deleted. |
| Share previews or metadata show `workflowpilot.example.com` | `NEXT_PUBLIC_SITE_URL` is missing; set it and redeploy. |
| Contact form says it isn't configured | `WEBHOOK_URL` is missing; set it and redeploy. |
| Build fails on Vercel | Run `npm run build` locally, fix the error, push again. |
