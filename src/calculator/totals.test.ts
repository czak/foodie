import { describe, it, expect } from "vitest";

import { calculateTotals } from "./totals";

describe("calculateTotals", () => {
  it("calculates totals from meals with products and recipes", () => {
    const configData = {
      targets: { kcal: 2000, protein: 150, fat: 85, carbs: 250 },
      products: {
        "greek yogurt": { kcal: 100, protein: 10, fat: 0, carbs: 6 },
        "chicken breast": { kcal: 165, protein: 31, fat: 3.6, carbs: 0 },
        rice: { kcal: 130, protein: 2.7, fat: 0.3, carbs: 28 },
      },
      recipes: {
        "protein bowl": [
          { name: "chicken breast", quantity: 200, unit: "g" },
          { name: "rice", quantity: 100, unit: "g" },
        ],
      },
    };
    const todayData = {
      meals: {
        Breakfast: [{ name: "greek yogurt", quantity: 150, unit: "g" }],
        Lunch: [{ name: "protein bowl", quantity: 300, unit: "g" }],
      },
    };

    // 150g greek yogurt (150 kcal, 15g protein, 0g fat, 9g carbs) +
    // 300g protein bowl: 200g chicken breast (330 kcal, 62g protein, 7.2g fat, 0g carbs) + 100g rice (130 kcal, 2.7g protein, 0.3g fat, 28g carbs)
    const result = calculateTotals(configData, todayData);
    expect(result.kcal).toBe(610);
    expect(result.protein).toBeCloseTo(79.7);
    expect(result.fat).toBeCloseTo(7.5);
    expect(result.carbs).toBe(37);
  });

  it("calculates proportional totals for recipes based on amount consumed", () => {
    const configData = {
      targets: { kcal: 2000, protein: 150, fat: 85, carbs: 250 },
      products: {
        "chicken breast": { kcal: 165, protein: 31, fat: 3.6, carbs: 0 },
        rice: { kcal: 130, protein: 2.7, fat: 0.3, carbs: 28 },
      },
      recipes: {
        "protein bowl": [
          { name: "chicken breast", quantity: 200, unit: "g" },
          { name: "rice", quantity: 100, unit: "g" },
        ],
      },
    };
    const todayData = {
      meals: {
        // NOTE: Half of "regular" protein bowl recipe consumed
        Lunch: [{ name: "protein bowl", quantity: 150, unit: "g" }],
      },
    };

    const result = calculateTotals(configData, todayData);
    expect(result.kcal).toBe(230);
    expect(result.protein).toBeCloseTo(32.35);
    expect(result.fat).toBeCloseTo(3.75);
    expect(result.carbs).toBe(14);
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
        "greek yogurt": { kcal: 100, protein: 10, fat: 0, carbs: 6 },
      },
      recipes: {},
    };
    const todayData = {
      meals: {
        Breakfast: [
          { name: "greek yogurt", quantity: 100, unit: "g" },
          { name: "unknown item", quantity: 200, unit: "g" },
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
        "greek yogurt": { kcal: 100, protein: 10, fat: 0, carbs: 6 },
      },
      recipes: {},
    };
    const todayData = {
      meals: {
        Breakfast: [{ name: "greek yogurt", quantity: 0, unit: "g" }],
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
        "greek yogurt": { kcal: 100, protein: 10, fat: 0, carbs: 6 },
      },
      recipes: {},
    };
    const todayData = {
      meals: {
        Breakfast: [{ name: "greek yogurt", quantity: 50.5, unit: "g" }],
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
        "chicken breast": { kcal: 165, protein: 31, fat: 3.6, carbs: 0 },
      },
      recipes: {
        "mixed bowl": [
          { name: "chicken breast", quantity: 100, unit: "g" },
          { name: "unknown ingredient", quantity: 200, unit: "g" },
        ],
      },
    };
    const todayData = {
      meals: {
        Lunch: [{ name: "mixed bowl", quantity: 300, unit: "g" }],
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

  it("ignores recipes that reference other recipes", () => {
    const configData = {
      targets: { kcal: 2000, protein: 150, fat: 85, carbs: 250 },
      products: {
        "chicken breast": { kcal: 165, protein: 31, fat: 3.6, carbs: 0 },
        rice: { kcal: 130, protein: 2.7, fat: 0.3, carbs: 28 },
      },
      recipes: {
        "protein bowl": [
          { name: "chicken breast", quantity: 100, unit: "g" },
          { name: "rice", quantity: 100, unit: "g" },
        ],
        "invalid recipe": [{ name: "protein bowl", quantity: 100, unit: "g" }],
      },
    };
    const todayData = {
      meals: {
        Dinner: [{ name: "invalid recipe", quantity: 100, unit: "g" }],
      },
    };

    // Recipe with other recipes as ingredients should be ignored (contributes 0)
    expect(calculateTotals(configData, todayData)).toEqual({
      kcal: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
    });
  });

  it("sums items across multiple meals", () => {
    const configData = {
      targets: { kcal: 2000, protein: 150, fat: 85, carbs: 250 },
      products: {
        "greek yogurt": { kcal: 100, protein: 10, fat: 0, carbs: 6 },
      },
      recipes: {},
    };
    const todayData = {
      meals: {
        Breakfast: [{ name: "greek yogurt", quantity: 100, unit: "g" }],
        Snack: [{ name: "greek yogurt", quantity: 50, unit: "g" }],
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

  it("calculates totals using multiplier syntax for products", () => {
    const configData = {
      targets: { kcal: 2000, protein: 150, fat: 85, carbs: 250 },
      products: {
        "greek yogurt": { kcal: 100, protein: 10, fat: 0, carbs: 6 },
      },
      recipes: {},
    };
    const todayData = {
      meals: {
        Breakfast: [{ name: "greek yogurt", quantity: 1, unit: "x" }],
      },
    };

    // 1x greek yogurt = 1 * 100g = 100g = 100 kcal, 10g protein, 0g fat, 6g carbs
    expect(calculateTotals(configData, todayData)).toEqual({
      kcal: 100,
      protein: 10,
      fat: 0,
      carbs: 6,
    });
  });

  it("calculates totals using multiplier syntax for recipes", () => {
    const configData = {
      targets: { kcal: 2000, protein: 150, fat: 85, carbs: 250 },
      products: {
        "chicken breast": { kcal: 165, protein: 31, fat: 3.6, carbs: 0 },
        rice: { kcal: 130, protein: 2.7, fat: 0.3, carbs: 28 },
      },
      recipes: {
        "protein bowl": [
          { name: "chicken breast", quantity: 200, unit: "g" },
          { name: "rice", quantity: 100, unit: "g" },
        ],
      },
    };
    const todayData = {
      meals: {
        Lunch: [{ name: "protein bowl", quantity: 1, unit: "x" }],
      },
    };

    // 1x protein bowl = 1 full recipe = 200g chicken breast + 100g rice
    // 200g chicken breast = 330 kcal, 62g protein, 7.2g fat, 0g carbs
    // 100g rice = 130 kcal, 2.7g protein, 0.3g fat, 28g carbs
    // Total = 460 kcal, 64.7g protein, 7.5g fat, 28g carbs
    const result = calculateTotals(configData, todayData);
    expect(result.kcal).toBe(460);
    expect(result.protein).toBeCloseTo(64.7);
    expect(result.fat).toBeCloseTo(7.5);
    expect(result.carbs).toBe(28);
  });

  it("calculates totals using fractional multiplier for recipes", () => {
    const configData = {
      targets: { kcal: 2000, protein: 150, fat: 85, carbs: 250 },
      products: {
        "chicken breast": { kcal: 165, protein: 31, fat: 3.6, carbs: 0 },
        rice: { kcal: 130, protein: 2.7, fat: 0.3, carbs: 28 },
      },
      recipes: {
        "protein bowl": [
          { name: "chicken breast", quantity: 200, unit: "g" },
          { name: "rice", quantity: 100, unit: "g" },
        ],
      },
    };
    const todayData = {
      meals: {
        Lunch: [{ name: "protein bowl", quantity: 0.5, unit: "x" }],
      },
    };

    // 0.5x protein bowl = half recipe = 100g chicken breast + 50g rice
    // 100g chicken breast = 165 kcal, 31g protein, 3.6g fat, 0g carbs
    // 50g rice = 65 kcal, 1.35g protein, 0.15g fat, 14g carbs
    // Total = 230 kcal, 32.35g protein, 3.75g fat, 14g carbs
    const result = calculateTotals(configData, todayData);
    expect(result.kcal).toBe(230);
    expect(result.protein).toBeCloseTo(32.35);
    expect(result.fat).toBeCloseTo(3.75);
    expect(result.carbs).toBe(14);
  });

  it("handles mixed weight and multiplier syntax in same meal", () => {
    const configData = {
      targets: { kcal: 2000, protein: 150, fat: 85, carbs: 250 },
      products: {
        "greek yogurt": { kcal: 100, protein: 10, fat: 0, carbs: 6 },
        apple: { kcal: 52, protein: 0.3, fat: 0.2, carbs: 14 },
      },
      recipes: {
        "fruit bowl": [{ name: "apple", quantity: 150, unit: "g" }],
      },
    };
    const todayData = {
      meals: {
        Breakfast: [
          { name: "greek yogurt", quantity: 150, unit: "g" },
          { name: "fruit bowl", quantity: 1, unit: "x" },
        ],
      },
    };

    // 150g greek yogurt = 150 kcal, 15g protein, 0g fat, 9g carbs
    // 1x fruit bowl = 150g apple = 78 kcal, 0.45g protein, 0.3g fat, 21g carbs
    // Total = 228 kcal, 15.45g protein, 0.3g fat, 30g carbs
    const result = calculateTotals(configData, todayData);
    expect(result.kcal).toBe(228);
    expect(result.protein).toBeCloseTo(15.45);
    expect(result.fat).toBeCloseTo(0.3);
    expect(result.carbs).toBe(30);
  });

  it("handles recipes with multiplier ingredients", () => {
    const configData = {
      targets: { kcal: 2000, protein: 150, fat: 85, carbs: 250 },
      products: {
        "greek yogurt": { kcal: 100, protein: 10, fat: 0, carbs: 6 },
        apple: { kcal: 52, protein: 0.3, fat: 0.2, carbs: 14 },
      },
      recipes: {
        "mixed bowl": [
          { name: "greek yogurt", quantity: 150, unit: "g" },
          { name: "apple", quantity: 2, unit: "x" },
        ],
      },
    };
    const todayData = {
      meals: {
        Breakfast: [{ name: "mixed bowl", quantity: 1, unit: "x" }],
      },
    };

    // 1x mixed bowl = 150g greek yogurt + 2x apple (2 * 100g = 200g apple)
    // 150g greek yogurt = 150 kcal, 15g protein, 0g fat, 9g carbs
    // 200g apple = 104 kcal, 0.6g protein, 0.4g fat, 28g carbs
    // Total = 254 kcal, 15.6g protein, 0.4g fat, 37g carbs
    const result = calculateTotals(configData, todayData);
    expect(result.kcal).toBe(254);
    expect(result.protein).toBeCloseTo(15.6);
    expect(result.fat).toBeCloseTo(0.4);
    expect(result.carbs).toBe(37);
  });
});
