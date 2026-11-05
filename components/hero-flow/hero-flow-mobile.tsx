"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations, useLocale } from "next-intl";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHeroFlow } from "./use-hero-flow";
import { STEP_COMPONENTS } from "./step-registry";
import { HERO_FLOW_STEP_IDS } from "./hero-flow.config";

/**
 * Dedicated mobile layout (not a shrunk desktop window): compact fixed
 * height, one step at a time with a horizontal slide in reading direction,
 * and a condensed dot stepper + current step name instead of the full
 * labeled pill row.
 */
export function HeroFlowMobile({ disabled = false }: { disabled?: boolean }) {
  const t = useTranslations("hero.flow");
  const locale = useLocale();
  const dirSign = locale === "he" ? -1 : 1;
  const flow = useHeroFlow(disabled);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => flow.setInView(entry.isIntersecting),
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onVisibility = () => flow.setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const StepComponent = STEP_COMPONENTS[flow.currentStepId];

  return (
    <div
      ref={rootRef}
      role="region"
      aria-label={t("ariaLabel")}
      className="relative mx-auto w-full max-w-[420px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-[0_16px_40px_-16px_rgba(15,23,42,0.22)]"
    >
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="size-2 rounded-full bg-[#ff5f57]" />
          <span className="size-2 rounded-full bg-[#febc2e]" />
          <span className="size-2 rounded-full bg-[#28c840]" />
        </div>
        <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-secondary)]">
          {t("exampleBadge")}
        </span>
      </div>

      <div className="relative h-[300px] overflow-hidden text-[15px]">
        <AnimatePresence mode="wait" custom={dirSign}>
          <motion.div
            key={flow.currentStepId}
            custom={dirSign}
            initial={{ opacity: 0, x: 18 * dirSign }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 * dirSign }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <StepComponent />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-[var(--border)] px-3 py-2">
        <button
          type="button"
          onClick={flow.toggle}
          aria-label={flow.playing ? t("pause") : t("play")}
          className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
        >
          {flow.playing ? (
            <Pause className="size-4" aria-hidden="true" />
          ) : (
            <Play className="size-4" aria-hidden="true" />
          )}
        </button>

        <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
          <div className="flex items-center gap-1.5">
            {HERO_FLOW_STEP_IDS.map((id, i) => (
              <button
                key={id}
                type="button"
                onClick={() => flow.jumpTo(i)}
                aria-current={i === flow.index ? "step" : undefined}
                aria-label={t(`steps.${id}.stepName`)}
                className="flex size-6 items-center justify-center"
              >
                <span
                  className={cn(
                    "rounded-full transition-all duration-200",
                    i === flow.index
                      ? "size-2 bg-[var(--accent)]"
                      : "size-1.5 bg-[var(--border)]",
                  )}
                />
              </button>
            ))}
          </div>
          <p className="truncate text-xs font-medium text-[var(--text-secondary)]">
            {t(`steps.${flow.currentStepId}.stepName`)}
          </p>
        </div>

        <span className="w-11 shrink-0" aria-hidden="true" />
      </div>

      <p aria-live="polite" className="sr-only">
        {t(`steps.${flow.currentStepId}.stepName`)}
      </p>
    </div>
  );
}
