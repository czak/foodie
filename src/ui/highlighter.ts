function escapeHtml(s: string) {
  // prettier-ignore
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// A match must pass validation to be highlighted,
// otherwise it's resturned as plain text.
export type Validator = (patternName: string, groups: Record<string, string | undefined> | undefined) => boolean;

export function highlightLine(line: string, patterns: Record<string, RegExp>, validator: Validator): string {
  for (const [patternName, regex] of Object.entries(patterns)) {
    if (!regex.hasIndices) {
      throw new Error(`Pattern '${patternName}' must use the /d flag`);
    }

    const match = regex.exec(line);

    if (!match) {
      continue;
    }

    if (!validator(patternName, match.groups)) {
      return escapeHtml(line);
    }

    let html = "";
    let lastIndex = 0;
    const groups: { name: string; start: number; end: number }[] = [];

    // Collect named capture group indices
    if (match.indices && match.indices.groups) {
      for (const groupName in match.indices.groups) {
        const [start, end] = match.indices.groups[groupName];
        groups.push({ name: groupName, start, end });
      }
    }

    // Sort groups by start position to process them in order
    groups.sort((a, b) => a.start - b.start);

    for (const group of groups) {
      // Plain text before the current group
      if (group.start > lastIndex) {
        html += escapeHtml(line.substring(lastIndex, group.start));
      }

      // Highlighted group
      html += `<span class="highlight-${group.name}">${escapeHtml(line.substring(group.start, group.end))}</span>`;
      lastIndex = group.end;
    }

    // Remaining plain text after the last group
    if (lastIndex < line.length) {
      html += escapeHtml(line.substring(lastIndex, line.length));
    }

    // Wrap the entire line's content in a div with the pattern's class
    return `<span class="highlight-${patternName}">${html}</span>`;
  }

  // If no pattern matched the entire line, return the escaped original line
  return escapeHtml(line);
}

export function initHighlighter(textarea: HTMLTextAreaElement, patterns: Record<string, RegExp>, validator: Validator): () => void {
  // Create the highlight layer element in DOM
  const highlightLayer = document.createElement("pre");
  highlightLayer.className = "editor-highlight";
  textarea.parentElement!.insertBefore(highlightLayer, textarea);

  const highlight = () => {
    highlightLayer.innerHTML = (textarea.value + "\n")
      .split("\n")
      .map((line) => highlightLine(line, patterns, validator))
      .join("\n");
  };

  // Synchronize scroll position with the highlight layer
  textarea.addEventListener("scroll", () => {
    highlightLayer.scrollTop = textarea.scrollTop;
    highlightLayer.scrollLeft = textarea.scrollLeft;
  });

  // Trigger initial highlight
  highlight();

  // Highlight layer is present, we can hide textarea text
  textarea.style.color = "transparent";

  return highlight;
}
