function escapeHtml(s: string) {
  // prettier-ignore
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function highlightLine(line: string, patterns: Record<string, RegExp>): string {
  for (const patternName in patterns) {
    const regex = patterns[patternName];
    const match = regex.exec(line);

    // Check if the regex matched the entire line (from start to end)
    if (match && match.index === 0 && match[0].length === line.length) {
      let resultHtml = "";
      let lastIndex = 0;

      // Collect named capture group indices
      const groupIndices: { name: string; start: number; end: number }[] = [];
      if (match.indices && match.indices.groups) {
        for (const groupName in match.indices.groups) {
          const [start, end] = match.indices.groups[groupName];
          groupIndices.push({ name: groupName, start, end });
        }
      }

      // Sort group indices by their start position to process them in order
      groupIndices.sort((a, b) => a.start - b.start);

      for (const group of groupIndices) {
        // Add plain text before the current group
        if (group.start > lastIndex) {
          resultHtml += escapeHtml(line.substring(lastIndex, group.start));
        }
        // Add the highlighted group
        resultHtml += `<span class="highlight-${group.name}">${escapeHtml(line.substring(group.start, group.end))}</span>`;
        lastIndex = group.end;
      }

      // Add any remaining plain text after the last group
      if (lastIndex < line.length) {
        resultHtml += escapeHtml(line.substring(lastIndex, line.length));
      }

      // Wrap the entire line's content in a div with the pattern's class
      return `<span class="highlight-${patternName}">${resultHtml}</span>`;
    }
  }

  // If no pattern matched the entire line, return the escaped original line
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
