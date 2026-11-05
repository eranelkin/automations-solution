"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import {
  ShieldCheck,
  SlidersHorizontal,
  Lock,
  FileCheck2,
  KeyRound,
  FileSignature,
  Gauge,
  Scale,
} from "lucide-react";
import { Section } from "@/components/ui/section";

const ICONS = [
  ShieldCheck,
  SlidersHorizontal,
  KeyRound,
  FileCheck2,
  Lock,
  FileSignature,
  Gauge,
  Scale,
];

const ITEM_IDS = [
  "noChanges",
  "yourRules",
  "minimalAccess",
  "transparency",
  "encryption",
  "confidentiality",
  "sensitiveControl",
  "compliance",
] as const;

export function CommitmentSection() {
  const t = useTranslations("commitment");

  return (
    <Section id="commitment">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-5xl overflow-hidden rounded-[28px] border-2 border-[var(--accent)]/25 bg-[var(--card)] p-8 md:p-12"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, var(--accent) 0, var(--accent) 1px, transparent 1px, transparent 14px)",
          }}
        />

        <div className="relative flex flex-col items-center text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
            <ShieldCheck className="size-8" aria-hidden="true" />
          </span>
          <h2 className="mt-6 text-[var(--text-h2)] font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
            {t("title")}
          </h2>
        </div>

        <div className="relative mt-10 grid gap-5 sm:grid-cols-2">
          {ITEM_IDS.map((id, i) => {
            const Icon = ICONS[i];
            return (
              <div key={id} className="flex gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--card)] text-[var(--accent)]">
                  <Icon className="size-4.5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                    {t(`items.${id}.title`)}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {t(`items.${id}.description`)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </Section>
  );
}
