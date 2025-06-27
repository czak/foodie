export function loadData(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function saveData(key: string, data: string): void {
  try {
    localStorage.setItem(key, data);
  } catch {
    // We ain't got no localStorage
  }
}

export function removeData(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // We still ain't got no localStorage
  }
}
