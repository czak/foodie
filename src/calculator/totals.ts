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
  if (configData.recipes[ingredient.item]) {
    let recipeTotals = { kcal: 0, protein: 0, fat: 0, carbs: 0 };
    for (const recipeIngredient of configData.recipes[ingredient.item]) {
      const recipeIngredientTotals = calculateIngredientTotals(recipeIngredient, configData);
      recipeTotals.kcal += recipeIngredientTotals.kcal;
      recipeTotals.protein += recipeIngredientTotals.protein;
      recipeTotals.fat += recipeIngredientTotals.fat;
      recipeTotals.carbs += recipeIngredientTotals.carbs;
    }
    return {
      kcal: recipeTotals.kcal * ingredient.quantity,
      protein: recipeTotals.protein * ingredient.quantity,
      fat: recipeTotals.fat * ingredient.quantity,
      carbs: recipeTotals.carbs * ingredient.quantity,
    };
  }

  // Check if it's a product
  const product = configData.products[ingredient.item];
  if (product) {
    const multiplier = ingredient.quantity / 100; // assuming product values are per 100g
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
