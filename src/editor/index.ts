import { getElement } from "~/dom";

export interface Layer {
  element: HTMLElement;
  onValueChange: (value: string) => void;
  onScroll: (scrollTop: number, scrollLeft: number) => void;

  // Is the layer meant to take over the text display
  overlay?: boolean;
}

export interface Editor {
  getValue(): string;
  setValue(value: string): void;
  addValueListener(callback: (value: string) => void): void;
  addLayer(layer: Layer): void;
  refresh(): void;
}

export function createEditor(selector: string): Editor {
  const container = getElement(selector);
  const textarea = container.querySelector("textarea");

  if (!textarea) throw new Error(`No textarea found in ${selector}`);

  const valueListeners: ((value: string) => void)[] = [];
  const scrollListeners: ((scrollTop: number, scrollLeft: number) => void)[] = [];

  textarea.addEventListener("input", () => {
    valueListeners.forEach((listener) => listener(textarea.value));
  });

  textarea.addEventListener("scroll", () => {
    scrollListeners.forEach((listener) => listener(textarea.scrollTop, textarea.scrollLeft));
  });

  return {
    getValue() {
      return textarea.value;
    },

    setValue(value: string) {
      textarea.value = value;
      valueListeners.forEach((listener) => listener(value));
    },

    addValueListener(callback) {
      valueListeners.push(callback);
    },

    addLayer(layer: Layer) {
      container.insertBefore(layer.element, textarea);
      valueListeners.push(layer.onValueChange);
      layer.onValueChange(textarea.value);
      if (layer.overlay) {
        textarea.style.color = "transparent";
      }
    },

    refresh() {
      valueListeners.forEach((listener) => listener(textarea.value));
    },
  };
}
