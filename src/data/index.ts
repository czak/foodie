import { loadData } from "~/storage";

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

# Whitespace around names is ignored, it's up to you
[recipes.Protein smoothie  ]
greek yogurt    *  200g
apple           *  120g
protein powder  *   30g
`;

const defaultToday = `# Plan your meals for the day
# Use * 150g for weight or * 1x for full portions
[breakfast]
Yogurt with apple * 1x
greek yogurt * 50g

[lunch]
chicken breast * 150g
avocado * 50g

[dinner]
Protein smoothie * 1x

[snack]
Trail mix * 50g

# ^ ingredient not recognized, so not highlighted
`;

export const initialConfig = loadData("foodie-config") || defaultConfig;
export const initialToday = loadData("foodie-today") || defaultToday;
