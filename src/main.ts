import "./style/main.css";
import "./style/editor.css";

import { parseConfig, parseToday, CONFIG_PATTERNS, TODAY_PATTERNS } from "~/parser";
import { calculateTotals } from "~/calculator";
import { getElement, updateStatsPane } from "~/dom";
import { initialConfig, initialToday } from "~/data";
import { saveData } from "~/storage";
import { debounce } from "~/utils";
import { initHighlighter, initResizer, initThemeToggle } from "~/ui";

const configTextarea = getElement<HTMLTextAreaElement>("#config-textarea");
const todayTextarea = getElement<HTMLTextAreaElement>("#today-textarea");

configTextarea.value = initialConfig;
todayTextarea.value = initialToday;

// Initial parse & immediate update on load
let configData = parseConfig(configTextarea.value);
let todayData = parseToday(todayTextarea.value);
let totals = calculateTotals(configData, todayData);
updateStatsPane(totals, configData.targets);

const debouncedUpdate = debounce(() => {
  const totals = calculateTotals(configData, todayData);
  updateStatsPane(totals, configData.targets);
}, 300);

configTextarea.addEventListener("input", () => {
  saveData("foodie-config", configTextarea.value);
  configData = parseConfig(configTextarea.value);
  debouncedUpdate();
});

todayTextarea.addEventListener("input", () => {
  saveData("foodie-today", todayTextarea.value);
  todayData = parseToday(todayTextarea.value);
  debouncedUpdate();
});

initHighlighter(configTextarea, CONFIG_PATTERNS, (patternName, groups) => {
  // Only highlight recipe ingredients if they represent
  // an existing product
  if (patternName == "recipeIngredient") {
    if (!groups || !groups.ingredientName) return false;
    return groups.ingredientName in configData.products;
  }
  return true;
});

initHighlighter(todayTextarea, TODAY_PATTERNS, (patternName, groups) => {
  // Only highlight meal ingredients if they represent
  // an existing product OR recipe
  if (patternName == "mealIngredient") {
    if (!groups || !groups.ingredientName) return false;
    return groups.ingredientName in configData.products || groups.ingredientName in configData.recipes;
  }
  return true;
});

initResizer();
initThemeToggle();
