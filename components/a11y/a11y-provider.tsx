"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  A11Y_DEFAULTS,
  applyA11yPrefs,
  A11Y_STORAGE_KEY,
  type A11yPrefs,
} from "@/lib/a11y-constants";

interface A11yContextValue {
  prefs: A11yPrefs;
  update: (patch: Partial<A11yPrefs>) => void;
  reset: () => void;
}

const A11yContext = createContext<A11yContextValue | null>(null);

function readStoredPrefs(): A11yPrefs {
  if (typeof window === "undefined") return A11Y_DEFAULTS;
  try {
    const raw = window.localStorage.getItem(A11Y_STORAGE_KEY);
    if (!raw) return A11Y_DEFAULTS;
    return { ...A11Y_DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return A11Y_DEFAULTS;
  }
}

export function A11yProvider({ children }: { children: ReactNode }) {
  // Lazy initializer reads localStorage synchronously on the client's first
  // render. Safe here because no unconditionally-rendered DOM reflects
  // `prefs` (the toggle panel only mounts its content once opened), so
  // there's nothing for React to flag as a hydration mismatch.
  const [prefs, setPrefs] = useState<A11yPrefs>(() =>
    typeof window === "undefined" ? A11Y_DEFAULTS : readStoredPrefs(),
  );

  useEffect(() => {
    applyA11yPrefs(prefs);
    window.localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(prefs));
  }, [prefs]);

  const update = (patch: Partial<A11yPrefs>) =>
    setPrefs((prev) => ({ ...prev, ...patch }));

  const reset = () => setPrefs(A11Y_DEFAULTS);

  return (
    <A11yContext.Provider value={{ prefs, update, reset }}>
      {children}
    </A11yContext.Provider>
  );
}

export function useA11yPrefs() {
  const ctx = useContext(A11yContext);
  if (!ctx) throw new Error("useA11yPrefs must be used within A11yProvider");
  return ctx;
}
