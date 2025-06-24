import "./style.css";

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
    </div>

    <textarea placeholder="Your day" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off"></textarea>

    <div class="nutrition-stats">
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
  </div>
`;
