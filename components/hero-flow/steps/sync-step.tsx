"use client";

import { motion, useReducedMotionConfig } from "motion/react";
import { useTranslations } from "next-intl";
import { SystemCard, useStepEnter } from "../atoms";

export function SyncStep() {
  const t = useTranslations("hero.flow.steps.sync");
  const reduce = useReducedMotionConfig();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-5">
      <motion.div
        {...useStepEnter()}
        className="relative h-14 w-full max-w-[200px]"
        aria-hidden="true"
      >
        <svg viewBox="0 0 200 56" className="h-full w-full overflow-visible">
          <motion.path
            d="M100 2 C 100 24, 40 24, 20 50"
            fill="none"
            stroke="var(--accent-2)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          />
          <motion.path
            d="M100 2 C 100 24, 160 24, 180 50"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          />
        </svg>
        {!reduce && (
          <motion.span
            className="absolute start-1/2 top-0 size-2.5 -translate-x-1/2 rounded-full bg-[var(--accent)]"
            initial={{ x: "-50%", y: 0 }}
            animate={{
              x: ["-50%", "calc(-50% - 85px)", "-50%", "calc(-50% + 85px)"],
              y: [0, 44, 44, 44],
            }}
            transition={{ duration: 1.8, times: [0, 0.4, 0.5, 0.9], ease: "easeInOut" }}
          />
        )}
      </motion.div>

      <div className="flex w-full gap-3">
        <SystemCard name={t("erp")} rowCreated={t("rowCreated")} delay={0.3} />
        <SystemCard name={t("crm")} rowCreated={t("rowCreated")} delay={0.5} />
      </div>
    </div>
  );
}
