"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import {
  Inbox,
  Sparkles,
  ListChecks,
  Link2,
  FileCheck2,
  Bell,
  ShieldAlert,
} from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";

const ICONS = [Inbox, Sparkles, ListChecks, Link2, FileCheck2, Bell, ShieldAlert];

export function SolutionSection() {
  const t = useTranslations("solution");
  const pipeline = t.raw("pipeline") as string[];

  return (
    <Section id="solution" className="pb-8 md:pb-12 lg:pb-16">
      <SectionHeading title={t("title")} subtitle={t("description")} />

      <ol className="relative grid gap-3 lg:grid-cols-7 lg:gap-4">
        {/* Timeline line through the step numbers, from the first column's
            center to the last one's (half a column ≈ 7% of the row). */}
        <span
          aria-hidden="true"
          className="absolute inset-x-[7%] top-4 hidden h-px bg-gradient-to-l from-[var(--accent)]/50 via-[var(--accent)]/25 to-[var(--accent)]/50 lg:block"
        />
        {pipeline.map((step, i) => {
          const Icon = ICONS[i];
          return (
            <motion.li
              key={step}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-3"
            >
              <span className="relative z-10 hidden size-8 items-center justify-center rounded-full border border-[var(--accent)]/40 bg-[var(--background)] text-xs font-semibold tabular-nums text-[var(--accent)] lg:flex">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex h-full w-full items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 transition-colors duration-200 hover:border-[var(--accent)]/40 lg:flex-col lg:justify-start lg:gap-4 lg:px-4 lg:py-6 lg:text-center">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <p className="text-sm leading-relaxed font-medium text-[var(--text-primary)]">
                  <span className="me-1.5 text-xs font-semibold tabular-nums text-[var(--accent)] lg:hidden">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {step}
                </p>
              </div>
            </motion.li>
          );
        })}
      </ol>

      <p className="mx-auto mt-10 max-w-2xl text-center text-lg font-medium text-[var(--accent)]">
        {t("emphasis")}
      </p>
    </Section>
  );
}
