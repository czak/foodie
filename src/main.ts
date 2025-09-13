import "./style/main.css";
import "./style/editor.css";

import { parseConfig, parseToday, CONFIG_PATTERNS, TODAY_PATTERNS } from "~/parser";
import { calculateTotals, calculateMealTotals, calculateRecipeTotals } from "~/calculator";
import { updateStatsPane } from "~/dom";
import { initialConfig, initialToday } from "~/data";
import { saveData } from "~/storage";
import { debounce } from "~/utils";
import { initResizer, initThemeToggle, initConfigDownload } from "~/ui";
import { createEditor } from "~/editor";
import { createHighlightLayer } from "~/editor/layers/highlight";
import { createSubtotalLayer } from "~/editor/layers/subtotal";

const configEditor = createEditor("#config-editor", initialConfig);
const todayEditor = createEditor("#today-editor", initialToday);

// Initial parse & immediate update on load
let configData = parseConfig(initialConfig);
let todayData = parseToday(initialToday);
let totals = calculateTotals(configData, todayData);
updateStatsPane(totals, configData.targets);

const debouncedUpdate = debounce(() => {
  const totals = calculateTotals(configData, todayData);
  updateStatsPane(totals, configData.targets);
}, 300);

// These need to be added before the highlight layers
// because highlighting depends on up-to-date parsed configData
// for the validators.
configEditor.addValueListener((value) => {
  saveData("foodie-config", value);
  configData = parseConfig(value);
  // NOTE: Change in config requires re-highlighting and re-calculating subtotals for both panes
  todayEditor.refresh();
  debouncedUpdate();
});

todayEditor.addValueListener((value) => {
  saveData("foodie-today", value);
  todayData = parseToday(value);
  debouncedUpdate();
});

const configHighlightLayer = createHighlightLayer(CONFIG_PATTERNS, (patternName, groups) => {
  // Only highlight recipe ingredients if they represent
  // an existing product
  if (patternName == "recipeIngredient") {
    if (!groups || !groups.ingredientName) return false;
    return groups.ingredientName in configData.products;
  }
  return true;
});

const todayHighlightLayer = createHighlightLayer(TODAY_PATTERNS, (patternName, groups) => {
  // Only highlight meal ingredients if they represent
  // an existing product or recipe
  if (patternName == "mealIngredient") {
    if (!groups || !groups.ingredientName) return false;
    return groups.ingredientName in configData.products || groups.ingredientName in configData.recipes;
  }
  return true;
});

configEditor.addLayer(configHighlightLayer);
todayEditor.addLayer(todayHighlightLayer);

const recipeSubtotalLayer = createSubtotalLayer(
  (line) => CONFIG_PATTERNS.recipeHeader.exec(line)?.groups?.recipeName,
  (name) => calculateRecipeTotals(name, configData),
);

const mealSubtotalLayer = createSubtotalLayer(
  (line) => TODAY_PATTERNS.mealHeader.exec(line)?.groups?.mealName,
  (name) => calculateMealTotals(name, configData, todayData),
);

configEditor.addLayer(recipeSubtotalLayer);
todayEditor.addLayer(mealSubtotalLayer);

// Initial scroll sync to prevent scroll mismatch on refresh (Firefox specific?)
configEditor.syncScroll();
todayEditor.syncScroll();

initResizer();
initThemeToggle();
initConfigDownload();
