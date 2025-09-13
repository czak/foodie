import type { ConfigData, TodayData, NutritionValues, Ingredient } from "~/types";

export function calculateTotals(configData: ConfigData, todayData: TodayData): NutritionValues {
  let totals = { kcal: 0, protein: 0, fat: 0, carbs: 0 };

  for (const meal of Object.values(todayData.meals)) {
    for (const ingredient of meal) {
      const ingredientTotals = calculateIngredientTotals(ingredient, configData);
      totals.kcal += ingredientTotals.kcal;
      totals.protein += ingredientTotals.protein;
      totals.fat += ingredientTotals.fat;
      totals.carbs += ingredientTotals.carbs;
    }
  }

  return totals;
}

function calculateIngredientTotals(ingredient: Ingredient, configData: ConfigData): NutritionValues {
  // Check if it's a recipe
  if (configData.recipes[ingredient.name]) {
    let recipeTotals = { kcal: 0, protein: 0, fat: 0, carbs: 0 };
    let recipeGrams = 0;

    for (const recipeIngredient of configData.recipes[ingredient.name]) {
      const recipeIngredientGrams = recipeIngredient.unit === "g" ? recipeIngredient.quantity : recipeIngredient.quantity * 100; // 'x' unit means multiplier of 100g per unit

      // NOTE: Adding weight even for invalid ingredients
      recipeGrams += recipeIngredientGrams;

      const product = configData.products[recipeIngredient.name];
      if (product) {
        const multiplier = recipeIngredientGrams / 100;
        recipeTotals.kcal += product.kcal * multiplier;
        recipeTotals.protein += product.protein * multiplier;
        recipeTotals.fat += product.fat * multiplier;
        recipeTotals.carbs += product.carbs * multiplier;
      }
    }

    let finalMultiplier = 1;
    if (ingredient.unit === "g") {
      // Weight-based: scale by weight ratio
      if (recipeGrams > 0) {
        finalMultiplier = ingredient.quantity / recipeGrams;
      }
    } else {
      // Multiplier-based: scale by multiplier directly
      finalMultiplier = ingredient.quantity;
    }

    return {
      kcal: recipeTotals.kcal * finalMultiplier,
      protein: recipeTotals.protein * finalMultiplier,
      fat: recipeTotals.fat * finalMultiplier,
      carbs: recipeTotals.carbs * finalMultiplier,
    };
  }

  // Check if it's a product
  const product = configData.products[ingredient.name];
  if (product) {
    const effectiveGrams = ingredient.unit === "g" ? ingredient.quantity : ingredient.quantity * 100; // 'x' unit means multiplier of 100g per unit

    const multiplier = effectiveGrams / 100; // assuming product values are per 100g
    return {
      kcal: product.kcal * multiplier,
      protein: product.protein * multiplier,
      fat: product.fat * multiplier,
      carbs: product.carbs * multiplier,
    };
  }

  // Unknown ingredient
  return { kcal: 0, protein: 0, fat: 0, carbs: 0 };
}

export function calculateMealTotals(mealName: string, configData: ConfigData, todayData: TodayData): NutritionValues {
  const meal = todayData.meals[mealName];
  if (!meal) {
    return { kcal: 0, protein: 0, fat: 0, carbs: 0 };
  }

  let totals = { kcal: 0, protein: 0, fat: 0, carbs: 0 };
  for (const ingredient of meal) {
    const ingredientTotals = calculateIngredientTotals(ingredient, configData);
    totals.kcal += ingredientTotals.kcal;
    totals.protein += ingredientTotals.protein;
    totals.fat += ingredientTotals.fat;
    totals.carbs += ingredientTotals.carbs;
  }

  return totals;
}

export function calculateRecipeTotals(recipeName: string, configData: ConfigData): NutritionValues {
  const recipe = configData.recipes[recipeName];
  if (!recipe) {
    return { kcal: 0, protein: 0, fat: 0, carbs: 0 };
  }

  let totals = { kcal: 0, protein: 0, fat: 0, carbs: 0 };
  for (const ingredient of recipe) {
    const ingredientTotals = calculateIngredientTotals(ingredient, configData);
    totals.kcal += ingredientTotals.kcal;
    totals.protein += ingredientTotals.protein;
    totals.fat += ingredientTotals.fat;
    totals.carbs += ingredientTotals.carbs;
  }

  return totals;
}
