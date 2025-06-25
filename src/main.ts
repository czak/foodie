import "./style.css";

import { parseConfig, parseToday } from "~/parser";
import { calculateTotals, calculateProgress } from "~/calculator";
import { getElement, updateStatsPane } from "~/dom";

import { progressGauge } from "~/components";
import { sun, moon } from "~/icons";

function update() {
  console.log("=== Update Triggered ===");

  const configText = getElement<HTMLTextAreaElement>("#config-textarea").value;
  const todayText = getElement<HTMLTextAreaElement>("#today-textarea").value;

  const configData = parseConfig(configText);
  const todayData = parseToday(todayText);

  const totals = calculateTotals(configData, todayData);
  const progress = calculateProgress(totals, configData.targets);

  updateStatsPane(totals, progress, configData.targets);

  console.log("=== Update Complete ===");
}

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
          ${progressGauge(80)}
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

const configTextarea = getElement("#config-textarea");
const todayTextarea = getElement("#today-textarea");

configTextarea.addEventListener("input", update);
todayTextarea.addEventListener("input", update);

update();
