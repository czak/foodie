export function calculateTotals(_configData: any, _todayData: any) {
  return {
    kcal: 1654,
    protein: 67.5,
    fat: 5.4,
    carbs: 24.8,
  };
}

export function calculateProgress(_totals: any, _targets: any) {
  return {
    kcal: 89,
    protein: 45,
    fat: 6,
    carbs: 10,
  };
}
