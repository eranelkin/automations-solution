"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  HERO_FLOW_CYCLE_GAP,
  HERO_FLOW_DURATIONS,
  HERO_FLOW_STEP_IDS,
  type HeroFlowStepId,
} from "./hero-flow.config";

export function useHeroFlow(disabled = false) {
  const stepIds = HERO_FLOW_STEP_IDS;
  const durations = HERO_FLOW_DURATIONS;

  const [index, setIndex] = useState(0);
  const [userPlaying, setUserPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const [inView, setInView] = useState(true);

  const remainingRef = useRef<number>(durations[stepIds[0]]);
  const startRef = useRef<number>(0);
  const skipDecrementRef = useRef(false);

  const effectivePlaying =
    !disabled && userPlaying && !hovered && !tabHidden && inView;

  const jumpTo = useCallback(
    (i: number) => {
      const next = ((i % stepIds.length) + stepIds.length) % stepIds.length;
      skipDecrementRef.current = true;
      remainingRef.current = durations[stepIds[next]];
      setUserPlaying(false);
      setIndex(next);
    },
    [stepIds, durations],
  );

  const play = useCallback(() => setUserPlaying(true), []);
  const pause = useCallback(() => setUserPlaying(false), []);
  const toggle = useCallback(() => setUserPlaying((p) => !p), []);

  useEffect(() => {
    if (!effectivePlaying) return;

    startRef.current = Date.now();
    const isLastStep = index === stepIds.length - 1;
    const delay =
      Math.max(remainingRef.current, 1) + (isLastStep ? HERO_FLOW_CYCLE_GAP : 0);

    const timeoutId = setTimeout(() => {
      skipDecrementRef.current = true;
      const next = (index + 1) % stepIds.length;
      remainingRef.current = durations[stepIds[next]];
      setIndex(next);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (skipDecrementRef.current) {
        skipDecrementRef.current = false;
      } else {
        remainingRef.current = Math.max(
          remainingRef.current - (Date.now() - startRef.current),
          0,
        );
      }
    };
  }, [index, effectivePlaying, stepIds, durations]);

  return {
    index,
    currentStepId: stepIds[index] as HeroFlowStepId,
    stepIds,
    playing: userPlaying,
    effectivePlaying,
    play,
    pause,
    toggle,
    jumpTo,
    setHovered,
    setTabHidden,
    setInView,
  };
}
