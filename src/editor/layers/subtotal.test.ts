import { describe, it, expect } from "vitest";
import { overlayLine } from "./subtotal";
import type { NutritionValues } from "~/types";

describe("overlayLine", () => {
  const mockCalculateTotals = (groupName: string): NutritionValues => {
    const mockData: Record<string, NutritionValues> = {
      Breakfast: { kcal: 454, protein: 33.5, fat: 12, carbs: 52 },
      Lunch: { kcal: 623, protein: 45.2, fat: 18.5, carbs: 65.8 },
      "Yogurt with apple": { kcal: 145, protein: 11.2, fat: 4.2, carbs: 8.8 },
      "Protein smoothie": { kcal: 280, protein: 25.0, fat: 6.0, carbs: 15.5 },
    };
    return mockData[groupName] || { kcal: 0, protein: 0, fat: 0, carbs: 0 };
  };

  const mockExtractMeal = (line: string): string | undefined => {
    if (line.startsWith("[") && line.endsWith("]")) {
      return line.slice(1, -1);
    }
    return undefined;
  };

  const mockExtractRecipe = (line: string): string | undefined => {
    const prefix = "[recipes.";
    if (line.startsWith(prefix) && line.endsWith("]")) {
      return line.slice(prefix.length, -1);
    }
    return undefined;
  };

  it("returns formatted totals for meal header", () => {
    const line = "[Breakfast]";
    const result = overlayLine(line, mockExtractMeal, mockCalculateTotals);
    expect(result).toBe(
      '<span class="subtotal-transparent">[Breakfast]</span> <span class="subtotal-block"><span class="subtotal-kcal">454</span>, <span class="subtotal-protein">34</span>, <span class="subtotal-fat">12</span>, <span class="subtotal-carbs">52</span></span>',
    );
  });

  it("returns formatted totals for recipe header", () => {
    const line = "[recipes.Yogurt with apple]";
    const result = overlayLine(line, mockExtractRecipe, mockCalculateTotals);
    expect(result).toBe(
      '<span class="subtotal-transparent">[recipes.Yogurt with apple]</span> <span class="subtotal-block"><span class="subtotal-kcal">145</span>, <span class="subtotal-protein">11</span>, <span class="subtotal-fat">4</span>, <span class="subtotal-carbs">9</span></span>',
    );
  });

  it("returns transparent span for non-header lines", () => {
    const line = "greek yogurt * 150";
    const result = overlayLine(line, mockExtractMeal, mockCalculateTotals);
    expect(result).toBe('<span class="subtotal-transparent">greek yogurt * 150</span>');
  });

  it("returns transparent span for empty line", () => {
    const line = "";
    const result = overlayLine(line, mockExtractMeal, mockCalculateTotals);
    expect(result).toBe('<span class="subtotal-transparent"></span>');
  });

  it("returns transparent span for plain text", () => {
    const line = "some random text";
    const result = overlayLine(line, mockExtractMeal, mockCalculateTotals);
    expect(result).toBe('<span class="subtotal-transparent">some random text</span>');
  });

  it("handles unknown meal names", () => {
    const line = "[UnknownMeal]";
    const result = overlayLine(line, mockExtractMeal, mockCalculateTotals);
    expect(result).toBe(
      '<span class="subtotal-transparent">[UnknownMeal]</span> <span class="subtotal-block"><span class="subtotal-kcal">0</span>, <span class="subtotal-protein">0</span>, <span class="subtotal-fat">0</span>, <span class="subtotal-carbs">0</span></span>',
    );
  });

  it("handles unknown recipe names", () => {
    const line = "[recipes.UnknownRecipe]";
    const result = overlayLine(line, mockExtractRecipe, mockCalculateTotals);
    expect(result).toBe(
      '<span class="subtotal-transparent">[recipes.UnknownRecipe]</span> <span class="subtotal-block"><span class="subtotal-kcal">0</span>, <span class="subtotal-protein">0</span>, <span class="subtotal-fat">0</span>, <span class="subtotal-carbs">0</span></span>',
    );
  });

  it("rounds decimal numbers to integers", () => {
    const line = "[Lunch]";
    const result = overlayLine(line, mockExtractMeal, mockCalculateTotals);
    expect(result).toBe(
      '<span class="subtotal-transparent">[Lunch]</span> <span class="subtotal-block"><span class="subtotal-kcal">623</span>, <span class="subtotal-protein">45</span>, <span class="subtotal-fat">19</span>, <span class="subtotal-carbs">66</span></span>',
    );
  });

  it("formats integer numbers correctly", () => {
    const line = "[Breakfast]";
    const result = overlayLine(line, mockExtractMeal, mockCalculateTotals);
    expect(result).toBe(
      '<span class="subtotal-transparent">[Breakfast]</span> <span class="subtotal-block"><span class="subtotal-kcal">454</span>, <span class="subtotal-protein">34</span>, <span class="subtotal-fat">12</span>, <span class="subtotal-carbs">52</span></span>',
    );
  });

  it("does not match partial header patterns", () => {
    const line = "[Breakfast] extra text";
    const result = overlayLine(line, mockExtractMeal, mockCalculateTotals);
    expect(result).toBe('<span class="subtotal-transparent">[Breakfast] extra text</span>');
  });

  it("returns transparent span when extract function returns undefined", () => {
    const alwaysUndefined = (_line: string) => undefined;
    const line = "[Breakfast]";
    const result = overlayLine(line, alwaysUndefined, mockCalculateTotals);
    expect(result).toBe('<span class="subtotal-transparent">[Breakfast]</span>');
  });

  it("escapes HTML characters in text content", () => {
    const line = "<script>alert('xss')</script>";
    const result = overlayLine(line, mockExtractMeal, mockCalculateTotals);
    expect(result).toBe('<span class="subtotal-transparent">&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;</span>');
  });
});
