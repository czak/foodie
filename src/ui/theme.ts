import { getElement } from "~/dom";

export function initThemeToggle(): void {
  const themeToggle = getElement<HTMLButtonElement>("#theme-toggle");
  const sunIcon = getElement<SVGElement>("#sun-icon");
  const moonIcon = getElement<SVGElement>("#moon-icon");

  function updateThemeIcon() {
    const isDark = document.documentElement.classList.contains("dark");

    if (isDark) {
      moonIcon.style.display = "block";
      sunIcon.style.display = "none";
    } else {
      sunIcon.style.display = "block";
      moonIcon.style.display = "none";
    }
  }

  updateThemeIcon();

  themeToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    updateThemeIcon();
  });
}
