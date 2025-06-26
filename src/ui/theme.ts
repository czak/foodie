import { getElement } from "~/dom";
import { loadData, saveData, removeData } from "~/data";

type Theme = "light" | "dark" | "auto";

export function initThemeToggle(): void {
  const toggle = getElement<HTMLButtonElement>("#theme-toggle");
  const icons = {
    light: getElement<SVGElement>("#sun-icon"),
    dark: getElement<SVGElement>("#moon-icon"),
    auto: getElement<SVGElement>("#auto-icon"),
  };

  // FIXME: Check for valid value in storage
  let current: Theme = (loadData("foodie-theme") as Theme) || "auto";

  // light -> dark -> auto -> light -> ...
  function next(current: Theme): Theme {
    if (current === "light") return "dark";
    if (current === "dark") return "auto";
    return "light";
  }

  function apply(theme: Theme): void {
    if (theme === "auto") {
      document.documentElement.removeAttribute("data-theme");
      removeData("foodie-theme");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
      saveData("foodie-theme", theme);
    }
  }

  function updateIcon(theme: Theme): void {
    icons.light.style.display = "none";
    icons.dark.style.display = "none";
    icons.auto.style.display = "none";

    icons[theme].style.display = "block";
  }

  apply(current);
  updateIcon(current);

  toggle.addEventListener("click", () => {
    current = next(current);
    apply(current);
    updateIcon(current);
  });
}
