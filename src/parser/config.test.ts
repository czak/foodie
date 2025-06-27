import { describe, it, expect } from "vitest";

import { parseConfig } from "./config";

describe("parseConfig", () => {
  it("returns default config given empty input", () => {
    const text = "";
    expect(parseConfig(text)).toEqual({
      targets: { kcal: 0, protein: 0, fat: 0, carbs: 0 },
      products: {},
      recipes: {},
    });
  });

  it("parses targets section, trimming whitespace", () => {
    const text = `[targets]
kcal =   1850
 protein = 150
  fat = 85
carbs =  250 `;
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
        apple: { kcal: 52, protein: 0.3, fat: 0.2, carbs: 0.2 },
        avocado: { kcal: 160, protein: 2, fat: 14.7, carbs: 8 },
        "chicken breast": { kcal: 165, protein: 31, fat: 3.6, carbs: 0 },
      },
      recipes: {},
    });
  });

  it("parses recipes section", () => {
    const text = `[products]
greek yogurt = 97, 10, 5, 3.6
apple = 52, 0.3, 0.2, 0.2

[recipes.Yogurt with apple]
greek yogurt * 150g
apple * 80g

[recipes.Protein smoothie]
greek yogurt * 200g
apple * 120g`;
    expect(parseConfig(text)).toEqual({
      targets: { kcal: 0, protein: 0, fat: 0, carbs: 0 },
      products: {
        "greek yogurt": { kcal: 97, protein: 10, fat: 5, carbs: 3.6 },
        apple: { kcal: 52, protein: 0.3, fat: 0.2, carbs: 0.2 },
      },
      recipes: {
        "Yogurt with apple": [
          { name: "greek yogurt", grams: 150 },
          { name: "apple", grams: 80 },
        ],
        "Protein smoothie": [
          { name: "greek yogurt", grams: 200 },
          { name: "apple", grams: 120 },
        ],
      },
    });
  });

  it("handles mixed sections in any order", () => {
    const text = `[recipes.Quick snack]
apple * 100g

[targets]
kcal = 1500

[products]
apple = 52, 0.3, 0.2, 0.2`;
    expect(parseConfig(text)).toEqual({
      targets: { kcal: 1500, protein: 0, fat: 0, carbs: 0 },
      products: {
        apple: { kcal: 52, protein: 0.3, fat: 0.2, carbs: 0.2 },
      },
      recipes: {
        "Quick snack": [{ name: "apple", grams: 100 }],
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
        apple: { kcal: 52, protein: 0.3, fat: 0.2, carbs: 0.2 },
        avocado: { kcal: 160, protein: 2, fat: 14.7, carbs: 8 },
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
        apple: { kcal: 52, protein: 0.3, fat: 0.2, carbs: 0.2 },
      },
      recipes: {},
    });
  });

  it("handles decimal values", () => {
    const text = `[products]
test product = 52.5, 0.3, 0.2, 0.15

[recipes.Test recipe]
test product * 75.5g`;
    expect(parseConfig(text)).toEqual({
      targets: { kcal: 0, protein: 0, fat: 0, carbs: 0 },
      products: {
        "test product": { kcal: 52.5, protein: 0.3, fat: 0.2, carbs: 0.15 },
      },
      recipes: {
        "Test recipe": [{ name: "test product", grams: 75.5 }],
      },
    });
  });

  it("handles invalid numeric values in products", () => {
    const text = `[products]
apple = abc, 0.3, 0.2, 0.2
banana = 89, def, 0.4, 23
orange = 47, 0.9, 0.1, ghi`;
    expect(parseConfig(text)).toEqual({
      targets: { kcal: 0, protein: 0, fat: 0, carbs: 0 },
      products: {},
      recipes: {},
    });
  });

  it("handles malformed product definitions", () => {
    const text = `[products]
apple = 52, 0.3, 0.2
banana = 89
orange = 47, 0.9, 0.1, 11, 5`;
    expect(parseConfig(text)).toEqual({
      targets: { kcal: 0, protein: 0, fat: 0, carbs: 0 },
      products: {},
      recipes: {},
    });
  });

  it("does not validate product presence in recipes", () => {
    const text = `[products]
apple = 52, 0.3, 0.2, 0.2

[recipes.Test recipe]
apple * 100g
banana * 50g
orange * 75g`;
    expect(parseConfig(text)).toEqual({
      targets: { kcal: 0, protein: 0, fat: 0, carbs: 0 },
      products: {
        apple: { kcal: 52, protein: 0.3, fat: 0.2, carbs: 0.2 },
      },
      recipes: {
        "Test recipe": [
          { name: "apple", grams: 100 },
          { name: "banana", grams: 50 },
          { name: "orange", grams: 75 },
        ],
      },
    });
  });

  it("trims whitespace in product, recipe, and ingredient names", () => {
    const text = `[products]
  apple   = 52, 0.3, 0.2, 0.2
 banana bread  = 89, 2.6, 0.4, 17

[recipes. Fruit Mix ]
   apple   * 100g
 banana bread   * 25g`;
    expect(parseConfig(text)).toEqual({
      targets: { kcal: 0, protein: 0, fat: 0, carbs: 0 },
      products: {
        apple: { kcal: 52, protein: 0.3, fat: 0.2, carbs: 0.2 },
        "banana bread": { kcal: 89, protein: 2.6, fat: 0.4, carbs: 17 },
      },
      recipes: {
        "Fruit Mix": [
          { name: "apple", grams: 100 },
          { name: "banana bread", grams: 25 },
        ],
      },
    });
  });

  it("ignores lines with negative values", () => {
    const text = `[targets]
kcal = -1500
protein = 120

[products]
apple = -52, 0.3, -0.2, 0.2
banana = 89, -2.6, 0.4, 17

[recipes.Test recipe]
apple * -100g
banana * 50g`;
    expect(parseConfig(text)).toEqual({
      targets: { kcal: 0, protein: 120, fat: 0, carbs: 0 },
      products: {},
      recipes: {
        "Test recipe": [{ name: "banana", grams: 50 }],
      },
    });
  });

  it("ignores ingredient lines without g unit", () => {
    const text = `[recipes.Test recipe]
banana * 50
tomato * 40g`;
    expect(parseConfig(text)).toEqual({
      targets: { kcal: 0, protein: 0, fat: 0, carbs: 0 },
      products: {},
      recipes: {
        "Test recipe": [{ name: "tomato", grams: 40 }],
      },
    });
  });
});
