export interface NutritionValues {
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface Ingredient {
  name: string;
  quantity: number;
  unit: 'g' | 'x';
}

export interface ConfigData {
  targets: NutritionValues;
  products: Record<string, NutritionValues>;
  recipes: Record<string, Ingredient[]>;
}

export interface TodayData {
  meals: Record<string, Ingredient[]>;
}
