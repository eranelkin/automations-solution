"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { Section } from "@/components/ui/section";

const FAQ_IDS = [
  "howMuch",
  "howLong",
  "technicalKnowledge",
  "replaceSystems",
  "aiMistakes",
] as const;

export function FaqSection() {
  const t = useTranslations("faq");

  return (
    <Section id="faq" className="py-12 md:py-16 lg:py-20">
      <h2 className="mb-10 text-center text-h2 font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
        {t("title")}
      </h2>

      <Accordion.Root type="single" collapsible className="mx-auto flex max-w-3xl flex-col gap-3">
        {FAQ_IDS.map((id) => (
          <Accordion.Item
            key={id}
            value={id}
            className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]"
          >
            <Accordion.Header>
              <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-start text-base font-semibold text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] md:text-lg">
                {t(`items.${id}.question`)}
                <ChevronDown
                  className="size-4 shrink-0 text-[var(--text-secondary)] transition-transform duration-200 group-data-[state=open]:rotate-180"
                  aria-hidden="true"
                />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden text-base leading-relaxed text-[var(--text-secondary)] data-[state=open]:animate-[accordion-down_0.25s_ease-out] data-[state=closed]:animate-[accordion-up_0.25s_ease-out]">
              <p className="px-5 pb-5">{t(`items.${id}.answer`)}</p>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </Section>
  );
}
