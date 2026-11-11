"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
// Hebrew only for now; restore to bring back the language switcher.
// import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";
import { NAV_LINKS } from "./nav-links";

export function MobileMenu() {
  const t = useTranslations();
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label={t("common.openMenu")}
          className="flex size-10 items-center justify-center rounded-full text-[var(--text-primary)] lg:hidden"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[var(--background)]/70 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-0 z-50 flex flex-col bg-[var(--background)] p-6">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold text-[var(--text-primary)]">
              {t("meta.titleSuffix")}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label={t("common.closeMenu")}
                className="flex size-10 items-center justify-center rounded-full text-[var(--text-primary)] hover:bg-[var(--surface)]"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          <nav className="mt-10 flex flex-col gap-1">
            {NAV_LINKS.map(({ id, labelKey }) => (
              <a
                key={id}
                href={`/${locale}#${id}`}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-4 text-lg font-medium text-[var(--text-primary)] hover:bg-[var(--surface)]"
              >
                {t(labelKey)}
              </a>
            ))}
          </nav>

          <div className="mt-auto flex items-center justify-between gap-3 border-t border-[var(--border)] pt-6">
            <div className="flex items-center gap-2">
              <ThemeToggle />
              {/* <LanguageSwitcher /> */}
            </div>
            <Button asChild variant="cta" size="lg" onClick={() => setOpen(false)}>
              <a href={`/${locale}#contact`}>{t("nav.cta")}</a>
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
