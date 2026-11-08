"use client";

import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { useAnimatedNumber } from "@/lib/use-animated-number";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { SavingsResult } from "@/lib/savings";
import { cn } from "@/lib/utils";

function AnimatedCurrency({ value, locale }: { value: number; locale: string }) {
  const animated = useAnimatedNumber(value);
  return <span className="tabular-nums">{formatCurrency(animated, locale)}</span>;
}

/** One row of the before/after horizontal bar chart: label, bar, amount. */
function ComparisonBar({
  label,
  value,
  pct,
  barClassName,
  locale,
}: {
  label: string;
  value: number;
  pct: number;
  barClassName: string;
  locale: string;
}) {
  return (
    <div className="grid grid-cols-[8.5rem_1fr_5.5rem] items-center gap-3">
      <span className="text-xs font-medium text-[var(--text-secondary)]">{label}</span>
      <div className="h-6 overflow-hidden rounded-e-md bg-[var(--surface)]">
        <motion.div
          className={cn("h-full rounded-e-[4px]", barClassName)}
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <span className="text-end text-sm font-semibold text-[var(--text-primary)]">
        <AnimatedCurrency value={value} locale={locale} />
      </span>
    </div>
  );
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
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl bg-[var(--surface)] p-4">
        <p className="text-xs font-medium text-[var(--text-secondary)]">{t("yearlySavings")}</p>
        <p className="mt-1.5 text-4xl leading-none font-bold tabular-nums text-[var(--accent)]">
          <AnimatedCurrency value={result.yearlySavings} locale={locale} />
        </p>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
          <span className="font-semibold text-[var(--text-primary)] tabular-nums">
            {formatNumber(result.hoursSavedPerMonth, locale)}
          </span>
          {t("hoursSaved")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-[var(--border)] p-3">
          <p className="text-xs leading-snug text-[var(--text-secondary)]">{t("currentMonthlyCost")}</p>
          <p className="mt-1 text-lg font-semibold tabular-nums text-[var(--text-primary)]">
            <AnimatedCurrency value={result.monthlyCost} locale={locale} />
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border)] p-3">
          <p className="text-xs leading-snug text-[var(--text-secondary)]">{t("monthlySavings")}</p>
          <p className="mt-1 text-lg font-semibold tabular-nums text-[var(--success)]">
            <AnimatedCurrency value={result.monthlySavings} locale={locale} />
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <ComparisonBar
          label={t("comparisonBefore")}
          value={result.monthlyCost}
          pct={beforePct}
          barClassName="bg-[var(--chart-before)]/60"
          locale={locale}
        />
        <ComparisonBar
          label={t("comparisonAfter")}
          value={result.monthlyCost - result.monthlySavings}
          pct={afterPct}
          barClassName="bg-[var(--chart-after)]/60"
          locale={locale}
        />
      </div>

      <p ref={announceRef} aria-live="polite" className="sr-only">
        {announceText}
      </p>
    </div>
  );
}
