"use client";

import { useEffect } from "react";
import { ANALYTICS_ENABLED } from "@/config/site";
import { useCookieConsent } from "@/lib/use-cookie-consent";

/**
 * Hook point for a future analytics provider. Stays a no-op until both
 * NEXT_PUBLIC_ANALYTICS_ENABLED=true and the visitor has accepted cookies —
 * nothing is ever loaded before consent, per §13.
 */
export function Analytics() {
  const consent = useCookieConsent();
  const shouldLoad = ANALYTICS_ENABLED && consent === "accepted";

  useEffect(() => {
    if (!shouldLoad) return;
    // [להשלמה: אתחול ספק האנליטיקס בפועל, למשל GA4 / Plausible / PostHog]
  }, [shouldLoad]);

  return null;
}
