"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Globe } from "lucide-react";

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const t = useTranslations("common");
  const pathname = usePathname();
  const target = locale === "he" ? "en" : "he";

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const href = `/${target}${pathname === "/" ? "" : pathname}${hash}`;
    e.currentTarget.href = href;
  };

  return (
    <a
      href={`/${target}${pathname === "/" ? "" : pathname}`}
      onClick={handleClick}
      className={className ??
        "flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
      }
    >
      <Globe className="size-4" aria-hidden="true" />
      {target === "en" ? t("english") : t("hebrew")}
    </a>
  );
}
