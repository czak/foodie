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

  // [products]
  productsHeader: /^\[products\]$/d,
  // apple = 52, 0.3, 0.2, 0.2
  productDefinition: /^(?<productName>.+?) = (?<calories>\d+(?:\.\d+)?), (?<protein>\d+(?:\.\d+)?), (?<fat>\d+(?:\.\d+)?), (?<carbs>\d+(?:\.\d+)?)$/d,

  // [recipes.Yogurt with apple]
  recipeHeader: /^\[recipes\.(?<recipeName>.+)\]$/d,
  // greek yogurt * 150
  recipeItem: /^(?<itemName>.+?) \* (?<quantity>\d+(?:\.\d+)?)$/d,
};

export function parseConfig(text: string): ConfigData {
  const config = {
    targets: { kcal: 0, protein: 0, fat: 0, carbs: 0 },
    products: {} as Record<string, { calories: number; protein: number; fat: number; carbs: number }>,
    recipes: {} as Record<string, { item: string; quantity: number }[]>,
  };

  let state: "INITIAL" | "TARGETS" | "PRODUCTS" | "RECIPE" = "INITIAL";
  let currentRecipeName = "";

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
          case "productsHeader":
            state = "PRODUCTS";
            break;
          case "productDefinition":
            if (state === "PRODUCTS") {
              const { productName, calories, protein, fat, carbs } = match.groups!;
              if (!config.products[productName]) {
                config.products[productName] = {
                  calories: parseFloat(calories),
                  protein: parseFloat(protein),
                  fat: parseFloat(fat),
                  carbs: parseFloat(carbs),
                };
              }
            }
            break;
          case "recipeHeader":
            state = "RECIPE";
            currentRecipeName = match.groups!.recipeName;
            if (!config.recipes[currentRecipeName]) {
              config.recipes[currentRecipeName] = [];
            }
            break;
          case "recipeItem":
            if (state === "RECIPE" && currentRecipeName) {
              const { itemName, quantity } = match.groups!;
              config.recipes[currentRecipeName].push({
                item: itemName,
                quantity: parseFloat(quantity),
              });
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
