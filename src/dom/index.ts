import type { NutritionValues } from "~/types";

export function getElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Element not found for selector: ${selector}`);
  }
  return element;
}

function updateKcalProgress(current: number, target: number) {
  // Half circumference of radius 40: PI * 40 ~= 126
  const circumference = 126;
  const progress = target > 0 ? (current / target) * 100 : 0;
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference;

  getElement<HTMLSpanElement>("#kcal-total").textContent = Math.round(current).toString();
  getElement<SVGPathElement>("#kcal-fill").style.strokeDashoffset = offset.toString();
  getElement<SVGTextElement>("#kcal-label").textContent = `${Math.round(progress)}%`;
}

function updateMacroProgress(macro: string, current: number, target: number) {
  const progress = target > 0 ? (current / target) * 100 : 0;

  getElement<HTMLDivElement>(`#${macro}-fill`).style.width = `${Math.min(progress, 100)}%`;
  getElement<HTMLDivElement>(`#${macro}-label`).textContent = `${Math.round(current)} / ${Math.round(target)}g`;
}

function updateMacroBreakdown(totals: NutritionValues) {
  const proteinKcal = totals.protein * 4;
  const fatKcal = totals.fat * 9;
  const carbsKcal = totals.carbs * 4;

  const kcal = proteinKcal + fatKcal + carbsKcal;

  const proteinPercent = kcal > 0 ? (proteinKcal / kcal) * 100 : 0;
  const fatPercent = kcal > 0 ? (fatKcal / kcal) * 100 : 0;
  const carbsPercent = kcal > 0 ? (carbsKcal / kcal) * 100 : 0;

  getElement<HTMLDivElement>("#protein-breakdown-segment").style.flexGrow = `${proteinKcal}`;
  getElement<HTMLDivElement>("#fat-breakdown-segment").style.flexGrow = `${fatKcal}`;
  getElement<HTMLDivElement>("#carbs-breakdown-segment").style.flexGrow = `${carbsKcal}`;

  getElement<HTMLSpanElement>("#protein-breakdown-text").textContent = `Protein: ${Math.round(proteinPercent)}%`;
  getElement<HTMLSpanElement>("#fat-breakdown-text").textContent = `Fat: ${Math.round(fatPercent)}%`;
  getElement<HTMLSpanElement>("#carbs-breakdown-text").textContent = `Carbs: ${Math.round(carbsPercent)}%`;
}

export function updateStatsPane(totals: NutritionValues, targets: NutritionValues) {
  updateKcalProgress(totals.kcal, targets.kcal);

  updateMacroProgress("protein", totals.protein, targets.protein);
  updateMacroProgress("fat", totals.fat, targets.fat);
  updateMacroProgress("carbs", totals.carbs, targets.carbs);

  updateMacroBreakdown(totals);
}
