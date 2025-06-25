import type { NutritionValues } from "~/types";

export function getElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Element not found for selector: ${selector}`);
  }
  return element;
}

export function updateStatsPane(totals: NutritionValues, progress: NutritionValues, _targets: NutritionValues) {
  getElement<HTMLSpanElement>("#kcal-total").textContent = Math.round(totals.kcal).toString();

  // Half circumference of radius 40: PI * 40 ~= 126
  const circumference = 126;
  const offset = circumference - (Math.min(progress.kcal, 100) / 100) * circumference;

  getElement<SVGPathElement>("#kcal-circle-fill").style.strokeDashoffset = offset.toString();
  getElement<SVGTextElement>("#kcal-percentage").textContent = `${Math.round(progress.kcal)}%`;
}
