"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion as useOsReducedMotion } from "motion/react";

function readA11yAttr() {
  if (typeof document === "undefined") return false;
  return document.documentElement.getAttribute("data-a11y-motion") === "reduce";
}

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-a11y-motion"],
  });
  return () => observer.disconnect();
}

function getServerSnapshot() {
  return false;
}

/**
 * Combines the OS-level `prefers-reduced-motion` query (via Motion, which
 * resolves it safely across SSR/hydration) with the in-app "stop all
 * animations" accessibility-toolbar override, so every consumer only has to
 * check one boolean.
 */
export function usePrefersReducedMotion() {
  const osReduced = useOsReducedMotion();
  const a11yReduced = useSyncExternalStore(subscribe, readA11yAttr, getServerSnapshot);

  return Boolean(osReduced) || a11yReduced;
}
