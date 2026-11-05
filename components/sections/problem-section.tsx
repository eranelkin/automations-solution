"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import {
  Copy,
  MessageSquareText,
  Receipt,
  UserX,
  FileEdit,
  MessagesSquare,
  Shuffle,
  AlarmClock,
} from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";

const ICONS = [
  Copy,
  MessageSquareText,
  Receipt,
  UserX,
  FileEdit,
  MessagesSquare,
  Shuffle,
  AlarmClock,
];

export function ProblemSection() {
  const t = useTranslations("problem");
  const items = t.raw("items") as string[];

  return (
    <Section id="problem">
      <SectionHeading title={t("title")} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => {
          const Icon = ICONS[i];
          return (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: (i % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <Card spotlight={false} className="flex h-full flex-col gap-3 p-5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--accent)]">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <p className="text-sm leading-relaxed text-[var(--text-primary)]">{item}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <p className="mx-auto mt-10 max-w-2xl text-center text-lg font-medium text-[var(--text-primary)]">
        {t("summary")}
      </p>
    </Section>
  );
}
