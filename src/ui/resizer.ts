import { getElement } from "~/dom";
import { loadData, saveData } from "~/storage";

export function initResizer() {
  const separator = getElement<HTMLElement>("#separator");
  const leftPane = getElement<HTMLElement>("#left-pane");
  const rightPane = getElement<HTMLElement>("#right-pane");

  let leftFlex = 0.5;

  separator.addEventListener("mousedown", (e) => {
    document.body.style.cursor = "ew-resize";
    separator.classList.add("drag-hover");
    const interferingElements = document.querySelectorAll("textarea, input");
    interferingElements.forEach((el) => ((el as HTMLElement).style.pointerEvents = "none"));
    document.body.style.userSelect = "none";

    const startX = e.clientX;
    const startLeftWidth = leftPane.offsetWidth;

    const onMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const newLeftWidth = startLeftWidth + deltaX;

      const totalWidth = leftPane.parentElement!.offsetWidth;
      const separatorWidth = separator.offsetWidth;

      leftFlex = newLeftWidth / (totalWidth - separatorWidth);

      leftPane.style.flexGrow = leftFlex.toString();
      rightPane.style.flexGrow = (1 - leftFlex).toString();
    };

    const onMouseUp = () => {
      document.body.style.cursor = "";
      separator.classList.remove("drag-hover");
      const interferingElements = document.querySelectorAll("textarea, input");
      interferingElements.forEach((el) => ((el as HTMLElement).style.pointerEvents = "auto"));
      document.body.style.userSelect = "";

      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);

      saveData("foodie-separator", leftFlex.toString());
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  });

  const savedPosition = loadData("foodie-separator");
  if (savedPosition) {
    leftFlex = parseFloat(savedPosition);
    leftPane.style.flexGrow = leftFlex.toString();
    rightPane.style.flexGrow = (1 - leftFlex).toString();
  }
}
