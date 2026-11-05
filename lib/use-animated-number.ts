"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "motion/react";
import { usePrefersReducedMotion } from "./use-reduced-motion";

export function useAnimatedNumber(target: number) {
  const [display, setDisplay] = useState(target);
  const prevRef = useRef(target);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      prevRef.current = target;
      return;
    }
    const controls = animate(prevRef.current, target, {
      type: "spring",
      stiffness: 120,
      damping: 22,
      onUpdate: setDisplay,
    });
    prevRef.current = target;
    return () => controls.stop();
  }, [target, reduced]);

  return reduced ? target : display;
}
