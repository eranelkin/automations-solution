"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ExampleCard({
  title,
  problem,
  steps,
  showMoreLabel,
  showLessLabel,
}: {
  title: string;
  problem: string;
  steps: string[];
  showMoreLabel: string;
  showLessLabel: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Card spotlight={false} className="flex h-full flex-col gap-3 p-5">
      <h3 className="font-semibold text-[var(--text-primary)]">{title}</h3>
      <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{problem}</p>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mt-auto flex items-center gap-1.5 self-start text-sm font-medium text-[var(--accent)] rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--card)]"
      >
        {open ? showLessLabel : showMoreLabel}
        <ChevronDown
          className={cn("size-4 transition-transform duration-200", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <ol className="flex flex-col gap-1.5 border-t border-[var(--border)] pt-3 text-sm text-[var(--text-secondary)]">
              {steps.map((step, i) => (
                <li key={step} className="flex gap-2">
                  <span className="shrink-0 font-semibold text-[var(--accent)] tabular-nums">
                    {i + 1}.
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
