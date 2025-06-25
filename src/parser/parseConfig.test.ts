import { describe, it, expect } from "vitest";

import { parseConfig } from "./";

describe("parseConfig", () => {
  it("returns default config given empty input", () => {
    const text = "";
    expect(parseConfig(text)).toEqual({
      targets: { kcal: 0, protein: 0, fat: 0, carbs: 0 },
      products: {},
      recipes: {},
    });
  });

  it("parses targets section", () => {
    const text = `[targets]
kcal = 1850
protein = 150
fat = 85
carbs = 250`;
    expect(parseConfig(text)).toEqual({
      targets: { kcal: 1850, protein: 150, fat: 85, carbs: 250 },
      products: {},
      recipes: {},
    });
  });

  it("parses partial targets with defaults", () => {
    const text = `[targets]
kcal = 2000
protein = 120`;
    expect(parseConfig(text)).toEqual({
      targets: { kcal: 2000, protein: 120, fat: 0, carbs: 0 },
      products: {},
      recipes: {},
    });
  });

  it("parses products section", () => {
    const text = `[products]
apple = 52, 0.3, 0.2, 0.2
avocado = 160, 2, 14.7, 8
chicken breast = 165, 31, 3.6, 0`;
    expect(parseConfig(text)).toEqual({
      targets: { kcal: 0, protein: 0, fat: 0, carbs: 0 },
      products: {
        apple: { calories: 52, protein: 0.3, fat: 0.2, carbs: 0.2 },
        avocado: { calories: 160, protein: 2, fat: 14.7, carbs: 8 },
        "chicken breast": { calories: 165, protein: 31, fat: 3.6, carbs: 0 },
      },
      recipes: {},
    });
  });

  it("parses recipes section", () => {
    const text = `[products]
greek yogurt = 97, 10, 5, 3.6
apple = 52, 0.3, 0.2, 0.2

[recipes.Yogurt with apple]
greek yogurt * 150
apple * 80

[recipes.Protein smoothie]
greek yogurt * 200
apple * 120`;
    expect(parseConfig(text)).toEqual({
      targets: { kcal: 0, protein: 0, fat: 0, carbs: 0 },
      products: {
        "greek yogurt": { calories: 97, protein: 10, fat: 5, carbs: 3.6 },
        apple: { calories: 52, protein: 0.3, fat: 0.2, carbs: 0.2 },
      },
      recipes: {
        "Yogurt with apple": [
          { item: "greek yogurt", quantity: 150 },
          { item: "apple", quantity: 80 },
        ],
        "Protein smoothie": [
          { item: "greek yogurt", quantity: 200 },
          { item: "apple", quantity: 120 },
        ],
      },
    });
  });

  it("handles mixed sections in any order", () => {
    const text = `[recipes.Quick snack]
apple * 100

[targets]
kcal = 1500

[products]
apple = 52, 0.3, 0.2, 0.2`;
    expect(parseConfig(text)).toEqual({
      targets: { kcal: 1500, protein: 0, fat: 0, carbs: 0 },
      products: {
        apple: { calories: 52, protein: 0.3, fat: 0.2, carbs: 0.2 },
      },
      recipes: {
        "Quick snack": [{ item: "apple", quantity: 100 }],
      },
    });
  });

  it("ignores invalid lines as plain text", () => {
    const text = `# This is a comment
[targets]
kcal = 1850
invalid line here
protein = 150

[products]
apple = 52, 0.3, 0.2, 0.2
bad product line
avocado = 160, 2, 14.7, 8`;
    expect(parseConfig(text)).toEqual({
      targets: { kcal: 1850, protein: 150, fat: 0, carbs: 0 },
      products: {
        apple: { calories: 52, protein: 0.3, fat: 0.2, carbs: 0.2 },
        avocado: { calories: 160, protein: 2, fat: 14.7, carbs: 8 },
      },
      recipes: {},
    });
  });

  it("ignores product definition in targets section", () => {
    const text = `[targets]
kcal = 1850
apple = 52, 0.3, 0.2, 0.2
protein = 150`;
    expect(parseConfig(text)).toEqual({
      targets: { kcal: 1850, protein: 150, fat: 0, carbs: 0 },
      products: {},
      recipes: {},
    });
  });

  it("handles duplicate products with first definition winning", () => {
    const text = `[products]
apple = 52, 0.3, 0.2, 0.2
apple = 100, 1, 1, 1`;
    expect(parseConfig(text)).toEqual({
      targets: { kcal: 0, protein: 0, fat: 0, carbs: 0 },
      products: {
        apple: { calories: 52, protein: 0.3, fat: 0.2, carbs: 0.2 },
      },
      recipes: {},
    });
  });

  it("handles decimal values", () => {
    const text = `[products]
test product = 52.5, 0.3, 0.2, 0.15

[recipes.Test recipe]
test product * 75.5`;
    expect(parseConfig(text)).toEqual({
      targets: { kcal: 0, protein: 0, fat: 0, carbs: 0 },
      products: {
        "test product": { calories: 52.5, protein: 0.3, fat: 0.2, carbs: 0.15 },
      },
      recipes: {
        "Test recipe": [{ item: "test product", quantity: 75.5 }],
      },
    });
  });
});
