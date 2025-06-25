import { calculateProgress } from "~/calculator";
import type { NutritionValues } from "~/types";

export function getElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Element not found for selector: ${selector}`);
  }
  return element;
}

function updateMacroProgress(macro: string, current: number, target: number) {
  const percent = target > 0 ? (current / target) * 100 : 0;

  getElement<HTMLDivElement>(`#${macro}-fill`).style.width = `${Math.min(percent, 100)}%`;
  getElement<HTMLDivElement>(`#${macro}-label`).textContent = `${Math.round(current)} / ${Math.round(target)}g`;
}

export function updateStatsPane(totals: NutritionValues, targets: NutritionValues) {
  getElement<HTMLSpanElement>("#kcal-total").textContent = Math.round(totals.kcal).toString();

  const progress = calculateProgress(totals, targets);

  // Half circumference of radius 40: PI * 40 ~= 126
  const circumference = 126;
  const offset = circumference - (Math.min(progress.kcal, 100) / 100) * circumference;

  getElement<SVGPathElement>("#kcal-circle-fill").style.strokeDashoffset = offset.toString();
  getElement<SVGTextElement>("#kcal-percentage").textContent = `${Math.round(progress.kcal)}%`;

  updateMacroProgress("protein", totals.protein, targets.protein);
  updateMacroProgress("fat", totals.fat, targets.fat);
  updateMacroProgress("carbs", totals.carbs, targets.carbs);
}
