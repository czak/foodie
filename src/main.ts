import "./style.css";

import { parseConfig, parseToday } from "~/parser";
import { calculateTotals } from "~/calculator";
import { getElement, updateStatsPane } from "~/dom";
import { initialConfig, initialToday, saveData } from "~/data";
import { debounce } from "~/utils";

const configTextarea = getElement<HTMLTextAreaElement>("#config-textarea");
const todayTextarea = getElement<HTMLTextAreaElement>("#today-textarea");

configTextarea.value = initialConfig;
todayTextarea.value = initialToday;

const update = debounce(() => {
  const configText = configTextarea.value;
  const todayText = configTextarea.value;

  const configData = parseConfig(configText);
  const todayData = parseToday(todayText);

  const totals = calculateTotals(configData, todayData);

  updateStatsPane(totals, configData.targets);
}, 300);

configTextarea.addEventListener("input", () => {
  saveData("foodie-config", configTextarea.value);
  update();
});
todayTextarea.addEventListener("input", () => {
  saveData("foodie-today", todayTextarea.value);
  update();
});

update();
