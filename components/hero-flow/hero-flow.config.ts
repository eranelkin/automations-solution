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
  intake: 4500,
  analysis: 8000,
  extraction: 3500,
  validation: 3500,
  approval: 4000,
  sync: 5000,
  success: 4500,
};

/** How long the intake step shows the "typing..." bubble before the message. */
export const HERO_FLOW_INTAKE_TYPING_MS = 2100;

/** AI-analysis step timeline, in seconds (Motion delays/durations). */
export const HERO_FLOW_ANALYSIS = {
  /** When the scan line starts its first sweep. */
  scanStart: 0.4,
  /** One sweep, top → bottom or bottom → top. */
  scanPassSeconds: 1,
  /** Down + up = one round trip. */
  scanRoundTrips: 3,
  /** Gap between keyword markers; they start after the first downward sweep. */
  markStagger: 0.7,
  /** Each marker swipes in, holds, and fades out within this time. */
  markSeconds: 1,
};

/** System-sync step timeline, in seconds (Motion delays/durations). */
export const HERO_FLOW_SYNC = {
  /** When the first data block leaves the order card. */
  firstRowAt: 0.9,
  /** Gap between blocks; they alternate between ERP and CRM. */
  rowStagger: 0.4,
  /** One block's flight from the order card into its system. */
  flightSeconds: 0.6,
};

/** Pause between the last step's end and the next cycle's first step. */
export const HERO_FLOW_CYCLE_GAP = 900;

/** Stagger between child elements entering within a single step. */
export const HERO_FLOW_STAGGER = 110;

export const HERO_FLOW_TOTAL_MS =
  Object.values(HERO_FLOW_DURATIONS).reduce((a, b) => a + b, 0) +
  HERO_FLOW_CYCLE_GAP;
