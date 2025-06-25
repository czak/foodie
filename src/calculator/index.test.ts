import { describe, it, expect } from "vitest";

import { calculateTotals } from "./index";

describe("calculateTotals", () => {
  it("calculates totals from meals with products and recipes", () => {
    const configData = {
      targets: { kcal: 2000, protein: 150, fat: 85, carbs: 250 },
      products: {
        "greek yogurt": { calories: 100, protein: 10, fat: 0, carbs: 6 },
        "chicken breast": { calories: 165, protein: 31, fat: 3.6, carbs: 0 },
        rice: { calories: 130, protein: 2.7, fat: 0.3, carbs: 28 },
      },
      recipes: {
        "protein bowl": [
          { item: "chicken breast", quantity: 200 },
          { item: "rice", quantity: 100 },
        ],
      },
    };
    const todayData = {
      meals: {
        Breakfast: [{ item: "greek yogurt", quantity: 150 }],
        Lunch: [{ item: "protein bowl", quantity: 1 }],
      },
    };

    // 150g greek yogurt (150 kcal, 15g protein, 0g fat, 9g carbs) +
    // protein bowl: 200g chicken breast (330 kcal, 62g protein, 7.2g fat, 0g carbs) + 100g rice (130 kcal, 2.7g protein, 0.3g fat, 28g carbs)
    const result = calculateTotals(configData, todayData);
    expect(result.kcal).toBe(610);
    expect(result.protein).toBeCloseTo(79.7);
    expect(result.fat).toBeCloseTo(7.5);
    expect(result.carbs).toBe(37);
  });

  it("returns zero totals for empty meals", () => {
    const configData = {
      targets: { kcal: 2000, protein: 150, fat: 85, carbs: 250 },
      products: {},
      recipes: {},
    };
    const todayData = {
      meals: {},
    };

    expect(calculateTotals(configData, todayData)).toEqual({
      kcal: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
    });
  });

  it("ignores unknown items", () => {
    const configData = {
      targets: { kcal: 2000, protein: 150, fat: 85, carbs: 250 },
      products: {
        "greek yogurt": { calories: 100, protein: 10, fat: 0, carbs: 6 },
      },
      recipes: {},
    };
    const todayData = {
      meals: {
        Breakfast: [
          { item: "greek yogurt", quantity: 100 },
          { item: "unknown item", quantity: 200 },
        ],
      },
    };

    // Only greek yogurt should contribute: 100g = 100 kcal, 10g protein, 0g fat, 6g carbs
    expect(calculateTotals(configData, todayData)).toEqual({
      kcal: 100,
      protein: 10,
      fat: 0,
      carbs: 6,
    });
  });

  it("handles zero quantities", () => {
    const configData = {
      targets: { kcal: 2000, protein: 150, fat: 85, carbs: 250 },
      products: {
        "greek yogurt": { calories: 100, protein: 10, fat: 0, carbs: 6 },
      },
      recipes: {},
    };
    const todayData = {
      meals: {
        Breakfast: [{ item: "greek yogurt", quantity: 0 }],
      },
    };

    expect(calculateTotals(configData, todayData)).toEqual({
      kcal: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
    });
  });

  it("handles decimal quantities", () => {
    const configData = {
      targets: { kcal: 2000, protein: 150, fat: 85, carbs: 250 },
      products: {
        "greek yogurt": { calories: 100, protein: 10, fat: 0, carbs: 6 },
      },
      recipes: {},
    };
    const todayData = {
      meals: {
        Breakfast: [{ item: "greek yogurt", quantity: 50.5 }],
      },
    };

    // 50.5g greek yogurt = 0.505 * (100 kcal, 10g protein, 0g fat, 6g carbs)
    const result = calculateTotals(configData, todayData);
    expect(result.kcal).toBeCloseTo(50.5);
    expect(result.protein).toBeCloseTo(5.05);
    expect(result.fat).toBe(0);
    expect(result.carbs).toBeCloseTo(3.03);
  });

  it("handles recipes with unknown items", () => {
    const configData = {
      targets: { kcal: 2000, protein: 150, fat: 85, carbs: 250 },
      products: {
        "chicken breast": { calories: 165, protein: 31, fat: 3.6, carbs: 0 },
      },
      recipes: {
        "mixed bowl": [
          { item: "chicken breast", quantity: 100 },
          { item: "unknown ingredient", quantity: 200 },
        ],
      },
    };
    const todayData = {
      meals: {
        Lunch: [{ item: "mixed bowl", quantity: 1 }],
      },
    };

    // Only chicken breast should contribute: 100g = 165 kcal, 31g protein, 3.6g fat, 0g carbs
    expect(calculateTotals(configData, todayData)).toEqual({
      kcal: 165,
      protein: 31,
      fat: 3.6,
      carbs: 0,
    });
  });

  it("handles nested recipes", () => {
    const configData = {
      targets: { kcal: 2000, protein: 150, fat: 85, carbs: 250 },
      products: {
        "chicken breast": { calories: 165, protein: 31, fat: 3.6, carbs: 0 },
        rice: { calories: 130, protein: 2.7, fat: 0.3, carbs: 28 },
      },
      recipes: {
        "protein bowl": [
          { item: "chicken breast", quantity: 100 },
          { item: "rice", quantity: 100 },
        ],
        "double meal": [{ item: "protein bowl", quantity: 2 }],
      },
    };
    const todayData = {
      meals: {
        Dinner: [{ item: "double meal", quantity: 1 }],
      },
    };

    // double meal = 2 * protein bowl = 2 * (100g chicken + 100g rice) = 2 * (295 kcal, 33.7g protein, 3.9g fat, 28g carbs)
    const result = calculateTotals(configData, todayData);
    expect(result.kcal).toBe(590);
    expect(result.protein).toBeCloseTo(67.4);
    expect(result.fat).toBeCloseTo(7.8);
    expect(result.carbs).toBe(56);
  });

  it("sums items across multiple meals", () => {
    const configData = {
      targets: { kcal: 2000, protein: 150, fat: 85, carbs: 250 },
      products: {
        "greek yogurt": { calories: 100, protein: 10, fat: 0, carbs: 6 },
      },
      recipes: {},
    };
    const todayData = {
      meals: {
        Breakfast: [{ item: "greek yogurt", quantity: 100 }],
        Snack: [{ item: "greek yogurt", quantity: 50 }],
      },
    };

    // 100g + 50g greek yogurt = 150g total = 150 kcal, 15g protein, 0g fat, 9g carbs
    expect(calculateTotals(configData, todayData)).toEqual({
      kcal: 150,
      protein: 15,
      fat: 0,
      carbs: 9,
    });
  });
});
