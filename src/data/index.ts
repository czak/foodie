const defaultConfig = `[targets]
kcal = 1850
protein = 150
fat = 85
carbs = 250

[products]
apple = 52, 0.3, 0.2, 14
avocado = 160, 2, 15, 8.5
chicken breast = 165, 31, 3.6, 0
greek yogurt = 97, 10, 5, 3.6
protein powder = 380, 80, 5, 5

[recipes.Yogurt with apple]
greek yogurt * 150
apple * 80

[recipes.Protein smoothie]
greek yogurt * 200
apple * 120
protein powder * 30
`;

const defaultToday = `[breakfast]
Yogurt with apple * 1.5

[lunch]
chicken breast * 150
avocado * 50

[dinner]
Protein smoothie * 1
`;

// localStorage utility functions
function getStoredData(key: string, fallback: string): string {
  try {
    const stored = localStorage.getItem(key);
    return stored !== null ? stored : fallback;
  } catch {
    return fallback;
  }
}

export function saveData(key: string, data: string): void {
  try {
    localStorage.setItem(key, data);
  } catch {
    // Silently fail if localStorage is not available
  }
}

// Export initial data that checks localStorage first
export const initialConfig = getStoredData("foodie-config", defaultConfig);
export const initialToday = getStoredData("foodie-today", defaultToday);
