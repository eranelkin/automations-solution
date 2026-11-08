"use client";

import { motion, useReducedMotionConfig } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";
import { WhatsAppBubble, useStepEnter } from "../atoms";
import { HERO_FLOW_ANALYSIS } from "../hero-flow.config";
import { splitHighlights, type Highlight } from "./split-highlights";

const ease = [0.22, 1, 0.36, 1] as const;
const { scanStart, scanPassSeconds, scanRoundTrips, markStagger, markSeconds } = HERO_FLOW_ANALYSIS;

/** Markers start once the first downward sweep has finished. */
const firstMarkAt = scanStart + scanPassSeconds;

export function AnalysisStep({ staticMode = false }: { staticMode?: boolean }) {
  const t = useTranslations("hero.flow.steps.analysis");
  const intake = useTranslations("hero.flow.steps.intake");
  const locale = useLocale();
  const reduce = useReducedMotionConfig();
  const animated = !staticMode && !reduce;

  const highlights = t.raw("highlights") as Highlight[];
  const segments = splitHighlights(intake("message"), highlights);

  // Each entity chip appears together with the first marker of its kind,
  // so chips are listed in the order the AI "finds" them.
  const chipAt = new Map<string, number>();
  segments.forEach((seg) => {
    if (seg.entity && seg.markIndex !== undefined && !chipAt.has(seg.entity)) {
      chipAt.set(seg.entity, firstMarkAt + seg.markIndex * markStagger);
    }
  });

  // Marker swipes grow from the inline-start edge: physical right in RTL.
  const markOrigin = locale === "he" ? "right" : "left";

  // Sweep keyframes: top → bottom → top, repeated. The wrapper is the full
  // height of the bubble, so translateY(100%) lands the line on its bottom edge.
  const passes = scanRoundTrips * 2;
  const sweepY = Array.from({ length: passes + 1 }, (_, i) => (i % 2 === 0 ? "0%" : "100%"));

  return (
    <div className="flex h-full flex-col gap-4 p-5">
      <motion.div
        {...useStepEnter()}
        className="flex items-center gap-2 text-xs font-semibold text-[var(--accent)]"
      >
        <Sparkles className="size-4" aria-hidden="true" />
        {t("agentLabel")}
      </motion.div>

      <WhatsAppBubble sender={intake("sender")}>
        {segments.map((seg, i) =>
          seg.entity === undefined ? (
            <span key={i}>{seg.text}</span>
          ) : (
            <span key={i} className="relative inline-block">
              <motion.span
                aria-hidden="true"
                className="absolute -inset-x-0.5 inset-y-0.5 rounded-[3px] bg-[var(--accent-2)]/35"
                style={{ transformOrigin: markOrigin }}
                initial={animated ? { scaleX: 0, opacity: 0 } : false}
                animate={
                  animated
                    ? { scaleX: [0, 1, 1, 1], opacity: [1, 1, 1, 0] }
                    : { scaleX: 1, opacity: 1 }
                }
                transition={
                  animated
                    ? {
                        duration: markSeconds,
                        times: [0, 0.35, 0.7, 1],
                        ease: "easeOut",
                        delay: firstMarkAt + (seg.markIndex ?? 0) * markStagger,
                      }
                    : { duration: 0 }
                }
              />
              <span className="relative">{seg.text}</span>
            </span>
          ),
        )}
        {animated && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
          >
            <motion.span
              className="absolute inset-0"
              initial={{ y: "0%", opacity: 0 }}
              animate={{ y: sweepY, opacity: [0, 1, 1, 0] }}
              transition={{
                delay: scanStart,
                y: { duration: passes * scanPassSeconds, ease: "easeInOut" },
                opacity: { duration: passes * scanPassSeconds, times: [0, 0.03, 0.97, 1] },
              }}
            >
              <span className="absolute inset-x-0 top-0 h-8 -translate-y-1/2 bg-gradient-to-b from-transparent via-[var(--accent-2)]/25 to-transparent" />
              <span className="absolute inset-x-0 top-0 h-px bg-[var(--accent-2)] shadow-[0_0_10px_2px_var(--accent-2)]" />
            </motion.span>
          </span>
        )}
      </WhatsAppBubble>

      <div className="flex flex-wrap gap-2">
        {[...chipAt.entries()].map(([entity, at]) => (
          <motion.span
            key={entity}
            initial={animated ? { opacity: 0, y: 8, scale: 0.9 } : false}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={animated ? { duration: 0.4, ease, delay: at + 0.1 } : { duration: 0 }}
            className="rounded-full border border-[var(--accent-2)]/40 bg-[var(--accent-2)]/10 px-3 py-1 text-xs font-medium text-[var(--accent-2-text)]"
          >
            {entity}
          </motion.span>
        ))}
      </div>

    </div>
  );
}
