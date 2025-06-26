export function initHighlighter(_textarea: HTMLTextAreaElement, _patterns: Record<string, RegExp>) {
  // 1. Insert <pre class="editor-highlight"></pre>
  //    as sibling of textarea
  // 2. Define `highlight` function which constructs HTML
  //    to put into the editor-highlight layer
  //    (consider safe HTML insertion)
  // 3. Add event handler: on `input` call `highlight`
  // 4. Add event handler: on `scroll` match scroll position
  // 5. Trigger initial highlight
  // 6. Hide text in the textarea
}
