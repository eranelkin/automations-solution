"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Calculator, ChevronDown, X } from "lucide-react";
import { CalculatorSlider } from "./calculator-slider";
import { CalculatorResults } from "./calculator-results";
import { useCalculator } from "./calculator-context";
import { CALCULATOR_RANGES } from "@/lib/savings";
import { SAVINGS_RATE } from "@/config/site";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

const HASH = "#calculator";
const ease = [0.22, 1, 0.36, 1] as const;

export function CalculatorDock() {
  const t = useTranslations("calculator");
  const locale = useLocale();
  const reduced = usePrefersReducedMotion();
  const { input, setInput, result } = useCalculator();
  const [open, setOpen] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  // An outside click closes the panel; focus then stays where the user
  // clicked instead of jumping back to the float button.
  const skipRefocus = useRef(false);

  // Nav links point at `#calculator` (also from pages without the dock), so
  // the hash is the "open" signal; it's cleared so the next click fires again.
  useEffect(() => {
    const onHash = () => {
      if (window.location.hash !== HASH) return;
      setOpen(true);
      history.replaceState(null, "", window.location.pathname + window.location.search);
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // The card grows out of the button's corner, which sits on the inline-end
  // side: physical left in RTL, right in LTR.
  const transformOrigin = locale === "he" ? "top left" : "top right";
  const transition = reduced ? { duration: 0 } : { duration: 0.45, ease };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen} modal={false}>
      <AnimatePresence initial={false}>
        {!open && (
          <motion.button
            key="calculator-button"
            ref={buttonRef}
            type="button"
            aria-label={t("dock.open")}
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={reduced ? { duration: 0 } : { duration: 0.2, ease }}
            className="fixed end-5 top-24 z-30 flex size-14 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] shadow-lg transition-[scale] hover:scale-105 focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <Calculator className="size-6" aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Content
              forceMount
              asChild
              aria-describedby={undefined}
              onInteractOutside={() => {
                skipRefocus.current = true;
              }}
              onCloseAutoFocus={(e) => {
                e.preventDefault();
                if (skipRefocus.current) {
                  skipRefocus.current = false;
                  return;
                }
                buttonRef.current?.focus();
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: reduced ? 1 : 0.15 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: reduced ? 1 : 0.15 }}
                transition={transition}
                style={{ transformOrigin }}
                className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-[var(--card)] md:inset-auto md:end-5 md:top-24 md:z-[35] md:max-h-[calc(100svh-7rem)] md:w-[600px] md:rounded-3xl md:border md:border-[var(--border)] md:shadow-[0_24px_64px_-24px_rgba(15,23,42,0.35)] md:dark:shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
              >
                <div className="flex items-start justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface)] px-5 py-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/15 text-[var(--accent)]">
                      <Calculator className="size-4.5" aria-hidden="true" />
                    </span>
                    <div>
                      <Dialog.Title className="text-base leading-snug font-semibold text-[var(--text-primary)]">
                        {t("title")}
                      </Dialog.Title>
                      <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
                        {t("subtitle")}
                      </p>
                    </div>
                  </div>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label={t("dock.close")}
                      className="flex size-9 shrink-0 items-center justify-center rounded-full text-[var(--text-primary)] transition-colors hover:bg-[var(--card)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:outline-none"
                    >
                      <X className="size-4.5" aria-hidden="true" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="flex flex-col gap-6 overflow-y-auto px-5 py-5">
                  <div className="flex flex-col gap-5">
                    <CalculatorSlider
                      label={t("sliders.employees.label")}
                      value={input.employees}
                      min={CALCULATOR_RANGES.employees.min}
                      max={CALCULATOR_RANGES.employees.max}
                      step={CALCULATOR_RANGES.employees.step}
                      suffix={t("sliders.employees.unit")}
                      ariaValueText={(v) => t("sliders.employees.valueText", { value: v })}
                      onChange={(v) => setInput({ ...input, employees: v })}
                    />
                    <CalculatorSlider
                      label={t("sliders.hoursPerWeek.label")}
                      value={input.hoursPerWeek}
                      min={CALCULATOR_RANGES.hoursPerWeek.min}
                      max={CALCULATOR_RANGES.hoursPerWeek.max}
                      step={CALCULATOR_RANGES.hoursPerWeek.step}
                      suffix={t("sliders.hoursPerWeek.unit")}
                      ariaValueText={(v) => t("sliders.hoursPerWeek.valueText", { value: v })}
                      onChange={(v) => setInput({ ...input, hoursPerWeek: v })}
                    />
                    <CalculatorSlider
                      label={t("sliders.hourlyCost.label")}
                      value={input.hourlyCost}
                      min={CALCULATOR_RANGES.hourlyCost.min}
                      max={CALCULATOR_RANGES.hourlyCost.max}
                      step={CALCULATOR_RANGES.hourlyCost.step}
                      suffix={t("sliders.hourlyCost.unit")}
                      ariaValueText={(v) => t("sliders.hourlyCost.valueText", { value: v })}
                      onChange={(v) => setInput({ ...input, hourlyCost: v })}
                    />
                  </div>

                  <CalculatorResults result={result} />

                  <div>
                    <button
                      type="button"
                      aria-expanded={showDisclaimer}
                      onClick={() => setShowDisclaimer((v) => !v)}
                      className="flex items-center gap-1.5 rounded-md text-xs font-medium text-[var(--text-secondary)] underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:outline-none"
                    >
                      {t("dock.disclaimerToggle")}
                      <ChevronDown
                        className={cn(
                          "size-3.5 transition-transform duration-200",
                          showDisclaimer && "rotate-180",
                        )}
                        aria-hidden="true"
                      />
                    </button>
                    {showDisclaimer && (
                      <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">
                        {t("disclaimer", { rate: Math.round(SAVINGS_RATE * 100) })}
                      </p>
                    )}
                  </div>

                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
