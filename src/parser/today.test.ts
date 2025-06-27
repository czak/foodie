import { describe, it, expect } from "vitest";

import { parseToday } from "./today";

describe("parseToday", () => {
  it("returns default config given empty input", () => {
    const text = "";
    expect(parseToday(text)).toEqual({
      meals: {},
    });
  });

  it("parses a valid meal", () => {
    const text = `[Breakfast]
greek yogurt * 150g
apple * 80g`;
    expect(parseToday(text)).toEqual({
      meals: {
        Breakfast: [
          { name: "greek yogurt", grams: 150 },
          { name: "apple", grams: 80 },
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
          { name: "greek yogurt", grams: 150 },
          { name: "apple", grams: 80 },
        ],
        Lunch: [
          { name: "chicken breast", grams: 200 },
          { name: "rice", grams: 100 },
        ],
        Dinner: [
          { name: "salmon", grams: 180 },
          { name: "broccoli", grams: 150 },
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
          { name: "almonds", grams: 25.5 },
          { name: "protein powder", grams: 30.25 },
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
          { name: "greek yogurt", grams: 150 },
          { name: "apple", grams: 80 },
        ],
        Lunch: [{ name: "chicken breast", grams: 200 }],
      },
    });
  });

  it("ignores items without meal headers", () => {
    const text = `orphaned item * 100g
[Breakfast]
greek yogurt * 150g`;
    expect(parseToday(text)).toEqual({
      meals: {
        Breakfast: [{ name: "greek yogurt", grams: 150 }],
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
        Lunch: [{ name: "chicken breast", grams: 200 }],
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
          { name: "greek yogurt", grams: 150 },
          { name: "protein powder", grams: 30 },
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
          { name: "greek yogurt", grams: 150 },
          { name: "protein powder", grams: 25 },
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
          { name: "greek yogurt", grams: 150 },
          { name: "banana", grams: 100 },
        ],
      },
    });
  });

  it("ignores lines without the g unit", () => {
    const text = `[Breakfast]
greek yogurt * 150g
banana * 100`;
    expect(parseToday(text)).toEqual({
      meals: {
        Breakfast: [{ name: "greek yogurt", grams: 150 }],
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
        Dinner: [{ name: "salmon", grams: 180 }],
        Breakfast: [{ name: "greek yogurt", grams: 150 }],
        Lunch: [{ name: "chicken breast", grams: 200 }],
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
          { name: "greek yogurt", grams: 150 },
          { name: "apple", grams: 80 },
        ],
        Lunch: [{ name: "chicken breast", grams: 200 }],
      },
    });
  });
});
