"use client";

import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { useAnimatedNumber } from "@/lib/use-animated-number";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { SavingsResult } from "@/lib/savings";

function AnimatedCurrency({ value, locale }: { value: number; locale: string }) {
  const animated = useAnimatedNumber(value);
  return <span className="tabular-nums">{formatCurrency(animated, locale)}</span>;
}

export function CalculatorResults({ result }: { result: SavingsResult }) {
  const t = useTranslations("calculator.results");
  const locale = useLocale();

  const beforePct = 100;
  const afterPct = result.monthlyCost > 0
    ? Math.max(((result.monthlyCost - result.monthlySavings) / result.monthlyCost) * 100, 4)
    : 0;

  const announceRef = useRef<HTMLParagraphElement>(null);
  const [announceText, setAnnounceText] = useState("");

  useEffect(() => {
    const id = setTimeout(() => {
      setAnnounceText(
        t("liveAnnouncement", { amount: formatCurrency(result.yearlySavings, locale) }),
      );
    }, 500);
    return () => clearTimeout(id);
  }, [result.yearlySavings, locale, t]);

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 md:p-8">
      <div>
        <p className="text-sm text-[var(--text-secondary)]">{t("currentMonthlyCost")}</p>
        <p className="mt-1 text-xl font-semibold tabular-nums text-[var(--text-primary)]">
          <AnimatedCurrency value={result.monthlyCost} locale={locale} />
        </p>
      </div>

      <div>
        <p className="text-sm text-[var(--text-secondary)]">{t("monthlySavings")}</p>
        <p className="mt-1 text-2xl font-semibold tabular-nums text-[var(--success)]">
          <AnimatedCurrency value={result.monthlySavings} locale={locale} />
        </p>
      </div>

      <div className="rounded-2xl bg-[var(--surface)] p-5">
        <p className="text-sm font-medium text-[var(--text-secondary)]">{t("yearlySavings")}</p>
        <p className="mt-2 text-[clamp(2rem,1.5rem+2vw,3.5rem)] leading-none font-bold tabular-nums text-[var(--accent)]">
          <AnimatedCurrency value={result.yearlySavings} locale={locale} />
        </p>
      </div>

      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <span className="font-semibold text-[var(--text-primary)] tabular-nums">
          {formatNumber(result.hoursSavedPerMonth, locale)}
        </span>
        {t("hoursSaved")}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
          <span>{t("comparisonBefore")}</span>
          <span>{t("comparisonAfter")}</span>
        </div>
        <div className="flex h-3 gap-1 overflow-hidden rounded-full bg-[var(--surface)]">
          <motion.div
            className="h-full rounded-full bg-[var(--text-secondary)]/40"
            initial={false}
            animate={{ width: `${beforePct}%` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <div className="flex h-3 gap-1 overflow-hidden rounded-full bg-[var(--surface)]">
          <motion.div
            className="h-full rounded-full bg-[var(--accent)]"
            initial={false}
            animate={{ width: `${afterPct}%` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      <p ref={announceRef} aria-live="polite" className="sr-only">
        {announceText}
      </p>
    </div>
  );
}
