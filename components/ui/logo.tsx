import { COMPANY_NAME } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Temporary mark: an abstract routed "path" (three nodes, one flowing line)
 * next to a clean wordmark. Pure strokes on currentColor so it holds up on
 * both themes without separate light/dark artwork.
 */
export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-[var(--text-primary)]", className)}>
      <svg
        viewBox="0 0 32 32"
        width="28"
        height="28"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <circle cx="6" cy="24" r="3" fill="var(--accent-2)" />
        <circle cx="16" cy="8" r="3" fill="var(--accent)" />
        <circle cx="26" cy="24" r="3" fill="var(--accent)" />
        <path
          d="M8.5 22.5C11 18 13 15 16 11.5C19 15 21 18 23.5 22.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.4"
        />
      </svg>
      {showWordmark && (
        <span className="text-lg font-semibold tracking-[-0.01em]">
          {COMPANY_NAME}
        </span>
      )}
    </span>
  );
}
