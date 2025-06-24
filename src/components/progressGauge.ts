export function progressGauge(percentage: number): string {
  // Half circumference of radius 40: pi * 40 ~= 126
  const circumference = 126;
  const offset = circumference - (percentage / 100) * circumference;

  return `
    <svg class="kcal-circle" viewBox="0 0 100 50">
      <path class="kcal-circle-bg" d="M 10 50 A 40 40 0 0 1 90 50" stroke-width="12" fill="none"/>
      <path class="kcal-circle-fill" d="M 10 50 A 40 40 0 0 1 90 50" stroke-width="12" fill="none" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"/>
      <text x="50" y="45" text-anchor="middle" class="kcal-percentage">${percentage}%</text>
    </svg>
  `;
}
