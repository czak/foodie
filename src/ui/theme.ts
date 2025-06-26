import { getElement } from "~/dom";
import { loadData, saveData, removeData } from "~/data";

type Theme = "auto" | "light" | "dark";

export function initThemeToggle(): void {
  const toggle = getElement<HTMLButtonElement>("#theme-toggle");
  const icons = {
    auto: getElement<SVGElement>("#auto-icon"),
    light: getElement<SVGElement>("#light-icon"),
    dark: getElement<SVGElement>("#dark-icon"),
  };

  // FIXME: Check for valid value in storage
  let current: Theme = (loadData("foodie-theme") as Theme) || "auto";

  // auto -> light -> dark -> auto -> light -> ...
  function next(current: Theme): Theme {
    if (current === "auto") return "light";
    if (current === "light") return "dark";
    return "auto";
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
    icons.auto.style.display = "none";
    icons.light.style.display = "none";
    icons.dark.style.display = "none";

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
