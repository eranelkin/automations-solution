"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
// Hebrew only for now; restore to bring back the language switcher.
// import { LanguageSwitcher } from "./language-switcher";
import { MobileMenu } from "./mobile-menu";
import { NAV_LINKS } from "./nav-links";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled
          ? "border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-6 md:px-8">
        <a href={`/${locale}#top`} className="shrink-0">
          <Logo />
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map(({ id, labelKey }) => (
            <a
              key={id}
              href={`/${locale}#${id}`}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
            >
              {t(labelKey)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <div className="hidden items-center gap-1 lg:flex">
            <ThemeToggle />
            {/* <LanguageSwitcher /> */}
          </div>
          <Button asChild size="sm" className="ms-2 hidden lg:inline-flex">
            <a href={`/${locale}#contact`}>{t("nav.cta")}</a>
          </Button>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
