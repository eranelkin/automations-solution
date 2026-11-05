"use client";

import { useTranslations } from "next-intl";
import { Workflow } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";

function MarqueeRow({ items, reverse }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div
      tabIndex={0}
      className="group overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
    >
      <div
        className={
          reverse
            ? "flex w-max gap-3 [animation-direction:reverse] animate-marquee rtl:[animation-direction:normal] group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
            : "flex w-max gap-3 animate-marquee rtl:[animation-direction:reverse] group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
        }
      >
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex shrink-0 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm font-medium text-[var(--text-primary)]"
          >
            <Workflow className="size-4 text-[var(--text-secondary)]" aria-hidden="true" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SystemsMarquee() {
  const t = useTranslations("systems");
  const items = t.raw("items") as string[];
  const half = Math.ceil(items.length / 2);
  const rowA = items.slice(0, half);
  const rowB = items.slice(half);

  return (
    <Section id="systems">
      <SectionHeading title={t("title")} />

      <div className="flex flex-col gap-3" aria-label={t("title")}>
        <MarqueeRow items={rowA} />
        <MarqueeRow items={rowB} reverse />
      </div>

      <p className="mx-auto mt-6 max-w-xl text-center text-sm text-[var(--text-secondary)]">
        {t("note")}
      </p>
      <p className="mx-auto mt-2 max-w-2xl text-center font-medium text-[var(--text-primary)]">
        {t("message")}
      </p>
    </Section>
  );
}
