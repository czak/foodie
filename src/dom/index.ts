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

function updateMacroBreakdownSegments(proteinPercent: number, fatPercent: number, carbsPercent: number) {
  getElement<HTMLDivElement>("#protein-breakdown-segment").style.width = `${proteinPercent}%`;
  getElement<HTMLDivElement>("#fat-breakdown-segment").style.width = `${fatPercent}%`;
  getElement<HTMLDivElement>("#carbs-breakdown-segment").style.width = `${carbsPercent}%`;

  getElement<HTMLSpanElement>("#protein-breakdown-text").textContent = `Protein: ${Math.round(proteinPercent)}%`;
  getElement<HTMLSpanElement>("#fat-breakdown-text").textContent = `Fat: ${Math.round(fatPercent)}%`;
  getElement<HTMLSpanElement>("#carbs-breakdown-text").textContent = `Carbs: ${Math.round(carbsPercent)}%`;
}

function updateMacroBreakdown(totals: NutritionValues) {
  const proteinKcal = totals.protein * 4;
  const fatKcal = totals.fat * 9;
  const carbsKcal = totals.carbs * 4;

  const totalMacroKcal = proteinKcal + fatKcal + carbsKcal;

  if (totalMacroKcal === 0) {
    updateMacroBreakdownSegments(33, 34, 33);
    return;
  }

  const proteinPercent = (proteinKcal / totalMacroKcal) * 100;
  const fatPercent = (fatKcal / totalMacroKcal) * 100;
  const carbsPercent = (carbsKcal / totalMacroKcal) * 100;

  updateMacroBreakdownSegments(proteinPercent, fatPercent, carbsPercent);
}

export function updateStatsPane(totals: NutritionValues, targets: NutritionValues) {
  updateKcalProgress(totals.kcal, targets.kcal);

  updateMacroProgress("protein", totals.protein, targets.protein);
  updateMacroProgress("fat", totals.fat, targets.fat);
  updateMacroProgress("carbs", totals.carbs, targets.carbs);

  updateMacroBreakdown(totals);
}
