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
greek yogurt * 150
apple * 80`;
    expect(parseToday(text)).toEqual({
      meals: {
        Breakfast: [
          { name: "greek yogurt", quantity: 150 },
          { name: "apple", quantity: 80 },
        ],
      },
    });
  });

  it("parses multiple meals", () => {
    const text = `[Breakfast]
greek yogurt * 150
apple * 80

[Lunch]
chicken breast * 200
rice * 100

[Dinner]
salmon * 180
broccoli * 150`;
    expect(parseToday(text)).toEqual({
      meals: {
        Breakfast: [
          { name: "greek yogurt", quantity: 150 },
          { name: "apple", quantity: 80 },
        ],
        Lunch: [
          { name: "chicken breast", quantity: 200 },
          { name: "rice", quantity: 100 },
        ],
        Dinner: [
          { name: "salmon", quantity: 180 },
          { name: "broccoli", quantity: 150 },
        ],
      },
    });
  });

  it("handles decimal quantities", () => {
    const text = `[Snack]
almonds * 25.5
protein powder * 30.25`;
    expect(parseToday(text)).toEqual({
      meals: {
        Snack: [
          { name: "almonds", quantity: 25.5 },
          { name: "protein powder", quantity: 30.25 },
        ],
      },
    });
  });

  it("ignores invalid lines as plain text", () => {
    const text = `# This is a comment
[Breakfast]
greek yogurt * 150
invalid line here
apple * 80

[Lunch]
bad item line
chicken breast * 200`;
    expect(parseToday(text)).toEqual({
      meals: {
        Breakfast: [
          { name: "greek yogurt", quantity: 150 },
          { name: "apple", quantity: 80 },
        ],
        Lunch: [{ name: "chicken breast", quantity: 200 }],
      },
    });
  });

  it("ignores items without meal headers", () => {
    const text = `orphaned item * 100
[Breakfast]
greek yogurt * 150`;
    expect(parseToday(text)).toEqual({
      meals: {
        Breakfast: [{ name: "greek yogurt", quantity: 150 }],
      },
    });
  });

  it("handles empty meal sections", () => {
    const text = `[Breakfast]

[Lunch]
chicken breast * 200

[Dinner]`;
    expect(parseToday(text)).toEqual({
      meals: {
        Breakfast: [],
        Lunch: [{ name: "chicken breast", quantity: 200 }],
        Dinner: [],
      },
    });
  });

  it("does not trim whitespace in meal and item names", () => {
    const text = `[ Morning Snack ]
  greek yogurt   * 150
 protein powder  * 30`;
    expect(parseToday(text)).toEqual({
      meals: {
        " Morning Snack ": [
          { name: "  greek yogurt  ", quantity: 150 },
          { name: " protein powder ", quantity: 30 },
        ],
      },
    });
  });

  it("handles malformed item lines", () => {
    const text = `[Breakfast]
greek yogurt * 150
apple
banana * abc
orange * 80 * 2
protein powder * 25`;
    expect(parseToday(text)).toEqual({
      meals: {
        Breakfast: [
          { name: "greek yogurt", quantity: 150 },
          { name: "protein powder", quantity: 25 },
        ],
      },
    });
  });

  it("ignores lines with negative quantities", () => {
    const text = `[Breakfast]
greek yogurt * 150
apple * -80
banana * 100`;
    expect(parseToday(text)).toEqual({
      meals: {
        Breakfast: [
          { name: "greek yogurt", quantity: 150 },
          { name: "banana", quantity: 100 },
        ],
      },
    });
  });

  it("handles meals in any order", () => {
    const text = `[Dinner]
salmon * 180

[Breakfast]
greek yogurt * 150

[Lunch]
chicken breast * 200`;
    expect(parseToday(text)).toEqual({
      meals: {
        Dinner: [{ name: "salmon", quantity: 180 }],
        Breakfast: [{ name: "greek yogurt", quantity: 150 }],
        Lunch: [{ name: "chicken breast", quantity: 200 }],
      },
    });
  });

  it("handles duplicate meal names by appending items", () => {
    const text = `[Breakfast]
greek yogurt * 150

[Lunch]
chicken breast * 200

[Breakfast]
apple * 80`;
    expect(parseToday(text)).toEqual({
      meals: {
        Breakfast: [
          { name: "greek yogurt", quantity: 150 },
          { name: "apple", quantity: 80 },
        ],
        Lunch: [{ name: "chicken breast", quantity: 200 }],
      },
    });
  });
});
