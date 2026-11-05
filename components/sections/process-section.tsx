"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useTranslations } from "next-intl";
import { Search, Compass, Hammer, Rocket } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";

const STEP_IDS = ["discover", "design", "build", "launch"] as const;
const ICONS = [Search, Compass, Hammer, Rocket];

export function ProcessSection() {
  const t = useTranslations("process");
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.75", "end 0.4"],
  });
  const fill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <Section id="process" surface>
      <SectionHeading title={t("title")} subtitle={t("subtitle")} />

      <div ref={containerRef} className="relative mx-auto max-w-5xl">
        {/* desktop horizontal line */}
        <div className="absolute top-6 hidden h-0.5 w-full bg-[var(--border)] md:block">
          <motion.div
            className="absolute inset-y-0 start-0 h-full bg-[var(--accent)]"
            style={{ width: fill }}
          />
        </div>
        {/* mobile vertical line */}
        <div className="absolute bottom-0 top-6 start-6 block w-0.5 bg-[var(--border)] md:hidden">
          <motion.div
            className="absolute inset-x-0 top-0 w-full bg-[var(--accent)]"
            style={{ height: fill }}
          />
        </div>

        <div className="relative grid gap-10 md:grid-cols-4 md:gap-6">
          {STEP_IDS.map((id, i) => {
            const Icon = ICONS[i];
            return (
              <div key={id} className="relative flex gap-4 ps-16 md:flex-col md:items-start md:gap-0 md:ps-0">
                <span className="absolute start-0 top-0 flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-[var(--accent)] bg-[var(--background)] text-[var(--accent)] md:static md:mb-5">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold tabular-nums text-[var(--accent)]">
                    0{i + 1}
                  </p>
                  <h3 className="mt-1 font-semibold text-[var(--text-primary)]">
                    {t(`steps.${id}.title`)}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {t(`steps.${id}.description`)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
