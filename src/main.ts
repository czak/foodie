import "./style/main.css";
import "./style/editor.css";

import { parseConfig, parseToday, CONFIG_PATTERNS, TODAY_PATTERNS } from "~/parser";
import { calculateTotals } from "~/calculator";
import { getElement, updateStatsPane } from "~/dom";
import { initialConfig, initialToday, saveData } from "~/data";
import { debounce } from "~/utils";
import { initHighlighter, initResizer, initThemeToggle } from "~/ui";

const configTextarea = getElement<HTMLTextAreaElement>("#config-textarea");
const todayTextarea = getElement<HTMLTextAreaElement>("#today-textarea");

configTextarea.value = initialConfig;
todayTextarea.value = initialToday;

const update = () => {
  const configData = parseConfig(configTextarea.value);
  const todayData = parseToday(todayTextarea.value);

  const totals = calculateTotals(configData, todayData);

  updateStatsPane(totals, configData.targets);
};

const debouncedUpdate = debounce(update, 300);

configTextarea.addEventListener("input", () => {
  saveData("foodie-config", configTextarea.value);
  debouncedUpdate();
});
todayTextarea.addEventListener("input", () => {
  saveData("foodie-today", todayTextarea.value);
  debouncedUpdate();
});

update();

initResizer();
initHighlighter(configTextarea, CONFIG_PATTERNS);
initHighlighter(todayTextarea, TODAY_PATTERNS);
initThemeToggle();
