"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Play, X } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { HeroFlow } from "./hero-flow";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * The live process animation, on demand: a button under the Hero story opens
 * it in a centered popup. Content unmounts on close, so every open replays
 * from step 1 and nothing animates in the background.
 */
export function HeroDemoDialog() {
  const t = useTranslations("hero.story");
  const reduced = usePrefersReducedMotion();
  const [open, setOpen] = useState(false);
  const transition = reduced ? { duration: 0 } : { duration: 0.35, ease };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="group inline-flex items-center gap-3 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/12 py-2 ps-2 pe-5 text-base font-semibold text-[var(--text-primary)] shadow-sm transition-[background-color,border-color,box-shadow] duration-200 hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/18 hover:shadow-md focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:outline-none"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] transition-transform duration-200 group-hover:scale-105">
            {/* Play points "forward" in reading direction. */}
            <Play
              className="size-4 fill-current rtl:-scale-x-100"
              aria-hidden="true"
            />
          </span>
          {t("demoButton")}
        </button>
      </Dialog.Trigger>

      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay forceMount asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={transition}
                className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <div className="pointer-events-none fixed inset-0 z-[61] flex items-center justify-center p-3 md:p-6">
              <Dialog.Content forceMount asChild aria-describedby={undefined}>
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: reduced ? 1 : 0.94,
                    y: reduced ? 0 : 12,
                  }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    scale: reduced ? 1 : 0.96,
                    y: reduced ? 0 : 8,
                  }}
                  transition={transition}
                  className="pointer-events-auto flex max-h-full w-full max-w-[960px] flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--background)] shadow-2xl"
                >
                  <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 md:px-8">
                    <div>
                      <Dialog.Title className="text-xl leading-snug font-bold text-balance text-[var(--text-primary)] md:text-2xl">
                        {t("demoTitle")}
                      </Dialog.Title>
                      <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
                        {t("demoSubtitle")}
                      </p>
                    </div>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        aria-label={t("close")}
                        className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-primary)] transition-colors hover:bg-[var(--surface)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:outline-none"
                      >
                        <X className="size-5" aria-hidden="true" />
                      </button>
                    </Dialog.Close>
                  </div>
                  <div className="overflow-y-auto px-3 pb-6 md:px-8 md:pb-8">
                    <div className="hero-demo-scale">
                      <HeroFlow />
                    </div>
                  </div>
                </motion.div>
              </Dialog.Content>
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
