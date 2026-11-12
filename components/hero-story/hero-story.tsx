"use client";

import { Fragment, useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import {
  CheckCheck,
  Database,
  FileSpreadsheet,
  Mail,
  MessageCircle,
  MonitorCheck,
  MousePointerClick,
  ScanText,
  type LucideIcon,
} from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Per-step look. The desktop placement is deliberately irregular (no
 * repeating rhythm in height, nudge, tilt or shape) so the strip reads like a
 * hand-laid comic rather than a timeline. `icons` with several entries shows
 * a cluster (step 1: messages can come from anywhere).
 */
const STEPS: {
  icons: LucideIcon[];
  hl: number;
  tilt: number;
  place: string;
  zigzag: string;
  radius: string;
}[] = [
  {
    icons: [MessageCircle, Mail, FileSpreadsheet, Database],
    hl: 2,
    tilt: -3.5,
    place: "lg:mt-24 lg:start-0",
    zigzag: "self-start",
    radius: "56px 72px 60px 80px / 64px 52px 76px 58px",
  },
  {
    icons: [ScanText],
    hl: 6,
    tilt: 2,
    place: "lg:mt-0 lg:start-[-8px]",
    zigzag: "self-end",
    radius: "76px 54px 82px 60px / 58px 72px 54px 70px",
  },
  {
    icons: [MousePointerClick],
    hl: 4,
    tilt: -1,
    place: "lg:mt-56 lg:start-[8px]",
    zigzag: "self-center",
    radius: "62px 84px 58px 70px / 74px 60px 68px 56px",
  },
  {
    icons: [MonitorCheck],
    hl: 5,
    tilt: 4,
    place: "lg:mt-12 lg:start-[-12px]",
    zigzag: "self-start",
    radius: "80px 60px 72px 54px / 56px 76px 60px 74px",
  },
  {
    icons: [CheckCheck],
    hl: 1,
    tilt: -2.5,
    place: "lg:mt-44 lg:start-[6px]",
    zigzag: "self-end",
    radius: "58px 70px 86px 62px / 70px 58px 64px 80px",
  },
];

/**
 * Every desktop arrow is the same smooth swoop, under the line or over it
 * depending on whether the next bubble sits lower or higher. `bow` is used
 * for the stacked phone layout.
 */
const ARROWS: { style: "dip" | "arc"; bow: number }[] = [
  { style: "dip", bow: 34 },
  { style: "dip", bow: -26 },
  { style: "dip", bow: 40 },
  { style: "dip", bow: -20 },
];

type Box = { x: number; y: number; w: number; h: number };

/**
 * A curved arrow from one bubble to the next. Side by side (desktop wave) it
 * leaves the facing edge; stacked (phone zigzag) it leaves the bottom. Built
 * from measured layout boxes, so it follows RTL/LTR and every breakpoint.
 */
function arrowPath(a: Box, b: Box, { style, bow }: (typeof ARROWS)[number]) {
  const ax = a.x + a.w / 2;
  const bx = b.x + b.w / 2;
  const sideBySide = Math.abs(bx - ax) > (a.w + b.w) / 2;

  if (sideBySide) {
    const dir = Math.sign(bx - ax);
    // Facing edges: the arrow leaves one bubble and lands on the next.
    const startX = dir > 0 ? a.x + a.w + 6 : a.x - 6;
    const endX = dir > 0 ? b.x - 10 : b.x + b.w + 10;

    if (style === "dip") {
      // A smooth swoop with no corners. When the next bubble sits lower it
      // leaves the bottom, dips under and comes up into it; when it sits
      // higher the same curve is mirrored over the top.
      const sx = ax + dir * a.w * 0.22;
      if (b.y + b.h / 2 < a.y + a.h / 2) {
        const sy = a.y - 6;
        const y2 = b.y + b.h * 0.38;
        const high = Math.min(sy, y2) - 70;
        return `M ${sx} ${sy} C ${sx} ${high}, ${endX - dir * 46} ${high}, ${endX} ${y2}`;
      }
      const sy = a.y + a.h + 6;
      const y2 = b.y + b.h * 0.62;
      const low = Math.max(sy, y2) + 70;
      return `M ${sx} ${sy} C ${sx} ${low}, ${endX - dir * 46} ${low}, ${endX} ${y2}`;
    }

    const y1 = a.y + a.h * 0.35;
    const y2 = b.y + b.h * 0.35;
    const pull = Math.abs(endX - startX) * 0.5;
    return `M ${startX} ${y1} C ${startX + dir * pull} ${y1 - bow}, ${endX - dir * pull} ${y2 - bow}, ${endX} ${y2}`;
  }

  const x1 = ax + (bx - ax) * 0.15;
  const x2 = bx - (bx - ax) * 0.15;
  const y1 = a.y + a.h + 6;
  const y2 = b.y - 10;
  const pull = (y2 - y1) * 0.7;
  return `M ${x1} ${y1} C ${x1 + bow} ${y1 + pull}, ${x2 - bow} ${y2 - pull}, ${x2} ${y2}`;
}

/** First and last point of a path, for laying the color gradient along it. */
function endpoints(d: string) {
  const n = d.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [0, 0, 0, 0];
  return { x1: n[0], y1: n[1], x2: n[n.length - 2], y2: n[n.length - 1] };
}

export function HeroStory() {
  const t = useTranslations("hero.story");
  const steps = t.raw("steps") as { title: string; text: string }[];
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLOListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [paths, setPaths] = useState<string[]>([]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const measure = () => {
      // Layout offsets, not getBoundingClientRect: the tilt and the pop-in
      // scale are transforms and must not bend the arrows.
      const boxes = itemRefs.current.map((el) =>
        el
          ? {
              x: el.offsetLeft,
              y: el.offsetTop,
              w: el.offsetWidth,
              h: el.offsetHeight,
            }
          : { x: 0, y: 0, w: 0, h: 0 },
      );
      setSize({ w: root.offsetWidth, h: root.offsetHeight });
      setPaths(boxes.slice(1).map((b, i) => arrowPath(boxes[i], b, ARROWS[i])));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex w-full flex-col items-center lg:block">
      <ol
        ref={rootRef}
        aria-label={t("ariaLabel")}
        className="relative flex w-full max-w-md flex-col gap-16 lg:mx-[calc((100%-min(86rem,calc(100vw-4rem)))/2)] lg:grid lg:w-[min(86rem,calc(100vw-4rem))] lg:max-w-none lg:grid-cols-5 lg:items-start lg:gap-x-16 lg:gap-y-0 lg:pt-8 lg:pb-14"
      >
        <svg
          aria-hidden="true"
          width={size.w}
          height={size.h}
          viewBox={`0 0 ${size.w || 1} ${size.h || 1}`}
          className="pointer-events-none absolute inset-0 overflow-visible"
        >
          <defs>
            {paths.map((d, i) => {
              // Each arrow fades from the color of the bubble it leaves to
              // the color of the bubble it points at; the head takes the
              // target's color.
              const from = `var(--hl-${STEPS[i].hl}-text)`;
              const to = `var(--hl-${STEPS[i + 1].hl}-text)`;
              return (
                <Fragment key={i}>
                  <linearGradient
                    id={`hero-story-line-${i}`}
                    gradientUnits="userSpaceOnUse"
                    {...endpoints(d)}
                  >
                    <stop offset="0" stopColor={from} />
                    <stop offset="1" stopColor={to} />
                  </linearGradient>
                  <marker
                    id={`hero-story-head-${i}`}
                    viewBox="0 0 10 10"
                    refX="6"
                    refY="5"
                    markerWidth="5"
                    markerHeight="5"
                    orient="auto-start-reverse"
                  >
                    <path
                      d="M 0 1 L 8 5 L 0 9"
                      fill="none"
                      stroke={to}
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </marker>
                </Fragment>
              );
            })}
          </defs>
          {paths.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              fill="none"
              stroke={`url(#hero-story-line-${i})`}
              strokeWidth="2.75"
              strokeLinecap="round"
              strokeDasharray="8 8"
              markerEnd={`url(#hero-story-head-${i})`}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{
                duration: 0.4,
                delay: reduced ? 0 : 0.35 + i * 0.18 + 0.2,
                ease,
              }}
            />
          ))}
        </svg>

        {steps.map((step, i) => {
          const { icons, hl, tilt, place, zigzag, radius } = STEPS[i];
          const color = `var(--hl-${hl})`;
          return (
            <li
              key={step.title}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className={cn(
                "relative w-[86%] lg:w-auto lg:self-auto",
                zigzag,
                place,
              )}
            >
              <motion.div
                initial={reduced ? false : { opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.45,
                  delay: reduced ? 0 : 0.35 + i * 0.18,
                  ease,
                }}
                style={{ rotate: tilt }}
              >
                <div
                  className="relative flex flex-col items-center gap-3 border-2 px-7 pt-10 pb-9 text-center shadow-[0_14px_36px_-20px_rgba(15,23,42,0.4)] transition-transform duration-200 hover:-translate-y-1"
                  style={{
                    borderRadius: radius,
                    background: `color-mix(in srgb, ${color} var(--story-tint), var(--card))`,
                    borderColor: `color-mix(in srgb, ${color} 70%, var(--border))`,
                  }}
                >
                  <span className="absolute start-8 -top-4 flex size-9 items-center justify-center rounded-full bg-[var(--text-primary)] text-sm font-bold text-[var(--background)] tabular-nums shadow-md">
                    {i + 1}
                  </span>
                  <span className="flex items-center justify-center -space-x-2 rtl:space-x-reverse">
                    {icons.map((Icon, k) => (
                      <span
                        key={k}
                        className={cn(
                          "flex items-center justify-center rounded-full ring-2 ring-[var(--card)]",
                          icons.length > 1 ? "size-11" : "size-14",
                        )}
                        style={{
                          background: `color-mix(in srgb, ${color} 45%, var(--card))`,
                          color: `var(--hl-${hl}-text)`,
                        }}
                      >
                        <Icon
                          className={icons.length > 1 ? "size-5" : "size-7"}
                          strokeWidth={2.25}
                          aria-hidden="true"
                        />
                      </span>
                    ))}
                  </span>
                  <h3 className="text-xl leading-snug font-bold text-balance text-[var(--text-primary)]">
                    {step.title}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-[var(--text-secondary)]">
                    {step.text}
                  </p>
                </div>
              </motion.div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
