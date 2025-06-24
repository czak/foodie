interface ConfigData {
  targets: { kcal: number; protein: number; fat: number; carbs: number };
  products: Record<string, { calories: number; protein: number; fat: number; carbs: number }>;
  recipes: Record<string, { item: string; quantity: number }[]>;
}

export function parseConfig(text: string): ConfigData {
  const config = {
    targets: { kcal: 0, protein: 0, fat: 0, carbs: 0 },
    products: {},
    recipes: {},
  };

  // TODO: Parse
  for (const line of text.split("\n")) {
    console.log("Parsing line:", line);
  }

  return config;
}

export function parseToday(_text: string) {
  return {
    meals: { breakfast: [{ item: "apple", quantity: 120 }] },
  };
}
