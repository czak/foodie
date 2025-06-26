function escapeHtml(s: string) {
  // prettier-ignore
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function highlightLine(line: string, _patterns: Record<string, RegExp>): string {
  // TODO: Implement highlighting based on input patterns
  return escapeHtml(line);
}

export function initHighlighter(textarea: HTMLTextAreaElement, patterns: Record<string, RegExp>) {
  // Create the highlight layer element in DOM
  const highlightLayer = document.createElement("pre");
  highlightLayer.className = "editor-highlight";
  textarea.parentElement!.insertBefore(highlightLayer, textarea);

  const highlight = () => {
    highlightLayer.innerHTML = textarea.value
      .split("\n")
      .map((line) => highlightLine(line, patterns))
      .join("\n");
  };

  // Highlight on input
  textarea.addEventListener("input", highlight);

  // Synchronize scroll position with the highlight layer
  textarea.addEventListener("scroll", () => {
    highlightLayer.scrollTop = textarea.scrollTop;
    highlightLayer.scrollLeft = textarea.scrollLeft;
  });

  // Trigger initial highlight
  highlight();

  // Highlight layer is present, we can hide textarea text
  textarea.style.color = "transparent";
}
