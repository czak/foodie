import type { TodayData } from "~/types";

export const TODAY_PATTERNS = {
  mealHeader: /^\s*\[\s*(?<mealName>.+?)\s*\]\s*$/d,
  mealIngredient: /^\s*(?<ingredientName>[^*]+?)\s* \* \s*(?<quantity>\d+(?:\.\d+)?)\s*(?<unit>[gx])\s*$/d,
};

interface ParseState {
  current: "INITIAL" | "MEAL";
  currentMealName: string;
}

function parseLine(line: string, data: TodayData, state: ParseState): void {
  if (!line) return;

  tryParseMealHeader(line, data, state) || tryParseMealIngredient(line, data, state);
}

function tryParseMealHeader(line: string, data: TodayData, state: ParseState): boolean {
  const match = TODAY_PATTERNS.mealHeader.exec(line);
  if (match) {
    state.current = "MEAL";
    state.currentMealName = match.groups!.mealName;
    if (!data.meals[state.currentMealName]) {
      data.meals[state.currentMealName] = [];
    }
    return true;
  }
  return false;
}

function tryParseMealIngredient(line: string, data: TodayData, state: ParseState): boolean {
  if (state.current !== "MEAL" || !state.currentMealName) return false;

  const match = TODAY_PATTERNS.mealIngredient.exec(line);
  if (match) {
    const { ingredientName, quantity, unit } = match.groups!;
    data.meals[state.currentMealName].push({
      name: ingredientName,
      quantity: parseFloat(quantity),
      unit: unit as "g" | "x",
    });
    return true;
  }
  return false;
}

export function parseToday(text: string) {
  const data: TodayData = {
    meals: {},
  };
  const state: ParseState = { current: "INITIAL", currentMealName: "" };

  for (const line of text.split("\n")) {
    parseLine(line, data, state);
  }

  return data;
}
