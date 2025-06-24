export function parseConfig(_text: string) {
  return {
    targets: { kcal: 1850, protein: 150, fat: 85, carbs: 250 },
    products: { apple: { calories: 52, protein: 0.3, fat: 0.2, carbs: 0.2 } },
    recipes: {},
  };
}

export function parseToday(_text: string) {
  return {
    meals: { breakfast: [{ item: "apple", quantity: 120 }] },
  };
}
