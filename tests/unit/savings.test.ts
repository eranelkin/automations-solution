import { describe, expect, it } from "vitest";
import {
  calculateSavings,
  CALCULATOR_DEFAULTS,
  CALCULATOR_RANGES,
} from "@/lib/savings";
import { SAVINGS_RATE, WEEKS_PER_MONTH } from "@/config/site";

function expectClose(actual: number, expected: number) {
  expect(actual).toBeCloseTo(expected, 6);
}

describe("calculateSavings", () => {
  it("matches the spec formulas at the default slider values", () => {
    const result = calculateSavings(CALCULATOR_DEFAULTS);
    const { employees, hoursPerWeek, hourlyCost } = CALCULATOR_DEFAULTS;

    const weekly = employees * hoursPerWeek * hourlyCost;
    const monthly = weekly * WEEKS_PER_MONTH;
    const yearly = weekly * 52;

    expectClose(result.weeklyCost, weekly);
    expectClose(result.monthlyCost, monthly);
    expectClose(result.yearlyCost, yearly);
    expectClose(result.monthlySavings, monthly * SAVINGS_RATE);
    expectClose(result.yearlySavings, yearly * SAVINGS_RATE);
    expectClose(
      result.hoursSavedPerMonth,
      employees * hoursPerWeek * WEEKS_PER_MONTH * SAVINGS_RATE,
    );
  });

  it("is zero across the board at the minimum of every slider", () => {
    const result = calculateSavings({
      employees: CALCULATOR_RANGES.employees.min,
      hoursPerWeek: CALCULATOR_RANGES.hoursPerWeek.min,
      hourlyCost: 0,
    });
    expect(result.weeklyCost).toBe(0);
    expect(result.monthlyCost).toBe(0);
    expect(result.yearlySavings).toBe(0);
  });

  it("matches the spec formulas at the minimum slider values", () => {
    const input = {
      employees: CALCULATOR_RANGES.employees.min,
      hoursPerWeek: CALCULATOR_RANGES.hoursPerWeek.min,
      hourlyCost: CALCULATOR_RANGES.hourlyCost.min,
    };
    const result = calculateSavings(input);
    const weekly = input.employees * input.hoursPerWeek * input.hourlyCost;

    expectClose(result.weeklyCost, weekly);
    expectClose(result.yearlySavings, weekly * 52 * SAVINGS_RATE);
  });

  it("matches the spec formulas at the maximum slider values", () => {
    const input = {
      employees: CALCULATOR_RANGES.employees.max,
      hoursPerWeek: CALCULATOR_RANGES.hoursPerWeek.max,
      hourlyCost: CALCULATOR_RANGES.hourlyCost.max,
    };
    const result = calculateSavings(input);
    const weekly = input.employees * input.hoursPerWeek * input.hourlyCost;
    const monthly = weekly * WEEKS_PER_MONTH;

    expectClose(result.weeklyCost, weekly);
    expectClose(result.monthlyCost, monthly);
    expectClose(result.monthlySavings, monthly * SAVINGS_RATE);
    expectClose(
      result.hoursSavedPerMonth,
      input.employees * input.hoursPerWeek * WEEKS_PER_MONTH * SAVINGS_RATE,
    );
  });

  it("scales linearly with employee count", () => {
    const base = calculateSavings({ employees: 1, hoursPerWeek: 10, hourlyCost: 100 });
    const doubled = calculateSavings({ employees: 2, hoursPerWeek: 10, hourlyCost: 100 });
    expectClose(doubled.yearlySavings, base.yearlySavings * 2);
  });
});
