"use client";

import { useSyncExternalStore } from "react";
import { getStoredConsent, subscribeConsent, type CookieConsent } from "./cookie-consent";

function getServerSnapshot() {
  return null;
}

export function useCookieConsent(): CookieConsent | null {
  return useSyncExternalStore(subscribeConsent, getStoredConsent, getServerSnapshot);
}
