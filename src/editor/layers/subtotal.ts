import type { NutritionValues } from "~/types";

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export function overlayLine(line: string, extractName: (line: string) => string | undefined, calculateTotals: (groupName: string) => NutritionValues): string {
  const groupName = extractName(line);
  const escapedLine = escapeHtml(line);

  if (!groupName) {
    return `<span class="subtotal-transparent">${escapedLine}</span>`;
  }

  const totals = calculateTotals(groupName);
  const subtotalNumbers = `${Math.round(totals.kcal)}, ${Math.round(totals.protein)}, ${Math.round(totals.fat)}, ${Math.round(totals.carbs)}`;
  return `<span class="subtotal-transparent">${escapedLine}</span> <span class="subtotal-numbers">${subtotalNumbers}</span>`;
}

export function createSubtotalLayer(extractName: (line: string) => string | undefined, calculateTotals: (groupName: string) => NutritionValues) {
  const overlay = document.createElement("pre");
  overlay.className = "editor-subtotal";

  return {
    element: overlay,
    overlay: false,

    onValueChange(value: string) {
      overlay.innerHTML = (value + "\n")
        .split("\n")
        .map((line) => overlayLine(line, extractName, calculateTotals))
        .join("\n");
    },

    onScroll(scrollTop: number, scrollLeft: number) {
      overlay.scrollTop = scrollTop;
      overlay.scrollLeft = scrollLeft;
    },
  };
}
