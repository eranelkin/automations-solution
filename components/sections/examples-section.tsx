"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import { Section, SectionHeading } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { ExampleCard } from "./example-card";
import { cn } from "@/lib/utils";

const EXAMPLE_IDS = [
  "orderIntake",
  "invoiceProcessing",
  "supplierOrders",
  "leadManagement",
  "clientOnboarding",
  "customerService",
  "quotes",
  "procurement",
] as const;

const INDUSTRY_IDS = ["all", "factories", "retail", "insurance", "legal"] as const;

export function ExamplesSection() {
  const t = useTranslations("examples");
  const [industry, setIndustry] = useState<(typeof INDUSTRY_IDS)[number]>("all");

  const examples = useMemo(
    () =>
      EXAMPLE_IDS.map((id) => ({
        id,
        title: t(`items.${id}.title`),
        problem: t(`items.${id}.problem`),
        steps: t.raw(`items.${id}.steps`) as string[],
        industries: t.raw(`items.${id}.industries`) as string[],
      })),
    [t],
  );

  const filtered = examples.filter(
    (ex) => industry === "all" || ex.industries.includes(industry),
  );

  return (
    <Section id="examples">
      <SectionHeading title={t("title")} subtitle={t("subtitle")} />

      <div
        role="group"
        aria-label={t("title")}
        className="mb-10 flex flex-wrap justify-center gap-2"
      >
        {INDUSTRY_IDS.map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={industry === id}
            onClick={() => setIndustry(id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200",
              industry === id
                ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)]"
                : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface)]",
            )}
          >
            {t(`industries.${id}`)}
          </button>
        ))}
      </div>

      <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatePresence initial={false} mode="popLayout">
          {filtered.map((ex) => (
            <motion.div
              key={ex.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <ExampleCard
                title={ex.title}
                problem={ex.problem}
                steps={ex.steps}
                showMoreLabel={t("showMore")}
                showLessLabel={t("showLess")}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <div className="mx-auto mt-12 flex max-w-2xl flex-col items-center gap-5 text-center">
        <p className="text-[var(--text-secondary)]">{t("footerNote")}</p>
        <Button size="lg" asChild>
          <a href="#contact">{t("cta")}</a>
        </Button>
      </div>
    </Section>
  );
}
