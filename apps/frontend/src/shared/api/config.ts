export function getApiBaseUrl() {
  return (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/+$/, "");
}

export function hasApiBaseUrl() {
  return getApiBaseUrl().length > 0;
}

export function canUseDevFixtures() {
  return import.meta.env.DEV && !hasApiBaseUrl();
}
