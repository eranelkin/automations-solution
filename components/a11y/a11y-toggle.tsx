"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";
import {
  Accessibility,
  X,
  Minus,
  Plus,
  Contrast,
  PauseCircle,
  Link2,
  AlignJustify,
  RotateCcw,
} from "lucide-react";
import { useA11yPrefs } from "./a11y-provider";
import { cn } from "@/lib/utils";
import type { FontSizeLevel } from "@/lib/a11y-constants";
import { useCookieConsent } from "@/lib/use-cookie-consent";

const FONT_LEVELS: FontSizeLevel[] = ["normal", "large", "larger"];

function Toggle({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: typeof Contrast;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex items-center gap-3 rounded-xl border px-4 py-3 text-start text-sm font-medium transition-colors",
        active
          ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
          : "border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface)]",
      )}
    >
      <Icon className="size-4.5 shrink-0" aria-hidden="true" />
      {label}
    </button>
  );
}

export function A11yToggle() {
  const t = useTranslations("a11y");
  const { prefs, update, reset } = useA11yPrefs();
  const cookieConsent = useCookieConsent();
  const bannerVisible = cookieConsent === null;

  const fontIndex = FONT_LEVELS.indexOf(prefs.fontSize);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label={t("openPanel")}
          className={cn(
            "fixed start-5 z-30 flex size-14 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--text-primary)] shadow-lg transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
            bannerVisible ? "bottom-28 md:bottom-24" : "bottom-5",
          )}
        >
          <Accessibility className="size-6" aria-hidden="true" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[var(--background)]/70 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-md -translate-y-1/2 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold text-[var(--text-primary)]">
              {t("title")}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label={t("close")}
                className="flex size-9 items-center justify-center rounded-full hover:bg-[var(--surface)]"
              >
                <X className="size-4.5" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <div className="flex items-center justify-between rounded-xl border border-[var(--border)] px-4 py-3">
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {t("fontSize")}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label={t("decreaseFont")}
                  disabled={fontIndex === 0}
                  onClick={() => update({ fontSize: FONT_LEVELS[Math.max(fontIndex - 1, 0)] })}
                  className="flex size-8 items-center justify-center rounded-lg border border-[var(--border)] disabled:opacity-40"
                >
                  <Minus className="size-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label={t("increaseFont")}
                  disabled={fontIndex === FONT_LEVELS.length - 1}
                  onClick={() =>
                    update({
                      fontSize: FONT_LEVELS[Math.min(fontIndex + 1, FONT_LEVELS.length - 1)],
                    })
                  }
                  className="flex size-8 items-center justify-center rounded-lg border border-[var(--border)] disabled:opacity-40"
                >
                  <Plus className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <Toggle
              icon={Contrast}
              label={t("highContrast")}
              active={prefs.highContrast}
              onClick={() => update({ highContrast: !prefs.highContrast })}
            />
            <Toggle
              icon={PauseCircle}
              label={t("stopAnimations")}
              active={prefs.stopAnimations}
              onClick={() => update({ stopAnimations: !prefs.stopAnimations })}
            />
            <Toggle
              icon={Link2}
              label={t("underlineLinks")}
              active={prefs.underlineLinks}
              onClick={() => update({ underlineLinks: !prefs.underlineLinks })}
            />
            <Toggle
              icon={AlignJustify}
              label={t("readableSpacing")}
              active={prefs.readableSpacing}
              onClick={() => update({ readableSpacing: !prefs.readableSpacing })}
            />

            <button
              type="button"
              onClick={reset}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--surface)]"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              {t("reset")}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
