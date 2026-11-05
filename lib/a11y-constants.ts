export const A11Y_STORAGE_KEY = "flowpilot-a11y-prefs";

export type FontSizeLevel = "normal" | "large" | "larger";

export interface A11yPrefs {
  fontSize: FontSizeLevel;
  highContrast: boolean;
  stopAnimations: boolean;
  underlineLinks: boolean;
  readableSpacing: boolean;
}

export const A11Y_DEFAULTS: A11yPrefs = {
  fontSize: "normal",
  highContrast: false,
  stopAnimations: false,
  underlineLinks: false,
  readableSpacing: false,
};

export function applyA11yPrefs(prefs: A11yPrefs) {
  const html = document.documentElement;

  if (prefs.fontSize === "normal") {
    html.removeAttribute("data-a11y-font-size");
  } else {
    html.setAttribute("data-a11y-font-size", prefs.fontSize);
  }

  if (prefs.highContrast) {
    html.setAttribute("data-a11y-contrast", "high");
  } else {
    html.removeAttribute("data-a11y-contrast");
  }

  if (prefs.stopAnimations) {
    html.setAttribute("data-a11y-motion", "reduce");
  } else {
    html.removeAttribute("data-a11y-motion");
  }

  if (prefs.underlineLinks) {
    html.setAttribute("data-a11y-links", "underline");
  } else {
    html.removeAttribute("data-a11y-links");
  }

  if (prefs.readableSpacing) {
    html.setAttribute("data-a11y-spacing", "relaxed");
  } else {
    html.removeAttribute("data-a11y-spacing");
  }
}
