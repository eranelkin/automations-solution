"use client";

import { useLocale, useTranslations } from "next-intl";
import { Phone, Mail } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Container } from "@/components/ui/container";
import { Link } from "@/i18n/navigation";
import { ThemeToggle } from "./theme-toggle";
// Hebrew only for now; restore to bring back the language switcher.
// import { LanguageSwitcher } from "./language-switcher";
import { NAV_LINKS } from "./nav-links";
import {
  COMPANY_NAME,
  CONTACT_EMAIL,
  PHONE_DISPLAY,
  SOCIAL_LINKS,
  WHATSAPP_PHONE,
} from "@/config/site";

const LEGAL_LINKS = [
  { href: "/accessibility", labelKey: "accessibility" },
  { href: "/privacy", labelKey: "privacy" },
  { href: "/terms", labelKey: "terms" },
] as const;

export function Footer() {
  const t = useTranslations("footer");
  const tRoot = useTranslations();
  const locale = useLocale();
  const year = new Date().getFullYear();
  const hasSocial = Object.values(SOCIAL_LINKS).some(Boolean);

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <Container className="py-14 md:py-20">
        <div className="rounded-3xl border border-[var(--accent)]/20 bg-[var(--card)] p-8 text-center md:p-12">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] md:text-2xl">
            {t("closingTitle")}
          </h2>
          <p className="mt-2 text-[var(--text-secondary)]">
            {t("closingText")}
          </p>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--text-secondary)]">
              {t("tagline")}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              {t("navTitle")}
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {NAV_LINKS.map(({ id, labelKey }) => (
                <li key={id}>
                  <a
                    href={`/${locale}#${id}`}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    {tRoot(labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              {t("contactTitle")}
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-[var(--text-secondary)]">
              <li>
                <a
                  href={`tel:+${WHATSAPP_PHONE}`}
                  className="flex items-center gap-2 hover:text-[var(--text-primary)]"
                >
                  <Phone className="size-4" aria-hidden="true" />
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="flex items-center gap-2 hover:text-[var(--text-primary)]"
                >
                  <Mail className="size-4" aria-hidden="true" />
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
            {hasSocial && (
              <ul className="mt-4 flex gap-3">
                {Object.entries(SOCIAL_LINKS)
                  .filter(([, href]) => href)
                  .map(([name, href]) => (
                    <li key={name}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      >
                        {name}
                      </a>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-6 border-t border-[var(--border)] pt-8 md:flex-row md:justify-between">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[var(--text-secondary)]">
            {LEGAL_LINKS.map(({ href, labelKey }) => (
              <li key={href}>
                <Link href={href} className="hover:text-[var(--text-primary)]">
                  {t(labelKey)}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {/* <LanguageSwitcher /> */}
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-[var(--text-secondary)]">
          © {year} {COMPANY_NAME}. {t("rights")}.
        </p>
      </Container>
    </footer>
  );
}
