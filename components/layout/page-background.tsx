/**
 * The subtle grid-line texture, fixed behind the whole page (not just the
 * Hero) so it stays visible while scrolling through every section — sections
 * render with a transparent root and only their inner cards are opaque, so
 * this shows through everywhere except on top of cards.
 */
export function PageBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.35] dark:opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
    </div>
  );
}
