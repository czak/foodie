import "./style.css";

import { parseConfig, parseToday } from "~/parser";
import { calculateTotals } from "~/calculator";
import { getElement, updateStatsPane } from "~/dom";
import { initialConfig, initialToday, saveData } from "~/data";
import { debounce } from "~/utils";

import { sun, moon } from "~/icons";

getElement<HTMLDivElement>("#app").innerHTML = `
  <div class="pane">
    <div class="tab-bar">
      <span class="tab">Config.foml</span>
    </div>

    <textarea id="config-textarea" placeholder="Your configuration" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off"></textarea>
  </div>

  <div class="separator"></div>

  <div class="pane">
    <div class="tab-bar">
      <span class="tab">Today.foml</span>
      <button class="theme-toggle" title="Toggle theme">
        ${sun}
        ${moon}
      </button>
    </div>

    <textarea id="today-textarea" placeholder="Your day" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off"></textarea>

    <div class="nutrition-stats">
      <div class="kcal-display">
        <div class="kcal-counter"><span id="kcal-total">1654</span><span class="kcal-unit">kcal</span></div>
        <div class="kcal-progress">
          <svg class="kcal-circle" viewBox="0 0 100 50">
            <path class="kcal-circle-bg" d="M 10 50 A 40 40 0 0 1 90 50" stroke-width="12" fill="none"/>
            <path id="kcal-circle-fill" class="kcal-circle-fill" d="M 10 50 A 40 40 0 0 1 90 50" stroke-width="12" fill="none" stroke-dasharray="126" stroke-dashoffset="126"/>
            <text id="kcal-percentage" x="50" y="45" text-anchor="middle" class="kcal-percentage">0%</text>
          </svg>
        </div>
      </div>

      <div class="progress">
        <span class="progress-name">Protein</span>
        <div class="progress-bar">
          <div class="progress-fill protein" style="width: 45%;"></div>
          <div class="progress-label">67.5 / 150g</div>
        </div>

        <span class="progress-name">Fat</span>
        <div class="progress-bar">
          <div class="progress-fill fat" style="width: 60%;"></div>
          <div class="progress-label">5.4 / 85g</div>
        </div>

        <span class="progress-name">Carbs</span>
        <div class="progress-bar">
          <div class="progress-fill carbs" style="width: 100%;"></div>
          <div class="progress-label">24.8 / 250g</div>
        </div>
      </div>

      <div class="breakdown-labels">
        <span class="breakdown-label"><span class="dot protein"></span>Protein: 69%</span>
        <span class="breakdown-label"><span class="dot fat"></span>Fat: 6%</span>
        <span class="breakdown-label"><span class="dot carbs"></span>Carbs: 25%</span>
      </div>

      <div class="macro-breakdown">
        <div class="macro-segment protein" style="width: 69%;"></div>
        <div class="macro-segment fat" style="width: 6%;"></div>
        <div class="macro-segment carbs" style="width: 25%;"></div>
      </div>
    </div>
  </div>
`;

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
