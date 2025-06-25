export interface NutritionValues {
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface ConfigData {
  targets: NutritionValues;
  products: Record<string, NutritionValues>;
  recipes: Record<string, { item: string; quantity: number }[]>;
}

export interface TodayData {
  meals: Record<string, { item: string; quantity: number }[]>;
}
