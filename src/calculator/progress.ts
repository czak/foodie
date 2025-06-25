import type { NutritionValues } from "~/types";

export function calculateProgress(totals: NutritionValues, targets: NutritionValues) {
  return {
    kcal: targets.kcal ? (totals.kcal / targets.kcal) * 100 : 0,
    protein: targets.protein ? (totals.protein / targets.protein) * 100 : 0,
    fat: targets.fat ? (totals.fat / targets.fat) * 100 : 0,
    carbs: targets.carbs ? (totals.carbs / targets.carbs) * 100 : 0,
  };
}
