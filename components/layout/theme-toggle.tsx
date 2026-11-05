"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useTranslations } from "next-intl";
import { Moon, Sun, Monitor, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light", icon: Sun, labelKey: "lightMode" },
  { value: "dark", icon: Moon, labelKey: "darkMode" },
  { value: "system", icon: Monitor, labelKey: "systemMode" },
] as const;

export function ThemeToggle() {
  const t = useTranslations("common");
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Server and the first client (hydration) render must match exactly, and
  // next-themes already knows the real theme on that first client render
  // (it reads localStorage synchronously before hydration) — so anything
  // theme-dependent has to stay a fixed placeholder until `mounted` flips,
  // never branch on `theme`/`resolvedTheme` before that.
  const ActiveIcon = mounted
    ? (OPTIONS.find((o) => o.value === theme)?.icon ?? Monitor)
    : Monitor;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={t("themeSwitcher")}
          className="flex size-10 items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
        >
          <ActiveIcon className="size-[18px]" aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 min-w-[180px] rounded-xl border border-[var(--border)] bg-[var(--card)] p-1.5 shadow-lg"
        >
          {OPTIONS.map(({ value, icon: Icon, labelKey }) => (
            <DropdownMenu.Item
              key={value}
              onSelect={() => setTheme(value)}
              className={cn(
                "flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm outline-none",
                "text-[var(--text-primary)] data-[highlighted]:bg-[var(--surface)]",
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              <span className="flex-1">{t(labelKey)}</span>
              {mounted && theme === value && (
                <Check className="size-3.5 text-[var(--accent)]" aria-hidden="true" />
              )}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
