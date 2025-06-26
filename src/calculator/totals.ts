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
    for (const recipeIngredient of configData.recipes[ingredient.name]) {
      const product = configData.products[recipeIngredient.name];
      if (product) {
        const multiplier = recipeIngredient.grams / 100;
        recipeTotals.kcal += product.kcal * multiplier;
        recipeTotals.protein += product.protein * multiplier;
        recipeTotals.fat += product.fat * multiplier;
        recipeTotals.carbs += product.carbs * multiplier;
      }
    }
    return {
      kcal: recipeTotals.kcal * ingredient.grams,
      protein: recipeTotals.protein * ingredient.grams,
      fat: recipeTotals.fat * ingredient.grams,
      carbs: recipeTotals.carbs * ingredient.grams,
    };
  }

  // Check if it's a product
  const product = configData.products[ingredient.name];
  if (product) {
    const multiplier = ingredient.grams / 100; // assuming product values are per 100g
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
