export const COOKIE_CONSENT_KEY = "flowpilot-cookie-consent";
export type CookieConsent = "accepted" | "declined";

type Listener = () => void;
let listeners: Listener[] = [];
let cached: CookieConsent | null | undefined;

export function getStoredConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  if (cached !== undefined) return cached;
  const value = window.localStorage.getItem(COOKIE_CONSENT_KEY);
  cached = value === "accepted" || value === "declined" ? value : null;
  return cached;
}

export function setStoredConsent(value: CookieConsent) {
  window.localStorage.setItem(COOKIE_CONSENT_KEY, value);
  cached = value;
  listeners.forEach((listener) => listener());
}

export function subscribeConsent(listener: Listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}
