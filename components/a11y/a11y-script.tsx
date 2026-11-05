import { A11Y_STORAGE_KEY } from "@/lib/a11y-constants";

/**
 * Applies saved accessibility preferences to <html> before paint, mirroring
 * next-themes' no-FOUC approach so a returning visitor never sees a flash
 * of un-adjusted content.
 */
export function A11yScript() {
  const script = `
    try {
      var prefs = JSON.parse(localStorage.getItem('${A11Y_STORAGE_KEY}') || '{}');
      var html = document.documentElement;
      if (prefs.fontSize && prefs.fontSize !== 'normal') html.setAttribute('data-a11y-font-size', prefs.fontSize);
      if (prefs.highContrast) html.setAttribute('data-a11y-contrast', 'high');
      if (prefs.stopAnimations) html.setAttribute('data-a11y-motion', 'reduce');
      if (prefs.underlineLinks) html.setAttribute('data-a11y-links', 'underline');
      if (prefs.readableSpacing) html.setAttribute('data-a11y-spacing', 'relaxed');
    } catch (e) {}
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
