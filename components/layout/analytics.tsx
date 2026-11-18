"use client";

import Script from "next/script";
import { ANALYTICS_ENABLED, GTM_ID } from "@/config/site";
import { useCookieConsent } from "@/lib/use-cookie-consent";

/**
 * Google Tag (GTM container). Stays a no-op until both
 * NEXT_PUBLIC_ANALYTICS_ENABLED=true and the visitor has accepted cookies —
 * nothing is ever loaded before consent, per §13.
 */
export function Analytics() {
  const consent = useCookieConsent();
  const shouldLoad = ANALYTICS_ENABLED && consent === "accepted";

  if (!shouldLoad) return null;

  return (
    <>
      <Script
        id="google-tag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});`,
        }}
      />
      <Script
        id="google-tag"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`}
      />
    </>
  );
}
