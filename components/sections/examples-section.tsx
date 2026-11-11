"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { FileText, Headset, PackageCheck, Receipt, Target, UserPlus } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { CtaBlock } from "@/components/ui/cta-block";
import { ExampleCard } from "./example-card";

const EXAMPLES = [
  ["orderIntake", PackageCheck],
  ["invoiceProcessing", Receipt],
  ["leadManagement", Target],
  ["customerService", Headset],
  ["quotes", FileText],
  ["clientOnboarding", UserPlus],
] as const;

export function ExamplesSection() {
  const t = useTranslations("examples");

  return (
    <Section id="examples" className="py-8 md:py-12 lg:py-16">
      <SectionHeading title={t("title")} subtitle={t("subtitle")} className="max-w-4xl" />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {EXAMPLES.map(([id, icon], i) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: (i % 3) * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="h-full"
          >
            <ExampleCard
              icon={icon}
              title={t(`items.${id}.title`)}
              problem={t(`items.${id}.problem`)}
              steps={t.raw(`items.${id}.steps`) as string[]}
              stepsLabel={t("stepsLabel")}
            />
          </motion.div>
        ))}
      </div>

      <div className="mx-auto mt-12 flex max-w-2xl flex-col items-center gap-5 text-center">
        <p className="text-lg font-semibold text-[var(--text-primary)]">{t("footerNote")}</p>
        <CtaBlock />
      </div>
    </Section>
  );
}
