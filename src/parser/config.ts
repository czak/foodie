import type { ConfigData } from "~/types";

const CONFIG_PATTERNS = {
  targetsHeader: /^\[targets\]$/d,
  targetValue: /^(?<key>kcal|protein|fat|carbs) = (?<value>\d+)$/d,

  productsHeader: /^\[products\]$/d,
  productDefinition: /^(?<productName>.+?) = (?<calories>\d+(?:\.\d+)?), (?<protein>\d+(?:\.\d+)?), (?<fat>\d+(?:\.\d+)?), (?<carbs>\d+(?:\.\d+)?)$/d,

  recipeHeader: /^\[recipes\.(?<recipeName>.+)\]$/d,
  recipeItem: /^(?<itemName>.+?) \* (?<quantity>\d+(?:\.\d+)?)$/d,
};

interface ParseState {
  current: "INITIAL" | "TARGETS" | "PRODUCTS" | "RECIPE";
  currentRecipeName: string;
}

function parseLine(line: string, config: ConfigData, state: ParseState): void {
  if (!line) return;

  tryParseTargetsHeader(line, state) ||
    tryParseTargetValue(line, config, state) ||
    tryParseProductsHeader(line, state) ||
    tryParseProductDefinition(line, config, state) ||
    tryParseRecipeHeader(line, config, state) ||
    tryParseRecipeItem(line, config, state);
}

function tryParseTargetsHeader(line: string, state: ParseState): boolean {
  if (CONFIG_PATTERNS.targetsHeader.test(line)) {
    state.current = "TARGETS";
    return true;
  }
  return false;
}

function tryParseTargetValue(line: string, config: ConfigData, state: ParseState): boolean {
  if (state.current !== "TARGETS") return false;

  const match = CONFIG_PATTERNS.targetValue.exec(line);
  if (match) {
    const { key, value } = match.groups!;
    config.targets[key as keyof typeof config.targets] = parseInt(value);
    return true;
  }
  return false;
}

function tryParseProductsHeader(line: string, state: ParseState): boolean {
  if (CONFIG_PATTERNS.productsHeader.test(line)) {
    state.current = "PRODUCTS";
    return true;
  }
  return false;
}

function tryParseProductDefinition(line: string, config: ConfigData, state: ParseState): boolean {
  if (state.current !== "PRODUCTS") return false;

  const match = CONFIG_PATTERNS.productDefinition.exec(line);
  if (match) {
    const { productName, calories, protein, fat, carbs } = match.groups!;
    if (!config.products[productName]) {
      config.products[productName] = {
        calories: parseFloat(calories),
        protein: parseFloat(protein),
        fat: parseFloat(fat),
        carbs: parseFloat(carbs),
      };
    }
    return true;
  }
  return false;
}

function tryParseRecipeHeader(line: string, config: ConfigData, state: ParseState): boolean {
  const match = CONFIG_PATTERNS.recipeHeader.exec(line);
  if (match) {
    state.current = "RECIPE";
    state.currentRecipeName = match.groups!.recipeName;
    if (!config.recipes[state.currentRecipeName]) {
      config.recipes[state.currentRecipeName] = [];
    }
    return true;
  }
  return false;
}

function tryParseRecipeItem(line: string, config: ConfigData, state: ParseState): boolean {
  if (state.current !== "RECIPE" || !state.currentRecipeName) return false;

  const match = CONFIG_PATTERNS.recipeItem.exec(line);
  if (match) {
    const { itemName, quantity } = match.groups!;
    config.recipes[state.currentRecipeName].push({
      item: itemName,
      quantity: parseFloat(quantity),
    });
    return true;
  }
  return false;
}

export function parseConfig(text: string): ConfigData {
  const config = {
    targets: { kcal: 0, protein: 0, fat: 0, carbs: 0 },
    products: {},
    recipes: {},
  };
  const state: ParseState = { current: "INITIAL", currentRecipeName: "" };

  for (const line of text.split("\n")) {
    parseLine(line, config, state);
  }

  return config;
}
