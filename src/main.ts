import "./style/main.css";
import "./style/editor.css";

import { parseConfig, parseToday } from "~/parser";
import { calculateTotals } from "~/calculator";
import { getElement, updateStatsPane } from "~/dom";
import { initialConfig, initialToday, saveData } from "~/data";
import { debounce } from "~/utils";
import { initResizer } from "~/ui";

const configTextarea = getElement<HTMLTextAreaElement>("#config-textarea");
const todayTextarea = getElement<HTMLTextAreaElement>("#today-textarea");

configTextarea.value = initialConfig;
todayTextarea.value = initialToday;

const update = () => {
  const configText = configTextarea.value;
  const todayText = todayTextarea.value;

  const configData = parseConfig(configText);
  const todayData = parseToday(todayText);

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
