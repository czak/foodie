import { describe, it, expect } from "vitest";

import { calculateProgress } from "./progress";

describe("calculateProgress", () => {
  it("returns hardcoded progress values", () => {
    const totals = { kcal: 1500, protein: 120, fat: 60, carbs: 180 };
    const targets = { kcal: 2000, protein: 150, fat: 85, carbs: 250 };

    const result = calculateProgress(totals, targets);

    expect(result.kcal).toBe(75);
    expect(result.protein).toBe(80);
    expect(result.fat).toBeCloseTo(70.59);
    expect(result.carbs).toBe(72);
  });

  it("handles zero values in totals", () => {
    const totals = { kcal: 1000, protein: 0, fat: 30, carbs: 0 };
    const targets = { kcal: 2000, protein: 150, fat: 85, carbs: 250 };

    const result = calculateProgress(totals, targets);

    expect(result.kcal).toBe(50);
    expect(result.protein).toBe(0);
    expect(result.fat).toBeCloseTo(35.29);
    expect(result.carbs).toBe(0);
  });

  it("returns 0 when targets are 0", () => {
    const totals = { kcal: 1500, protein: 120, fat: 60, carbs: 180 };
    const targets = { kcal: 0, protein: 0, fat: 0, carbs: 0 };

    const result = calculateProgress(totals, targets);

    expect(result.kcal).toBe(0);
    expect(result.protein).toBe(0);
    expect(result.fat).toBe(0);
    expect(result.carbs).toBe(0);
  });
});
