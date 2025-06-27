import { describe, it, expect } from "vitest";

import { highlightLine, type Validator } from "./highlighter";

describe("highlightLine", () => {
  const patterns = {
    productsHeader: /^\[products\]$/d,
    productDefinition: /^(?<productName>.+) = (?<kcal>\d+(?:\.\d+)?), (?<protein>\d+(?:\.\d+)?), (?<fat>\d+(?:\.\d+)?), (?<carbs>\d+(?:\.\d+)?)$/d,
  };

  const trueValidator: Validator = (_patternName, _groups) => true;
  const falseValidator: Validator = (_patternName, _groups) => false;

  it("highlights a product definition line with capture groups", () => {
    const line = "greek yogurt = 97, 10, 5, 3.6";
    const result = highlightLine(line, patterns, trueValidator);
    expect(result).toBe(
      '<span class="highlight-productDefinition"><span class="highlight-productName">greek yogurt</span> = <span class="highlight-kcal">97</span>, <span class="highlight-protein">10</span>, <span class="highlight-fat">5</span>, <span class="highlight-carbs">3.6</span></span>',
    );
  });

  it("returns escaped HTML when no pattern matches", () => {
    const line = "random text that doesn't match";
    const result = highlightLine(line, patterns, (_a, _b) => true);
    expect(result).toBe("random text that doesn&#39;t match");
  });

  it("handles empty line", () => {
    const line = "";
    const result = highlightLine(line, patterns, trueValidator);
    expect(result).toBe("");
  });

  it("escapes HTML characters in unmatched lines", () => {
    const line = "<script>alert('xss')</script>";
    const result = highlightLine(line, patterns, trueValidator);
    expect(result).toBe("&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;");
  });

  it("escapes HTML characters in matched content", () => {
    const line = "<script>alert() = 100, 10, 5, 3.6";
    const result = highlightLine(line, patterns, trueValidator);
    expect(result).toBe(
      '<span class="highlight-productDefinition"><span class="highlight-productName">&lt;script&gt;alert()</span> = <span class="highlight-kcal">100</span>, <span class="highlight-protein">10</span>, <span class="highlight-fat">5</span>, <span class="highlight-carbs">3.6</span></span>',
    );
  });

  it("returns escaped but not highlighted text if validator return false", () => {
    const line = "<script>alert() = 100, 10, 5, 3.6";
    const result = highlightLine(line, patterns, falseValidator);
    expect(result).toBe("&lt;script&gt;alert() = 100, 10, 5, 3.6");
  });

  it("highlights products header", () => {
    const line = "[products]";
    const result = highlightLine(line, patterns, trueValidator);
    expect(result).toBe('<span class="highlight-productsHeader">[products]</span>');
  });

  it("handles decimal numbers in product definition", () => {
    const line = "oatmeal = 68.5, 2.4, 1.2, 12.8";
    const result = highlightLine(line, patterns, trueValidator);
    expect(result).toBe(
      '<span class="highlight-productDefinition"><span class="highlight-productName">oatmeal</span> = <span class="highlight-kcal">68.5</span>, <span class="highlight-protein">2.4</span>, <span class="highlight-fat">1.2</span>, <span class="highlight-carbs">12.8</span></span>',
    );
  });

  it("handles integer numbers in product definition", () => {
    const line = "bread = 250, 9, 4, 49";
    const result = highlightLine(line, patterns, trueValidator);
    expect(result).toBe(
      '<span class="highlight-productDefinition"><span class="highlight-productName">bread</span> = <span class="highlight-kcal">250</span>, <span class="highlight-protein">9</span>, <span class="highlight-fat">4</span>, <span class="highlight-carbs">49</span></span>',
    );
  });

  it("handles product names with special characters", () => {
    const line = "peanut butter & jelly = 150, 6, 8, 20";
    const result = highlightLine(line, patterns, trueValidator);
    expect(result).toBe(
      '<span class="highlight-productDefinition"><span class="highlight-productName">peanut butter &amp; jelly</span> = <span class="highlight-kcal">150</span>, <span class="highlight-protein">6</span>, <span class="highlight-fat">8</span>, <span class="highlight-carbs">20</span></span>',
    );
  });

  it("uses first matching pattern when multiple could match", () => {
    const customPatterns = {
      firstPattern: /^(?<name>.+) = (?<value>\d+), (?<other>\d+), (?<more>\d+), (?<last>\d+)$/d,
      productDefinition: /^(?<productName>.+) = (?<kcal>\d+(?:\.\d+)?), (?<protein>\d+(?:\.\d+)?), (?<fat>\d+(?:\.\d+)?), (?<carbs>\d+(?:\.\d+)?)$/d,
    };

    const line = "test = 100, 10, 5, 3";
    const result = highlightLine(line, customPatterns, trueValidator);
    expect(result).toBe(
      '<span class="highlight-firstPattern"><span class="highlight-name">test</span> = <span class="highlight-value">100</span>, <span class="highlight-other">10</span>, <span class="highlight-more">5</span>, <span class="highlight-last">3</span></span>',
    );
  });

  it("handles pattern without named capture groups", () => {
    const simplePatterns = {
      simpleMatch: /^simple$/d,
    };

    const line = "simple";
    const result = highlightLine(line, simplePatterns, trueValidator);
    expect(result).toBe('<span class="highlight-simpleMatch">simple</span>');
  });

  it("does not highlight partial matches", () => {
    const line = "incomplete product = 100, 10";
    const result = highlightLine(line, patterns, trueValidator);
    expect(result).toBe("incomplete product = 100, 10");
  });

  it("does not highlight when line has extra content", () => {
    const line = "greek yogurt = 97, 10, 5, 3.6 extra content";
    const result = highlightLine(line, patterns, trueValidator);
    expect(result).toBe("greek yogurt = 97, 10, 5, 3.6 extra content");
  });

  it("handles lines with only whitespace", () => {
    const line = "   ";
    const result = highlightLine(line, patterns, trueValidator);
    expect(result).toBe("   ");
  });

  it("handles empty patterns object", () => {
    const line = "any line";
    const result = highlightLine(line, {}, trueValidator);
    expect(result).toBe("any line");
  });

  it("throws an error if a pattern does not use the /d flag", () => {
    const patterns = {
      validPattern: /^foo$/d,
      invalidPattern: /^bar$/,
    };

    const line = "test";
    expect(() => highlightLine(line, patterns, trueValidator)).toThrow("Pattern 'invalidPattern' must use the /d flag");
  });
});
