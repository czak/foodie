import { getElement } from "~/dom";

export function downloadText(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

export function initConfigDownload(): void {
  const downloadButton = getElement<HTMLButtonElement>("#config-download");
  const configTextarea = getElement<HTMLTextAreaElement>("#config-textarea");

  downloadButton.addEventListener("click", () => {
    const content = configTextarea.value;
    downloadText(content, "Config.foml");
  });
}
