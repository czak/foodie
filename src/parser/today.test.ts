import { describe, it, expect } from "vitest";

import { parseToday } from "./today";

describe("parseToday", () => {
  it("returns default config given empty input", () => {
    const text = "";
    expect(parseToday(text)).toEqual({
      meals: {},
    });
  });

  it("parses a valid meal, trimming whitespace", () => {
    const text = `  [Breakfast]  
greek yogurt  *  150 g
 apple   * 80g `;
    expect(parseToday(text)).toEqual({
      meals: {
        Breakfast: [
          { name: "greek yogurt", quantity: 150, unit: "g" },
          { name: "apple", quantity: 80, unit: "g" },
        ],
      },
    });
  });

  it("parses multiple meals", () => {
    const text = `[Breakfast]
greek yogurt * 150g
apple * 80g

[Lunch]
chicken breast * 200g
rice * 100g

[Dinner]
salmon * 180g
broccoli * 150g`;
    expect(parseToday(text)).toEqual({
      meals: {
        Breakfast: [
          { name: "greek yogurt", quantity: 150, unit: "g" },
          { name: "apple", quantity: 80, unit: "g" },
        ],
        Lunch: [
          { name: "chicken breast", quantity: 200, unit: "g" },
          { name: "rice", quantity: 100, unit: "g" },
        ],
        Dinner: [
          { name: "salmon", quantity: 180, unit: "g" },
          { name: "broccoli", quantity: 150, unit: "g" },
        ],
      },
    });
  });

  it("handles decimal quantities", () => {
    const text = `[Snack]
almonds * 25.5g
protein powder * 30.25g`;
    expect(parseToday(text)).toEqual({
      meals: {
        Snack: [
          { name: "almonds", quantity: 25.5, unit: "g" },
          { name: "protein powder", quantity: 30.25, unit: "g" },
        ],
      },
    });
  });

  it("ignores invalid lines as plain text", () => {
    const text = `# This is a comment
[Breakfast]
greek yogurt * 150g
invalid line here
apple * 80g

[Lunch]
bad item line
chicken breast * 200g`;
    expect(parseToday(text)).toEqual({
      meals: {
        Breakfast: [
          { name: "greek yogurt", quantity: 150, unit: "g" },
          { name: "apple", quantity: 80, unit: "g" },
        ],
        Lunch: [{ name: "chicken breast", quantity: 200, unit: "g" }],
      },
    });
  });

  it("ignores items without meal headers", () => {
    const text = `orphaned item * 100g
[Breakfast]
greek yogurt * 150g`;
    expect(parseToday(text)).toEqual({
      meals: {
        Breakfast: [{ name: "greek yogurt", quantity: 150, unit: "g" }],
      },
    });
  });

  it("handles empty meal sections", () => {
    const text = `[Breakfast]

[Lunch]
chicken breast * 200g

[Dinner]`;
    expect(parseToday(text)).toEqual({
      meals: {
        Breakfast: [],
        Lunch: [{ name: "chicken breast", quantity: 200, unit: "g" }],
        Dinner: [],
      },
    });
  });

  it("trims whitespace in meal and ingredient names", () => {
    const text = `[ Morning Snack ]
  greek yogurt   * 150g
 protein powder  * 30g`;
    expect(parseToday(text)).toEqual({
      meals: {
        "Morning Snack": [
          { name: "greek yogurt", quantity: 150, unit: "g" },
          { name: "protein powder", quantity: 30, unit: "g" },
        ],
      },
    });
  });

  it("handles malformed item lines", () => {
    const text = `[Breakfast]
greek yogurt * 150g
apple
banana * abc
orange * 80g * 2g
protein powder * 25g`;
    expect(parseToday(text)).toEqual({
      meals: {
        Breakfast: [
          { name: "greek yogurt", quantity: 150, unit: "g" },
          { name: "protein powder", quantity: 25, unit: "g" },
        ],
      },
    });
  });

  it("ignores lines with negative quantities", () => {
    const text = `[Breakfast]
greek yogurt * 150g
apple * -80g
banana * 100g`;
    expect(parseToday(text)).toEqual({
      meals: {
        Breakfast: [
          { name: "greek yogurt", quantity: 150, unit: "g" },
          { name: "banana", quantity: 100, unit: "g" },
        ],
      },
    });
  });

  it("ignores lines without valid unit (g or x)", () => {
    const text = `[Breakfast]
greek yogurt * 150g
banana * 100`;
    expect(parseToday(text)).toEqual({
      meals: {
        Breakfast: [{ name: "greek yogurt", quantity: 150, unit: "g" }],
      },
    });
  });

  it("handles meals in any order", () => {
    const text = `[Dinner]
salmon * 180g

[Breakfast]
greek yogurt * 150g

[Lunch]
chicken breast * 200g`;
    expect(parseToday(text)).toEqual({
      meals: {
        Dinner: [{ name: "salmon", quantity: 180, unit: "g" }],
        Breakfast: [{ name: "greek yogurt", quantity: 150, unit: "g" }],
        Lunch: [{ name: "chicken breast", quantity: 200, unit: "g" }],
      },
    });
  });

  it("handles duplicate meal names by appending items", () => {
    const text = `[Breakfast]
greek yogurt * 150g

[Lunch]
chicken breast * 200g

[Breakfast]
apple * 80g`;
    expect(parseToday(text)).toEqual({
      meals: {
        Breakfast: [
          { name: "greek yogurt", quantity: 150, unit: "g" },
          { name: "apple", quantity: 80, unit: "g" },
        ],
        Lunch: [{ name: "chicken breast", quantity: 200, unit: "g" }],
      },
    });
  });

  it("parses pure multiplier syntax for meal ingredients", () => {
    const text = `[Breakfast]
Oatmeal with fruit * 1x
Protein smoothie * 0.5x

[Lunch]
Chicken salad * 2x`;
    expect(parseToday(text)).toEqual({
      meals: {
        Breakfast: [
          { name: "Oatmeal with fruit", quantity: 1, unit: "x" },
          { name: "Protein smoothie", quantity: 0.5, unit: "x" },
        ],
        Lunch: [{ name: "Chicken salad", quantity: 2, unit: "x" }],
      },
    });
  });

  it("handles mixed weight and multiplier syntax in meals", () => {
    const text = `[Breakfast]
greek yogurt * 150g
Oatmeal with fruit * 1x
apple * 80g
Protein smoothie * 0.5x`;
    expect(parseToday(text)).toEqual({
      meals: {
        Breakfast: [
          { name: "greek yogurt", quantity: 150, unit: "g" },
          { name: "Oatmeal with fruit", quantity: 1, unit: "x" },
          { name: "apple", quantity: 80, unit: "g" },
          { name: "Protein smoothie", quantity: 0.5, unit: "x" },
        ],
      },
    });
  });
});
