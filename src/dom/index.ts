import type { NutritionValues } from "~/types";

export function getElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Element not found for selector: ${selector}`);
  }
  return element;
}

export function updateStatsPane(totals: NutritionValues, targets: NutritionValues) {
  getElement<HTMLSpanElement>("#kcal-total").textContent = Math.round(totals.kcal).toString();

  const progress = {
    kcal: targets.kcal > 0 ? (totals.kcal / targets.kcal) * 100 : 0,
    protein: targets.protein > 0 ? (totals.protein / targets.protein) * 100 : 0,
    fat: targets.fat > 0 ? (totals.fat / targets.fat) * 100 : 0,
    carbs: targets.carbs > 0 ? (totals.carbs / targets.carbs) * 100 : 0,
  };

  // Half circumference of radius 40: PI * 40 ~= 126
  const circumference = 126;
  const offset = circumference - (Math.min(progress.kcal, 100) / 100) * circumference;

  getElement<SVGPathElement>("#kcal-circle-fill").style.strokeDashoffset = offset.toString();
  getElement<SVGTextElement>("#kcal-percentage").textContent = `${Math.round(progress.kcal)}%`;
}
