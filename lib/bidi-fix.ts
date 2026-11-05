/**
 * Satori (the renderer behind next/og's ImageResponse) lays out text purely
 * left-to-right with no bidi algorithm, so Hebrew strings render mirrored.
 * The standard workaround: reverse the whole string (which correctly
 * visually orders pure-RTL text), then re-reverse any embedded Latin/digit
 * runs back to normal so terms like "AI" or "FlowPilot" read correctly.
 */
export function fixRtlForSatori(text: string): string {
  const reversed = [...text].reverse().join("");
  return reversed.replace(
    /[A-Za-z0-9][A-Za-z0-9 .,'&-]*[A-Za-z0-9]|[A-Za-z0-9]/g,
    (run) => [...run].reverse().join(""),
  );
}
