const STORAGE_KEY = 'revimath_k';

export function saveApiKey(key: string): void {
  try {
    const encoded = btoa(key);
    sessionStorage.setItem(STORAGE_KEY, encoded);
  } catch {
    // silently fail
  }
}

export function loadApiKey(): string {
  try {
    const encoded = sessionStorage.getItem(STORAGE_KEY);
    if (!encoded) return '';
    return atob(encoded);
  } catch {
    return '';
  }
}

export function clearApiKey(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function maskApiKey(key: string): string {
  if (key.length <= 8) return '****';
  return '****' + key.slice(-4);
}
