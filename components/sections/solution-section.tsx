"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { MessagesSquare, PlugZap, CircleCheckBig } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";

const ICONS = [MessagesSquare, PlugZap, CircleCheckBig];

export function SolutionSection() {
  const t = useTranslations("solution");
  const steps = t.raw("steps") as { title: string; description: string }[];

  return (
    <Section id="solution" className="py-12 md:py-16 lg:py-20">
      <SectionHeading title={t("title")} subtitle={t("description")} />

      <ol className="relative grid gap-6 md:grid-cols-3 md:gap-8">
        {/* Connector through the step numbers, from the first column's
            center to the last one's. */}
        <span
          aria-hidden="true"
          className="absolute inset-x-[16.5%] top-7 hidden h-0.5 bg-[var(--accent)]/20 md:block"
        />
        {steps.map((step, i) => {
          const Icon = ICONS[i];
          return (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.45,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative flex flex-col items-center gap-4 text-center"
            >
              <span className="relative z-10 flex size-14 items-center justify-center rounded-full bg-[var(--accent)] text-xl font-bold text-[var(--accent-foreground)] tabular-nums shadow-md ring-8 ring-[var(--background)]">
                {i + 1}
              </span>
              <div className="flex flex-col items-center gap-2">
                <h3 className="flex items-center gap-2 text-xl font-bold text-[var(--text-primary)]">
                  <Icon
                    className="size-5 text-[var(--accent)]"
                    aria-hidden="true"
                  />
                  {step.title}
                </h3>
                <p className="max-w-xs text-base leading-relaxed text-[var(--text-secondary)]">
                  {step.description}
                </p>
              </div>
            </motion.li>
          );
        })}
      </ol>

      <p className="mx-auto mt-12 max-w-3xl text-center text-base text-[var(--text-secondary)]">
        {t("systemsLine")}
      </p>
    </Section>
  );
}
