export function HeroBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* The grid-line texture itself now lives in PageBackground and
          covers the whole page — this keeps only the Hero-specific glow
          and grain accents. */}
      <div className="absolute end-[-10%] top-[-10%] size-[480px] rounded-full bg-[var(--accent)] opacity-[0.12] blur-[120px] dark:opacity-[0.22]" />
      <div className="absolute start-[-15%] top-[20%] size-[420px] rounded-full bg-[var(--accent-2)] opacity-[0.1] blur-[120px] dark:opacity-[0.18]" />
      <svg className="absolute inset-0 h-full w-full opacity-[0.025] dark:opacity-[0.04]">
        <filter id="hero-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-grain)" />
      </svg>
    </div>
  );
}
