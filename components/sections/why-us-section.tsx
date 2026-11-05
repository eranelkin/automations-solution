"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Puzzle, Target, Link2, Sparkles, ShieldCheck, Handshake } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const ITEMS = [
  { id: "custom", icon: Puzzle, big: true },
  { id: "integration", icon: Link2, big: true },
  { id: "businessFirst", icon: Target, big: false },
  { id: "smartAi", icon: Sparkles, big: false },
  { id: "humanControl", icon: ShieldCheck, big: false },
  { id: "support", icon: Handshake, big: false },
] as const;

function NodesVisual() {
  return (
    <svg viewBox="0 0 160 60" className="h-12 w-full max-w-[200px] overflow-visible" aria-hidden="true">
      {[20, 80, 140].map((x, i) => (
        <circle key={x} cx={x} cy={i === 1 ? 20 : 44} r="5" fill="var(--accent)" opacity={0.8} />
      ))}
      <path
        d="M20 44 L80 20 L140 44"
        stroke="var(--accent)"
        strokeWidth="1.5"
        strokeDasharray="3 4"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}

function LayersVisual() {
  return (
    <div className="relative h-12 w-full max-w-[160px]" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute h-10 w-28 rounded-lg border border-[var(--accent)]/30 bg-[var(--accent)]/5"
          style={{ insetInlineStart: i * 14, top: i * 4 }}
        />
      ))}
    </div>
  );
}

export function WhyUsSection() {
  const t = useTranslations("whyUs");

  return (
    <Section id="why-us" surface>
      <SectionHeading title={t("title")} />

      <div className="grid gap-4 lg:grid-cols-4">
        {ITEMS.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: (i % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className={cn(item.big && "lg:col-span-2")}
            >
              <Card
                spotlight={false}
                className={cn("flex h-full flex-col gap-3 p-6", item.big && "lg:p-8")}
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="font-semibold text-[var(--text-primary)]">
                  {t(`items.${item.id}.title`)}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                  {t(`items.${item.id}.description`)}
                </p>
                {item.big && (item.id === "custom" ? <LayersVisual /> : <NodesVisual />)}
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
