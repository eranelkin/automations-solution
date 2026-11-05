"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { calculateSavings, CALCULATOR_DEFAULTS, type SavingsInput } from "@/lib/savings";

interface CalculatorContextValue {
  input: SavingsInput;
  setInput: (input: SavingsInput) => void;
  result: ReturnType<typeof calculateSavings>;
  prefillRequestId: number;
  requestPrefill: () => void;
}

const CalculatorContext = createContext<CalculatorContextValue | null>(null);

export function CalculatorProvider({ children }: { children: ReactNode }) {
  const [input, setInput] = useState<SavingsInput>(CALCULATOR_DEFAULTS);
  const [prefillRequestId, setPrefillRequestId] = useState(0);
  const result = useMemo(() => calculateSavings(input), [input]);

  const value = useMemo<CalculatorContextValue>(
    () => ({
      input,
      setInput,
      result,
      prefillRequestId,
      requestPrefill: () => setPrefillRequestId((id) => id + 1),
    }),
    [input, result, prefillRequestId],
  );

  return (
    <CalculatorContext.Provider value={value}>{children}</CalculatorContext.Provider>
  );
}

export function useCalculator() {
  const ctx = useContext(CalculatorContext);
  if (!ctx) {
    throw new Error("useCalculator must be used within a CalculatorProvider");
  }
  return ctx;
}
