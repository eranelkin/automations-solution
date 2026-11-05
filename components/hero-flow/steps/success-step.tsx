"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";
import { WhatsAppBubble, useStepEnter, staggerDelay } from "../atoms";

export function SuccessStep() {
  const t = useTranslations("hero.flow.steps.success");

  return (
    <div className="flex h-full flex-col justify-center gap-4 p-5">
      <motion.div
        {...useStepEnter()}
        className="flex items-center gap-2.5 rounded-xl border border-[var(--success)]/30 bg-[var(--success)]/10 px-4 py-3"
      >
        <CheckCircle2 className="size-5 shrink-0 text-[var(--success)]" aria-hidden="true" />
        <span className="text-sm font-semibold text-[var(--success)]">
          {t("message")}
        </span>
      </motion.div>

      <div className="max-w-[85%]">
        <WhatsAppBubble delay={staggerDelay(2)}>
          {t("customerConfirm")}
        </WhatsAppBubble>
      </div>

      <motion.p
        {...useStepEnter(staggerDelay(5))}
        className="text-sm font-medium tabular-nums text-[var(--text-secondary)]"
      >
        {t("metric")}
      </motion.p>
    </div>
  );
}
