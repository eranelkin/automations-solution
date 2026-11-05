"use client";

import { Fragment } from "react";
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
  ChevronDown,
} from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";

const ICONS = [Inbox, Sparkles, ListChecks, Link2, FileCheck2, Bell, ShieldAlert];

export function SolutionSection() {
  const t = useTranslations("solution");
  const pipeline = t.raw("pipeline") as string[];

  return (
    <Section id="solution" surface>
      <SectionHeading title={t("title")} subtitle={t("description")} />

      <div className="flex flex-col items-stretch gap-2 lg:flex-row lg:flex-wrap lg:justify-center lg:gap-0">
        {pipeline.map((step, i) => {
          const Icon = ICONS[i];
          const isLast = i === pipeline.length - 1;
          return (
            <Fragment key={step}>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                <Card spotlight={false} className="flex w-full flex-col gap-2 p-4 lg:w-[150px]">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-[var(--accent)]/10 text-[var(--accent)]">
                    <Icon className="size-4.5" aria-hidden="true" />
                  </span>
                  <p className="text-xs leading-snug font-medium text-[var(--text-primary)]">
                    {step}
                  </p>
                </Card>
              </motion.div>
              {!isLast && (
                <div
                  aria-hidden="true"
                  className="flex items-center justify-center text-[var(--border)] lg:w-6"
                >
                  <ChevronDown className="size-4 lg:-rotate-90 rtl:lg:rotate-90" />
                </div>
              )}
            </Fragment>
          );
        })}
      </div>

      <p className="mx-auto mt-10 max-w-2xl text-center text-lg font-medium text-[var(--accent)]">
        {t("emphasis")}
      </p>
    </Section>
  );
}
