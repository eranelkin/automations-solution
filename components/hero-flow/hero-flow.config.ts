/**
 * Single place to tune the Hero process-animation pacing. All durations in ms.
 */

export const HERO_FLOW_STEP_IDS = [
  "intake",
  "analysis",
  "extraction",
  "validation",
  "approval",
  "sync",
  "success",
] as const;

export type HeroFlowStepId = (typeof HERO_FLOW_STEP_IDS)[number];

export const HERO_FLOW_DURATIONS: Record<HeroFlowStepId, number> = {
  intake: 3500,
  analysis: 3500,
  extraction: 3500,
  validation: 3500,
  approval: 4000,
  sync: 3500,
  success: 4500,
};

/** Pause between the last step's end and the next cycle's first step. */
export const HERO_FLOW_CYCLE_GAP = 900;

/** Stagger between child elements entering within a single step. */
export const HERO_FLOW_STAGGER = 110;

export const HERO_FLOW_TOTAL_MS =
  Object.values(HERO_FLOW_DURATIONS).reduce((a, b) => a + b, 0) +
  HERO_FLOW_CYCLE_GAP;
