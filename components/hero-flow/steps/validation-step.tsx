"use client";

import { useTranslations } from "next-intl";
import { CheckItem, staggerDelay } from "../atoms";

export function ValidationStep() {
  const t = useTranslations("hero.flow.steps.validation");
  const checks = t.raw("checks") as string[];

  return (
    <div className="flex h-full flex-col justify-center gap-1 p-5">
      {checks.map((check, i) => (
        <CheckItem key={check} label={check} delay={staggerDelay(i + 1)} />
      ))}
    </div>
  );
}
