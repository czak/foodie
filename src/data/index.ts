const defaultConfig = `# Set your daily goals
[targets]
kcal = 1850
protein = 150
fat = 85
carbs = 250

# Keep your foods database
# Format: kcal, protein, fat, carbs (per 100g)
[products]
apple = 52, 0.3, 0.2, 14
avocado = 160, 2, 15, 8.5
chicken breast = 165, 31, 3.6, 0
greek yogurt = 97, 10, 5, 3.6
protein powder = 380, 80, 5, 5

# Define combinations you eat often
[recipes.Yogurt with apple]
greek yogurt * 150g
apple * 80g

[recipes.Protein smoothie]
greek yogurt * 200g
apple * 120g
protein powder * 30g
`;

const defaultToday = `# Plan your meals for the day
[breakfast]
Yogurt with apple * 345g

[lunch]
chicken breast * 150g
avocado * 50g

[dinner]
Protein smoothie * 350g
`;

export function loadData(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function saveData(key: string, data: string): void {
  try {
    localStorage.setItem(key, data);
  } catch {
    // We ain't got no localStorage
  }
}

export function removeData(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // We still ain't got no localStorage
  }
}

export const initialConfig = loadData("foodie-config") || defaultConfig;
export const initialToday = loadData("foodie-today") || defaultToday;
