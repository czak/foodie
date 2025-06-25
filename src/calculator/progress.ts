import type { NutritionValues } from "~/types";

export function calculateProgress(totals: NutritionValues, targets: NutritionValues) {
  return {
    kcal: (totals.kcal / targets.kcal) * 100,
    protein: (totals.protein / targets.protein) * 100,
    fat: (totals.fat / targets.fat) * 100,
    carbs: (totals.carbs / targets.carbs) * 100,
  };
}
