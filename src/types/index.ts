export interface ConfigData {
  targets: { kcal: number; protein: number; fat: number; carbs: number };
  products: Record<string, { calories: number; protein: number; fat: number; carbs: number }>;
  recipes: Record<string, { item: string; quantity: number }[]>;
}

export interface TodayData {
  meals: Record<string, { item: string; quantity: number }[]>;
}
