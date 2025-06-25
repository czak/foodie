import type { ConfigData, TodayData } from "~/types";

export function calculateTotals(configData: ConfigData, todayData: TodayData) {
  let totals = { kcal: 0, protein: 0, fat: 0, carbs: 0 };

  for (const meal of Object.values(todayData.meals)) {
    for (const item of meal) {
      const itemTotals = calculateItemTotals(item, configData);
      totals.kcal += itemTotals.kcal;
      totals.protein += itemTotals.protein;
      totals.fat += itemTotals.fat;
      totals.carbs += itemTotals.carbs;
    }
  }

  return totals;
}

function calculateItemTotals(item: { item: string; quantity: number }, configData: ConfigData) {
  // Check if it's a recipe
  if (configData.recipes[item.item]) {
    let recipeTotals = { kcal: 0, protein: 0, fat: 0, carbs: 0 };
    for (const recipeItem of configData.recipes[item.item]) {
      const recipeItemTotals = calculateItemTotals(recipeItem, configData);
      recipeTotals.kcal += recipeItemTotals.kcal;
      recipeTotals.protein += recipeItemTotals.protein;
      recipeTotals.fat += recipeItemTotals.fat;
      recipeTotals.carbs += recipeItemTotals.carbs;
    }
    return {
      kcal: recipeTotals.kcal * item.quantity,
      protein: recipeTotals.protein * item.quantity,
      fat: recipeTotals.fat * item.quantity,
      carbs: recipeTotals.carbs * item.quantity,
    };
  }

  // Check if it's a product
  const product = configData.products[item.item];
  if (product) {
    const multiplier = item.quantity / 100; // assuming product values are per 100g
    return {
      kcal: product.calories * multiplier,
      protein: product.protein * multiplier,
      fat: product.fat * multiplier,
      carbs: product.carbs * multiplier,
    };
  }

  // Unknown item
  return { kcal: 0, protein: 0, fat: 0, carbs: 0 };
}

export function calculateProgress(_totals: any, _targets: any) {
  return {
    kcal: 89,
    protein: 45,
    fat: 6,
    carbs: 10,
  };
}
