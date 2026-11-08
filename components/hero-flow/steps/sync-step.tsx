"use client";

import { motion, useReducedMotionConfig } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { Check, ClipboardCheck, Database, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useStepEnter } from "../atoms";
import { HERO_FLOW_SYNC } from "../hero-flow.config";

const ease = [0.22, 1, 0.36, 1] as const;
const { firstRowAt, rowStagger, flightSeconds } = HERO_FLOW_SYNC;

/**
 * Approximate travel from the order card down into each system's table, in
 * the window's unzoomed pixels. The rows only need to visibly "leave" the
 * order card, so a fixed offset works for both the desktop and mobile frames.
 */
const FLIGHT_X = 130;
const FLIGHT_Y = -110;

export function SyncStep({ staticMode = false }: { staticMode?: boolean }) {
  const t = useTranslations("hero.flow.steps.sync");
  const isRtl = useLocale() === "he";
  const reduce = useReducedMotionConfig();
  const animated = !staticMode && !reduce;

  const erpRows = t.raw("erpRows") as string[];
  const crmRows = t.raw("crmRows") as string[];

  // Rows alternate between the systems so data visibly streams to both.
  const order: Array<["erp" | "crm", number]> = [];
  for (let i = 0; i < Math.max(erpRows.length, crmRows.length); i++) {
    if (i < erpRows.length) order.push(["erp", i]);
    if (i < crmRows.length) order.push(["crm", i]);
  }
  const rowAt = (system: "erp" | "crm", i: number) =>
    firstRowAt + order.findIndex(([s, n]) => s === system && n === i) * rowStagger;
  const doneAt = (system: "erp" | "crm", count: number) =>
    rowAt(system, count - 1) + flightSeconds;

  // The ERP panel is first in the row: physical right in RTL, so its rows
  // fly in from the left (toward the centered order card), and vice versa.
  const towardCenter = (system: "erp" | "crm") =>
    (system === "erp") === isRtl ? -FLIGHT_X : FLIGHT_X;

  return (
    <div className="flex h-full flex-col items-center justify-center p-5">
      <motion.div
        {...useStepEnter()}
        className="relative z-10 flex items-center gap-2 rounded-xl border border-[var(--success)]/40 bg-[var(--success)]/10 px-3 py-2 text-xs font-semibold text-[var(--success)]"
      >
        <ClipboardCheck className="size-4" aria-hidden="true" />
        {t("source")}
      </motion.div>

      <Connectors animated={animated} />

      <div className="flex w-full gap-3">
        {(
          [
            ["erp", Database, erpRows],
            ["crm", Users, crmRows],
          ] as const
        ).map(([system, Icon, rows], panelIndex) => (
          <SystemPanel
            key={system}
            name={t(system)}
            caption={t(`${system}Caption`)}
            updated={t("updated")}
            icon={Icon}
            rows={rows}
            enterDelay={0.15 + panelIndex * 0.1}
            rowAt={(i) => rowAt(system, i)}
            doneAt={doneAt(system, rows.length)}
            flightX={towardCenter(system)}
            animated={animated}
          />
        ))}
      </div>
    </div>
  );
}

/** Two dashed curves from the order card to the panels, with flowing dashes. */
function Connectors({ animated }: { animated: boolean }) {
  return (
    <svg
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      className="h-9 w-full overflow-visible"
      aria-hidden="true"
    >
      {["M50 0 C 50 22, 25 18, 25 40", "M50 0 C 50 22, 75 18, 75 40"].map((d, i) => (
        <motion.path
          key={d}
          d={d}
          fill="none"
          stroke={i === 0 ? "var(--accent-2)" : "var(--accent)"}
          strokeWidth="1.5"
          strokeDasharray="4 4"
          vectorEffect="non-scaling-stroke"
          // Fade in rather than pathLength-draw: Motion's pathLength
          // rewrites stroke-dasharray, which would break the dash pattern.
          initial={animated ? { opacity: 0 } : false}
          animate={animated ? { opacity: 0.8, strokeDashoffset: [0, -32] } : { opacity: 0.8 }}
          transition={
            animated
              ? {
                  opacity: { duration: 0.4, delay: 0.3 },
                  strokeDashoffset: { duration: 1, repeat: Infinity, ease: "linear" },
                }
              : { duration: 0 }
          }
        />
      ))}
    </svg>
  );
}

function SystemPanel({
  name,
  caption,
  updated,
  icon: Icon,
  rows,
  enterDelay,
  rowAt,
  doneAt,
  flightX,
  animated,
}: {
  name: string;
  caption: string;
  updated: string;
  icon: LucideIcon;
  rows: readonly string[];
  enterDelay: number;
  rowAt: (i: number) => number;
  doneAt: number;
  flightX: number;
  animated: boolean;
}) {
  return (
    <motion.div
      {...useStepEnter(enterDelay)}
      className="relative min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--background)] p-3"
    >
      {/* Success ring that flashes once the last row has landed. */}
      {animated && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-xl border border-[var(--success)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.35] }}
          transition={{ duration: 0.9, delay: doneAt, times: [0, 0.3, 1] }}
        />
      )}

      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-[var(--surface)] text-[var(--text-secondary)]">
            <Icon className="size-3.5" aria-hidden="true" />
          </span>
          <div className="min-w-0 leading-tight">
            <p className="text-xs font-semibold text-[var(--text-primary)]">{name}</p>
            <p className="truncate text-[10px] text-[var(--text-secondary)]">{caption}</p>
          </div>
        </div>
        <motion.span
          initial={animated ? { opacity: 0, scale: 0.6 } : false}
          animate={{ opacity: 1, scale: 1 }}
          transition={animated ? { duration: 0.35, delay: doneAt, ease } : { duration: 0 }}
          className="flex shrink-0 items-center gap-1 rounded-full bg-[var(--success)]/15 px-2 py-0.5 text-[10px] font-semibold text-[var(--success)]"
        >
          <Check className="size-3" strokeWidth={3} aria-hidden="true" />
          {updated}
        </motion.span>
      </div>

      <div className="mt-2.5 flex flex-col gap-1.5">
        {/* An existing record, so the new rows read as added to real data. */}
        <div className="flex h-6 items-center gap-2 rounded-md bg-[var(--surface)] px-2" aria-hidden="true">
          <span className="h-1.5 w-1/3 rounded-full bg-[var(--text-secondary)]/25" />
          <span className="h-1.5 w-1/4 rounded-full bg-[var(--text-secondary)]/15" />
        </div>

        {rows.map((row, i) => (
          <motion.div
            key={row}
            initial={animated ? { x: flightX, y: FLIGHT_Y - i * 30, scale: 0.7, opacity: 0 } : false}
            animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            transition={animated ? { duration: flightSeconds, delay: rowAt(i), ease } : { duration: 0 }}
            className="relative flex h-6 items-center gap-1.5 overflow-hidden rounded-md border border-[var(--accent-2)]/30 bg-[var(--card)] px-2 text-[11px] font-medium text-[var(--text-primary)]"
          >
            {/* "Just written" flash once the block lands. */}
            {animated && (
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 bg-[var(--accent-2)]/25"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 1, delay: rowAt(i) + flightSeconds }}
              />
            )}
            <span className="relative size-1.5 shrink-0 rounded-full bg-[var(--accent-2)]" aria-hidden="true" />
            <span className="relative truncate">{row}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
