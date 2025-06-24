export function getElement<T extends HTMLElement>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Element not found for selector: ${selector}`);
  }
  return element;
}

export function updateStatsPane(totals: any, progress: any, targets: any) {
  console.log("Updating stats pane:", { totals, progress, targets });
}
