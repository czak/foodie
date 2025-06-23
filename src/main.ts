import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="pane">
    <div class="tab-bar">
      <span class="tab">Config</span>
    </div>

    <textarea placeholder="Your configuration" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off"></textarea>
  </div>

  <div class="separator"></div>

  <div class="pane">
    <div class="tab-bar">
      <span class="tab">Today</span>
    </div>

    <textarea placeholder="Your day" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off"></textarea>

    <div class="nutrition-stats"></div>
  </div>
`;
