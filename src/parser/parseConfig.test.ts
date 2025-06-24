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
});
