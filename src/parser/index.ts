interface ConfigData {
  targets: { kcal: number; protein: number; fat: number; carbs: number };
  products: Record<string, { calories: number; protein: number; fat: number; carbs: number }>;
  recipes: Record<string, { item: string; quantity: number }[]>;
}

const CONFIG_PATTERNS = {
  // [targets]
  targetsHeader: /^\[targets\]$/d,
  // kcal = 1850
  targetKcal: /^kcal = (?<value>\d+)$/d,
  // protein = 150
  targetProtein: /^protein = (?<value>\d+)$/d,
  // fat = 85
  targetFat: /^fat = (?<value>\d+)$/d,
  // carbs = 250
  targetCarbs: /^carbs = (?<value>\d+)$/d,
};

export function parseConfig(text: string): ConfigData {
  const config = {
    targets: { kcal: 0, protein: 0, fat: 0, carbs: 0 },
    products: {} as Record<string, { calories: number; protein: number; fat: number; carbs: number }>,
    recipes: {} as Record<string, { item: string; quantity: number }[]>,
  };

  let state: "INITIAL" | "TARGETS" | "PRODUCTS" | "RECIPE" = "INITIAL";

  for (const line of text.split("\n")) {
    for (const [patternName, pattern] of Object.entries(CONFIG_PATTERNS)) {
      const match = pattern.exec(line);
      if (match) {
        switch (patternName) {
          case "targetsHeader":
            state = "TARGETS";
            break;
          case "targetKcal":
            if (state === "TARGETS") {
              config.targets.kcal = parseInt(match.groups!.value);
            }
            break;
          case "targetProtein":
            if (state === "TARGETS") {
              config.targets.protein = parseInt(match.groups!.value);
            }
            break;
          case "targetFat":
            if (state === "TARGETS") {
              config.targets.fat = parseInt(match.groups!.value);
            }
            break;
          case "targetCarbs":
            if (state === "TARGETS") {
              config.targets.carbs = parseInt(match.groups!.value);
            }
            break;
        }
        break;
      }
    }
  }

  return config;
}

export function parseToday(_text: string) {
  return {
    meals: { breakfast: [{ item: "apple", quantity: 120 }] },
  };
}
