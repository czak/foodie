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
});
