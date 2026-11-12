/**
 * Single source of truth for brand/contact details that may change before launch.
 * Swap COMPANY_NAME, phone, and links here — nowhere else in the codebase.
 */

export const COMPANY_NAME = "WorkFlowPilot";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.workflowpilot.net";

/** E.164-ish, no spaces — used to build wa.me / tel: links. */
export const WHATSAPP_PHONE = "972523637333";
export const PHONE_DISPLAY = "+972-52-363-7333";

/** [להשלמה: אימייל רשמי של החברה] */
export const CONTACT_EMAIL = "eran.elkin.auto@gmail.com";

export const SOCIAL_LINKS = {
  linkedin: "", // [להשלמה: קישור ללינקדאין]
  facebook: "", // [להשלמה: קישור לפייסבוק]
  instagram: "", // [להשלמה: קישור לאינסטגרם]
} as const;

export const LOCALES = ["he", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "he";

export const SAVINGS_RATE = 0.7;
export const WEEKS_PER_MONTH = 4.33;

/** [להשלמה: webhook endpoint לקליטת פניות מהטופס] — נקרא מהשרת בלבד מ-WEBHOOK_URL. */
export const CONTACT_WEBHOOK_ENV_VAR = "WEBHOOK_URL";

/** Analytics is wired but off by default until cookie consent + an env var opt-in. */
export const ANALYTICS_ENABLED =
  process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true";
