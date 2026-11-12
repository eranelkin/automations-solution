"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Check, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHeroFlow } from "./use-hero-flow";
import { STEP_COMPONENTS } from "./step-registry";
import { HERO_FLOW_STEP_IDS } from "./hero-flow.config";

export function HeroFlowWindow({ disabled = false }: { disabled?: boolean }) {
  const t = useTranslations("hero.flow");
  const flow = useHeroFlow(disabled);
  const rootRef = useRef<HTMLDivElement>(null);
  const activeStepRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeStepRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "nearest",
      block: "nearest",
    });
  }, [flow.index]);

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
      onMouseEnter={() => flow.setHovered(true)}
      onMouseLeave={() => flow.setHovered(false)}
      className="relative mx-auto w-full max-w-[720px] overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-[0_24px_64px_-24px_rgba(15,23,42,0.25)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
    >
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </div>
        <p className="truncate text-xs font-medium text-[var(--text-secondary)]">
          {t("windowTitle")}
        </p>
        <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-secondary)]">
          {t("exampleBadge")}
        </span>
      </div>

      <div className="flex h-[320px] md:h-[340px]">
        <nav
          aria-label={t("stepsNav")}
          className="w-[150px] shrink-0 overflow-y-auto border-e border-[var(--border)] bg-[var(--surface)]/60 p-1.5 [scrollbar-width:none]"
        >
          <ol className="flex flex-col gap-0.5">
            {HERO_FLOW_STEP_IDS.map((id, i) => {
              const isActive = i === flow.index;
              const isDone = i < flow.index;
              return (
                <li key={id}>
                  <button
                    type="button"
                    ref={isActive ? activeStepRef : undefined}
                    onClick={() => flow.jumpTo(i)}
                    aria-current={isActive ? "step" : undefined}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-start text-xs font-medium transition-colors duration-200",
                      isActive
                        ? "bg-[var(--accent)]/12 text-[var(--accent)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--background)]",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded-full",
                        isDone
                          ? "bg-[var(--success)] text-white"
                          : isActive
                            ? "relative bg-[var(--accent)]"
                            : "border border-[var(--border)]",
                      )}
                    >
                      {isDone && <Check className="size-2.5" strokeWidth={3} aria-hidden="true" />}
                      {isActive && (
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--accent)] opacity-60 motion-reduce:animate-none" />
                      )}
                    </span>
                    <span className="min-w-0 leading-tight">{t(`steps.${id}.stepName`)}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="relative flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={flow.currentStepId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <StepComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-2.5">
        <button
          type="button"
          onClick={flow.toggle}
          aria-label={flow.playing ? t("pause") : t("play")}
          className="flex size-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-primary)] transition-colors hover:bg-[var(--surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
        >
          {flow.playing ? (
            <Pause className="size-4" aria-hidden="true" />
          ) : (
            <Play className="size-4" aria-hidden="true" />
          )}
        </button>
        <p className="text-xs font-medium tabular-nums text-[var(--text-secondary)]">
          {t("stepOf", { current: flow.index + 1, total: HERO_FLOW_STEP_IDS.length })}
        </p>
      </div>

      <p aria-live="polite" className="sr-only">
        {t(`steps.${flow.currentStepId}.stepName`)}
      </p>
    </div>
  );
}
