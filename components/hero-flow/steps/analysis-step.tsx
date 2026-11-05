"use client";

import { motion, useReducedMotionConfig } from "motion/react";
import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";
import { WhatsAppBubble, useStepEnter, stepEnterProps, staggerDelay } from "../atoms";

export function AnalysisStep() {
  const t = useTranslations("hero.flow.steps.analysis");
  const intake = useTranslations("hero.flow.steps.intake");
  const entities = t.raw("entities") as string[];
  const reduce = useReducedMotionConfig();

  return (
    <div className="flex h-full flex-col gap-4 p-5">
      <motion.div
        {...useStepEnter()}
        className="flex items-center gap-2 text-xs font-semibold text-[var(--accent)]"
      >
        <Sparkles className="size-4" aria-hidden="true" />
        {t("agentLabel")}
      </motion.div>

      <WhatsAppBubble sender={intake("sender")} delay={staggerDelay(1)}>
        <span className="relative block overflow-hidden">
          {intake("message")}
          {!reduce && (
            <motion.div
              aria-hidden="true"
              initial={{ y: "-40px" }}
              animate={{ y: "160px" }}
              transition={{ duration: 1.4, ease: "easeInOut", delay: 0.3 }}
              className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-transparent via-[var(--accent-2)]/25 to-transparent"
            />
          )}
        </span>
      </WhatsAppBubble>

      <div className="flex flex-wrap gap-2">
        {entities.map((entity, i) => (
          <motion.span
            key={entity}
            {...stepEnterProps(staggerDelay(i + 2), Boolean(reduce))}
            className="rounded-full border border-[var(--accent-2)]/40 bg-[var(--accent-2)]/10 px-3 py-1 text-xs font-medium text-[var(--accent-2-text)]"
          >
            {entity}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
