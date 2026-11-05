import { defineRouting } from "next-intl/routing";
import { LOCALES, DEFAULT_LOCALE } from "@/config/site";

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "always",
  // "/" must always land on the configured default locale (Hebrew), per
  // spec — not auto-redirect based on the visitor's Accept-Language header.
  localeDetection: false,
});
