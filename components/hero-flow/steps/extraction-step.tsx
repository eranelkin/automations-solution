"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { FieldRow, useStepEnter, staggerDelay } from "../atoms";

const FIELD_KEYS = ["customer", "products", "quantity", "address", "date"] as const;

export function ExtractionStep() {
  const t = useTranslations("hero.flow.steps.extraction");

  return (
    <div className="flex h-full flex-col gap-3 p-5">
      <motion.p
        {...useStepEnter()}
        className="text-xs font-semibold text-[var(--text-secondary)]"
      >
        {t("cardTitle")}
      </motion.p>
      <div className="flex flex-col gap-2">
        {FIELD_KEYS.map((key, i) => (
          <FieldRow
            key={key}
            label={t(`fields.${key}.label`)}
            value={t(`fields.${key}.value`)}
            delay={staggerDelay(i + 1)}
          />
        ))}
      </div>
    </div>
  );
}
