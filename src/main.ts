import "./style.css";
import { progressGauge } from "./components/progressGauge";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="pane">
    <div class="tab-bar">
      <span class="tab">Config.foml</span>
    </div>

    <textarea placeholder="Your configuration" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off"></textarea>
  </div>

  <div class="separator"></div>

  <div class="pane">
    <div class="tab-bar">
      <span class="tab">Today.foml</span>
      <button class="theme-toggle" title="Toggle theme">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.5"/>
          <path d="M8 1v2M8 13v2M15 8h-2M3 8H1M12.95 3.05L11.54 4.46M4.46 11.54L3.05 12.95M12.95 12.95L11.54 11.54M4.46 4.46L3.05 3.05" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="display: none;">
          <path d="M6 0.5C3.5 1.5 2 4 2 7c0 3.5 2.5 6.5 6 6.5 3 0 5.5-1.5 6.5-4C13 10.5 11.5 11 9.5 11 6.5 11 4 8.5 4 5.5 4 3.5 4.5 2 6 0.5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <textarea placeholder="Your day" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off"></textarea>

    <div class="nutrition-stats">
      <div class="kcal-display">
        <div class="kcal-counter">1654<span class="kcal-unit">kcal</span></div>
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
          <div class="progress-fill fat" style="width: 6%;"></div>
          <div class="progress-label">5.4 / 85g</div>
        </div>

        <span class="progress-name">Carbs</span>
        <div class="progress-bar">
          <div class="progress-fill carbs" style="width: 10%;"></div>
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
