import { describe, it, expect } from "vitest";

import { highlightLine } from "./highlighter";

describe("highlightLine", () => {
  it("highlights a product definition line with capture groups", () => {
    const line = "greek yogurt = 97, 10, 5, 3.6";
    const patterns = {
      productsHeader: /^\[products\]$/d,
      productDefinition: /^(?<productName>.+) = (?<kcal>\d+(?:\.\d+)?), (?<protein>\d+(?:\.\d+)?), (?<fat>\d+(?:\.\d+)?), (?<carbs>\d+(?:\.\d+)?)$/d,
    };

    const result = highlightLine(line, patterns);

    expect(result).toBe(
      '<span class="highlight-productDefinition"><span class="highlight-productName">greek yogurt</span> = <span class="highlight-kcal">97</span>, <span class="highlight-protein">10</span>, <span class="highlight-fat">5</span>, <span class="highlight-carbs">3.6</span></span>',
    );
  });
});
