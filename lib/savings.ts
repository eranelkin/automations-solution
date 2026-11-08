import { SAVINGS_RATE, WEEKS_PER_MONTH } from "@/config/site";

export interface SavingsInput {
  employees: number;
  hoursPerWeek: number;
  hourlyCost: number;
}

export interface SavingsResult {
  weeklyCost: number;
  monthlyCost: number;
  yearlyCost: number;
  monthlySavings: number;
  yearlySavings: number;
  hoursSavedPerMonth: number;
}

export const CALCULATOR_DEFAULTS: SavingsInput = {
  employees: 2,
  hoursPerWeek: 10,
  hourlyCost: 60,
};

export const CALCULATOR_RANGES = {
  employees: { min: 1, max: 100, step: 1 },
  hoursPerWeek: { min: 1, max: 40, step: 1 },
  hourlyCost: { min: 30, max: 300, step: 5 },
} as const;

export function calculateSavings({
  employees,
  hoursPerWeek,
  hourlyCost,
}: SavingsInput): SavingsResult {
  const weeklyCost = employees * hoursPerWeek * hourlyCost;
  const monthlyCost = weeklyCost * WEEKS_PER_MONTH;
  const yearlyCost = weeklyCost * 52;
  const monthlySavings = monthlyCost * SAVINGS_RATE;
  const yearlySavings = yearlyCost * SAVINGS_RATE;
  const hoursSavedPerMonth =
    employees * hoursPerWeek * WEEKS_PER_MONTH * SAVINGS_RATE;

  return {
    weeklyCost,
    monthlyCost,
    yearlyCost,
    monthlySavings,
    yearlySavings,
    hoursSavedPerMonth,
  };
}
