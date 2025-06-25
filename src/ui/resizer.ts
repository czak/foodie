import { getElement } from "~/dom";

export function initResizer() {
  const separator = getElement<HTMLElement>("#separator");
  const leftPane = getElement<HTMLElement>("#left-pane");
  const rightPane = getElement<HTMLElement>("#right-pane");

  let isResizing = false;

  separator.addEventListener("mousedown", (e) => {
    isResizing = true;
    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";

    const startX = e.clientX;
    const startLeftWidth = leftPane.offsetWidth;

    const onMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const deltaX = e.clientX - startX;
      const newLeftWidth = startLeftWidth + deltaX;

      const totalWidth = leftPane.parentElement!.offsetWidth;
      const separatorWidth = separator.offsetWidth;

      const leftFlex = newLeftWidth / (totalWidth - separatorWidth);
      const rightFlex = 1 - leftFlex;

      leftPane.style.flexGrow = leftFlex.toString();
      rightPane.style.flexGrow = rightFlex.toString();
    };

    const onMouseUp = () => {
      isResizing = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  });
}
