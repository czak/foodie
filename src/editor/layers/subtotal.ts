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
  const kcal = Math.round(totals.kcal);
  const protein = Math.round(totals.protein);
  const fat = Math.round(totals.fat);
  const carbs = Math.round(totals.carbs);
  const subtotalNumbers = `<span class="subtotal-block"><span class="subtotal-kcal">${kcal}</span><span class="subtotal-protein">${protein}</span><span class="subtotal-fat">${fat}</span><span class="subtotal-carbs">${carbs}</span></span>`;
  return `<span class="subtotal-transparent">${escapedLine}</span> ${subtotalNumbers}`;
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
