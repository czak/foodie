import type { NutritionValues } from "~/types";

export function getElement<T extends HTMLElement>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Element not found for selector: ${selector}`);
  }
  return element;
}

export function updateStatsPane(totals: NutritionValues, _progress: NutritionValues, _targets: NutritionValues) {
  getElement<HTMLSpanElement>("#kcal-total").textContent = Math.round(totals.kcal).toString();
}
