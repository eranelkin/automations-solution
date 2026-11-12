"use client";

import { useState } from "react";
import { MotionConfig } from "motion/react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { STEP_COMPONENTS } from "./step-registry";
import { HERO_FLOW_STEP_IDS } from "./hero-flow.config";

/**
 * Reduced-motion fallback: all 7 steps reachable via a manual tab/stepper,
 * no auto-play, no flowing lines or cursor — a polished static read of each
 * step's end state. Reused for both OS-level `prefers-reduced-motion` and
 * the in-app "stop animations" accessibility toggle.
 */
export function HeroFlowStatic() {
  const t = useTranslations("hero.flow");
  const [index, setIndex] = useState(0);
  const stepId = HERO_FLOW_STEP_IDS[index];
  const StepComponent = STEP_COMPONENTS[stepId];

  return (
    <div
      role="region"
      aria-label={t("ariaLabel")}
      className="relative mx-auto w-full max-w-[720px] overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)]"
    >
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3">
        <p className="truncate text-xs font-medium text-[var(--text-secondary)]">
          {t("windowTitle")}
        </p>
        <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-secondary)]">
          {t("exampleBadge")}
        </span>
      </div>

      <div
        role="tablist"
        aria-label={t("stepsNav")}
        className="flex flex-wrap gap-1 border-b border-[var(--border)] px-3 py-2.5"
      >
        {HERO_FLOW_STEP_IDS.map((id, i) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={i === index}
            onClick={() => setIndex(i)}
            className={cn(
              "rounded-full px-2.5 py-1.5 text-xs font-medium",
              i === index
                ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                : "text-[var(--text-secondary)] hover:bg-[var(--background)]",
            )}
          >
            {t(`steps.${id}.stepName`)}
          </button>
        ))}
      </div>

      <MotionConfig reducedMotion="always">
        <div className="relative min-h-[280px]">
          <StepComponent staticMode />
        </div>
      </MotionConfig>

      <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-2.5">
        <button
          type="button"
          onClick={() => setIndex((i) => Math.max(i - 1, 0))}
          disabled={index === 0}
          aria-label={t("prevStep")}
          className="flex size-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-primary)] disabled:opacity-40"
        >
          <ChevronLeft className="size-4 rtl:hidden" aria-hidden="true" />
          <ChevronRight className="hidden size-4 rtl:block" aria-hidden="true" />
        </button>
        <p className="text-xs font-medium tabular-nums text-[var(--text-secondary)]">
          {t("stepOf", { current: index + 1, total: HERO_FLOW_STEP_IDS.length })}
        </p>
        <button
          type="button"
          onClick={() => setIndex((i) => Math.min(i + 1, HERO_FLOW_STEP_IDS.length - 1))}
          disabled={index === HERO_FLOW_STEP_IDS.length - 1}
          aria-label={t("nextStep")}
          className="flex size-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-primary)] disabled:opacity-40"
        >
          <ChevronRight className="size-4 rtl:hidden" aria-hidden="true" />
          <ChevronLeft className="hidden size-4 rtl:block" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
