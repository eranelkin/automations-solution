"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Check, Clock, ShieldCheck, Target } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";

const BENEFITS = [
  ["time", Clock],
  ["accuracy", Target],
  ["control", ShieldCheck],
] as const;

export function BenefitsSection() {
  const t = useTranslations("benefits");
  const familiar = t.raw("familiar") as string[];

  return (
    <Section id="benefits" className="py-12 md:py-16 lg:py-20">
      <SectionHeading title={t("title")} />

      <div className="grid gap-5 md:grid-cols-3">
        {BENEFITS.map(([id, Icon], i) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.45,
              delay: i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-sm"
          >
            <span className="flex size-14 items-center justify-center rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)]">
              <Icon className="size-7" aria-hidden="true" />
            </span>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">
              {t(`items.${id}.title`)}
            </h3>
            <p className="text-base leading-relaxed text-[var(--text-secondary)]">
              {t(`items.${id}.description`)}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-4xl rounded-2xl bg-[var(--surface)] p-6 md:p-8">
        <h3 className="text-center text-lg font-bold text-[var(--text-primary)]">
          {t("familiarTitle")}
        </h3>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {familiar.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 text-base text-[var(--text-primary)]"
            >
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--cta)]/15 text-[var(--cta)]">
                <Check
                  className="size-4"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
