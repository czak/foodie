import type { TodayData } from "~/types";

const TODAY_PATTERNS = {
  mealHeader: /^\[(?<mealName>.+)\]$/d,
  mealItem: /^(?<itemName>[^*]+?) \* (?<quantity>\d+(?:\.\d+)?)$/d,
};

interface ParseState {
  current: "INITIAL" | "MEAL";
  currentMealName: string;
}

function parseLine(line: string, data: TodayData, state: ParseState): void {
  if (!line) return;

  tryParseMealHeader(line, data, state) || tryParseMealItem(line, data, state);
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

function tryParseMealItem(line: string, data: TodayData, state: ParseState): boolean {
  if (state.current !== "MEAL" || !state.currentMealName) return false;

  const match = TODAY_PATTERNS.mealItem.exec(line);
  if (match) {
    const { itemName, quantity } = match.groups!;
    data.meals[state.currentMealName].push({
      item: itemName,
      quantity: parseFloat(quantity),
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
