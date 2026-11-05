"use client";

import { useLocale, useTranslations } from "next-intl";
import { Section, SectionHeading } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { CalculatorSlider } from "@/components/calculator/calculator-slider";
import { CalculatorResults } from "@/components/calculator/calculator-results";
import { useCalculator } from "@/components/calculator/calculator-context";
import { CALCULATOR_RANGES } from "@/lib/savings";
import { SAVINGS_RATE } from "@/config/site";
import { formatCurrency, formatNumber } from "@/lib/format";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { MessageCircle } from "lucide-react";

export function CalculatorSection() {
  const t = useTranslations("calculator");
  const locale = useLocale();
  const { input, setInput, result, requestPrefill } = useCalculator();

  const whatsappMessage = t("whatsappMessage", {
    employees: formatNumber(input.employees, locale),
    hours: formatNumber(input.hoursPerWeek, locale),
    savings: formatCurrency(result.yearlySavings, locale),
  });

  return (
    <Section id="calculator" surface>
      <SectionHeading title={t("title")} subtitle={t("subtitle")} />

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="flex flex-col justify-center gap-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 md:p-8">
          <CalculatorSlider
            label={t("sliders.employees.label")}
            value={input.employees}
            min={CALCULATOR_RANGES.employees.min}
            max={CALCULATOR_RANGES.employees.max}
            step={CALCULATOR_RANGES.employees.step}
            suffix={t("sliders.employees.unit")}
            ariaValueText={(v) => t("sliders.employees.valueText", { value: v })}
            onChange={(v) => setInput({ ...input, employees: v })}
          />
          <CalculatorSlider
            label={t("sliders.hoursPerWeek.label")}
            value={input.hoursPerWeek}
            min={CALCULATOR_RANGES.hoursPerWeek.min}
            max={CALCULATOR_RANGES.hoursPerWeek.max}
            step={CALCULATOR_RANGES.hoursPerWeek.step}
            suffix={t("sliders.hoursPerWeek.unit")}
            ariaValueText={(v) => t("sliders.hoursPerWeek.valueText", { value: v })}
            onChange={(v) => setInput({ ...input, hoursPerWeek: v })}
          />
          <CalculatorSlider
            label={t("sliders.hourlyCost.label")}
            value={input.hourlyCost}
            min={CALCULATOR_RANGES.hourlyCost.min}
            max={CALCULATOR_RANGES.hourlyCost.max}
            step={CALCULATOR_RANGES.hourlyCost.step}
            suffix={t("sliders.hourlyCost.unit")}
            ariaValueText={(v) => t("sliders.hourlyCost.valueText", { value: v })}
            onChange={(v) => setInput({ ...input, hourlyCost: v })}
          />
        </div>

        <CalculatorResults result={result} />
      </div>

      <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-relaxed text-[var(--text-secondary)]">
        {t("disclaimer", { rate: Math.round(SAVINGS_RATE * 100) })}
      </p>

      <div className="mx-auto mt-12 flex max-w-2xl flex-col items-center gap-4 text-center">
        <h3 className="text-xl font-semibold text-[var(--text-primary)]">{t("ctaTitle")}</h3>
        <p className="text-[var(--text-secondary)]">{t("ctaText")}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            onClick={() => {
              requestPrefill();
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {t("ctaPrimary")}
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <a href={buildWhatsAppLink(whatsappMessage)} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-4" aria-hidden="true" />
              {t("ctaWhatsapp")}
            </a>
          </Button>
        </div>
      </div>
    </Section>
  );
}
